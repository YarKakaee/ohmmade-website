// app/components/ProjectsSectionServer.jsx

import ProjectCard from './ProjectCard';
import ProjectsHeader from './ProjectHeader';
import prisma from '@/prisma/client'; // Adjust this path if needed
import { motion } from 'framer-motion';

export default async function ProjectsSectionServer() {
	const featuredProjects = await prisma.project.findMany({
		where: { featured: true, status: 'published' },
		orderBy: { createdAt: 'desc' },
		take: 4,
	});

	return (
		<section className="relative w-full py-20 px-8 sm:px-16 lg:px-24">
			<div className="max-w-[1700px] mx-auto px-8 sm:px-16">
				<ProjectsHeader />

				{/* Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{featuredProjects.map((project) => (
						<ProjectCard
							key={project.id}
							title={project.title}
							category={project.category}
							description={project.description}
							imageUrl={project.thumbnailUrl}
							categoryColor={
								project.category === 'Arduino UNO'
									? '#2081C3'
									: '#E03D5C'
							}
							author={project.author}
							views={project.views}
							likes={project.likes}
							slug={project.slug}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
