'use client';

import ProjectCard from '@/app/components/projects/ProjectCard';
import categoryColors from '@/lib/constants/categoryColors';
import { Inter_Tight } from 'next/font/google';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faChevronDown,
	faCirclePlus,
	faFilter,
} from '@fortawesome/free-solid-svg-icons';
import { LayoutGrid, List } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const interTight = Inter_Tight({ subsets: ['latin'] });

export default function ExploreProjectsPage() {
	const [projects, setProjects] = useState([]);
	const [filtersOpen, setFiltersOpen] = useState(false);

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const res = await axios.get('/api/projects');
				setProjects(res.data);
			} catch (err) {
				console.error('Failed to fetch:', err);
			}
		};
		fetchProjects();
	}, []);

	return (
		<div className="relative min-h-screen bg-[#101014] overflow-hidden">
			<section className="relative w-full pt-16 px-8 sm:px-16 lg:px-24">
				{/* Blurred background */}
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
					<p className="text-white/60 mb-10">
						Discover a wide range of beginner-friendly electronics
						and coding projects shared by the OhmMade community.
						Learn, build, and get inspired!
					</p>

					{/* Controls */}
					<div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
						<input
							type="text"
							placeholder="Filter by keyword..."
							className="bg-[#1E2025] text-white text-sm px-4 py-2 rounded-md border border-[#6B6B6D] placeholder:text-white/50 focus:outline-none w-full lg:w-[220px]"
						/>

						<div className="flex flex-wrap gap-4 items-center justify-end">
							<span className="text-white/60 text-sm hidden lg:block">
								{projects.length} results
							</span>

							<button
								onClick={() => setFiltersOpen(!filtersOpen)}
								className={`cursor-pointer text-sm font-medium px-4 py-2 rounded-md transition flex items-center gap-2 ${
									filtersOpen
										? 'bg-[#27BBFF] text-[#101014]'
										: 'bg-[#34343B] text-[#FFFFFF] hover:brightness-150'
								}`}
							>
								<span>Filters</span>
								<FontAwesomeIcon
									icon={faFilter}
									className="text-sm"
								/>
							</button>

							<div className="relative">
								<select className="cursor-pointer w-full bg-[#1E2025] border border-[#6B6B6D] rounded-md px-3 py-2 pr-8 text-white/50 appearance-none focus:outline-none focus:ring-2 focus:ring-[#27BBFF] font-medium text-[14px]">
									<option>Trending</option>
									<option>Newest</option>
									<option>Most Liked</option>
								</select>
								<div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
									<FontAwesomeIcon
										icon={faChevronDown}
										className="text-white/70 text-sm"
									/>
								</div>
							</div>

							<button className="cursor-pointer bg-[#27BBFF] text-[#101014] text-sm font-medium px-4 py-2 rounded-md hover:brightness-110 transition flex items-center gap-2">
								<FontAwesomeIcon
									icon={faCirclePlus}
									className="text-sm"
								/>
								Publish
							</button>

							<div className="flex gap-3">
								<button className="cursor-pointer p-2.5 rounded-md bg-[#34343B] text-white hover:brightness-150 transition">
									<LayoutGrid strokeWidth="1.4" size="16" />
								</button>
								<button className="cursor-pointer p-2 rounded-md bg-[#34343B] text-white hover:brightness-150 transition">
									<List strokeWidth="1.4" size="20" />
								</button>
							</div>
						</div>
					</div>

					{/* Main Content */}
					<div className="flex flex-col lg:flex-row gap-8">
						<div
							className={`grid w-full ${
								filtersOpen
									? 'lg:w-[78%] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
									: 'lg:w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
							} gap-6`}
						>
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

						{/* Filters Sidebar */}
						{filtersOpen && (
							<div className="hidden lg:block w-full max-w-[270px] space-y-6 text-white/80 text-sm">
								<h3 className="text-white text-base font-semibold">
									Filters
								</h3>
								{/* Author Filter */}
								<div>
									<p className="mb-2 font-medium">Author</p>
									<div className="space-y-1">
										<label className="block">
											<input
												type="checkbox"
												className="mr-2"
											/>
											OhmMade
										</label>
										<label className="block">
											<input
												type="checkbox"
												className="mr-2"
											/>
											Community
										</label>
									</div>
								</div>
								{/* Category Filter */}
								<div>
									<p className="mb-2 font-medium">
										Category / Microcontroller
									</p>
									<div className="space-y-1">
										{Object.keys(categoryColors).map(
											(cat) => (
												<label
													key={cat}
													className="block"
												>
													<input
														type="checkbox"
														className="mr-2"
													/>
													{cat}
												</label>
											)
										)}
									</div>
								</div>
								{/* Difficulty Filter */}
								<div>
									<p className="mb-2 font-medium">
										Difficulty
									</p>
									<div className="space-y-1">
										{[
											'Beginner',
											'Intermediate',
											'Advanced',
										].map((level) => (
											<label
												key={level}
												className="block"
											>
												<input
													type="checkbox"
													className="mr-2"
												/>
												{level}
											</label>
										))}
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</section>
		</div>
	);
}
