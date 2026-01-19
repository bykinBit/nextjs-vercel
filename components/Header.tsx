import Link from 'next/link'
import { auth, signIn, signOut } from '@/auth'

export default async function Header() {
    const session = await auth()

    return (
        <nav className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
            <div className="flex items-center gap-6">
                <Link
                    href="/"
                    className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent hover:from-violet-700 hover:to-indigo-700 transition-all"
                >
                    Blogr
                </Link>
                <Link
                    href="/"
                    className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                    Feed
                </Link>
                {session && (
                    <Link
                        href="/drafts"
                        className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                    >
                        My Drafts
                    </Link>
                )}
            </div>

            <div className="flex items-center gap-4">
                {session ? (
                    <>
                        <span className="text-sm text-gray-500">
                            {session.user?.name || session.user?.email}
                        </span>
                        <Link
                            href="/create"
                            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg font-medium hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                        >
                            New Post
                        </Link>
                        <form
                            action={async () => {
                                'use server'
                                await signOut()
                            }}
                        >
                            <button
                                type="submit"
                                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                            >
                                Sign Out
                            </button>
                        </form>
                    </>
                ) : (
                    <form
                        action={async () => {
                            'use server'
                            await signIn('github')
                        }}
                    >
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg"
                        >
                            Sign In with GitHub
                        </button>
                    </form>
                )}
            </div>
        </nav>
    )
}
