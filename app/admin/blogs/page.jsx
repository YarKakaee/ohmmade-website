'use client';

import { useState, useEffect } from 'react';
import AdminTable from '@/app/components/AdminTable';
import Link from 'next/link';

export default function BlogsPage() {
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchBlogs();
	}, []);

	const fetchBlogs = async () => {
		try {
			const response = await fetch('/api/admin/blogs');
			const data = await response.json();
			setBlogs(data);
		} catch (error) {
			console.error('Error fetching blogs:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (blog) => {
		if (!confirm(`Are you sure you want to delete "${blog.title}"?`))
			return;

		try {
			const response = await fetch(`/api/admin/blogs/${blog.id}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				setBlogs(blogs.filter((b) => b.id !== blog.id));
			}
		} catch (error) {
			console.error('Error deleting blog:', error);
		}
	};

	const handleEdit = (blog) => {
		// Implement edit functionality
		console.log('Edit blog:', blog);
	};

	const handlePublish = async (blog) => {
		try {
			const response = await fetch(
				`/api/admin/blogs/${blog.id}/publish`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ published: !blog.published }),
				}
			);

			if (response.ok) {
				setBlogs(
					blogs.map((b) =>
						b.id === blog.id ? { ...b, published: !b.published } : b
					)
				);
			}
		} catch (error) {
			console.error('Error updating blog status:', error);
		}
	};

	const columns = [
		{ key: 'title', label: 'Title' },
		{ key: 'author.name', label: 'Author' },
		{ key: 'views', label: 'Views' },
		{ key: 'published', label: 'Status' },
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

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#101014] to-[#1a1a1f] pt-24 pb-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-12 relative">
					<div className="absolute inset-0 bg-gradient-to-r from-[#27BBFF]/20 to-[#FF4D4D]/20 blur-3xl -z-10" />
					<div className="flex justify-between items-center">
						<div>
							<h1 className="text-4xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#27BBFF] to-[#FF4D4D]">
								Blog Posts Management
							</h1>
							<p className="text-white/70">
								Manage all blog posts in the system
							</p>
						</div>
						<Link
							href="/admin/blogs/new"
							className="px-4 py-2 bg-[#27BBFF] text-white rounded-lg hover:bg-[#27BBFF]/90 transition-colors"
						>
							Create New Blog Post
						</Link>
					</div>
				</div>

				<AdminTable
					columns={columns}
					data={blogs}
					onDelete={handleDelete}
					onEdit={handleEdit}
					onPublish={handlePublish}
					onUnpublish={handlePublish}
					type="blog"
				/>
			</div>
		</div>
	);
}
