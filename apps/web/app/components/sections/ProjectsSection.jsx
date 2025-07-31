import categoryColors from '@/lib/constants/categoryColors';
import getPrismaClient from '@/prisma/client';
import ProjectCard from '../common/ProjectCard';
import ProjectsHeader from '../common/ProjectHeader';
import LayoutContainer from '@ohmmade/ui/layout-container';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

// Force dynamic rendering to prevent prerendering
export const dynamic = 'force-dynamic';

export default async function ProjectsSection() {
	const prisma = await getPrismaClient();
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
		<section className="relative w-full py-12 sm:py-16 md:py-20 px-2 sm:px-8 md:px-16 lg:px-24">
			<LayoutContainer>
				<ProjectsHeader />

				{/* Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
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

				{/* Mobile More Projects Button */}
				<div className="mt-8 sm:hidden w-full">
					<Link href="/projects" className="block w-full">
						<button className="text-[13px] border border-[#444] hover:border-white text-white px-4 py-2 rounded-md transition cursor-pointer w-full">
							More Projects
							<FontAwesomeIcon
								icon={faArrowRight}
								size="sm"
								className="ml-1.5 transform transition-transform duration-200"
							/>
						</button>
					</Link>
				</div>
			</LayoutContainer>
		</section>
	);
}
