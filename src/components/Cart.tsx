import React from 'react'
import { GrClose } from 'react-icons/gr'
import { FiShoppingCart } from 'react-icons/fi'
import axios from 'axios'

interface CartProps {
    products: {
        id: string
        quantity: number
    }[]
    removeFromCart: (id: string) => void
}

export default function Cart({ products, removeFromCart }: CartProps) {

    async function getCartItems() {
        try {
            const { data } = await axios.post('/api/checkout/getCartItems', { products })
            const cartItems = data.cartItems
            const subtotal = data.subtotal
        } catch (error) {
            console.log(error);
        }
    }


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
                            <li><a>Sidebar Item 1</a></li>
                            <li><a>Sidebar Item 2</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}