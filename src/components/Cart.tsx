"use client"
import React, { useContext, useEffect, useState } from 'react'
import { GrClose } from 'react-icons/gr'
import { FiShoppingCart } from 'react-icons/fi'
import axios from 'axios'
import { CartContext } from '@/contexts/CartContext'
import CartProductCard from './cards/CartProductCard'


const initCart = {
    cartItems: [],
    subtotal: 0
}

interface CartObject {
    active: boolean
    createdAt: string
    description: string
    id: string
    imageKey: string
    name: string
    price: number
    quantity: number
    updatedAt: string
    url: string
}

interface CartState {
    cartItems: CartObject[]
    subtotal: number
}

export default function Cart() {

    const cartContext = useContext(CartContext)
    const { productsInCart } = cartContext || { productsInCart: [] };

    const [cart, setCart] = useState<CartState>(initCart)

    async function getCartItems() {
        try {
            const { data } = await axios.post('/api/checkout/getCartItems', { productsInCart })
            setCart(prev => ({
                ...prev,
                cartItems: data.cartItems,
                subtotal: data.subtotal // Update subtotal with the data from the API
            }));
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCartItems()
    }, [productsInCart])


    return (
        <div>
            <div className="drawer drawer-end">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    {/* Page content here */}
                    <label htmlFor="my-drawer-4" className="drawer-button btn btn-primary">
                        <FiShoppingCart />
                    </label>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                    <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                        {/* Sidebar content here */}
                        <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay">
                            <GrClose />
                        </label>

                        <ul className='pt-4'>
                            {
                                cart.cartItems.map((item) => {
                                    return (
                                        <CartProductCard key={item.id} id={item.id} url={item.url} name={item.name} price={item.price} quantity={item.quantity} />
                                    )
                                })
                            }
                        </ul>

                        <p>Total: {cart.subtotal}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}