import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import prisma from '@/prisma/client';
import bcrypt from 'bcryptjs';
import { uploadImage } from '@/lib/supabaseStorage';

export async function GET(req) {
	try {
		const cookieStore = await cookies();
		const supabase = createRouteHandlerClient({
			cookies: () => cookieStore,
		});

		// Get user session from Supabase
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session?.user) {
			return new Response('Unauthorized', { status: 401 });
		}

		const searchParams = new URL(req.url).searchParams;
		const email = searchParams.get('email');

		if (!email) {
			return new Response('Email is required', { status: 400 });
		}

		const user = await prisma.user.findUnique({
			where: { email },
			select: {
				id: true,
				name: true,
				username: true,
				email: true,
				image: true,
			},
		});

		if (!user) {
			return new Response('User not found', { status: 404 });
		}

		return new Response(JSON.stringify(user), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Error fetching user profile:', error);
		return new Response('Error fetching user profile', { status: 500 });
	}
}

export async function PUT(req) {
	try {
		const cookieStore = await cookies();
		const supabase = createRouteHandlerClient({
			cookies: () => cookieStore,
		});

		// Get user session from Supabase
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session?.user) {
			return new Response('Unauthorized', { status: 401 });
		}

		const data = await req.json();
		const { email, ...updateData } = data;

		// Update user profile
		const updatedUser = await prisma.user.update({
			where: { email },
			data: updateData,
			select: {
				id: true,
				name: true,
				username: true,
				email: true,
				image: true,
			},
		});

		return new Response(JSON.stringify(updatedUser), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Error updating user profile:', error);
		return new Response('Error updating user profile', { status: 500 });
	}
}
