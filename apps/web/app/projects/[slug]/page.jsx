import CodexViewer from '@/app/components/codex/CodexViewer';
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

export default async function ProjectPage({ params }) {
	const { slug } = await params;
	const prisma = await getPrismaClient();

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
		<section>
			<div className="relative min-h-screen bg-[#101014] overflow-hidden">
				<Suspense fallback={<ProjectSlugHeader project={project} />}>
					<ClientProjectSlugHeader project={project} />
				</Suspense>

				<LayoutContainer className="mt-8 sm:mt-12 mb-16 sm:mb-24">
					<div className="grid grid-cols-1 lg:grid-cols-4 gap-8 sm:gap-12">
						{/* Left: Editor.js Content */}
						<div className="lg:col-span-3">
							<CodexViewer data={project.content} />
						</div>

						{/* Right: Metadata */}
						<div className="py-4 sm:py-5 px-4 sm:px-8 lg:px-12 border-t lg:border-t-0 lg:border-l-2 border-white/10 text-white space-y-4 sm:space-y-6">
							{/* Project Details */}
							<div className="space-y-3 sm:space-y-4">
								{project.difficultyLevel && (
									<div className="flex items-center gap-2 text-white/60">
										<span>
											<FontAwesomeIcon
												icon={faGaugeHigh}
												className="text-sm sm:text-base"
											/>
										</span>
										<span className="text-sm sm:text-base">
											{project.difficultyLevel}
										</span>
									</div>
								)}
								{project.timeToBuild && (
									<div className="flex items-center gap-2 text-white/60">
										<span>
											<FontAwesomeIcon
												icon={faClock}
												className="text-sm sm:text-base"
											/>
										</span>
										<span className="text-sm sm:text-base">
											{project.timeToBuild}
										</span>
									</div>
								)}
							</div>

							{/* Components Section */}
							{project.componentsUsed &&
								project.componentsUsed.length > 0 && (
									<div>
										<p className="mt-6 sm:mt-7 mb-3 font-medium text-white/60 text-sm sm:text-base">
											Components
										</p>
										<div className="space-y-2 sm:space-y-2.5">
											{project.componentsUsed.map(
												(component, i) => (
													<label
														key={i}
														className="flex items-center gap-2 cursor-pointer text-white/60 text-xs sm:text-sm"
													>
														<input
															type="checkbox"
															className="hidden peer"
														/>
														<span className="w-4 h-4 sm:w-5 sm:h-5 rounded-md border border-[#5C5C5E] bg-[#101014] peer-checked:bg-[#27BBFF] peer-checked:border-[#27BBFF] transition-all duration-150 flex items-center justify-center">
															<FontAwesomeIcon
																icon={faCheck}
																className="text-[#101014] text-[10px] sm:text-[11px] hidden peer-checked:block"
															/>
														</span>
														<span className="truncate">
															{component}
														</span>
													</label>
												)
											)}
										</div>
									</div>
								)}

							{/* Empty State */}
							{!project.difficultyLevel &&
								!project.timeToBuild &&
								(!project.componentsUsed ||
									project.componentsUsed.length === 0) && (
									<div className="text-center py-8 sm:py-12">
										<div className="bg-[#13151A]/50 backdrop-blur-sm border border-[#3A3A3C]/60 rounded-2xl p-6 sm:p-8">
											<div className="text-4xl sm:text-6xl mb-3 sm:mb-4">
												📋
											</div>
											<h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
												No Additional Info
											</h3>
											<p className="text-sm sm:text-base text-white/60">
												This project doesn't have
												difficulty level, build time, or
												components listed.
											</p>
										</div>
									</div>
								)}
						</div>
					</div>
				</LayoutContainer>
			</div>
		</section>
	);
}

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const prisma = await getPrismaClient();

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
