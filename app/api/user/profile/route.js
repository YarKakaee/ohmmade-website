import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import prisma from '@/prisma/client';
import bcrypt from 'bcryptjs';
import { uploadImage } from '@/lib/supabaseStorage';

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const email = searchParams.get('email');
	if (!email) {
		return NextResponse.json({ error: 'Email required' }, { status: 400 });
	}
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		return NextResponse.json({ error: 'User not found' }, { status: 404 });
	}
	return NextResponse.json(user);
}

export async function PUT(request) {
	try {
		const cookieStore = cookies();
		const supabase = createRouteHandlerClient({
			cookies: () => cookieStore,
		});

		const {
			data: { session },
		} = await supabase.auth.getSession();
		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const body = await request.json();
		const { name, email, currentPassword, newPassword } = body;

		// Get the current user with password for verification
		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
				password: true,
			},
		});

		if (!user) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
		}

		// If password change is requested, verify current password
		if (newPassword) {
			if (!currentPassword) {
				return NextResponse.json(
					{ error: 'Current password is required' },
					{ status: 400 }
				);
			}

			const isValidPassword = await bcrypt.compare(
				currentPassword,
				user.password
			);
			if (!isValidPassword) {
				return NextResponse.json(
					{ error: 'Current password is incorrect' },
					{ status: 400 }
				);
			}
		}

		// Prepare update data
		const updateData = {};
		if (name) updateData.name = name;
		if (email) updateData.email = email;
		if (newPassword)
			updateData.password = await bcrypt.hash(newPassword, 10);

		// Update user
		const updatedUser = await prisma.user.update({
			where: { id: session.user.id },
			data: updateData,
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
			},
		});

		return NextResponse.json(updatedUser);
	} catch (error) {
		console.error('Error updating user profile:', error);
		return NextResponse.json(
			{ error: 'Failed to update user profile' },
			{ status: 500 }
		);
	}
}
