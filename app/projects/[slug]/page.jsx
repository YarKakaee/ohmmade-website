import CodexViewer from '@/app/components/codex/CodexViewer';
import ProjectSlugHeader from '@/app/components/common/ProjectSlugHeader';
import prisma from '@/prisma/client';
import {
	faCheck,
	faClock,
	faGaugeHigh,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { notFound } from 'next/navigation';

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
		<section>
			<div className="relative min-h-screen bg-[#101014] overflow-hidden">
				<ProjectSlugHeader project={project} />

				<div className="max-w-[1700px] mx-auto px-2.5 mt-12 grid grid-cols-1 lg:grid-cols-4 pr-16 gap-12">
					{/* Left: Editor.js Content */}
					<div className="lg:col-span-3">
						<CodexViewer data={project.content} />
					</div>

					{/* Right: Metadata */}
					<div className="py-5 px-12 border-l-2 border-white/10 text-white space-y-4">
						<div className="flex items-center gap-2 text-white/60">
							<span>
								<FontAwesomeIcon icon={faGaugeHigh} />
							</span>
							<span>{project.difficultyLevel}</span>
						</div>
						<div className="flex items-center gap-2 text-white/60">
							<span>
								<FontAwesomeIcon icon={faClock} />
							</span>
							<span>{project.timeToBuild}</span>
						</div>
						<div>
							<p className="mt-7 mb-3 font-medium text-white/60">
								Components
							</p>
							<div className="space-y-2.5">
								{project.componentsUsed?.map((component, i) => (
									<label
										key={i}
										className="flex items-center gap-2 cursor-pointer text-white/60 text-[14px]"
									>
										<input
											type="checkbox"
											className="hidden peer"
										/>
										<span className="w-5 h-5 rounded-md border border-[#5C5C5E] bg-[#101014] peer-checked:bg-[#27BBFF] peer-checked:border-[#27BBFF] transition-all duration-150 flex items-center justify-center">
											<FontAwesomeIcon
												icon={faCheck}
												className="text-[#101014] text-[11px] hidden peer-checked:block"
											/>
										</span>
										{component}
									</label>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
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
