'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faUser,
	faFolderOpen,
	faHeart,
	faBookmark,
	faBook,
	faGear,
	faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { formatDistanceToNow } from 'date-fns';
import { formatActivityMessage } from '@/lib/activity';

export default function UserDashboardPage() {
	const router = useRouter();
	const session = useSession();
	const supabaseClient = useSupabaseClient();
	const [user, setUser] = useState(null);
	const [activities, setActivities] = useState([]);
	const [loading, setLoading] = useState(true);
	const [totalViews, setTotalViews] = useState(0);

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
				let totalUserViews = 0;

				if (authUser) {
					const { data: profile, error: profileError } =
						await supabaseClient
							.from('User')
							.select('*')
							.eq('email', authUser.email)
							.single();

					if (profileError) {
						// Try fetching by ID as fallback
						const { data: profileById, error: profileByIdError } =
							await supabaseClient
								.from('User')
								.select('*')
								.eq('id', authUser.id)
								.single();

						if (!profileByIdError) {
							userProfile = profileById;
						}
					} else {
						userProfile = profile;
					}

					// Fetch total views (ensure RLS policy allows this)
					try {
						const { data: projects, error: projectsError } =
							await supabaseClient
								.from('Project')
								.select('views')
								.eq('authorId', authUser.id);

						if (projectsError) {
							throw new Error(
								`Projects error: ${projectsError.message}`
							);
						}
						if (projects) {
							totalUserViews = projects.reduce((sum, project) => {
								const views = project.views
									? Number(project.views)
									: 0;
								return sum + views;
							}, 0);
						}
					} catch (viewError) {
						// Continue even if views fail to load
					}
					setTotalViews(totalUserViews);

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
						username: userProfile?.username,
						created_at:
							userProfile?.created_at ||
							(authUser.created_at
								? new Date(authUser.created_at).toISOString()
								: null),
						...userProfile,
					});
				} else {
					// This case should ideally not be reached if session exists
					setUser(null);
					router.push('/signin');
				}

				// Fetch user activities (can run concurrently or after setting user)
				const response = await fetch('/api/user/activities?limit=10');
				if (!response.ok) throw new Error('Failed to fetch activities');
				const activityData = await response.json();
				setActivities(activityData);
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
	}, [session, supabaseClient, router]); // Depend on the session object

	const handleSignOut = async () => {
		await supabaseClient.auth.signOut();
		router.push('/');
	};

	const formatDate = (date) => {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

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
		<div className="min-h-screen bg-[#101014]">
			<div className="max-w-[1700px] mx-auto px-8 sm:px-16 py-16">
				<div className="flex">
					{/* Sidebar */}
					<div className="w-[280px] pt-24 pr-8">
						<div className="flex flex-col items-center mb-8">
							<div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-[#3A3A3C]/60 mb-4">
								<Image
									src={user.image || '/default-avatar.png'}
									alt={user.name}
									width={96}
									height={96}
									className="object-cover w-full h-full"
								/>
							</div>
							<h2 className="text-xl font-bold text-white mb-1">
								{user.name}
							</h2>
							<p className="text-sm text-white/60">
								@{user.username}
							</p>
						</div>

						<nav className="space-y-2">
							<Link
								href="/dashboard"
								className="flex items-center gap-3 px-4 py-2.5 text-[#101014] bg-[#27BBFF] rounded-lg font-medium"
							>
								<FontAwesomeIcon icon={faUser} />
								Overview
							</Link>
							<Link
								href="/dashboard/projects"
								className="flex items-center gap-3 px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
							>
								<FontAwesomeIcon icon={faFolderOpen} />
								My Projects
							</Link>
							<Link
								href="/dashboard/liked"
								className="flex items-center gap-3 px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
							>
								<FontAwesomeIcon icon={faHeart} />
								Liked Projects
							</Link>
							<Link
								href="/dashboard/saved"
								className="flex items-center gap-3 px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
							>
								<FontAwesomeIcon icon={faBookmark} />
								Saved Projects
							</Link>
							<Link
								href="/dashboard/learning"
								className="flex items-center gap-3 px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
							>
								<FontAwesomeIcon icon={faBook} />
								Learning Progress
							</Link>
							<Link
								href="/dashboard/settings"
								className="flex items-center gap-3 px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
							>
								<FontAwesomeIcon icon={faGear} />
								Settings
							</Link>
							<button
								onClick={handleSignOut}
								className="cursor-pointer flex items-center gap-3 px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors w-full"
							>
								<FontAwesomeIcon icon={faRightFromBracket} />
								Sign Out
							</button>
						</nav>
					</div>

					{/* Main Content */}
					<div className="flex-1 pt-24">
						<div className="mb-8">
							<h1 className="text-[44px] font-black text-white mb-2">
								Account Dashboard
							</h1>
						</div>

						{/* Welcome Section */}
						<div className="rounded-2xl mb-8 ">
							<div className="flex items-start justify-between">
								<div>
									<h2 className="text-2xl font-bold text-white mb-2">
										Welcome back, {user.name} 👋
									</h2>
									<p className="text-white/60">
										{totalViews > 0
											? `Keep contributing! Your work has inspired ${totalViews} people.`
											: 'Share your projects to inspire people!'}
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
						<div className="bg-[#13151A] rounded-2xl p-8 border border-[#3A3A3C]/60">
							<h2 className="text-xl font-bold text-white mb-6">
								Recent Activity
							</h2>
							<div className="overflow-x-auto">
								<table className="w-full">
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
										{activities.map((activity, index) => (
											<tr
												key={activity.id}
												className={`${
													index !==
													activities.length - 1
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
																activity.project
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
										))}
										{activities.length === 0 && (
											<tr>
												<td
													colSpan={3}
													className="py-8 text-center text-white/60"
												>
													You haven't done anything
													yet — get started by viewing
													a project!
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
