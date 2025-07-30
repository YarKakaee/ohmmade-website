import getPrismaClient from '@/prisma/client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
	try {
		const prisma = await getPrismaClient();
		const { id, email, name, image } = await request.json();

		if (!id || !email || !name) {
			return NextResponse.json(
				{ error: 'ID, email and name are required' },
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
				id,
				email,
				name,
				username,
				image,
			},
		});

		// Return success response
		return NextResponse.json({
			success: true,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				username: user.username,
				image: user.image,
			},
		});
	} catch (error) {
		console.error('Create user error:', error);
		// Check if it's a unique constraint violation
		if (error.code === 'P2002') {
			return NextResponse.json(
				{ error: 'A user with this email already exists' },
				{ status: 409 }
			);
		}
		return NextResponse.json(
			{ error: 'Failed to create user' },
			{ status: 500 }
		);
	}
}
