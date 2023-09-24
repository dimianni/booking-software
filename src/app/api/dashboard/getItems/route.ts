import { s3 } from "@/app/lib/s3";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function GET() {
    try {
        const items = await prisma.productItem.findMany()

        // Each items contains only AWS key.
        // Extending all items with their actual img url
        const withUrls = await Promise.all(
            items.map(async (item) => {
                try {
                    const url = await s3.getSignedUrlPromise("getObject", {
                        Bucket: "dimianni-booking-software",
                        Key: item.imageKey,
                    });
                    return { ...item, url }
                } catch (error) {
                    // Handle the specific error for this item, e.g., log it and provide a default URL.
                    const errorMessage = (error as Error).message
                    console.error(`Error fetching image for item ${item.id}: ${errorMessage}`);
                    // Provide a default image URL or handle the error as needed
                    return { ...item, url: "default_image_url.jpg" };
                }
            })
        )

        return NextResponse.json({ items: withUrls, success: true }, { status: 200 })
    } catch (error) {
        const errorMessage = (error as Error).message
        return NextResponse.json({ error: errorMessage }, { status: 401 })
    }
}