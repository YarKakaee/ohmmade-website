'use client';

import { usePathname } from 'next/navigation';
import VersionBanner from './VersionBanner';

export default function ConditionalVersionBanner() {
	const pathname = usePathname();

	// Only show on homepage
	if (pathname !== '/') {
		return null;
	}

	return <VersionBanner />;
}
