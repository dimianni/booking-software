"use client"

import React, { useState } from 'react'
import Logo from './Logo'
import Cart from '../Cart'
import { usePathname } from 'next/navigation'

type Props = {}

export default function Header({ }: Props) {

    const pathname = usePathname()

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-all duration-100 bg-base-100 text-base-content shadow-sm">
            <div className="container flex h-16 items-center justify-between prose-headings:text-xl">
                <Logo />
                {pathname === "/menu" && <Cart />}
            </div>
        </header>
    )
}