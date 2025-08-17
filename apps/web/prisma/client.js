import { PrismaClient } from '@prisma/client';

let prisma;
let listenersAdded = false;

function getPrismaClient() {
	if (!prisma) {
		try {
			prisma = new PrismaClient({
				log:
					process.env.NODE_ENV === 'development'
						? ['error', 'warn']
						: ['error'],
			});

			// Only add listeners once to prevent memory leaks
			if (!listenersAdded) {
				// Handle graceful shutdown
				process.on('beforeExit', async () => {
					await prisma.$disconnect();
				});

				process.on('SIGINT', async () => {
					await prisma.$disconnect();
					process.exit(0);
				});

				process.on('SIGTERM', async () => {
					await prisma.$disconnect();
					process.exit(0);
				});

				// Add error handling
				prisma.$on('error', (e) => {
					console.error('Prisma error:', e);
				});

				listenersAdded = true;
			}
		} catch (error) {
			console.error('Failed to initialize PrismaClient:', error);
			throw error;
		}
	}
	return prisma;
}

// Export both the function and a direct instance for convenience
export { getPrismaClient };
export default getPrismaClient;
