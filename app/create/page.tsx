'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreatePage() {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const submitData = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content }),
            })

            if (response.ok) {
                router.push('/drafts')
                router.refresh()
            }
        } catch (error) {
            console.error('Failed to create post:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Post</h1>

            <form onSubmit={submitData} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                    </label>
                    <input
                        id="title"
                        autoFocus
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter your post title..."
                        type="text"
                        value={title}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                    </label>
                    <textarea
                        id="content"
                        cols={50}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your post content here... (Markdown supported)"
                        rows={10}
                        value={content}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button
                        disabled={!content || !title || isSubmitting}
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg font-medium hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Creating...' : 'Create Draft'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/')}
                        className="px-6 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}
