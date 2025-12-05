'use client'

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Users, Package, Coins, CheckCircle, AlertCircle } from 'lucide-react'

const WEEKLY_DATA = [
    { week: 'Week 1', tonnes: 2.3, users: 150, receipts: 340 },
    { week: 'Week 2', tonnes: 3.8, users: 287, receipts: 512 },
    { week: 'Week 3', tonnes: 5.1, users: 456, receipts: 728 },
    { week: 'Week 4', tonnes: 8.9, users: 834, receipts: 1456 },
    { week: 'Week 5', tonnes: 12.4, users: 1247, receipts: 2398 },
]

const WASTE_TYPES = [
    { name: 'PET Plastic', value: 487, color: '#3b82f6' },
    { name: 'Aluminum', value: 234, color: '#6b7280' },
    { name: 'E-Waste', value: 89, color: '#eab308' },
    { name: 'Organic', value: 156, color: '#10b981' },
    { name: 'Nylon', value: 312, color: '#a855f7' },
]

const COLLECTION_POINTS = [
    { name: 'Garki Zone 3', submissions: 245, status: 'active' },
    { name: 'Wuse 2', submissions: 189, status: 'active' },
    { name: 'Maitama', submissions: 156, status: 'active' },
    { name: 'Asokoro', submissions: 134, status: 'active' },
    { name: 'Gwarinpa', submissions: 198, status: 'active' },
    { name: 'Kubwa', submissions: 167, status: 'active' },
]

