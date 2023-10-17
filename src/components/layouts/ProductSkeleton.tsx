import React from 'react'

type Props = {}

export default function ProductSkeleton({ }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 animate-pulse">
            <div className="w-full ">
                <div className="w-full h-64 bg-gray-300 rounded-lg md:h-72 dark:bg-gray-600"></div>
                <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
            </div>

            <div className="w-full ">
                <div className="w-full h-64 bg-gray-300 rounded-lg md:h-72 dark:bg-gray-600"></div>
                <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
            </div>

            <div className="w-full ">
                <div className="w-full h-64 bg-gray-300 rounded-lg md:h-72 dark:bg-gray-600"></div>
                <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
            </div>
        </div>
    )
}