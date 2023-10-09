import { s3 } from "@/app/lib/s3";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient({})

const inputSchema = z.object({
    imageKey: z.string(),
    id: z.string()
})

export async function POST(request: NextRequest, response: NextResponse) {

    try {
        const body = await request.json()
        const input = inputSchema.parse(body)
        const { imageKey, id } = input

        // Deleting the image from S3
        const del = await new Promise((resolve, reject) => {
            s3.deleteObject({ Bucket: 'dimianni-booking-software', Key: imageKey },
                (err, data) => {
                    if (err) return reject(err)
                    resolve(data)
                }
            )
        })

        // Deleting the image from db
        const catItem = await prisma.productItem.delete({ where: { id } })

        return NextResponse.json({ deletedItem: catItem, success: true }, { status: 200 })

    } catch (error) {
        const errorMessage = (error as Error).message
        return NextResponse.json({ message: errorMessage }, { status: 400 })
    }
}