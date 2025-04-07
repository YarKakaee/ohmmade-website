'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import {
	SessionContextProvider,
	createBrowserClient,
} from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabaseClient';

const CustomSessionContext = createContext();

export function useCustomSession() {
	return useContext(CustomSessionContext);
}

export default function SupabaseProvider({ children }) {
	const [supabaseClient] = useState(() => supabase);
	const [session, setSession] = useState(null);

	useEffect(() => {
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, newSession) => {
			setSession(newSession);
		});

		return () => subscription.unsubscribe();
	}, []);

	return (
		<SessionContextProvider
			supabaseClient={supabaseClient}
			initialSession={session}
		>
			<CustomSessionContext.Provider value={{ session, setSession }}>
				{children}
			</CustomSessionContext.Provider>
		</SessionContextProvider>
	);
}
