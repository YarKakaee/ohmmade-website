'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faUser,
	faEnvelope,
	faLock,
	faImage,
	faHeart,
	faEdit,
	faUpload,
	faSave,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { motion } from 'framer-motion';
import ProjectCard from '@/app/components/projects/ProjectCard';
import { checkSession } from '@/lib/auth';
import categoryColors from '@/lib/constants/categoryColors';

export default function UserProfilePage() {
	const router = useRouter();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState('published');
	const [publishedProjects, setPublishedProjects] = useState([]);
	const [likedProjects, setLikedProjects] = useState([]);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});
	const [avatarFile, setAvatarFile] = useState(null);
	const [avatarPreview, setAvatarPreview] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const session = await checkSession();
				if (!session) {
					router.push('/login');
					return;
				}

				const [userRes, publishedRes, likedRes] = await Promise.all([
					axios.get('/api/user/profile'),
					axios.get('/api/user/projects'),
					axios.get('/api/user/liked-projects'),
				]);

				setUser(userRes.data);
				setPublishedProjects(publishedRes.data || []);
				setLikedProjects(likedRes.data || []);
				setFormData({
					name: userRes.data.name,
					email: userRes.data.email,
					currentPassword: '',
					newPassword: '',
					confirmPassword: '',
				});
				setAvatarPreview(userRes.data.image);
			} catch (err) {
				console.error('Failed to fetch user data:', err);
				setError('Failed to load user data. Please try again later.');
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, [router]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleAvatarChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setAvatarFile(file);
			setAvatarPreview(URL.createObjectURL(file));
		}
	};

	const handleProfileSave = async () => {
		try {
			const formDataToSend = new FormData();
			formDataToSend.append('name', formData.name);
			formDataToSend.append('email', formData.email);
			if (avatarFile) formDataToSend.append('avatar', avatarFile);

			await axios.put('/api/user/profile', formDataToSend, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			setSuccess('Profile updated successfully');
			// Refresh user data
			const userRes = await axios.get('/api/user/profile');
			setUser(userRes.data);
			setAvatarPreview(userRes.data.image);
		} catch (err) {
			console.error('Failed to update profile:', err);
			setError(err.response?.data?.message || 'Failed to update profile');
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-[#101014] flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#27BBFF]"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#101014] pt-24 pb-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Dashboard Title */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-white mb-2">
						User Dashboard
					</h1>
					<p className="text-white/60">
						Manage your profile and projects
					</p>
				</div>

				{/* Profile Header */}
				<div className="bg-[#1C1C20] rounded-2xl p-8 mb-8">
					<div className="flex flex-col md:flex-row items-center gap-8">
						<div className="relative group">
							<div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-[#27BBFF]/20">
								<Image
									src={avatarPreview || '/default-avatar.png'}
									alt={user.name}
									width={128}
									height={128}
									className="object-cover w-full h-full"
								/>
							</div>
							{isEditing && (
								<label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer transition-opacity opacity-0 group-hover:opacity-100">
									<input
										type="file"
										accept="image/*"
										onChange={handleAvatarChange}
										className="hidden"
									/>
									<FontAwesomeIcon
										icon={faUpload}
										className="text-white text-2xl"
									/>
								</label>
							)}
						</div>
						<div className="flex-1 text-center md:text-left">
							{isEditing ? (
								<div className="flex items-center gap-2">
									<input
										type="text"
										name="name"
										value={formData.name}
										onChange={handleInputChange}
										className="bg-[#2C2F36] text-white text-2xl font-bold px-4 py-2 rounded-lg w-full md:w-auto"
									/>
									<button
										onClick={handleProfileSave}
										className="bg-[#27BBFF] text-[#101014] p-2 rounded-lg hover:brightness-110 transition"
									>
										<FontAwesomeIcon icon={faSave} />
									</button>
								</div>
							) : (
								<h2 className="text-2xl font-bold text-white">
									{user.name}
								</h2>
							)}
							<div className="mt-2 flex items-center justify-center md:justify-start gap-4 text-white/60">
								<div className="flex items-center gap-2">
									<FontAwesomeIcon icon={faEnvelope} />
									{isEditing ? (
										<div className="flex items-center gap-2">
											<input
												type="email"
												name="email"
												value={formData.email}
												onChange={handleInputChange}
												className="bg-[#2C2F36] text-white px-3 py-1 rounded-lg"
											/>
											<button
												onClick={handleProfileSave}
												className="bg-[#27BBFF] text-[#101014] p-2 rounded-lg hover:brightness-110 transition"
											>
												<FontAwesomeIcon
													icon={faSave}
												/>
											</button>
										</div>
									) : (
										<span>{user.email}</span>
									)}
								</div>
							</div>
						</div>
						<button
							onClick={() => setIsEditing(!isEditing)}
							className="bg-[#27BBFF] text-[#101014] px-6 py-2 rounded-lg font-medium hover:brightness-110 transition"
						>
							{isEditing ? 'Cancel' : 'Edit Profile'}
						</button>
					</div>
				</div>

				{/* Edit Form */}
				{isEditing && (
					<motion.form
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-[#1C1C20] rounded-2xl p-8 mb-8"
						onSubmit={handleProfileSave}
					>
						<h2 className="text-xl font-bold text-white mb-6">
							Update Profile
						</h2>
						{error && (
							<div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
								{error}
							</div>
						)}
						{success && (
							<div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg mb-6">
								{success}
							</div>
						)}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-white/60 mb-2">
									Current Password
								</label>
								<div className="relative">
									<FontAwesomeIcon
										icon={faLock}
										className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40"
									/>
									<input
										type="password"
										name="currentPassword"
										value={formData.currentPassword}
										onChange={handleInputChange}
										className="w-full bg-[#2C2F36] text-white px-4 pl-10 py-2 rounded-lg"
										placeholder="Enter current password"
									/>
								</div>
							</div>
							<div>
								<label className="block text-white/60 mb-2">
									New Password
								</label>
								<div className="relative">
									<FontAwesomeIcon
										icon={faLock}
										className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40"
									/>
									<input
										type="password"
										name="newPassword"
										value={formData.newPassword}
										onChange={handleInputChange}
										className="w-full bg-[#2C2F36] text-white px-4 pl-10 py-2 rounded-lg"
										placeholder="Enter new password"
									/>
								</div>
							</div>
							<div>
								<label className="block text-white/60 mb-2">
									Confirm New Password
								</label>
								<div className="relative">
									<FontAwesomeIcon
										icon={faLock}
										className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40"
									/>
									<input
										type="password"
										name="confirmPassword"
										value={formData.confirmPassword}
										onChange={handleInputChange}
										className="w-full bg-[#2C2F36] text-white px-4 pl-10 py-2 rounded-lg"
										placeholder="Confirm new password"
									/>
								</div>
							</div>
						</div>
						<div className="mt-6 flex justify-end gap-4">
							<button
								type="button"
								onClick={() => setIsEditing(false)}
								className="px-6 py-2 text-white/60 hover:text-white transition"
							>
								Cancel
							</button>
							<button
								type="submit"
								className="bg-[#27BBFF] text-[#101014] px-6 py-2 rounded-lg font-medium hover:brightness-110 transition"
							>
								Save Changes
							</button>
						</div>
					</motion.form>
				)}

				{/* Projects Section */}
				<div className="rounded-2xl p-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-bold text-white">
							My Projects
						</h2>
						<div className="flex gap-2">
							<button
								onClick={() => setActiveTab('published')}
								className={`px-4 py-2 rounded-lg transition ${
									activeTab === 'published'
										? 'bg-[#27BBFF] text-[#101014]'
										: 'bg-[#2C2F36] text-white/60 hover:brightness-110'
								}`}
							>
								Published
							</button>
							<button
								onClick={() => setActiveTab('liked')}
								className={`px-4 py-2 rounded-lg transition ${
									activeTab === 'liked'
										? 'bg-[#27BBFF] text-[#101014]'
										: 'bg-[#2C2F36] text-white/60 hover:brightness-110'
								}`}
							>
								Liked
							</button>
						</div>
					</div>

					{activeTab === 'published' ? (
						publishedProjects.length > 0 ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
								{publishedProjects.map((project) => (
									<ProjectCard
										key={project.id}
										title={project.title}
										description={project.description}
										imageUrl={project.imageUrl}
										views={project.views}
										likes={project.likes}
										slug={project.slug}
										authorName={project.authorName}
										authorImage={project.authorImage}
										authorEmail={project.authorEmail}
										category={project.category}
										categoryColor={
											categoryColors[project.category] ||
											categoryColors.Other
										}
									/>
								))}
							</div>
						) : (
							<div className="text-center py-12">
								<p className="text-white/60">
									You haven't published any projects yet.
								</p>
								<button
									onClick={() =>
										router.push('/projects/publish')
									}
									className="mt-4 bg-[#27BBFF] text-[#101014] px-6 py-2 rounded-lg font-medium hover:brightness-110 transition"
								>
									Publish Your First Project
								</button>
							</div>
						)
					) : likedProjects.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{likedProjects.map((project) => (
								<ProjectCard
									key={project.id}
									title={project.title}
									description={project.description}
									imageUrl={project.imageUrl}
									views={project.views}
									likes={project.likes}
									slug={project.slug}
									authorName={project.authorName}
									authorImage={project.authorImage}
									authorEmail={project.authorEmail}
									category={project.category}
									categoryColor={
										categoryColors[project.category] ||
										categoryColors.Other
									}
								/>
							))}
						</div>
					) : (
						<div className="text-center py-12">
							<p className="text-white/60">
								You haven't liked any projects yet.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
