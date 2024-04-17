import { FC, useEffect, useState, ReactNode } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseContext } from './SupabaseContext.tsx';
import { useKobble } from '@kobbleio/react';

export type SupabaseProviderProps = {
	url: string;
	apiKey: string;
};

export const SupabaseProvider: FC<{ children: ReactNode } & SupabaseProviderProps> = ({ children, url, apiKey }) => {
	console.log('URL:', url, apiKey);

	const [client, setClient] = useState<SupabaseClient | null>(null);
	const { kobble } = useKobble();

	useEffect(() => {
		if (client || !kobble) {
			return;
		}

		const supabaseClient = createClient(url, apiKey, {
			global: {
				// Get the Supabase token with a custom fetch method
				fetch: async (url, options = {}) => {
					const token = await kobble.getSupabaseToken();
					const accessToken = await kobble.getAccessToken();

					// Construct fetch headers
					const headers = new Headers(options?.headers);
					headers.set('Authorization', `Bearer ${token}`);
					headers.set('Kobble-Authorization', `Bearer ${accessToken}`);

					// Now call the default fetch
					return fetch(url, {
						...options,
						headers
					});
				}
			}
		});

		setClient(supabaseClient);
	}, [client, kobble]);

	return (
		<SupabaseContext.Provider
			value={{
				client
			}}>
			{children}
		</SupabaseContext.Provider>
	);
};
