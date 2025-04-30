import React from 'react';

export function ActivityTableSkeleton() {
	return (
		<div className="animate-pulse">
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr>
							<th className="pb-4 text-gray-400 font-medium">
								Action
							</th>
							<th className="pb-4 text-gray-400 font-medium">
								Project
							</th>
							<th className="pb-4 text-gray-400 font-medium">
								When
							</th>
						</tr>
					</thead>
					<tbody>
						{[...Array(6)].map((_, i) => (
							<tr key={i}>
								<td className="py-4">
									<div className="h-4 bg-gray-200 rounded w-3/4" />
								</td>
								<td className="py-4">
									<div className="h-4 bg-gray-200 rounded w-1/2" />
								</td>
								<td className="py-4">
									<div className="h-4 bg-gray-200 rounded w-1/3" />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
