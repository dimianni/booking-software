import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";


const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
})

export async function POST(request: NextRequest) {
    // console.log(request.json());

    const body = await request.json();
    
    const { email, password } = loginSchema.parse(body)

    // console.log(email, password);
    // console.log(request.body);
    
    return NextResponse.json({ message: "This Worked", success: true });

}