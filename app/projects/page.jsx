import ProjectCard from '@/app/components/projects/ProjectCard';
import categoryColors from '@/lib/constants/categoryColors';
import prisma from '@/prisma/client';
import { Inter_Tight } from 'next/font/google';

const interTight = Inter_Tight({ subsets: ['latin'] });

export const metadata = {
	title: 'Explore Projects | OhmMade',
	description:
		'Browse all electronics and coding projects shared by the OhmMade community. Learn, build, and get inspired!',
};

export default async function ExploreProjectsPage() {
	const projects = await prisma.project.findMany({
		where: { status: 'published' },
		orderBy: { createdAt: 'desc' },
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
		<div className="relative min-h-screen bg-[#101014] overflow-hidden">
			<section className="relative w-full pt-16 px-8 sm:px-16 lg:px-24">
				{/* Blurred Gradient Background */}
				<div
					className="absolute top-[100px] left-1/2 -translate-x-1/2 z-0 w-full max-w-[1500px] h-[500px] bg-center bg-no-repeat bg-cover opacity-40 pointer-events-none select-none"
					style={{
						backgroundImage:
							'url(https://edc-cdn.net/assets/images/bg-header-epic-indies.png)',
						filter: 'blur(60px)',
					}}
				/>

				<div className="max-w-[1700px] mx-auto px-8 sm:px-16 py-20 relative z-10">
					<h2
						className={`text-[44px] font-black mb-4 text-white leading-tight ${interTight.className}`}
					>
						Explore Projects
					</h2>
					<p className="text-white/60 mb-10 max-w-[750px]">
						Discover a wide range of beginner-friendly electronics
						and coding projects shared by the OhmMade community.
						Learn, build, and get inspired!
					</p>

					{/* Project Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{projects.map((project) => (
							<ProjectCard
								key={project.id}
								title={project.title}
								category={project.category}
								description={project.description}
								imageUrl={project.thumbnailUrl}
								categoryColor={
									categoryColors[project.category] ||
									'#999999'
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
				</div>
			</section>
		</div>
	);
}
