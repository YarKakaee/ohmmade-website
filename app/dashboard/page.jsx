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

	useEffect(() => {
		const fetchData = async () => {
			try {
				const { data } = await supabaseClient.auth.getSession();
				if (!data.session?.user) {
					router.push('/login');
					return;
				}

				const { user: authUser } = data.session;
				if (authUser) {
					const { data: profile } = await supabaseClient
						.from('profiles')
						.select('*')
						.eq('id', authUser.id)
						.single();

					console.log('Auth user:', authUser);
					console.log('Profile:', profile);

					setUser({
						...authUser,
						...profile,
						name:
							profile?.name ||
							authUser.user_metadata?.name ||
							'User',
						image:
							profile?.avatar_url ||
							authUser.user_metadata?.avatar_url,
						username:
							profile?.username ||
							authUser.user_metadata?.username,
						created_at: authUser.iat
							? new Date(authUser.iat * 1000).toISOString()
							: null,
					});
				}

				// Fetch user activities
				const response = await fetch('/api/user/activities?limit=10');
				if (!response.ok) throw new Error('Failed to fetch activities');
				const activityData = await response.json();
				setActivities(activityData);
			} catch (err) {
				console.error('Failed to fetch user data:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [router, supabaseClient]);

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
		console.log('getMemberDuration input:', createdAt);
		if (!createdAt) return 'New member';

		const date = new Date(createdAt);
		console.log('Parsed date:', date);
		if (isNaN(date.getTime())) return 'New member';

		return date.toLocaleDateString('en-US', {
			month: 'long',
			year: 'numeric',
		});
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
			<div className="max-w-[1700px] mx-auto px-8 sm:px-16">
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
								@{user.username || user.name?.toLowerCase()}
							</p>
						</div>

						<nav className="space-y-2">
							<Link
								href="/dashboard"
								className="flex items-center gap-3 px-4 py-2.5 text-white bg-[#27BBFF] rounded-lg font-medium"
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
						<div className="bg-[#1C1C20] rounded-2xl p-8 mb-8 border border-[#3A3A3C]/60">
							<div className="flex items-start justify-between">
								<div>
									<h2 className="text-2xl font-bold text-white mb-2">
										👋 Welcome back, {user.name}!
									</h2>
									<p className="text-white/60">
										Keep building! You've helped {182}{' '}
										people this week.
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
						<div className="bg-[#1C1C20] rounded-2xl p-8 border border-[#3A3A3C]/60">
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
												Date
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
													{formatDistanceToNow(
														new Date(
															activity.createdAt
														),
														{ addSuffix: true }
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
													No recent activity
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
