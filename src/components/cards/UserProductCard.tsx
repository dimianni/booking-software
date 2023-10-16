import { CartContext } from '@/contexts/CartContext'
import React, { useContext } from 'react'

interface UserProductCardProps {
    id: string | undefined
    name: string
    url: string
    price: number
    description: string
}

export default function UserProductCard({ id, name, url, price, description }: UserProductCardProps) {

    const cntx = useContext(CartContext)

    function add(){
        console.log("add");
        
        cntx?.addToCart(id!, 1)
    }

    return (
        <div className="card w-full bg-base-100 shadow-xl">
            <div className="card-body">
                <figure><img alt={name} src={url} width="50%" height="auto" /></figure>
                <div className='flex justify-between'>
                    <h2 className="card-title">{name}</h2>
                    <p className="card-title flex justify-end">{price}&#x20AC;</p>
                </div>
                <p>{description}</p>
                <div className="card-actions justify-end">
                    <button
                        className="btn btn-primary"
                        onClick={add}>
                        Add to cart
                    </button>
                </div>
            </div>
        </div>
    )
}