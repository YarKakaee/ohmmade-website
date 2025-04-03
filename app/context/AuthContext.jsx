'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const getSession = async () => {
			const { data } = await supabase.auth.getUser();
			if (data?.user) setUser(data.user);
		};
		getSession();

		const { data: listener } = supabase.auth.onAuthStateChange(
			(event, session) => {
				setUser(session?.user ?? null);
			}
		);

		return () => {
			listener?.subscription.unsubscribe();
		};
	}, []);

	return (
		<AuthContext.Provider value={{ user, setUser }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
