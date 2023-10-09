export interface Booking {
    date: Date | null
    dateTime: Date | null
}

export interface Product {
    id?: string
    name: string
    description: string
    price: number
    image: File | null,
    url: string
    imageKey?: string
}