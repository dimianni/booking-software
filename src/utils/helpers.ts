import { INTERVAL, now } from "@/constants/config"
import { Day } from "@prisma/client"
import { add, addMinutes, getHours, getMinutes, isBefore, isEqual, parse } from "date-fns"

export function weekdayIndexToName(index: number){
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    return days[index]
}

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function classNames(...classes: string[]){
    return classes.filter(Boolean).join(' ')
}

export function roundToNearestMinutes(date: Date, interval: number){
    const minLeftUntilNextInterval = interval - (getMinutes(date) % interval)
    return addMinutes(date, minLeftUntilNextInterval)
}

export function getOpeningTimes(startDate: Date, dbDays: Day[]) {
    const dayOfWeek = startDate.getDay()
    const isToday = isEqual(startDate, new Date().setHours(0, 0, 0, 0))

    const today = dbDays.find((d) => d.dayOfWeek === dayOfWeek)
    if (!today) throw new Error('This day does not exist in the database')

    const opening = parse(today.openTime, 'kk:mm', startDate)
    const closing = parse(today.closeTime, 'kk:mm', startDate)

    let hours: number
    let minutes: number

    if (isToday) {
        // Round the current time to the nearest interval. If there are no more bookings today, throw an error
        const rounded = roundToNearestMinutes(now, INTERVAL)
        const tooLate = !isBefore(rounded, closing)
        if (tooLate) throw new Error('No more bookings today')

        const isBeforeOpening = isBefore(rounded, opening)

        hours = getHours(isBeforeOpening ? opening : rounded)
        minutes = getMinutes(isBeforeOpening ? opening : rounded)
    } else {
        hours = getHours(opening)
        minutes = getMinutes(opening)
    }

    const beginning = add(startDate, { hours, minutes })
    const end = add(startDate, { hours: getHours(closing), minutes: getMinutes(closing) })
    const interval = INTERVAL

    // from beginning to end, every interval, generate a date and put that into an array
    const times = []
    for (let i = beginning; i <= end; i = add(i, { minutes: interval })) {
        times.push(i)
    }

    return times
}