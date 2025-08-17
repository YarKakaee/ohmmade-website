'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';

// Lazy load the actual Blocknote component
const LazyBlocknoteViewer = lazy(() => import('./BlocknoteViewerContent'));

// Loading fallback
function LoadingFallback() {
	return (
		<div className="min-h-[200px] bg-[#1C1C20] rounded-xl border border-[#2C2F36] flex items-center justify-center">
			<div className="text-center">
				<div className="w-8 h-8 border-2 border-[#27BBFF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
				<p className="text-white/60 text-sm">Loading content...</p>
			</div>
		</div>
	);
}

// Main component that handles lazy loading
export default function BlocknoteViewer({ data }) {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient || !data) {
		return (
			<div className="min-h-[200px] bg-[#1C1C20] rounded-xl border border-[#2C2F36] flex items-center justify-center">
				<p className="text-white/60">No content available</p>
			</div>
		);
	}

	return (
		<Suspense fallback={<LoadingFallback />}>
			<LazyBlocknoteViewer data={data} />
		</Suspense>
	);
}
