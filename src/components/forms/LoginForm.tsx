"use client"

import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type Props = {}

export default function LoginForm({ }: Props) {

    const router = useRouter()

    const [input, setInput] = useState({
        email: '',
        password: ''
    })

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setInput(prev => ({ ...prev, [name]: value }))
    }

    async function handleLogin(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();

        try {
            const { data } = await axios.post('/api/auth/login', input);            
            const { message, success } = await data;

            if (success){
                router.push("/dashboard")
            }

        } catch (error) {
            const errorMessage = (error as Error).message
            console.log(errorMessage);
        }
    }

    return (
        <div>
            <div className='flex flex-col'>
                <div className="form-control w-full max-w-xs">
                    <label className="label">
                        <span className="label-text">Email address</span>
                    </label>
                    <input type="email" name="email" placeholder="Email address" onChange={handleChange} value={input.email} className="input input-bordered w-full max-w-xs" />
                </div>
                <div className="form-control w-full max-w-xs">
                    <label className="label">
                        <span className="label-text">Password</span>
                    </label>
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} value={input.password} className="input input-bordered w-full max-w-xs" />
                </div>
                <button className='btn' onClick={handleLogin}>Log in</button>
            </div>
        </div>
    )
}