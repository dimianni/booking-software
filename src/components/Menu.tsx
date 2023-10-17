"use client"

import React, { useState, useEffect } from 'react'
import { Product } from '@/types'
import axios from 'axios'
import UserProductCard from './cards/UserProductCard'
import Loader from './layouts/Loader'
import { useRouter } from 'next/navigation'
import { parseISO } from 'date-fns'
import { now } from '@/constants/config'
import ProductSkeleton from './layouts/ProductSkeleton'

type Props = {}

export default function Menu({ }: Props) {

  const router = useRouter()
  const [items, setItems] = useState<Product[] | null>(null)
  const [loading, setLoading] = useState<Boolean>(false)


  async function getItems() {
    const { data } = await axios.get('/api/dashboard/getItems')
    setItems(data.items)
  }

  useEffect(() => {
    setLoading(true)
    getItems()
    setLoading(false)

  }, [])

  useEffect(() => {
    const selectedTime = localStorage.getItem('selectedtime')
    if (!selectedTime) {
      router.push('/')
    } else {
      const date = parseISO(selectedTime)
      if (date < now) router.push('/')
    }
  }, [router])

  let catalogItems;

  if (!items) {
    catalogItems = (
      <ProductSkeleton />
    )
  } else if (items.length !== 0) {
    catalogItems = (
      <ul className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
        {items?.map((item, index) => {
          return (
            <li key={index} className='w-full'>
              <UserProductCard id={item.id} name={item.name} description={item.description} price={item.price} url={item.url} />
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
      <h1 className='text-center mb-3 font-bold'>Interested in our hair styling products?</h1>
      <div>
        {catalogItems}
      </div>
      
    </section>
  )
}