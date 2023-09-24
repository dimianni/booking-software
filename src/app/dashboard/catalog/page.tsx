"use client"

import React, { useEffect, useState } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { Product } from '@/types'
import { MAX_FILE_SIZE } from '@/constants/config'
import axios from 'axios'

type Props = {}

const initialInput = {
  name: '',
  description: '',
  price: 0,
  image: null
}

export default function catalog({ }: Props) {

  const [input, setInput] = useState<Product>(initialInput)
  const [error, setError] = useState<string>('')
  const [items, setItems] = useState<Product[]>([])

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

    if (!image) return

    // Creating a special S3 URL to which we can upload the image
    const { data } = await axios.post('/api/dashboard/S3', { fileType: image.type })
    const { url, fields, key } = await data

    const imgObject = {
      ...fields,
      'Content-Type': image.type,
      image
    }

    const formData = new FormData()
    Object.entries(imgObject).forEach(([key, value]) => {
      formData.append(key, value as any)
    })

    await fetch(url, {
      method: 'POST',
      body: formData
    })

    return key
  }

  async function addcatalogItem() {
    // const key = await handleImageUpload()
    // if (!key) throw new Error('No key')

    // Adding item to DB
    const response = await axios.post('/api/dashboard/addItem', {
      name: input.name,
      description: input.description,
      price: parseInt(input.price.toString()),
      imageKey: ''
    })

    console.log(response);


    getItems()
    // // Reset input
    // setInput(initialInput)
  }

  async function getItems() {
    const { data } = await axios.get('/api/dashboard/getItems')
    setItems(data.items)
  }

  useEffect(() => {
    getItems()
  }, [])

  return (
    <section>
      <div>
        <h2>Add Item</h2>
        <div>
          {/* Product Name */}
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">What is the product name?</span>
            </label>
            <input
              type="text"
              placeholder="Product name"
              name="name"
              id="name"
              className="input input-bordered w-full max-w-xs"
              onChange={handleInputChange}
            />
          </div>

          {/* Product Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">What is the product description?</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24"
              name="description"
              id="description"
              placeholder="Product description"
              onChange={handleInputChange}
            />
          </div>

          {/* Product Price */}
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">What is the product price?</span>
            </label>
            <input
              type="text"
              placeholder="Product price"
              name="price"
              id="price"
              className="input input-bordered w-full max-w-xs"
              onChange={handleInputChange}
            />
          </div>

          <div className="max-w-xl">
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
          </div>

          <button onClick={addcatalogItem}>Add item</button>

        </div>
      </div>
      <div>
        <h2>Catalog</h2>
        <ul>
          {items?.map((item, index) => {
            return (
              <li key={index}>{item.name}</li>
            )
          })}
        </ul>

      </div>
    </section>
  )
}