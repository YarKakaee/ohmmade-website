'use client';
import { createClient } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		// Initial session load
		supabase.auth.getSession().then(({ data: { session } }) => {
			setUser(session?.user ?? null);
		});

		// Listen for changes
		const { data: listener } = supabase.auth.onAuthStateChange(
			(event, session) => {
				const newUser = session?.user ?? null;
				setUser((prevUser) => {
					// ❗ prevent infinite loop: only update if user actually changed
					if (prevUser?.id !== newUser?.id) {
						return newUser;
					}
					return prevUser;
				});
			}
		);

		return () => {
			listener.subscription?.unsubscribe();
		};
	}, []);

	return (
		<AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
	);
};
