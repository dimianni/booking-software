import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient({})

const inputSchema = z.object({
    date: z.date()
})

export async function POST(request: NextRequest, response: NextResponse) {
    try {
        const body = await request.json()
        const input = await inputSchema.parse(inputSchema)

        const openDay = await prisma.closedDay.delete({
            where: {
                date: input.date
            }
        })

        return NextResponse.json({ openDay: openDay }, { status: 200 })

    } catch (error) {
        const errorMessage = (error as Error).message
        return NextResponse.json({ message: errorMessage }, { status: 400 })
    }
}