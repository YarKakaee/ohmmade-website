'use client';

import { supabase } from './supabaseClient';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createContext, useContext, useEffect, useState } from 'react';

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
