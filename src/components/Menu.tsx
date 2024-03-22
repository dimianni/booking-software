"use client"

import React, { useState, useEffect } from 'react'
import { Product } from '@/types'
import axios from 'axios'
import UserProductCard from './cards/UserProductCard'
import { useRouter } from 'next/navigation'
import { parseISO } from 'date-fns'
import { now } from '@/constants/config'
import ProductSkeleton from './layouts/ProductSkeleton'
import CardLayout from './layouts/CardLayout'

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
      <CardLayout>
        {items?.map((item, index) => {
          return (
            <li key={index} className='w-full'>
              <UserProductCard id={item.id} name={item.name} description={item.description} price={item.price} url={item.url} />
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
      <div className='mb-6'>
        <h1 className='text-center mb-3 font-bold'>Great! 🎉</h1>
        <h1 className='text-center mb-3 font-bold'>Please proceed to the cart to finalize the booking!</h1>
      </div>

      <h1 className='text-center mb-3 font-bold'>Interested in our hair styling products?</h1>
      <div>
        {catalogItems}
      </div>
    </section>
  )
}