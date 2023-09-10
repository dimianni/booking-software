import { getJwtSecretKey } from "@/app/lib/auth";
import { SignJWT } from "jose";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import cookie from 'cookie'

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
})

// encode a string into a byte array (Uint8Array) based on the UTF-8 character encoding
const secret = new TextEncoder().encode(getJwtSecretKey())

export async function POST(request: NextRequest, response: NextResponse) {

    try {
        const body = await request.json();
        const { email, password } = loginSchema.parse(body)

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

            // Token creation
            const token = await new SignJWT({})
                .setProtectedHeader({ alg: 'HS256' })
                .setJti(nanoid())
                .setIssuedAt()
                .setExpirationTime('1hr')
                .sign(secret)

            // create a response with JSON body first then set the cookie
            // https://codethenporrada.xyz/how-to-set-a-cookie-using-nextjs-13-api-routes
            const response = NextResponse.json({ message: "Auth success!", success: true }, { status: 200 });

            response.cookies.set({
                name: 'jwt',
                value: token,
                httpOnly: true,
                maxAge: 60 * 60,
            })

            return response
            // return NextResponse.json({ message: "Auth success!", success: true }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Auth failed!", success: true }, { status: 401 });
        }

    } catch (error) {
        const errorMessage = (error as Error).message
        return NextResponse.json({ message: errorMessage }, { status: 400 })
    }
}