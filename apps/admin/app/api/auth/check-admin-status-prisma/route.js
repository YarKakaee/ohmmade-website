import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';

export async function POST(request) {
	try {
		const { email } = await request.json();

		if (!email) {
			return NextResponse.json(
				{ error: 'Email is required' },
				{ status: 400 }
			);
		}

		const adminData = await prisma.admin.findFirst({
			where: {
				email: email,
				isActive: true,
			},
		});

		if (!adminData) {
			return NextResponse.json(
				{ isAdmin: false, message: 'User is not an admin' },
				{ status: 200 }
			);
		}

		return NextResponse.json({
			isAdmin: true,
			admin: adminData,
		});
	} catch (error) {
		return NextResponse.json(
			{ error: 'An unexpected error occurred' },
			{ status: 500 }
		);
	}
}
