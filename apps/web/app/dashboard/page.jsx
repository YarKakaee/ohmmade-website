'use client';

import LayoutContainer from '@ohmmade/ui/layout-container';
import DashboardSidebar from '@/app/components/dashboard/DashboardSidebar';
import { useAuthModal } from '@ohmmade/providers';
import { formatActivityMessage } from '@/lib/activity';
import {
	faChevronLeft,
	faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	useSessionContext,
	useSupabaseClient,
} from '@supabase/auth-helpers-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UserDashboardPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { session, isLoading } = useSessionContext();
	const supabaseClient = useSupabaseClient();
	const { openAuthModal } = useAuthModal();
	const [user, setUser] = useState(null);
	const [activities, setActivities] = useState([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
	const [total, setTotal] = useState(0);
	const limit = 10;
	const totalPages = Math.ceil(total / limit);

	useEffect(() => {
		if (!isLoading && session === null) {
			router.replace('/');
			setTimeout(() => openAuthModal('login'), 200);
		}
	}, [session, isLoading, router, openAuthModal]);

	useEffect(() => {
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
				} else {
					setUser(null);
				}

				// Fetch user activities with pagination
				const activitiesRes = await fetch(
					`/api/user/activities?page=${page}&limit=${limit}`
				);
				if (!activitiesRes.ok)
					throw new Error('Failed to fetch activities');
				const { activities, total } = await activitiesRes.json();
				setActivities(activities);
				setTotal(total);
			} catch (err) {
				console.error('Failed to fetch dashboard data:', err);
				// Optionally set an error state to show a message to the user
				// setErrorState(err.message);
				setUser(null); // Ensure user is null on error
			} finally {
				setLoading(false);
			}
		};

		fetchData();

		// Cleanup function not strictly necessary here but good practice
		// return () => {};
	}, [session, supabaseClient, router, page]); // Depend on the session object

	// Update URL when page changes
	useEffect(() => {
		const params = new URLSearchParams(searchParams);
		params.set('page', page.toString());
		router.replace(`?${params.toString()}`, { scroll: false });
	}, [page, router, searchParams]);

	const getMemberDuration = (createdAt) => {
		if (!createdAt) return 'New member';

		const date = new Date(createdAt);
		if (isNaN(date.getTime())) return 'New member';

		return date.toLocaleDateString('en-US', {
			month: 'long',
			year: 'numeric',
		});
	};

	const formatActivityTime = (date) => {
		const activityDate = new Date(date);
		const now = new Date();
		const diffInHours =
			(now.getTime() - activityDate.getTime()) / (1000 * 60 * 60);
		const diffInDays = diffInHours / 24;

		if (diffInDays < 1) {
			// Less than 24 hours ago (Today)
			return formatDistanceToNow(activityDate, { addSuffix: true });
		} else if (diffInDays < 2) {
			// Between 24 and 48 hours ago (Yesterday)
			return 'Yesterday';
		} else if (diffInDays <= 7) {
			// Between 2 and 7 days ago
			return formatDistanceToNow(activityDate, { addSuffix: true });
		} else {
			// Older than 7 days
			return activityDate.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
			});
		}
	};

	if (isLoading || loading) {
		return (
			<div className="min-h-screen bg-[#101014] flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#27BBFF]"></div>
			</div>
		);
	}

	if (!session) {
		return <div className="fixed inset-0 bg-[#101014] z-50" />;
	}

	if (!user) {
		return null;
	}

	return (
		<div className="min-h-screen bg-[#101014] flex flex-col">
			<div className="flex-1">
				<LayoutContainer className="py-16">
					<div className="flex">
						{/* Sidebar */}
						<div className="fixed h-screen">
							<DashboardSidebar
								user={user}
								currentPath="/dashboard"
							/>
						</div>

						{/* Main scrollable Content */}
						<div className="flex-1 pt-24 ml-[280px] pl-16">
							<div className="mb-5">
								<h1 className="text-[32px] font-black text-white">
									Account Dashboard
								</h1>
							</div>

							{/* Welcome Section */}
							<div className="rounded-2xl mb-8 ">
								<div className="flex items-start justify-between">
									<div>
										<h2 className="text-xl font-bold text-white mb-2">
											Welcome back, {user.name} 👋
										</h2>
										<p className="text-white/60 text-sm">
											Share your projects to inspire
											people!
										</p>
									</div>
									<div className="text-right">
										<p className="text-sm text-white/60">
											Member since
										</p>
										<p className="text-lg font-semibold text-white">
											{getMemberDuration(user.created_at)}
										</p>
									</div>
								</div>
							</div>

							{/* Recent Activity */}
							<div className="bg-[#13151A] rounded-2xl p-6 border border-[#3A3A3C]/60">
								<h2 className="text-lg font-bold text-white mb-4">
									Recent Activity
								</h2>
								<div className="overflow-x-auto">
									<table className="w-full text-sm">
										<thead>
											<tr className="text-left border-b border-[#3A3A3C]/60">
												<th className="pb-4 text-white/60 font-medium">
													Action
												</th>
												<th className="pb-4 text-white/60 font-medium">
													Project
												</th>
												<th className="pb-4 text-white/60 font-medium">
													When
												</th>
											</tr>
										</thead>
										<tbody className="text-white">
											{activities.map(
												(activity, index) => (
													<tr
														key={activity.id}
														className={`${
															index !==
															activities.length -
																1
																? 'border-b border-[#3A3A3C]/60'
																: ''
														}`}
													>
														<td className="py-4">
															{formatActivityMessage(
																activity
															)}
														</td>
														<td className="py-4">
															{activity.project && (
																<Link
																	href={`/projects/${activity.project.slug}`}
																	className="text-[#27BBFF] hover:underline"
																>
																	{
																		activity
																			.project
																			.title
																	}
																</Link>
															)}
														</td>
														<td className="py-4 text-white/60">
															{formatActivityTime(
																activity.createdAt
															)}
														</td>
													</tr>
												)
											)}
											{activities.length === 0 && (
												<tr>
													<td
														colSpan={3}
														className="py-8 text-center text-white/60"
													>
														You haven't done
														anything yet — get
														started by viewing a
														project!
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
								{totalPages > 1 && (
									<div className="flex flex-col items-center gap-4 mt-12">
										<div className="flex items-center gap-2">
											<button
												onClick={() =>
													setPage(page - 1)
												}
												disabled={page === 1}
												className="p-2 rounded-lg bg-[#13151A] border border-[#2C2F36] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1E2025] transition-colors cursor-pointer"
											>
												<FontAwesomeIcon
													icon={faChevronLeft}
												/>
											</button>
											<div className="flex items-center gap-1">
												{[...Array(totalPages)].map(
													(_, i) => {
														const pageNum = i + 1;
														const isCurrentPage =
															page === pageNum;
														const isNearCurrentPage =
															Math.abs(
																page - pageNum
															) <= 2;
														const isFirstPage =
															pageNum === 1;
														const isLastPage =
															pageNum ===
															totalPages;

														if (
															isFirstPage ||
															isLastPage ||
															isNearCurrentPage
														) {
															return (
																<button
																	key={i}
																	onClick={() =>
																		setPage(
																			pageNum
																		)
																	}
																	className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
																		isCurrentPage
																			? 'bg-[#27BBFF] text-[#101014]'
																			: 'bg-[#13151A] border border-[#2C2F36] text-gray-400 hover:bg-[#1E2025]'
																	}`}
																>
																	{pageNum}
																</button>
															);
														} else if (
															pageNum ===
																page - 3 ||
															pageNum === page + 3
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
													setPage(page + 1)
												}
												disabled={page === totalPages}
												className="p-2 rounded-lg bg-[#13151A] border border-[#2C2F36] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1E2025] transition-colors cursor-pointer"
											>
												<FontAwesomeIcon
													icon={faChevronRight}
												/>
											</button>
										</div>
										{/* <p className="text-sm text-white/60">
											Showing{' '}
											{Math.min(
												(page - 1) * limit + 1,
												total
											)}{' '}
											- {Math.min(page * limit, total)} of{' '}
											{total} activities
										</p> */}
									</div>
								)}
							</div>
						</div>
					</div>
				</LayoutContainer>
			</div>
		</div>
	);
}
