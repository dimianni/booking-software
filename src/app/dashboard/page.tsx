import Link from 'next/link'
import React from 'react'

type Props = {}

export default function dashboard({}: Props) {
  return (
    <div>
      <h1>Dashboard</h1>
      <div className='w-full flex justify-center'>
        <div className='m-3 underline'>
          <Link href="/dashboard/opening">Opening Hours</Link>
        </div>
        <div className='m-3 underline'>
          <Link href="/dashboard/catalog">Catalog</Link>
        </div>
      </div>
    </div>
  )
}