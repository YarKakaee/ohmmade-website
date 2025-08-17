'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function VersionBanner() {
	const [isVisible, setIsVisible] = useState(true);
	const [scrollY, setScrollY] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			setScrollY(currentScrollY);

			// Hide banner when scrolling down past 50px
			if (currentScrollY > 50) {
				setIsVisible(false);
			} else {
				setIsVisible(true);
			}
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ height: 0, opacity: 0 }}
					animate={{ height: 'auto', opacity: 1 }}
					exit={{ height: 0, opacity: 0 }}
					transition={{ duration: 0.3, ease: 'easeInOut' }}
					className="fixed top-0 left-0 w-full bg-gradient-to-r from-[#27BBFF] to-[#1f3375] text-[#f5f5f5] overflow-hidden z-[60]"
				>
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="py-3 flex items-center justify-center">
							<Link
								href="/changelog"
								className="text-sm sm:text-base font-medium hover:underline transition-all duration-200 text-center"
							>
								🚀 OhmMade v1.1.0 is here — our first official
								update! See what's new →
							</Link>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
