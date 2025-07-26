import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faProjectDiagram,
	faSearch,
	faFilter,
	faChevronDown,
	faArrowLeft,
	faUser,
	faCalendar,
	faEye,
	faHeart,
	faStar,
	faClock,
} from '@fortawesome/free-solid-svg-icons';
import LayoutContainer from '@ohmmade/ui/layout-container';
import Image from 'next/image';

const ProjectsList = ({ currentAdmin, onBack }) => {
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterCategory, setFilterCategory] = useState('all');
	const [filterStatus, setFilterStatus] = useState('all');

	useEffect(() => {
		fetchProjects();
	}, []);

	const fetchProjects = async () => {
		try {
			const response = await fetch('/api/admin/projects');
			const result = await response.json();

			if (result.success) {
				setProjects(result.projects);
			} else {
				console.error('Failed to fetch projects:', result.error);
			}
		} catch (error) {
			console.error('Error fetching projects:', error);
		} finally {
			setLoading(false);
		}
	};

	const filteredProjects = projects.filter((project) => {
		const matchesSearch =
			project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			project.description
				?.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			project.author?.name
				?.toLowerCase()
				.includes(searchTerm.toLowerCase());

		const matchesCategory =
			filterCategory === 'all' || project.category === filterCategory;
		const matchesStatus =
			filterStatus === 'all' || project.status === filterStatus;

		return matchesSearch && matchesCategory && matchesStatus;
	});

	const getStatusColor = (status) => {
		const colors = {
			draft: 'text-gray-400',
			published: 'text-green-400',
			archived: 'text-red-400',
		};
		return colors[status] || 'text-gray-400';
	};

	const getStatusBgColor = (status) => {
		const colors = {
			draft: 'bg-gray-500/10 border-gray-500/20',
			published: 'bg-green-500/10 border-green-500/20',
			archived: 'bg-red-500/10 border-red-500/20',
		};
		return colors[status] || 'bg-gray-500/10 border-gray-500/20';
	};

	const getCategoryColor = (category) => {
		const colors = {
			Arduino: 'text-blue-400',
			'Raspberry Pi': 'text-green-400',
			ESP32: 'text-purple-400',
			ESP8266: 'text-yellow-400',
			Other: 'text-gray-400',
		};
		return colors[category] || 'text-gray-400';
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

	// Get unique categories for filter
	const categories = ['all', ...new Set(projects.map((p) => p.category))];

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
									Projects Management
								</h1>
								<p className="text-sm md:text-base text-gray-400">
									Manage and view all projects in the system
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
								placeholder="Search projects by title, description, or author..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:border-[#27BBFF]/50 focus:ring-1 focus:ring-[#27BBFF]/20 transition-all"
							/>
						</div>
						<div className="relative flex-1 sm:flex-none">
							<select
								value={filterCategory}
								onChange={(e) =>
									setFilterCategory(e.target.value)
								}
								className="w-full px-4 py-3 pr-10 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:border-[#27BBFF]/50 focus:ring-1 focus:ring-[#27BBFF]/20 transition-all appearance-none"
								style={{ backgroundImage: 'none' }}
							>
								<option value="all">All Categories</option>
								{categories
									.filter((cat) => cat !== 'all')
									.map((category) => (
										<option key={category} value={category}>
											{category}
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
						<div className="relative flex-1 sm:flex-none">
							<select
								value={filterStatus}
								onChange={(e) =>
									setFilterStatus(e.target.value)
								}
								className="w-full px-4 py-3 pr-10 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:border-[#27BBFF]/50 focus:ring-1 focus:ring-[#27BBFF]/20 transition-all appearance-none"
								style={{ backgroundImage: 'none' }}
							>
								<option value="all">All Status</option>
								<option value="draft">Draft</option>
								<option value="published">Published</option>
								<option value="archived">Archived</option>
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

				{/* Projects List */}
				<motion.div
					variants={itemVariants}
					className="bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] rounded-xl border border-gray-700/30 overflow-hidden"
				>
					<div className="p-6 border-b border-gray-700/30">
						<h2 className="text-xl font-semibold text-white flex items-center gap-3">
							<div className="p-2 bg-[#27BBFF]/10 rounded-lg">
								<FontAwesomeIcon
									icon={faProjectDiagram}
									className="text-[#27BBFF]"
								/>
							</div>
							Projects ({filteredProjects.length})
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
									Loading projects...
								</motion.div>
							) : filteredProjects.length === 0 ? (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="text-center text-gray-400 py-12"
								>
									No projects found
								</motion.div>
							) : (
								<motion.div
									variants={containerVariants}
									initial="hidden"
									animate="visible"
									className="space-y-4"
								>
									{filteredProjects.map((project, index) => (
										<motion.div
											key={project.id}
											variants={itemVariants}
											initial="hidden"
											animate="visible"
											transition={{ delay: index * 0.05 }}
											className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/20 hover:border-gray-600/40 hover:bg-gray-800/50 transition-all duration-200"
										>
											<div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700/50 flex-shrink-0">
												{project.thumbnailUrl ? (
													<img
														src={
															project.thumbnailUrl
														}
														alt={project.title}
														className="w-full h-full object-cover"
													/>
												) : (
													<div className="w-full h-full bg-green-400/10 flex items-center justify-center">
														<FontAwesomeIcon
															icon={
																faProjectDiagram
															}
															className="text-green-400 text-lg"
														/>
													</div>
												)}
											</div>

											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-1">
													<span className="font-medium text-white truncate">
														{project.title}
													</span>
													<span
														className={`text-xs px-2 py-1 rounded-full border ${getStatusBgColor(project.status)} ${getStatusColor(project.status)}`}
													>
														{project.status}
													</span>
													{project.featured && (
														<span className="text-xs px-2 py-1 rounded-full border bg-yellow-500/10 border-yellow-500/20 text-yellow-400">
															Featured
														</span>
													)}
												</div>
												<p className="text-gray-300 text-sm truncate mb-1">
													{project.description}
												</p>
												<div className="flex items-center gap-4 text-xs text-gray-400">
													<span
														className={`${getCategoryColor(project.category)}`}
													>
														{project.category}
													</span>
													<span>
														by{' '}
														{project.author?.name ||
															'Unknown'}
													</span>
													<span>
														Difficulty:{' '}
														{
															project.difficultyLevel
														}
													</span>
												</div>
											</div>

											<div className="text-right space-y-1">
												<div className="flex items-center gap-2 text-xs text-gray-400">
													<FontAwesomeIcon
														icon={faEye}
													/>
													<span>
														{project.views} views
													</span>
												</div>
												<div className="flex items-center gap-2 text-xs text-gray-400">
													<FontAwesomeIcon
														icon={faHeart}
													/>
													<span>
														{project.likes} likes
													</span>
												</div>
												<p className="text-xs text-gray-400">
													{formatDate(
														project.createdAt
													)}
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

export default ProjectsList;
