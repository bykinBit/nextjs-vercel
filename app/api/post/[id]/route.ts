import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

interface RouteParams {
    params: Promise<{ id: string }>
}

// DELETE /api/post/[id] - Delete a post
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const session = await auth()

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { id } = await params

        // Verify the post belongs to the user
        const post = await prisma.post.findUnique({
            where: { id },
            include: { author: true },
        })

        if (!post) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            )
        }

        if (post.author?.email !== session.user.email) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            )
        }

        await prisma.post.delete({
            where: { id },
        })

        return NextResponse.json({ message: 'Post deleted successfully' })
    } catch (error) {
        console.error('Failed to delete post:', error)
        return NextResponse.json(
            { error: 'Failed to delete post' },
            { status: 500 }
        )
    }
}
