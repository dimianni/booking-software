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
    const catItem = prisma.productItem.delete({ where: { id } })


    return catItem
}