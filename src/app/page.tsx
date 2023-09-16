"use client"
import Calendar from "@/components/Calendar"
import Menu from "@/components/Menu"
import { Booking } from "@/types"
import { useState } from "react"

export default function Home() {

  const [booking, setBooking] = useState<Booking>({
    date: null,
    dateTime: null
  })

  return (
    <main>
      {!booking.dateTime && <Calendar booking={booking} setBooking={setBooking} />}
      {booking.dateTime && false ? (
        <Menu />
      ) : (
        <div className="loading loading-spinner loading-lg"></div>
      )}
    </main>
  )
}
