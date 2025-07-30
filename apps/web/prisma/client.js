import { PrismaClient } from '@prisma/client';

let prisma;

if (process.env.NODE_ENV === 'production') {
	prisma = new PrismaClient();
} else {
	if (!globalThis.prismaGlobal) {
		globalThis.prismaGlobal = new PrismaClient();
	}
	prisma = globalThis.prismaGlobal;
}

export default prisma;
