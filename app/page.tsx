'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Recycle, TrendingUp, Users, CheckCircle, ArrowRight, Sparkles } from 'lucide-react'

export default function HomePage() {
    const stats = [
        { label: 'Tonnes Verified', value: '12.4', target: '50', unit: 'T', color: 'from-green-500 to-emerald-600' },
        { label: 'Users Onboarded', value: '1,247', target: '5,000', unit: '', color: 'from-blue-500 to-cyan-600' },
        { label: 'Receipts Minted', value: '5,832', target: '30,000', unit: '', color: 'from-purple-500 to-pink-600' },
        { label: 'Blocked Drains Cleared', value: '23', target: '100', unit: '', color: 'from-orange-500 to-red-600' },
    ]

    const features = [
        {
            icon: Recycle,
            title: 'Transparent Recovery',
            description: 'Every waste drop-off creates an NFT receipt on Cardano blockchain - tamper-proof and verifiable.',
            gradient: 'from-green-400 to-green-600',
        },
        {
            icon: TrendingUp,
            title: 'Earn Rewards',
            description: '$WASTE tokens flow to collectors and households based on verified material recovery.',
            gradient: 'from-blue-400 to-blue-600',
        },
        {
            icon: Users,
            title: 'Community Impact',
            description: 'Join 1,200+ households, collectors, and recyclers building a circular economy in Abuja.',
            gradient: 'from-purple-400 to-purple-600',
        },
        {
            icon: CheckCircle,
            title: 'Real Data',
            description: 'Cities get trustworthy metrics - not estimates. Recovery volumes, locations, and timestamps.',
            gradient: 'from-orange-400 to-orange-600',
        },
    ]

    return (
        <div className="space-y-20">
            {/* Hero Section */}
            <section className="text-center space-y-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full gradient-accent text-white text-sm font-semibold mb-6 shadow-lg">
                        <Sparkles className="w-4 h-4" />
                        <span>DirectEd x CATS Hackathon 2025</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
                        <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Regenerating Urban Waste
                        </span>
                        <br />
                        <span className="text-foreground">With Real Accountability</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
                        SendWaste Cardano turns waste recovery into something <span className="font-semibold text-primary">provable</span>, <span className="font-semibold text-primary">traceable</span>, and <span className="font-semibold text-primary">rewarding</span>.
                        Building a regenerative loop for Abuja and Jos communities.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/household" className="btn-primary text-lg px-8 py-4">
                            Get Started →
                        </Link>
                        <Link href="/admin" className="btn-secondary text-lg px-8 py-4">
                            View Analytics
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="glass p-6 rounded-2xl border border-white/20 shadow-xl card-hover"
                    >
                        <div className={`inline-block px-3 py-1 rounded-lg bg-gradient-to-r ${stat.color} text-white text-xs font-semibold mb-3`}>
                            Goal: {stat.target}{stat.unit}
                        </div>
                        <h3 className="text-4xl font-bold mb-2 counter-animate">
                            {stat.value}
                            <span className="text-xl text-muted-foreground ml-1">{stat.unit}</span>
                        </h3>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000`}
                                style={{ width: `${(parseFloat(stat.value.replace(',', '')) / parseFloat(stat.target.replace(',', ''))) * 100}%` }}
                            />
                        </div>
                    </motion.div>
                ))}
            </section>

            {/* Features Grid */}
            <section className="space-y-8">
                <div className="text-center">
                    <h2 className="text-4xl font-display font-bold mb-4">How It Works</h2>
                    <p className="text-xl text-muted-foreground">Blockchain-verified waste recovery in four simple features</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="glass p-8 rounded-2xl border-2 border-transparent hover:border-primary/30 
                         shadow-xl hover:shadow-2xl transition-all duration-300 group"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} 
                              flex items-center justify-center mb-4 group-hover:scale-110 
                              transition-transform duration-300 glow`}>
                                    <Icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-display font-bold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                            </motion.div>
                        )
                    })}
                </div>
            </section>

            {/* CTA Section */}
            <section className="glass p-12 rounded-3xl border border-white/20 shadow-2xl text-center gradient-border">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-6"
                >
                    <h2 className="text-4xl font-display font-bold">Choose Your Role</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Whether you generate waste, collect materials, or run a recycling hub - there's a place for you in the SendWaste ecosystem.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <Link href="/household" className="glass p-6 rounded-xl hover:scale-105 transition-transform duration-200 group border-2 border-green-500/20 hover:border-green-500">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center glow">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Household</h3>
                            <p className="text-sm text-muted-foreground">Submit waste, earn rewards</p>
                            <ArrowRight className="w-5 h-5 mx-auto mt-3 text-primary group-hover:translate-x-2 transition-transform" />
                        </Link>

                        <Link href="/collector" className="glass p-6 rounded-xl hover:scale-105 transition-transform duration-200 group border-2 border-blue-500/20 hover:border-blue-500">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center glow">
                                <Recycle className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Collector</h3>
                            <p className="text-sm text-muted-foreground">Verify pickups, mint receipts</p>
                            <ArrowRight className="w-5 h-5 mx-auto mt-3 text-primary group-hover:translate-x-2 transition-transform" />
                        </Link>

                        <Link href="/recycler" className="glass p-6 rounded-xl hover:scale-105 transition-transform duration-200 group border-2 border-purple-500/20 hover:border-purple-500">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center glow">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Recycler</h3>
                            <p className="text-sm text-muted-foreground">Source materials, redeem tokens</p>
                            <ArrowRight className="w-5 h-5 mx-auto mt-3 text-primary group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Problem Statement */}
            <section className="max-w-4xl mx-auto space-y-6 text-center">
                <h2 className="text-3xl font-display font-bold">Why SendWaste?</h2>
                <div className="glass p-8 rounded-2xl border border-white/20 shadow-xl text-left">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        Urban centres in Nigeria generate <span className="font-semibold text-foreground">over 32 million tonnes</span> of waste annually,
                        with <span className="font-semibold text-foreground">70% ending up in open dumps</span>. Plastic waste blocks drainage systems in Abuja estates
                        and low-income communities, contributing to flooding and disease outbreaks.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        Studies from NESREA show plastic contributes to <span className="font-semibold text-error">17% of urban drain blockage incidents</span> annually.
                        The economy loses <span className="font-semibold text-foreground">over $500 million</span> in recyclable value each year.
                    </p>
                    <p className="font-semibold text-primary text-lg">
                        ✅ SendWaste closes this gap with transparent, blockchain-verified proof of recovery that nobody can alter.
                    </p>
                </div>
            </section>
        </div>
    )
}
