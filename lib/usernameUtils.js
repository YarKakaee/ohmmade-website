import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Generates a username based on the user's name
 * Rules:
 * - Convert to lowercase
 * - Remove spaces and special characters
 * - Keep alphanumeric and underscores
 * - Ensure uniqueness with a number suffix if needed
 * @param {string} name - User's display name
 * @returns {Promise<string>} Unique username
 */
export async function generateUsername(name) {
	// If no name is provided, use a fallback
	if (!name || name.trim() === '') {
		name = 'user';
	}

	// Convert to lowercase, remove spaces and special chars, keep only alphanumeric and underscores
	let baseUsername = name
		.toLowerCase()
		.replace(/\s+/g, '') // Remove spaces
		.replace(/[^\w]/g, '') // Remove special characters except underscore
		.substring(0, 20); // Limit length to 20 chars max

	// Make sure the username starts with a letter (not a number)
	if (!/^[a-z]/.test(baseUsername)) {
		baseUsername = 'u' + baseUsername;
	}

	// Ensure the username meets min length (3 chars)
	if (baseUsername.length < 3) {
		baseUsername = baseUsername.padEnd(3, '0');
	}

	// Check if the username already exists
	let username = baseUsername;
	let exists = await isUsernameTaken(username);
	let counter = 1;

	// If username exists, add a number suffix until we find a unique one
	while (exists) {
		username = `${baseUsername}${counter}`;
		exists = await isUsernameTaken(username);
		counter++;
	}

	return username;
}

/**
 * Check if a username is already taken
 * @param {string} username - Username to check
 * @returns {Promise<boolean>} Whether the username is taken
 */
export async function isUsernameTaken(username) {
	const existingUser = await prisma.user.findUnique({
		where: { username },
	});
	return !!existingUser;
}

/**
 * Validates if a username meets the required format
 * @param {string} username - The username to validate
 * @returns {boolean} - True if the username is valid
 */
export function isValidUsername(username) {
	// Username must:
	// - Start with a letter
	// - Contain only letters, numbers, and underscores
	// - Be 3-30 characters long
	const regex = /^[a-zA-Z][a-zA-Z0-9_]{2,29}$/;
	return regex.test(username);
}
