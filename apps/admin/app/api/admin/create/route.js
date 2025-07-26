import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';

export async function POST(request) {
	try {
		const { name, email, role } = await request.json();

		// Validate required fields
		if (!name || !email || !role) {
			return NextResponse.json(
				{ error: 'Name, email, and role are required' },
				{ status: 400 }
			);
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ error: 'Invalid email format' },
				{ status: 400 }
			);
		}

		// Validate role
		const validRoles = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT'];
		if (!validRoles.includes(role)) {
			return NextResponse.json(
				{ error: 'Invalid role' },
				{ status: 400 }
			);
		}

		// Check if admin already exists
		const existingAdmin = await prisma.admin.findFirst({
			where: { email },
		});

		if (existingAdmin) {
			return NextResponse.json(
				{ error: 'Admin with this email already exists' },
				{ status: 409 }
			);
		}

		// Create new admin
		const newAdmin = await prisma.admin.create({
			data: {
				name,
				email,
				role,
				isActive: true,
			},
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				isActive: true,
				createdAt: true,
			},
		});

		// Log the admin creation action
		try {
			await prisma.adminActionLog.create({
				data: {
					adminId: newAdmin.id, // This will be the newly created admin
					action: 'ADMIN_ADDED',
					resourceType: 'Admin',
					resourceId: newAdmin.id,
					details: {
						adminName: newAdmin.name,
						adminEmail: newAdmin.email,
						adminRole: newAdmin.role,
						timestamp: new Date().toISOString(),
					},
				},
			});
		} catch (logError) {
			console.warn('Failed to log admin creation action:', logError);
		}

		return NextResponse.json({
			success: true,
			admin: newAdmin,
		});
	} catch (error) {
		console.error('Error creating admin:', error);
		return NextResponse.json(
			{ error: 'Failed to create admin' },
			{ status: 500 }
		);
	}
}
