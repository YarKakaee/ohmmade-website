import prisma from '@/prisma/client';
import Image from 'next/image';

export default async function ProjectPage({ params }) {
	const { slug } = await params;

	const project = await prisma.project.findUnique({
		where: { slug },
		include: {
			author: {
				select: { name: true, email: true, image: true },
			},
		},
	});

	if (!project) notFound();

	return (
		<div>
			{project.thumbnailUrl && (
				<Image
					src={project.thumbnailUrl}
					alt={project.title}
					width={1000}
					height={600}
					className="rounded-lg w-full h-auto mb-8"
				/>
			)}
		</div>
	);
}

export async function generateMetadata({ params }) {
	const { slug } = await params;

	const project = await prisma.project.findUnique({
		where: { slug },
	});

	if (!project) {
		return {
			title: 'Project Not Found | OhmMade',
		};
	}

	return {
		title: `${project.title} | OhmMade`,
	};
}
