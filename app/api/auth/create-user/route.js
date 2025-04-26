import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

export async function POST(request) {
	try {
		const { email, name } = await request.json();

		if (!email || !name) {
			return NextResponse.json(
				{ error: 'Email and name are required' },
				{ status: 400 }
			);
		}

		// Generate a unique username from the name
		const baseUsername = name
			.toLowerCase()
			.replace(/[^a-z0-9]/g, '')
			.slice(0, 15);

		let username = baseUsername;
		let counter = 1;

		// Keep trying until we find a unique username
		while (true) {
			const existingUser = await prisma.user.findUnique({
				where: { username },
			});

			if (!existingUser) break;

			username = `${baseUsername}${counter}`;
			counter++;
		}

		// Create the user in Prisma
		const user = await prisma.user.create({
			data: {
				email,
				name,
				username,
				// You can add a default image URL here if needed
				image: null,
			},
		});

		return NextResponse.json({ user });
	} catch (error) {
		console.error('Create user error:', error);
		return NextResponse.json(
			{ error: 'Failed to create user' },
			{ status: 500 }
		);
	}
}
