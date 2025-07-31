import { PrismaClient } from '@prisma/client';

let prisma;

function getPrismaClient() {
	if (!prisma) {
		try {
			prisma = new PrismaClient({
				log: ['error', 'warn'],
			});
		} catch (error) {
			console.error('Failed to initialize PrismaClient:', error);
			throw error;
		}
	}
	return prisma;
}

export default getPrismaClient;
