"use client"
import React, { useContext, useEffect, useState } from 'react'
import { FiShoppingCart } from 'react-icons/fi'
import axios from 'axios'
import { CartContext } from '@/contexts/CartContext'
import CartProductCard from './cards/CartProductCard'
import { AiOutlineClose } from 'react-icons/ai'
import HostedPayment from './payment/HostedPayment'


const initCart = {
    cartItems: [],
    subtotal: 0,
    totItems: 0
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
    totItems: number
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
                subtotal: data.subtotal, // Update subtotal with the data from the API
                totItems: sumQuantity(data.cartItems)
            }));
        } catch (error) {
            console.log(error);
        }
    }

    function sumQuantity(cart: CartObject[]): number {
        return cart.reduce((total, product) => total + product.quantity, 0);
    }

    useEffect(() => {
        getCartItems()
        // console.log(cart);
    }, [productsInCart])

    const paymentCartInfo = {
        amount: Math.round(cart.subtotal * 100),
        products: cart.cartItems.map(({ name, quantity, price }) => ({
            name,
            quantity,
            price: Math.round(price * 100)
        }))
    };

    return (
        <div>
            <div className="drawer drawer-end">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    {/* Page content here */}
                    <label htmlFor="my-drawer-4" className="drawer-button btn btn-outline">
                        <span className={`w-5 h-5 rounded-full bg-primary flex justify-center items-center ${cart.totItems !== 0 && "animate-bounce"}`}>{cart.totItems}</span>
                        <FiShoppingCart className='h-4 w-4' />
                    </label>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                    <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                        {/* Sidebar content here */}
                        <div className='flex justify-between items-center'>
                            <FiShoppingCart className='h-5 w-5 text-white' />
                            <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay cursor-pointer">
                                <AiOutlineClose className='h-5 w-5' style={{ fill: "white" }} />
                            </label>
                        </div>
                        <ul className='pt-4'>
                            {
                                cart.cartItems.map((item) => {
                                    return (
                                        <li key={item.id} className='mb-4'>
                                            <CartProductCard id={item.id} url={item.url} name={item.name} price={item.price} quantity={item.quantity} />
                                        </li>
                                    )
                                })
                            }
                        </ul>

                        <div className='mt-5'>
                            <h2 className='mb-4'>Total: <b>{cart.subtotal}&#x20AC;</b></h2>
                            <HostedPayment cartData={paymentCartInfo} />
                            <div className='bg-[#f0f0f0] text-[#6d7482] rounded-lg p-2 mt-5'>
                                <p>❗️ Please use the following test card:</p>
                                <p>💳 4242 4242 4242 4242 08/28 100</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}