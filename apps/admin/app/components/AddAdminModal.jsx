'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faXmark,
	faUser,
	faEnvelope,
	faUserShield,
	faCrown,
	faUserTie,
	faUserCheck,
	faHeadset,
	faChevronDown,
	faPlus,
} from '@fortawesome/free-solid-svg-icons';
import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';

const AddAdminModal = ({ isOpen, onClose, onSuccess }) => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		role: 'ADMIN',
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setError(null); // Clear error when user types
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const response = await fetch('/api/admin/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			const result = await response.json();

			if (!response.ok) {
				setError(result.error || 'Failed to create admin');
				return;
			}

			// Success - reset form and close modal
			setFormData({ name: '', email: '', role: 'ADMIN' });
			onSuccess(result.admin);
			onClose();
		} catch (err) {
			console.error('Error creating admin:', err);
			setError('An unexpected error occurred');
		} finally {
			setLoading(false);
		}
	};

	const getRoleIcon = (role) => {
		const icons = {
			SUPER_ADMIN: faCrown,
			ADMIN: faUserTie,
			MODERATOR: faUserCheck,
			SUPPORT: faHeadset,
		};
		return icons[role] || faUserShield;
	};

	const getRoleColor = (role) => {
		const colors = {
			SUPER_ADMIN: 'text-red-400',
			ADMIN: 'text-blue-400',
			MODERATOR: 'text-green-400',
			SUPPORT: 'text-yellow-400',
		};
		return colors[role] || 'text-gray-400';
	};

	const getRoleBgColor = (role) => {
		const colors = {
			SUPER_ADMIN: 'bg-red-500/10 border-red-500/20',
			ADMIN: 'bg-blue-500/10 border-blue-500/20',
			MODERATOR: 'bg-green-500/10 border-green-500/20',
			SUPPORT: 'bg-yellow-500/10 border-yellow-500/20',
		};
		return colors[role] || 'bg-gray-500/10 border-gray-500/20';
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<Dialog.Root open={isOpen} onOpenChange={onClose}>
					<Dialog.Portal forceMount>
						<Dialog.Overlay asChild>
							<motion.div
								className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999]"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2 }}
							/>
						</Dialog.Overlay>
						<Dialog.Content asChild>
							<motion.div
								className="fixed left-[50%] top-[50%] z-[10000] w-full max-w-[500px] translate-x-[-50%] translate-y-[-50%] p-4"
								initial={{ opacity: 0, scale: 0.95, y: -20 }}
								animate={{
									opacity: 1,
									scale: 1,
									y: 0,
									transition: {
										type: 'spring',
										duration: 0.5,
										bounce: 0.3,
									},
								}}
								exit={{
									opacity: 0,
									scale: 0.95,
									y: 10,
									transition: {
										duration: 0.2,
									},
								}}
							>
								<div className="bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] backdrop-blur-lg rounded-2xl p-8 relative border border-gray-700/30 shadow-xl">
									<Dialog.Close className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
										<FontAwesomeIcon
											icon={faXmark}
											size="lg"
										/>
									</Dialog.Close>

									<div className="flex flex-col items-center mb-6 mt-4">
										<div className="flex items-center justify-center gap-2 mb-4">
											<Image
												src="/assets/OMAdminLogoBanner.png"
												alt="OhmMade Logo Banner"
												height={177}
												width={1301}
												className="object-contain h-8 w-auto"
												priority
											/>
										</div>
										<Dialog.Title className="text-xl font-semibold text-white mb-2">
											Add New Admin
										</Dialog.Title>
										<Dialog.Description className="text-gray-400 text-sm text-center">
											Create a new admin user with the
											specified role and permissions.
										</Dialog.Description>
									</div>

									<form
										onSubmit={handleSubmit}
										className="space-y-6"
									>
										{/* Name Field */}
										<div className="space-y-2">
											<label className="block text-sm font-medium text-gray-300">
												Full Name
											</label>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
													<FontAwesomeIcon
														icon={faUser}
														className="text-gray-400 text-sm"
													/>
												</div>
												<input
													type="text"
													name="name"
													value={formData.name}
													onChange={handleInputChange}
													className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-[#27BBFF]/50 focus:ring-1 focus:ring-[#27BBFF]/20 transition-all placeholder:text-gray-500"
													placeholder="Enter full name"
													required
												/>
											</div>
										</div>

										{/* Email Field */}
										<div className="space-y-2">
											<label className="block text-sm font-medium text-gray-300">
												Email Address
											</label>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
													<FontAwesomeIcon
														icon={faEnvelope}
														className="text-gray-400 text-sm"
													/>
												</div>
												<input
													type="email"
													name="email"
													value={formData.email}
													onChange={handleInputChange}
													className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-[#27BBFF]/50 focus:ring-1 focus:ring-[#27BBFF]/20 transition-all placeholder:text-gray-500"
													placeholder="admin@ohmmade.ca"
													required
												/>
											</div>
										</div>

										{/* Role Field */}
										<div className="space-y-2">
											<label className="block text-sm font-medium text-gray-300">
												Role
											</label>
											<div className="relative">
												<select
													name="role"
													value={formData.role}
													onChange={handleInputChange}
													className="w-full px-4 py-3 pr-10 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-[#27BBFF]/50 focus:ring-1 focus:ring-[#27BBFF]/20 transition-all appearance-none"
													style={{
														backgroundImage: 'none',
													}}
													required
												>
													<option value="SUPER_ADMIN">
														Super Admin
													</option>
													<option value="ADMIN">
														Admin
													</option>
													<option value="MODERATOR">
														Moderator
													</option>
													<option value="SUPPORT">
														Support
													</option>
												</select>
												<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
													<FontAwesomeIcon
														icon={faChevronDown}
														className="text-gray-400 text-xs"
													/>
												</div>
											</div>

											{/* Role Description */}
											<div
												className={`mt-3 p-3 rounded-lg border ${getRoleBgColor(formData.role)}`}
											>
												<div className="flex items-center gap-2 mb-2">
													<FontAwesomeIcon
														icon={getRoleIcon(
															formData.role
														)}
														className={`${getRoleColor(formData.role)}`}
													/>
													<span
														className={`text-sm font-medium ${getRoleColor(formData.role)}`}
													>
														{formData.role.replace(
															'_',
															' '
														)}
													</span>
												</div>
												<p className="text-gray-300 text-xs">
													{formData.role ===
														'SUPER_ADMIN' &&
														'Full access to all features including admin management'}
													{formData.role ===
														'ADMIN' &&
														'Can manage projects, users, and content with most permissions'}
													{formData.role ===
														'MODERATOR' &&
														'Can approve projects and moderate discussions'}
													{formData.role ===
														'SUPPORT' &&
														'Read-only access with basic support capabilities'}
												</p>
											</div>
										</div>

										{/* Error Message */}
										{error && (
											<motion.div
												initial={{ opacity: 0, y: -10 }}
												animate={{ opacity: 1, y: 0 }}
												className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
											>
												<p className="text-red-400 text-sm">
													{error}
												</p>
											</motion.div>
										)}

										{/* Submit Button */}
										<div className="flex gap-3 pt-4">
											<button
												type="button"
												onClick={onClose}
												className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white font-medium hover:bg-gray-700/50 hover:border-gray-600/50 transition-all duration-200"
											>
												Cancel
											</button>
											<button
												type="submit"
												disabled={loading}
												className="flex-1 px-4 py-3 bg-gradient-to-r from-[#27BBFF] to-[#1ea8e6] text-[#101014] rounded-lg font-medium hover:from-[#1ea8e6] hover:to-[#27BBFF] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
											>
												{loading ? (
													<>
														<div className="w-4 h-4 border-2 border-[#101014] border-t-transparent rounded-full animate-spin"></div>
														Creating...
													</>
												) : (
													<>
														<FontAwesomeIcon
															icon={faPlus}
														/>
														Create Admin
													</>
												)}
											</button>
										</div>
									</form>
								</div>
							</motion.div>
						</Dialog.Content>
					</Dialog.Portal>
				</Dialog.Root>
			)}
		</AnimatePresence>
	);
};

export default AddAdminModal;
