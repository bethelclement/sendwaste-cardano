'use client'

import { useState } from 'react'
import { useWallet } from '@/lib/cardano/WalletContext'
import { Factory, Package, TrendingUp, BarChart3, Coins, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface MaterialInventory {
    type: string
    icon: string
    available: number
    price: number
    color: string
}

const INVENTORY: MaterialInventory[] = [
    { type: 'PET Bottles', icon: '🥤', available: 487, price: 250, color: '#3b82f6' },
    { type: 'Aluminum Cans', icon: '🥫', available: 234, price: 350, color: '#6b7280' },
    { type: 'E-Waste', icon: '📱', available: 89, price: 1500, color: '#eab308' },
    { type: 'Organic', icon: '🥬', available: 156, price: 100, color: '#10b981' },
    { type: 'Nylon/Plastic', icon: '🛍️', available: 312, price: 200, color: '#a855f7' },
]

const WEEKLY_DATA = [
    { day: 'Mon', kg: 45 },
    { day: 'Tue', kg: 67 },
    { day: 'Wed', kg: 52 },
    { day: 'Thu', kg: 89 },
    { day: 'Fri', kg: 73 },
    { day: 'Sat', kg: 112 },
    { day: 'Sun', kg: 95 },
]

export default function RecyclerPage() {
    const { connected } = useWallet()
    const [cart, setCart] = useState<{ [key: string]: number }>({})

    const recyclerStats = {
        monthlyPurchases: '2,450 kg',
        tokensRedeemed: '84,500',
        activeSuppliers: 34,
        avgCostPerKg: '₦285',
    }

    const addToCart = (type: string, kg: number) => {
        setCart({ ...cart, [type]: (cart[type] || 0) + kg })
    }

    const getTotalCost = () => {
        return Object.entries(cart).reduce((total, [type, qty]) => {
            const item = INVENTORY.find(i => i.type === type)
            return total + (item ? item.price * qty : 0)
        }, 0)
    }

    if (!connected) {
        return (
            <div className="max-w-2xl mx-auto text-center py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-12 rounded-3xl shadow-2xl"
                >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center glow">
                        <Factory className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-display font-bold mb-4">Recycler Portal</h2>
                    <p className="text-muted-foreground text-lg mb-6">
                        Connect your wallet to access material sourcing and analytics
                    </p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-display font-bold mb-2">Recycler Portal</h1>
                <p className="text-xl text-muted-foreground">Source materials, redeem tokens, track supply</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass p-6 rounded-xl text-center border-2 border-purple-500/30">
                    <p className="text-3xl font-bold text-purple-600">{recyclerStats.monthlyPurchases}</p>
                    <p className="text-sm text-muted-foreground mt-1">Monthly Sourced</p>
                </div>
                <div className="glass p-6 rounded-xl text-center border-2 border-yellow-500/30">
                    <p className="text-3xl font-bold text-yellow-600">{recyclerStats.tokensRedeemed}</p>
                    <p className="text-sm text-muted-foreground mt-1">Tokens Redeemed</p>
                </div>
                <div className="glass p-6 rounded-xl text-center border-2 border-green-500/30">
                    <p className="text-3xl font-bold text-green-600">{recyclerStats.activeSuppliers}</p>
                    <p className="text-sm text-muted-foreground mt-1">Active Collectors</p>
                </div>
                <div className="glass p-6 rounded-xl text-center border-2 border-blue-500/30">
                    <p className="text-3xl font-bold text-blue-600">{recyclerStats.avgCostPerKg}</p>
                    <p className="text-sm text-muted-foreground mt-1">Avg Cost/kg</p>
                </div>
            </div>

            {/* Material Inventory */}
            <div className="glass p-8 rounded-2xl shadow-xl">
                <h2 className="text-2xl font-display font-bold mb-6 flex items-center space-x-2">
                    <Package className="w-6 h-6 text-green-600" />
                    <span>Available Material Inventory</span>
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {INVENTORY.map((item) => (
                        <motion.div
                            key={item.type}
                            whileHover={{ scale: 1.05 }}
                            className="glass p-6 rounded-xl border-2 border-border hover:border-primary/50 transition-all"
                        >
                            <div className="text-4xl mb-3 text-center">{item.icon}</div>
                            <h3 className="font-bold text-center mb-2">{item.type}</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Available:</span>
                                    <span className="font-semibold" style={{ color: item.color }}>{item.available} kg</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Price:</span>
                                    <span className="font-semibold">₦{item.price}/kg</span>
                                </div>
                                <button
                                    onClick={() => addToCart(item.type, 10)}
                                    className="w-full mt-3 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-all text-sm font-semibold"
                                    style={{ backgroundColor: item.color }}
                                >
                                    Add 10kg
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Shopping Cart */}
                <div className="glass p-8 rounded-2xl shadow-xl">
                    <h2 className="text-2xl font-display font-bold mb-6 flex items-center space-x-2">
                        <ShoppingCart className="w-6 h-6 text-orange-600" />
                        <span>Purchase Cart</span>
                    </h2>

                    {Object.keys(cart).length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>Cart is empty. Add materials to get started.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {Object.entries(cart).map(([type, qty]) => {
                                const item = INVENTORY.find(i => i.type === type)
                                if (!item) return null

                                return (
                                    <div key={type} className="flex items-center justify-between p-4 rounded-lg bg-accent">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-2xl">{item.icon}</span>
                                            <div>
                                                <p className="font-semibold">{type}</p>
                                                <p className="text-sm text-muted-foreground">{qty} kg × ₦{item.price}</p>
                                            </div>
                                        </div>
                                        <p className="text-lg font-bold">₦{(qty * item.price).toLocaleString()}</p>
                                    </div>
                                )
                            })}

                            <div className="border-t pt-4 mt-4">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xl font-bold">Total:</span>
                                    <span className="text-3xl font-bold text-primary">₦{getTotalCost().toLocaleString()}</span>
                                </div>

                                <button className="w-full btn-primary flex items-center justify-center space-x-2">
                                    <Coins className="w-5 h-5" />
                                    <span>Redeem with WASTE Tokens</span>
                                </button>

                                <p className="text-sm text-center text-muted-foreground mt-3">
                                    = {Math.ceil(getTotalCost() / 50)} WASTE tokens
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Analytics */}
                <div className="glass p-8 rounded-2xl shadow-xl">
                    <h2 className="text-2xl font-display font-bold mb-6 flex items-center space-x-2">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                        <span>Weekly Material Flow</span>
                    </h2>

                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={WEEKLY_DATA}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                            <XAxis dataKey="day" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip
                                contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px' }}
                                labelStyle={{ color: '#fff' }}
                            />
                            <Bar dataKey="kg" fill="hsl(var(--primary-green))" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>

                    <div className="mt-6 grid grid-cols-3 gap-4">
                        <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                            <p className="text-2xl font-bold text-green-600">533</p>
                            <p className="text-xs text-muted-foreground">Weekly Total kg</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                            <p className="text-2xl font-bold text-blue-600">76</p>
                            <p className="text-xs text-muted-foreground">Avg Daily kg</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                            <p className="text-2xl font-bold text-purple-600">↑ 23%</p>
                            <p className="text-xs text-muted-foreground">vs Last Week</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Material Distribution */}
            <div className="glass rounded-2xl shadow-xl">
                <h2 className="text-2xl font-display font-bold p-8 pb-4 flex items-center space-x-2">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                    <span>Material Type Distribution</span>
                </h2>

                <div className="flex items-center justify-center p-8">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={INVENTORY.map(item => ({ name: item.type, value: item.available }))}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {INVENTORY.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
