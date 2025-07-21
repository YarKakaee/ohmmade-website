// Level thresholds and their corresponding watts
const LEVEL_THRESHOLDS = [
	{ level: 'Newbie', watts: 0 },
	{ level: 'Maker', watts: 100 },
	{ level: 'Builder', watts: 300 },
	{ level: 'Inventor', watts: 600 },
	{ level: 'Engineer', watts: 1000 },
	{ level: 'Expert', watts: 1500 },
	{ level: 'Master', watts: 2200 },
	{ level: 'Grandmaster', watts: 3000 },
];

// Level emojis for display
const LEVEL_EMOJIS = {
	Newbie: '🔋',
	Maker: '⚡',
	Builder: '🔧',
	Inventor: '💡',
	Engineer: '⚙️',
	Expert: '🎯',
	Master: '🏆',
	Grandmaster: '👑',
};

/**
 * Calculate user's current level and next level requirements
 * @param {number} watts - Current watts
 * @returns {object} - { level, nextLevelWatts, progressPercentage }
 */
export function calculateLevel(watts) {
	let currentLevel = 'Newbie';
	let nextLevelWatts = 100;

	// Find current level
	for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
		if (watts >= LEVEL_THRESHOLDS[i].watts) {
			currentLevel = LEVEL_THRESHOLDS[i].level;
			break;
		}
	}

	// Find next level watts requirement
	for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
		if (LEVEL_THRESHOLDS[i].watts > watts) {
			nextLevelWatts = LEVEL_THRESHOLDS[i].watts;
			break;
		}
	}

	// Calculate progress percentage
	const currentLevelWatts =
		LEVEL_THRESHOLDS.find((l) => l.level === currentLevel)?.watts || 0;
	const progressPercentage =
		nextLevelWatts > currentLevelWatts
			? Math.round(
					((watts - currentLevelWatts) /
						(nextLevelWatts - currentLevelWatts)) *
						100
				)
			: 100;

	return {
		level: currentLevel,
		nextLevelWatts,
		progressPercentage,
		emoji: LEVEL_EMOJIS[currentLevel],
	};
}

/**
 * Award watts to a user and update their level
 * @param {string} userId - User ID
 * @param {number} amount - Watts to award
 * @param {string} reason - Reason for awarding watts
 * @param {object} prisma - Prisma client instance
 * @returns {object} - Updated user data
 */
export async function awardWatts(userId, amount, reason, prisma) {
	try {
		// Get current user data
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				watts: true,
				level: true,
				nextLevelWatts: true,
			},
		});

		if (!user) {
			throw new Error('User not found');
		}

		// Calculate new watts and level
		const newWatts = user.watts + amount;
		const newLevelData = calculateLevel(newWatts);

		// Update user
		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: {
				watts: newWatts,
				level: newLevelData.level,
				nextLevelWatts: newLevelData.nextLevelWatts,
				lastWattsUpdated: new Date(),
				wattsLogs: {
					create: {
						watts: amount,
					},
				},
			},
			select: {
				id: true,
				watts: true,
				level: true,
				nextLevelWatts: true,
			},
		});

		// Log the watts gain
		console.log(`Awarded ${amount} watts to user ${userId} for: ${reason}`);

		return {
			...updatedUser,
			levelData: newLevelData,
			leveledUp: newLevelData.level !== user.level,
		};
	} catch (error) {
		console.error('Error awarding watts:', error);
		throw error;
	}
}

/**
 * Check if user can perform a watts-earning action (cooldown check)
 * @param {string} userId - User ID
 * @param {string} actionType - Type of action
 * @param {object} prisma - Prisma client instance
 * @returns {boolean} - Whether action is allowed
 */
export async function canPerformAction(userId, actionType, prisma) {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { lastWattsUpdated: true },
	});

	if (!user) return false;

	const now = new Date();
	const lastUpdate = new Date(user.lastWattsUpdated);
	const hoursSinceLastUpdate = (now - lastUpdate) / (1000 * 60 * 60);

	// Different cooldowns for different actions
	const cooldowns = {
		profile_visit: 24, // 24 hours
		like_project: 1, // 1 hour
		default: 0, // No cooldown
	};

	const requiredCooldown = cooldowns[actionType] || cooldowns.default;
	return hoursSinceLastUpdate >= requiredCooldown;
}

/**
 * Get level emoji for display
 * @param {string} level - User level
 * @returns {string} - Emoji for the level
 */
export function getLevelEmoji(level) {
	return LEVEL_EMOJIS[level] || '🔋';
}

/**
 * Get level description for tooltips
 * @param {string} level - User level
 * @returns {string} - Description of the level
 */
export function getLevelDescription(level) {
	const descriptions = {
		Newbie: 'Just getting started with electronics',
		Maker: 'Building your first projects',
		Builder: 'Creating more complex circuits',
		Inventor: 'Innovating with unique designs',
		Engineer: 'Mastering advanced concepts',
		Expert: 'Leading the community',
		Master: 'Achieving technical excellence',
		Grandmaster: 'Legendary electronics wizard',
	};
	return descriptions[level] || 'Unknown level';
}
