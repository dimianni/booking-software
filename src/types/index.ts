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

export interface CartContextType {
    productsInCart: { id: string; quantity: number }[];
    addToCart: (id: string, quantity: number) => void;
    removeFromCart: (id: string) => void;
};