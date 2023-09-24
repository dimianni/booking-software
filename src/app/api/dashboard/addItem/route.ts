import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({})

const inputSchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    imageKey: z.string()
})

export async function POST(request: NextRequest, response: NextResponse) {

    try {
        const body = await request.json()
        const input = inputSchema.parse(body)
        const { name, description, price, imageKey } = input

        const catalogItem = await prisma.productItem.create({
            data: {
                name,
                description,
                price,
                imageKey
            }
        })

        return NextResponse.json({ newItem: catalogItem, success: true }, { status: 200 });

    } catch (error) {
        const errorMessage = (error as Error).message
        return NextResponse.json({ message: errorMessage }, { status: 400 })
    }
}