import Footer from "@/components/layouts/Footer"
import Header from "@/components/layouts/Header"

interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    return (
        <>
            <Header />
            <div className="container mx-auto">
                <main>
                    {children}
                </main>
            </div>
            <Footer />
        </>

    )
}