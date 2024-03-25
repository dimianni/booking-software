import Calendar from "@/components/Calendar"
import { PrismaClient } from '@prisma/client'
import { formatISO } from "date-fns"

const prisma = new PrismaClient({})

// getServerSideProps replaced:
// https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration
export default async function Home() {

  const days = await prisma.day.findMany()
  const closedDays = (await prisma.closedDay.findMany()).map(day => formatISO(day.date))

  return (
    <>
      <h1 className="mb-8 text-center">Please select date and time 🗓️</h1>
      <Calendar days={days} closedDays={closedDays} />
    </>
  )
}
