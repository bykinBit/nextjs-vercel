import prisma from '@/lib/prisma'
import Post from '@/components/Post'
import Link from 'next/link'

export const revalidate = 10 // ISR: revalidate every 10 seconds

interface PostWithAuthor {
    id: string
    title: string
    content: string | null
    published: boolean
    author: {
        name: string | null
        email: string | null
    } | null
}

async function getFeed(): Promise<{ posts: PostWithAuthor[], error: string | null }> {
    try {
        const posts = await prisma.post.findMany({
            where: { published: true },
            include: {
                author: {
                    select: { name: true, email: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        })
        return { posts, error: null }
    } catch (error) {
        console.error('Database connection error:', error)
        return { posts: [], error: 'Database not connected. Please configure your PostgreSQL database.' }
    }
}

export default async function Home() {
    const { posts: feed, error } = await getFeed()

    return (
        <div>
            <section className="mb-12 text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                    Welcome to Blogr
                </h1>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    A modern blogging platform built with Next.js, Prisma, and PostgreSQL.
                    Share your thoughts with the world.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    Public Feed
                </h2>

                {error ? (
                    <div className="text-center py-12 bg-amber-50 rounded-xl border border-amber-200">
                        <div className="text-6xl mb-4">⚠️</div>
                        <p className="text-amber-700 font-medium mb-2">Database Not Connected</p>
                        <p className="text-amber-600 text-sm max-w-md mx-auto">
                            {error}
                        </p>
                        <div className="mt-6 p-4 bg-white/50 rounded-lg mx-8 text-left">
                            <p className="text-sm text-gray-600 font-medium mb-2">To get started:</p>
                            <ol className="text-sm text-gray-500 list-decimal list-inside space-y-1">
                                <li>Create a PostgreSQL database on Vercel</li>
                                <li>Copy the connection strings to your .env file</li>
                                <li>Run <code className="bg-gray-100 px-1 rounded">npm run db:push</code> to sync schema</li>
                                <li>Create a GitHub OAuth app for authentication</li>
                            </ol>
                        </div>
                    </div>
                ) : feed.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                        <div className="text-6xl mb-4">📝</div>
                        <p className="text-gray-500 mb-4">No posts yet. Be the first to publish!</p>
                        <Link
                            href="/create"
                            className="inline-block px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg font-medium hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                        >
                            Create Your First Post
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {feed.map((post) => (
                            <Post key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
