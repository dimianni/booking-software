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
        const input = inputSchema.parse(body.productsInCart)

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

        // Assuming `withUrls` might have undefined items due to failed promises or errors in URL fetching
        // Filter out any undefined items first
        const filteredWithUrls = withUrls.filter(item => item !== undefined) as { id: string; price: number; quantity: number }[];

        const subtotal = filteredWithUrls.reduce((acc, item) => {
            // Ensure item and quantity are defined, even though we've already filtered undefined items,
            // this is to pacify TypeScript's strict null checking
            if (item && item.quantity !== undefined) {
                return acc + item.price * item.quantity;
            }
            return acc;
        }, 0).toFixed(2);

        return NextResponse.json({ cartItems: withUrls, subtotal: subtotal }, { status: 200 })

    } catch (error) {
        const errorMessage = (error as Error).message
        return NextResponse.json({ error: errorMessage }, { status: 400 })
    }
}