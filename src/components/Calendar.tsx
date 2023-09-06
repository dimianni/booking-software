"use client"

import { OPENING_TIME, CLOSING_TIME, INTERVAL } from '@/constants/config'
import { add, format } from 'date-fns'
import React, { useState } from 'react'
import ReactCalendar from 'react-calendar'
import { FaArrowLeft } from 'react-icons/fa'


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

    function dateSelected(date: Date) {
        setBooking(prev => ({ ...prev, date: date }))
    }

    function getTimes() {

        if (!booking.date) return

        const openingTime = add(booking.date, { hours: OPENING_TIME })
        const closingTime = add(booking.date, { hours: CLOSING_TIME })
        const interval = INTERVAL
        const times: Date[] = [];

        for (let i = openingTime; i <= closingTime; i = add(i, { minutes: interval })) {
            times.push(i)
        }

        return times
    }

    const timesAvailable = getTimes()

    return (
        <section className="calendar">
            <div className="wrapper w-full h-screen flex justify-center items-center">
                {
                    booking.date ? (
                        <div>
                            <button className="back" onClick={() => setBooking(prev => ({ ...prev, date: null }))}>
                                <FaArrowLeft />
                            </button>
                            <div className="times">
                                <div>Times available</div>
                                <ul className='flex flex-wrap'>
                                    {
                                        timesAvailable?.map(time => {
                                            return (
                                                <li className='bg-gray-200 rounded-sm p-2 m-2'>{format(time, "kk:mm")}</li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <ReactCalendar onClickDay={(value) => dateSelected(value)} />
                    )
                }
            </div>
        </section>
    )
}