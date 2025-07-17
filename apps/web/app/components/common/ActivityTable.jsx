import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export function ActivityTable({ activities }) {
	return (
		<div className="overflow-x-auto">
			<table className="w-full">
				<thead>
					<tr>
						<th className="pb-4 text-gray-600 font-medium">
							Action
						</th>
						<th className="pb-4 text-gray-600 font-medium">
							Project
						</th>
						<th className="pb-4 text-gray-600 font-medium">When</th>
					</tr>
				</thead>
				<tbody className="text-gray-900">
					{activities && activities.length > 0 ? (
						activities.map((activity) => (
							<tr
								key={activity.id}
								className="border-b last:border-b-0"
							>
								<td className="py-4">
									{/* You can customize this message as needed */}
									{activity.action || 'Viewed'}
								</td>
								<td className="py-4">
									{activity.project ? (
										<Link
											href={`/projects/${activity.project.slug}`}
											className="text-blue-500 hover:underline"
										>
											{activity.project.title}
										</Link>
									) : (
										<span className="text-gray-400">—</span>
									)}
								</td>
								<td className="py-4 text-gray-500">
									{activity.createdAt
										? formatDistanceToNow(
												new Date(activity.createdAt),
												{ addSuffix: true }
										  )
										: '—'}
								</td>
							</tr>
						))
					) : (
						<tr>
							<td
								colSpan={3}
								className="py-8 text-center text-gray-400"
							>
								No activity yet.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
