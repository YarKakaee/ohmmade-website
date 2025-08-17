'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { Inter_Tight } from 'next/font/google';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import {
	faChevronLeft,
	faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LayoutContainer from '@ohmmade/ui/layout-container';
import { useRouter } from 'next/navigation';
import { useSessionContext } from '@supabase/auth-helpers-react';

const interTight = Inter_Tight({
	subsets: ['latin'],
});

const cardVariants = {
	hidden: { opacity: 0, y: 30, scale: 0.95 },
	show: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { duration: 0.38, ease: 'easeOut' },
	},
};

const containerVariants = {
	hidden: {},
	show: {
		transition: {
			staggerChildren: 0.35,
		},
	},
};

const CARD_HEIGHT = 500;
const MOBILE_CARD_HEIGHT = 400;
const MAX_W_7XL = 1280; // px for Tailwind's max-w-7xl
const CARD_GAP = 32;
const MOBILE_CARD_GAP = 16;

// CSS for hover zone functionality
const hoverStyles = `
	/* Primary hover zone triggers */
	.hover-zone-left:hover ~ button[aria-label="Scroll left"].can-scroll-left {
		opacity: 1 !important;
	}
	.hover-zone-right:hover ~ button[aria-label="Scroll right"].can-scroll-right {
		opacity: 1 !important;
	}
	
	/* Button self-hover */
	button[aria-label="Scroll left"].can-scroll-left:hover {
		opacity: 1 !important;
	}
	button[aria-label="Scroll right"].can-scroll-right:hover {
		opacity: 1 !important;
	}
	
	/* Force hover zones to work over everything */
	.features-scroll-container .hover-zone-left:hover ~ button[aria-label="Scroll left"].can-scroll-left {
		opacity: 1 !important;
	}
	.features-scroll-container .hover-zone-right:hover ~ button[aria-label="Scroll right"].can-scroll-right {
		opacity: 1 !important;
	}
	
	/* Prevent card hover interference */
	.hover-zone-left:hover,
	.hover-zone-right:hover {
		z-index: 106 !important;
	}
`;

