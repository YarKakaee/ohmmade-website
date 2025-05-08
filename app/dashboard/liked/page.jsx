'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faPlus,
	faChevronLeft,
	faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import ProjectCard from '@/app/components/common/ProjectCard';
import categoryColors from '@/lib/constants/categoryColors';
import DashboardSidebar from '@/app/components/dashboard/DashboardSidebar';
import Footer from '@/app/components/layout/Footer';

export default function LikedProjectsPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const session = useSession();
	const supabaseClient = useSupabaseClient();
	const [user, setUser] = useState(null);
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(
		Number(searchParams.get('page')) || 1
	);
	const [totalItems, setTotalItems] = useState(0);
	const pageSize = 6;

	// Update URL when page changes
	useEffect(() => {
		const params = new URLSearchParams(searchParams);
		params.set('page', currentPage.toString());
		router.replace(`?${params.toString()}`, { scroll: false });
	}, [currentPage, router, searchParams]);

	useEffect(() => {
		let timeout;
		if (session === undefined || session === null) {
			setLoading(true);
			timeout = setTimeout(() => {
				if (session === undefined || session === null) {
					router.replace('/signin');
				} else {
					setLoading(false);
				}
			}, 500); // 500ms delay
		} else {
			setLoading(false);
			if (!session) {
				router.replace('/signin');
			}
		}
		return () => clearTimeout(timeout);
	}, [session, router]);

	useEffect(() => {
		if (!session && !loading) {
			setLoading(false);
			return;
		}

		if (!session) {
			setLoading(true);
			return;
		}

		const authUser = session.user;

		const fetchData = async () => {
			setLoading(true);
			try {
				let userProfile = null;

				if (authUser) {
					// Fetch user profile from our own API (Prisma DB)
					const response = await fetch(
						`/api/user/profile?email=${authUser.email}`
					);
					if (response.ok) {
						userProfile = await response.json();
					}

					// Set user state using authUser and profile if available
					setUser({
						id: authUser.id,
						email: authUser.email,
						name:
							userProfile?.name ||
							authUser.user_metadata?.name ||
							authUser.email?.split('@')[0] ||
							'User',
						image:
							userProfile?.image ||
							authUser.user_metadata?.avatar_url,
						username: userProfile?.username || 'No username',
						created_at:
							userProfile?.created_at ||
							userProfile?.createdAt ||
							authUser.created_at ||
							(authUser.createdAt
								? new Date(authUser.createdAt).toISOString()
								: null),
						...userProfile,
					});

					// Fetch user's liked projects with pagination
					const projectsRes = await fetch(
						`/api/user/liked-projects?userId=${authUser.id}&page=${currentPage}`
					);
					if (!projectsRes.ok)
						throw new Error('Failed to fetch liked projects');
					const projectsData = await projectsRes.json();
					setProjects(projectsData.projects);
					setTotalItems(projectsData.total);
				} else {
					setUser(null);
					router.push('/signin');
				}
			} catch (err) {
				console.error('Failed to fetch dashboard data:', err);
				setUser(null);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [session, supabaseClient, router, currentPage]);

	const totalPages = Math.ceil(totalItems / pageSize);

	const handlePageChange = (page) => {
		const newPage = Math.max(1, Math.min(page, totalPages));
		setCurrentPage(newPage);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-[#101014] flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#27BBFF]"></div>
			</div>
		);
	}

	if (!user) {
		return null;
	}

	return (
		<div className="min-h-screen bg-[#101014] flex flex-col">
			<div className="flex-1">
				<div className="max-w-[1700px] mx-auto px-8 sm:px-16 py-16">
					<div className="flex">
						{/* Fixed Sidebar */}
						<div className="fixed h-screen">
							<DashboardSidebar
								user={user}
								currentPath="/dashboard/liked"
							/>
						</div>

						{/* Scrollable Main Content */}
						<div className="flex-1 pt-24 ml-[280px] pl-16">
							<div className="flex items-center justify-between mb-8">
								<h1 className="text-[44px] font-black text-white">
									Liked Projects
								</h1>
							</div>

							{/* Projects Grid */}
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
								{projects.length === 0 && (
									<div className="col-span-full text-center py-12">
										<p className="text-white/60 mb-4">
											You haven't liked any projects yet.
										</p>
										<Link
											href="/projects"
											className="inline-flex items-center gap-2 px-4 py-2 bg-[#27BBFF] text-[#101014] rounded-lg font-medium hover:bg-[#27BBFF]/90 transition-colors"
										>
											Browse Projects
										</Link>
									</div>
								)}
							</div>

							{/* Pagination */}
							{totalPages > 1 && (
								<div className="flex flex-col items-center gap-4 mt-12">
									<div className="flex items-center gap-2">
										<button
											onClick={() =>
												handlePageChange(
													currentPage - 1
												)
											}
											disabled={currentPage === 1}
											className="p-2 rounded-lg bg-[#13151A] border border-[#2C2F36] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1E2025] transition-colors cursor-pointer"
										>
											<FontAwesomeIcon
												icon={faChevronLeft}
											/>
										</button>
										<div className="flex items-center gap-1">
											{[...Array(totalPages)].map(
												(_, i) => {
													const page = i + 1;
													const isCurrentPage =
														currentPage === page;
													const isNearCurrentPage =
														Math.abs(
															currentPage - page
														) <= 2;
													const isFirstPage =
														page === 1;
													const isLastPage =
														page === totalPages;

													if (
														isFirstPage ||
														isLastPage ||
														isNearCurrentPage
													) {
														return (
															<button
																key={i}
																onClick={() =>
																	handlePageChange(
																		page
																	)
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
														page ===
															currentPage - 3 ||
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
												}
											)}
										</div>
										<button
											onClick={() =>
												handlePageChange(
													currentPage + 1
												)
											}
											disabled={
												currentPage === totalPages
											}
											className="p-2 rounded-lg bg-[#13151A] border border-[#2C2F36] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1E2025] transition-colors cursor-pointer"
										>
											<FontAwesomeIcon
												icon={faChevronRight}
											/>
										</button>
									</div>
									<p className="text-sm text-white/60">
										Showing{' '}
										{Math.min(
											(currentPage - 1) * pageSize + 1,
											totalItems
										)}{' '}
										-{' '}
										{Math.min(
											currentPage * pageSize,
											totalItems
										)}{' '}
										of {totalItems} projects
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}
