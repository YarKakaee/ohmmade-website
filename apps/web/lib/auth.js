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
	// Use environment variable for redirect URL, fallback to location.origin for development
	const redirectUrl =
		process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL ||
		`${location.origin}/auth/callback`;

	return await supabase.auth.signInWithOAuth({
		provider: 'google',
		options: {
			redirectTo: redirectUrl,
		},
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

export async function checkSession() {
	const {
		data: { session },
		error,
	} = await supabase.auth.getSession();

	if (error) {
		console.error('Error getting session:', error.message);
	} else if (!session) {
		console.log('No active session.');
	} else {
		console.log('Current session:', session);
	}

	return session;
}
