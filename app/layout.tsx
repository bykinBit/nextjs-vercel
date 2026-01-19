import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Blogr - A Modern Blogging Platform',
    description: 'Create, share, and discover amazing blog posts with Blogr. Built with Next.js, Prisma, and PostgreSQL.',
    keywords: ['blog', 'blogging', 'next.js', 'react', 'prisma'],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Header />
                <main className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
                    {children}
                </main>
            </body>
        </html>
    )
}
