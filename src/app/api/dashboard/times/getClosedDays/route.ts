import { PrismaClient } from "@prisma/client"
import { formatISO } from "date-fns"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient({})

export async function POST(request: NextRequest, response: NextResponse) {
    try {
        const closedDays = await prisma.closedDay.findMany()
        const isoClosedDays = closedDays.map(day => formatISO(day.date))
        return NextResponse.json({ closedDays: isoClosedDays }, { status: 200 })
    } catch (error) {
        const errorMessage = (error as Error).message
        return NextResponse.json({ message: errorMessage }, { status: 400 })
    }
}