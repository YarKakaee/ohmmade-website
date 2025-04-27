'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
	const [stats, setStats] = useState({
		totalProjects: 0,
		totalBlogs: 0,
		totalUsers: 0,
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const router = useRouter();
	const supabase = createClientComponentClient();

	useEffect(() => {
		checkAuth();
		fetchStats();
	}, []);

	const checkAuth = async () => {
		try {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			if (!session) {
				router.push('/login');
				return;
			}

			// Check if user is admin using the API
			const response = await fetch('/api/admin/check-auth');
			if (!response.ok) {
				router.push('/');
				return;
			}
		} catch (error) {
			console.error('Auth check error:', error);
			router.push('/login');
		}
	};

	const fetchStats = async () => {
		try {
			const [projectsRes, blogsRes, usersRes] = await Promise.all([
				fetch('/api/admin/projects'),
				fetch('/api/admin/blogs'),
				fetch('/api/admin/users'),
			]);

			if (!projectsRes.ok || !blogsRes.ok || !usersRes.ok) {
				throw new Error('Failed to fetch statistics');
			}

			const [projects, blogs, users] = await Promise.all([
				projectsRes.json(),
				blogsRes.json(),
				usersRes.json(),
			]);

			// Check if the responses are arrays
			if (
				!Array.isArray(projects) ||
				!Array.isArray(blogs) ||
				!Array.isArray(users)
			) {
				throw new Error('Invalid data format received');
			}

			setStats({
				totalProjects: projects.length,
				totalBlogs: blogs.length,
				totalUsers: users.length,
			});
		} catch (err) {
			console.error('Error fetching stats:', err);
			setError(err.message || 'Failed to fetch statistics');
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-[#101014] to-[#1a1a1f] pt-24 pb-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-white">Loading...</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-[#101014] to-[#1a1a1f] pt-24 pb-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-red-500">{error}</div>
					<button
						onClick={fetchStats}
						className="mt-4 px-4 py-2 bg-[#27BBFF] text-white rounded-lg hover:bg-[#27BBFF]/90 transition-colors"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#101014] to-[#1a1a1f] pt-24 pb-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-12 relative">
					<div className="absolute inset-0 bg-gradient-to-r from-[#27BBFF]/20 to-[#FF4D4D]/20 blur-3xl -z-10" />
					<div className="flex justify-between items-center">
						<div>
							<h1 className="text-4xl font-bold text-white mb-4 bg-clip-text bg-gradient-to-r from-[#27BBFF] to-[#FF4D4D]">
								Admin Dashboard
							</h1>
							<p className="text-white/70">
								Welcome to the admin dashboard
							</p>
						</div>
						<Link
							href="/"
							className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
						>
							Back to Site
						</Link>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
					<Link
						href="/admin/projects"
						className="group relative bg-[#1C1C20]/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:border-[#27BBFF]/50 hover:shadow-[0_0_30px_rgba(39,187,255,0.1)]"
					>
						<div className="absolute inset-0 bg-gradient-to-br from-[#27BBFF]/5 to-[#FF4D4D]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
						<h2 className="text-2xl font-bold text-white mb-2">
							Projects
						</h2>
						<p className="text-4xl font-bold text-white mb-2">
							{stats.totalProjects}
						</p>
						<p className="text-white/70">
							Total projects in the system
						</p>
					</Link>

					<Link
						href="/admin/blogs"
						className="group relative bg-[#1C1C20]/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:border-[#27BBFF]/50 hover:shadow-[0_0_30px_rgba(39,187,255,0.1)]"
					>
						<div className="absolute inset-0 bg-gradient-to-br from-[#27BBFF]/5 to-[#FF4D4D]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
						<h2 className="text-2xl font-bold text-white mb-2">
							Blog Posts
						</h2>
						<p className="text-4xl font-bold text-white mb-2">
							{stats.totalBlogs}
						</p>
						<p className="text-white/70">
							Total blog posts in the system
						</p>
					</Link>

					<Link
						href="/admin/users"
						className="group relative bg-[#1C1C20]/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:border-[#27BBFF]/50 hover:shadow-[0_0_30px_rgba(39,187,255,0.1)]"
					>
						<div className="absolute inset-0 bg-gradient-to-br from-[#27BBFF]/5 to-[#FF4D4D]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
						<h2 className="text-2xl font-bold text-white mb-2">
							Users
						</h2>
						<p className="text-4xl font-bold text-white mb-2">
							{stats.totalUsers}
						</p>
						<p className="text-white/70">
							Total users in the system
						</p>
					</Link>
				</div>
			</div>
		</div>
	);
}
