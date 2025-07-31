import { NextResponse } from 'next/server';
import getPrismaClient from '@/prisma/client';
import { generateUsername, isValidUsername } from '@/lib/usernameUtils';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// POST endpoint to ensure a user has a username
export async function POST(request) {
	try {
		const prisma = getPrismaClient();
		// Create server-side Supabase client
		const supabase = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
		);

		// Get the current authenticated user
		const {
			data: { session },
		} = await supabase.auth.getSession();
		if (!session || !session.user) {
			return NextResponse.json(
				{ error: 'Authentication required' },
				{ status: 401 }
			);
		}

		const userId = session.user.id;
		const requestData = await request.json();
		const suggestedName =
			requestData.name || session.user.email.split('@')[0];

		// Check if user already exists and has a username
		const existingUser = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (existingUser && existingUser.username) {
			// User already has a username
			return NextResponse.json({
				username: existingUser.username,
				status: 'existing',
			});
		}

		// Generate a unique username
		const username = await generateUsername(suggestedName);
		console.log(`Generated username "${username}" for user ${userId}`);

		if (existingUser) {
			// Update existing user with username
			await prisma.user.update({
				where: { id: userId },
				data: {
					username,
					name: existingUser.name || suggestedName,
				},
			});
		} else {
			// Create new user record with username
			await prisma.user.create({
				data: {
					id: userId,
					email: session.user.email,
					username,
					name: suggestedName,
					createdAt: new Date(),
				},
			});
		}

		return NextResponse.json({
			username,
			status: 'created',
		});
	} catch (error) {
		console.error('Username creation error:', error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

// GET endpoint to check if a username is available
export async function GET(request) {
	try {
		const prisma = getPrismaClient();
		const { searchParams } = new URL(request.url);
		const username = searchParams.get('username');

		if (!username) {
			return NextResponse.json(
				{ error: 'Username parameter is required' },
				{ status: 400 }
			);
		}

		// Provide more specific validation error messages
		if (!username.match(/^[a-zA-Z]/)) {
			return NextResponse.json({
				available: false,
				error: 'Username must start with a letter',
			});
		}

		if (username.length < 3) {
			return NextResponse.json({
				available: false,
				error: 'Username must be at least 3 characters long',
			});
		}

		if (username.length > 30) {
			return NextResponse.json({
				available: false,
				error: 'Username cannot exceed 30 characters',
			});
		}

		if (!isValidUsername(username)) {
			return NextResponse.json({
				available: false,
				error: 'Username can only contain letters, numbers and underscores',
			});
		}

		// Check if the username already exists
		const existingUser = await prisma.user.findUnique({
			where: { username },
		});

		return NextResponse.json({
			available: !existingUser,
			message: existingUser
				? 'Username is already taken'
				: 'Username is available',
		});
	} catch (error) {
		console.error('Username availability check error:', error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
