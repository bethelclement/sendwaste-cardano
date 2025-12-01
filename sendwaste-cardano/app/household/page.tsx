'use client'

import { useState, useRef } from 'react'
import { useWallet } from '@/lib/cardano/WalletContext'
import { Camera, MapPin, Upload, Coins, TrendingUp, CheckCircle2, QrCode, Leaf } from 'lucide-react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import QRCodeComponent from 'qrcode.react'

const WASTE_TYPES = [
    { id: 'plastic_pet', name: 'PET Bottles', icon: '🥤', rate: 10, color: 'from-blue-400 to-cyan-500' },
    { id: 'plastic_nylon', name: 'Nylon/Bags', icon: '🛍️', rate: 10, color: 'from-purple-400 to-pink-500' },
    { id: 'aluminum_can', name: 'Aluminum Cans', icon: '🥫', rate: 15, color: 'from-gray-400 to-gray-600' },
    { id: 'e_waste', name: 'E-Waste', icon: '📱', rate: 50, color: 'from-yellow-400 to-orange-500' },
    { id: 'organic', name: 'Organic', icon: '🥬', rate: 5, color: 'from-green-400 to-emerald-500' },
]

export default function HouseholdPage() {
    const { connected, walletAddress } = useWallet()
    const [selectedType, setSelectedType] = useState(WASTE_TYPES[0])
    const [quantity, setQuantity] = useState(5)
    const [photo, setPhoto] = useState<string | null>(null)
    const [location, setLocation] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [qrModalOpen, setQrModalOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Mock user stats
    const userStats = {
        totalKg: 87,
        totalTokens: 1240,
        receipts: 14,
        co2Saved: 132, // kg
        treesEquivalent: 6,
    }

    const estimatedReward = quantity * selectedType.rate

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPhoto(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleGetLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    setLocation(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`)
                },
                (error) => {
                    setLocation('Abuja, Zone 3 Garki (Manual)')
                }
            )
        } else {
            setLocation('Abuja, Zone 3 Garki (Manual)')
        }
    }

    const handleSubmit = async () => {
        if (!connected) {
            alert('Please connect your wallet first')
            return
        }

        setSubmitting(true)

        // Simulate blockchain transaction
        await new Promise(resolve => setTimeout(resolve, 3000))

        // Success!
        setSubmitted(true)
        setSubmitting(false)

        // Celebrate with confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        })
    }

    if (!connected) {
        return (
            <div className="max-w-2xl mx-auto text-center py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-12 rounded-3xl shadow-2xl"
                >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center glow">
                        <Leaf className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-display font-bold mb-4">Connect Your Wallet</h2>
                    <p className="text-muted-foreground text-lg mb-6">
                        Start earning rewards for your waste recovery contributions
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Click "Connect Wallet" in the navigation bar to get started
                    </p>
                </motion.div>
            </div>
        )
    }

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-12 rounded-3xl shadow-2xl space-y-6"
                >
                    <div className="w-24 h-24 mx-auto rounded-full bg-green-500 flex items-center justify-center burst glow">
                        <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>

                    <h2 className="text-4xl font-display font-bold">Submission Successful! 🎉</h2>

                    <div className="glass p-6 rounded-xl border border-green-500/30 bg-green-500/5">
                        <div className="flex items-center justify-center space-x-3 mb-3">
                            <Coins className="w-8 h-8 text-yellow-500" />
                            <span className="text-5xl font-bold text-green-600">+{estimatedReward}</span>
                            <span className="text-2xl text-muted-foreground">WASTE</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Tokens will be credited after collector verification</p>
                    </div>

                    <div className="space-y-3 text-left">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Waste Type:</span>
                            <span className="font-semibold">{selectedType.icon} {selectedType.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Quantity:</span>
                            <span className="font-semibold">{quantity} kg</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Location:</span>
                            <span className="font-mono text-sm">{location || 'Abuja Zone 3'}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setQrModalOpen(true)}
                        className="btn-secondary w-full flex items-center justify-center space-x-2"
                    >
                        <QrCode className="w-5 h-5" />
                        <span>Show QR Code for Collector</span>
                    </button>

                    <button
                        onClick={() => {
                            setSubmitted(false)
                            setPhoto(null)
                            setQuantity(5)
                            setLocation('')
                        }}
                        className="w-full px-6 py-3 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all"
                    >
                        Submit Another Waste
                    </button>
                </motion.div>

                {/* QR Modal */}
                {qrModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={() => setQrModalOpen(false)}>
                        <div className="glass p-8 rounded-2xl slide-up" onClick={(e) => e.stopPropagation()}>
                            <h3 className="text-2xl font-bold mb-4 text-center">Pickup Verification Code</h3>
                            <div className="bg-white p-4 rounded-xl">
                                <QRCodeComponent value={`sendwaste:${walletAddress}:${Date.now()}`} size={256} />
                            </div>
                            <p className="text-sm text-center text-muted-foreground mt-4">
                                Show this to the collector during pickup
                            </p>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-display font-bold mb-2">Household Dashboard</h1>
                <p className="text-xl text-muted-foreground">Submit waste, earn rewards, track impact</p>
            </div>

            {/* User Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="glass p-4 rounded-xl text-center">
                    <p className="text-3xl font-bold text-green-600">{userStats.totalKg}</p>
                    <p className="text-sm text-muted-foreground">kg Recycled</p>
                </div>
                <div className="glass p-4 rounded-xl text-center">
                    <div className="flex items-center justify-center space-x-1">
                        <Coins className="w-5 h-5 text-yellow-500" />
                        <p className="text-3xl font-bold text-yellow-600">{userStats.totalTokens}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">WASTE Tokens</p>
                </div>
                <div className="glass p-4 rounded-xl text-center">
                    <p className="text-3xl font-bold text-blue-600">{userStats.receipts}</p>
                    <p className="text-sm text-muted-foreground">NFT Receipts</p>
                </div>
                <div className="glass p-4 rounded-xl text-center">
                    <p className="text-3xl font-bold text-purple-600">{userStats.co2Saved}</p>
                    <p className="text-sm text-muted-foreground">kg CO₂ Saved</p>
                </div>
                <div className="glass p-4 rounded-xl text-center">
                    <p className="text-3xl font-bold text-emerald-600">{userStats.treesEquivalent}</p>
                    <p className="text-sm text-muted-foreground">Trees 🌳</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Submission Form */}
                <div className="glass p-8 rounded-2xl shadow-xl space-y-6">
                    <h2 className="text-2xl font-display font-bold flex items-center space-x-2">
                        <Upload className="w-6 h-6 text-primary" />
                        <span>New Waste Submission</span>
                    </h2>

                    {/* Waste Type Selection */}
                    <div>
                        <label className="block text-sm font-semibold mb-3">Waste Type</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {WASTE_TYPES.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedType(type)}
                                    className={`p-4 rounded-xl border-2 transition-all ${selectedType.id === type.id
                                            ? 'border-primary bg-primary/10 scale-105'
                                            : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    <div className="text-3xl mb-2">{type.icon}</div>
                                    <div className="text-sm font-semibold">{type.name}</div>
                                    <div className="text-xs text-muted-foreground">{type.rate} tokens/kg</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-semibold mb-3">Quantity (kg)</label>
                        <input
                            type="range"
                            min="5"
                            max="50"
                            step="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-full h-3 bg-muted rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between mt-2">
                            <span className="text-2xl font-bold text-primary">{quantity} kg</span>
                            <span className="text-muted-foreground text-sm">Max 50kg</span>
                        </div>
                    </div>

                    {/* Photo Upload */}
                    <div>
                        <label className="block text-sm font-semibold mb-3">Proof Photo</label>
                        {!photo ? (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-40 rounded-xl border-2 border-dashed border-border hover:border-primary 
                         flex flex-col items-center justify-center transition-all group"
                            >
                                <Camera className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
                                <span className="mt-2 text-muted-foreground group-hover:text-primary">
                                    Upload waste photo
                                </span>
                            </button>
                        ) : (
                            <div className="relative">
                                <img src={photo} alt="Waste" className="w-full h-48 object-cover rounded-xl" />
                                <button
                                    onClick={() => setPhoto(null)}
                                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handlePhotoUpload}
                            className="hidden"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-semibold mb-3">Drop-off Location</label>
                        {!location ? (
                            <button
                                onClick={handleGetLocation}
                                className="w-full px-4 py-3 rounded-lg border-2 border-border hover:border-primary 
                         flex items-center justify-center space-x-2 transition-all"
                            >
                                <MapPin className="w-5 h-5" />
                                <span>Get Current Location</span>
                            </button>
                        ) : (
                            <div className="flex items-center space-x-2 p-3 rounded-lg bg-accent">
                                <MapPin className="w-5 h-5 text-primary" />
                                <span className="font-mono text-sm">{location}</span>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={!photo || submitting}
                        className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <span className="flex items-center justify-center space-x-2">
                                <div className="spinner border-white" />
                                <span>Submitting to Blockchain...</span>
                            </span>
                        ) : (
                            `Submit ${quantity}kg ${selectedType.name}`
                        )}
                    </button>
                </div>

                {/* Preview & Rewards */}
                <div className="space-y-6">
                    {/* Estimated Reward */}
                    <div className="glass p-8 rounded-2xl shadow-xl gradient-border">
                        <h3 className="text-xl font-bold mb-4">Estimated Reward</h3>
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <Coins className="w-12 h-12 text-yellow-500 animate-float" />
                            <div>
                                <p className="text-5xl font-bold text-primary">{estimatedReward}</p>
                                <p className="text-muted-foreground">WASTE Tokens</p>
                            </div>
                        </div>
                        <div className="mt-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                            <p className="text-sm text-center">
                                = ₦{(estimatedReward * 50).toLocaleString()} Naira value
                            </p>
                            <p className="text-xs text-center text-muted-foreground mt-1">
                                Based on current market rate
                            </p>
                        </div>
                    </div>

                    {/* Environmental Impact */}
                    <div className="glass p-8 rounded-2xl shadow-xl">
                        <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                            <Leaf className="w-6 h-6 text-green-500" />
                            <span>Your Impact</span>
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-2xl">
                                    ♻️
                                </div>
                                <div>
                                    <p className="font-semibold">{quantity} kg diverted from landfills</p>
                                    <p className="text-sm text-muted-foreground">Preventing drain blockage</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-2xl">
                                    💧
                                </div>
                                <div>
                                    <p className="font-semibold">{(quantity * 1.5).toFixed(1)} kg CO₂ saved</p>
                                    <p className="text-sm text-muted-foreground">Carbon emissions reduced</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-2xl">
                                    🌍
                                </div>
                                <div>
                                    <p className="font-semibold">Regenerative economy</p>
                                    <p className="text-sm text-muted-foreground">Building circular materials flow</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
