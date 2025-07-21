'use client';

import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Inter_Tight } from 'next/font/google';
import LayoutContainer from '@ohmmade/ui/layout-container';
import AnimatedPlaceholder from './AnimatedPlaceholder';
import { useSession } from '@supabase/auth-helpers-react';
import { useCustomSession } from '@ohmmade/providers';

const interTight = Inter_Tight({
	subsets: ['latin'],
});

// Animation Variants
const containerVariants = {
	hidden: { opacity: 0, y: 50 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.8, staggerChildren: 0.2 },
	},
};

const fadeInUp = {
	hidden: { opacity: 0, y: 40 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const searchBarVariants = {
	hidden: { opacity: 0, y: 20, scale: 0.95 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			duration: 0.7,
			delay: 0.3,
			type: 'spring',
			stiffness: 100,
		},
	},
};

const linksVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, delay: 0.5 },
	},
};

export default function HeroSection({
	searchQuery,
	setSearchQuery,
	searchResults,
	setSearchResults,
	isSearchSubmitted,
	setIsSearchSubmitted,
}) {
	const [particles, setParticles] = useState([]);
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const session = useSession();
	const { isLoading } = useCustomSession();
	const [userProfile, setUserProfile] = useState(null);
	const [isLoadingProfile, setIsLoadingProfile] = useState(false);

	// Fetch user profile from database
	useEffect(() => {
		console.log('Session data:', session);
		console.log('Session user:', session?.user);
		console.log('Session user.email:', session?.user?.email);

		if (!session?.user?.email) {
			console.log('No email found, returning early');
			return;
		}

		console.log('Fetching profile for email:', session.user.email);
		setIsLoadingProfile(true);
		fetch(`/api/user/profile?email=${session.user.email}`)
			.then((res) => res.json())
			.then((data) => {
				console.log('User profile data:', data);
				setUserProfile(data);
			})
			.catch((error) =>
				console.error('Error fetching user profile:', error)
			)
			.finally(() => {
				setIsLoadingProfile(false);
			});
	}, [session]);

	useEffect(() => {
		const createParticle = () => {
			const size = Math.random() * 3 + 1;
			const x = Math.random() * window.innerWidth;
			const y = Math.random() * window.innerHeight;
			const angle = Math.random() * 2 * Math.PI;
			const baseSpeed = Math.random() * 0.7 + 0.2;
			const speedX = Math.cos(angle) * baseSpeed;
			const speedY = Math.sin(angle) * baseSpeed;
			const opacity = Math.random() * 0.5 + 0.1;
			const driftPhase = Math.random() * 2 * Math.PI;
			return { x, y, size, speedX, speedY, opacity, driftPhase };
		};

		const initialParticles = Array.from({ length: 10 }, createParticle);
		setParticles(initialParticles);

		const animateParticles = () => {
			setParticles((prevParticles) =>
				prevParticles.map((particle, i) => {
					const drift =
						Math.sin(Date.now() / 1200 + particle.driftPhase) * 0.5;
					let newX = particle.x + particle.speedX + drift;
					let newY = particle.y + particle.speedY + drift;
					if (newX < 0) newX = window.innerWidth;
					if (newX > window.innerWidth) newX = 0;
					if (newY < 0) newY = window.innerHeight;
					if (newY > window.innerHeight) newY = 0;
					return { ...particle, x: newX, y: newY };
				})
			);
		};

		const interval = setInterval(animateParticles, 50);
		return () => clearInterval(interval);
	}, []);

	const handleSearch = async (e) => {
		e.preventDefault();
		if (!searchQuery.trim()) return;

		setIsSearching(true);
		setIsSearchSubmitted(true);

		// Mock search results for now - replace with actual API call
		const mockResults = [
			{
				id: 1,
				title: 'How do I use this',
				body: 'Question: How do i use this',
				status: 'answered',
			},
			{
				id: 2,
				title: 'How do you calculate GPA in C++?',
				body: "Question: Body I made a program to calculate your mark awhile back and now I'm adding the gpa part but I do...",
				status: 'answered',
			},
			{
				id: 3,
				title: 'How do I convert LocalDate to String?',
				body: "Question: I need to convert a LocalDate object to a String in Java. What's the best way to do this?",
				status: 'open',
			},
			{
				id: 4,
				title: 'Raspberry Pi GPIO setup help',
				body: "Question: I'm trying to set up GPIO pins on my Raspberry Pi but getting errors. Can someone help?",
				status: 'answered',
			},
			{
				id: 5,
				title: 'Arduino LED blinking tutorial',
				body: 'Question: Looking for a good tutorial on how to make an LED blink with Arduino. Any recommendations?',
				status: 'answered',
			},
		].filter(
			(result) =>
				result.title
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				result.body.toLowerCase().includes(searchQuery.toLowerCase())
		);

		setTimeout(() => {
			setSearchResults(mockResults);
			setIsSearching(false);

			// Scroll to results section
			const resultsSection = document.getElementById('search-results');
			if (resultsSection) {
				resultsSection.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				});
			}
		}, 500);
	};

	return (
		<section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#101014]">
			{/* Star/Particle Background */}
			{particles.map((particle, index) => (
				<div
					key={index}
					className="absolute rounded-full bg-white pointer-events-none z-0"
					style={{
						left: `${particle.x}px`,
						top: `${particle.y}px`,
						width: `${particle.size}px`,
						height: `${particle.size}px`,
						opacity: particle.opacity,
						transform: 'translate(-50%, -50%)',
					}}
				/>
			))}

			{/* Content */}
			<LayoutContainer>
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="visible"
					className="flex flex-col items-center justify-center w-full relative z-10 text-center"
				>
					<div className="text-white space-y-8 max-w-4xl w-full flex flex-col items-center">
						{/* Main Heading */}
						<motion.h1
							variants={fadeInUp}
							className={`text-3xl sm:text-[42px] font-[900] leading-tight text-white ${interTight.className} mb-12`}
						>
							{isLoading || isLoadingProfile ? (
								<>
									Hello{' '}
									<span className="bg-gradient-to-r from-[#84dd93] to-[#35AC47] bg-clip-text text-transparent">
										...
									</span>
									, what can we help with?
								</>
							) : session?.user ? (
								<>
									Hello{' '}
									<span className="bg-gradient-to-r from-[#84dd93] to-[#35AC47] bg-clip-text text-transparent">
										@
										{userProfile?.username ||
											session.user.user_metadata
												?.username ||
											session.user.email?.split('@')[0] ||
											'User'}
									</span>
									, what can we help with?
								</>
							) : (
								<>
									Hello, what can we{' '}
									<span className="bg-gradient-to-r from-[#84dd93] to-[#35AC47] bg-clip-text text-transparent">
										help
									</span>{' '}
									with?
								</>
							)}
						</motion.h1>

						{/* Search Bar */}
						<motion.div
							variants={searchBarVariants}
							className="relative max-w-xl mx-auto w-full"
						>
							<form onSubmit={handleSearch}>
								<input
									type="text"
									value={searchQuery}
									onChange={(e) =>
										setSearchQuery(e.target.value)
									}
									onFocus={() => setIsSearchFocused(true)}
									onBlur={() => setIsSearchFocused(false)}
									className="w-full px-5 py-4 rounded-xl bg-white/10 backdrop-blur-md text-white placeholder:text-white/60 border border-white/20 shadow-[0_8px_32px_0_rgba(53,172,71,0.15)] focus:outline-none focus:ring-2 focus:ring-[#35AC47]/50 focus:border-[#35AC47]/50 transition-all duration-300 text-base"
								/>
								{!isSearchFocused && !searchQuery && (
									<div className="absolute left-5 top-1/2 transform -translate-y-1/2 pointer-events-none">
										<AnimatedPlaceholder />
									</div>
								)}
								<button
									type="submit"
									disabled={isSearching}
									className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200 disabled:opacity-50"
								>
									{isSearching ? (
										<div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#35AC47]"></div>
									) : (
										<Search className="w-5 h-5" />
									)}
								</button>
							</form>
						</motion.div>

						{/* Popular Links */}
						<motion.div
							variants={linksVariants}
							className="text-white/80 text-sm"
						>
							<span className="text-white/60 font-medium">
								Popular Links:{' '}
							</span>
							<div className="flex flex-wrap justify-center gap-4 mt-2">
								{[
									'Profile Setup & Guidelines',
									'Project Publishing Rules',
									'Watts & Leveling System',
								].map((link, i) => (
									<motion.a
										key={i}
										href="#"
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											duration: 0.4,
											delay: 0.6 + i * 0.1,
										}}
										whileHover={{
											color: '#35AC47',
											scale: 1.05,
											transition: { duration: 0.2 },
										}}
										className="hover:underline transition-all duration-200 font-medium"
									>
										{link}
									</motion.a>
								))}
							</div>
						</motion.div>
					</div>
				</motion.div>
			</LayoutContainer>
		</section>
	);
}
