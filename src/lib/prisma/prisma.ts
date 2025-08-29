import { PrismaClient } from "@prisma/client";

// Extend the global object to store the Prisma instance
declare global {
  var prisma: PrismaClient | undefined;
}

// Use existing Prisma instance in dev or create a new one
export const prisma =
  global.prisma || new PrismaClient({
    log: ["query", "info", "warn", "error"], // optional: useful for debugging
  });

// Attach Prisma instance to global object in dev mode
if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

export default prisma;
