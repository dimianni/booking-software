"use client"

import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'

type Props = {}

interface Errors {
    email?: string
    password?: string
}

const initialErrors = {
    email: '',
    password: ''
}

export default function LoginForm({ }: Props) {

    const router = useRouter()

    const [input, setInput] = useState({
        email: '',
        password: ''
    })
    const [formErrors, setFormErrors] = useState<Errors>(initialErrors)


    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setInput(prev => ({ ...prev, [name]: value }))
    }

    async function handleLogin() {
        try {
            const errors: Errors = {}
            if (input.email === '') {
                errors.email = "Email is required!"
            }
            if (input.password === '') {
                errors.password = "Password is required!"
            }
            if (Object.keys(errors).length > 0) {
                setFormErrors(errors)
                return
            }
            setFormErrors(initialErrors)

            const { data } = await axios.post('/api/auth/login', input);
            const { message, success } = await data;

            if (success) {
                router.push("/dashboard")
            }

        } catch (error) {
            const errorMessage = (error as Error).message
            console.log(errorMessage);
        }
    }

    function handleEnterKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            handleLogin()
        }
    }

    useEffect(() => {
        console.log(input, formErrors);
    }, [input])

    return (
        <div className='w-96 flex flex-col'>
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Email address</span>
                </label>
                <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    onChange={handleChange}
                    onKeyPress={handleEnterKeyPress}
                    value={input.email}
                    className="input input-bordered w-full"
                />
                {formErrors.email && (<label className="label">
                    <span className="label-text-alt text-red-500">{formErrors.email}</span>
                </label>)}
            </div>
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Password</span>
                </label>
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    onKeyPress={handleEnterKeyPress}
                    value={input.password}
                    className="input input-bordered w-full"
                />
                {formErrors.password && (<label className="label">
                    <span className="label-text-alt text-red-500">{formErrors.password}</span>
                </label>)}
            </div>
            <button className='btn mt-12' onClick={handleLogin}>Log in</button>
        </div>
    )
}