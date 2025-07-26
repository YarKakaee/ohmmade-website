import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faUsers,
	faSearch,
	faFilter,
	faChevronDown,
	faArrowLeft,
	faUser,
	faCalendar,
	faProjectDiagram,
	faStar,
} from '@fortawesome/free-solid-svg-icons';
import LayoutContainer from '@ohmmade/ui/layout-container';
import Image from 'next/image';

const UsersList = ({ currentAdmin, onBack }) => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterLevel, setFilterLevel] = useState('all');

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			const response = await fetch('/api/admin/users');
			const result = await response.json();

			if (result.success) {
				setUsers(result.users);
			} else {
				console.error('Failed to fetch users:', result.error);
			}
		} catch (error) {
			console.error('Error fetching users:', error);
		} finally {
			setLoading(false);
		}
	};

	const filteredUsers = users.filter((user) => {
		const matchesSearch =
			user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.username?.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesLevel =
			filterLevel === 'all' || user.level === filterLevel;

		return matchesSearch && matchesLevel;
	});

	const getLevelColor = (level) => {
		const colors = {
			Newbie: 'text-gray-400',
			Beginner: 'text-green-400',
			Intermediate: 'text-blue-400',
			Advanced: 'text-purple-400',
			Expert: 'text-yellow-400',
			Master: 'text-red-400',
		};
		return colors[level] || 'text-gray-400';
	};

	const getLevelBgColor = (level) => {
		const colors = {
			Newbie: 'bg-gray-500/10 border-gray-500/20',
			Beginner: 'bg-green-500/10 border-green-500/20',
			Intermediate: 'bg-blue-500/10 border-blue-500/20',
			Advanced: 'bg-purple-500/10 border-purple-500/20',
			Expert: 'bg-yellow-500/10 border-yellow-500/20',
			Master: 'bg-red-500/10 border-red-500/20',
		};
		return colors[level] || 'bg-gray-500/10 border-gray-500/20';
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<LayoutContainer>
			<motion.div
				initial="hidden"
				animate="visible"
				variants={containerVariants}
				className="min-h-screen bg-[#101014] py-6 md:py-10"
			>
				{/* Header */}
				<motion.div variants={itemVariants} className="mb-6 md:mb-8">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 md:mb-6">
						<div className="flex items-center gap-3 md:gap-4">
							<button
								onClick={onBack}
								className="p-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white hover:bg-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
							>
								<FontAwesomeIcon icon={faArrowLeft} />
							</button>
							<div>
								<h1 className="text-2xl md:text-3xl font-bold text-white">
									Users Management
								</h1>
								<p className="text-sm md:text-base text-gray-400">
									Manage and view all users in the system
								</p>
							</div>
						</div>
						<div className="flex items-center justify-center md:justify-end">
							<Image
								src="/assets/OMAdminLogoBanner.png"
								alt="OhmMade Admin"
								width={200}
								height={40}
								className="h-8 md:h-10 w-auto"
							/>
						</div>
					</div>
				</motion.div>

				{/* Search and Filter */}
				<motion.div variants={itemVariants} className="mb-6">
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
						<div className="relative flex-1">
							<FontAwesomeIcon
								icon={faSearch}
								className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
							/>
							<input
								type="text"
								placeholder="Search users by name, email, or username..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:border-[#27BBFF]/50 focus:ring-1 focus:ring-[#27BBFF]/20 transition-all"
							/>
						</div>
						<div className="relative flex-1 sm:flex-none">
							<select
								value={filterLevel}
								onChange={(e) => setFilterLevel(e.target.value)}
								className="w-full px-4 py-3 pr-10 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:border-[#27BBFF]/50 focus:ring-1 focus:ring-[#27BBFF]/20 transition-all appearance-none"
								style={{ backgroundImage: 'none' }}
							>
								<option value="all">All Levels</option>
								<option value="Newbie">Newbie</option>
								<option value="Beginner">Beginner</option>
								<option value="Intermediate">
									Intermediate
								</option>
								<option value="Advanced">Advanced</option>
								<option value="Expert">Expert</option>
								<option value="Master">Master</option>
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

				{/* Users List */}
				<motion.div
					variants={itemVariants}
					className="bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] rounded-xl border border-gray-700/30 overflow-hidden"
				>
					<div className="p-6 border-b border-gray-700/30">
						<h2 className="text-xl font-semibold text-white flex items-center gap-3">
							<div className="p-2 bg-[#27BBFF]/10 rounded-lg">
								<FontAwesomeIcon
									icon={faUsers}
									className="text-[#27BBFF]"
								/>
							</div>
							Users ({filteredUsers.length})
						</h2>
					</div>

					<div className="p-6">
						<AnimatePresence mode="wait">
							{loading ? (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="text-center text-gray-400 py-12"
								>
									Loading users...
								</motion.div>
							) : filteredUsers.length === 0 ? (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="text-center text-gray-400 py-12"
								>
									No users found
								</motion.div>
							) : (
								<motion.div
									variants={containerVariants}
									initial="hidden"
									animate="visible"
									className="space-y-4"
								>
									{filteredUsers.map((user, index) => (
										<motion.div
											key={user.id}
											variants={itemVariants}
											initial="hidden"
											animate="visible"
											transition={{ delay: index * 0.05 }}
											className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/20 hover:border-gray-600/40 hover:bg-gray-800/50 transition-all duration-200"
										>
											<div className="p-3 bg-[#27BBFF]/10 rounded-lg">
												<FontAwesomeIcon
													icon={faUser}
													className="text-[#27BBFF] text-lg"
												/>
											</div>

											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-1">
													<span className="font-medium text-white truncate">
														{user.name ||
															'Unnamed User'}
													</span>
													<span
														className={`text-xs px-2 py-1 rounded-full border ${getLevelBgColor(user.level)} ${getLevelColor(user.level)}`}
													>
														{user.level}
													</span>
												</div>
												<p className="text-gray-300 text-sm truncate">
													{user.email}
												</p>
												<p className="text-gray-400 text-xs truncate">
													@{user.username}
												</p>
											</div>

											<div className="text-right space-y-1">
												<div className="flex items-center gap-2 text-xs text-gray-400">
													<FontAwesomeIcon
														icon={faProjectDiagram}
													/>
													<span>
														{user._count
															?.projects ||
															0}{' '}
														projects
													</span>
												</div>
												<div className="flex items-center gap-2 text-xs text-gray-400">
													<FontAwesomeIcon
														icon={faStar}
													/>
													<span>
														{user.watts || 0} watts
													</span>
												</div>
												<p className="text-xs text-gray-400">
													Joined{' '}
													{formatDate(user.createdAt)}
												</p>
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
	);
};

export default UsersList;
