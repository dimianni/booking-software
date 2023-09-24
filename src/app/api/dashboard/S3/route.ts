import { s3 } from "@/app/lib/s3";
import { MAX_FILE_SIZE } from "@/constants/config";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const inputSchema = z.object({
    fileType: z.string(),
    fileName: z.string()
})

export async function POST(request: NextRequest, response: NextResponse) {

    try {
        const body = await request.json()
        const input = inputSchema.parse(body)
        const id = nanoid()
        const ex = input.fileType.split('/')[1]
        const name = input.fileName
        const key = `${id}.${ex}`

        const fileParams = {
            Bucket: 'dimianni-booking-software',
            Key: key,
            Expires: 60,
            ContentType: ex
        }

        const url = await s3.getSignedUrlPromise('putObject', fileParams)

        return NextResponse.json({ url, key }, { status: 200 });
    } catch (error) {
        const errorMessage = (error as Error).message
        return NextResponse.json({ error: errorMessage }, { status: 401 })
    }

}