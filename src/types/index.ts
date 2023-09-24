export interface Booking {
    date: Date | null
    dateTime: Date | null
}

export interface Product {
    name: string
    description: string
    price: number
    image: File | null,
    url: string
}