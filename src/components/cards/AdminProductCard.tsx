import React from 'react'

interface AdminProductCardProps {
    name: string
    url: string
    price: number
    description: string
}

export default function AdminProductCard({ name, url, price, description }: AdminProductCardProps) {
    return (
        <div className="card w-full bg-base-100 shadow-xl">
            <figure className='p-8 pb-0'><img alt={name} src={url} width="50%" height="auto" /></figure>
            <div className="card-body">
                <div className='flex justify-between'>
                    <h2 className="card-title">{name}</h2>
                    <p className="card-title flex justify-end">{price}&#x20AC;</p>
                </div>
                <p>{description}</p>
            </div>
        </div>
    )
}