"use client"

import React, { useContext, useEffect } from 'react'
import { default as MenuComponent } from '@/components/Menu'
import { CartContext } from '@/contexts/CartContext'

type Props = {}

export default function Menu({ }: Props) {
    
    const cntx = useContext(CartContext)

    useEffect(() => {
        cntx?.addToCart("haircut", 1)
    }, [])

    return (
        <div>
            <MenuComponent />
        </div>
    )
}