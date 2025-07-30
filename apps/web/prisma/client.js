let prisma;

async function getPrismaClient() {
	if (!prisma) {
		const { PrismaClient } = await import('@prisma/client');
		prisma = new PrismaClient();
	}
	return prisma;
}

export default getPrismaClient;
