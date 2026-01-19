import { auth } from "@/auth"

export default auth((req) => {
    // Add any custom middleware logic here
    // For example, protecting routes that require authentication
})

// Optionally, limit middleware to only run on certain paths
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
