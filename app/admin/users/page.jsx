'use client';

import { useState, useEffect } from 'react';
import AdminTable from '@/app/components/common/AdminTable';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function UsersPage() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const supabase = createClientComponentClient();

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			const response = await fetch('/api/admin/users');
			const data = await response.json();
			setUsers(data);
		} catch (error) {
			console.error('Error fetching users:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (user) => {
		if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;

		try {
			const response = await fetch(`/api/admin/users/${user.id}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				setUsers(users.filter((u) => u.id !== user.id));
			}
		} catch (error) {
			console.error('Error deleting user:', error);
		}
	};

	const handleEdit = (user) => {
		// Implement edit functionality
		console.log('Edit user:', user);
	};

	const columns = [
		{ key: 'name', label: 'Name' },
		{ key: 'email', label: 'Email' },
		{ key: 'createdAt', label: 'Joined' },
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
					<h1 className="text-4xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#27BBFF] to-[#FF4D4D]">
						Users Management
					</h1>
					<p className="text-white/70">
						Manage all users in the system
					</p>
				</div>

				<AdminTable
					columns={columns}
					data={users}
					onDelete={handleDelete}
					onEdit={handleEdit}
					type="user"
				/>
			</div>
		</div>
	);
}
