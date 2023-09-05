"use client"

import React, { useState } from 'react'
import ReactCalendar from 'react-calendar'

type Props = {}

interface Booking {
    date: Date | null
    dateTime: Date | null
}

export default function Calendar({ }: Props) {

    const [booking, setBooking] = useState<Booking>({
        date: null,
        dateTime: null
    })

    function dateSelected(date: Date){
        setBooking(prev => ({...prev, date: date}))
    }

    return (
        <section className="calendar">
            <div className="wrapper w-full h-screen flex justify-center items-center">
                {
                    booking.date ? (
                        <div>Times available</div>
                    ) : (
                        <ReactCalendar onClickDay={(value) => dateSelected(value)} />
                    )
                }
            </div>
        </section>
    )
}