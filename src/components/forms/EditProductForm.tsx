import axios from 'axios'
import React, { useState } from 'react'
import Loader from '../layouts/Loader'

const initialErrors = {
    name: '',
    description: '',
    price: ''
}

interface Errors {
    name?: string
    description?: string
    price?: string
}

interface EditProductFormProps {
    id?: string
    name?: string
    description?: string
    price?: number | string
    setIsEditMode: (value: boolean) => void,
    getItems: () => void
}


export default function EditProductForm({ id, name, description, price, setIsEditMode, getItems }: EditProductFormProps) {

    const [input, setInput] = useState({ name, description, price })
    const [formErrors, setFormErrors] = useState<Errors>(initialErrors)
    const [saving, setSaving] = useState(false)


    function handleInputChange(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) {
        const { name, value } = e.target
        setInput(prev => ({ ...prev, [name]: value }))
    }

    async function editCatalogItem() {

        setSaving(true)
        const errors: Errors = {}

        if (input.name === '') {
            errors.name = "Product name is required!"
        }
        if (input.price === '') {
            errors.price = "Product price is required!"
        }
        if (input.description === '') {
            errors.description = "Product description is required!"
        }
        
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            setSaving(false)
            return
        }

        setFormErrors(initialErrors)

        const response = await axios.post('/api/dashboard/updateItem', { 
            id: id,
            name: input.name,
            description: input.description,
            price: parseInt(input.price!.toString()),
        })


        setFormErrors(initialErrors)
        setSaving(false)
        setIsEditMode(false)
        getItems()
    }

    return (
        <div className='w-full'>
            {/* Edit Product Name */}
            <div className="form-control w-full max-w-xs mr-3">
                <input
                    type="text"
                    placeholder="Product name"
                    name="name"
                    id="name"
                    className="input input-bordered w-full max-w-xs"
                    value={input.name}
                    onChange={handleInputChange}
                />
                {formErrors.name && (<label className="label">
                    <span className="label-text-alt text-red-500">{formErrors.name}</span>
                </label>)}
            </div>

            {/* Edit Product Price */}
            <div className="form-control w-full max-w-xs">
                <input
                    type="text"
                    placeholder="Product price (€)"
                    name="price"
                    id="price"
                    className="input input-bordered w-full max-w-xs"
                    value={input.price}
                    onChange={handleInputChange}
                />
                {formErrors.price && (<label className="label">
                    <span className="label-text-alt text-red-500">{formErrors.price}</span>
                </label>)}
            </div>

            {/* Edit Product Description */}
            <div className="w-full form-control mb-6">
                <textarea
                    className="textarea textarea-bordered h-24"
                    name="description"
                    id="description"
                    placeholder="Product description"
                    value={input.description}
                    onChange={handleInputChange}
                />
                {formErrors.description && (<label className="label">
                    <span className="label-text-alt text-red-500">{formErrors.description}</span>
                </label>)}
            </div>

            {/* Save Changes button */}
            <div className='flex justify-end'>
                <button className='btn btn-primary' onClick={editCatalogItem}>
                    {saving ? (<Loader />) : "Save"}
                </button>
            </div>
        </div>
    )
}