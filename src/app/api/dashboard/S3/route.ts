import { s3 } from "@/app/lib/s3";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const inputSchema = z.object({
    fileType: z.string()
})

export async function POST(request: NextRequest, response: NextResponse) {

    const body = await request.json()
    const input = inputSchema.parse(body)
    const id = nanoid()
    const ex = input.fileType.split('/')[1]
    const key = `${id}.${ex}`


    const { url, fields } = (await new Promise((resolve, reject) => {
        s3.createPresignedPost({
            Bucket: 'dimianni-booking-software',
            Fields: { key },
            Expires: 60,
            Conditions: [
                ['content-length-range', 0, 1024 * 1024 * 5],
                ['starts-with', '$Content-Type', 'image/']
            ]
        },
            (err, data) => {
                if (err) return reject(err)
                resolve(data)
            }
        )
    })) as any as { url: string; fields: any }


    return NextResponse.json({ url, fields, key }, { status: 200 });

}