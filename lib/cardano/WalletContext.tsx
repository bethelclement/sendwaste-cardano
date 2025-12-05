'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Lucid, Blockfrost, WalletApi } from '@lucid-evolution/lucid'

interface WalletContextType {
    lucid: Lucid | null
    walletApi: WalletApi | null
    walletAddress: string | null
    connected: boolean
    connecting: boolean
    connect: (walletName: string) => Promise<void>
    disconnect: () => void
    error: string | null
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function useWallet() {
    const context = useContext(WalletContext)
    if (!context) {
        throw new Error('useWallet must be used within WalletProvider')
    }
    return context
}

export function WalletProvider({ children }: { children: ReactNode }) {
    const [lucid, setLucid] = useState<Lucid | null>(null)
    const [walletApi, setWalletApi] = useState<WalletApi | null>(null)
    const [walletAddress, setWalletAddress] = useState<string | null>(null)
    const [connected, setConnected] = useState(false)
    const [connecting, setConnecting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Initialize Lucid on mount
    useEffect(() => {
        initLucid()
    }, [])

    async function initLucid() {
        try {
            const blockfrostApiKey = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || 'preprodYourKeyHere'

            const lucidInstance = await Lucid.new(
                new Blockfrost(
                    'https://cardano-preprod.blockfrost.io/api/v0',
                    blockfrostApiKey
                ),
                'Preprod'
            )

            setLucid(lucidInstance)

            // Check if wallet was previously connected
            const savedWallet = localStorage.getItem('connectedWallet')
            if (savedWallet) {
                await connect(savedWallet)
            }
        } catch (err) {
            console.error('Failed to initialize Lucid:', err)
            setError('Failed to initialize blockchain connection')
        }
    }

    async function connect(walletName: string) {
        if (!lucid) {
            setError('Lucid not initialized')
            return
        }

        setConnecting(true)
        setError(null)

        try {
            // Check if wallet extension is available
            const walletKey = walletName.toLowerCase()
            if (typeof window === 'undefined' || !(window as any).cardano?.[walletKey]) {
                throw new Error(`${walletName} wallet not found. Please install the extension.`)
            }

            // Connect to wallet
            const api = await (window as any).cardano[walletKey].enable()
            lucid.selectWallet(api)

            // Get wallet address
            const address = await lucid.wallet.address()

            setWalletApi(api)
            setWalletAddress(address)
            setConnected(true)

            // Save wallet preference
            localStorage.setItem('connectedWallet', walletName)
        } catch (err: any) {
            console.error('Wallet connection error:', err)
            setError(err.message || 'Failed to connect wallet')
            disconnect()
        } finally {
            setConnecting(false)
        }
    }

    function disconnect() {
        setWalletApi(null)
        setWalletAddress(null)
        setConnected(false)
        localStorage.removeItem('connectedWallet')
    }

    const value: WalletContextType = {
        lucid,
        walletApi,
        walletAddress,
        connected,
        connecting,
        connect,
        disconnect,
        error,
    }

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    )
}
