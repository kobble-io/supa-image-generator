import 'https://deno.land/x/xhr@0.3.0/mod.ts';
import axiod from 'https://deno.land/x/axiod/mod.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { Kobble } from 'https://deno.land/x/kobble_admin@v2.0.0/index.ts';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Required to call this functions from a browser.
 */
const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	// Important: add kobble-authorization to the allowed headers.
	'Access-Control-Allow-Headers': 'authorization, kobble-authorization, x-client-info, apikey, content-type'
};

const generateImage = async (prompt: string) => {
	const apiKey = Deno.env.get('DEZGO_API_KEY');

	if (!apiKey) {
		throw new Error('DEZGO_API_KEY is not set. Please set it in your environment variables. You can get it from https://dezgo.com/');
	}

	const response = await axiod.post(
		'https://api.dezgo.com/text2image',
		{
			prompt,
			width: 320,
			height: 320,
			model: '0001softrealistic_v187'
		},
		{
			responseType: 'arraybuffer',
			headers: {
				'x-dezgo-key': `${Deno.env.get('DEZGO_API_KEY')}`
			}
		}
	);

	return response.data as ArrayBuffer;
};

const persistImage = async (supabaseClient: SupabaseClient, imageBuffer: ArrayBuffer, userId: string) => {
	const timestamp = +new Date();
	const uploadName = `image-${timestamp}.png`;
	const { error: uploadError } = await supabaseClient.storage.from('images').upload(uploadName, imageBuffer, {
		contentType: 'image/png',
		cacheControl: '3600',
		upsert: false
	});

	if (uploadError) {
		throw uploadError;
	}

	const tenYears = 60 * 60 * 24 * 365 * 10;
	const { data: url } = await supabaseClient.storage.from('images').createSignedUrl(uploadName, tenYears);

	if (!url) {
		throw new Error('Image not found');
	}

	const { data: imageSaved } = await supabaseClient
		.from('Images')
		.insert({
			user_id: userId,
			url: url.signedUrl,
			created_at: new Date().toISOString()
		})
		.select();

	return imageSaved;
};

Deno.serve(async (req: Request) => {
	/**
	 * Required to call this functions from a browser.
	 */
	if (req.method === 'OPTIONS') {
		return new Response('ok', { headers: corsHeaders });
	}

	/**
	 * Instantiate the Supabase client with the service role key
	 * This key is available by default in the environment variables.
	 * We need to create the correct RLS policies in supabase to allow this function to work.
	 */
	const supabaseClient = createClient(
		// Supabase API URL - env var exported by default.
		Deno.env.get('SUPABASE_URL')!,
		// Supabase API ANON KEY - env var exported by default.
		Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
	);

	/**
	 * Instantiate the Kobble admin SDK with the secret key
	 * You can generate a secret key in the Kobble Admin Dashboard.
	 */
	const kobble = new Kobble(Deno.env.get('KOBBLE_SECRET_KEY')!);

	/**
	 * This header is passed from our frontend to authenticate the Kobble User.
	 * It differs from the Supabase Token.
	 * We could also use the Supabase token to authenticate the user but using Kobble is more convenient here.
	 */
	const Authorization = req.headers.get('Kobble-Authorization');
	const token = Authorization?.split('Bearer ')[1];

	const { userId } = await kobble.auth.verifyAccessToken(token!);

	/**
	 * We use the Kobble SDK to verify that the user has remaining quota for
	 * the image-generated feature based on their subscription.
	 * If the user has no remaining quota, we return an error.
	 */
	const hasRemainingQuota = await kobble.users.hasRemainingQuota(userId, 'image-generated');

	if (!hasRemainingQuota) {
		return new Response(JSON.stringify({ error: 'Quota exceeded' }), {
			headers: {
				'Content-Type': 'application/json',
				...corsHeaders
			},
			status: 403
		});
	}

	/**
	 * We generate the image using the prompt passed in the request body.
	 * Then we store it on supabase storage and database.
	 */
	const { prompt } = await req.json();
	const imageBuffer = await generateImage(prompt);
	const imageSaved = await persistImage(supabaseClient, imageBuffer, userId);

	/**
	 * Finally we increment the usage of the user for the image-generated feature.
	 */
	await kobble.users.incrementQuotaUsage(userId, 'image-generated');

	return new Response(JSON.stringify(imageSaved), {
		headers: {
			'Content-Type': 'application/json',
			...corsHeaders
		}
	});
});
