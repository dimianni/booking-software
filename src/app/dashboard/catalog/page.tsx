"use client"

import React, { useEffect, useState } from 'react'
import { Product } from '@/types'
import axios from 'axios'
import AdminProductCard from '@/components/cards/AdminProductCard'
import AddProductForm from '@/components/forms/AddProductForm'

type Props = {}

export default function catalog({ }: Props) {

  const [items, setItems] = useState<Product[] | null>(null)

  async function getItems() {
    const { data } = await axios.get('/api/dashboard/getItems')
    console.log("getItems");
    
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
              <AdminProductCard getItems={getItems} name={item.name} description={item.description} price={item.price} url={item.url} id={item.id} imageKey={item.imageKey} />
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
        <AddProductForm getItems={getItems} />
      </div>
      <div className='flex flex-col justify-center items-center'>
        <h1 className='text-center mb-3 font-bold'>Catalog</h1>
        {catalogItems}
      </div>
    </section>
  )
}