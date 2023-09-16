import React from 'react'

type Props = {}

export default function Footer({ }: Props) {
    return (
        <footer className='w-full py-6'>
            <div className='w-full flex justify-center items-center'>
                <p className='prose-sm'>Made with &#10084;&#65039; by <a className='underline' href="https://dimianni.github.io/">Dimianni</a></p>
            </div>
        </footer>
    )
}