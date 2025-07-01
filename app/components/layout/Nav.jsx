'use client';

import { supabase } from '@/lib/supabaseClient';
import {
	faAngleDown,
	faGlobe,
	faSignOutAlt,
	faUser,
	faAddressCard,
	faTachometerAlt,
	faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import AuthModal from '../auth/AuthModal';

export default function Nav() {
	const session = useSession();
	const supabaseClient = useSupabaseClient();
	const router = useRouter();
	const userRef = useRef(null);
	const languageRef = useRef(null);

	const [user, setUser] = useState(session?.user || null);
	const [userProfile, setUserProfile] = useState(null);
	const [scrolled, setScrolled] = useState(false);
	const [showLanguageMenu, setShowLanguageMenu] = useState(false);
	const [showUserDropdown, setShowUserDropdown] = useState(false);
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [showFloating, setShowFloating] = useState(false);
	const [lastScrollY, setLastScrollY] = useState(0);
	const [authMode, setAuthMode] = useState('login');
	const [atTop, setAtTop] = useState(true);
	const [hasScrolled, setHasScrolled] = useState(false);

	// Once we've scrolled, keep floating styles until we're back at the top
	const isFloatingStyle = hasScrolled && !atTop;

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
		if (!session?.user?.email) return;
		fetch(`/api/user/profile?email=${session.user.email}`)
			.then((res) => res.json())
			.then((data) => setUserProfile(data));
	}, [session]);

	useEffect(() => {
		let ticking = false;
		const handleScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					const currentY = window.scrollY;
					const wasAtTop = atTop;
					setAtTop(currentY === 0);

					// Set hasScrolled when we first leave the top
					if (wasAtTop && currentY > 0) {
						setHasScrolled(true);
					}
					// Reset hasScrolled when we're back at the top
					if (currentY === 0) {
						setHasScrolled(false);
						setShowFloating(false);
					} else if (currentY > lastScrollY) {
						setShowFloating(false);
					} else {
						setShowFloating(true);
					}
					setLastScrollY(currentY);
					ticking = false;
				});
				ticking = true;
			}
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [lastScrollY, atTop]);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (
				languageRef.current &&
				!languageRef.current.contains(e.target)
			) {
				setShowLanguageMenu(false);
			}
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
		await supabaseClient.auth.signOut(); // ✅ use supabaseClient instead of supabase
		setUser(null); // instantly update UI

		// Optionally refetch session to make sure context is synced
		await supabaseClient.auth.getSession();

		router.push('/');
	};

	const getInitials = (nameOrEmail) => {
		if (!nameOrEmail) return 'U';
		const words = nameOrEmail.split(' ');
		if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
		return (words[0][0] + words[1][0]).toUpperCase();
	};

	return (
		<header className="fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none">
			<div
				className={`pointer-events-auto transition-all duration-300 ease-in-out max-w-[1573px] w-full
				${
					atTop
						? 'mt-4 rounded-none shadow-none bg-transparent backdrop-blur-lg px-0 translate-y-0 border-transparent'
						: showFloating
						? 'mt-4 rounded-full shadow-2xl bg-[#101014]/60 backdrop-blur-lg px-8 sm:px-16 border border-[#3A3A3C]/60 translate-y-0'
						: 'mt-4 rounded-full shadow-2xl bg-[#101014]/60 backdrop-blur-lg px-8 sm:px-16 border border-[#3A3A3C]/60 -translate-y-[120%] pointer-events-none'
				}
				`}
			>
				<div className="relative flex items-center h-14 w-full">
					{/* Left: Logo */}
					<div className="flex items-center flex-shrink-0 z-10">
						<Link href="/" className="flex items-center space-x-2">
							<Image
								src="/assets/newohmlogo.png"
								alt="OhmMade Logo"
								width={22}
								height={22}
								className="object-contain"
								priority
							/>
							<span className="text-white font-extrabold text-lg mt-1">
								OhmMade
							</span>
						</Link>
					</div>

					{/* Center: Nav Links (absolute center) */}
					<div className="absolute left-1/2 top-0 -translate-x-1/2 h-full flex items-center justify-center">
						<nav className="flex items-center space-x-6 text-white font-[450] text-[14px]">
							{/* Learn Dropdown */}
							<div className="relative group">
								<div className="flex items-center px-2 py-2 cursor-pointer hover:text-[#ACACAD] transition-colors">
									Learn
									<FontAwesomeIcon
										icon={faAngleDown}
										size="xs"
										className="ml-1.5 transition-transform duration-300 group-hover:rotate-180"
									/>
								</div>
								<div className="absolute top-full left-0 mt-3 min-w-[200px] bg-[#1C1C20]/95 border border-[#3A3A3C]/60 text-white rounded-xl shadow-xl backdrop-blur-xl opacity-0 invisible translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out overflow-hidden z-30">
									{[
										'basic-electronics',
										'arduino-uno',
										'raspberry-pi-4',
										'raspberry-pi-pico-w',
									].map((path, index) => (
										<Link
											key={path}
											href={`/learn/${path}`}
											className="block px-5 py-3 hover:bg-white/5 transition-colors text-[15px] font-[450]"
										>
											{path
												.replace(/-/g, ' ')
												.replace(/\b\w/g, (c) =>
													c.toUpperCase()
												)}
										</Link>
									))}
								</div>
							</div>

							{/* Projects Dropdown */}
							<div className="relative group">
								<div className="flex items-center px-2 py-2 cursor-pointer hover:text-[#ACACAD] transition-colors">
									<Link
										href="/projects"
										className="flex items-center"
									>
										Projects
										<FontAwesomeIcon
											icon={faAngleDown}
											size="xs"
											className="ml-1.5 transition-transform duration-300 group-hover:rotate-180"
										/>
									</Link>
								</div>
								<div className="absolute top-full left-0 mt-3 min-w-[200px] bg-[#1C1C20]/95 border border-[#3A3A3C]/60 text-white rounded-xl shadow-xl backdrop-blur-xl opacity-0 invisible translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out overflow-hidden z-30">
									<Link
										href="/projects"
										className="block px-5 py-3 hover:bg-white/5 transition-colors text-[15px] font-[450] rounded-t-xl"
									>
										Explore Projects
									</Link>
									<Link
										href="/projects/publish"
										className="block px-5 py-3 hover:bg-white/5 transition-colors text-[15px] font-[450] rounded-b-xl"
									>
										Publish Your Own
									</Link>
								</div>
							</div>

							{/* Static links */}
							{['blog', 'help', 'about'].map((page) => (
								<Link
									key={page}
									href={`/${page}`}
									className="hover:text-[#ACACAD] transition"
								>
									{page.charAt(0).toUpperCase() +
										page.slice(1)}
								</Link>
							))}
							<div className="relative" ref={languageRef}>
								<button className="text-white/90 hover:text-white transition cursor-pointer">
									<FontAwesomeIcon
										icon={faMagnifyingGlass}
										size="md"
									/>
								</button>
							</div>
						</nav>
					</div>

					{/* Right: Search, Language, User */}
					<div className="flex items-center flex-shrink-0 ml-auto z-10">
						{/* Search Icon */}

						{/* Language */}
						{/* <div className="relative" ref={languageRef}>
							<button
								onClick={() =>
									setShowLanguageMenu(!showLanguageMenu)
								}
								className="text-white/90 hover:text-white transition cursor-pointer"
							>
								<FontAwesomeIcon icon={faGlobe} size="xl" />
							</button>
							{showLanguageMenu && (
								<div className="absolute top-full left-[-12px] mt-4 w-32 bg-[#2c2d2e] border border-[#454547] text-white text-sm rounded-lg p-3 shadow-lg z-50 backdrop-blur-3xl">
									<p className="text-center">
										Coming soon...
									</p>
								</div>
							)}
						</div> */}

						{/* User Auth Section */}
						{user ? (
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
												userProfile?.name || user?.email
											)}
										</div>
									)}
									<span className="text-[14px] font-medium">
										{userProfile?.name || 'User'}
									</span>
								</button>

								{showUserDropdown && (
									<motion.div
										initial={{ opacity: 0, y: 8 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: 8 }}
										transition={{ duration: 0.2 }}
										className="absolute right-0 top-full mt-4 bg-[#1C1C20]/95 text-white rounded-xl shadow-xl backdrop-blur-xl w-44"
									>
										<div className="absolute top-full right-0 mt-2 w-56 bg-[#1C1C20]/95 border border-[#3A3A3C]/60 text-white text-sm rounded-xl shadow-xl backdrop-blur-xl overflow-hidden">
											<div className="p-4 border-b border-[#3A3A3C]/60">
												<p className="font-semibold truncate">
													{userProfile?.name ||
														user.user_metadata
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
														icon={faTachometerAlt}
														className="w-4"
													/>
													<span>Dashboard</span>
												</Link>
												<div className="h-px bg-[#3A3A3C]/60 my-1"></div>
												<button
													onClick={handleSignOut}
													className="cursor-pointer w-full text-left px-4 py-2.5 hover:bg-white/5 transition-colors rounded-b-xl flex items-center gap-2"
												>
													<FontAwesomeIcon
														icon={faSignOutAlt}
													/>
													Sign Out
												</button>
											</div>
										</div>
									</motion.div>
								)}
							</div>
						) : (
							<div className="flex items-center gap-1">
								<button
									onClick={() => {
										setAuthMode('login');
										setShowAuthModal(true);
									}}
									className="text-white text-[14px] font-medium px-4 py-2 rounded-full cursor-pointer hover:text-[#ACACAD] transition"
								>
									Log in
								</button>
								<button
									onClick={() => {
										setAuthMode('signup');
										setShowAuthModal(true);
									}}
									className="bg-[#27BBFF] text-[14px] text-[#101014] font-medium px-4 py-2 rounded-full cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg hover:bg-[#27BBFF]"
								>
									Sign up
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
			<AuthModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
				mode={authMode}
			/>
		</header>
	);
}
