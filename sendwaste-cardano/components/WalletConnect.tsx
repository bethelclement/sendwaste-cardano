'use client'

import { useState } from 'react'
import { useWallet } from '@/lib/cardano/WalletContext'
import { Wallet, LogOut, Loader2, AlertCircle } from 'lucide-react'

const SUPPORTED_WALLETS = [
    { name: 'Nami', key: 'nami', icon: '🦎' },
    { name: 'Eternl', key: 'eternl', icon: '♾️' },
    { name: 'Lace', key: 'lace', icon: '🎴' },
]

export function WalletConnect() {
    const { connected, connecting, connect, disconnect, error } = useWallet()
    const [showModal, setShowModal] = useState(false)

    if (connected) {
        return (
            <button
                onClick={disconnect}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 
                   text-red-600 hover:bg-red-500/20 transition-all duration-200"
            >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Disconnect</span>
            </button>
        )
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                disabled={connecting}
                className="btn-primary flex items-center space-x-2"
            >
                {connecting ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Connecting...</span>
                    </>
                ) : (
                    <>
                        <Wallet className="w-4 h-4" />
                        <span>Connect Wallet</span>
                    </>
                )}
            </button>

            {/* Wallet Selection Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={() => setShowModal(false)}>
                    <div className="glass p-8 rounded-2xl max-w-md w-full slide-up shadow-2xl"
                        onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-display font-bold mb-6 text-center">
                            Connect Your Wallet
                        </h2>

                        {error && (
                            <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start space-x-2">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        <div className="space-y-3">
                            {SUPPORTED_WALLETS.map((wallet) => (
                                <button
                                    key={wallet.key}
                                    onClick={async () => {
                                        await connect(wallet.key)
                                        if (!error) setShowModal(false)
                                    }}
                                    disabled={connecting}
                                    className="w-full flex items-center justify-between p-4 rounded-xl
                           bg-white dark:bg-slate-800 border-2 border-primary/20
                           hover:border-primary hover:shadow-lg transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed
                           card-hover"
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className="text-3xl">{wallet.icon}</span>
                                        <span className="font-semibold text-lg">{wallet.name}</span>
                                    </div>
                                    <div className="text-2xl">→</div>
                                </button>
                            ))}
                        </div>

                        <p className="mt-6 text-sm text-center text-muted-foreground">
                            New to Cardano?{' '}
                            <a
                                href="https://namiwallet.io"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline font-medium"
                            >
                                Get Nami Wallet
                            </a>
                        </p>
                    </div>
                </div>
            )}
        </>
    )
}
