import { CartContext } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'
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
    const router = useRouter()

    function onRemove(id: string) {
        if (id === "haircut") {
            removeFromCart(id)
            router.push('/')
        } else {
            removeFromCart(id)
        }
    }

    return (
        <div>
            <div className="card card-side bg-base-100 shadow-xl overflow-hidden">
                <div className='max-w-[40%] bg-white p-2 flex justify-center items-center'>
                    <figure>
                        <img src={url} alt={name} />
                    </figure>
                </div>
                <div className="card-body p-5">
                    <h2 className="card-title">{name}</h2>
                    <p>{price}</p>
                    <p>Quantity: {quantity}</p>
                    <div className="card-actions justify-end">
                        <button className="link" onClick={() => onRemove(id)}>Remove</button>
                    </div>
                </div>
            </div>
        </div>
    )
} 