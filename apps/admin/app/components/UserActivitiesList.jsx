'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faArrowLeft,
	faSearch,
	faFilter,
	faSort,
	faChevronDown,
	faChevronLeft,
	faChevronRight,
	faEye,
	faHeart,
	faBookmark,
	faUpload,
	faUser,
	faProjectDiagram,
	faClock,
} from '@fortawesome/free-solid-svg-icons';
import LayoutContainer from '@ohmmade/ui/layout-container';
import Image from 'next/image';

const UserActivitiesList = ({ currentAdmin, onBack }) => {
	const [activities, setActivities] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterType, setFilterType] = useState('all');
	const [sortBy, setSortBy] = useState('createdAt');
	const [sortOrder, setSortOrder] = useState('desc');
	const [currentPage, setCurrentPage] = useState(1);
	const [pagination, setPagination] = useState({
		totalCount: 0,
		totalPages: 0,
		hasNext: false,
		hasPrev: false,
	});

	const activityTypeOptions = [
		{ value: 'all', label: 'All Activities' },
		{ value: 'PROJECT_PUBLISHED', label: 'Project Published' },
		{ value: 'PROJECT_LIKED', label: 'Project Liked' },
		{ value: 'PROJECT_SAVED', label: 'Project Saved' },
		{ value: 'PROJECT_VIEWED', label: 'Project Viewed' },
	];

	const sortOptions = [
		{ value: 'createdAt', label: 'Date' },
		{ value: 'user.name', label: 'User Name' },
		{ value: 'type', label: 'Activity Type' },
	];

	useEffect(() => {
		fetchActivities();
	}, [currentPage, searchTerm, filterType, sortBy, sortOrder]);

	const fetchActivities = async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: currentPage.toString(),
				limit: '20',
				search: searchTerm,
				filter: filterType,
				sortBy: sortBy,
				sortOrder: sortOrder,
			});

			const response = await fetch(
				`/api/admin/user-activities?${params}`
			);
			const result = await response.json();

			if (result.success) {
				setActivities(result.activities);
				setPagination(result.pagination);
			} else {
				console.error('Failed to fetch activities:', result.error);
			}
		} catch (error) {
			console.error('Error fetching activities:', error);
		} finally {
			setLoading(false);
		}
	};

	const getActivityIcon = (type) => {
		const iconMap = {
			PROJECT_PUBLISHED: faUpload,
			PROJECT_LIKED: faHeart,
			PROJECT_SAVED: faBookmark,
			PROJECT_VIEWED: faEye,
		};
		return iconMap[type] || faClock;
	};

	const getActivityColor = (type) => {
		const colorMap = {
			PROJECT_PUBLISHED: 'text-green-400',
			PROJECT_LIKED: 'text-red-400',
			PROJECT_SAVED: 'text-yellow-400',
			PROJECT_VIEWED: 'text-blue-400',
		};
		return colorMap[type] || 'text-gray-400';
	};

	const getActivityBgColor = (type) => {
		const colorMap = {
			PROJECT_PUBLISHED: 'bg-green-500/10',
			PROJECT_LIKED: 'bg-red-500/10',
			PROJECT_SAVED: 'bg-yellow-500/10',
			PROJECT_VIEWED: 'bg-blue-500/10',
		};
		return colorMap[type] || 'bg-gray-500/10';
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

	const handleSearch = (e) => {
		setSearchTerm(e.target.value);
		setCurrentPage(1);
	};

	const handleFilterChange = (e) => {
		setFilterType(e.target.value);
		setCurrentPage(1);
	};

	const handleSortChange = (e) => {
		setSortBy(e.target.value);
		setCurrentPage(1);
	};

	const handleSortOrderToggle = () => {
		setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
		setCurrentPage(1);
	};

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	return (
		<div className="min-h-screen bg-[#101014]">
			<LayoutContainer>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="py-10"
				>
					{/* Header */}
					<div className="mb-6 md:mb-8">
						<div className="flex items-center gap-4 mb-4">
							<button
								onClick={onBack}
								className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
							>
								<FontAwesomeIcon icon={faArrowLeft} />
							</button>
							<div>
								<h1 className="text-2xl md:text-3xl font-bold text-white">
									Recent Activities
								</h1>
								<p className="text-gray-400 mt-1">
									View all user activities across the platform
								</p>
							</div>
						</div>

						{/* Stats */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
							<div className="bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] rounded-xl border border-gray-700/30 p-4">
								<div className="flex items-center gap-3">
									<div className="p-2 bg-blue-400/10 rounded-lg">
										<FontAwesomeIcon
											icon={faUser}
											className="text-blue-400"
										/>
									</div>
									<div>
										<p className="text-gray-400 text-sm">
											Total Activities
										</p>
										<p className="text-xl font-bold text-white">
											{pagination.totalCount}
										</p>
									</div>
								</div>
							</div>
							<div className="bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] rounded-xl border border-gray-700/30 p-4">
								<div className="flex items-center gap-3">
									<div className="p-2 bg-green-400/10 rounded-lg">
										<FontAwesomeIcon
											icon={faProjectDiagram}
											className="text-green-400"
										/>
									</div>
									<div>
										<p className="text-gray-400 text-sm">
											Projects Published
										</p>
										<p className="text-xl font-bold text-white">
											{
												activities.filter(
													(a) =>
														a.type ===
														'PROJECT_PUBLISHED'
												).length
											}
										</p>
									</div>
								</div>
							</div>
							<div className="bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] rounded-xl border border-gray-700/30 p-4">
								<div className="flex items-center gap-3">
									<div className="p-2 bg-purple-400/10 rounded-lg">
										<FontAwesomeIcon
											icon={faClock}
											className="text-purple-400"
										/>
									</div>
									<div>
										<p className="text-gray-400 text-sm">
											Page
										</p>
										<p className="text-xl font-bold text-white">
											{pagination.page} /{' '}
											{pagination.totalPages}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Search and Filters */}
					<div className="bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] rounded-xl border border-gray-700/30 p-4 md:p-6 mb-6">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							{/* Search */}
							<div className="relative">
								<FontAwesomeIcon
									icon={faSearch}
									className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
								/>
								<input
									type="text"
									placeholder="Search users, projects..."
									value={searchTerm}
									onChange={handleSearch}
									className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:border-[#27BBFF]/50 focus:ring-1 focus:ring-[#27BBFF]/20 transition-all"
								/>
							</div>

							{/* Filter */}
							<div className="relative">
								<select
									value={filterType}
									onChange={handleFilterChange}
									className="w-full px-4 py-2 pr-10 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:border-[#27BBFF]/50 focus:ring-1 focus:ring-[#27BBFF]/20 transition-all appearance-none"
								>
									{activityTypeOptions.map((option) => (
										<option
											key={option.value}
											value={option.value}
										>
											{option.label}
										</option>
									))}
								</select>
								<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
									<FontAwesomeIcon
										icon={faChevronDown}
										className="text-gray-400 text-xs"
									/>
								</div>
							</div>

							{/* Sort */}
							<div className="relative">
								<select
									value={sortBy}
									onChange={handleSortChange}
									className="w-full px-4 py-2 pr-10 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:border-[#27BBFF]/50 focus:ring-1 focus:ring-[#27BBFF]/20 transition-all appearance-none"
								>
									{sortOptions.map((option) => (
										<option
											key={option.value}
											value={option.value}
										>
											{option.label}
										</option>
									))}
								</select>
								<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
									<FontAwesomeIcon
										icon={faChevronDown}
										className="text-gray-400 text-xs"
									/>
								</div>
							</div>

							{/* Sort Order */}
							<button
								onClick={handleSortOrderToggle}
								className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm hover:bg-gray-700/50 hover:border-gray-600/50 transition-all flex items-center justify-center gap-2"
							>
								<FontAwesomeIcon icon={faSort} />
								{sortOrder === 'asc'
									? 'Ascending'
									: 'Descending'}
							</button>
						</div>
					</div>

					{/* Activities List */}
					<div className="bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] rounded-xl border border-gray-700/30 overflow-hidden">
						{loading ? (
							<div className="p-8 text-center">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#27BBFF] mx-auto mb-4"></div>
								<p className="text-gray-400">
									Loading activities...
								</p>
							</div>
						) : activities.length === 0 ? (
							<div className="p-8 text-center">
								<FontAwesomeIcon
									icon={faClock}
									className="text-5xl text-gray-600 mb-4"
								/>
								<p className="text-gray-400 text-lg font-medium mb-2">
									No activities found
								</p>
								<p className="text-gray-500 text-sm">
									Try adjusting your search or filter criteria
								</p>
							</div>
						) : (
							<div className="divide-y divide-gray-700/30">
								{activities.map((activity, index) => (
									<motion.div
										key={activity.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.05 }}
										className="p-4 md:p-6 hover:bg-gray-800/30 transition-all duration-200"
									>
										<div className="flex items-start gap-4">
											{/* Activity Icon */}
											<div
												className={`p-3 rounded-lg ${getActivityBgColor(activity.type)} ${getActivityColor(activity.type)}`}
											>
												<FontAwesomeIcon
													icon={getActivityIcon(
														activity.type
													)}
													className="text-lg"
												/>
											</div>

											{/* Activity Content */}
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-3 mb-2">
													{/* User Avatar */}
													{activity.user?.image ? (
														<Image
															src={
																activity.user
																	.image
															}
															alt={
																activity.user
																	.name ||
																activity.user
																	.username
															}
															width={32}
															height={32}
															className="rounded-full"
														/>
													) : (
														<div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
															<FontAwesomeIcon
																icon={faUser}
																className="text-gray-400 text-sm"
															/>
														</div>
													)}

													{/* User Info */}
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2">
															<span className="font-medium text-white truncate">
																{activity.user
																	?.name ||
																	activity
																		.user
																		?.username ||
																	'Unknown User'}
															</span>
															<span className="text-gray-400 text-sm">
																@
																{
																	activity
																		.user
																		?.username
																}
															</span>
														</div>
														<p className="text-gray-300 text-sm">
															{
																activity.description
															}
														</p>
													</div>
												</div>

												{/* Project Info (if applicable) */}
												{activity.project && (
													<div className="flex items-center gap-3 mt-3 p-3 bg-gray-800/30 rounded-lg">
														{activity.project
															.thumbnailUrl && (
															<Image
																src={
																	activity
																		.project
																		.thumbnailUrl
																}
																alt={
																	activity
																		.project
																		.title
																}
																width={48}
																height={48}
																className="rounded-lg object-cover"
															/>
														)}
														<div className="flex-1 min-w-0">
															<p className="font-medium text-white truncate">
																{
																	activity
																		.project
																		.title
																}
															</p>
															<p className="text-gray-400 text-sm">
																Project ID:{' '}
																{
																	activity
																		.project
																		.id
																}
															</p>
														</div>
													</div>
												)}
											</div>

											{/* Timestamp */}
											<div className="text-right">
												<p className="text-xs text-gray-400">
													{formatTimeAgo(
														activity.createdAt
													)}
												</p>
											</div>
										</div>
									</motion.div>
								))}
							</div>
						)}
					</div>

					{/* Pagination */}
					{pagination.totalPages > 1 && (
						<div className="mt-6 flex items-center justify-between">
							<div className="text-sm text-gray-400">
								Showing page {pagination.page} of{' '}
								{pagination.totalPages} ({pagination.totalCount}{' '}
								total activities)
							</div>
							<div className="flex items-center gap-2">
								<button
									onClick={() =>
										handlePageChange(currentPage - 1)
									}
									disabled={!pagination.hasPrev}
									className="p-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white hover:bg-gray-700/50 hover:border-gray-600/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<FontAwesomeIcon icon={faChevronLeft} />
								</button>
								<span className="px-4 py-2 text-white">
									Page {pagination.page} of{' '}
									{pagination.totalPages}
								</span>
								<button
									onClick={() =>
										handlePageChange(currentPage + 1)
									}
									disabled={!pagination.hasNext}
									className="p-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white hover:bg-gray-700/50 hover:border-gray-600/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<FontAwesomeIcon icon={faChevronRight} />
								</button>
							</div>
						</div>
					)}
				</motion.div>
			</LayoutContainer>
		</div>
	);
};

export default UserActivitiesList;