export default function Features() {
	const router = useRouter();
	const { session } = useSessionContext();

	const features = [
		{
			image: '/assets/publish-container.png',
			heading: 'Publish & Showcase Projects',
			description:
				'Turn one-time builds into polished, shareable tutorials that inspire.',
			aspect: 4 / 5,
			href: '/projects/publish',
		},
		{
			image: '/assets/profile-container.png',
			heading: 'Personal Profiles & Creative Identity',
			description:
				'Showcase your projects, share your story, and connect with other makers. Build a profile that highlights your skills and inspires your audience — all in one place.',
			aspect: 16 / 9,
			href: session?.user?.user_metadata?.username
				? `/u/${session.user.user_metadata.username}`
				: '/u/ohmmade',
		},
		{
			image: '/assets/project-container.png',
			heading: 'Learn & Build Faster',
			description:
				"Access real-world projects and improve by seeing exactly what worked — and what didn't.",
			aspect: 4 / 3,
			href: '/projects',
		},
	];

	const handleCardClick = (href) => {
		router.push(href);
	};

	const scrollRef = useRef(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);
	const [sideMargin, setSideMargin] = useState(0);
	const [maxScroll, setMaxScroll] = useState(0);
	const [isMobile, setIsMobile] = useState(false);

	// Check if mobile on mount and resize
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	// Calculate side margin for virtual max-w-7xl
	useEffect(() => {
		const calcMargin = () => {
			const w = document.documentElement.clientWidth;
			setSideMargin(w > MAX_W_7XL ? (w - MAX_W_7XL) / 2 : 0);
		};
		calcMargin();
		window.addEventListener('resize', calcMargin);
		return () => window.removeEventListener('resize', calcMargin);
	}, []);

	// Calculate max scroll so last card stops at virtual max-w-7xl right margin
	useEffect(() => {
		const container = scrollRef.current;
		if (!container) return;
		// Calculate total width of all cards (including gaps)
		const cardEls = container.querySelectorAll('.feature-card');
		let totalCardsWidth = 0;
		const gap = isMobile ? MOBILE_CARD_GAP : CARD_GAP;

		cardEls.forEach((el, i) => {
			totalCardsWidth += el.offsetWidth;
			if (i < cardEls.length - 1) totalCardsWidth += gap;
		});
		// The visible area is document.documentElement.clientWidth (accounts for scrollbar)
		// The max scroll is when the last card's left edge is at the right virtual margin
		const maxScrollValue = Math.max(
			0,
			totalCardsWidth +
				sideMargin * 2 -
				document.documentElement.clientWidth
		);
		setMaxScroll(maxScrollValue);
	}, [sideMargin, features.length, isMobile]);

	// Helper to update scroll button state
	const updateScrollButtons = () => {
		const container = scrollRef.current;
		if (!container) return;
		const scrollLeft = container.scrollLeft;
		setCanScrollLeft(scrollLeft > 0);
		setCanScrollRight(scrollLeft < maxScroll - 1);
	};

	// Scroll by one card width (plus margin)
	const scrollByCard = (direction) => {
		const container = scrollRef.current;
		if (!container) return;
		const card = container.querySelector('.feature-card');
		if (!card) return;
		const gap = isMobile ? MOBILE_CARD_GAP : CARD_GAP;
		const cardWidth = card.offsetWidth + gap;
		const currentScroll = container.scrollLeft;
		let newScroll = currentScroll + direction * cardWidth;
		// Clamp so first card can go under left mask, last card can go under right mask but not past virtual margin
		newScroll = Math.max(0, Math.min(newScroll, maxScroll));
		container.scrollTo({ left: newScroll, behavior: 'smooth' });
		setTimeout(updateScrollButtons, 350);
	};

	useEffect(() => {
		const container = scrollRef.current;
		if (!container) return;
		updateScrollButtons();
		container.addEventListener('scroll', updateScrollButtons);
		const handleResize = () => setTimeout(updateScrollButtons, 100);
		window.addEventListener('resize', handleResize);
		return () => {
			container.removeEventListener('scroll', updateScrollButtons);
			window.removeEventListener('resize', handleResize);
		};
	}, [maxScroll]);

	return (
		<section className="relative py-12 sm:py-16 md:py-24">
			<style dangerouslySetInnerHTML={{ __html: hoverStyles }} />
			{/* Dynamic gradient masks - appear when scrolling is possible */}
			<>
				{/* Left gradient mask - show when can scroll left */}
				{canScrollLeft && (
					<div
						className="pointer-events-none absolute top-0 left-0 h-full z-30 hidden md:block"
						style={{
							width: sideMargin > 0 ? sideMargin : '120px',
							height: '100%',
							background:
								'linear-gradient(to right, #101014 20%, rgba(16,16,20,0.7) 60%, rgba(16,16,20,0.0) 100%)',
						}}
					/>
				)}
				{/* Right gradient mask - show when can scroll right */}
				{canScrollRight && (
					<div
						className="pointer-events-none absolute top-0 right-0 h-full z-30 hidden md:block"
						style={{
							width: sideMargin > 0 ? sideMargin : '120px',
							height: '100%',
							background:
								'linear-gradient(to left, #101014 20%, rgba(16,16,20,0.7) 60%, rgba(16,16,20,0.0) 100%)',
						}}
					/>
				)}
			</>
			<div className="w-full relative">
				{/* Title Section */}
				<LayoutContainer>
					<motion.div
						className="mb-6 sm:mb-8 md:mb-10 px-2 sm:px-0"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
					>
						<motion.h2
							className={`${interTight.className} text-2xl sm:text-3xl md:text-[38px] font-extrabold text-white mb-3 sm:mb-4`}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							viewport={{ once: true }}
						>
							Our Core Features
						</motion.h2>
						<motion.p
							className="text-gray-400 max-w-2xl text-[14px] sm:text-[15px] leading-relaxed"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
							viewport={{ once: true }}
						>
							Every detail is intentional — from how you share
							your work to how others learn from it. These aren't
							just platform features. They're pillars of how we
							empower makers.
						</motion.p>
					</motion.div>
				</LayoutContainer>
				{/* Features Row with Scroll Buttons and Cards */}
				<div
					className="relative w-full features-scroll-container"
					style={{
						height: `${isMobile ? MOBILE_CARD_HEIGHT + 60 : CARD_HEIGHT + 80}px`,
						paddingTop: '20px',
						paddingBottom: '40px',
					}}
				>
					{/* Left Hover Zone - only active when scrolling is possible */}
					{canScrollLeft && (
						<div className="absolute left-0 top-0 w-40 lg:w-80 h-full z-[105] pointer-events-auto hover-zone-left hidden md:block"></div>
					)}

					{/* Right Hover Zone - only active when scrolling is possible */}
					{canScrollRight && (
						<div className="absolute right-0 top-0 w-40 lg:w-80 h-full z-[105] pointer-events-auto hover-zone-right hidden md:block"></div>
					)}

					{/* Left Scroll Button (hover only) */}
					<motion.button
						aria-label="Scroll left"
						className={`hidden md:flex items-center justify-center absolute left-8 top-1/2 -translate-y-1/2 z-[120] w-12 h-12 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full border border-white/10 transition-opacity duration-300 cursor-pointer
							${canScrollLeft ? 'opacity-0 can-scroll-left' : 'opacity-0 pointer-events-none'}
						`}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						transition={{
							type: 'spring',
							stiffness: 400,
							damping: 17,
						}}
						style={{ outline: 'none' }}
						onClick={() => scrollByCard(-1)}
					>
						<FontAwesomeIcon
							icon={faChevronLeft}
							className="text-white text-lg"
						/>
					</motion.button>
					{/* Right Scroll Button (hover only) */}
					<motion.button
						aria-label="Scroll right"
						className={`hidden md:flex items-center justify-center absolute right-8 top-1/2 -translate-y-1/2 z-[120] w-12 h-12 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full border border-white/10 transition-opacity duration-300 cursor-pointer
							${
								canScrollRight
									? 'opacity-0 can-scroll-right'
									: 'opacity-0 pointer-events-none'
							}
						`}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						transition={{
							type: 'spring',
							stiffness: 400,
							damping: 17,
						}}
						style={{ outline: 'none' }}
						onClick={() => scrollByCard(1)}
					>
						<FontAwesomeIcon
							icon={faChevronRight}
							className="text-white text-lg"
						/>
					</motion.button>
					{/* Cards container, dynamic left/right padding for virtual max-w-7xl */}
					<motion.div
						ref={scrollRef}
						className="flex overflow-x-auto overflow-y-visible scrollbar-hide w-full px-4 sm:px-0"
						style={{
							height: '740px',
							paddingLeft: !isMobile ? sideMargin : 24,
							paddingRight: !isMobile ? sideMargin : 24,
							paddingTop: '20px',
							paddingBottom: '40px',
							gap: isMobile ? MOBILE_CARD_GAP : CARD_GAP,
							scrollbarWidth: 'none',
							msOverflowStyle: 'none',
						}}
						variants={containerVariants}
						initial="hidden"
						whileInView="show"
						viewport={{ once: true }}
					>
						{features.map((feature, i) => (
							<motion.div
								key={i}
								variants={cardVariants}
								whileHover={{
									scale: 1.02,
									y: -8,
									transition: {
										duration: 0.2,
										ease: 'easeOut',
									},
								}}
								whileTap={{ scale: 0.98 }}
								onClick={() => handleCardClick(feature.href)}
								className="feature-card relative z-20 rounded-2xl border border-[#2C2F36] hover:border-[#27BBFF]/50 shadow-2xl hover:shadow-[#27BBFF]/20 overflow-hidden flex-shrink-0 flex flex-col justify-end cursor-pointer group transition-all duration-200"
								style={{
									height: `${isMobile ? MOBILE_CARD_HEIGHT : CARD_HEIGHT}px`,
									width: `${(isMobile ? MOBILE_CARD_HEIGHT : CARD_HEIGHT) * feature.aspect}px`,
									minWidth: `${
										(isMobile
											? MOBILE_CARD_HEIGHT
											: CARD_HEIGHT) * feature.aspect
									}px`,
								}}
							>
								{/* Hover glow effect */}
								<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-t from-[#27BBFF]/10 via-transparent to-transparent rounded-2xl" />

								{/* Background Image */}
								<div className="absolute inset-0 w-full h-full">
									<Image
										src={feature.image}
										alt={feature.heading}
										fill
										className="object-cover object-left-top w-full h-full group-hover:scale-105 transition-transform duration-300"
										draggable={false}
									/>
								</div>

								{/* Gradient overlay for better text readability */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-200" />

								{/* Content */}
								<div
									className="relative z-10 p-4 sm:p-6 md:px-8 md:py-8 flex flex-col items-start justify-end"
									style={{
										textShadow:
											'0 2px 8px rgba(0,0,0,0.45)',
									}}
								>
									<h3 className="text-base sm:text-xl md:text-base text-white mb-2 font-semibold leading-tight group-hover:text-[#27BBFF] transition-colors duration-200">
										{feature.heading}
									</h3>
									<p className="text-sm sm:text-base md:text-sm text-white/80 font-light leading-relaxed group-hover:text-white/90 transition-colors duration-200">
										{feature.description}
									</p>

									{/* Click indicator */}
									<div className="mt-3 flex items-center text-xs text-white/60 group-hover:text-[#27BBFF] transition-colors duration-200 opacity-0 group-hover:opacity-100">
										<span>Click to explore</span>
										<svg
											className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 5l7 7-7 7"
											/>
										</svg>
									</div>
								</div>
							</motion.div>
						))}
					</motion.div>
				</div>
			</div>
			<style jsx>{`
				.scrollbar-hide::-webkit-scrollbar {
					display: none;
				}
			`}</style>
		</section>
	);
}
