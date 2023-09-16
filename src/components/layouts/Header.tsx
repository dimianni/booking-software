import React from 'react'

type Props = {}

export default function Header({ }: Props) {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background">
            <div className="container flex h-16 items-center">
                <h1>Booking</h1>
            </div>
        </header>
    )
}