// /app/api/projects/create/route.js
import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import { createActivity } from '@/lib/activity';

export async function POST(req) {
	try {
		const body = await req.json();

		// 🛠 Upsert the user — creates if not exists
		await prisma.user.upsert({
			where: { id: body.userId },
			update: {}, // no update needed
			create: {
				id: body.userId,
				name: body.username || null,
				email: body.email || null,
			},
		});

		// 📦 Create the project and connect the author
		const newProject = await prisma.project.create({
			data: {
				title: body.title,
				description: body.description,
				category: body.category,
				difficultyLevel: body.difficultyLevel,
				timeToBuild: body.timeToBuild,
				tags: body.tags,
				thumbnailUrl: body.thumbnailUrl,
				slug: body.slug,
				content: body.content,
				componentsUsed: body.componentsUsed,
				status: body.status || 'published',
				views: 0,
				likes: 0,
				author: {
					connect: { id: body.userId },
				},
			},
		});

		// Track publishing activity if the project is published
		if (newProject.status === 'published') {
			await createActivity(
				body.userId,
				'PROJECT_PUBLISHED',
				newProject.id
			);
		}

		return NextResponse.json(
			{ success: true, project: newProject },
			{ status: 201 }
		);
	} catch (err) {
		console.error('Failed to create project:', err);
		return NextResponse.json(
			{ error: 'Failed to create project' },
			{ status: 500 }
		);
	}
}
