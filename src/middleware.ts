import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './app/lib/auth'

export async function middleware(request: NextRequest) {

    console.log("middleware ran");
    

    let baseUrl = request.nextUrl
    // let baseUrl = request.nextUrl.origin

    let token = request.cookies.get('user-token')?.value
    let verifiedToken = token && (await verifyToken(token).catch(err => console.log(err)))

    // IF the user is on the login page with an invalid token --> stop running middleware function   
    if (request.nextUrl.pathname.startsWith('/login') && !verifiedToken) return
    
    // IF the user is on a page mentioned in the matcher array (except /login) with an invalid token --> redirect to /login
    if (!verifiedToken) {
        return NextResponse.redirect(new URL('/login', baseUrl))
    }
    // IF the user is on a login page with a valid token --> redirect to /dashboard
    if (request.nextUrl.pathname.startsWith('/login') && verifiedToken) {
        return NextResponse.redirect(new URL('/dashboard', baseUrl))
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/login', '/dashboard/:path*'],
}