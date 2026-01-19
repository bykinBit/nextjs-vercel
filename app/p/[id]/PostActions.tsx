'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface PostActionsProps {
    postId: string
    isPublished: boolean
}

export default function PostActions({ postId, isPublished }: PostActionsProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const publishPost = async () => {
        setIsLoading(true)
        try {
            await fetch(`/api/publish/${postId}`, {
                method: 'PUT',
            })
            router.push('/')
            router.refresh()
        } catch (error) {
            console.error('Failed to publish post:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const deletePost = async () => {
        if (!confirm('Are you sure you want to delete this post?')) return

        setIsLoading(true)
        try {
            await fetch(`/api/post/${postId}`, {
                method: 'DELETE',
            })
            router.push('/')
            router.refresh()
        } catch (error) {
            console.error('Failed to delete post:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-4">
            {!isPublished && (
                <button
                    onClick={publishPost}
                    disabled={isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                    {isLoading ? 'Publishing...' : 'Publish'}
                </button>
            )}
            <button
                onClick={deletePost}
                disabled={isLoading}
                className="px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
                {isLoading ? 'Deleting...' : 'Delete'}
            </button>
        </div>
    )
}
