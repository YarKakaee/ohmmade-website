'use client';

import { useState, useEffect } from 'react';

const BANNER_HEIGHT = 48; // Approximate height of the banner

export function useBannerHeight() {
	const [bannerVisible, setBannerVisible] = useState(true);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			setBannerVisible(currentScrollY <= 50);
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return {
		bannerVisible,
		bannerHeight: bannerVisible ? BANNER_HEIGHT : 0,
	};
}
