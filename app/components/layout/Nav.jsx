'use client';

import { supabase } from '@/lib/supabaseClient';
import {
	faAngleDown,
	faGlobe,
	faSignOutAlt,
	faUser,
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
		const handleScroll = () => setScrolled(window.scrollY > 10);
		window.addEventListener('scroll', handleScroll);

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
			window.removeEventListener('scroll', handleScroll);
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
		<header
			className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
				scrolled ? 'bg-[#101014]/70 backdrop-blur-lg' : 'bg-transparent'
			}`}
		>
			<div className="mx-auto max-w-[1700px] px-8 sm:px-16 h-18 flex items-center justify-between">
				{/* Logo */}
				<Link href="/" className="flex items-center space-x-2">
					<Image
						src="/assets/newohmlogo.png"
						alt="OhmMade Logo"
						width={28}
						height={28}
						className="object-contain mb-2"
						priority
					/>
					<span className="text-white font-extrabold text-lg">
						OhmMade
					</span>
				</Link>

				{/* Nav */}
				<nav className="flex items-center space-x-6 text-white font-normal text-sm">
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
						<div className="absolute top-full left-[-12px] mt-1 w-48 bg-[#1C1C20]/95 border border-[#3A3A3C]/60 text-white text-sm rounded-xl shadow-xl backdrop-blur-xl opacity-0 invisible translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out">
							{[
								'basic-electronics',
								'arduino-uno',
								'raspberry-pi-4',
								'raspberry-pi-pico-w',
							].map((path, index) => (
								<Link
									key={path}
									href={`/learn/${path}`}
									className={`block px-4 py-2.5 hover:bg-white/5 transition-colors ${
										index === 0 ? 'rounded-t-xl' : ''
									} ${index === 3 ? 'rounded-b-xl' : ''}`}
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
						<div className="absolute top-full left-[-12px] mt-1 w-44 bg-[#1C1C20]/95 border border-[#3A3A3C]/60 text-white text-sm rounded-xl shadow-xl backdrop-blur-xl opacity-0 invisible translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out">
							<Link
								href="/projects"
								className="block px-4 py-2.5 hover:bg-white/5 transition-colors rounded-t-xl"
							>
								Explore Projects
							</Link>
							<Link
								href="/projects/publish"
								className="block px-4 py-2.5 hover:bg-white/5 transition-colors rounded-b-xl"
							>
								Publish Your Own
							</Link>
						</div>
					</div>

					{/* Static links */}
					{['blog', 'forum', 'about', 'contact'].map((page) => (
						<Link
							key={page}
							href={`/${page}`}
							className="hover:text-[#ACACAD] transition"
						>
							{page.charAt(0).toUpperCase() + page.slice(1)}
						</Link>
					))}

					{/* Search */}
					<div className="relative backdrop-blur-md rounded-full">
						<input
							type="text"
							placeholder="Search"
							className="bg-[#1C1C20] text-sm text-white placeholder-white/60 pl-10 pr-5 w-[35ch] py-2 rounded-full border border-[#3A3A3C]/60 focus:ring-1 focus:outline-none focus:ring-white transition"
						/>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="2"
							stroke="currentColor"
							className="w-4 h-4 text-[#ACACAD] absolute left-3 top-2.5"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
							/>
						</svg>
					</div>

					{/* Language */}
					<div className="relative" ref={languageRef}>
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
								<p className="text-center">Coming soon...</p>
							</div>
						)}
					</div>

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
										width={30}
										height={30}
										className="rounded-full object-cover w-[30px] h-[30px] ring-2 ring-[#3A3A3C]/60 overflow-hidden"
									/>
								) : (
									<div className="w-[35px] h-[35px] rounded-full bg-[#1C1C20] border border-[#3A3A3C]/60 flex items-center justify-center text-xs font-semibold">
										{getInitials(
											userProfile?.name || user?.email
										)}
									</div>
								)}
								<span>{userProfile?.name || 'User'}</span>
							</button>

							{showUserDropdown && (
								<motion.div
									initial={{ opacity: 0, y: 8 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 8 }}
									transition={{ duration: 0.2 }}
									className="absolute right-0 top-full mt-4 bg-[#1C1C20]/95 border border-[#3A3A3C]/60 text-white text-sm rounded-xl shadow-xl backdrop-blur-xl w-44"
								>
									<Link
										href="/dashboard"
										onClick={() =>
											setShowUserDropdown(false)
										}
										className="px-4 py-2.5 hover:bg-white/5 transition-colors rounded-t-xl flex items-center gap-2"
									>
										<FontAwesomeIcon icon={faUser} />
										My Account
									</Link>
									<button
										onClick={handleSignOut}
										className="cursor-pointer w-full text-left px-4 py-2.5 hover:bg-white/5 transition-colors rounded-b-xl flex items-center gap-2"
									>
										<FontAwesomeIcon icon={faSignOutAlt} />
										Sign Out
									</button>
								</motion.div>
							)}
						</div>
					) : (
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<button
								onClick={() => setShowAuthModal(true)}
								className="bg-[#27BBFF] text-[#101014] font-medium px-4 py-2 rounded-md cursor-pointer"
							>
								Sign in
							</button>
						</motion.div>
					)}
				</nav>
			</div>
			<AuthModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
			/>
		</header>
	);
}
