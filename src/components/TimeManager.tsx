"use client"
import React, { useEffect, useState } from 'react'
import { Day } from '@prisma/client'
import { formatISO } from 'date-fns'
import axios from 'axios'
import { capitalize, classNames, weekdayIndexToName } from '@/utils/helpers'
import { Tab } from '@headlessui/react'
import TimeSelector from './TimeSelector'
import Calendar from 'react-calendar'
import { now } from '@/constants/config'



interface TimeManagerProps {
    days: Day[]
}

export default function TimeManager({ days }: TimeManagerProps) {

    const [enabled, setEnabled] = useState<boolean>(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [openingHrs, setOpeningHrs] = useState([
        { name: 'sunday', openTime: days[0]!.openTime, closeTime: days[0]!.closeTime },
        { name: 'monday', openTime: days[1]!.openTime, closeTime: days[1]!.closeTime },
        { name: 'tuesday', openTime: days[2]!.openTime, closeTime: days[2]!.closeTime },
        { name: 'wednesday', openTime: days[3]!.openTime, closeTime: days[3]!.closeTime },
        { name: 'thursday', openTime: days[4]!.openTime, closeTime: days[4]!.closeTime },
        { name: 'friday', openTime: days[5]!.openTime, closeTime: days[5]!.closeTime },
        { name: 'saturday', openTime: days[6]!.openTime, closeTime: days[6]!.closeTime },
    ])
    const [closedDays, setClosedDays] = useState([])

    async function getClosedDays() {
        const { data } = await axios.get('/api/dashboard/times/getClosedDays')
        setClosedDays(data.closedDays)
    }

    async function openDay(day: Date) {
        const { data } = await axios.post('/api/dashboard/times/openDay', {
            date: day
        })
        return data.openDay
    }
    async function closeDay(day: Date) {
        const { data } = await axios.post('/api/dashboard/times/closeDay', {
            date: day
        })
        return data.closeDay
    }

    useEffect(() => {
        getClosedDays()
    }, [])

    const dayIsClosed = selectedDate && (closedDays as string[]).includes(formatISO(selectedDate))

    // Curried for easier usage
    function _changeTime(day: Day) {
        return function (time: string, type: 'openTime' | 'closeTime') {
            const index = openingHrs.findIndex((x) => x.name === weekdayIndexToName(day.dayOfWeek))
            const newOpeningHrs = [...openingHrs]
            newOpeningHrs[index]![type] = time
            setOpeningHrs(newOpeningHrs)
        }
    }


    return (
        <div className="w-full max-w-md px-2 py-16 sm:px-0">
            <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">

                    <Tab key="Hours"
                        className={({ selected }) =>
                            classNames(
                                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                selected
                                    ? 'bg-white shadow'
                                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                            )
                        }
                    >
                        Opening Hours
                    </Tab>
                    <Tab key="Days"
                        className={({ selected }) =>
                            classNames(
                                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                selected
                                    ? 'bg-white shadow'
                                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                            )
                        }
                    >
                        Opening Days
                    </Tab>
                </Tab.List>
                <Tab.Panels className="mt-2">
                    <Tab.Panel
                        key="Hours"
                        className={classNames(
                            'rounded-xl bg-white p-3',
                            'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                        )}
                    >
                        <div className='my-12 flex flex-col gap-8'>
                            {days.map((day) => {
                                const changeTime = _changeTime(day)
                                return (
                                    <div className='grid grid-cols-3 place-items-center' key={day.id}>
                                        <h3 className='font-semibold'>{capitalize(weekdayIndexToName(day.dayOfWeek)!)}</h3>
                                        <div className='mx-4'>
                                            <TimeSelector
                                                type='openTime'
                                                changeTime={changeTime}
                                                selected={
                                                    openingHrs[openingHrs.findIndex((x) => x.name === weekdayIndexToName(day.dayOfWeek))]
                                                        ?.openTime
                                                }
                                            />
                                        </div>

                                        <div className='mx-4'>
                                            <TimeSelector
                                                type='closeTime'
                                                changeTime={changeTime}
                                                selected={
                                                    openingHrs[openingHrs.findIndex((x) => x.name === weekdayIndexToName(day.dayOfWeek))]
                                                        ?.closeTime
                                                }
                                            />
                                        </div>
                                    </div>
                                )
                            })}

                            <button
                                onClick={() => {
                                    const withId = openingHrs.map((day) => ({
                                        ...day,
                                        id: days[days.findIndex((d) => d.name === day.name)]!.id,
                                    }))

                                    setOpeningHrs(withId)
                                }}
                                className="btn btn-primary">
                                Save
                            </button>
                        </div>
                    </Tab.Panel>
                    <Tab.Panel
                        key="Days"
                        className={classNames(
                            'rounded-xl bg-white p-3',
                            'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                        )}
                    >
                        <div className='mt-6 flex flex-col items-center gap-6'>
                            <Calendar
                                minDate={now}
                                className='REACT-CALENDAR p-2'
                                view='month'
                                onClickDay={(date) => setSelectedDate(date)}
                                tileClassName={({ date }) => {
                                    return (closedDays as string[]).includes(formatISO(date)) ? 'closed-day' : null
                                }}
                            />

                            <button
                                onClick={() => {
                                    if (dayIsClosed) openDay(selectedDate)
                                    else if (selectedDate) closeDay(selectedDate)
                                }}
                                disabled={!selectedDate}
                                className="btn btn-primary">
                                {dayIsClosed ? 'Open shop this day' : 'Close shop this day'}
                            </button>
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    )
}

