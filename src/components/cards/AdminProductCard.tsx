import axios from 'axios'
import React from 'react'

interface AdminProductCardProps {
    getItems: () => void
    id?: string
    name: string
    url: string
    price: number
    description: string
    imageKey?: string
}

export default function AdminProductCard({ getItems, id, name, url, price, description, imageKey }: AdminProductCardProps) {


    async function deleteCatalogItem(){
        const response = await axios.post('/api/dashboard/deleteItem', {
            id: id,
            imageKey: imageKey
        })
        getItems()
    }

    return (
        <div className="card w-full bg-base-100 shadow-xl">
            <div className="card-body">
                <div className="card-actions justify-end">
                    <button onClick={deleteCatalogItem} className="btn btn-square btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <figure><img alt={name} src={url} width="50%" height="auto" /></figure>
                <div className='flex justify-between'>
                    <h2 className="card-title">{name}</h2>
                    <p className="card-title flex justify-end">{price}&#x20AC;</p>
                </div>
                <p>{description}</p>
            </div>
        </div>
    )
}