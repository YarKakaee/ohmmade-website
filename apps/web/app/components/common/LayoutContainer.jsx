import React from 'react';

export default function LayoutContainer({ children, className = '' }) {
	return (
		<div
			className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-0 ${className}`}
		>
			{children}
		</div>
	);
}
