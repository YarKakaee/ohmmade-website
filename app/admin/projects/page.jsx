'use client';

import { useState, useEffect } from 'react';
import AdminTable from '@/app/components/AdminTable';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const router = useRouter();
	const supabase = createClientComponentClient();

	useEffect(() => {
		checkAuth();
		fetchProjects();
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

	const fetchProjects = async () => {
		try {
			const response = await fetch('/api/admin/projects');
			if (!response.ok) {
				throw new Error('Failed to fetch projects');
			}
			const data = await response.json();
			if (!Array.isArray(data)) {
				throw new Error('Invalid data format received');
			}
			setProjects(data);
		} catch (error) {
			console.error('Error fetching projects:', error);
			setError(error.message || 'Failed to fetch projects');
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (project) => {
		if (!confirm(`Are you sure you want to delete "${project.title}"?`))
			return;

		try {
			const response = await fetch(`/api/admin/projects/${project.id}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				setProjects(projects.filter((p) => p.id !== project.id));
			} else {
				throw new Error('Failed to delete project');
			}
		} catch (error) {
			console.error('Error deleting project:', error);
			setError(error.message || 'Failed to delete project');
		}
	};

	const handleEdit = (project) => {
		// Implement edit functionality
		console.log('Edit project:', project);
	};

	const columns = [
		{ key: 'title', label: 'Title' },
		{ key: 'author.name', label: 'Author' },
		{ key: 'views', label: 'Views' },
		{ key: 'likes', label: 'Likes' },
		{ key: 'createdAt', label: 'Created' },
	];

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
						onClick={fetchProjects}
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
							<h1 className="text-4xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#27BBFF] to-[#FF4D4D]">
								Projects Management
							</h1>
							<p className="text-white/70">
								Manage all projects in the system
							</p>
						</div>
						<Link
							href="/admin/projects/new"
							className="px-4 py-2 bg-[#27BBFF] text-white rounded-lg hover:bg-[#27BBFF]/90 transition-colors"
						>
							Create New Project
						</Link>
					</div>
				</div>

				<AdminTable
					columns={columns}
					data={projects}
					onDelete={handleDelete}
					onEdit={handleEdit}
					type="project"
				/>
			</div>
		</div>
	);
}
