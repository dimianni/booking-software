interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    return (
        <div className="container mx-auto min-h-screen pt-6">
            <main>
                {children}
            </main>
        </div>
    )
}