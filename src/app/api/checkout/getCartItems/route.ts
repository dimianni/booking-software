import { s3 } from "@/app/lib/s3"
import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const prisma = new PrismaClient({})

const inputSchema = z.array(z.object({
    id: z.string(),
    quantity: z.number()
}))

export async function POST(request: NextRequest, response: NextRequest) {
    try {
        const body = await request.json()
        const input = inputSchema.parse(body)

        const cartItems = await prisma.productItem.findMany({
            where: {
                id: {
                    in: input.map(item => item.id)
                }
            }
        })

        const withUrls = await Promise.all(
            cartItems.map(async (item) => {
                try {
                    const url = await s3.getSignedUrlPromise("getObject", {
                        Bucket: "dimianni-booking-software",
                        Key: item.imageKey,
                    });
                    const quantity = input.find((menuItem) => menuItem.id === item.id)?.quantity
                    return { ...item, url, quantity }
                } catch (error) {
                    // Handle the specific error for this item, e.g., log it and provide a default URL.
                    const errorMessage = (error as Error).message
                    console.error(`Error fetching image for item ${item.id}: ${errorMessage}`);
                    // Provide a default image URL or handle the error as needed
                    // return { ...item, url: "default_image_url.jpg" };
                }
            })
        )

        const subtotal = (
            withUrls?.reduce(
                (acc, item) => acc + item.price * withUrls.find((i) => i.id === item.id)!.quantity!,
                0
            ) ?? 0
        ).toFixed(2)

        return NextResponse.json({ cartItems: withUrls, subtotal: subtotal }, { status: 200 })

    } catch (error) {
        const errorMessage = (error as Error).message
        return NextResponse.json({ error: errorMessage }, { status: 400 })
    }
}