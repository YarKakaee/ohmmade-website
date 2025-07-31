import getPrismaClient from '@/prisma/client';

export async function generateUsername(name) {
	const prisma = getPrismaClient();
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

export async function isUsernameTaken(username) {
	const prisma = getPrismaClient();
	const existingUser = await prisma.user.findUnique({
		where: { username },
	});
	return !!existingUser;
}

export function isValidUsername(username) {
	// Username must:
	// - Start with a letter
	// - Contain only letters, numbers, and underscores
	// - Be 3-30 characters long
	const regex = /^[a-zA-Z][a-zA-Z0-9_]{2,29}$/;
	return regex.test(username);
}
