"use client"
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {}

export default function Logo({ }: Props) {
    const router = useRouter()

    return (
        <h1 className='cursor-pointer' onClick={() => router.push('/')}>Booking Software</h1>
    )
}