"use client"

import { INTERVAL, now } from '@/constants/config'
import { format, formatISO, isBefore, parse } from 'date-fns'
import React, { useState, useEffect } from 'react'
import ReactCalendar from 'react-calendar'
import { FaArrowLeft } from 'react-icons/fa'
import { Booking } from '@/types'
import { Day } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { getOpeningTimes, roundToNearestMinutes } from '@/utils/helpers'


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


    const dateSelected = (date: Date) => setBooking(prev => ({ ...prev, date: date }))
    const dateTimeSelected = (dateTime: Date) => setBooking(prev => ({ ...prev, dateTime: dateTime }))
    const timesAvailable = booking.date && getOpeningTimes(booking.date, days)

    return (
        <section className="calendar">
            <div className="wrapper w-full flex justify-center items-center">
                {
                    booking.date ? (
                        <div>
                            <button className="back flex items-center mb-4" onClick={() => setBooking(prev => ({ ...prev, date: null }))}>
                                <FaArrowLeft />
                                <span className='ml-2'>Back to date selection</span>
                            </button>
                            <div className="times">
                                <ul className='flex flex-wrap'>
                                    {
                                        timesAvailable?.map((time, i) => {
                                            return (
                                                <li key={i} className='bg-gray-200 rounded-sm p-2 m-2 text-[#6d7482] cursor-pointer' onClick={() => dateTimeSelected(time)}>
                                                    {format(time, "kk:mm")}
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <ReactCalendar
                            onClickDay={(value) => dateSelected(value)}
                            minDate={now}
                            tileDisabled={({ date }) => closedDays.includes(formatISO(date))}
                        />
                    )
                }
            </div>
        </section>
    )
}