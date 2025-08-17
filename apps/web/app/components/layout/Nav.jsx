'use client';

import {
	faMagnifyingGlass,
	faSignOutAlt,
	faTachometerAlt,
	faUser,
	faBars,
	faTimes,
	faHome,
	faPlus,
	faQuestionCircle,
	faFileAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	useAuthModal,
	useCustomSession,
	useSearchModal,
} from '@ohmmade/providers';
import LayoutContainer from '@ohmmade/ui/layout-container';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function Nav() {
	const session = useSession();
	const { isLoading } = useCustomSession();
	const supabaseClient = useSupabaseClient();
	const router = useRouter();
	const pathname = usePathname();
	const userRef = useRef(null);

	const [user, setUser] = useState(session?.user || null);
	const [userProfile, setUserProfile] = useState(null);
	const [isProfileLoading, setIsProfileLoading] = useState(false);
	const [showUserDropdown, setShowUserDropdown] = useState(false);
	const [hoveredLink, setHoveredLink] = useState(null);
	const [highlightStyle, setHighlightStyle] = useState({
		opacity: 0,
		left: 0,
		top: 0,
		width: 0,
		height: 0,
	});
	const [atTop, setAtTop] = useState(true);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		const refreshSession = async () => {
			const { data } = await supabaseClient.auth.getSession();
			if (data.session?.user) setUser(data.session.user);
		};

		if (!session) refreshSession();
		else setUser(session.user);
	}, [session, supabaseClient]);

	// Fetch user profile from your own DB
	useEffect(() => {
		if (!session?.user?.email) {
			setUserProfile(null);
			setIsProfileLoading(false);
			return;
		}

		setIsProfileLoading(true);
		fetch(`/api/user/profile?email=${session.user.email}`)
			.then((res) => res.json())
			.then((data) => {
				setUserProfile(data);
			})
			.catch((error) => {
				console.error('Error fetching user profile:', error);
			})
			.finally(() => {
				setIsProfileLoading(false);
			});
	}, [session]);

	// Floating nav logic - sync with banner threshold
	useEffect(() => {
		let ticking = false;
		const handleScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					const currentY = window.scrollY;
					// Use same threshold as banner (50px) when on homepage
					if (pathname === '/') {
						setAtTop(currentY <= 50);
					} else {
						setAtTop(currentY === 0);
					}
					ticking = false;
				});
				ticking = true;
			}
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [pathname]);

	useEffect(() => {
		const currentY = window.scrollY;
		// Use same threshold as banner (50px) when on homepage
		if (pathname === '/') {
			setAtTop(currentY <= 50);
		} else {
			setAtTop(currentY === 0);
		}
	}, [pathname]);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (userRef.current && !userRef.current.contains(e.target)) {
				setShowUserDropdown(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// Close mobile menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (e) => {
			const mobileMenu = document.getElementById('mobile-menu');
			const hamburgerButton = document.getElementById('hamburger-button');

			if (
				mobileMenu &&
				!mobileMenu.contains(e.target) &&
				hamburgerButton &&
				!hamburgerButton.contains(e.target)
			) {
				setIsMobileMenuOpen(false);
			}
		};

		if (isMobileMenuOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isMobileMenuOpen]);

	// Prevent body scroll when mobile menu is open
	useEffect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}

		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isMobileMenuOpen]);

	useEffect(() => {
		if (hoveredLink) {
			const rect = hoveredLink.getBoundingClientRect();
			const navContainer = hoveredLink.closest('nav');
			const navRect = navContainer.getBoundingClientRect();

			setHighlightStyle({
				opacity: 1,
				left: rect.left - navRect.left - 8,
				top: rect.top - navRect.top,
				width: rect.width + 16,
				height: rect.height,
			});
		}
	}, [hoveredLink]);

	const handleLinkHover = (e) => {
		setHoveredLink(e.currentTarget);
	};

	const handleNavLeave = () => {
		setHoveredLink(null);
		setHighlightStyle((prev) => ({ ...prev, opacity: 0 }));
	};

	const handleSignOut = async () => {
		await supabaseClient.auth.signOut();
		setUser(null);
		await supabaseClient.auth.getSession();
		setIsMobileMenuOpen(false);
		router.push('/');
	};

	const handleMobileMenuToggle = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
		setShowUserDropdown(false);
	};

	const handleMobileLinkClick = () => {
		setIsMobileMenuOpen(false);
	};

	const getInitials = (nameOrEmail) => {
		if (!nameOrEmail) return 'U';
		const words = nameOrEmail.split(' ');
		if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
		return (words[0][0] + words[1][0]).toUpperCase();
	};

	const { openAuthModal } = useAuthModal();
	const { openSearchModal } = useSearchModal();

	return (
		<>
			<header
				className="fixed left-0 w-full z-50 flex justify-center pointer-events-none transition-all duration-300"
				style={{
					top: pathname === '/' && atTop ? '48px' : '0px',
				}}
			>
				<LayoutContainer className="w-full pointer-events-auto mt-4">
					<div
						className={`transition-all duration-700 ease-in-out
						${
							atTop
								? 'rounded-none shadow-none bg-transparent backdrop-blur-lg border-transparent translate-y-0'
								: 'rounded-full bg-[#101014]/60 backdrop-blur-lg border-t border-t-white/20 shadow-[0_4px_24px_0_rgba(0,0,0,0.10)] translate-y-4'
						}
					`}
					>
						<div
							className={`relative flex items-center h-14 w-full transition-all duration-700 ease-in-out ${
								atTop ? '' : 'px-6 sm:px-12'
							}`}
						>
							{/* Left: Logo */}
							<div className="flex items-center flex-shrink-0 z-10">
								<Link href="/" className="flex items-center">
									<Image
										src="/assets/OMLogoBanner.png"
										alt="OhmMade Logo Banner"
										height={160}
										width={762}
										className="object-contain h-9 sm:h-9 w-auto max-h-[28px]"
										priority
									/>
								</Link>
							</div>

							{/* Center: Nav Links (hidden on mobile) */}
							<div className="hidden lg:flex absolute left-1/2 top-0 -translate-x-1/2 h-full items-center justify-center">
								<nav
									className="flex items-center space-x-6 text-white/90 font-[450] text-[14px] relative"
									onMouseLeave={handleNavLeave}
								>
									{/* Animated highlight background */}
									<motion.div
										className="absolute bg-gray-700/30 rounded-full pointer-events-none"
										animate={highlightStyle}
										transition={{
											type: 'spring',
											stiffness: 200,
											damping: 20,
											mass: 0.6,
											opacity: {
												type: 'spring',
												stiffness: 350,
												damping: 30,
												duration: 0.12,
											},
											left: {
												type: 'spring',
												stiffness: 180,
												damping: 18,
												mass: 0.5,
											},
											width: {
												type: 'spring',
												stiffness: 220,
												damping: 22,
												mass: 0.6,
											},
											top: {
												type: 'spring',
												stiffness: 200,
												damping: 20,
												mass: 0.5,
											},
											height: {
												type: 'spring',
												stiffness: 200,
												damping: 20,
												mass: 0.5,
											},
										}}
										style={{
											zIndex: 1,
										}}
									/>

									{/* Explore */}
									<Link
										href="/projects"
										className="transition relative z-10 px-2 py-2"
										onMouseEnter={handleLinkHover}
									>
										Explore
									</Link>

									{/* Create */}
									<Link
										href="/projects/publish"
										className="transition relative z-10 px-2 py-2"
										onMouseEnter={handleLinkHover}
									>
										Create
									</Link>

									{/* Help */}
									<Link
										href="https://support.ohmmade.ca"
										className="transition relative z-10 px-2 py-2"
										onMouseEnter={handleLinkHover}
									>
										Help
									</Link>

									{/* About */}
									<Link
										href="/manifesto"
										className="transition relative z-10 px-2 py-2"
										onMouseEnter={handleLinkHover}
									>
										Manifesto
									</Link>

									<div className="relative z-10">
										<button
											className="text-white/80 hover:text-white transition cursor-pointer"
											onClick={() => openSearchModal()}
										>
											<FontAwesomeIcon
												icon={faMagnifyingGlass}
												size="md"
											/>
										</button>
									</div>
								</nav>
							</div>

							{/* Right: User (hidden on mobile) */}
							<div className="hidden lg:flex items-center flex-shrink-0 ml-auto z-10">
								{/* User Auth Section */}
								{isProfileLoading ? (
									<div className="flex items-center gap-2">
										<div className="w-[28px] h-[28px] rounded-full bg-[#1C1C20] border border-[#3A3A3C]/60 flex items-center justify-center">
											<div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white/40"></div>
										</div>
										<div className="w-16 h-4 bg-[#1C1C20] rounded animate-pulse"></div>
									</div>
								) : user ? (
									<div className="relative" ref={userRef}>
										<button
											onClick={() =>
												setShowUserDropdown(
													(prev) => !prev
												)
											}
											className="cursor-pointer flex items-center gap-2 text-white hover:text-[#ACACAD] transition-colors"
										>
											{userProfile?.image ? (
												<Image
													src={userProfile.image}
													alt="Avatar"
													width={28}
													height={28}
													className="rounded-full object-cover w-[28px] h-[28px] ring-2 ring-[#3A3A3C]/60 overflow-hidden"
												/>
											) : (
												<div className="w-[28px] h-[28px] rounded-full bg-[#1C1C20] border border-[#3A3A3C]/60 flex items-center justify-center text-xs font-semibold">
													{getInitials(
														userProfile?.name ||
															user?.email
													)}
												</div>
											)}
											<span className="text-[14px] font-medium">
												{userProfile?.name || 'User'}
											</span>
										</button>

										<AnimatePresence>
											{showUserDropdown && (
												<motion.div
													initial={{
														opacity: 0,
														y: 8,
													}}
													animate={{
														opacity: 1,
														y: 0,
													}}
													exit={{ opacity: 0, y: 8 }}
													transition={{
														type: 'spring',
														stiffness: 400,
														damping: 30,
														duration: 0.2,
													}}
													className="absolute right-0 top-full mt-4 bg-[#1C1C20]/95 text-white rounded-xl shadow-xl backdrop-blur-xl w-44"
												>
													<div className="absolute top-full right-0 mt-2 w-56 bg-[#1C1C20]/95 border border-[#3A3A3C]/60 text-white text-sm rounded-xl shadow-xl backdrop-blur-xl overflow-hidden">
														<div className="p-4 border-b border-[#3A3A3C]/60">
															<p className="font-semibold truncate">
																{userProfile?.name ||
																	user
																		.user_metadata
																		?.name ||
																	'User'}
															</p>
															<p className="text-xs text-white/60 truncate">
																{user.email}
															</p>
														</div>
														<div className="py-2">
															<Link
																href={`/u/${userProfile?.username}`}
																onClick={() =>
																	setShowUserDropdown(
																		false
																	)
																}
																className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors"
															>
																<FontAwesomeIcon
																	icon={
																		faUser
																	}
																	className="w-4"
																/>
																<span>
																	Profile
																</span>
															</Link>
															<Link
																href="/dashboard"
																onClick={() =>
																	setShowUserDropdown(
																		false
																	)
																}
																className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors"
															>
																<FontAwesomeIcon
																	icon={
																		faTachometerAlt
																	}
																	className="w-4"
																/>
																<span>
																	Dashboard
																</span>
															</Link>
															<div className="h-px bg-[#3A3A3C]/60 my-1"></div>
															<button
																onClick={
																	handleSignOut
																}
																className="cursor-pointer w-full text-left px-4 py-2.5 hover:bg-white/5 transition-colors rounded-b-xl flex items-center gap-2"
															>
																<FontAwesomeIcon
																	icon={
																		faSignOutAlt
																	}
																/>
																Sign Out
															</button>
														</div>
													</div>
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								) : (
									<div className="flex items-center gap-1">
										<motion.button
											onClick={() =>
												openAuthModal('login')
											}
											className="text-white text-[14px] font-medium px-4 py-2 rounded-full cursor-pointer"
											whileHover={{
												color: '#ACACAD',
												scale: 1.02,
											}}
											whileTap={{
												scale: 0.98,
											}}
											transition={{
												type: 'spring',
												stiffness: 400,
												damping: 25,
											}}
										>
											Log in
										</motion.button>
										<motion.button
											onClick={() =>
												openAuthModal('signup')
											}
											className="bg-[#27BBFF] text-[14px] text-[#101014] font-medium px-4 py-2 rounded-full cursor-pointer"
											whileHover={{
												scale: 1.05,
												boxShadow:
													'0 4px 20px rgba(39, 187, 255, 0.4)',
											}}
											whileTap={{
												scale: 0.95,
											}}
											transition={{
												type: 'spring',
												stiffness: 400,
												damping: 25,
											}}
										>
											Sign up
										</motion.button>
									</div>
								)}
							</div>

							{/* Mobile: Search and Menu */}
							<div className="lg:hidden flex items-center gap-3 ml-auto z-10">
								{/* Search Button */}
								<button
									onClick={() => openSearchModal()}
									className="p-2 text-white/80 hover:text-white transition-colors"
								>
									<FontAwesomeIcon icon={faMagnifyingGlass} />
								</button>

								{/* Hamburger Menu Button */}
								<button
									id="hamburger-button"
									onClick={handleMobileMenuToggle}
									className="p-2 text-white/80 hover:text-white transition-colors"
								>
									<AnimatePresence mode="wait">
										{isMobileMenuOpen ? (
											<motion.div
												key="close"
												initial={{
													rotate: -90,
													opacity: 0,
												}}
												animate={{
													rotate: 0,
													opacity: 1,
												}}
												exit={{
													rotate: 90,
													opacity: 0,
												}}
												transition={{ duration: 0.2 }}
											>
												<FontAwesomeIcon
													icon={faTimes}
												/>
											</motion.div>
										) : (
											<motion.div
												key="menu"
												initial={{
													rotate: 90,
													opacity: 0,
												}}
												animate={{
													rotate: 0,
													opacity: 1,
												}}
												exit={{
													rotate: -90,
													opacity: 0,
												}}
												transition={{ duration: 0.2 }}
											>
												<FontAwesomeIcon
													icon={faBars}
												/>
											</motion.div>
										)}
									</AnimatePresence>
								</button>
							</div>
						</div>
					</div>
				</LayoutContainer>
			</header>

			{/* Mobile Menu Overlay */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
						/>

						{/* Mobile Menu */}
						<motion.div
							id="mobile-menu"
							initial={{ x: '100%' }}
							animate={{ x: 0 }}
							exit={{ x: '100%' }}
							transition={{
								type: 'spring',
								stiffness: 300,
								damping: 30,
							}}
							className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-[#101014]/95 backdrop-blur-xl border-l border-white/10 z-50 overflow-y-auto"
						>
							{/* Header */}
							<div className="p-6 border-b border-white/10">
								<div className="flex items-center justify-between mb-4">
									<h2 className="text-xl font-semibold text-white">
										Menu
									</h2>
									<button
										onClick={handleMobileMenuToggle}
										className="p-2 text-white/60 hover:text-white transition-colors"
									>
										<FontAwesomeIcon icon={faTimes} />
									</button>
								</div>

								{/* User Info */}
								{user && (
									<div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
										{userProfile?.image ? (
											<Image
												src={userProfile.image}
												alt="Avatar"
												width={48}
												height={48}
												className="rounded-full object-cover"
											/>
										) : (
											<div className="w-12 h-12 rounded-full bg-[#1C1C20] border border-[#3A3A3C]/60 flex items-center justify-center text-lg font-semibold">
												{getInitials(
													userProfile?.name ||
														user?.email
												)}
											</div>
										)}
										<div className="flex-1 min-w-0">
											<p className="font-semibold text-white truncate">
												{userProfile?.name ||
													user.user_metadata?.name ||
													'User'}
											</p>
											<p className="text-sm text-white/60 truncate">
												{user.email}
											</p>
										</div>
									</div>
								)}
							</div>

							{/* Navigation Links */}
							<div className="p-4 space-y-2">
								{/* Home */}
								<Link
									href="/"
									onClick={handleMobileLinkClick}
									className="flex items-center gap-4 p-4 text-white hover:bg-white/5 rounded-xl transition-colors"
								>
									<FontAwesomeIcon
										icon={faHome}
										className="w-5"
									/>
									<span className="font-medium">Home</span>
								</Link>

								{/* Explore */}
								<Link
									href="/projects"
									onClick={handleMobileLinkClick}
									className="flex items-center gap-4 p-4 text-white hover:bg-white/5 rounded-xl transition-colors"
								>
									<FontAwesomeIcon
										icon={faMagnifyingGlass}
										className="w-5"
									/>
									<span className="font-medium">Explore</span>
								</Link>

								{/* Create */}
								<Link
									href="/projects/publish"
									onClick={handleMobileLinkClick}
									className="flex items-center gap-4 p-4 text-white hover:bg-white/5 rounded-xl transition-colors"
								>
									<FontAwesomeIcon
										icon={faPlus}
										className="w-5"
									/>
									<span className="font-medium">Create</span>
								</Link>

								{/* Help */}
								<Link
									href="https://support.ohmmade.ca"
									onClick={handleMobileLinkClick}
									className="flex items-center gap-4 p-4 text-white hover:bg-white/5 rounded-xl transition-colors"
								>
									<FontAwesomeIcon
										icon={faQuestionCircle}
										className="w-5"
									/>
									<span className="font-medium">Help</span>
								</Link>

								{/* Manifesto */}
								<Link
									href="/manifesto"
									onClick={handleMobileLinkClick}
									className="flex items-center gap-4 p-4 text-white hover:bg-white/5 rounded-xl transition-colors"
								>
									<FontAwesomeIcon
										icon={faFileAlt}
										className="w-5"
									/>
									<span className="font-medium">
										Manifesto
									</span>
								</Link>
							</div>

							{/* User Actions */}
							{user ? (
								<div className="p-4 space-y-2 border-t border-white/10">
									<Link
										href={`/u/${userProfile?.username}`}
										onClick={handleMobileLinkClick}
										className="flex items-center gap-4 p-4 text-white hover:bg-white/5 rounded-xl transition-colors"
									>
										<FontAwesomeIcon
											icon={faUser}
											className="w-5"
										/>
										<span className="font-medium">
											Profile
										</span>
									</Link>
									<Link
										href="/dashboard"
										onClick={handleMobileLinkClick}
										className="flex items-center gap-4 p-4 text-white hover:bg-white/5 rounded-xl transition-colors"
									>
										<FontAwesomeIcon
											icon={faTachometerAlt}
											className="w-5"
										/>
										<span className="font-medium">
											Dashboard
										</span>
									</Link>
									<button
										onClick={handleSignOut}
										className="w-full flex items-center gap-4 p-4 text-white hover:bg-white/5 rounded-xl transition-colors"
									>
										<FontAwesomeIcon
											icon={faSignOutAlt}
											className="w-5"
										/>
										<span className="font-medium">
											Sign Out
										</span>
									</button>
								</div>
							) : (
								<div className="p-4 space-y-3 border-t border-white/10">
									<button
										onClick={() => {
											openAuthModal('login');
											handleMobileLinkClick();
										}}
										className="w-full p-4 text-white border border-white/20 hover:bg-white/5 rounded-xl transition-colors font-medium"
									>
										Log in
									</button>
									<button
										onClick={() => {
											openAuthModal('signup');
											handleMobileLinkClick();
										}}
										className="w-full p-4 bg-[#27BBFF] text-[#101014] hover:bg-[#1ea8e6] rounded-xl transition-colors font-medium"
									>
										Sign up
									</button>
								</div>
							)}
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
