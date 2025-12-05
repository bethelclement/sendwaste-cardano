import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Navigation } from '@/components/Navigation'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
})

export const metadata: Metadata = {
    title: 'SendWaste Cardano - Blockchain Waste Recovery',
    description: 'Transparent waste-to-value platform powered by Cardano blockchain. Track, verify, and reward waste recovery in Nigerian communities.',
    keywords: ['blockchain', 'waste management', 'recycling', 'Cardano', 'Nigeria', 'circular economy'],
    authors: [{ name: 'SendWaste Team' }],
    openGraph: {
        title: 'SendWaste Cardano',
        description: 'Building regenerative waste systems with blockchain accountability',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
            <body className="min-h-screen mesh-gradient">
                <Providers>
                    <Navigation />
                    <main className="container mx-auto px-4 py-8">
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    )
}
