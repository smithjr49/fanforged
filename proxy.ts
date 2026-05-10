import { NextRequest, NextResponse } from 'next/server'

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? ''

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes with a simple bearer token check
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const token =
      request.headers.get('x-admin-secret') ??
      request.nextUrl.searchParams.get('secret') ??
      request.cookies.get('admin_secret')?.value ??
      ''

    if (!ADMIN_SECRET || token !== ADMIN_SECRET) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
