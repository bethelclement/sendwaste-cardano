'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function PitchDeck() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 7;
    const touchStart = useRef(0);
    const touchEnd = useRef(0);

    // Navigation Logic
    const nextSlide = () => {
        if (currentSlide < totalSlides - 1) setCurrentSlide(prev => prev + 1);
    };

    const prevSlide = () => {
        if (currentSlide > 0) setCurrentSlide(prev => prev - 1);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentSlide]);

    // Touch Navigation
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStart.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        touchEnd.current = e.changedTouches[0].clientX;
        if (touchStart.current - touchEnd.current > 50) nextSlide();
        if (touchStart.current - touchEnd.current < -50) prevSlide();
    };

    return (
        <div
            className="h-screen w-screen overflow-hidden bg-[#F8FAFC] text-[#1e293b] font-sans relative"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Global Styles for Fonts */}
            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Outfit', sans-serif; }
        h1, h2, h3 { font-family: 'Space Grotesk', sans-serif; }
      `}</style>

            {/* Brand Watermark */}
            <div
                className="absolute w-[120vh] h-[120vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 opacity-[0.03] pointer-events-none z-0"
                style={{
                    backgroundImage: "url('/logo-brand.jpg')",
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    filter: 'grayscale(100%)'
                }}
            />

            {/* Slides Container */}
            <div
                className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                style={{ transform: `translateX(-${currentSlide * 100}vw)`, width: `${totalSlides * 100}vw` }}
            >

                {/* SLIDE 1: TITLE */}
                <div className="w-screen h-screen flex flex-col justify-center items-center p-8 md:p-20 relative shrink-0">
                    <div className="mb-8 w-32 h-32 rounded-[30px] overflow-hidden shadow-2xl">
                        <Image src="/logo-brand.jpg" alt="SendWaste Logo" width={128} height={128} className="object-cover w-full h-full" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-[#0B1120] text-center mb-8 leading-tight tracking-tight">
                        The Operating System<br />for Circular Economy.
                    </h1>
                    <p className="text-xl md:text-2xl text-[#64748b] max-w-3xl text-center mb-12 font-light leading-relaxed">
                        SendWaste leverages <strong className="text-[#0044CC] font-semibold">Cardano blockchain</strong> to bring trust, transparency, and liquidity to the $500M African waste market.
                    </p>
                    <button
                        onClick={nextSlide}
                        className="px-12 py-4 bg-[#0B1120] text-white rounded-full text-lg font-semibold hover:bg-black hover:-translate-y-1 hover:shadow-2xl transition-all flex items-center gap-3"
                    >
                        Begin Presentation
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                    <div className="absolute bottom-10 text-sm text-[#94a3b8] tracking-widest uppercase font-semibold">
                        Strictly Confidential • Series A Pitch
                    </div>
                </div>

                {/* SLIDE 2: THE PROBLEM */}
                <div className="w-screen h-screen flex flex-col justify-center items-center p-8 md:p-20 relative shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 max-w-7xl w-full items-center">
                        <div>
                            <div className="text-[#ef4444] font-bold tracking-widest uppercase text-sm mb-4">The Crisis</div>
                            <h2 className="text-4xl md:text-5xl font-bold text-[#0B1120] mb-8">A Broken Supply Chain</h2>
                            <p className="text-xl text-[#64748b] mb-8 leading-relaxed">
                                Nigeria generates <strong className="text-[#0044CC]">32M tonnes</strong> of waste annually. The market is paralyzed by a lack of data and trust.
                            </p>
                            <div className="flex gap-8 mt-8">
                                <div className="pl-6 border-l-4 border-[#ef4444]">
                                    <div className="text-2xl font-bold text-[#0B1120]">Zero Data</div>
                                    <div className="text-sm text-[#64748b]">No verifiable source tracking</div>
                                </div>
                                <div className="pl-6 border-l-4 border-[#ef4444]">
                                    <div className="text-2xl font-bold text-[#0B1120]">Zero Trust</div>
                                    <div className="text-sm text-[#64748b]">Rampant fraud in collection</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl p-10 shadow-xl">
                            <div className="grid grid-cols-2 gap-10">
                                <div>
                                    <div className="text-6xl font-bold text-[#ef4444] leading-none mb-2">70%</div>
                                    <div className="text-lg text-[#64748b] font-medium">Uncollected Waste</div>
                                </div>
                                <div>
                                    <div className="text-6xl font-bold text-[#f59e0b] leading-none mb-2">$500M</div>
                                    <div className="text-lg text-[#64748b] font-medium">Lost Annual Value</div>
                                </div>
                                <div className="col-span-2 pt-6 border-t border-slate-100 flex items-center gap-3 text-[#64748b]">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                    Current State: Opaque & Inefficient
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SLIDE 3: THE SOLUTION */}
                <div className="w-screen h-screen flex flex-col justify-center items-center p-8 md:p-20 relative shrink-0">
                    <div className="text-[#00AA88] font-bold tracking-widest uppercase text-sm mb-4">The Solution</div>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#0B1120] mb-6">Trust as a Protocol</h2>
                    <p className="text-xl md:text-2xl text-[#64748b] max-w-3xl text-center mb-12 font-light">
                        We replace middlemen with <strong className="text-[#0044CC]">Smart Contracts</strong>. A transparent, immutable ledger for every kilogram of waste.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
                        {[
                            { title: "1. Verify", desc: "GPS & Photo data locked on-chain at point of collection.", color: "#0044CC", icon: <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /> },
                            { title: "2. Validate", desc: "Collectors sign transactions. Smart contracts execute logic.", color: "#00AA88", icon: <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" /> },
                            { title: "3. Reward", desc: "Instant payout in $WASTE tokens + NFT Receipt.", color: "#f59e0b", icon: <circle cx="12" cy="12" r="10" /> }
                        ].map((item, i) => (
                            <div key={i} className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl p-8 text-center shadow-lg hover:-translate-y-2 transition-transform duration-300">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm" style={{ color: item.color }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">{item.icon}</svg>
                                </div>
                                <h3 className="text-xl font-bold text-[#0B1120] mb-3">{item.title}</h3>
                                <p className="text-[#64748b]">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SLIDE 4: TECHNICAL PROOF */}
                <div className="w-screen h-screen flex flex-col justify-center items-center p-8 md:p-20 relative shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 max-w-7xl w-full items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <Image src="/logo-brand.jpg" alt="Logo" width={40} height={40} className="rounded-lg" />
                                <span className="font-bold text-xl text-[#0B1120]">SendWaste Protocol</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-[#0B1120] mb-6">Code is Law.</h2>
                            <p className="text-lg text-[#64748b] mb-8">
                                We don't rely on promises. We rely on <strong className="text-[#0044CC]">Aiken Smart Contracts</strong> deployed on Cardano.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-[#dcfce7] rounded-full flex items-center justify-center text-[#00AA88]">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                    </div>
                                    <div>
                                        <div className="font-bold text-[#0B1120]">waste_receipt_validator.ak</div>
                                        <div className="text-sm text-[#64748b]">Enforces location & time validity</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-[#dbeafe] rounded-full flex items-center justify-center text-[#0044CC]">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                    </div>
                                    <div>
                                        <div className="font-bold text-[#0B1120]">receipt_nft_policy.ak</div>
                                        <div className="text-sm text-[#64748b]">Mints immutable proof of recycle</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#0f172a] rounded-2xl p-8 font-mono text-sm text-[#e2e8f0] shadow-2xl relative overflow-hidden w-full">
                            <div className="absolute top-0 left-0 right-0 h-8 bg-[#1e293b] border-b border-[#334155] flex items-center px-4 gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
                                <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
                                <div className="w-3 h-3 rounded-full bg-[#22c55e]"></div>
                            </div>
                            <div className="mt-6 text-[#64748b] mb-4">// Aiken Validator Logic</div>
                            <div className="leading-relaxed">
                                <span className="text-[#c084fc]">validator</span> {'{'}<br />
                                &nbsp;&nbsp;<span className="text-[#60a5fa]">fn</span> spend(datum, redeemer, ctx) {'{'}<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#60a5fa]">expect</span> Verify {'{'} collector {'}'} = redeemer<br /><br />
                                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#4ade80]">// 1. Cryptographic Signature Check</span><br />
                                &nbsp;&nbsp;&nbsp;&nbsp;must_be_signed_by(tx, collector) &&<br /><br />
                                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#4ade80]">// 2. Geospatial Validation</span><br />
                                &nbsp;&nbsp;&nbsp;&nbsp;validate_location(datum.gps) &&<br /><br />
                                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#4ade80]">// 3. Temporal Lock</span><br />
                                &nbsp;&nbsp;&nbsp;&nbsp;within_timeframe(datum.timestamp)<br />
                                &nbsp;&nbsp;{'}'}<br />
                                {'}'}
                            </div>
                            <div className="mt-6 pt-4 border-t border-[#334155] flex justify-between text-xs text-[#64748b]">
                                <span>STATUS: <span className="text-[#4ade80]">● DEPLOYED</span></span>
                                <span>NET: <span className="text-[#e2e8f0]">PreProd</span></span>
                                <span>ADDR: <span className="text-[#e2e8f0]">addr_test1...</span></span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SLIDE 5: LIVE TRACTION */}
                <div className="w-screen h-screen flex flex-col justify-center items-center p-8 md:p-20 relative shrink-0">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#0B1120] mb-6">Real-Time Traction</h2>
                    <p className="text-xl text-[#64748b] mb-12">Live data from the Cardano blockchain. No black boxes.</p>

                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden border border-slate-100">
                        <div className="bg-[#f8fafc] px-8 py-5 border-b border-slate-100 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-[#00AA88] rounded-full animate-pulse shadow-[0_0_0_4px_rgba(0,170,136,0.2)]"></div>
                                <span className="font-semibold text-[#0B1120]">Live Network Activity</span>
                            </div>
                            <span className="text-sm text-[#64748b] font-mono">BLOCK: 9,472,851</span>
                        </div>
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 text-[#64748b] text-sm uppercase tracking-wider">
                                    <th className="px-8 py-4 text-left">Rank</th>
                                    <th className="px-4 py-4 text-left">Wallet Address</th>
                                    <th className="px-4 py-4 text-right">Volume</th>
                                    <th className="px-8 py-4 text-right">Assets</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { rank: "01", user: "addr1...4k9x", vol: "245.5 kg", nft: "42 NFTs", color: "#f59e0b" },
                                    { rank: "02", user: "addr1...7m2p", vol: "198.2 kg", nft: "35 NFTs", color: "#94a3b8" },
                                    { rank: "03", user: "addr1...9n5q", vol: "156.8 kg", nft: "28 NFTs", color: "#b45309" }
                                ].map((row, i) => (
                                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                        <td className="px-8 py-5 font-bold" style={{ color: row.color }}>{row.rank}</td>
                                        <td className="px-4 py-5 font-mono text-[#0044CC]">{row.user}</td>
                                        <td className="px-4 py-5 text-right font-semibold">{row.vol}</td>
                                        <td className="px-8 py-5 text-right">{row.nft}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-12">
                        <Link href="/" target="_blank" className="px-10 py-4 bg-[#0B1120] text-white rounded-full text-lg font-semibold hover:bg-black hover:-translate-y-1 transition-all flex items-center gap-3 shadow-xl">
                            Launch Live Demo
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                        </Link>
                    </div>
                </div>

                {/* SLIDE 6: BUSINESS MODEL */}
                <div className="w-screen h-screen flex flex-col justify-center items-center p-8 md:p-20 relative shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 max-w-6xl w-full items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-[#0B1120] mb-6">Sustainable Unit Economics</h2>
                            <p className="text-xl text-[#64748b] mb-10">We monetize trust. Brands pay for verified data, and recyclers pay for verified feedstock.</p>

                            <div className="space-y-8">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-semibold text-[#0B1120]">B2B Service Fee</span>
                                        <span className="font-bold text-[#00AA88]">15%</span>
                                    </div>
                                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#00AA88] w-[15%]"></div>
                                    </div>
                                    <div className="text-sm text-[#64748b] mt-2">Charged to recyclers for verified feedstock</div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-semibold text-[#0B1120]">Data Monetization</span>
                                        <span className="font-bold text-[#0044CC]">$50 / Report</span>
                                    </div>
                                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#0044CC] w-[60%]"></div>
                                    </div>
                                    <div className="text-sm text-[#64748b] mt-2">Sold to FMCGs for ESG compliance</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0B1120] text-white rounded-3xl p-10 shadow-2xl border border-white/10">
                            <div className="mb-8">
                                <div className="text-sm text-[#94a3b8] uppercase tracking-widest mb-2">Total Addressable Market</div>
                                <div className="text-6xl font-bold mb-2">$2.5B</div>
                                <div className="text-[#94a3b8]">Nigerian Waste Sector</div>
                            </div>
                            <div className="pt-8 border-t border-slate-700">
                                <div className="text-sm text-[#94a3b8] uppercase tracking-widest mb-2">Year 1 Projected Revenue</div>
                                <div className="text-4xl font-bold text-[#00AA88]">$450,000</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SLIDE 7: THE ASK */}
                <div className="w-screen h-screen flex flex-col justify-center items-center p-8 md:p-20 relative shrink-0">
                    <div className="w-40 h-40 rounded-[40px] overflow-hidden mb-10 shadow-2xl">
                        <Image src="/logo-brand.jpg" alt="Logo" width={160} height={160} className="object-cover w-full h-full" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-[#0B1120] mb-8 text-center">Join the Revolution.</h1>
                    <p className="text-xl md:text-2xl text-[#64748b] max-w-3xl text-center mb-12">
                        We are raising <strong className="text-[#0044CC]"> $150,000 Pre-Seed</strong> to scale operations to 5 cities and process our first 10,000 tonnes.
                    </p>

                    <div className="flex gap-6">
                        <Link href="/" target="_blank" className="px-10 py-4 bg-[#0B1120] text-white rounded-full text-lg font-semibold hover:bg-black hover:-translate-y-1 transition-all shadow-xl">
                            Launch Demo
                        </Link>
                        <Link href="https://github.com/bethelclement/sendwaste-cardano" target="_blank" className="px-10 py-4 bg-white text-[#0B1120] border border-slate-200 rounded-full text-lg font-semibold hover:bg-slate-50 transition-all flex items-center gap-3">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
                            View Codebase
                        </Link>
                    </div>

                    <div className="mt-20 flex gap-16 opacity-80">
                        <div className="text-center">
                            <div className="font-bold text-[#0B1120]">Bethel Clement</div>
                            <div className="text-sm text-[#64748b]">Lead Developer</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-[#0B1120]">SendWaste Team</div>
                            <div className="text-sm text-[#64748b]">Abuja, Nigeria</div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Navigation Dots */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-50">
                {[...Array(totalSlides)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goToSlide(i)}
                        className={`transition-all duration-300 rounded-full ${i === currentSlide
                                ? 'w-6 h-2 bg-[#0044CC]'
                                : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
