import React from 'react'

type Props = {}

export default function Footer({ }: Props) {
    return (
        <footer>
            <div className='w-full flex justify-center items-center'>
                <p>Made with &#10084;&#65039; by <a href="https://dimianni.github.io/">Dimianni</a></p>
            </div>
        </footer>
    )
}