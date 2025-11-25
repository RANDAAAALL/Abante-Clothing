// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
 
  transactionOptions: {
    maxWait: 5000,
    timeout: 10000,
  }
});

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

export default prisma;