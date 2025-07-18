import categoryColors from '@/lib/constants/categoryColors';
import prisma from '@/prisma/client'; // Adjust this path if needed
import ProjectCard from '../common/ProjectCard';
import ProjectsHeader from '../common/ProjectHeader';
import LayoutContainer from '@ohmmade/ui/layout-container';

export default async function ProjectsSection() {
	const featuredProjects = await prisma.project.findMany({
		where: { featured: true, status: 'published' },
		orderBy: { createdAt: 'desc' },
		take: 4,
		include: {
			author: {
				select: {
					name: true,
					image: true,
					email: true,
				},
			},
		},
	});

	return (
		<section className="relative w-full py-20 px-8 sm:px-16 lg:px-24">
			<LayoutContainer>
				<ProjectsHeader />

				{/* Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{featuredProjects.map((project) => (
						<ProjectCard
							key={project.id}
							title={project.title}
							category={project.category}
							description={project.description}
							imageUrl={project.thumbnailUrl}
							categoryColor={
								categoryColors[project.category] || '#999999'
							}
							authorName={project.author?.name}
							authorImage={project.author?.image}
							authorEmail={project.author?.email}
							views={project.views}
							likes={project.likes}
							slug={project.slug}
						/>
					))}
				</div>
			</LayoutContainer>
		</section>
	);
}
