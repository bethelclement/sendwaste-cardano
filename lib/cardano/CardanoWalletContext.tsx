"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Lucid, Blockfrost, WalletApi } from '@lucid-evolution/lucid';

// Wallet types
type SupportedWallet = 'nami' | 'eternl' | 'lace';

interface CardanoWalletContextType {
    lucid: Lucid | null;
    walletName: SupportedWallet | null;
    address: string | null;
    connecting: boolean;
    connected: boolean;
    connectWallet: (walletName: SupportedWallet) => Promise<void>;
    disconnectWallet: () => void;
    error: string | null;
}

const CardanoWalletContext = createContext<CardanoWalletContextType | undefined>(undefined);

export function CardanoWalletProvider({ children }: { children: ReactNode }) {
    const [lucid, setLucid] = useState<Lucid | null>(null);
    const [walletName, setWalletName] = useState<SupportedWallet | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [connecting, setConnecting] = useState(false);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize Lucid with Blockfrost
    useEffect(() => {
        async function initLucid() {
            try {
                const blockfrostApiKey = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || 'preprodYourKeyHere';

                const lucidInstance = await Lucid.new(
                    new Blockfrost(
                        'https://cardano-preprod.blockfrost.io/api/v0',
                        blockfrostApiKey
                    ),
                    'Preprod'
                );

                setLucid(lucidInstance);
                console.log('✅ Lucid initialized with Blockfrost PreProd');
            } catch (err) {
                console.error('Failed to initialize Lucid:', err);
                setError('Failed to connect to Cardano network');
            }
        }

        initLucid();
    }, []);

    // Wallet detection helper
    const getWalletApi = async (walletName: SupportedWallet): Promise<WalletApi | null> => {
        if (typeof window === 'undefined') return null;

        const walletExtensions: Record<SupportedWallet, string> = {
            nami: 'cardano',
            eternl: 'eternl',
            lace: 'lace',
        };

        const extensionKey = walletExtensions[walletName];
        const windowCardano = (window as any).cardano;

        if (!windowCardano) {
            throw new Error('No Cardano wallet extensions found');
        }

        // For Nami
        if (walletName === 'nami' && windowCardano.nami) {
            return await windowCardano.nami.enable();
        }

        // For Eternl
        if (walletName === 'eternl' && windowCardano.eternl) {
            return await windowCardano.eternl.enable();
        }

        // For Lace
        if (walletName === 'lace' && windowCardano.lace) {
            return await windowCardano.lace.enable();
        }

        throw new Error(`${walletName} wallet not installed`);
    };

    const connectWallet = async (selectedWallet: SupportedWallet) => {
        setConnecting(true);
        setError(null);

        try {
            if (!lucid) {
                throw new Error('Lucid not initialized. Please refresh the page.');
            }

            // Get wallet API
            const walletApi = await getWalletApi(selectedWallet);

            if (!walletApi) {
                throw new Error(`Failed to connect to ${selectedWallet}`);
            }

            // Select wallet in Lucid
            lucid.selectWallet(walletApi);

            // Get wallet address
            const walletAddress = await lucid.wallet.address();

            setWalletName(selectedWallet);
            setAddress(walletAddress);
            setConnected(true);

            // Save to localStorage
            localStorage.setItem('selectedWallet', selectedWallet);
            localStorage.setItem('walletAddress', walletAddress);

            console.log(`✅ Connected to ${selectedWallet}:`, walletAddress);
        } catch (err: any) {
            console.error('Wallet connection failed:', err);
            setError(err.message || 'Failed to connect wallet');
            setConnected(false);
        } finally {
            setConnecting(false);
        }
    };

    const disconnectWallet = () => {
        setWalletName(null);
        setAddress(null);
        setConnected(false);
        localStorage.removeItem('selectedWallet');
        localStorage.removeItem('walletAddress');
        console.log('🔌 Wallet disconnected');
    };

    // Auto-reconnect on page load
    useEffect(() => {
        const savedWallet = localStorage.getItem('selectedWallet') as SupportedWallet | null;
        if (savedWallet && lucid) {
            connectWallet(savedWallet).catch(console.error);
        }
    }, [lucid]);

    return (
        <CardanoWalletContext.Provider
            value={{
                lucid,
                walletName,
                address,
                connecting,
                connected,
                connectWallet,
                disconnectWallet,
                error,
            }}
        >
            {children}
        </CardanoWalletContext.Provider>
    );
}

export function useCardanoWallet() {
    const context = useContext(CardanoWalletContext);
    if (context === undefined) {
        throw new Error('useCardanoWallet must be used within CardanoWalletProvider');
    }
    return context;
}
