import 'https://deno.land/x/xhr@0.3.0/mod.ts';
import axiod from 'https://deno.land/x/axiod/mod.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { Kobble } from 'https://deno.land/x/kobble_admin@v1.4.8/index.ts';

/**
 * Required to call this functions from a browser.
 */
export const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	// Important: add kobble-authorization to the allowed headers.
	'Access-Control-Allow-Headers': 'authorization, kobble-authorization, x-client-info, apikey, content-type'
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
	 * This header is passed from our frontend to authenticate the Kobble User.
	 * It differs from the Supabase Token.
	 */
	const Authorization = req.headers.get('Kobble-Authorization');
	const token = Authorization?.split('Bearer ')[1];

	/**
	 * We use Kobble to verify the token and get the userId
	 */
	const kobble = new Kobble(Deno.env.get('KOBBLE_SECRET_KEY'));
	const { userId } = await kobble.auth.verifyAccessToken(token!);

	/**
	 * We use Dezgo API to generate the image.
	 */
	const { prompt } = await req.json();

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

	/**
	 * Once we get the image, we upload it to Supabase Storage
	 * and save the URL in the Images table.
	 */
	const imageBuffer = response.data as ArrayBuffer;
	const timestamp = +new Date();
	const uploadName = `image-${timestamp}.png`;
	const { data: upload, error: uploadError } = await supabaseClient.storage.from('images').upload(uploadName, imageBuffer, {
		contentType: 'image/png',
		cacheControl: '3600',
		upsert: false
	});

	if (uploadError) {
		throw uploadError;
	}

	const tenYears = 60 * 60 * 24 * 365 * 10;
	const { data: url } = await supabaseClient.storage.from('images').createSignedUrl(uploadName, tenYears);

	const { signedUrl } = url;

	const { data: imageSaved } = await supabaseClient
		.from('Images')
		.insert({
			user_id: userId,
			url: signedUrl,
			created_at: new Date().toISOString()
		})
		.select();

	/**
	 * Once the image is saved, we return the URL to the frontend.
	 */
	return new Response(JSON.stringify(imageSaved), {
		headers: {
			'Content-Type': 'application/json',
			...corsHeaders
		}
	});
});
