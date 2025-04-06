'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
	totalPages = 1,
	currentPage = 1,
	onPageChange = () => {},
	className = '',
}) {
	// Create a smart range (e.g. 1 2 3 4 5 ... 100)
	const getPageNumbers = () => {
		const pages = [];

		if (totalPages <= 7) {
			for (let i = 1; i <= totalPages; i++) pages.push(i);
		} else {
			if (currentPage <= 4) {
				pages.push(1, 2, 3, 4, 5, '...', totalPages);
			} else if (currentPage >= totalPages - 3) {
				pages.push(
					1,
					'...',
					totalPages - 4,
					totalPages - 3,
					totalPages - 2,
					totalPages - 1,
					totalPages
				);
			} else {
				pages.push(
					1,
					'...',
					currentPage - 1,
					currentPage,
					currentPage + 1,
					'...',
					totalPages
				);
			}
		}

		return pages;
	};

	return (
		<div
			className={`flex items-center justify-center gap-2 mt-10 text-white ${className}`}
		>
			{/* Prev */}
			<button
				onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="px-3 py-1.5 text-sm text-white/70 hover:text-white disabled:opacity-40 flex items-center gap-1"
			>
				<ChevronLeft size={16} /> Previous
			</button>

			{/* Numbers */}
			{getPageNumbers().map((num, i) =>
				num === '...' ? (
					<span key={i} className="px-2 py-1 text-white/50">
						...
					</span>
				) : (
					<button
						key={i}
						onClick={() => onPageChange(num)}
						className={`w-8 h-8 text-sm rounded-md ${
							num === currentPage
								? 'bg-[#34343B] text-white'
								: 'text-white/60 hover:bg-[#2A2A2E] hover:text-white'
						}`}
					>
						{num}
					</button>
				)
			)}

			{/* Next */}
			<button
				onClick={() =>
					currentPage < totalPages && onPageChange(currentPage + 1)
				}
				disabled={currentPage === totalPages}
				className="px-3 py-1.5 text-sm text-white/70 hover:text-white disabled:opacity-40 flex items-center gap-1"
			>
				Next <ChevronRight size={16} />
			</button>
		</div>
	);
}
