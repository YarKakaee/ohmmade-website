'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import ProjectCard from '@/app/components/common/ProjectCard';
import categoryColors from '@/lib/constants/categoryColors';
import DashboardSidebar from '@/app/components/dashboard/DashboardSidebar';

export default function MyProjectsPage() {
	const router = useRouter();
	const session = useSession();
	const supabaseClient = useSupabaseClient();
	const [user, setUser] = useState(null);
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);

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

					// Fetch user's projects
					const projectsRes = await fetch(
						`/api/user/projects?userId=${authUser.id}`
					);
					if (!projectsRes.ok)
						throw new Error('Failed to fetch projects');
					const projectsData = await projectsRes.json();
					setProjects(projectsData);
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
	}, [session, supabaseClient, router]);

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
					{/* Fixed Sidebar */}
					<div className="fixed h-screen">
						<DashboardSidebar
							user={user}
							currentPath="/dashboard/projects"
						/>
					</div>

					{/* Scrollable Main Content */}
					<div className="flex-1 pt-24 ml-[280px] pl-16">
						<div className="flex items-center justify-between mb-8">
							<h1 className="text-[44px] font-black text-white">
								My Projects
							</h1>
							<Link
								href="/projects/publish"
								className="flex items-center gap-2 px-4 py-2 bg-[#27BBFF] text-[#101014] rounded-lg font-medium hover:bg-[#27BBFF]/90 transition-colors"
							>
								<FontAwesomeIcon icon={faPlus} />
								New Project
							</Link>
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
										You haven't created any projects yet.
									</p>
									<Link
										href="/projects/publish"
										className="inline-flex items-center gap-2 px-4 py-2 bg-[#27BBFF] text-[#101014] rounded-lg font-medium hover:bg-[#27BBFF]/90 transition-colors"
									>
										<FontAwesomeIcon icon={faPlus} />
										Create Your First Project
									</Link>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
