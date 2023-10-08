"use client"

import React, { useEffect, useState } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { Product } from '@/types'
import { MAX_FILE_SIZE } from '@/constants/config'
import axios from 'axios'
import Image from 'next/image'

type Props = {}

const initialInput = {
  name: '',
  description: '',
  price: 0,
  image: null,
  url: ''
}

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

export default function catalog({ }: Props) {

  const [input, setInput] = useState<Product>(initialInput)
  const [error, setError] = useState<string>('')
  const [formErrors, setFormErrors] = useState<Errors>(initialErrors)
  const [items, setItems] = useState<Product[] | null>(null)
  const [uploading, setUploading] = useState(false)

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = e.target
    setInput(prev => ({ ...prev, [name]: value }))
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return setError('No file selected!')
    if (e.target.files[0].size > MAX_FILE_SIZE) return setError('Image size is over 5MB!')
    setInput((prev) => ({ ...prev, image: e.target.files![0] }))
  }

  async function handleImageUpload() {
    const { image } = input

    if (!image) {
      setError('No file selected!')
      return
    }
    // Creating a special S3 URL to which we can upload the image
    const { data } = await axios.post('/api/dashboard/S3', {
      fileType: image.type,
      fileName: image.name
    })
    const { url, key } = await data

    await axios.put(url, image, {
      headers: {
        "Content-type": image.type,
        "Access-Control-Allow-Origin": "*",
      },
    });

    return key
  }

  async function addcatalogItem() {
    const key = await handleImageUpload()
    if (!key) throw new Error('No key')


    const errors: Errors = {}

    if (input.name === '') {
      errors.name = "Product name is required!"
    }
    if (input.price === 0) {
      errors.price = "Product price is required!"
    }
    if (input.description === '') {
      errors.description = "Product description is required!"
    }

    if(Object.keys(errors).length > 0){
      setFormErrors(errors)
      return
    }

    setUploading(true)
    setError('')
    setFormErrors(initialErrors)

    // Adding item to DB
    const response = await axios.post('/api/dashboard/addItem', {
      name: input.name,
      description: input.description,
      price: parseInt(input.price.toString()),
      imageKey: key
    })

    getItems()
    setUploading(false)
    // Reset input
    setInput(initialInput)
  }

  async function getItems() {
    const { data } = await axios.get('/api/dashboard/getItems')
    setItems(data.items)
  }

  useEffect(() => {
    getItems()
  }, [])

  let catalogItems;

  if (!items) {
    catalogItems = <div className="loading loading-spinner loading-lg"></div>
  } else if (items.length !== 0) {
    catalogItems = (
      <ul className='w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8'>
        {items?.map((item, index) => {
          return (
            <li key={index} className='w-full'>
              <div className="card w-full bg-base-100 shadow-xl">
                <figure className='p-8 pb-0'><img alt={item?.name} src={item?.url} width="50%" height="auto" /></figure>
                <div className="card-body">
                  <div className='flex justify-between'>
                    <h2 className="card-title">{item?.name}</h2>
                    <p className="card-title flex justify-end">{item?.price}&#x20AC;</p>
                  </div>
                  <p>{item?.description}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    )
  } else {
    catalogItems = <p>No products found.</p>
  }

  return (
    <section>
      <div className='mb-8'>
        <h1 className='text-center mb-3 font-bold'>Add Item</h1>
        <div className='w-full md:w-11/12 lg:w-4/6 xl:w-3/5 mx-auto'>

          <div className="w-full flex justify-between mb-3">
            {/* Product Name */}
            <div className="form-control w-full max-w-xs mr-3">
              <label className="label">
                <span className="label-text">What is the product name?</span>
              </label>
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

            {/* Product Price */}
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">What is the product price?</span>
              </label>
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
          </div>

          {/* Product Description */}
          <div className="w-full form-control mb-6">
            <label className="label">
              <span className="label-text">What is the product description?</span>
            </label>
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

          {/* Product Image */}
          <div className="w-full mb-6">
            <label
              className="flex justify-center w-full h-32 px-4 transition bg-transparent border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
              <span className="flex items-center space-x-2">
                <AiOutlineCloudUpload />
                <span>
                  <span>Drag & Drop the image or </span>
                  <span className="text-info underline">select image</span>
                  <span> to upload</span>
                </span>
              </span>
              <input
                type="file"
                name="image"
                id="image"
                accept='image/jpg image/png image/jpeg'
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            {error && (<label className="label">
              <span className="label-text-alt text-red-500">{error}</span>
            </label>)}
          </div>

          <div className='flex justify-end'>
            <button className='btn btn-primary' onClick={addcatalogItem}>
              {uploading ? (<div className="loading loading-spinner loading-lg"></div>) : "Add item"}
            </button>
          </div>

        </div>
      </div>
      <div className='flex flex-col justify-center items-center'>
        <h1 className='text-center mb-3 font-bold'>Catalog</h1>
        {catalogItems}
      </div>
    </section>
  )
}