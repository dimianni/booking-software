import { CartContext } from '@/contexts/CartContext'
import React, { useContext } from 'react'

interface CartProductCardProps {
    id: string
    url: string
    name: string
    price: number
    quantity: number
}

export default function CartProductCard({ id, url, name, price, quantity }: CartProductCardProps) {

    const cartContext = useContext(CartContext)
    const { removeFromCart } = cartContext || { removeFromCart: () => { } };

    return (
        <div>
            <div className="card card-side bg-base-100 shadow-xl">
                <figure><img src={url} alt={name} /></figure>
                <div className="card-body">
                    <h2 className="card-title">{name}</h2>
                    <p>{price}</p>
                    <p>{quantity}</p>
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary" onClick={() => removeFromCart(id)}>Remove</button>
                    </div>
                </div>
            </div>
        </div>
    )
} 