'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, User, Truck, Factory, BarChart3, Wallet } from 'lucide-react'
import { useWallet } from '@/lib/cardano/WalletContext'
import { WalletConnect } from './WalletConnect'

export function Navigation() {
    const pathname = usePathname()
    const { connected, walletAddress } = useWallet()

    const navItems = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/household', label: 'Household', icon: User },
        { href: '/collector', label: 'Collector', icon: Truck },
        { href: '/recycler', label: 'Recycler', icon: Factory },
        { href: '/admin', label: 'Analytics', icon: BarChart3 },
    ]

    return (
        <nav className="glass sticky top-0 z-50 border-b border-white/10">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 rounded-lg gradient-neon flex items-center justify-center glow-neon shadow-2xl">
                            <span className="text-white text-xl font-bold animate-float">♻️</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-display font-bold bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-600 bg-clip-text text-transparent">
                                SendWaste
                            </h1>
                            <p className="text-xs text-muted-foreground font-semibold">Cardano Powered</p>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                    ${isActive
                                            ? 'bg-primary text-white shadow-lg'
                                            : 'text-foreground/70 hover:text-foreground hover:bg-accent'
                                        }
                  `}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Wallet Connection */}
                    <div className="flex items-center space-x-4">
                        {connected && walletAddress && (
                            <div className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-lg bg-accent/50 border border-primary/20">
                                <Wallet className="w-4 h-4 text-primary" />
                                <span className="text-sm font-mono text-foreground/80">
                                    {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
                                </span>
                            </div>
                        )}
                        <WalletConnect />
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden flex items-center justify-around py-2 border-t border-white/10">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                  flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all
                  ${isActive ? 'text-primary' : 'text-foreground/50'}
                `}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-xs">{item.label}</span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}
