"use client"

import React, { useEffect, useState } from 'react'
import Logo from './Logo'
import Cart from '../Cart'
import { usePathname } from 'next/navigation'

type Props = {}

export default function Header({ }: Props) {

    const pathname = usePathname()

    const [productsInCart, setProductsInCart] = useState<{ id: string; quantity: number }[]>([])
    const addToCart = (id: string, quantity: number) => {
        setProductsInCart((prev) => {
            const existing = prev.find((item) => item.id === id)
            if (existing) {
                return prev.map((item) => {
                    if (item.id === id) return { ...item, quantity: item.quantity + quantity }
                    return item
                })
            }
            return [...prev, { id, quantity }]
        })
    }

    useEffect(()=> {
        console.log(pathname);
        
    })

    const removeFromCart = (id: string) => {
        setProductsInCart((prev) => prev.filter((item) => item.id !== id))
    }

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-all duration-100 bg-base-100 text-base-content shadow-sm">
            <div className="container flex h-16 items-center justify-between prose-headings:text-xl">
                <Logo />
                {pathname === "/menu" && <Cart products={productsInCart} removeFromCart={removeFromCart} />}
            </div>
        </header>
    )
}