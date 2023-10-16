"use client"

import React, { useState, createContext } from "react";
import { CartContextType } from '../types'

export const CartContext = createContext<CartContextType | undefined>(undefined)

export default function CartProvider({ children }: {
    children: React.ReactNode
}) {
    const [productsInCart, setProductsInCart] = useState<{ id: string; quantity: number }[]>([])
    const addToCart = (id: string, quantity: number) => {
        console.log("addToCart");
        
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

    const removeFromCart = (id: string) => {
        setProductsInCart((prev) => prev.filter((item) => item.id !== id))
    }

    const value: CartContextType = {
        productsInCart, addToCart, removeFromCart
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )

}