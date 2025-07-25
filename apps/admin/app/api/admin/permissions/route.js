import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const adminId = searchParams.get('adminId');

		if (!adminId) {
			return NextResponse.json(
				{ error: 'Admin ID is required' },
				{ status: 400 }
			);
		}

		const admin = await prisma.admin.findFirst({
			where: {
				id: adminId,
				isActive: true,
			},
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				isActive: true,
				createdAt: true,
				lastLoginAt: true,
			},
		});

		if (!admin) {
			return NextResponse.json(
				{ error: 'Admin not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			admin,
		});
	} catch (error) {
		console.error('Error fetching admin permissions:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch admin permissions' },
			{ status: 500 }
		);
	}
}
