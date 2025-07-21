'use client';

import { useAuthModal } from '@ohmmade/providers';
import {
	faMagnifyingGlass,
	faSignOutAlt,
	faTachometerAlt,
	faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import LayoutContainer from '@ohmmade/ui/layout-container';
import { useCustomSession } from '@ohmmade/providers';

export default function Nav() {
	const session = useSession();
	const { isLoading } = useCustomSession();
	const supabaseClient = useSupabaseClient();
	const router = useRouter();
	const userRef = useRef(null);

	const [user, setUser] = useState(session?.user || null);
	const [userProfile, setUserProfile] = useState(null);
	const [isProfileLoading, setIsProfileLoading] = useState(false);
	const [showUserDropdown, setShowUserDropdown] = useState(false);
	const [atTop, setAtTop] = useState(true);

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

	// Floating nav logic
	useEffect(() => {
		let ticking = false;
		const handleScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					const currentY = window.scrollY;
					setAtTop(currentY === 0);
					ticking = false;
				});
				ticking = true;
			}
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	useEffect(() => {
		const currentY = window.scrollY;
		setAtTop(currentY === 0);
	}, []);

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

	const handleSignOut = async () => {
		await supabaseClient.auth.signOut();
		setUser(null);
		await supabaseClient.auth.getSession();
		router.push('/');
	};

	const getInitials = (nameOrEmail) => {
		if (!nameOrEmail) return 'U';
		const words = nameOrEmail.split(' ');
		if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
		return (words[0][0] + words[1][0]).toUpperCase();
	};

	const { openAuthModal } = useAuthModal();

	return (
		<header className="fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none">
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
							atTop ? '' : 'px-12'
						}`}
					>
						{/* Left: Logo */}
						<div className="flex items-center flex-shrink-0 z-10">
							<Link href="/" className="flex items-center gap-2">
								<Image
									src="/assets/OMSupportLogoBanner.png"
									alt="OhmMade Logo Banner"
									height={160}
									width={1273}
									className="object-contain h-9 sm:h-9 w-auto max-h-[28px]"
									priority
								/>
							</Link>
						</div>

						{/* Right: User */}
						<div className="flex items-center flex-shrink-0 ml-auto z-10">
							<motion.button
								className="text-white text-[14px] font-medium px-4 py-2 rounded-full cursor-pointer mr-4"
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
								<Link href="https://ohmmade.ca">
									Back to Home
								</Link>
							</motion.button>

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
											setShowUserDropdown((prev) => !prev)
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
												initial={{ opacity: 0, y: 8 }}
												animate={{ opacity: 1, y: 0 }}
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
																icon={faUser}
																className="w-4"
															/>
															<span>Profile</span>
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
										onClick={() => openAuthModal('login')}
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
										onClick={() => openAuthModal('signup')}
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
					</div>
				</div>
			</LayoutContainer>
		</header>
	);
}
