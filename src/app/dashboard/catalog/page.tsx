"use client"

import React, { useEffect, useState } from 'react'
import { Product } from '@/types'
import axios from 'axios'
import AdminProductCard from '@/components/cards/AdminProductCard'
import AddProductForm from '@/components/forms/AddProductForm'
import CardLayout from '@/components/layouts/CardLayout'
import ProductSkeleton from '@/components/layouts/ProductSkeleton'

type Props = {}

export default function catalog({ }: Props) {

  const [items, setItems] = useState<Product[] | null>(null)

  async function getItems() {
    const { data } = await axios.get('/api/dashboard/getItems')    
    setItems(data.items)
  }

  useEffect(() => {
    getItems()
  }, [])

  let catalogItems;

  if (!items) {
    catalogItems = <ProductSkeleton />
  } else if (items.length !== 0) {
    catalogItems = (
      <CardLayout>
        {items?.map((item, index) => {
          return (
            <li key={index} className='w-full'>
              <AdminProductCard getItems={getItems} name={item.name} description={item.description} price={item.price} url={item.url} id={item.id} imageKey={item.imageKey} />
            </li>
          )
        })}
      </CardLayout>
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