import { createContext, useContext } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';

export type SupabaseContextState = {
	client: SupabaseClient | null;
};

export const SupabaseContext = createContext<SupabaseContextState>({
	client: null
});

export const useSupabaseContext = () => {
	return useContext(SupabaseContext);
};
