import { CartContext } from '@/contexts/CartContext'
import React, { useContext, useState } from 'react'
import Loader from '../layouts/Loader'
import toast, { Toaster } from 'react-hot-toast'

interface UserProductCardProps {
    id: string | undefined
    name: string
    url: string
    price: number
    description: string
}

export default function UserProductCard({ id, name, url, price, description }: UserProductCardProps) {

    const cntx = useContext(CartContext)
    const [loading, setLoading] = useState<Boolean>(false)

    function add() {
        setLoading(true)
        cntx?.addToCart(id!, 1)
        setLoading(false)
        toast.success('Item added!')
    }

    return (
        <div className="card w-full bg-base-100 shadow-xl overflow-hidden">
            <div className='bg-white p-5'>
                <figure>
                    <img alt={name} src={url} width="60%" height="auto" />
                </figure>
            </div>
            <div className="card-body pt-5">
                <h2 className="card-title">{name}</h2>
                <p className="card-title">{price}&#x20AC;</p>
                <p>{description}</p>
                <div className="card-actions justify-end mt-3">
                    <button
                        className="w-full btn btn-primary"
                        onClick={add}>
                        {loading ? (<Loader />) : "Add to cart"}
                    </button>
                </div>
            </div>
            <Toaster position="bottom-right" />
        </div>
    )
}