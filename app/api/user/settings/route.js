import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import prisma from '@/prisma/client';

export async function GET() {
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

		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
				notifications: true,
				theme: true,
				language: true,
			},
		});

		if (!user) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(user);
	} catch (error) {
		console.error('Error fetching user settings:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch user settings' },
			{ status: 500 }
		);
	}
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
		const { notifications, theme, language } = body;

		const user = await prisma.user.update({
			where: { id: session.user.id },
			data: {
				notifications,
				theme,
				language,
			},
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
				notifications: true,
				theme: true,
				language: true,
			},
		});

		return NextResponse.json(user);
	} catch (error) {
		console.error('Error updating user settings:', error);
		return NextResponse.json(
			{ error: 'Failed to update user settings' },
			{ status: 500 }
		);
	}
}
