// /pages/api/createProject.ts
import prisma from '@/prisma/client';
import { NextResponse } from 'next/server';

export async function POST(req) {
	const data = await req.json();

	const project = await prisma.project.create({
		data: {
			title: data.title,
			description: data.description,
			category: data.category,
			difficultyLevel: data.difficultyLevel,
			timeToBuild: data.timeToBuild || '',
			tags: data.tags,
			thumbnailUrl: data.thumbnailUrl,
			content: data.content,
			slug: data.slug,
			author: data.author,
			featured: false,
		},
	});

	return NextResponse.json({ slug: project.slug });
}
