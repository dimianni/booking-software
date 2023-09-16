import React from 'react'
import Logo from './Logo'

type Props = {}

export default function Header({ }: Props) {
    return (
        <header className="sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-all duration-100 bg-base-100 text-base-content shadow-sm">
            <div className="container flex h-16 items-center prose-headings:text-xl">
                <Logo />
            </div>
        </header>
    )
}