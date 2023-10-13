import React from 'react'
import TimeManager from '@/components/TimeManager'
import { PrismaClient } from '@prisma/client'


type Props = {}

const prisma = new PrismaClient({})

async function getDays() {
  const days = await prisma.day.findMany()
  if (!(days.length === 7)) throw new Error('Insert all days into database')
  return days
}

export default async function Opening({ }: Props) {

  const days = await getDays()
  return (
    <TimeManager days={days} />
  )
}

