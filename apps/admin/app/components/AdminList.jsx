'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faUsers,
	faSearch,
	faFilter,
	faChevronDown,
	faUserShield,
	faClock,
	faCalendar,
	faCrown,
	faUserTie,
	faUserCheck,
	faHeadset,
	faTimes,
	faEdit,
	faTrash,
	faPlus,
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import LayoutContainer from '@ohmmade/ui/layout-container';
import AddAdminModal from './AddAdminModal';

// Animation variants
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { duration: 0.6, staggerChildren: 0.1 },
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const AdminList = ({ currentAdmin, onBack }) => {
	const [admins, setAdmins] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterRole, setFilterRole] = useState('all');
	const [showAddModal, setShowAddModal] = useState(false);

	useEffect(() => {
		fetchAdmins();
	}, []);

	const fetchAdmins = async () => {
		try {
			const response = await fetch('/api/admin/list');
			const result = await response.json();

			if (result.success) {
				setAdmins(result.admins);
			} else {
				console.error('Failed to fetch admins:', result.error);
			}
		} catch (error) {
			console.error('Error fetching admins:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleAddAdminSuccess = (newAdmin) => {
		// Add the new admin to the list
		setAdmins((prev) => [newAdmin, ...prev]);
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

	const getRoleIcon = (role) => {
		const icons = {
			SUPER_ADMIN: faCrown,
			ADMIN: faUserTie,
			MODERATOR: faUserCheck,
			SUPPORT: faHeadset,
		};
		return icons[role] || faUserShield;
	};

	const formatDate = (dateString) => {
		if (!dateString) return 'Never';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	const formatTimeAgo = (dateString) => {
		if (!dateString) return 'Never';
		const date = new Date(dateString);
		const now = new Date();
		const diffInMinutes = Math.floor((now - date) / (1000 * 60));

		if (diffInMinutes < 1) return 'Just now';
		if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

		const diffInHours = Math.floor(diffInMinutes / 60);
		if (diffInHours < 24) return `${diffInHours}h ago`;

		const diffInDays = Math.floor(diffInHours / 24);
		if (diffInDays < 7) return `${diffInDays}d ago`;

		return date.toLocaleDateString();
	};

	// Filter admins based on search and role filter
	const filteredAdmins = admins.filter((admin) => {
		const matchesSearch =
			!searchTerm ||
			admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			admin.email?.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesRole = filterRole === 'all' || admin.role === filterRole;

		return matchesSearch && matchesRole;
	});

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-[#101014] via-[#1a1a1e] to-[#101014]">
				<LayoutContainer>
					<div className="animate-pulse py-10">
						<div className="h-8 bg-gray-700/20 rounded-lg w-1/4 mb-8"></div>
						<div className="h-96 bg-gray-800/20 rounded-xl border border-gray-700/20"></div>
					</div>
				</LayoutContainer>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#101014] via-[#1a1a1e] to-[#101014]">
			<LayoutContainer>
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="visible"
					className="py-10"
				>
					{/* Header */}
					<motion.div variants={itemVariants} className="mb-8">
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center gap-4">
								<button
									onClick={onBack}
									className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
								>
									<FontAwesomeIcon icon={faTimes} />
								</button>
								<Image
									src="/assets/OMAdminLogoBanner.png"
									alt="OhmMade Admin"
									width={1301}
									height={177}
									className="h-8 w-auto"
								/>
								<div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>
								<h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
									All Admins
								</h1>
							</div>

							{currentAdmin?.role === 'SUPER_ADMIN' && (
								<button
									onClick={() => setShowAddModal(true)}
									className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#27BBFF] to-[#1ea8e6] text-[#101014] rounded-lg font-medium hover:from-[#1ea8e6] hover:to-[#27BBFF] transition-all duration-300 transform hover:scale-105"
								>
									<FontAwesomeIcon icon={faPlus} />
									Add Admin
								</button>
							)}
						</div>
					</motion.div>

					{/* Search and Filter */}
					<motion.div variants={itemVariants} className="mb-6">
						<div className="flex items-center gap-4">
							<div className="relative flex-1 max-w-md">
								<FontAwesomeIcon
									icon={faSearch}
									className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
								/>
								<input
									type="text"
									placeholder="Search admins..."
									value={searchTerm}
									onChange={(e) =>
										setSearchTerm(e.target.value)
									}
									className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:border-[#27BBFF]/50 focus:ring-1 focus:ring-[#27BBFF]/20 transition-all"
								/>
							</div>

							<div className="relative">
								<select
									value={filterRole}
									onChange={(e) =>
										setFilterRole(e.target.value)
									}
									className="px-4 py-2 pr-10 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:border-[#27BBFF]/50 focus:ring-1 focus:ring-[#27BBFF]/20 transition-all appearance-none w-full"
									style={{ backgroundImage: 'none' }}
								>
									<option value="all">All Roles</option>
									<option value="SUPER_ADMIN">
										Super Admin
									</option>
									<option value="ADMIN">Admin</option>
									<option value="MODERATOR">Moderator</option>
									<option value="SUPPORT">Support</option>
								</select>
								<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
									<FontAwesomeIcon
										icon={faChevronDown}
										className="text-gray-400 text-xs"
									/>
								</div>
							</div>
						</div>
					</motion.div>

					{/* Admin List */}
					<motion.div
						variants={itemVariants}
						className="bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] rounded-xl border border-gray-700/30 overflow-hidden"
					>
						<div className="p-6 border-b border-gray-700/30">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-semibold text-white flex items-center gap-3">
									<div className="p-2 bg-[#27BBFF]/10 rounded-lg">
										<FontAwesomeIcon
											icon={faUsers}
											className="text-[#27BBFF]"
										/>
									</div>
									Admin Users ({filteredAdmins.length})
								</h2>
							</div>
						</div>

						<div className="p-6">
							<AnimatePresence mode="wait">
								{filteredAdmins.length === 0 ? (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										className="text-center text-gray-400 py-12"
									>
										<FontAwesomeIcon
											icon={faUsers}
											className="text-5xl mb-4 opacity-30"
										/>
										<p className="text-lg font-medium mb-2">
											No admins found
										</p>
										<p className="text-sm">
											Try adjusting your search or filter
											criteria
										</p>
									</motion.div>
								) : (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										className="space-y-3"
									>
										{filteredAdmins.map((admin, index) => (
											<motion.div
												key={admin.id}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{
													delay: index * 0.05,
												}}
												className="group flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/20 hover:border-gray-600/40 hover:bg-gray-800/50 transition-all duration-200"
											>
												<div
													className={`p-3 rounded-lg ${getRoleBgColor(admin.role)} ${getRoleColor(admin.role)}`}
												>
													<FontAwesomeIcon
														icon={getRoleIcon(
															admin.role
														)}
													/>
												</div>

												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2 mb-1">
														<span className="font-medium text-white truncate">
															{admin.name}
														</span>
														<span
															className={`text-xs px-2 py-1 rounded-full border ${getRoleBgColor(admin.role)} ${getRoleColor(admin.role)}`}
														>
															{admin.role.replace(
																'_',
																' '
															)}
														</span>
													</div>
													<p className="text-gray-300 text-sm truncate">
														{admin.email}
													</p>
												</div>

												<div className="flex items-center gap-4 text-right">
													<div className="text-right">
														<div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
															<FontAwesomeIcon
																icon={
																	faCalendar
																}
															/>
															Joined:{' '}
															{formatDate(
																admin.createdAt
															)}
														</div>
														<div className="flex items-center gap-1 text-xs text-gray-400">
															<FontAwesomeIcon
																icon={faClock}
															/>
															Last login:{' '}
															{formatTimeAgo(
																admin.lastLoginAt
															)}
														</div>
													</div>

													{currentAdmin?.role ===
														'SUPER_ADMIN' &&
														admin.id !==
															currentAdmin.id && (
															<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
																<button className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-all">
																	<FontAwesomeIcon
																		icon={
																			faEdit
																		}
																	/>
																</button>
																<button className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all">
																	<FontAwesomeIcon
																		icon={
																			faTrash
																		}
																	/>
																</button>
															</div>
														)}
												</div>
											</motion.div>
										))}
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</motion.div>
				</motion.div>
			</LayoutContainer>

			{/* Add Admin Modal */}
			<AddAdminModal
				isOpen={showAddModal}
				onClose={() => setShowAddModal(false)}
				onSuccess={handleAddAdminSuccess}
			/>
		</div>
	);
};

export default AdminList;
