'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faUser,
	faEnvelope,
	faLock,
	faTrash,
	faCamera,
} from '@fortawesome/free-solid-svg-icons';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import DashboardSidebar from '@/app/components/dashboard/DashboardSidebar';
import Footer from '@/app/components/layout/Footer';

export default function SettingsPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const session = useSession();
	const supabaseClient = useSupabaseClient();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState('profile');
	const [formData, setFormData] = useState({
		name: '',
		username: '',
		email: '',
	});
	const [avatarFile, setAvatarFile] = useState(null);
	const [avatarPreview, setAvatarPreview] = useState(null);
	const [isUpdating, setIsUpdating] = useState(false);
	const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' });
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	// Fetch user data
	useEffect(() => {
		if (!session) {
			router.replace('/signin');
			return;
		}

		const fetchUserData = async () => {
			try {
				const response = await fetch(
					`/api/user/profile?email=${session.user.email}`
				);
				if (response.ok) {
					const userData = await response.json();
					setUser(userData);
					setFormData({
						name: userData.name || '',
						username: userData.username || '',
						email: session.user.email || '',
					});
					setAvatarPreview(userData.image);
				}
			} catch (error) {
				console.error('Error fetching user data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, [session, router]);

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
			const reader = new FileReader();
			reader.onloadend = () => {
				setAvatarPreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsUpdating(true);
		setUpdateMessage({ type: '', text: '' });

		try {
			let avatarUrl = formData.image;

			// Upload new avatar if selected
			if (avatarFile) {
				const fileExt = avatarFile.name.split('.').pop();
				const fileName = `${Math.random()}.${fileExt}`;
				const { data: uploadData, error: uploadError } =
					await supabaseClient.storage
						.from('avatars')
						.upload(fileName, avatarFile);

				if (uploadError) throw uploadError;

				avatarUrl = uploadData.path;
			}

			// Update user profile
			const response = await fetch('/api/user/profile', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					image: avatarUrl,
				}),
			});

			if (!response.ok) throw new Error('Failed to update profile');

			setUpdateMessage({
				type: 'success',
				text: 'Settings updated successfully!',
			});
		} catch (error) {
			console.error('Error updating settings:', error);
			setUpdateMessage({
				type: 'error',
				text: 'Failed to update settings. Please try again.',
			});
		} finally {
			setIsUpdating(false);
		}
	};

	const handleDeleteAccount = async () => {
		try {
			const response = await fetch('/api/user/delete', {
				method: 'DELETE',
			});

			if (!response.ok) throw new Error('Failed to delete account');

			await supabaseClient.auth.signOut();
			router.push('/');
		} catch (error) {
			console.error('Error deleting account:', error);
			setUpdateMessage({
				type: 'error',
				text: 'Failed to delete account. Please try again.',
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
		<div className="min-h-screen bg-[#101014] flex flex-col">
			<div className="flex-1">
				<div className="max-w-[1700px] mx-auto px-8 sm:px-16 py-16">
					<div className="flex">
						{/* Fixed Sidebar */}
						<div className="fixed h-screen">
							<DashboardSidebar
								user={user}
								currentPath="/dashboard/settings"
							/>
						</div>

						{/* Main Content */}
						<div className="flex-1 pt-24 ml-[280px] pl-16">
							<div>
								<div className="mb-8">
									<h1 className="text-[44px] font-black text-white">
										Settings
									</h1>
								</div>

								{/* Settings Navigation */}
								<div className="flex gap-3 mb-8 overflow-x-auto pb-2">
									{[
										{
											id: 'profile',
											icon: faUser,
											label: 'Profile',
										},
										{
											id: 'account',
											icon: faEnvelope,
											label: 'Account',
										},
										{
											id: 'danger',
											icon: faTrash,
											label: 'Danger Zone',
										},
									].map((tab) => (
										<button
											key={tab.id}
											onClick={() => setActiveTab(tab.id)}
											className={`cursor-pointer flex items-center gap-2 px-6 py-2 rounded-xl whitespace-nowrap transition-all font-semibold shadow-sm border-2 ${
												activeTab === tab.id
													? ' bg-[#27BBFF]  text-[#101014] border-[#27BBFF]'
													: 'bg-[#181A20] text-white/60 border-[#23242A] hover:bg-[#23242A] hover:text-white/80'
											}`}
										>
											<FontAwesomeIcon icon={tab.icon} />
											{tab.label}
										</button>
									))}
								</div>

								{/* Settings Content */}
								<div className="bg-[#13151A] backdrop-blur-lg rounded-2xl p-10 border border-[#3A3A3C]/60 shadow-2xl transition-all duration-300">
									<form onSubmit={handleSubmit}>
										{/* Profile Settings */}
										{activeTab === 'profile' && (
											<div className="space-y-8">
												<div className="flex items-center gap-8">
													<div className="relative">
														<div className="w-28 h-28 rounded-full overflow-hidden bg-[#23242A] border-4 border-[#27BBFF]/30 shadow-lg">
															{avatarPreview ? (
																<Image
																	src={
																		avatarPreview
																	}
																	alt="Profile"
																	width={112}
																	height={112}
																	className="w-full h-full object-cover"
																/>
															) : (
																<div className="w-full h-full flex items-center justify-center text-white/40">
																	<FontAwesomeIcon
																		icon={
																			faUser
																		}
																		className="text-4xl"
																	/>
																</div>
															)}
														</div>
														<label
															htmlFor="avatar"
															className="absolute bottom-2 right-2 bg-[#27BBFF] text-[#101014] p-2 rounded-full cursor-pointer hover:bg-[#27BBFF]/90 border-2 border-white shadow-md transition-colors"
														>
															<FontAwesomeIcon
																icon={faCamera}
															/>
														</label>
														<input
															type="file"
															id="avatar"
															accept="image/*"
															className="hidden"
															onChange={
																handleAvatarChange
															}
														/>
													</div>
													<div className="flex-1">
														<h3 className="text-lg font-semibold text-white mb-2">
															Profile Picture
														</h3>
														<p className="text-white/60 text-sm">
															Upload a new profile
															picture. We support
															JPG, PNG and GIF
															formats.
														</p>
													</div>
												</div>

												<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
													<div>
														<label
															htmlFor="name"
															className="block text-sm font-medium text-white/60 mb-2"
														>
															Display Name
														</label>
														<input
															type="text"
															id="name"
															name="name"
															value={
																formData.name
															}
															onChange={
																handleInputChange
															}
															className="w-full px-5 py-3 bg-[#23242A] border border-[#2C2F36] rounded-lg text-white focus:outline-none focus:border-[#27BBFF] shadow-sm"
														/>
													</div>
													<div>
														<label
															htmlFor="username"
															className="block text-sm font-medium text-white/60 mb-2"
														>
															Username
														</label>
														<input
															type="text"
															id="username"
															name="username"
															value={
																formData.username
															}
															onChange={
																handleInputChange
															}
															className="w-full px-5 py-3 bg-[#23242A] border border-[#2C2F36] rounded-lg text-white focus:outline-none focus:border-[#27BBFF] shadow-sm"
														/>
													</div>
												</div>
											</div>
										)}

										{/* Account Settings */}
										{activeTab === 'account' && (
											<div className="space-y-8">
												<div>
													<label
														htmlFor="email"
														className="block text-sm font-medium text-white/60 mb-2"
													>
														Email Address
													</label>
													<input
														type="email"
														id="email"
														name="email"
														value={formData.email}
														disabled
														className="w-full px-5 py-3 bg-[#23242A] border border-[#2C2F36] rounded-lg text-white/40 cursor-not-allowed shadow-sm"
													/>
													<p className="mt-2 text-sm text-white/40">
														To change your email,
														please contact support.
													</p>
												</div>
												<div>
													<label
														htmlFor="currentPassword"
														className="block text-sm font-medium text-white/60 mb-2"
													>
														Current Password
													</label>
													<input
														type="password"
														id="currentPassword"
														className="w-full px-5 py-3 bg-[#23242A] border border-[#2C2F36] rounded-lg text-white focus:outline-none focus:border-[#27BBFF] shadow-sm"
													/>
												</div>
												<div>
													<label
														htmlFor="newPassword"
														className="block text-sm font-medium text-white/60 mb-2"
													>
														New Password
													</label>
													<input
														type="password"
														id="newPassword"
														className="w-full px-5 py-3 bg-[#23242A] border border-[#2C2F36] rounded-lg text-white focus:outline-none focus:border-[#27BBFF] shadow-sm"
													/>
												</div>
												<div>
													<label
														htmlFor="confirmPassword"
														className="block text-sm font-medium text-white/60 mb-2"
													>
														Confirm New Password
													</label>
													<input
														type="password"
														id="confirmPassword"
														className="w-full px-5 py-3 bg-[#23242A] border border-[#2C2F36] rounded-lg text-white focus:outline-none focus:border-[#27BBFF] shadow-sm"
													/>
												</div>
											</div>
										)}

										{/* Danger Zone */}
										{activeTab === 'danger' && (
											<div className="space-y-8">
												<div className="p-8 bg-gradient-to-r from-red-500/10 to-red-700/10 border border-red-500/20 rounded-xl shadow-lg">
													<h3 className="text-lg font-semibold text-red-500 mb-2">
														Delete Account
													</h3>
													<p className="text-white/60 mb-4">
														Once you delete your
														account, there is no
														going back. Please be
														certain.
													</p>
													{!showDeleteConfirm ? (
														<button
															type="button"
															onClick={() =>
																setShowDeleteConfirm(
																	true
																)
															}
															className="px-6 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors shadow-md"
														>
															Delete Account
														</button>
													) : (
														<div className="flex gap-4">
															<button
																type="button"
																onClick={
																	handleDeleteAccount
																}
																className="px-6 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors shadow-md"
															>
																Yes, delete my
																account
															</button>
															<button
																type="button"
																onClick={() =>
																	setShowDeleteConfirm(
																		false
																	)
																}
																className="px-6 py-2 bg-[#23242A] text-white rounded-lg font-semibold hover:bg-[#2C2F36] transition-colors shadow-md"
															>
																Cancel
															</button>
														</div>
													)}
												</div>
											</div>
										)}

										{/* Update Message */}
										{updateMessage.text && (
											<div
												className={`mt-8 p-4 rounded-lg font-semibold text-center text-lg shadow-md ${
													updateMessage.type ===
													'success'
														? 'bg-green-500/10 border border-green-500/20 text-green-400'
														: 'bg-red-500/10 border border-red-500/20 text-red-400'
												}`}
											>
												{updateMessage.text}
											</div>
										)}

										{/* Save Button */}
										{activeTab !== 'danger' && (
											<div className="mt-10 flex justify-end">
												<button
													type="submit"
													disabled={isUpdating}
													className="px-8 py-3 bg-gradient-to-r from-[#27BBFF] to-[#1FA2FF] text-[#101014] rounded-xl font-bold text-lg shadow-lg hover:from-[#1FA2FF] hover:to-[#27BBFF] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
												>
													{isUpdating
														? 'Saving...'
														: 'Save Changes'}
												</button>
											</div>
										)}
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}
