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
	faUpRightFromSquare,
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
	const [initialFormData, setInitialFormData] = useState(null);
	const [initialAvatar, setInitialAvatar] = useState(null);

	// Session refresh logic (must be first)
	useEffect(() => {
		let timeout;
		if (session === undefined || session === null) {
			setLoading(true);
			timeout = setTimeout(() => {
				if (session === undefined || session === null) {
					router.replace('/signin');
				}
			}, 500); // 500ms delay
		}
		return () => clearTimeout(timeout);
	}, [session, router]);

	// Fetch user data only if session is truthy
	useEffect(() => {
		if (!session) return;

		const fetchUserData = async () => {
			try {
				const response = await fetch(
					`/api/user/profile?email=${session.user.email}`
				);
				if (response.ok) {
					const userData = await response.json();
					setUser(userData);
					const formDefaults = {
						name: userData.name || '',
						username: userData.username || '',
						email: session.user.email || '',
					};
					setFormData(formDefaults);
					setInitialFormData(formDefaults);
					setAvatarPreview(userData.image);
					setInitialAvatar(userData.image);
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
						.upload(fileName, avatarFile, {
							cacheControl: '3600',
							upsert: true,
							contentType: avatarFile.type,
						});

				if (uploadError) {
					console.error(
						'Avatar upload error:',
						JSON.stringify(uploadError, null, 2),
						uploadError
					);
					throw uploadError;
				}

				// Get the public URL for the uploaded avatar
				const { data: publicUrlData } = supabaseClient.storage
					.from('avatars')
					.getPublicUrl(uploadData.path);
				avatarUrl = publicUrlData.publicUrl;
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

			if (!response.ok) {
				const errorText = await response.text();
				console.error('Error updating settings:', errorText);
				throw new Error('Failed to update profile');
			}

			// After getting avatarUrl (public URL), update Supabase Auth user_metadata
			await supabaseClient.auth.updateUser({
				data: { avatar_url: avatarUrl },
			});

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

	const hasChanges =
		(initialFormData &&
			(formData.name !== initialFormData.name ||
				formData.username !== initialFormData.username ||
				avatarFile !== null)) ||
		(avatarPreview !== initialAvatar && avatarFile !== null);

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
													: 'bg-[#13151A] text-white/60 border-[#3A3A3C]/60 hover:bg-[#23242A] hover:text-white/80'
											}`}
										>
											<FontAwesomeIcon icon={tab.icon} />
											{tab.label}
										</button>
									))}
								</div>

								{/* Settings Content */}
								{activeTab === 'profile' && (
									<div className="bg-[#13151A] border border-[#3A3A3C]/60 rounded-2xl p-8 shadow-2xl flex flex-col w-full">
										<h2 className="text-2xl font-bold text-white mb-4">
											Profile
										</h2>
										<p className="text-white/60 text-sm mb-10">
											Update your profile picture, display
											name, and username. These will be
											visible on your public profile.
										</p>
										<div className="flex items-stretch gap-5">
											{/* Profile Picture - Centered */}
											<div className="flex flex-col justify-center items-center w-56 min-w-[180px]">
												<div className="relative w-28 h-28 group flex items-center justify-center cursor-pointer">
													<label
														htmlFor="avatar-upload"
														className="w-full h-full block cursor-pointer"
													>
														<div className="w-28 h-28 rounded-full overflow-hidden bg-[#23242A] relative ring-2 ring-[#3A3A3C]/60 shadow-lg flex items-center justify-center">
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
																<div className="w-full h-full flex items-center justify-center bg-[#23242A]">
																	<FontAwesomeIcon
																		icon={
																			faUser
																		}
																		className="text-4xl text-white/40"
																	/>
																</div>
															)}
															<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full flex items-center justify-center">
																<FontAwesomeIcon
																	icon={
																		faCamera
																	}
																	className="text-2xl text-white"
																/>
															</div>
														</div>
														<input
															id="avatar-upload"
															type="file"
															accept="image/*"
															className="hidden"
															onChange={
																handleAvatarChange
															}
														/>
													</label>
												</div>
											</div>
											{/* Fields */}
											<div className="flex-1 flex flex-col gap-8 justify-center">
												{/* Display Name Field */}
												<div>
													<label
														className="block text-white font-semibold mb-1.5"
														htmlFor="display-name"
													>
														Display Name
													</label>

													<input
														id="display-name"
														name="name"
														type="text"
														value={formData.name}
														onChange={
															handleInputChange
														}
														className="w-full bg-[#101014] border border-[#23242A] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#27BBFF] transition-all placeholder-white/30"
														placeholder="Enter your display name"
														autoComplete="off"
													/>
												</div>
												{/* Username Field */}
												<div>
													<label
														className="block text-white font-semibold mb-1.5"
														htmlFor="username"
													>
														Username
													</label>

													<div className="flex items-center bg-[#101014] border border-[#23242A] rounded-lg overflow-hidden focus-within:border-[#27BBFF] transition-all">
														<span className="px-4 py-3 text-white/50 text-sm select-none bg-[#101014] border-r border-[#23242A]">
															ohmmade.ca/u/
														</span>
														<input
															id="username"
															name="username"
															type="text"
															value={
																formData.username
															}
															onChange={
																handleInputChange
															}
															className="flex-1 bg-transparent px-4 py-3 text-white focus:outline-none placeholder-white/30"
															placeholder="your-username"
															autoComplete="off"
															pattern="^[a-zA-Z0-9_]+$"
															maxLength={32}
														/>
													</div>
												</div>
											</div>
										</div>
										{/* Divider and Save Row */}
										<div className="border-t border-[#23242A] mt-10 pt-6 flex items-center justify-between">
											<span className="text-white/60 text-sm font-medium">
												Learn more about{' '}
												<span className="relative inline-block group align-middle">
													<a
														href="/help/profile-settings"
														target="_blank"
														rel="noopener noreferrer"
														className="text-[#27BBFF] text-sm font-medium flex items-center"
													>
														<span className="ml-0.5">
															Profile Settings
														</span>
														<FontAwesomeIcon
															icon={
																faUpRightFromSquare
															}
															className="w-3 h-3 ml-1.5"
														/>
													</a>
													<div className="absolute left-0 right-0 -bottom-0.5 h-[1px] bg-[#27BBFF] scale-x-0 group-hover:scale-x-100 " />
												</span>
											</span>
											<button
												type="button"
												disabled={
													!hasChanges || isUpdating
												}
												onClick={handleSubmit}
												className={`px-6 py-2 rounded-lg font-semibold transition-all text-sm shadow-sm
													${
														hasChanges &&
														!isUpdating
															? 'bg-[#27BBFF] text-[#101014] hover:bg-[#1ea6e6] cursor-pointer'
															: 'bg-[#23242A] text-white/40 cursor-not-allowed'
													}`}
											>
												Save
											</button>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}
