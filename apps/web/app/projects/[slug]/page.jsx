import BlocknoteViewer from '@/app/components/editor/BlocknoteViewer';
import LayoutContainer from '@ohmmade/ui/layout-container';
import ProjectSlugHeader from '@/app/components/common/ProjectSlugHeader';
import getPrismaClient from '@/prisma/client';
import {
	faCheck,
	faClock,
	faGaugeHigh,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ClientProjectSlugHeader from './ClientProjectSlugHeader';
import { metadataGenerators, generateStructuredData } from '@/lib/seo';

// Generate static params for all published projects
export async function generateStaticParams() {
	const prisma = getPrismaClient();

	try {
		const projects = await prisma.project.findMany({
			where: {
				status: 'published',
			},
			select: {
				slug: true,
			},
		});

		return projects.map((project) => ({
			slug: project.slug,
		}));
	} catch (error) {
		console.error('Error generating static params for projects:', error);
		return [];
	}
}

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const prisma = getPrismaClient();

	try {
		const project = await prisma.project.findUnique({
			where: { slug },
			include: {
				author: {
					select: { name: true, username: true, image: true },
				},
			},
		});

		if (!project) {
			return {
				title: 'Project Not Found | OhmMade',
				description: 'The requested project could not be found.',
			};
		}

		return metadataGenerators.project(project);
	} catch (error) {
		console.error('Error generating metadata:', error);
		return {
			title: 'Project | OhmMade',
			description: 'Project details',
		};
	}
}

