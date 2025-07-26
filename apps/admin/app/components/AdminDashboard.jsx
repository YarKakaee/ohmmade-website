'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faChartLine,
	faUsers,
	faProjectDiagram,
	faComments,
	faCog,
	faHistory,
	faUserShield,
	faClock,
	faCheckCircle,
	faTimesCircle,
	faStar,
	faExclamationTriangle,
	faSignOutAlt,
	faBell,
	faSearch,
	faFilter,
	faChevronDown,
	faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import {
	getRecentAdminActivities,
	getAdminStats,
	formatAdminAction,
	getRolePermissions,
} from '../../lib/adminUtils';
import Image from 'next/image';
import LayoutContainer from '@ohmmade/ui/layout-container';
import AddAdminModal from './AddAdminModal';
import UsersList from './UsersList';

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

const cardVariants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

const AdminDashboard = ({ currentAdmin, onSignOut, onViewAdmins }) => {
	const [recentActivities, setRecentActivities] = useState([]);
	const [adminStats, setAdminStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [selectedTimeframe, setSelectedTimeframe] = useState('week');
	const [searchTerm, setSearchTerm] = useState('');
	const [filterRole, setFilterRole] = useState('all');
	const [showAddModal, setShowAddModal] = useState(false);
	const [view, setView] = useState('dashboard'); // 'dashboard', 'users', 'admins'

	useEffect(() => {
		const fetchDashboardData = async () => {
			setLoading(true);
			try {
				const [activities, stats] = await Promise.all([
					getRecentAdminActivities(20),
					getAdminStats(),
				]);

				setRecentActivities(activities);
				setAdminStats(stats);
			} catch (error) {
				console.error('Error fetching dashboard data:', error);
			} finally {
				setLoading(false);
			}
		};

		if (currentAdmin) {
			fetchDashboardData();
		}
	}, [currentAdmin]);

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

	const getActionIcon = (action, details = {}) => {
		const iconMap = {
			PROJECT_APPROVED: faCheckCircle,
			PROJECT_REJECTED: faTimesCircle,
			PROJECT_FEATURED: faStar,
			USER_SUSPENDED: faExclamationTriangle,
			USER_UNSUSPENDED: faCheckCircle,
			WATTS_AWARDED: faStar,
			DISCUSSION_APPROVED: faCheckCircle,
			CONTENT_PUBLISHED: faCheckCircle,
			ADMIN_ADDED:
				details?.actionType === 'login' ? faUserShield : faUserPlus,
		};
		return iconMap[action] || faHistory;
	};

	const getActionColor = (action, details = {}) => {
		const colorMap = {
			PROJECT_APPROVED: 'text-green-400',
			PROJECT_REJECTED: 'text-red-400',
			PROJECT_FEATURED: 'text-yellow-400',
			USER_SUSPENDED: 'text-red-400',
			USER_UNSUSPENDED: 'text-green-400',
			WATTS_AWARDED: 'text-yellow-400',
			DISCUSSION_APPROVED: 'text-green-400',
			CONTENT_PUBLISHED: 'text-green-400',
			ADMIN_ADDED:
				details?.actionType === 'login'
					? 'text-blue-400'
					: 'text-purple-400',
		};
		return colorMap[action] || 'text-gray-400';
	};

	const getActionBgColor = (action, details = {}) => {
		const colorMap = {
			PROJECT_APPROVED: 'bg-green-500/10',
			PROJECT_REJECTED: 'bg-red-500/10',
			PROJECT_FEATURED: 'bg-yellow-500/10',
			USER_SUSPENDED: 'bg-red-500/10',
			USER_UNSUSPENDED: 'bg-green-500/10',
			WATTS_AWARDED: 'bg-yellow-500/10',
			DISCUSSION_APPROVED: 'bg-green-500/10',
			CONTENT_PUBLISHED: 'bg-green-500/10',
			ADMIN_ADDED:
				details?.actionType === 'login'
					? 'bg-blue-500/10'
					: 'bg-purple-500/10',
		};
		return colorMap[action] || 'bg-gray-500/10';
	};

	const formatTimeAgo = (dateString) => {
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

	const permissions = getRolePermissions(currentAdmin?.role);

	// Filter activities based on search and role filter
	const filteredActivities = recentActivities.filter((activity) => {
		const matchesSearch =
			!searchTerm ||
			activity.admin?.name
				?.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			formatAdminAction(
				activity.action,
				activity.resourceType,
				activity.details
			)
				.toLowerCase()
				.includes(searchTerm.toLowerCase());

		const matchesRole =
			filterRole === 'all' || activity.admin?.role === filterRole;

		return matchesSearch && matchesRole;
	});

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-[#101014] via-[#1a1a1e] to-[#101014]">
				<LayoutContainer>
					<div className="animate-pulse mt-10">
						<div className="h-8 bg-gray-700/20 rounded-lg w-1/4 mb-8"></div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
							{[...Array(4)].map((_, i) => (
								<div
									key={i}
									className="h-32 bg-gray-800/20 rounded-xl border border-gray-700/20"
								></div>
							))}
						</div>
						<div className="h-96 bg-gray-800/20 rounded-xl border border-gray-700/20"></div>
					</div>
				</LayoutContainer>
			</div>
		);
	}

	// Render UsersList if view is 'users'
	if (view === 'users') {
		return (
			<UsersList
				currentAdmin={currentAdmin}
				onBack={() => setView('dashboard')}
			/>
		);
	}

	return (
		<div className="min-h-screen bg-[#101014]">
			<LayoutContainer>
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="visible"
					className="py-10"
				>
					{/* Header with Logo */}
					<motion.div variants={itemVariants} className="mb-8">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-4">
								<Image
									src="/assets/OMAdminLogoBanner.png"
									alt="OhmMade Admin"
									width={1301}
									height={177}
									className="h-8 w-auto"
								/>
								<div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>

								<p className="text-gray-400 text-lg mt-1.5">
									Welcome back, {currentAdmin?.name}
								</p>
							</div>

							<div className="flex items-center gap-4">
								<div
									className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleBgColor(currentAdmin?.role)} ${getRoleColor(currentAdmin?.role)}`}
								>
									{currentAdmin?.role.replace('_', ' ')}
								</div>
								<button
									onClick={onSignOut}
									className="cursor-pointer p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
								>
									<FontAwesomeIcon icon={faSignOutAlt} />
								</button>
							</div>
						</div>

						{currentAdmin?.lastLoginAt && (
							<div className="flex items-center gap-2 text-sm text-gray-400">
								<FontAwesomeIcon
									icon={faClock}
									className="text-[#27BBFF]"
								/>
								Last login:{' '}
								{formatTimeAgo(currentAdmin.lastLoginAt)}
							</div>
						)}
					</motion.div>

					{/* Stats Cards */}
					<motion.div
						variants={itemVariants}
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
					>
						<motion.div
							variants={cardVariants}
							className="group relative overflow-hidden bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] rounded-xl border border-gray-700/30 p-6 hover:border-[#27BBFF]/30 transition-all duration-300 cursor-pointer"
							onClick={() => setView('users')}
						>
							<div className="absolute inset-0 bg-gradient-to-r from-[#27BBFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							<div className="relative flex items-center justify-between">
								<div>
									<p className="text-gray-400 text-sm font-medium mb-1">
										Total Users
									</p>
									<p className="text-3xl font-bold text-white">
										{adminStats?.totalUsers || 0}
									</p>
									<p className="text-xs text-gray-400 mt-1">
										Click to view all users
									</p>
								</div>
								<div className="p-3 bg-[#27BBFF]/10 rounded-lg">
									<FontAwesomeIcon
										icon={faUsers}
										className="text-[#27BBFF] text-xl"
									/>
								</div>
							</div>
						</motion.div>

						<motion.div
							variants={cardVariants}
							className="group relative overflow-hidden bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] rounded-xl border border-gray-700/30 p-6 hover:border-green-400/30 transition-all duration-300"
						>
							<div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							<div className="relative flex items-center justify-between">
								<div>
									<p className="text-gray-400 text-sm font-medium mb-1">
										Total Projects
									</p>
									<p className="text-3xl font-bold text-white">
										{adminStats?.totalProjects || 0}
									</p>
								</div>
								<div className="p-3 bg-green-400/10 rounded-lg">
									<FontAwesomeIcon
										icon={faProjectDiagram}
										className="text-green-400 text-xl"
									/>
								</div>
							</div>
						</motion.div>

						<motion.div
							variants={cardVariants}
							className="group relative overflow-hidden bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] rounded-xl border border-gray-700/30 p-6 hover:border-purple-400/30 transition-all duration-300"
						>
							<div className="absolute inset-0 bg-gradient-to-r from-purple-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							<div className="relative flex items-center justify-between">
								<div>
									<p className="text-gray-400 text-sm font-medium mb-1">
										Active Admins
									</p>
									<p className="text-3xl font-bold text-white">
										{adminStats?.activeAdminsCount || 0}
									</p>
								</div>
								<div className="p-3 bg-purple-400/10 rounded-lg">
									<FontAwesomeIcon
										icon={faUserShield}
										className="text-purple-400 text-xl"
									/>
								</div>
							</div>
						</motion.div>

						<motion.div
							variants={cardVariants}
							className="group relative overflow-hidden bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] rounded-xl border border-gray-700/30 p-6 hover:border-blue-400/30 transition-all duration-300"
						>
							<div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							<div className="relative flex items-center justify-between">
								<div>
									<p className="text-gray-400 text-sm font-medium mb-1">
										Admin Activities This Week
									</p>
									<p className="text-3xl font-bold text-white">
										{adminStats?.actionsThisWeek || 0}
									</p>
								</div>
								<div className="p-3 bg-blue-400/10 rounded-lg">
									<FontAwesomeIcon
										icon={faClock}
										className="text-blue-400 text-xl"
									/>
								</div>
							</div>
						</motion.div>
					</motion.div>

					{/* Recent Activities */}
					<motion.div
						variants={itemVariants}
						className="bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] rounded-xl border border-gray-700/30 overflow-hidden"
					>
						<div className="p-6 border-b border-gray-700/30">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-xl font-semibold text-white flex items-center gap-3">
									<div className="p-2 bg-[#27BBFF]/10 rounded-lg">
										<FontAwesomeIcon
											icon={faHistory}
											className="text-[#27BBFF]"
										/>
									</div>
									Recent Admin Activities
								</h2>

								{/* Search and Filter */}
								<div className="flex items-center gap-3">
									<div className="relative">
										<FontAwesomeIcon
											icon={faSearch}
											className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
										/>
										<input
											type="text"
											placeholder="Search activities..."
											value={searchTerm}
											onChange={(e) =>
												setSearchTerm(e.target.value)
											}
											className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:border-[#27BBFF]/50 focus:ring-1 focus:ring-[#27BBFF]/20 transition-all"
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
											<option value="all">
												All Roles
											</option>
											<option value="SUPER_ADMIN">
												Super Admin
											</option>
											<option value="ADMIN">Admin</option>
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
								</div>
							</div>
						</div>

						<div className="p-6">
							<AnimatePresence mode="wait">
								{filteredActivities.length === 0 ? (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										className="text-center text-gray-400 py-12"
									>
										<FontAwesomeIcon
											icon={faHistory}
											className="text-5xl mb-4 opacity-30"
										/>
										<p className="text-lg font-medium mb-2">
											No activities found
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
										{filteredActivities.map(
											(activity, index) => (
												<motion.div
													key={activity.id}
													initial={{
														opacity: 0,
														y: 20,
													}}
													animate={{
														opacity: 1,
														y: 0,
													}}
													transition={{
														delay: index * 0.05,
													}}
													className="group flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/20 hover:border-gray-600/40 hover:bg-gray-800/50 transition-all duration-200"
												>
													<div
														className={`p-3 rounded-lg ${getActionBgColor(activity.action, activity.details)} ${getActionColor(activity.action, activity.details)}`}
													>
														<FontAwesomeIcon
															icon={getActionIcon(
																activity.action,
																activity.details
															)}
														/>
													</div>

													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2 mb-1">
															<span className="font-medium text-white truncate">
																{
																	activity
																		.admin
																		?.name
																}{' '}
																(
																{
																	activity
																		.admin
																		?.email
																}
																)
															</span>
															<span
																className={`text-xs px-2 py-1 rounded-full border ${getRoleBgColor(activity.admin?.role)} ${getRoleColor(activity.admin?.role)}`}
															>
																{activity.admin?.role.replace(
																	'_',
																	' '
																)}
															</span>
														</div>
														<p className="text-gray-300 text-sm truncate">
															{formatAdminAction(
																activity.action,
																activity.resourceType,
																activity.details
															)}
														</p>
													</div>

													<div className="text-right">
														<p className="text-xs text-gray-400">
															{formatTimeAgo(
																activity.createdAt
															)}
														</p>
													</div>
												</motion.div>
											)
										)}
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</motion.div>

					{/* Quick Actions for Super Admin */}
					{currentAdmin?.role === 'SUPER_ADMIN' && (
						<motion.div
							variants={itemVariants}
							className="mt-8 bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] rounded-xl border border-gray-700/30 p-6"
						>
							<h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-3">
								<div className="p-2 bg-[#27BBFF]/10 rounded-lg">
									<FontAwesomeIcon
										icon={faCog}
										className="text-[#27BBFF]"
									/>
								</div>
								Quick Actions
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<button
									onClick={() => setShowAddModal(true)}
									className="group p-4 bg-gradient-to-r from-[#27BBFF] to-[#1ea8e6] text-[#101014] rounded-lg font-medium hover:from-[#1ea8e6] hover:to-[#27BBFF] transition-all duration-300 transform hover:scale-105"
								>
									Add New Admin
								</button>
								<button
									onClick={onViewAdmins}
									className="group p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg font-medium text-white hover:bg-gray-700/50 hover:border-gray-600/50 transition-all duration-300 transform hover:scale-105"
								>
									View All Admins
								</button>
								<button className="group p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg font-medium text-white hover:bg-gray-700/50 hover:border-gray-600/50 transition-all duration-300 transform hover:scale-105">
									System Settings
								</button>
							</div>
						</motion.div>
					)}
				</motion.div>
			</LayoutContainer>

			{/* Add Admin Modal */}
			<AddAdminModal
				isOpen={showAddModal}
				onClose={() => setShowAddModal(false)}
				onSuccess={() => {
					// Refresh the dashboard data to show new admin in stats
					window.location.reload();
				}}
			/>
		</div>
	);
};

export default AdminDashboard;
