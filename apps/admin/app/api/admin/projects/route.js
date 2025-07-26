import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';

export async function GET(request) {
	try {
		// Get all projects with their author details
		const projects = await prisma.project.findMany({
			select: {
				id: true,
				title: true,
				description: true,
				category: true,
				slug: true,
				featured: true,
				views: true,
				likes: true,
				timeToBuild: true,
				difficultyLevel: true,
				status: true,
				thumbnailUrl: true,
				createdAt: true,
				updatedAt: true,
				author: {
					select: {
						id: true,
						name: true,
						email: true,
						username: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return NextResponse.json({
			success: true,
			projects,
		});
	} catch (error) {
		console.error('Error fetching projects:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch projects' },
			{ status: 500 }
		);
	}
}
