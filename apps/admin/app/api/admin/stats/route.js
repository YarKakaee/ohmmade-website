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

		// Get all actions by this admin
		const allActions = await prisma.adminActionLog.findMany({
			where: { adminId },
		});

		// Calculate time periods
		const now = new Date();
		const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
		const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

		// Filter actions by time period
		const actionsThisWeek = allActions.filter(
			(action) => action.createdAt > weekAgo
		);
		const actionsThisMonth = allActions.filter(
			(action) => action.createdAt > monthAgo
		);

		// Calculate action breakdown
		const actionBreakdown = allActions.reduce((acc, action) => {
			acc[action.action] = (acc[action.action] || 0) + 1;
			return acc;
		}, {});

		const stats = {
			totalActions: allActions.length,
			actionsThisWeek: actionsThisWeek.length,
			actionsThisMonth: actionsThisMonth.length,
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
