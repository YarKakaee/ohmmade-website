'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
	getLevelEmoji,
	getLevelDescription,
	calculateLevel,
} from '@/lib/watts';

export default function WattsDisplay({ user, isOwnProfile }) {
	const [showTooltip, setShowTooltip] = useState(false);

	if (!isOwnProfile) return null;

	const levelData = calculateLevel(user.watts);
	const progressPercentage = levelData.progressPercentage;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: 0.3 }}
			className="bg-[#13151A]/50 backdrop-blur-sm border border-[#3A3A3C]/60 rounded-2xl p-6 mb-8"
		>
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-3">
					<div className="text-2xl">{levelData.emoji}</div>
					<div>
						<h3 className="text-lg font-bold text-white">
							{user.level}
						</h3>
						<p className="text-sm text-white/60">
							{getLevelDescription(user.level)}
						</p>
					</div>
				</div>

				<div
					className="relative"
					onMouseEnter={() => setShowTooltip(true)}
					onMouseLeave={() => setShowTooltip(false)}
				>
					<div className="text-right">
						<div className="text-2xl font-bold text-[#27BBFF]">
							{user.watts.toLocaleString()}
						</div>
						<div className="text-sm text-white/60">Watts</div>
					</div>

					{/* Tooltip */}
					{showTooltip && (
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							className="absolute right-0 top-full mt-2 w-64 bg-[#1C1C20] border border-[#3A3A3C]/60 rounded-lg p-3 text-sm text-white/80 z-10"
						>
							<div className="font-semibold text-white mb-2">
								How to earn Watts:
							</div>
							<ul className="space-y-1 text-xs">
								<li>• +100: Publish a project</li>
								<li>• +2: Like a project (1h cooldown)</li>
								<li>• +5: Your project receives a like</li>
								<li>• +20: Gain a follower</li>
								<li>
									• +1: Someone visits your profile (24h
									cooldown)
								</li>
								<li>• +50: Complete your profile</li>
							</ul>
						</motion.div>
					)}
				</div>
			</div>

			{/* Progress Bar */}
			<div className="space-y-2">
				<div className="flex justify-between text-sm">
					<span className="text-white/60">
						Progress to next level
					</span>
					<span className="text-white/60">{progressPercentage}%</span>
				</div>

				<div className="relative h-3 bg-[#1C1C20] rounded-full overflow-hidden">
					{/* Animated progress bar */}
					<motion.div
						initial={{ width: 0 }}
						animate={{ width: `${progressPercentage}%` }}
						transition={{ duration: 1, delay: 0.5 }}
						className="h-full bg-gradient-to-r from-[#27BBFF] to-[#1E40AF] rounded-full relative"
					>
						{/* Power source animation */}
						<motion.div
							animate={{
								boxShadow: [
									'0 0 5px #27BBFF',
									'0 0 20px #27BBFF',
									'0 0 5px #27BBFF',
								],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								ease: 'easeInOut',
							}}
							className="absolute inset-0 rounded-full"
						/>
					</motion.div>
				</div>

				{user.level !== 'Grandmaster' && (
					<div className="text-xs text-white/40 text-center">
						{user.watts} / {user.nextLevelWatts} Watts to next level
					</div>
				)}
			</div>

			{/* Level up notification */}
			{user.level === 'Grandmaster' && (
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="mt-4 p-3 bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/20 border border-[#FFD700]/30 rounded-lg text-center"
				>
					<div className="text-lg">👑</div>
					<div className="text-sm font-semibold text-white">
						Legendary Status Achieved!
					</div>
					<div className="text-xs text-white/60">
						You've reached the highest level
					</div>
				</motion.div>
			)}
		</motion.div>
	);
}
