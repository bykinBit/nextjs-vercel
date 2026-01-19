import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import ReactMarkdown from 'react-markdown'
import PostActions from './PostActions'

interface Props {
    params: Promise<{ id: string }>
}

export default async function PostPage({ params }: Props) {
    const { id } = await params

    const post = await prisma.post.findUnique({
        where: { id },
        include: {
            author: {
                select: { name: true, email: true },
            },
        },
    })

    if (!post) {
        notFound()
    }

    const session = await auth()
    const userHasValidSession = Boolean(session)
    const postBelongsToUser = session?.user?.email === post.author?.email

    return (
        <article className="max-w-2xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {post.title}
                    {!post.published && (
                        <span className="ml-3 px-3 py-1 text-sm font-medium bg-amber-100 text-amber-700 rounded-full">
                            Draft
                        </span>
                    )}
                </h1>
                <p className="text-gray-500">
                    By {post.author?.name || 'Unknown author'}
                </p>
            </header>

            <div className="prose prose-lg max-w-none mb-8 bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                {post.content ? (
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                ) : (
                    <p className="text-gray-400 italic">No content</p>
                )}
            </div>

            {userHasValidSession && postBelongsToUser && (
                <PostActions postId={post.id} isPublished={post.published} />
            )}
        </article>
    )
}

export async function generateMetadata({ params }: Props) {
    const { id } = await params
    const post = await prisma.post.findUnique({
        where: { id },
        select: { title: true, content: true },
    })

    if (!post) {
        return { title: 'Post Not Found' }
    }

    return {
        title: `${post.title} - Blogr`,
        description: post.content?.slice(0, 160) || 'Read this post on Blogr',
    }
}
