import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient({})

const inputSchema = z.array(z.object({
    id: z.string(),
    name: z.string(),
    openTime: z.string(),
    closeTime: z.string()
}))

export async function POST(request: NextRequest, response: NextResponse) {
    try {
        const body = await request.json()
        const input = await inputSchema.parse(body)

        const results = await Promise.all(
            input.map(async (day) => {
                const updatedDay = await prisma.day.update({
                    where: {
                        id: day.id
                    },
                    data: {
                        openTime: day.openTime,
                        closeTime: day.closeTime
                    }
                })

                return updatedDay
            })
        )

        return NextResponse.json({ results: results }, { status: 200 })
    } catch (error) {
        const errorMessage = (error as Error).message
        return NextResponse.json({ message: errorMessage }, { status: 400 })
    }
}   