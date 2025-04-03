import { supabase } from './supabaseClient';

export const signUpWithEmail = async (email, password, displayName) => {
	return await supabase.auth.signUp({
		email,
		password,
		options: {
			data: {
				name: displayName, // This becomes user_metadata.name
			},
		},
	});
};

export async function signInWithGoogle() {
	return await supabase.auth.signInWithOAuth({
		provider: 'google',
	});
}

export async function signInWithEmail(email, password) {
	const { user, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	return { user, error };
}

export async function signOut() {
	await supabase.auth.signOut();
}
