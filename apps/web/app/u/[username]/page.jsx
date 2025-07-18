'use client';

import LayoutContainer from '@ohmmade/ui/layout-container';
import ProjectCard from '@/app/components/common/ProjectCard';
import UserRank from '@/app/components/common/UserRank';
import WattsDisplay from '@/app/components/common/WattsDisplay';
import categoryColors from '@/lib/constants/categoryColors';
import {
	faGithub as faGithubBrand,
	faInstagram as faInstagramBrand,
	faLinkedin as faLinkedinBrand,
	faXTwitter as faXTwitterBrand,
} from '@fortawesome/free-brands-svg-icons';
import {
	faCalendar,
	faCopy,
	faEdit,
	faEye,
	faHeart,
	faShare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useSession } from '@supabase/auth-helpers-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function UserProfilePage() {
	const params = useParams();
	const router = useRouter();
	const session = useSession();
	const { username } = params;
	const [userData, setUserData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isFollowing, setIsFollowing] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);
	const [showFollowersModal, setShowFollowersModal] = useState(false);
	const [showFollowingModal, setShowFollowingModal] = useState(false);
	const [followers, setFollowers] = useState([]);
	const [following, setFollowing] = useState([]);
	const [loadingFollowers, setLoadingFollowers] = useState(false);
	const [loadingFollowing, setLoadingFollowing] = useState(false);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				setLoading(true);
				const response = await fetch(`/api/user/${username}`);

				if (!response.ok) {
					if (response.status === 404) {
						setError('User not found');
					} else {
						setError('Failed to load profile');
					}
					return;
				}

				const data = await response.json();
				setUserData(data);
			} catch (err) {
				console.error('Error fetching user data:', err);
				setError('Failed to load profile');
			} finally {
				setLoading(false);
			}
		};

		if (username) {
			fetchUserData();
		}
	}, [username]);

	// Fetch current user data if session exists
	useEffect(() => {
		const fetchCurrentUser = async () => {
			if (session?.user?.email) {
				try {
					const response = await fetch(
						`/api/user/profile?email=${session.user.email}`
					);
					if (response.ok) {
						const userData = await response.json();
						setCurrentUser(userData);
					}
				} catch (error) {
					console.error('Error fetching current user:', error);
				}
			}
		};

		fetchCurrentUser();
	}, [session]);

	// Check if current user is viewing their own profile
	const isOwnProfile =
		currentUser &&
		userData &&
		currentUser.username === userData.user.username;

	// Check follow status when userData and currentUser are available
	useEffect(() => {
		const checkFollowStatus = async () => {
			if (userData && currentUser && !isOwnProfile) {
				try {
					const response = await fetch(
						`/api/user/follow?targetUserId=${userData.user.id}`
					);
					if (response.ok) {
						const data = await response.json();
						setIsFollowing(data.following);
					}
				} catch (error) {
					console.error('Error checking follow status:', error);
				}
			}
		};

		checkFollowStatus();
	}, [userData, currentUser, isOwnProfile]);

	const handleCopyProfileLink = async () => {
		try {
			await navigator.clipboard.writeText(
				`${window.location.origin}/u/${username}`
			);
			toast.success('Profile link copied to clipboard!');
		} catch (err) {
			toast.error('Failed to copy link');
		}
	};

	const handleShareProfile = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: `${userData.user.name} on OhmMade`,
					text: `Check out ${userData.user.name}'s electronics projects on OhmMade!`,
					url: `${window.location.origin}/u/${username}`,
				});
			} catch (err) {
				console.log('Share cancelled');
			}
		} else {
			handleCopyProfileLink();
		}
	};

	const handleFollow = async () => {
		if (!session) {
			toast.error('Please sign in to follow users');
			return;
		}

		try {
			const response = await fetch('/api/user/follow', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					targetUserId: userData.user.id,
				}),
			});

			if (response.ok) {
				const data = await response.json();
				setIsFollowing(data.following);
				toast.success(data.following ? 'Following' : 'Unfollowed');

				// Update the stats in userData to reflect the new follower count
				setUserData((prev) => ({
					...prev,
					stats: {
						...prev.stats,
						followerCount: data.following
							? prev.stats.followerCount + 1
							: prev.stats.followerCount - 1,
					},
				}));
			} else {
				toast.error('Failed to update follow status');
			}
		} catch (error) {
			console.error('Error following/unfollowing:', error);
			toast.error('Failed to update follow status');
		}
	};

	const handleEditProfile = () => {
		router.push('/dashboard/settings');
	};

	const fetchFollowers = async () => {
		setLoadingFollowers(true);
		try {
			const response = await fetch(`/api/user/${username}/followers`);
			if (response.ok) {
				const data = await response.json();
				setFollowers(data.followers);
			}
		} catch (error) {
			console.error('Error fetching followers:', error);
		} finally {
			setLoadingFollowers(false);
		}
	};

	const fetchFollowing = async () => {
		setLoadingFollowing(true);
		try {
			const response = await fetch(`/api/user/${username}/following`);
			if (response.ok) {
				const data = await response.json();
				setFollowing(data.following);
			}
		} catch (error) {
			console.error('Error fetching following:', error);
		} finally {
			setLoadingFollowing(false);
		}
	};

	const handleFollowersClick = () => {
		setShowFollowersModal(true);
		fetchFollowers();
	};

	const handleFollowingClick = () => {
		setShowFollowingModal(true);
		fetchFollowing();
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
		});
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-[#101014] pt-24">
				<LayoutContainer className="py-8">
					<div className="animate-pulse">
						{/* Header Skeleton */}
						<div className="bg-[#13151A]/50 backdrop-blur-sm border border-[#3A3A3C]/60 rounded-3xl p-8 mb-8">
							<div className="flex flex-col md:flex-row items-center md:items-start gap-8">
								<div className="w-32 h-32 bg-[#2C2F36] rounded-full"></div>
								<div className="flex-1 text-center md:text-left">
									<div className="h-8 bg-[#2C2F36] rounded mb-4 w-48 mx-auto md:mx-0"></div>
									<div className="h-6 bg-[#2C2F36] rounded mb-2 w-32 mx-auto md:mx-0"></div>
									<div className="h-4 bg-[#2C2F36] rounded mb-6 w-64 mx-auto md:mx-0"></div>
									<div className="flex justify-center md:justify-start gap-4 mb-6">
										<div className="h-10 bg-[#2C2F36] rounded-lg w-24"></div>
										<div className="h-10 bg-[#2C2F36] rounded-lg w-32"></div>
									</div>
								</div>
							</div>
						</div>

						{/* Projects Grid Skeleton */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{[...Array(6)].map((_, i) => (
								<div
									key={i}
									className="bg-[#1C1C20] rounded-xl h-96 animate-pulse"
								>
									<div className="h-48 bg-[#2C2F36] rounded-t-xl"></div>
									<div className="p-5 space-y-3">
										<div className="h-6 bg-[#2C2F36] rounded"></div>
										<div className="h-4 bg-[#2C2F36] rounded"></div>
										<div className="h-4 bg-[#2C2F36] rounded"></div>
									</div>
								</div>
							))}
						</div>
					</div>
				</LayoutContainer>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-[#101014] flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-white mb-4">
						User Not Found
					</h1>
					<p className="text-white/60">
						The user you're looking for doesn't exist.
					</p>
				</div>
			</div>
		);
	}

	if (!userData) return null;

	const { user, projects, stats } = userData;

	return (
		<div className="min-h-screen bg-[#101014] pt-24">
			<LayoutContainer className="py-8">
				{/* Header Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="bg-[#13151A]/50 backdrop-blur-sm border border-[#3A3A3C]/60 rounded-3xl p-8 mb-12"
				>
					<div className="flex flex-col md:flex-row items-center md:items-start gap-8">
						{/* Avatar */}
						<div className="relative group">
							<div className="w-37 h-37 rounded-full overflow-hidden border-2 border-[#3A3A3C]/60">
								{user.image ? (
									<Image
										src={user.image}
										alt={user.name}
										width={128}
										height={128}
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full bg-gradient-to-br from-[#27BBFF] to-[#1E40AF] flex items-center justify-center text-white text-3xl font-bold">
										{user.name?.[0]?.toUpperCase() || 'U'}
									</div>
								)}
							</div>
							{/* User Rank under avatar */}
							<div className="mt-5 flex justify-center">
								<UserRank user={user} />
							</div>
						</div>

						{/* User Info */}
						<div className="flex-1 flex flex-col md:flex-row justify-between w-full md:items-stretch gap-4">
							{/* Left Side */}
							<div className="w-full md:w-auto flex flex-col items-center md:items-start text-center md:text-left">
								<div className="flex items-center gap-2 mb-0.5">
									<h1 className="text-3xl font-extrabold text-white">
										{user.name}
									</h1>
									{user.level === 'Grandmaster' && (
										<VerifiedIcon className="text-[#FFC008] text-2xl" />
									)}
								</div>
								<p className="text-md text-white/50 mb-4">
									@{user.username}
								</p>
								{user.bio && (
									<p className="text-md text-white/60 mb-6 max-w-lg">
										{user.bio}
									</p>
								)}

								{/* Social Icons */}
								<div className="flex justify-center md:justify-start gap-5 mb-4.5">
									{user.linkedin && (
										<a
											href={user.linkedin}
											target="_blank"
											rel="noopener noreferrer"
											className="text-[#ACACAD] hover:text-white transition-colors"
										>
											<FontAwesomeIcon
												icon={faLinkedinBrand}
											/>
										</a>
									)}
									{user.github && (
										<a
											href={user.github}
											target="_blank"
											rel="noopener noreferrer"
											className="text-[#ACACAD] hover:text-white transition-colors"
										>
											<FontAwesomeIcon
												icon={faGithubBrand}
											/>
										</a>
									)}
									{user.instagram && (
										<a
											href={user.instagram}
											target="_blank"
											rel="noopener noreferrer"
											className="text-[#ACACAD] hover:text-white transition-colors"
										>
											<FontAwesomeIcon
												icon={faInstagramBrand}
											/>
										</a>
									)}
									{user.twitter && (
										<a
											href={user.twitter}
											target="_blank"
											rel="noopener noreferrer"
											className="text-[#ACACAD] hover:text-white transition-colors"
										>
											<FontAwesomeIcon
												icon={faXTwitterBrand}
											/>
										</a>
									)}
								</div>
								{isOwnProfile ? (
									<button
										onClick={handleEditProfile}
										className="cursor-pointer px-6 py-2 text-sm rounded-lg font-semibold bg-[#1C1C20] border border-[#3A3A3C]/60 text-white/60 hover:bg-[#2C2F36] transition-all duration-200 flex items-center gap-2"
									>
										<FontAwesomeIcon icon={faEdit} />
										Edit Profile
									</button>
								) : (
									<button
										onClick={handleFollow}
										className={`cursor-pointer px-6 py-2 text-sm rounded-lg font-semibold transition-all duration-200 ${
											isFollowing
												? 'bg-[#1C1C20] border border-[#3A3A3C]/60 text-white/60 hover:bg-[#2C2F36]'
												: 'bg-[#27BBFF] border border-[#27BBFF] text-[#101014]'
										}`}
									>
										{isFollowing ? 'Following' : 'Follow'}
									</button>
								)}
							</div>

							{/* Right Side */}
							<div className="w-full md:w-auto flex flex-col justify-between items-center md:items-end text-center md:text-right mt-6 md:mt-0">
								{/* Top Group: Stats and Joined Date */}
								<div>
									<div className="flex items-center justify-center md:justify-end gap-2 text-white/60">
										<FontAwesomeIcon
											icon={faCalendar}
											className="text-sm"
										/>
										<span className="text-sm mt-0.5">
											Member since{' '}
											{formatDate(user.joinedDate)}
										</span>
									</div>
									<div className="flex justify-center md:justify-end gap-5 text-white/60 mt-4">
										<span className="text-sm">
											{stats.projectCount} Projects
										</span>
										<span className="text-sm">•</span>
										<button
											onClick={handleFollowersClick}
											className="text-sm hover:text-white transition-colors cursor-pointer"
										>
											{stats.followerCount} Followers
										</button>
										<span className="text-sm">•</span>
										<button
											onClick={handleFollowingClick}
											className="text-sm hover:text-white transition-colors cursor-pointer"
										>
											{stats.followingCount} Following
										</button>
									</div>
								</div>

								{/* Bottom Group: Action Buttons */}
								<div className="flex flex-col sm:flex-row justify-center md:justify-end gap-3 mt-6 md:mt-0">
									<button
										onClick={handleCopyProfileLink}
										className="px-4 py-2 text-sm rounded-lg font-semibold bg-[#1C1C20] border border-[#3A3A3C]/60 text-white/60 hover:bg-[#2C2F36] transition-all duration-200 flex items-center gap-2"
									>
										<FontAwesomeIcon icon={faCopy} />
										Copy Link
									</button>
									<button
										onClick={handleShareProfile}
										className="px-4 py-2 text-sm rounded-lg font-semibold bg-[#1C1C20] border border-[#3A3A3C]/60 text-white/60 hover:bg-[#2C2F36] transition-all duration-200 flex items-center gap-2"
									>
										<FontAwesomeIcon icon={faShare} />
										Share
									</button>
								</div>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Watts Display (only for own profile) */}
				<WattsDisplay user={user} isOwnProfile={isOwnProfile} />

				{/* Badges Section */}
				{/* <motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="bg-[#13151A]/50 backdrop-blur-sm border border-[#3A3A3C]/60 rounded-2xl p-6 mb-12"
				>
					<h2 className="text-2xl font-bold text-white mb-6">
						Achievements
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<div className="bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/20 border border-[#FFD700]/30 rounded-xl p-4 backdrop-blur-sm">
							<div className="flex items-center gap-3">
								<span className="text-2xl">🥇</span>
								<div>
									<h3 className="font-semibold text-white">
										Early Contributor
									</h3>
									<p className="text-white/60 text-sm">
										One of the first members
									</p>
								</div>
							</div>
						</div>
						<div className="bg-gradient-to-r from-[#27BBFF]/20 to-[#1E40AF]/20 border border-[#27BBFF]/30 rounded-xl p-4 backdrop-blur-sm">
							<div className="flex items-center gap-3">
								<span className="text-2xl">⚡</span>
								<div>
									<h3 className="font-semibold text-white">
										Top Project
									</h3>
									<p className="text-white/60 text-sm">
										Featured project of the month
									</p>
								</div>
							</div>
						</div>
						<div className="bg-gradient-to-r from-[#10B981]/20 to-[#059669]/20 border border-[#10B981]/30 rounded-xl p-4 backdrop-blur-sm">
							<div className="flex items-center gap-3">
								<span className="text-2xl">🚀</span>
								<div>
									<h3 className="font-semibold text-white">
										Active Creator
									</h3>
									<p className="text-white/60 text-sm">
										Published multiple projects
									</p>
								</div>
							</div>
						</div>
					</div>
				</motion.div> */}

				{/* Projects Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
				>
					<div className="flex items-center justify-between mb-8">
						<h2 className="text-[28px] font-extrabold text-white">
							Projects
						</h2>
						<div className="flex items-center gap-4 text-white/60">
							<div className="flex items-center gap-2">
								<FontAwesomeIcon icon={faEye} />
								<span className="text-sm">
									{stats.totalViews} total views
								</span>
							</div>
							<div className="flex items-center gap-2">
								<FontAwesomeIcon
									icon={faHeart}
									className="text-[#e22043]"
								/>
								<span className="text-sm">
									{stats.totalLikes} total likes
								</span>
							</div>
						</div>
					</div>

					{projects.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							{projects.map((project) => (
								<ProjectCard
									key={project.id}
									title={project.title}
									category={project.category}
									description={project.description}
									imageUrl={project.thumbnailUrl}
									categoryColor={
										categoryColors[project.category] ||
										'#27BBFF'
									}
									authorName={user.name}
									authorImage={user.image}
									authorEmail={user.email}
									views={project.views}
									likes={project.likes}
									slug={project.slug}
								/>
							))}
						</div>
					) : (
						<div className="text-center py-12">
							<div className="bg-[#13151A]/50 backdrop-blur-sm border border-[#3A3A3C]/60 rounded-2xl p-8">
								<div className="text-6xl mb-4">🔧</div>
								<h3 className="text-xl font-semibold text-white mb-2">
									No Projects Yet
								</h3>
								<p className="text-white/60">
									{user.name} hasn't published any projects
									yet. Check back later!
								</p>
							</div>
						</div>
					)}
				</motion.div>
			</LayoutContainer>

			{/* Followers Modal */}
			{showFollowersModal && (
				<div
					className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
					onClick={() => setShowFollowersModal(false)}
				>
					<div
						className="bg-[#13151A] border border-[#3A3A3C]/60 rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-hidden"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-bold text-white">
								Followers
							</h3>
							<button
								onClick={() => setShowFollowersModal(false)}
								className="text-white/60 hover:text-white transition-colors cursor-pointer"
							>
								✕
							</button>
						</div>
						<div className="overflow-y-auto max-h-[60vh]">
							{loadingFollowers ? (
								<div className="text-center py-8">
									<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#27BBFF] mx-auto"></div>
								</div>
							) : followers.length > 0 ? (
								<div className="space-y-3">
									{followers.map((follower) => (
										<div
											key={follower.id}
											className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1C1C20] transition-colors cursor-pointer"
											onClick={() => {
												setShowFollowersModal(false);
												router.push(
													`/u/${follower.username}`
												);
											}}
										>
											<div className="w-10 h-10 rounded-full overflow-hidden">
												{follower.image ? (
													<Image
														src={follower.image}
														alt={follower.name}
														width={40}
														height={40}
														className="w-full h-full object-cover"
													/>
												) : (
													<div className="w-full h-full bg-gradient-to-br from-[#27BBFF] to-[#1E40AF] flex items-center justify-center text-white text-sm font-bold">
														{follower.name?.[0]?.toUpperCase() ||
															'U'}
													</div>
												)}
											</div>
											<div className="flex-1">
												<p className="text-white font-medium">
													{follower.name}
												</p>
												<p className="text-white/60 text-sm">
													@{follower.username}
												</p>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-8 text-white/60">
									No followers yet
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Following Modal */}
			{showFollowingModal && (
				<div
					className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
					onClick={() => setShowFollowingModal(false)}
				>
					<div
						className="bg-[#13151A] border border-[#3A3A3C]/60 rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-hidden"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-bold text-white">
								Following
							</h3>
							<button
								onClick={() => setShowFollowingModal(false)}
								className="text-white/60 hover:text-white transition-colors cursor-pointer"
							>
								✕
							</button>
						</div>
						<div className="overflow-y-auto max-h-[60vh]">
							{loadingFollowing ? (
								<div className="text-center py-8">
									<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#27BBFF] mx-auto"></div>
								</div>
							) : following.length > 0 ? (
								<div className="space-y-3">
									{following.map((followedUser) => (
										<div
											key={followedUser.id}
											className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1C1C20] transition-colors cursor-pointer"
											onClick={() => {
												setShowFollowingModal(false);
												router.push(
													`/u/${followedUser.username}`
												);
											}}
										>
											<div className="w-10 h-10 rounded-full overflow-hidden">
												{followedUser.image ? (
													<Image
														src={followedUser.image}
														alt={followedUser.name}
														width={40}
														height={40}
														className="w-full h-full object-cover"
													/>
												) : (
													<div className="w-full h-full bg-gradient-to-br from-[#27BBFF] to-[#1E40AF] flex items-center justify-center text-white text-sm font-bold">
														{followedUser.name?.[0]?.toUpperCase() ||
															'U'}
													</div>
												)}
											</div>
											<div className="flex-1">
												<p className="text-white font-medium">
													{followedUser.name}
												</p>
												<p className="text-white/60 text-sm">
													@{followedUser.username}
												</p>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-8 text-white/60">
									Not following anyone yet
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
