// /app/api/projects/create/route.js
import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import { createActivity } from '@/lib/activity';
import { generateUsername } from '@/lib/usernameUtils';

export async function POST(req) {
	try {
		const body = await req.json();

		let username = body.username;
		if (!username) {
			// Fallback: generate from name or email
			username = await generateUsername(
				body.name || body.email.split('@')[0]
			);
		}

		// Upsert the user — creates if not exists
		await prisma.user.upsert({
			where: { email: body.email },
			update: { name: body.name, username },
			create: {
				id: body.userId,
				name: body.name || null,
				email: body.email || null,
				username,
			},
		});

		// Fetch the user to get the correct id
		const user = await prisma.user.findUnique({
			where: { email: body.email },
		});

		// Create the project and connect the author
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
					connect: { id: user.id },
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
