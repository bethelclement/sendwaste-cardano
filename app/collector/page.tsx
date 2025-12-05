'use client'

import { useState } from 'react'
import { useWallet } from '@/lib/cardano/WalletContext'
import { Truck, ScanLine, MapPin, Package, TrendingUp, CheckCircle2, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

interface PendingPickup {
    id: string
    householdId: string
    wasteType: string
    icon: string
    quantity: number
    location: string
    timestamp: number
    estimatedReward: number
    distance: string
}

const MOCK_PICKUPS: PendingPickup[] = [
    {
        id: '1',
        householdId: 'addr1...x7k2',
        wasteType: 'PET Bottles',
        icon: '🥤',
        quantity: 15,
        location: 'Garki Zone 3, Street 12',
        timestamp: Date.now() - 3600000,
        estimatedReward: 150,
        distance: '2.3 km',
    },
    {
        id: '2',
        householdId: 'addr1...m9b3',
        wasteType: 'Aluminum Cans',
        icon: '🥫',
        quantity: 8,
        location: 'Wuse 2, Plot 45',
        timestamp: Date.now() - 7200000,
        estimatedReward: 120,
        distance: '4.1 km',
    },
    {
        id: '3',
        householdId: 'addr1...p4c1',
        wasteType: 'E-Waste',
        icon: '📱',
        quantity: 12,
        location: 'Maitama District',
        timestamp: Date.now() - 900000,
        estimatedReward: 600,
        distance: '6.7 km',
    },
]

export default function CollectorPage() {
    const { connected } = useWallet()
    const [pickups, setPickups] = useState(MOCK_PICKUPS)
    const [scanning, setScanning] = useState(false)
    const [verifying, setVerifying] = useState<string | null>(null)

    // Mock collector stats
    const collectorStats = {
        todayCollections: 7,
        weeklyKg: 234,
        monthlyEarnings: 8450,
        pendingVerifications: pickups.length,
        completedToday: 4,
    }

    const handleVerify = async (pickupId: string) => {
        setVerifying(pickupId)

        // Simulate verification + NFT minting
        await new Promise(resolve => setTimeout(resolve, 3000))

        // Remove from pending list
        setPickups(pickups.filter(p => p.id !== pickupId))
        setVerifying(null)
    }

    const startScanning = () => {
        setScanning(true)
        setTimeout(() => {
            setScanning(false)
            alert('QR Code scanned successfully! Waste submission verified.')
        }, 2000)
    }

    if (!connected) {
        return (
            <div className="max-w-2xl mx-auto text-center py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-12 rounded-3xl shadow-2xl"
                >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center glow">
                        <Truck className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-display font-bold mb-4">Collector Dashboard</h2>
                    <p className="text-muted-foreground text-lg mb-6">
                        Connect your wallet to access pickup management and verification tools
                    </p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-display font-bold mb-2">Collector Dashboard</h1>
                <p className="text-xl text-muted-foreground">Verify pickups, mint receipts, earn rewards</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="glass p-6 rounded-xl text-center border-2 border-blue-500/30">
                    <p className="text-4xl font-bold text-blue-600">{collectorStats.todayCollections}</p>
                    <p className="text-sm text-muted-foreground mt-1">Today's Pickups</p>
                </div>
                <div className="glass p-6 rounded-xl text-center border-2 border-green-500/30">
                    <p className="text-4xl font-bold text-green-600">{collectorStats.weeklyKg}</p>
                    <p className="text-sm text-muted-foreground mt-1">Weekly kg</p>
                </div>
                <div className="glass p-6 rounded-xl text-center border-2 border-yellow-500/30">
                    <p className="text-4xl font-bold text-yellow-600">₦{collectorStats.monthlyEarnings.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-1">Monthly Earnings</p>
                </div>
                <div className="glass p-6 rounded-xl text-center border-2 border-orange-500/30">
                    <p className="text-4xl font-bold text-orange-600">{collectorStats.pendingVerifications}</p>
                    <p className="text-sm text-muted-foreground mt-1">Pending</p>
                </div>
                <div className="glass p-6 rounded-xl text-center border-2 border-purple-500/30">
                    <p className="text-4xl font-bold text-purple-600">{collectorStats.completedToday}</p>
                    <p className="text-sm text-muted-foreground mt-1">Completed</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* QR Scanner */}
                <div className="glass p-8 rounded-2xl shadow-xl">
                    <h2 className="text-2xl font-display font-bold mb-6 flex items-center space-x-2">
                        <ScanLine className="w-6 h-6 text-blue-600" />
                        <span>QR Scanner</span>
                    </h2>

                    <div className="space-y-4">
                        {!scanning ? (
                            <button
                                onClick={startScanning}
                                className="w-full h-64 rounded-xl border-4 border-dashed border-blue-500/50 
                         hover:border-blue-500 hover:bg-blue-500/10 transition-all
                         flex flex-col items-center justify-center group"
                            >
                                <ScanLine className="w-20 h-20 text-blue-500 group-hover:scale-110 transition-transform" />
                                <span className="mt-4 text-lg font-semibold text-blue-600">
                                    Tap to Scan QR Code
                                </span>
                                <span className="text-sm text-muted-foreground mt-2">
                                    From household submission
                                </span>
                            </button>
                        ) : (
                            <div className="h-64 rounded-xl border-4 border-blue-500 bg-blue-500/10 
                            flex items-center justify-center">
                                <div className="text-center">
                                    <div className="spinner mx-auto mb-4 border-blue-500" />
                                    <p className="text-blue-600 font-semibold">Scanning...</p>
                                </div>
                            </div>
                        )}

                        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                            <p className="text-sm text-center text-muted-foreground">
                                🔒 Scan verifies household submission and triggers NFT receipt minting
                            </p>
                        </div>
                    </div>
                </div>

                {/* Pending Pickups List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-2xl font-display font-bold flex items-center space-x-2">
                        <Package className="w-6 h-6 text-green-600" />
                        <span>Pending Pickups ({pickups.length})</span>
                    </h2>

                    {pickups.length === 0 ? (
                        <div className="glass p-12 rounded-2xl text-center">
                            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
                            <p className="text-xl font-semibold">All caught up!</p>
                            <p className="text-muted-foreground mt-2">No pending pickups at the moment</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pickups.map((pickup, index) => (
                                <motion.div
                                    key={pickup.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass p-6 rounded-xl border-2 border-border hover:border-primary/50 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 
                                    flex items-center justify-center text-3xl">
                                                {pickup.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold">{pickup.wasteType}</h3>
                                                <p className="text-sm text-muted-foreground font-mono">{pickup.householdId}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-primary">{pickup.quantity} kg</p>
                                            <p className="text-sm text-muted-foreground">{pickup.distance} away</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="flex items-center space-x-2 text-sm">
                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                            <span>{pickup.location}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm">
                                            <Clock className="w-4 h-4 text-muted-foreground" />
                                            <span>{Math.floor((Date.now() - pickup.timestamp) / 60000)} min ago</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 mb-4">
                                        <span className="text-sm font-semibold">Estimated Reward:</span>
                                        <span className="text-lg font-bold text-yellow-600">{pickup.estimatedReward} WASTE</span>
                                    </div>

                                    <button
                                        onClick={() => handleVerify(pickup.id)}
                                        disabled={verifying === pickup.id}
                                        className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
                                    >
                                        {verifying === pickup.id ? (
                                            <>
                                                <div className="spinner border-white" />
                                                <span>Minting NFT Receipt...</span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="w-5 h-5" />
                                                <span>Verify & Mint Receipt</span>
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Route Optimization */}
            <div className="glass p-8 rounded-2xl shadow-xl">
                <h2 className="text-2xl font-display font-bold mb-6 flex items-center space-x-2">
                    <MapPin className="w-6 h-6 text-purple-600" />
                    <span>Optimized Route</span>
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-accent border border-border">
                            <span className="font-semibold">1. Garki Zone 3</span>
                            <span className="text-sm text-green-600">15 kg PET</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-accent border border-border">
                            <span className="font-semibold">2. Wuse 2</span>
                            <span className="text-sm text-gray-600">8 kg Aluminum</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-accent border border-border">
                            <span className="font-semibold">3. Maitama</span>
                            <span className="text-sm text-yellow-600">12 kg E-waste</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center p-8 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30">
                        <div className="text-center">
                            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-purple-600" />
                            <p className="text-3xl font-bold text-purple-600">13.2 km</p>
                            <p className="text-muted-foreground">Total route distance</p>
                            <p className="text-sm text-green-600 mt-2">↓ 34% optimized</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
