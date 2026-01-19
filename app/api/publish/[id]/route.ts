import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

interface RouteParams {
    params: Promise<{ id: string }>
}

// PUT /api/publish/[id] - Publish a post
export async function PUT(request: Request, { params }: RouteParams) {
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
        const existingPost = await prisma.post.findUnique({
            where: { id },
            include: { author: true },
        })

        if (!existingPost) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            )
        }

        if (existingPost.author?.email !== session.user.email) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            )
        }

        const post = await prisma.post.update({
            where: { id },
            data: { published: true },
        })

        return NextResponse.json(post)
    } catch (error) {
        console.error('Failed to publish post:', error)
        return NextResponse.json(
            { error: 'Failed to publish post' },
            { status: 500 }
        )
    }
}
