'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function AdminTable({
	columns,
	data,
	onDelete,
	onEdit,
	onPublish,
	onUnpublish,
	type,
}) {
	const [sortConfig, setSortConfig] = useState({
		key: null,
		direction: 'asc',
	});
	const [searchTerm, setSearchTerm] = useState('');

	const handleSort = (key) => {
		let direction = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });
	};

	const filteredData = data.filter((item) => {
		return Object.values(item).some((value) =>
			value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
		);
	});

	const sortedData = [...filteredData].sort((a, b) => {
		if (!sortConfig.key) return 0;
		if (a[sortConfig.key] < b[sortConfig.key]) {
			return sortConfig.direction === 'asc' ? -1 : 1;
		}
		if (a[sortConfig.key] > b[sortConfig.key]) {
			return sortConfig.direction === 'asc' ? 1 : -1;
		}
		return 0;
	});

	return (
		<div className="bg-[#1C1C20]/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
			<div className="mb-6">
				<input
					type="text"
					placeholder="Search..."
					className="w-full max-w-md px-4 py-2 bg-[#2C2F36]/50 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#27BBFF]/30"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="border-b border-white/10">
							{columns.map((column) => (
								<th
									key={column.key}
									className="px-4 py-3 text-left text-white/70 cursor-pointer hover:text-white transition-colors"
									onClick={() => handleSort(column.key)}
								>
									{column.label}
									{sortConfig.key === column.key && (
										<span className="ml-1">
											{sortConfig.direction === 'asc'
												? '↑'
												: '↓'}
										</span>
									)}
								</th>
							))}
							<th className="px-4 py-3 text-left text-white/70">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-white/10">
						{sortedData.map((item) => (
							<tr
								key={item.id}
								className="hover:bg-white/5 transition-colors"
							>
								{columns.map((column) => (
									<td
										key={column.key}
										className="px-4 py-3 text-white/70"
									>
										{column.key === 'createdAt'
											? formatDistanceToNow(
													new Date(item[column.key]),
													{
														addSuffix: true,
													}
											  )
											: item[column.key]}
									</td>
								))}
								<td className="px-4 py-3">
									<div className="flex items-center space-x-2">
										<button
											onClick={() => onEdit(item)}
											className="p-2 text-white/70 hover:text-white transition-colors"
										>
											Edit
										</button>
										{type === 'blog' && (
											<button
												onClick={() =>
													item.published
														? onUnpublish(item)
														: onPublish(item)
												}
												className={`p-2 ${
													item.published
														? 'text-green-500 hover:text-green-400'
														: 'text-yellow-500 hover:text-yellow-400'
												} transition-colors`}
											>
												{item.published
													? 'Unpublish'
													: 'Publish'}
											</button>
										)}
										<button
											onClick={() => onDelete(item)}
											className="p-2 text-red-500 hover:text-red-400 transition-colors"
										>
											Delete
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
