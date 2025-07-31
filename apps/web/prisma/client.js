let prisma;

async function getPrismaClient() {
	if (!prisma) {
		try {
			const { PrismaClient } = await import('@prisma/client');
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
