import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import Post from '@/components/Post'

export default async function DraftsPage() {
    const session = await auth()

    if (!session) {
        redirect('/api/auth/signin')
    }

    const drafts = await prisma.post.findMany({
        where: {
            author: { email: session.user?.email },
            published: false,
        },
        include: {
            author: {
                select: { name: true, email: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    })

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">My Drafts</h1>

            {drafts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-gray-500">You don&apos;t have any drafts yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {drafts.map((post) => (
                        <Post key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    )
}
