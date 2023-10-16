import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";


const prisma = new PrismaClient({})

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-08-16'
})

const inputSchema = z.object(
    {
        products: z.array(z.object({
            id: z.string(),
            quantity: z.number().min(1, 'Quantity must be at least 1!')
        }))
    }
)

export async function GET(request: NextRequest, response: NextResponse) {
    try {

        const body = await request.json()
        const input = inputSchema.parse(body)


        const productsInCart = (await prisma.productItem.findMany({
            where: {
                id: {
                    in: input.products.map(item => item.id)
                }
            }
        })
        ).map(p => {
            return {
                ...p,
                quantity: input.products.find((menuItem) => menuItem.id === p.id)?.quantity || 0
            }
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: productsInCart.map((product) => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: product.price * 100,
                },
                quantity: product.quantity,
            })),
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 0,
                            currency: 'usd',
                        },
                        display_name: 'Pickup in store',
                    },
                },
            ],
            success_url: `http://localhost:3000/success`,
            cancel_url: `http://localhost:3000/menu`,
        })

    } catch (error) {
        const errorMessage = (error as Error).message
        return NextResponse.json({ error: errorMessage }, { status: 400 })
    }
}