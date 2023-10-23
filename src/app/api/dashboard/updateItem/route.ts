import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient({})

const inputSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number()
})

export async function POST(request: NextRequest, response: NextResponse) {
    try {

        const body = await request.json()
        const input = inputSchema.parse(body)
        const { id, name, description, price } = input

        const results = await prisma.productItem.update({
            where: {
                id: id
            },
            data: {
                name: name,
                description: description,
                price: price
            }
        })

        return NextResponse.json({ updatedItem: results }, { status: 200 })

    } catch (error) {
        const errorMessage = (error as Error).message
        return NextResponse.json({ error: errorMessage }, { status: 400 })
    }
}