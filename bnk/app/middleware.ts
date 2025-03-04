import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  // Protect these routes
  const protectedRoutes = ['/home', '/dashboard']

  if (protectedRoutes.includes(req.nextUrl.pathname) && !token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

// Apply middleware to specific routes
export const config = {
  matcher: ['/home', '/admin/users'], // Adjust paths based on your Next.js structure
}