export default async function ProjectPage({ params }) {
	const { slug } = await params;
	const prisma = getPrismaClient();

	try {
		const project = await prisma.project.findUnique({
			where: { slug },
			include: {
				author: {
					select: {
						name: true,
						email: true,
						image: true,
						username: true,
					},
				},
			},
		});

		if (!project) {
			notFound();
		}

		// Generate structured data for this project
		const structuredData = generateStructuredData('project', project);

		return (
			<>
				{/* Structured Data */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(structuredData),
					}}
				/>

				<section>
					<div className="relative min-h-screen bg-[#101014] overflow-hidden">
						<Suspense
							fallback={<ProjectSlugHeader project={project} />}
						>
							<ClientProjectSlugHeader project={project} />
						</Suspense>

						<LayoutContainer className="mt-8 sm:mt-12 mb-16 sm:mb-24">
							<div className="grid grid-cols-1 lg:grid-cols-4 gap-8 sm:gap-12">
								{/* Left: Content */}
								<div className="lg:col-span-3">
									<BlocknoteViewer data={project.content} />
								</div>

								{/* Right: Metadata */}
								<div className="py-8 pl-3 lg:pl-6 border-t lg:border-t-0 lg:border-l border-white/10 text-white space-y-8">
									{/* Project Details */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-white">
											Project Details
										</h3>
										<div className="space-y-3">
											{project.difficultyLevel && (
												<div className="flex items-center justify-between p-3 bg-[#1A1A1E] rounded-lg border border-white/5">
													<span className="text-white/60 text-sm">
														Difficulty
													</span>
													<span className="px-3 py-1 bg-[#27BBFF] text-white text-sm font-medium rounded-md">
														{
															project.difficultyLevel
														}
													</span>
												</div>
											)}
											{project.timeToBuild && (
												<div className="flex items-center justify-between p-3 bg-[#1A1A1E] rounded-lg border border-white/5">
													<span className="text-white/60 text-sm">
														Time to Build
													</span>
													<span className="px-3 py-1 bg-[#10B981] text-white text-sm font-medium rounded-md">
														{project.timeToBuild}
													</span>
												</div>
											)}
											{project.category && (
												<div className="flex items-center justify-between p-3 bg-[#1A1A1E] rounded-lg border border-white/5">
													<span className="text-white/60 text-sm">
														Category
													</span>
													<span className="px-3 py-1 bg-[#8B5CF6] text-white text-sm font-medium rounded-md">
														{project.category}
													</span>
												</div>
											)}
										</div>
									</div>

									{/* Components Used */}
									{project.componentsUsed &&
										project.componentsUsed.length > 0 && (
											<div className="space-y-4">
												<h3 className="text-lg font-semibold text-white">
													Components Used
												</h3>
												<div className="flex flex-wrap gap-2">
													{project.componentsUsed.map(
														(component, index) => (
															<span
																key={index}
																className="px-3 py-2 bg-[#1A1A1E] border border-white/10 rounded-lg text-sm text-white/90"
															>
																{component}
															</span>
														)
													)}
												</div>
											</div>
										)}

									{/* Tags */}
									{project.tags &&
										Array.isArray(project.tags) &&
										project.tags.length > 0 && (
											<div className="space-y-4">
												<h3 className="text-lg font-semibold text-white">
													Tags
												</h3>
												<div className="flex flex-wrap gap-2">
													{project.tags.map(
														(tag, index) => (
															<span
																key={index}
																className="px-3 py-2 bg-[#27BBFF]/10 border border-[#27BBFF]/20 rounded-lg text-sm text-[#27BBFF]"
															>
																{tag}
															</span>
														)
													)}
												</div>
											</div>
										)}

									{/* Stats */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-white">
											Project Stats
										</h3>
										<div className="grid grid-cols-2 gap-3">
											<div className="text-center p-4 bg-[#1A1A1E] rounded-lg border border-white/5">
												<div className="text-2xl font-bold text-[#27BBFF]">
													{project.views}
												</div>
												<div className="text-sm text-white/60">
													Views
												</div>
											</div>
											<div className="text-center p-4 bg-[#1A1A1E] rounded-lg border border-white/5">
												<div className="text-2xl font-bold text-[#10B981]">
													{project.likes}
												</div>
												<div className="text-sm text-white/60">
													Likes
												</div>
											</div>
										</div>
									</div>

									{/* Author Info */}
									{project.author && (
										<div className="space-y-4">
											<h3 className="text-lg font-semibold text-white">
												Created by
											</h3>
											<a
												href={`/u/${project.author.username}`}
												className="block group"
											>
												<div className="flex items-center space-x-3 p-4 bg-[#1A1A1E] rounded-lg border border-white/5 group-hover:border-white/20 group-hover:bg-[#1F1F23] transition-all duration-200 cursor-pointer">
													{project.author.image && (
														<img
															src={
																project.author
																	.image
															}
															alt={
																project.author
																	.name ||
																project.author
																	.username
															}
															className="w-10 h-10 rounded-full"
														/>
													)}
													<div className="flex-1">
														<div className="text-white font-medium group-hover:text-[#27BBFF] transition-colors duration-200">
															{project.author
																.name ||
																project.author
																	.username}
														</div>
														{project.author
															.username && (
															<div className="text-[#27BBFF] text-sm">
																@
																{
																	project
																		.author
																		.username
																}
															</div>
														)}
													</div>
													<div className="text-white/40 group-hover:text-[#27BBFF] transition-colors duration-200">
														<svg
															className="w-5 h-5"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M9 5l7 7-7 7"
															/>
														</svg>
													</div>
												</div>
											</a>
										</div>
									)}

									{/* Date */}
									<div className="text-center pt-4 border-t border-white/10">
										<div className="text-white/40 text-sm">
											Published on{' '}
											<span className="text-white/60">
												{new Date(
													project.createdAt
												).toLocaleDateString('en-US', {
													year: 'numeric',
													month: 'long',
													day: 'numeric',
												})}
											</span>
										</div>
									</div>
								</div>
							</div>
						</LayoutContainer>
					</div>
				</section>
			</>
		);
	} catch (error) {
		console.error('Error loading project:', error);

		// Return a user-friendly error page
		return (
			<div className="min-h-screen bg-[#101014] flex items-center justify-center">
				<div className="text-center text-white">
					<h1 className="text-2xl font-bold mb-4">
						Database Connection Error
					</h1>
					<p className="text-white/60 mb-6">
						We're experiencing temporary database issues. Please try
						again in a few moments.
					</p>
					<button
						onClick={() => window.location.reload()}
						className="px-6 py-3 bg-[#27BBFF] text-white rounded-lg hover:bg-[#27BBFF]/80 transition-colors"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}
}
