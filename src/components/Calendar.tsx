"use client"

import { OPENING_TIME, CLOSING_TIME, INTERVAL, now } from '@/constants/config'
import { add, format, formatISO, isBefore, parse } from 'date-fns'
import React, { Dispatch, SetStateAction, useState, useEffect } from 'react'
import ReactCalendar from 'react-calendar'
import { FaArrowLeft } from 'react-icons/fa'
import { Booking } from '@/types'
import { Day } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { roundToNearestMinutes } from '@/utils/helpers'


interface CalendarProps {
    days: Day[]
    closedDays: string[]
}

export default function Calendar({ days, closedDays }: CalendarProps) {

    const router = useRouter()

    const today = days.find(d => d.dayOfWeek === now.getDay())
    const rounded = roundToNearestMinutes(now, INTERVAL)
    const closing = parse(today!.closeTime, 'kk:mm', now)
    const tooLate = !isBefore(rounded, closing)
    if (tooLate) closedDays.push(formatISO(new Date().setHours(0, 0, 0, 0)))

    const [booking, setBooking] = useState<Booking>({
        date: null,
        dateTime: null
    })

    useEffect(() => {

        if (booking.dateTime) {
            localStorage.setItem('selectedtime', booking.dateTime.toISOString())
            router.push('/menu')
        }

    }, [booking.dateTime])


    function dateSelected(date: Date) {
        setBooking(prev => ({ ...prev, date: date }))
    }

    function dateTimeSelected(dateTime: Date) {
        setBooking(prev => ({ ...prev, dateTime: dateTime }))
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
                                        timesAvailable?.map((time, i) => {
                                            return (
                                                <li key={i} className='bg-gray-200 rounded-sm p-2 m-2' onClick={() => dateTimeSelected(time)}>
                                                    {format(time, "kk:mm")}
                                                </li>
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