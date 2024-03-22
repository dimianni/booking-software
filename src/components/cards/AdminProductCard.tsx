import axios from 'axios'
import React, { useState } from 'react'
import { FiEdit } from 'react-icons/fi'
import { BsCheckLg } from 'react-icons/bs'
import EditProductForm from '../forms/EditProductForm'


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

    const [isEditMode, setIsEditMode] = useState<Boolean>(false)

    async function deleteCatalogItem() {
        const response = await axios.post('/api/dashboard/deleteItem', {
            id: id,
            imageKey: imageKey
        })

        // Pull catalog items again upon delete
        getItems()
    }

    return (
        <div className="card w-full bg-base-100 shadow-xl relative">
            <div className="card-actions absolute top-3 right-4 flex flex-col gap-2">
                <div className="tooltip" data-tip={`${id === "haircut" ? "Cannot be deleted!" : "Delete"}`}>
                    <button onClick={deleteCatalogItem} className={`btn btn-square btn-sm ${id === "haircut" && "btn-disabled"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <button className="btn btn-square btn-sm" onClick={() => setIsEditMode(true)}>
                    <FiEdit />
                </button>
            </div>
            <div className='bg-white p-5 rounded-t-box'>
                <figure><img alt={name} src={url} width="50%" height="auto" /></figure>
            </div>

            <div className="card-body pt-5">
                {
                    isEditMode ? (
                        <EditProductForm id={id} name={name} description={description} price={price} setIsEditMode={setIsEditMode} getItems={getItems} />
                    ) : (
                        <div>
                            <h2 className="card-title">{name}</h2>
                            <p className="card-title">{price}&#x20AC;</p>
                            <p>{description}</p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}