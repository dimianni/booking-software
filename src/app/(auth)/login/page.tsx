import LoginForm from '@/components/forms/LoginForm'
import React from 'react'

type Props = {}

export default function login({}: Props) {
  return (
    <div className='w-full flex justify-center items-center pt-36'>
      <LoginForm />
    </div>
  )
}