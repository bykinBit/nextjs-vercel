import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// During build on Vercel, if the Postgres integration isn't set up yet,
// Prisma will throw an error if the connection string is missing.
// We provide a dummy fallback to let the build finish, then our UI
// handles the connection error gracefully.
const prismaClientOptions = process.env.POSTGRES_PRISMA_URL
    ? {}
    : {
        datasources: {
            db: {
                url: "postgresql://placeholder:placeholder@localhost:5432/placeholder"
            }
        }
    }

export const prisma = globalForPrisma.prisma ?? new PrismaClient(prismaClientOptions)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
