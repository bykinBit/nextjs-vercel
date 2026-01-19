import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

// POST /api/post - Create a new post
export async function POST(request: Request) {
    try {
        const session = await auth()

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { title, content } = await request.json()

        if (!title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            )
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                author: { connect: { email: session.user.email } },
            },
        })

        return NextResponse.json(post, { status: 201 })
    } catch (error) {
        console.error('Failed to create post:', error)
        return NextResponse.json(
            { error: 'Failed to create post' },
            { status: 500 }
        )
    }
}
