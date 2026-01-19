import Link from 'next/link'

export interface PostProps {
    id: string
    title: string
    content: string | null
    published: boolean
    author: {
        name: string | null
        email: string | null
    } | null
}

export default function Post({ post }: { post: PostProps }) {
    const authorName = post.author?.name || 'Unknown author'

    return (
        <Link href={`/p/${post.id}`} className="block group">
            <article className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-violet-200 transition-all duration-300">
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-violet-600 transition-colors mb-2">
                    {post.title}
                    {!post.published && (
                        <span className="ml-2 px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                            Draft
                        </span>
                    )}
                </h2>
                <p className="text-sm text-gray-500 mb-3">By {authorName}</p>
                {post.content && (
                    <p className="text-gray-600 line-clamp-3">
                        {post.content}
                    </p>
                )}
            </article>
        </Link>
    )
}
