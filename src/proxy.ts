import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/signup']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('accessToken')?.value

  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p))

  // 비로그인 상태로 보호된 경로 접근 → 로그인 페이지
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 로그인 상태로 로그인/회원가입 접근 → 포트폴리오 페이지
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/portfolio', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.webp|api/).*)',
  ],
}
