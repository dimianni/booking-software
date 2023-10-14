"use client"

import React, { useState, useEffect } from 'react'
import { Product } from '@/types'
import axios from 'axios'
import UserProductCard from './cards/UserProductCard'
import Loader from './layouts/Loader'
import { useRouter } from 'next/navigation'
import { parseISO } from 'date-fns'
import { now } from '@/constants/config'

type Props = {}

export default function Menu({ }: Props) {

  const router = useRouter()
  const [items, setItems] = useState<Product[] | null>(null)

  async function getItems() {
    const { data } = await axios.get('/api/dashboard/getItems')
    setItems(data.items)
  }

  useEffect(() => {
    getItems()
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
    catalogItems = <Loader />
  } else if (items.length !== 0) {
    catalogItems = (
      <ul className='w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8'>
        {items?.map((item, index) => {
          return (
            <li key={index} className='w-full'>
              <UserProductCard name={item.name} description={item.description} price={item.price} url={item.url} />
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
      <h1 className='text-center mb-3 font-bold'>Menu</h1>
      <div>
        {catalogItems}
      </div>
    </section>
  )
}