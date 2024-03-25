import './globals.css'
import './Calendar.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/layouts/Header'
import Footer from '@/components/layouts/Footer'
import CartProvider from '@/contexts/CartContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Barbershop Booking Software',
  description: 'Barbershop Booking Software app is a solution designed to streamline the process of managing appointments and sales of hairstyling products for barbershops.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Suggest using theme-change: https://github.com/saadeghi/theme-change
    <html lang="en" data-theme="dark">
      <body className={`${inter.className} bg-neutral min-h-screen prose-h1:text-lg prose-h2:text-md`}>
        <CartProvider>
          <Header />
          <div className="container mx-auto min-h-screen pt-6">
            <main>
              {children}
            </main>
          </div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
