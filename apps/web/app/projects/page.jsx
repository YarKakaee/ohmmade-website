'use client';

import ProjectCard from '@/app/components/common/ProjectCard';
import categoryColors from '@/lib/constants/categoryColors';
import {
	faCheck,
	faChevronDown,
	faChevronLeft,
	faChevronRight,
	faCirclePlus,
	faFilter,
	faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { Inter_Tight } from 'next/font/google';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import LayoutContainer from '@ohmmade/ui/layout-container';

const interTight = Inter_Tight({ subsets: ['latin'] });

const SkeletonCard = () => (
	<div className="bg-[#1E2025] border border-[#2C2F36] p-6 rounded-2xl animate-pulse">
		<div className="flex flex-col gap-4">
			<div className="w-full h-42 bg-[#2C2F36] rounded-lg" />
			<div className="flex-1">
				<div className="h-5 w-3/4 bg-[#2C2F36] rounded mb-4" />
				<div className="h-4 w-full bg-[#2C2F36] rounded mb-2" />
				<div className="h-4 w-full bg-[#2C2F36] rounded mb-2" />
				<div className="h-4 w-full bg-[#2C2F36] rounded mb-2" />
				<div className="h-4 w-full bg-[#2C2F36] rounded mb-3" />
				<div className="h-3 w-full bg-[#2C2F36] rounded" />
			</div>
		</div>
	</div>
);

export default function ExploreProjectsPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filtersOpen, setFiltersOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
	const [filters, setFilters] = useState({
		category:
			searchParams.get('category')?.split(',').filter(Boolean) || [],
		difficulty:
			searchParams.get('difficulty')?.split(',').filter(Boolean) || [],
		components:
			searchParams.get('components')?.split(',').filter(Boolean) || [],
		languages:
			searchParams.get('languages')?.split(',').filter(Boolean) || [],
		author: searchParams.get('author')?.split(',').filter(Boolean) || [],
	});
	const [sortBy, setSortBy] = useState(
		searchParams.get('sort') || 'trending'
	);
	const [currentPage, setCurrentPage] = useState(
		Number(searchParams.get('page')) || 1
	);
	const [totalItems, setTotalItems] = useState(0);
	const [error, setError] = useState(null);
	const [isInitialLoad, setIsInitialLoad] = useState(true);
	const [pageSize, setPageSize] = useState(12);

	const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'];
	const componentList = [
		'Breadboards',
		'LEDs',
		'Resistors',
		'Capacitors',
		'Buttons',
		'Potentiometers',
		'Buzzers',
		'Ultrasonic Sensors',
		'Servos / Motors',
		'OLED / LCD Displays',
		'Other',
	];
	const languageList = [
		'C',
		'C++',
		'Python / MicroPython',
		'JavaScript',
		'Other',
	];

	// Update URL when filters, sort, or page changes
	useEffect(() => {
		if (isInitialLoad) {
			setIsInitialLoad(false);
			return;
		}

		const params = new URLSearchParams();
		if (searchQuery) params.set('q', searchQuery);
		if (filters.category.length)
			params.set('category', filters.category.join(','));
		if (filters.difficulty.length)
			params.set('difficulty', filters.difficulty.join(','));
		if (filters.components.length)
			params.set('components', filters.components.join(','));
		if (filters.languages.length)
			params.set('languages', filters.languages.join(','));
		if (filters.author.length)
			params.set('author', filters.author.join(','));

		// Always include sort and page parameters
		params.set('sort', sortBy);
		params.set('page', currentPage.toString());

		// Use replace instead of push to avoid adding to history stack
		router.replace(`?${params.toString()}`, { scroll: false });
	}, [searchQuery, filters, sortBy, currentPage, router, isInitialLoad]);

	// Fetch projects with debounce
	useEffect(() => {
		const timer = setTimeout(() => {
			fetchProjects();
		}, 300);

		return () => clearTimeout(timer);
	}, [searchQuery, filters, sortBy, currentPage]);

	const fetchProjects = async () => {
		setLoading(true);
		setError(null);
		try {
			const params = {
				q: searchQuery,
				category: filters.category.join(','),
				difficulty: filters.difficulty.join(','),
				components: filters.components.join(','),
				languages: filters.languages.join(','),
				author: filters.author.join(','),
				sort: sortBy,
				page: currentPage,
				limit: pageSize,
			};

			// Remove empty parameters
			Object.keys(params).forEach((key) => {
				if (!params[key]) delete params[key];
			});

			const res = await axios.get('/api/projects', { params });
			setProjects(res.data?.projects || []);
			setTotalItems(res.data?.total || 0);
		} catch (err) {
			console.error('Failed to fetch:', err);
			setError('Failed to load projects. Please try again later.');
			setProjects([]);
			setTotalItems(0);
		} finally {
			setLoading(false);
		}
	};

	const handleFilterChange = (filterType, value) => {
		setFilters((prev) => {
			const newFilters = {
				...prev,
				[filterType]: prev[filterType].includes(value)
					? prev[filterType].filter((v) => v !== value)
					: [...prev[filterType], value],
			};
			return newFilters;
		});
		setCurrentPage(1);
	};

	const handleSearchChange = (e) => {
		setSearchQuery(e.target.value);
		setCurrentPage(1);
	};

	const handleSortChange = (e) => {
		setSortBy(e.target.value);
		setCurrentPage(1);
	};

	const handleClearFilters = () => {
		setSearchQuery('');
		setFilters({
			category: [],
			difficulty: [],
			components: [],
			languages: [],
			author: [],
		});
		setSortBy('trending');
		setCurrentPage(1);
	};

	const totalPages = Math.ceil(totalItems / pageSize);

	// Add intersection observer for Framer Motion
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('animate-in');
					}
				});
			},
			{
				rootMargin: '0px',
				threshold: 0.1,
			}
		);

		const elements = document.querySelectorAll('.project-card');
		elements.forEach((el) => observer.observe(el));

		return () => {
			elements.forEach((el) => observer.unobserve(el));
		};
	}, [projects]); // Re-run when projects change

	// Add useEffect for handling scroll on page change
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}, [currentPage]);

	const handlePageChange = (page) => {
		const newPage = Math.max(1, Math.min(page, totalPages));
		setCurrentPage(newPage);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<div className="flex flex-col min-h-screen bg-[#101014] overflow-hidden">
			<section className="flex-1 relative w-full pt-16">
				{/* Blurred background */}
				<div
					className="absolute top-[100px] left-1/2 -translate-x-1/2 z-0 w-full max-w-[1500px] h-[500px] bg-center bg-no-repeat bg-cover opacity-40 pointer-events-none select-none"
					style={{
						backgroundImage:
							'url(https://edc-cdn.net/assets/images/bg-header-epic-indies.png)',
						filter: 'blur(60px)',
					}}
				/>

				<LayoutContainer className="pt-8 sm:pt-12 md:pt-16 pb-12 sm:pb-16 md:pb-20 relative z-10">
					<h2
						className={`text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-black mb-3 sm:mb-4 text-white leading-tight ${interTight.className}`}
					>
						Explore Projects
					</h2>
					<p className="text-white/60 mb-6 sm:mb-8 md:mb-10 text-sm sm:text-base">
						Discover a wide range of beginner-friendly electronics
						and coding projects shared by the OhmMade community.
						Learn, build, and get inspired!
					</p>

					{/* Controls */}
					<div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 sm:mb-8">
						<div className="relative flex-1">
							<FontAwesomeIcon
								icon={faSearch}
								className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
							/>
							<input
								type="text"
								value={searchQuery}
								onChange={handleSearchChange}
								placeholder="Filter by keyword..."
								className="bg-[#1E2025] text-white text-sm px-4 py-2 pl-12 rounded-md border border-[#6B6B6D] placeholder:text-white/50 focus:outline-none w-full lg:w-[220px]"
								style={{ fontSize: '16px' }}
							/>
						</div>

						<div className="flex flex-wrap gap-2 sm:gap-4 items-center justify-end">
							<span className="text-white/60 text-xs sm:text-sm hidden lg:block">
								{totalItems} results
							</span>

							{(searchQuery ||
								Object.values(filters).some(
									(arr) => arr.length > 0
								) ||
								sortBy !== 'trending') && (
								<button
									onClick={handleClearFilters}
									className="cursor-pointer text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-md transition flex items-center gap-2 bg-[#34343B] text-[#FFFFFF] hover:brightness-150"
								>
									<span>Clear Filters</span>
									<FontAwesomeIcon
										icon={faFilter}
										className="text-xs sm:text-sm"
									/>
								</button>
							)}

							<button
								onClick={() => setFiltersOpen(!filtersOpen)}
								className={`cursor-pointer text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-md transition flex items-center gap-2 ${
									filtersOpen
										? 'bg-[#27BBFF] text-[#101014]'
										: 'bg-[#34343B] text-[#FFFFFF] hover:brightness-150'
								}`}
							>
								<span>Filters</span>
								<FontAwesomeIcon
									icon={faFilter}
									className="text-xs sm:text-sm"
								/>
							</button>

							<div className="relative">
								<select
									value={sortBy}
									onChange={handleSortChange}
									className="cursor-pointer w-full bg-[#1C1C20] border border-[#3A3A3C]/60 rounded-md px-3 py-2 pr-8 text-white/60 appearance-none focus:outline-none focus:ring-2 focus:ring-[#27BBFF] font-medium text-[12px] sm:text-[14px]"
								>
									<option value="trending">Trending</option>
									<option value="newest">Newest</option>
									<option value="most_liked">
										Most Liked
									</option>
									<option value="most_viewed">
										Most Viewed
									</option>
								</select>
								<div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
									<FontAwesomeIcon
										icon={faChevronDown}
										className="text-white/70 text-sm"
									/>
								</div>
							</div>

							<Link
								href="/projects/publish"
								className="cursor-pointer bg-[#27BBFF] text-[#101014] text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-md hover:brightness-110 transition flex items-center gap-2"
							>
								<FontAwesomeIcon
									icon={faCirclePlus}
									className="text-xs sm:text-sm"
								/>
								Publish
							</Link>
						</div>
					</div>

					{/* Main Content */}
					<div className="flex flex-col lg:flex-row gap-8 sm:gap-12">
						<div
							className={`grid w-full ${
								filtersOpen ? 'lg:w-[78%]' : 'lg:w-full'
							} ${
								filtersOpen
									? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
									: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
							} gap-4 sm:gap-6`}
						>
							<AnimatePresence mode="wait">
								{error ? (
									<div className="col-span-full text-center py-8">
										<p className="text-red-500">{error}</p>
									</div>
								) : loading ? (
									<>
										{[...Array(12)].map((_, i) => (
											<SkeletonCard key={i} />
										))}
									</>
								) : projects.length === 0 ? (
									<div className="col-span-full text-center py-8">
										<p className="text-white/60">
											No projects found matching your
											criteria.
										</p>
									</div>
								) : (
									projects.map((project) => (
										<motion.div
											key={project.id}
											className="project-card"
											initial={{ opacity: 0, y: 20 }}
											whileInView={{ opacity: 1, y: 0 }}
											viewport={{ once: true }}
											transition={{ duration: 0.3 }}
										>
											<ProjectCard
												title={project.title}
												category={project.category}
												description={
													project.description
												}
												imageUrl={project.thumbnailUrl}
												categoryColor={
													categoryColors[
														project.category
													] || '#999999'
												}
												authorName={
													project.author?.name
												}
												authorImage={
													project.author?.image
												}
												authorEmail={
													project.author?.email
												}
												views={project.views}
												likes={project.likes}
												slug={project.slug}
											/>
										</motion.div>
									))
								)}
							</AnimatePresence>
						</div>

						{/* Mobile Filters */}
						{filtersOpen && (
							<div className="lg:hidden w-full mb-6 sm:mb-8">
								<div className="bg-[#1C1C20] border border-[#2C2F36] rounded-lg p-4 sm:p-6">
									<h3 className="text-white text-lg sm:text-[20px] font-bold mb-4 sm:mb-6">
										Filters
									</h3>
									<div className="space-y-4 sm:space-y-6 text-sm">
										{/* Author Filter */}
										<div>
											<p className="mb-3 font-medium text-white">
												Author
											</p>
											<div className="space-y-2">
												<label className="flex items-center gap-2 cursor-pointer text-white/60 text-sm">
													<input
														type="checkbox"
														checked={filters.author.includes(
															'ohmmade'
														)}
														onChange={() =>
															handleFilterChange(
																'author',
																'ohmmade'
															)
														}
														className="hidden peer"
													/>
													<span className="w-5 h-5 rounded-md border border-[#5C5C5E] bg-[#101014] peer-checked:bg-[#27BBFF] peer-checked:border-[#27BBFF] transition-all duration-150 flex items-center justify-center">
														<FontAwesomeIcon
															icon={faCheck}
															className="text-[#101014] text-[11px] hidden peer-checked:block"
														/>
													</span>
													OhmMade
												</label>
												<label className="flex items-center gap-2 cursor-pointer text-white/60 text-sm">
													<input
														type="checkbox"
														checked={filters.author.includes(
															'community'
														)}
														onChange={() =>
															handleFilterChange(
																'author',
																'community'
															)
														}
														className="hidden peer"
													/>
													<span className="w-5 h-5 rounded-md border border-[#5C5C5E] bg-[#101014] peer-checked:bg-[#27BBFF] peer-checked:border-[#27BBFF] transition-all duration-150 flex items-center justify-center">
														<FontAwesomeIcon
															icon={faCheck}
															className="text-[#101014] text-[11px] hidden peer-checked:block"
														/>
													</span>
													Community
												</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Desktop Filters Sidebar */}
						{filtersOpen && (
							<div className="hidden lg:block w-full max-w-[270px] space-y-6 text-sm">
								<h3 className="text-white text-[20px] font-bold">
									Filters
								</h3>
								{/* Author Filter */}
								<div>
									<p className="mb-3 font-medium text-white">
										Author
									</p>
									<div className="space-y-2">
										<label className="flex items-center gap-2 cursor-pointer text-white/60 text-sm">
											<input
												type="checkbox"
												checked={filters.author.includes(
													'ohmmade'
												)}
												onChange={() =>
													handleFilterChange(
														'author',
														'ohmmade'
													)
												}
												className="hidden peer"
											/>
											<span className="w-5 h-5 rounded-md border border-[#5C5C5E] bg-[#101014] peer-checked:bg-[#27BBFF] peer-checked:border-[#27BBFF] transition-all duration-150 flex items-center justify-center">
												<FontAwesomeIcon
													icon={faCheck}
													className="text-[#101014] text-[11px] hidden peer-checked:block"
												/>
											</span>
											OhmMade
										</label>
										<label className="flex items-center gap-2 cursor-pointer text-white/60 text-sm">
											<input
												type="checkbox"
												checked={filters.author.includes(
													'community'
												)}
												onChange={() =>
													handleFilterChange(
														'author',
														'community'
													)
												}
												className="hidden peer"
											/>
											<span className="w-5 h-5 rounded-md border border-[#5C5C5E] bg-[#101014] peer-checked:bg-[#27BBFF] peer-checked:border-[#27BBFF] transition-all duration-150 flex items-center justify-center">
												<FontAwesomeIcon
													icon={faCheck}
													className="text-[#101014] text-[11px] hidden peer-checked:block"
												/>
											</span>
											Community
										</label>
									</div>
								</div>
								{/* Category Filter */}
								<div>
									<p className="mb-3 font-medium text-white">
										Category / Microcontroller
									</p>
									<div className="space-y-2">
										{Object.keys(categoryColors).map(
											(cat) => (
												<label
													key={cat}
													className="flex items-center gap-2 cursor-pointer text-white/60 text-sm"
												>
													<input
														type="checkbox"
														checked={filters.category.includes(
															cat
														)}
														onChange={() =>
															handleFilterChange(
																'category',
																cat
															)
														}
														className="hidden peer"
													/>
													<span className="w-5 h-5 rounded-md border border-[#5C5C5E] bg-[#101014] peer-checked:bg-[#27BBFF] peer-checked:border-[#27BBFF] transition-all duration-150 flex items-center justify-center">
														<FontAwesomeIcon
															icon={faCheck}
															className="text-[#101014] text-[11px] hidden peer-checked:block"
														/>
													</span>
													{cat}
												</label>
											)
										)}
									</div>
								</div>
								{/* Difficulty Filter */}
								<div>
									<p className="mb-3 font-medium text-white">
										Difficulty Level
									</p>
									<div className="space-y-2">
										{difficultyLevels.map((level) => (
											<label
												key={level}
												className="flex items-center gap-2 cursor-pointer text-white/60 text-sm"
											>
												<input
													type="checkbox"
													checked={filters.difficulty.includes(
														level
													)}
													onChange={() =>
														handleFilterChange(
															'difficulty',
															level
														)
													}
													className="hidden peer"
												/>
												<span className="w-5 h-5 rounded-md border border-[#5C5C5E] bg-[#101014] peer-checked:bg-[#27BBFF] peer-checked:border-[#27BBFF] transition-all duration-150 flex items-center justify-center">
													<FontAwesomeIcon
														icon={faCheck}
														className="text-[#101014] text-[11px] hidden peer-checked:block"
													/>
												</span>
												{level}
											</label>
										))}
									</div>
								</div>
								{/* Component Filter */}
								<div>
									<p className="mb-3 font-medium text-white">
										Component(s) Used
									</p>
									<div className="space-y-2">
										{componentList.map((component) => (
											<label
												key={component}
												className="flex items-center gap-2 cursor-pointer text-white/60 text-sm"
											>
												<input
													type="checkbox"
													checked={filters.components.includes(
														component
													)}
													onChange={() =>
														handleFilterChange(
															'components',
															component
														)
													}
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
								{/* Language Filter */}
								<div>
									<p className="mb-3 font-medium text-white">
										Language(s) Used
									</p>
									<div className="space-y-2">
										{languageList.map((language) => (
											<label
												key={language}
												className="flex items-center gap-2 cursor-pointer text-white/60 text-sm"
											>
												<input
													type="checkbox"
													checked={filters.languages.includes(
														language
													)}
													onChange={() =>
														handleFilterChange(
															'languages',
															language
														)
													}
													className="hidden peer"
												/>
												<span className="w-5 h-5 rounded-md border border-[#5C5C5E] bg-[#101014] peer-checked:bg-[#27BBFF] peer-checked:border-[#27BBFF] transition-all duration-150 flex items-center justify-center">
													<FontAwesomeIcon
														icon={faCheck}
														className="text-[#101014] text-[11px] hidden peer-checked:block"
													/>
												</span>
												{language}
											</label>
										))}
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex flex-col items-center gap-3 sm:gap-4 mt-8 sm:mt-12">
							<div className="flex items-center gap-1 sm:gap-2">
								<button
									onClick={() =>
										handlePageChange(currentPage - 1)
									}
									disabled={currentPage === 1}
									className="p-2 rounded-lg bg-[#13151A] border border-[#2C2F36] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1E2025] transition-colors cursor-pointer"
								>
									<FontAwesomeIcon icon={faChevronLeft} />
								</button>
								<div className="flex items-center gap-1">
									{[...Array(totalPages)].map((_, i) => {
										const page = i + 1;
										const isCurrentPage =
											currentPage === page;
										const isNearCurrentPage =
											Math.abs(currentPage - page) <= 2;
										const isFirstPage = page === 1;
										const isLastPage = page === totalPages;

										if (
											isFirstPage ||
											isLastPage ||
											isNearCurrentPage
										) {
											return (
												<button
													key={i}
													onClick={() =>
														handlePageChange(page)
													}
													className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
														isCurrentPage
															? 'bg-[#27BBFF] text-[#101014]'
															: 'bg-[#13151A] border border-[#2C2F36] text-gray-400 hover:bg-[#1E2025]'
													}`}
												>
													{page}
												</button>
											);
										} else if (
											page === currentPage - 3 ||
											page === currentPage + 3
										) {
											return (
												<span
													key={i}
													className="px-4 py-2 text-gray-400"
												>
													...
												</span>
											);
										}
										return null;
									})}
								</div>
								<button
									onClick={() =>
										handlePageChange(currentPage + 1)
									}
									disabled={currentPage === totalPages}
									className="p-2 rounded-lg bg-[#13151A] border border-[#2C2F36] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1E2025] transition-colors cursor-pointer"
								>
									<FontAwesomeIcon icon={faChevronRight} />
								</button>
							</div>
							<p className="text-xs sm:text-sm text-white/60">
								Showing{' '}
								{Math.min(
									(currentPage - 1) * pageSize + 1,
									totalItems
								)}{' '}
								- {Math.min(currentPage * pageSize, totalItems)}{' '}
								of {totalItems} projects
							</p>
						</div>
					)}
				</LayoutContainer>
			</section>
		</div>
	);
}
