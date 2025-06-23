'use client';

import { getLevelEmoji, getLevelDescription } from '@/lib/watts';

const rankGradients = {
	Newbie: 'from-gray-500/20 to-gray-600/20 border-gray-500/30',
	Maker: 'from-green-500/20 to-emerald-600/20 border-green-500/30',
	Builder: 'from-blue-500/20 to-cyan-600/20 border-blue-500/30',
	Inventor: 'from-purple-500/20 to-indigo-600/20 border-purple-500/30',
	Engineer: 'from-orange-500/20 to-red-600/20 border-orange-500/30',
	Expert: 'from-pink-500/20 to-rose-600/20 border-pink-500/30',
	Master: 'from-yellow-500/20 to-orange-600/20 border-yellow-500/30',
	Grandmaster:
		'from-[#FFD700]/20 via-[#FFA500]/20 to-[#FF6B35]/20 border-[#FFD700]/40',
};

export default function UserRank({ user }) {
	if (!user || !user.level) return null;

	const gradient = rankGradients[user.level] || rankGradients['Newbie'];
	const emoji = getLevelEmoji(user.level);

	return (
		<div
			className={`bg-gradient-to-r ${gradient} backdrop-blur-sm rounded-lg px-4 py-2 text-sm  border flex items-center gap-2`}
			title={getLevelDescription(user.level)}
		>
			<span className="text-sm">{emoji}</span>
			<span className="text-white font-semibold text-sm whitespace-nowrap">
				{user.level}
			</span>
		</div>
	);
}
