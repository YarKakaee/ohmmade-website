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
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Get initial session
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setIsLoading(false);
		});

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, newSession) => {
			setSession(newSession);
		});

		return () => subscription.unsubscribe();
	}, []);

	// Show minimal loading state while session is being initialized
	if (isLoading) {
		return (
			<div className="min-h-screen bg-[#101014] flex items-center justify-center">
				<div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white/20"></div>
			</div>
		);
	}

	return (
		<SessionContextProvider
			supabaseClient={supabaseClient}
			initialSession={session}
		>
			<CustomSessionContext.Provider
				value={{ session, setSession, isLoading }}
			>
				{children}
			</CustomSessionContext.Provider>
		</SessionContextProvider>
	);
}
