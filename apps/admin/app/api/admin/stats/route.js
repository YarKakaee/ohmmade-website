import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';

export async function GET(request) {
	try {
		// Get all admin actions for system-wide stats
		const allActions = await prisma.adminActionLog.findMany({
			include: {
				admin: {
					select: {
						id: true,
						name: true,
						email: true,
						role: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		// Get count of active admins
		const activeAdminsCount = await prisma.admin.count({
			where: {
				isActive: true,
			},
		});

		// Get total users count
		const totalUsersCount = await prisma.user.count();

		// Get total projects count
		const totalProjectsCount = await prisma.project.count();

		// Calculate time periods
		const now = new Date();
		const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

		// Filter actions by time period
		const actionsThisWeek = allActions.filter(
			(action) => action.createdAt > weekAgo
		);

		// Calculate action breakdown
		const actionBreakdown = allActions.reduce((acc, action) => {
			acc[action.action] = (acc[action.action] || 0) + 1;
			return acc;
		}, {});

		const stats = {
			totalUsers: totalUsersCount,
			totalProjects: totalProjectsCount,
			actionsThisWeek: actionsThisWeek.length,
			activeAdminsCount,
			actionBreakdown,
		};

		return NextResponse.json({
			success: true,
			stats,
		});
	} catch (error) {
		console.error('Error fetching admin stats:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch admin stats' },
			{ status: 500 }
		);
	}
}
