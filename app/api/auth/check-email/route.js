import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
	try {
		const { email } = await request.json();

		if (!email) {
			return NextResponse.json(
				{ error: 'Email is required' },
				{ status: 400 }
			);
		}

		// Create client with service role key
		const supabase = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL,
			process.env.SUPABASE_SERVICE_ROLE_KEY
		);

		// First get the user ID by email
		const { data: authData, error: authError } =
			await supabase.auth.admin.listUsers();

		if (authError) {
			console.error('Admin list users error:', authError);
			return NextResponse.json(
				{ error: 'Failed to check email' },
				{ status: 500 }
			);
		}

		// Check if email exists in the list of users
		const userExists = authData.users.some((user) => user.email === email);

		return NextResponse.json({ exists: userExists });
	} catch (error) {
		console.error('Email check error:', error);
		return NextResponse.json(
			{ error: 'Failed to check email' },
			{ status: 500 }
		);
	}
}