export default function AdminPage() {
    const hackathonGoals = {
        tonnes: { current: 12.4, target: 50, unit: 'T' },
        users: { current: 1247, target: 5000, unit: '' },
        receipts: { current: 5832, target: 30000, unit: '' },
    }

    const progress = {
        tonnes: (hackathonGoals.tonnes.current / hackathonGoals.tonnes.target) * 100,
        users: (hackathonGoals.users.current / hackathonGoals.users.target) * 100,
        receipts: (hackathonGoals.receipts.current / hackathonGoals.receipts.target) * 100,
    }

    return (
        <div className="max-w-[1600px] mx-auto space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-display font-bold mb-2">Analytics Dashboard</h1>
                <p className="text-xl text-muted-foreground">Real-time metrics for SendWaste Cardano Hackathon</p>
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm font-semibold mt-4">
                    <span>🎯 CATS Hackathon 2025 - December 6</span>
                </div>
            </div>

            {/* Hackathon Goals Progress */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="glass p-8 rounded-2xl shadow-xl border-2 border-green-500/30">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Tonnes Verified</h3>
                        <Package className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex items-baseline space-x-2 mb-3">
                        <span className="text-5xl font-bold text-green-600">{hackathonGoals.tonnes.current}</span>
                        <span className="text-xl text-muted-foreground">/ {hackathonGoals.tonnes.target}{hackathonGoals.tonnes.unit}</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden mb-2">
                        <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-1000"
                            style={{ width: `${progress.tonnes}%` }}
                        />
                    </div>
                    <p className="text-sm text-muted-foreground">{progress.tonnes.toFixed(1)}% of goal achieved</p>
                </div>

                <div className="glass p-8 rounded-2xl shadow-xl border-2 border-blue-500/30">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Users Onboarded</h3>
                        <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex items-baseline space-x-2 mb-3">
                        <span className="text-5xl font-bold text-blue-600">{hackathonGoals.users.current.toLocaleString()}</span>
                        <span className="text-xl text-muted-foreground">/ {hackathonGoals.users.target.toLocaleString()}</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden mb-2">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 transition-all duration-1000"
                            style={{ width: `${progress.users}%` }}
                        />
                    </div>
                    <p className="text-sm text-muted-foreground">{progress.users.toFixed(1)}% of goal achieved</p>
                </div>

                <div className="glass p-8 rounded-2xl shadow-xl border-2 border-purple-500/30">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">NFT Receipts Minted</h3>
                        <Coins className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex items-baseline space-x-2 mb-3">
                        <span className="text-5xl font-bold text-purple-600">{hackathonGoals.receipts.current.toLocaleString()}</span>
                        <span className="text-xl text-muted-foreground">/ {hackathonGoals.receipts.target.toLocaleString()}</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden mb-2">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-1000"
                            style={{ width: `${progress.receipts}%` }}
                        />
                    </div>
                    <p className="text-sm text-muted-foreground">{progress.receipts.toFixed(1)}% of goal achieved</p>
                </div>
            </div>

            {/* Growth Chart */}
            <div className="glass p-8 rounded-2xl shadow-xl">
                <h2 className="text-2xl font-display font-bold mb-6 flex items-center space-x-2">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                    <span>5-Week Growth Trajectory</span>
                </h2>

                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={WEEKLY_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                        <XAxis dataKey="week" stroke="#888" />
                        <YAxis yAxisId="left" stroke="#10b981" />
                        <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
                        <Tooltip
                            contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px' }}
                            labelStyle={{ color: '#fff' }}
                        />
                        <Line yAxisId="left" type="monotone" dataKey="tonnes" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} name="Tonnes" />
                        <Line yAxisId="right" type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} name="Users" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Waste Type Distribution */}
                <div className="glass p-8 rounded-2xl shadow-xl">
                    <h2 className="text-2xl font-display font-bold mb-6">Material Type Breakdown</h2>

                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={WASTE_TYPES}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {WASTE_TYPES.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                        {WASTE_TYPES.map((type) => (
                            <div key={type.name} className="flex items-center justify-between p-3 rounded-lg bg-accent">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                                    <span className="text-sm font-medium">{type.name}</span>
                                </div>
                                <span className="text-sm font-bold">{type.value} kg</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Collection Points */}
                <div className="glass p-8 rounded-2xl shadow-xl">
                    <h2 className="text-2xl font-display font-bold mb-6">Top Collection Points</h2>

                    <div className="space-y-3">
                        {COLLECTION_POINTS.sort((a, b) => b.submissions - a.submissions).map((point, index) => (
                            <div key={point.name} className="flex items-center justify-between p-4 rounded-xl bg-accent hover:bg-accent/70 transition-all">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-muted'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{point.name}</p>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="w-3 h-3 text-green-500" />
                                            <span className="text-xs text-muted-foreground">Active</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-primary">{point.submissions}</p>
                                    <p className="text-xs text-muted-foreground">submissions</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* System Health */}
            <div className="grid md:grid-cols-4 gap-4">
                <div className="glass p-6 rounded-xl border-2 border-green-500/30">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">Blockchain Status</span>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">100%</p>
                    <p className="text-xs text-muted-foreground">Cardano PreProd Testnet</p>
                </div>

                <div className="glass p-6 rounded-xl border-2 border-green-500/30">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">IPFS Uptime</span>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">99.8%</p>
                    <p className="text-xs text-muted-foreground">via NFT.Storage</p>
                </div>

                <div className="glass p-6 rounded-xl border-2 border-blue-500/30">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">Avg Transaction Time</span>
                        <AlertCircle className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-blue-600">18s</p>
                    <p className="text-xs text-muted-foreground">From submission to mint</p>
                </div>

                <div className="glass p-6 rounded-xl border-2 border-purple-500/30">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">Smart Contract Calls</span>
                        <CheckCircle className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold text-purple-600">5,832</p>
                    <p className="text-xs text-muted-foreground">Total on-chain txs</p>
                </div>
            </div>

            {/* Impact Summary */}
            <div className="glass p-12 rounded-3xl shadow-2xl gradient-border text-center">
                <h2 className="text-3xl font-display font-bold mb-8">Environmental Impact Summary</h2>

                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <p className="text-5xl font-bold text-green-600 mb-2">12.4T</p>
                        <p className="text-muted-foreground">Waste diverted from landfills</p>
                    </div>
                    <div>
                        <p className="text-5xl font-bold text-blue-600 mb-2">23</p>
                        <p className="text-muted-foreground">Blocked drains cleared</p>
                    </div>
                    <div>
                        <p className="text-5xl font-bold text-purple-600 mb-2">18.6T</p>
                        <p className="text-muted-foreground">CO₂ emissions saved</p>
                    </div>
                    <div>
                        <p className="text-5xl font-bold text-orange-600 mb-2">₦2.1M</p>
                        <p className="text-muted-foreground">Economic value recovered</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
