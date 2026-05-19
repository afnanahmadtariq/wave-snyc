"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Zap, ChevronRight, BarChart3, Globe, RefreshCw, 
  ArrowUpRight, Wallet, TrendingUp, Compass, Layers, 
  Lock, ArrowDownUp, Check, Play, Menu, X, Plus, AlertCircle, CircleDot, Info
} from 'lucide-react';

// Preset paths for the interactive SVG chart in the dashboard mockup
const chartDataPreset: Record<string, { path: string; gradientStart: string; fillPath: string }> = {
  "1D": {
    path: "M 0 100 Q 50 120 100 80 T 200 110 T 300 70 T 400 90 T 500 50 T 600 75 T 700 40 L 700 160 L 0 160 Z",
    gradientStart: "#ff4f12",
    fillPath: "M 0 100 Q 50 120 100 80 T 200 110 T 300 70 T 400 90 T 500 50 T 600 75 T 700 40 L 700 180 L 0 180 Z"
  },
  "1W": {
    path: "M 0 120 Q 50 70 100 110 T 200 60 T 300 85 T 400 40 T 500 90 T 600 50 T 700 20 L 700 160 L 0 160 Z",
    gradientStart: "#ff3d00",
    fillPath: "M 0 120 Q 50 70 100 110 T 200 60 T 300 85 T 400 40 T 500 90 T 600 50 T 700 20 L 700 180 L 0 180 Z"
  },
  "1M": {
    path: "M 0 90 Q 50 60 100 100 T 200 80 T 300 95 T 400 60 T 500 40 T 600 30 T 700 10 L 700 160 L 0 160 Z",
    gradientStart: "#f97316",
    fillPath: "M 0 90 Q 50 60 100 100 T 200 80 T 300 95 T 400 60 T 500 40 T 600 30 T 700 10 L 700 180 L 0 180 Z"
  },
  "1Y": {
    path: "M 0 140 Q 50 130 100 110 T 200 95 T 300 70 T 400 85 T 500 50 T 600 35 T 700 15 L 700 160 L 0 160 Z",
    gradientStart: "#ff4f12",
    fillPath: "M 0 140 Q 50 130 100 110 T 200 95 T 300 70 T 400 85 T 500 50 T 600 35 T 700 15 L 700 180 L 0 180 Z"
  },
  "ALL": {
    path: "M 0 150 Q 50 120 100 130 T 200 90 T 300 80 T 400 50 T 500 60 T 600 30 T 700 5 L 700 160 L 0 160 Z",
    gradientStart: "#ff3d00",
    fillPath: "M 0 150 Q 50 120 100 130 T 200 90 T 300 80 T 400 50 T 500 60 T 600 30 T 700 5 L 700 180 L 0 180 Z"
  }
};

const getChainIcon = (name: string) => {
  switch (name) {
    case "Ethereum":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-[#627EEA]">
          <path d="M12 2L4.5 12L12 16.5L19.5 12L12 2Z" fill="currentColor" fillOpacity="0.1" />
          <path d="M12 16.5V22L4.5 12L12 16.5Z" fill="currentColor" fillOpacity="0.1" />
          <path d="M12 22L19.5 12L12 16.5V22Z" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );
    case "Arbitrum":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-[#28A0F0]">
          <path d="M12 2L2 19.5H22L12 2Z" fill="currentColor" fillOpacity="0.1" />
          <path d="M12 7.5L6.5 16.5H17.5L12 7.5Z" fill="currentColor" fillOpacity="0.2" />
          <path d="M12 12.5L9.5 16.5H14.5L12 12.5Z" fill="currentColor" fillOpacity="0.3" />
        </svg>
      );
    case "Optimism":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-[#FF0420]">
          <circle cx="12" cy="12" r="10" fill="currentColor" />
          <text x="12" y="15" fill="white" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">OP</text>
        </svg>
      );
    case "Solana":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#14F195]">
          <path d="M4 6.5h16l-3.5 4.5H1L4 6.5z" />
          <path d="M20 13H4l3.5-4.5h15.5L20 13z" />
          <path d="M4 17.5h16l-3.5 4.5H1L4 17.5z" />
        </svg>
      );
    case "Base":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-[#0052FF]">
          <circle cx="12" cy="12" r="10" fill="currentColor" />
          <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="2.5" />
        </svg>
      );
    case "Polygon":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#8247E5]">
          <path d="M12 2L4 6.5v9L12 20l8-4.5v-9L12 2zm4 11.75l-4 2.25-4-2.25v-4.5l4-2.25 4 2.25v4.5z"/>
        </svg>
      );
    case "Avalanche":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-[#E84142]">
          <circle cx="12" cy="12" r="10" fill="currentColor" />
          <path d="M12 6L7 15H17L12 6ZM12 9.5L14.8 13.5H9.2L12 9.5Z" fill="white" />
        </svg>
      );
    case "BSC":
    case "BS":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#F3BA2F]">
          <path d="M12 2L8 6L12 10L16 6L12 2ZM6 8L2 12L6 16L10 12L6 8ZM18 8L14 12L18 16L22 12L18 8ZM12 14L8 18L12 22L16 18L12 14ZM12 10.5L10.5 12L12 13.5L13.5 12L12 10.5Z" />
        </svg>
      );
    default:
      return null;
  }
};

const appleStoreIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.84-.98 2.94 1.07.08 2.15-.52 2.81-1.33z"/>
  </svg>
);

const googlePlayIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
    <path d="M3 20.285V3.716c0-.986 1.074-1.594 1.92-1.082l13.717 8.284c.82.495.82 1.67 0 2.165L4.92 21.367c-.846.512-1.92-.096-1.92-1.082z" />
  </svg>
);

const chains = [
  { name: "Ethereum" },
  { name: "Arbitrum" },
  { name: "Optimism" },
  { name: "Solana" },
  { name: "Base" },
  { name: "Polygon" },
  { name: "Avalanche" },
  { name: "BSC" }
];

const outerNodes = [
  { 
    id: "metamask", 
    cx: 80, 
    cy: 30, 
    text: "MetaMask", 
    address: "0x71C...3a5f", 
    holdings: "$24,520", 
    count: "12 assets", 
    logo: (
      <g>
        <path d="M12 3l-7 5 2.5 1.5L12 6.5l4.5 3L19 8l-7-5z" fill="#E2761B" />
        <path d="M5 8l-1 5 4.5 1.5L5 8z" fill="#E2761B" />
        <path d="M19 8l1 5-4.5 1.5L19 8z" fill="#E2761B" />
        <path d="M8.5 14.5l3.5 3.5 3.5-3.5-3.5-1.5-3.5 1.5z" fill="#E2761B" />
        <circle cx="9" cy="11" r="1" fill="#FFFFFF" />
        <circle cx="15" cy="11" r="1" fill="#FFFFFF" />
      </g>
    ) 
  },
  { 
    id: "phantom", 
    cx: 120, 
    cy: 150, 
    text: "Phantom", 
    address: "B7xY...9aK4", 
    holdings: "$8,910", 
    count: "4 assets", 
    logo: (
      <path d="M12 4c-4.4 0-8 3.6-8 8v4c0 2.2 1.8 4 4 4s4-1.8 4-4v-4h4v4c0 2.2 1.8 4 4 4s4-1.8 4-4v-4c0-4.4-3.6-8-8-8zm-3 8c-.8 0-1.5-.7-1.5-1.5S8.2 9 9 9s1.5.7 1.5 1.5S9.8 12 9 12zm6 0c-.8 0-1.5-.7-1.5-1.5S14.2 9 15 9s1.5.7 1.5 1.5S15.8 12 15 12z" fill="#AB9FF2" />
    )
  },
  { 
    id: "ledger", 
    cx: 420, 
    cy: 40, 
    text: "Ledger", 
    address: "0x3b8...92ec", 
    holdings: "$142,300", 
    count: "18 assets", 
    logo: (
      <path d="M5 5h5v2H7v10h3v2H5V5zm14 0h-5v2h3v10h-3v2h5V5z" fill="#ffffff" />
    )
  },
  { 
    id: "coinbase", 
    cx: 380, 
    cy: 140, 
    text: "Coinbase", 
    address: "0x8fa...c91a", 
    holdings: "$4,120", 
    count: "3 assets", 
    logo: (
      <g>
        <circle cx="12" cy="12" r="10" fill="#0052ff" />
        <path d="M12 7c-2.8 0-5 2.2-5 5s2.2 5 5 5c2 0 3.7-1.2 4.5-3h-2.2c-.6.8-1.5 1.2-2.3 1.2-1.7 0-3-1.3-3-3s1.3-3 3-3c.8 0 1.7.4 2.3 1.2h2.2c-.8-1.8-2.5-3-4.5-3z" fill="white" />
      </g>
    )
  }
];


const faqItems = [
  {
    question: "Is my crypto safe with Wae Sync?",
    answer: "Absolutely. Wae Sync is completely read-only. We never ask for your private keys, seed phrases, or require smart contract signature authority. Your assets remain secure in your wallets; we only aggregate and display public blockchain data."
  },
  {
    question: "Which wallets and chains do you support?",
    answer: "We support over 100+ chains including all EVMs (Ethereum, Arbitrum, Optimism, Base, Polygon, Avalanche) and non-EVMs (Solana, Bitcoin, Cosmos). You can track any wallet address or connect MetaMask, Rabby, Phantom, Ledger, and Coinbase Wallet directly."
  },
  {
    question: "How often is my portfolio data synced?",
    answer: "Free tier syncs standard data every 10 minutes. Pro tier triggers updates every 60 seconds, while Elite accounts feature instant, real-time RPC socket triggers so you see balances update live as transactions land on-chain."
  },
  {
    question: "Can I execute trades and swaps directly within the dashboard?",
    answer: "Yes. Wae Sync aggregates liquidity from major decentralized exchange routes (such as 1inch, Uniswap, and Jupiter) to deliver zero-slippage swaps directly from your connected wallets."
  }
];

export default function CryptoLandingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [activeRange, setActiveRange] = useState("1M");
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredRouteNode, setHoveredRouteNode] = useState<string | null>(null);

  // Live Auditing Console Logs State
  const [logs, setLogs] = useState<string[]>([
    "INITIALIZING SECURE SESSION",
    "CONNECTING RPC PIPELINES",
    "SSL HANDSHAKE SUCCESSFUL",
    "STATUS: 100% SECURE"
  ]);

  useEffect(() => {
    const logPool = [
      "METAMASK CONNECT: SUCCESS",
      "PHANTOM KEY CHECK: PASS",
      "LEDGER WALLET RE-INDEXED",
      "COINBASE RPC SYNC: OK",
      "POLYGON BALANCE LOADED",
      "SOLANA RPC PING: 24ms",
      "ETHEREUM SHIELD PULSE: OK",
      "AES-256 SESSION ACTIVE",
      "ZERO CONTRACT WRITES SIGNED",
      "READ-ONLY INDEXER REFRESHED"
    ];
    const interval = setInterval(() => {
      setLogs((prev) => {
        const next = [...prev.slice(1)];
        const randomLog = logPool[Math.floor(Math.random() * logPool.length)];
        next.push(randomLog);
        return next;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);
  
  // Mobile Nav State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Card 3D Rotate Math
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = -(y / rect.height) * 15;
    const rotateY = (x / rect.width) * 15;
    setRotate({ x: rotateX, y: rotateY });
  };
  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  // Swap Widget States
  const [swapPay, setSwapPay] = useState("1");
  const [swapReceive, setSwapReceive] = useState("3240.50");
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapNotification, setSwapNotification] = useState("");
  const [payToken, setPayToken] = useState("ETH");
  const [receiveToken, setReceiveToken] = useState("USDC");

  const handleSwap = () => {
    setIsSwapping(true);
    setTimeout(() => {
      setIsSwapping(false);
      setSwapNotification("Swap Successful! Tx: 0x8f2d...b18c");
      setTimeout(() => setSwapNotification(""), 4000);
    }, 1500);
  };

  const flipTokens = () => {
    const tempPay = payToken;
    const tempPayVal = swapPay;
    setPayToken(receiveToken);
    setReceiveToken(tempPay);
    setSwapPay(swapReceive);
    setSwapReceive(tempPayVal);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  } as any;

  return (
    <div className="min-h-screen bg-[#030303] text-slate-100 font-sans selection:bg-[#ff4f12]/30 selection:text-white relative overflow-x-hidden">
      {/* Background Mesh Overlay */}
      <div className="absolute inset-0 grid-overlay pointer-events-none z-0" />

      {/* Left Margin Electronic Circuit Lines */}
      <div className="fixed left-0 top-0 bottom-0 w-[80px] pointer-events-none z-0 hidden xl:block select-none opacity-[0.25]">
        <svg className="w-full h-full" viewBox="0 0 100 1000" preserveAspectRatio="none" fill="none">
          {/* Faint Base Traces */}
          <path d="M 20,0 L 20,150 L 50,180 L 50,350 L 10,390 L 10,600 L 40,630 L 40,850 L 20,870 L 20,1000" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" />
          <path d="M 40,0 L 40,200 L 70,230 L 70,450 L 30,490 L 30,700 L 60,730 L 60,900 L 40,920 L 40,1000" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" />
          <path d="M 60,0 L 60,100 L 90,130 L 90,300 L 50,340 L 50,550 L 80,580 L 80,780 L 60,800 L 60,1000" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" />

          {/* Animating glow pulses */}
          <path d="M 20,0 L 20,150 L 50,180 L 50,350 L 10,390 L 10,600 L 40,630 L 40,850 L 20,870 L 20,1000" stroke="#ff4f12" strokeWidth="2" strokeLinecap="round" className="animate-circuit-1" />
          <path d="M 40,0 L 40,200 L 70,230 L 70,450 L 30,490 L 30,700 L 60,730 L 60,900 L 40,920 L 40,1000" stroke="#ff4f12" strokeWidth="2" strokeLinecap="round" className="animate-circuit-2" />
          <path d="M 60,0 L 60,100 L 90,130 L 90,300 L 50,340 L 50,550 L 80,580 L 80,780 L 60,800 L 60,1000" stroke="#ff4f12" strokeWidth="2" strokeLinecap="round" className="animate-circuit-3" />
        </svg>
      </div>

      {/* Right Margin Electronic Circuit Lines */}
      <div className="fixed right-0 top-0 bottom-0 w-[80px] pointer-events-none z-0 hidden xl:block select-none opacity-[0.25]">
        <svg className="w-full h-full" viewBox="0 0 100 1000" preserveAspectRatio="none" fill="none">
          {/* Faint Base Traces */}
          <path d="M 80,0 L 80,150 L 50,180 L 50,350 L 90,390 L 90,600 L 60,630 L 60,850 L 80,870 L 80,1000" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" />
          <path d="M 60,0 L 60,200 L 30,230 L 30,450 L 70,490 L 70,700 L 40,730 L 40,900 L 60,920 L 60,1000" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" />
          <path d="M 40,0 L 40,100 L 10,130 L 10,300 L 50,340 L 50,550 L 20,580 L 20,780 L 40,800 L 40,1000" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" />

          {/* Animating glow pulses */}
          <path d="M 80,0 L 80,150 L 50,180 L 50,350 L 90,390 L 90,600 L 60,630 L 60,850 L 80,870 L 80,1000" stroke="#ff4f12" strokeWidth="2" strokeLinecap="round" className="animate-circuit-1" />
          <path d="M 60,0 L 60,200 L 30,230 L 30,450 L 70,490 L 70,700 L 40,730 L 40,900 L 60,920 L 60,1000" stroke="#ff4f12" strokeWidth="2" strokeLinecap="round" className="animate-circuit-2" />
          <path d="M 40,0 L 40,100 L 10,130 L 10,300 L 50,340 L 50,550 L 20,580 L 20,780 L 40,800 L 40,1000" stroke="#ff4f12" strokeWidth="2" strokeLinecap="round" className="animate-circuit-3" />
        </svg>
      </div>
      
      {/* Header Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#ff4f12]/10 blur-[130px] rounded-full pointer-events-none z-0" />

      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-[#030303]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Visual Wave Sync Logo */}
            <div className="w-9 h-9 rounded-lg bg-[#0c0c12] border border-[#ff4f12]/30 flex items-center justify-center shadow-[0_0_15px_rgba(255,79,18,0.15)] overflow-hidden">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path d="M2 12c3-4 5-4 8 0s5 4 8 0" stroke="#ff4f12" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M6 12c3 4 5 4 8 0s5-4 8 0" stroke="#ff8f66" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center">
              Wae Sync<span className="text-[#ff4f12] text-xs font-mono ml-1.5 px-1.5 py-0.5 rounded bg-[#ff4f12]/10 border border-[#ff4f12]/20">v2.0</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#dashboard" className="hover:text-white transition-colors">Dashboard</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faqs" className="hover:text-white transition-colors">FAQs</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button className="px-5 py-2.5 text-sm font-medium rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#ff4f12]/50 text-white transition-all shadow-[0_0_15px_rgba(255,79,18,0.05)]">
              Launch App
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <button className="md:hidden p-2 text-slate-400 hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              className="absolute top-20 left-0 w-full bg-[#050508] border-b border-white/10 flex flex-col p-6 gap-4 z-40 md:hidden"
            >
              <a href="#dashboard" className="text-lg text-slate-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Dashboard</a>
              <a href="#features" className="text-lg text-slate-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#pricing" className="text-lg text-slate-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              <a href="#faqs" className="text-lg text-slate-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>FAQs</a>
              <button className="w-full py-3 mt-2 text-sm font-medium rounded-full bg-gradient-to-r from-[#ff5722] to-[#ff2b06] text-white">
                Launch App
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-20 px-6 flex flex-col items-center justify-center min-h-[85vh] z-10">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
          className="text-center max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Top Pill Alert */}
          <motion.div 
            variants={fadeIn} 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff4f12]/10 border border-[#ff4f12]/20 text-[#ff4f12] text-xs font-semibold tracking-wide mb-8 animate-pulse-glow"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4f12]" />
            DEFI MULTI-CHAIN PORTFOLIO TRACKING LIVE
          </motion.div>
          
          <motion.h1 
            variants={fadeIn} 
            className="text-5xl md:text-8xl font-black tracking-tight text-white mb-6 leading-[1.08] max-w-3xl"
          >
            Every asset and crypto you own, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5722] via-[#ff3d00] to-[#f97316] drop-shadow-[0_0_20px_rgba(255,79,18,0.2)]">
              clearly in one place.
            </span>
          </motion.h1>
          
          <motion.p 
            variants={fadeIn} 
            className="text-lg text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed"
          >
            Track your balances, portfolios, yields and activity across 100+ chains and exchanges in a single read-only workspace.
          </motion.p>
          
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#ff5722] to-[#ff2b06] text-white font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-[0_0_35px_rgba(255,79,18,0.3)]">
              Start Tracking <ChevronRight className="w-4 h-4" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors">
              View Demo
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Desktop App Mockup Panel */}
      <section id="dashboard" className="px-6 pb-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="rounded-3xl border border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl p-3 md:p-6 relative overflow-hidden shadow-[0_0_80px_rgba(255,79,18,0.06)]"
          >
            {/* Ambient Background Gradient for the mockup */}
            <div className="absolute top-0 right-0 w-[450px] h-[350px] bg-[#ff4f12]/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="border border-white/5 rounded-2xl overflow-hidden bg-[#050508]/90 flex flex-col md:flex-row h-[550px]">
              {/* Mockup Sidebar */}
              <div className="w-full md:w-56 border-r border-white/5 bg-[#08080c]/50 p-4 flex flex-col justify-between hidden md:flex">
                <div className="space-y-6">
                  {/* Sidebar Brand */}
                  <div className="flex items-center gap-2 px-2">
                    <div className="w-6 h-6 rounded bg-[#ff4f12]/10 border border-[#ff4f12]/20 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-[#ff4f12]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8a4 4 0 100 8" />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-white tracking-wide">Wae Sync Engine</span>
                  </div>
                  {/* Nav list */}
                  <div className="space-y-1.5">
                    {[
                      { name: "Overview", icon: <Layers className="w-4 h-4" />, active: true },
                      { name: "My Assets", icon: <Wallet className="w-4 h-4" /> },
                      { name: "Transactions", icon: <TrendingUp className="w-4 h-4" /> },
                      { name: "DeFi Yields", icon: <BarChart3 className="w-4 h-4" /> },
                      { name: "Settings", icon: <Compass className="w-4 h-4" /> }
                    ].map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          item.active 
                            ? 'bg-[#ff4f12]/10 border border-[#ff4f12]/20 text-[#ff4f12]' 
                            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                        }`}
                      >
                        {item.icon}
                        {item.name}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-2 border border-white/5 rounded-xl bg-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff4f12] to-amber-500 flex items-center justify-center text-xs font-bold text-black">
                    AF
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-white truncate">afnan.eth</p>
                    <p className="text-[9px] text-slate-500 font-mono truncate">0x9f...a18c</p>
                  </div>
                </div>
              </div>

              {/* Mockup Main View */}
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* View Header */}
                <div className="h-14 border-b border-white/5 px-6 flex items-center justify-between bg-[#08080c]/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-mono text-slate-400 tracking-wider">LIVE PORTFOLIO METRICS</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                    <span>Networks Connected: 5</span>
                    <span className="w-px h-3 bg-white/10" />
                    <span>Gas Price: <span className="text-[#ff4f12]">18 Gwei</span></span>
                  </div>
                </div>

                {/* View Content */}
                <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-thin">
                  {/* Balance / Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-white/5 bg-[#0c0c12]/60 backdrop-blur-sm">
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Portfolio Balance</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white">$14,834.12</span>
                        <span className="text-[10px] font-semibold text-emerald-500 flex items-center gap-0.5 bg-emerald-500/10 px-1 rounded">
                          +4.3% <ArrowUpRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-white/5 bg-[#0c0c12]/60 backdrop-blur-sm">
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Monthly DeFi Yields</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white">$248.50</span>
                        <span className="text-xs text-slate-400">APR ~ 8.4%</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-white/5 bg-[#0c0c12]/60 backdrop-blur-sm">
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Active Collateral</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white">$5,100.00</span>
                        <span className="text-xs text-slate-400">Locked in Aave</span>
                      </div>
                    </div>
                  </div>

                  {/* SVG Chart Panel */}
                  <div className="p-5 rounded-xl border border-white/5 bg-[#0c0c12]/60 backdrop-blur-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-[#ff4f12]"/> Performance Over Time
                        </h4>
                      </div>
                      {/* Interactive presets */}
                      <div className="flex items-center gap-1 bg-[#12121c] p-0.5 border border-white/5 rounded-lg">
                        {["1D", "1W", "1M", "1Y", "ALL"].map((range) => (
                          <button
                            key={range}
                            onClick={() => setActiveRange(range)}
                            className={`px-2 py-1 text-[9px] font-bold rounded transition-all ${
                              activeRange === range 
                                ? 'bg-[#ff4f12] text-white shadow-sm' 
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {range}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chart visual representation */}
                    <div className="h-44 w-full relative mt-4">
                      <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 700 180" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ff4f12" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#ff4f12" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Shaded Area */}
                        <motion.path 
                          key={`fill-${activeRange}`}
                          initial={{ d: chartDataPreset[activeRange].fillPath, opacity: 0 }}
                          animate={{ d: chartDataPreset[activeRange].fillPath, opacity: 1 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                          fill="url(#chartGradient)"
                        />
                        {/* Line */}
                        <motion.path 
                          key={`line-${activeRange}`}
                          initial={{ d: chartDataPreset[activeRange].path, pathLength: 0 }}
                          animate={{ d: chartDataPreset[activeRange].path, pathLength: 1 }}
                          transition={{ duration: 0.7, ease: "easeInOut" }}
                          fill="none" 
                          stroke={chartDataPreset[activeRange].gradientStart} 
                          strokeWidth="2.5" 
                        />
                      </svg>
                      {/* Fake hover details */}
                      <div className="absolute top-1/3 left-2/3 flex flex-col items-center -translate-x-1/2">
                        <div className="w-2 h-2 rounded-full bg-[#ff4f12] ring-4 ring-[#ff4f12]/20" />
                        <div className="bg-[#12121c] border border-white/10 px-2 py-1 rounded text-[8px] text-white font-mono mt-1 shadow-xl">
                          $14,834.12
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Asset holdings table */}
                  <div className="rounded-xl border border-white/5 overflow-hidden">
                    <div className="bg-white/2 border-b border-white/5 px-4 py-2.5 grid grid-cols-4 text-[10px] font-bold text-slate-400 tracking-wider">
                      <span>ASSET</span>
                      <span>BALANCE</span>
                      <span>PRICE</span>
                      <span className="text-right">HOLDINGS VALUE</span>
                    </div>
                    <div className="divide-y divide-white/5 font-mono text-[11px]">
                      {[
                        { token: "Bitcoin", symbol: "BTC", bal: "0.14 BTC", price: "$60,232.00", val: "$8,432.50", change: "+2.1%", positive: true },
                        { token: "Ethereum", symbol: "ETH", bal: "1.31 ETH", price: "$3,244.50", val: "$4,250.25", change: "+3.8%", positive: true },
                        { token: "Solana", symbol: "SOL", bal: "14.53 SOL", price: "$148.00", val: "$2,151.37", change: "+8.4%", positive: true },
                        { token: "USD Coin", symbol: "USDC", bal: "500 USDC", price: "$1.00", val: "$500.00", change: "0.0%", positive: null }
                      ].map((asset, idx) => (
                        <div key={idx} className="px-4 py-3 grid grid-cols-4 text-slate-300 hover:bg-white/2 transition-colors">
                          <span className="font-sans font-semibold text-white flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[9px] font-mono text-slate-400 border border-white/10">{asset.symbol[0]}</span>
                            {asset.token}
                          </span>
                          <span>{asset.bal}</span>
                          <span>{asset.price}</span>
                          <span className="text-right text-white font-semibold flex items-center justify-end gap-1.5">
                            {asset.val}
                            <span className={`text-[9px] px-1 rounded font-bold ${
                              asset.positive === true ? 'text-emerald-500 bg-emerald-500/10' : asset.positive === false ? 'text-rose-500 bg-rose-500/10' : 'text-slate-400 bg-slate-400/10'
                            }`}>
                              {asset.change}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Infinite Horizontal Rolling Ribbon */}
      <section className="py-8 bg-black/60 border-t border-b border-white/5 overflow-hidden z-10 relative">
        <div className="flex animate-marquee">
          {Array.from({ length: 4 }).map((_, repeatIdx) => (
            <div key={repeatIdx} className="flex gap-16 items-center pr-16">
              {chains.map((chain, chainIdx) => (
                <div key={chainIdx} className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {getChainIcon(chain.name)}
                  </div>
                  <span className="text-sm font-semibold tracking-wider text-slate-400 hover:text-white transition-colors cursor-default">
                    {chain.name}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Feature Section 1: Address Connectivity & Custom Layouts */}
      <section id="features" className="py-24 px-6 relative z-10 bg-gradient-to-b from-[#030303] via-[#050508] to-[#030303]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-xs uppercase font-bold text-[#ff4f12] tracking-widest bg-[#ff4f12]/10 border border-[#ff4f12]/20 px-3 py-1 rounded-full">
              INTERFACES
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-4 mb-4">
              Juggling wallets and chains is hard.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5722] to-[#ff2b06]">
                One-stop management.
              </span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              Stop switching tabs. Wae Sync aggregates your entire web3 presence into a single, cohesive dashboard with responsive performance details.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1 (Wide: Span 2 cols) */}
            <div className="md:col-span-2 p-8 rounded-3xl border border-white/5 bg-[#0a0a0f]/60 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between h-[380px] group hover:border-[#ff4f12]/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#ff4f12]/5 blur-[70px] rounded-full pointer-events-none" />
              <div>
                <span className="text-[10px] font-bold text-[#ff4f12] font-mono uppercase bg-[#ff4f12]/10 border border-[#ff4f12]/20 px-2 py-0.5 rounded">
                  Integration Node
                </span>
                <h3 className="text-2xl font-bold text-white mt-3 mb-2">Your Multi-Chain Home</h3>
                <p className="text-slate-400 text-xs leading-relaxed max-w-md">
                  Connect MetaMask, Phantom, Ledger, or simply track raw addresses. Wae Sync builds a centralized index mapping to real-time RPC node pipelines.
                </p>
              </div>

              {/* Glassmorphic Node Details Badge */}
              <AnimatePresence>
                {hoveredNode && (
                  (() => {
                    const activeNodeData = outerNodes.find(n => n.id === hoveredNode);
                    if (!activeNodeData) return null;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-6 right-8 px-4 py-2.5 rounded-2xl border border-white/10 bg-[#07070a]/90 backdrop-blur-md text-xs flex items-center gap-3 pointer-events-none z-20 shadow-[0_10px_35px_rgba(0,0,0,0.6)]"
                      >
                        <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center p-1">
                          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                            {activeNodeData.logo}
                          </svg>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-xs">{activeNodeData.text}</span>
                            <span className="text-[8px] px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-black">CONNECTED</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                            <span className="text-slate-300 font-medium">{activeNodeData.address}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-[#ff4f12] font-bold">{activeNodeData.holdings}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-500">{activeNodeData.count}</span>
                          </p>
                        </div>
                      </motion.div>
                    );
                  })()
                )}
              </AnimatePresence>

              {/* Neural Node Diagram Representation (Interactive) */}
              <div className="h-48 w-full relative flex items-center justify-center mt-2">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 180">
                  {/* Glowing Lines */}
                  {outerNodes.map((node) => {
                    const isHovered = hoveredNode === node.id;
                    return (
                      <g key={node.id}>
                        <line 
                          x1={250} 
                          y1={90} 
                          x2={node.cx} 
                          y2={node.cy} 
                          stroke={isHovered ? "rgba(255, 79, 18, 0.45)" : "rgba(255, 79, 18, 0.12)"} 
                          strokeWidth={isHovered ? 2 : 1.5} 
                          className="transition-all duration-300"
                        />
                        <line 
                          x1={250} 
                          y1={90} 
                          x2={node.cx} 
                          y2={node.cy} 
                          stroke="#ff4f12" 
                          strokeWidth={isHovered ? 2.5 : 1.5} 
                          className={isHovered ? "animate-dash-fast" : "animate-dash"} 
                        />
                      </g>
                    );
                  })}
                  
                  {/* Central Node - Wae Sync */}
                  <circle cx="250" cy="90" r="36" fill="#ff4f12" className="opacity-10 animate-pulse" />
                  <circle cx="250" cy="90" r="24" fill="#030303" stroke="#ff4f12" strokeWidth="1.5" />
                  {/* Wave Logo inside central node */}
                  <g transform="translate(238, 78)" className="pointer-events-none">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M2 12c3-4 5-4 8 0s5 4 8 0" stroke="#ff4f12" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M6 12c3 4 5 4 8 0s5-4 8 0" stroke="#ff8f66" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </g>
                  <text x="250" y="130" fill="white" fontSize="9" fontWeight="extrabold" textAnchor="middle" fontFamily="sans-serif" className="tracking-wider">WAE SYNC</text>

                  {/* Outer nodes */}
                  {outerNodes.map((node) => {
                    const isHovered = hoveredNode === node.id;
                    return (
                      <g 
                        key={node.id}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                      >
                        {/* Outer Glow Ring on Hover */}
                        <circle 
                          cx={node.cx} 
                          cy={node.cy} 
                          r={25} 
                          fill="rgba(255,79,18,0.03)" 
                          className={`transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`} 
                        />
                        <circle 
                          cx={node.cx} 
                          cy={node.cy} 
                          r={20} 
                          fill="#08080c" 
                          stroke={isHovered ? "#ff4f12" : "rgba(255,255,255,0.08)"} 
                          strokeWidth="1.5" 
                          className="transition-all duration-300" 
                        />
                        {/* Inner SVG Logo */}
                        <g transform={`translate(${node.cx - 12}, ${node.cy - 12})`} className="pointer-events-none">
                          <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                            {node.logo}
                          </svg>
                        </g>
                        {/* Text Label */}
                        <text 
                          x={node.cx} 
                          y={node.cy + 34} 
                          fill={isHovered ? "white" : "#94a3b8"} 
                          fontSize="9" 
                          fontWeight={isHovered ? "bold" : "semibold"} 
                          textAnchor="middle" 
                          fontFamily="sans-serif"
                          className="transition-colors duration-300"
                        >
                          {node.text}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Box 2 (All Your Coins) */}
            <div className="p-8 rounded-3xl border border-white/5 bg-[#0a0a0f]/60 backdrop-blur-sm flex flex-col justify-between h-[380px] group hover:border-[#ff4f12]/30 transition-all duration-300">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">All Your Coins</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Real-time price streams, precise balances, and asset drift indicators in a single custom table.
                </p>
              </div>

              {/* mini token layout */}
              <div className="space-y-2 mt-4">
                {[
                  { name: "Ethereum", code: "ETH", val: "$4,250", percent: "+3.8%" },
                  { name: "Solana", code: "SOL", val: "$2,151", percent: "+8.4%" },
                  { name: "Bitcoin", code: "BTC", val: "$8,432", percent: "+2.1%" }
                ].map((coin, idx) => (
                  <div key={idx} className="p-3 border border-white/5 rounded-xl bg-white/2 flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[10px] border border-white/10 font-bold">{coin.code}</span>
                      <div>
                        <p className="text-white text-xs">{coin.name}</p>
                        <p className="text-slate-500 text-[10px]">{coin.code}/USD</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white">{coin.val}</p>
                      <p className="text-emerald-500 text-[9px]">{coin.percent}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Box 3 (Yield Farming stats) */}
            <div className="p-8 rounded-3xl border border-white/5 bg-[#0a0a0f]/60 backdrop-blur-sm flex flex-col justify-between h-[380px] group hover:border-[#ff4f12]/30 transition-all duration-300">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Yield Farming</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Staking and pool APRs synced with liquidity layers to maximize compound yield interest.
                </p>
              </div>

              {/* Yield visualizer chart */}
              <div className="h-44 w-full flex items-end justify-between gap-3 px-2 mt-4">
                {[
                  { name: "Aave", APR: "4.5%", h: "40%" },
                  { name: "Lido", APR: "5.2%", h: "55%" },
                  { name: "Uniswap", APR: "12.8%", h: "100%", active: true },
                  { name: "Beefy", APR: "8.4%", h: "75%" }
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full relative rounded-lg overflow-hidden flex items-end h-32 bg-white/2 border border-white/5">
                      <motion.div 
                        initial={{ height: 0 }}
                        whileInView={{ height: item.h }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                        className={`w-full rounded-t-lg ${
                          item.active 
                            ? 'bg-gradient-to-t from-[#ff5722] to-[#ff2b06] shadow-[0_0_15px_rgba(255,79,18,0.2)]' 
                            : 'bg-white/10 hover:bg-[#ff4f12]/20 transition-colors'
                        }`}
                      />
                    </div>
                    <span className="text-[10px] text-white font-bold">{item.APR}</span>
                    <span className="text-[9px] text-slate-500 font-mono">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Box 4: Cross-Chain Smart Routing (Span 2 cols) */}
            <div className="md:col-span-2 p-8 rounded-3xl border border-white/5 bg-[#0a0a0f]/60 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between h-[380px] group hover:border-[#ff4f12]/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#ff4f12]/5 blur-[70px] rounded-full pointer-events-none" />
              
              {(() => {
                const routeNodes = [
                  {
                    id: "base",
                    cx: 40,
                    cy: 100,
                    r: 18,
                    color: "#0052ff",
                    glowColor: "rgba(0,82,255,0.4)",
                    label: "BASE",
                    details: {
                      title: "Base Network RPC",
                      status: "12ms (Direct Pipeline)",
                      meta: "Gas Fee: <$0.01"
                    },
                    logo: (
                      <>
                        <circle cx="12" cy="12" r="10" fill="#0052ff" />
                        <circle cx="12" cy="12" r="5" fill="#ffffff" />
                      </>
                    )
                  },
                  {
                    id: "uniswap",
                    cx: 110,
                    cy: 60,
                    r: 20,
                    color: "#ff007a",
                    glowColor: "rgba(255,0,122,0.4)",
                    label: "UNI V3",
                    details: {
                      title: "Uniswap V3 Pool",
                      status: "Slippage 0.02%",
                      meta: "Liquidity: $420M"
                    },
                    logo: (
                      <>
                        <path d="M12 4s2 3 5 3v2c-2 0-3-1-5-2-2 1-3 2-5 2V7c3 0 5-3 5-3z" fill="#ff007a"/>
                        <path d="M12 8c1.5 2 3.5 3 6.5 3v1.5c-2.5 0-4.5-1-6.5-2.5-2 1.5-4 2.5-6.5 2.5V11c3 0 5-1 6.5-3z" fill="#ff85c0"/>
                      </>
                    )
                  },
                  {
                    id: "bridge",
                    cx: 170,
                    cy: 140,
                    r: 20,
                    color: "#ff4f12",
                    glowColor: "rgba(255,79,18,0.4)",
                    label: "STARGATE",
                    details: {
                      title: "Stargate Router",
                      status: "Active (Instant Finality)",
                      meta: "Gas Saved: 84%"
                    },
                    logo: (
                      <>
                        <circle cx="12" cy="12" r="8" stroke="#ff4f12" strokeWidth="1.5" strokeDasharray="3 1" />
                        <polygon points="12,7 13.5,10.5 17,12 13.5,13.5 12,17 10.5,13.5 7,12 10.5,10.5" fill="#ff4f12" />
                      </>
                    )
                  },
                  {
                    id: "arbitrum",
                    cx: 240,
                    cy: 100,
                    r: 18,
                    color: "#28a0f0",
                    glowColor: "rgba(40,160,240,0.4)",
                    label: "ARB",
                    details: {
                      title: "Arbitrum One RPC",
                      status: "Indexed (Block 192K)",
                      meta: "Finalized State"
                    },
                    logo: (
                      <>
                        <path d="M12 3L3 18h18L12 3zm0 4l6 10H6l6-10z" fill="#28a0f0" />
                        <path d="M12 10l3 5H9l3-5z" fill="#ffffff" />
                      </>
                    )
                  }
                ];

                return (
                  <div className="flex flex-col md:flex-row justify-between gap-6 h-full w-full">
                    {/* Left side: route parameters */}
                    <div className="flex flex-col justify-between md:w-[45%] h-full">
                      <div>
                        <span className="text-[10px] font-bold text-[#ff4f12] font-mono uppercase bg-[#ff4f12]/10 border border-[#ff4f12]/20 px-2 py-0.5 rounded">
                          SMART ENGINE
                        </span>
                        <h3 className="text-2xl font-bold text-white mt-3 mb-2">Cross-Chain Routing</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          Wae Sync scans 100+ DEXs and cross-chain bridges in parallel to find the lowest fee path with minimal slippage.
                        </p>
                      </div>

                      {/* Route parameters details */}
                      <div className="h-32 flex flex-col justify-end">
                        <AnimatePresence mode="wait">
                          {!hoveredRouteNode ? (
                            <motion.div 
                              key="default"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.15 }}
                              className="space-y-2 bg-[#050508]/60 border border-white/5 p-4 rounded-2xl"
                            >
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Route Status</span>
                                <span className="text-emerald-400 font-bold flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                  OPTIMAL PATH FOUND
                                </span>
                              </div>
                              <div className="h-[1px] bg-white/5 w-full my-1.5" />
                              <div className="space-y-0.5 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-slate-400 font-mono">10,000 USDC</span>
                                  <span className="text-slate-500">Base</span>
                                </div>
                                <div className="flex justify-between text-[11px] text-slate-500 pl-2 border-l border-[#ff4f12]/30 my-0.5">
                                  <span>Uniswap V3 → Stargate</span>
                                  <span>Slippage: 0.05%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-white font-mono font-bold">9,994 USDC</span>
                                  <span className="text-slate-400 font-bold">Arbitrum</span>
                                </div>
                              </div>
                            </motion.div>
                          ) : (
                            (() => {
                              const activeNode = routeNodes.find(n => n.id === hoveredRouteNode);
                              if (!activeNode) return null;
                              return (
                                <motion.div 
                                  key={activeNode.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{ duration: 0.15 }}
                                  className="space-y-2 bg-[#050508]/60 border border-white/5 p-4 rounded-2xl"
                                >
                                  <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">Inspect Node</span>
                                    <span className="font-bold flex items-center gap-1.5 text-xs" style={{ color: activeNode.color }}>
                                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: activeNode.color }} />
                                      {activeNode.label}
                                    </span>
                                  </div>
                                  <div className="h-[1px] bg-white/5 w-full my-1.5" />
                                  <div className="space-y-1">
                                    <p className="text-white text-xs font-bold">{activeNode.details.title}</p>
                                    <p className="text-slate-400 text-[11px] font-mono">{activeNode.details.status}</p>
                                    <p className="text-slate-500 text-[10px] font-mono">{activeNode.details.meta}</p>
                                  </div>
                                </motion.div>
                              );
                            })()
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Right side: dynamic SVG route visualization */}
                    <div className="md:w-[55%] h-full flex items-center justify-center relative">
                      <div className="w-full h-full max-h-[220px] relative border border-white/5 rounded-2xl bg-[#050508]/40 overflow-hidden flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 280 200">
                          {/* Connecting Paths */}
                          {/* Base to Router */}
                          <path d="M 40 100 L 110 60" stroke="rgba(255,79,18,0.1)" strokeWidth="2.5" />
                          <path 
                            d="M 40 100 L 110 60" 
                            stroke="#ff4f12" 
                            strokeWidth="2.5" 
                            strokeDasharray="6 12" 
                            className={hoveredRouteNode ? "animate-dash-fast" : "animate-dash"} 
                          />
                          
                          {/* Router to Stargate */}
                          <path d="M 110 60 L 170 140" stroke="rgba(255,79,18,0.1)" strokeWidth="2.5" />
                          <path 
                            d="M 110 60 L 170 140" 
                            stroke="#ff8f66" 
                            strokeWidth="2.5" 
                            strokeDasharray="6 12" 
                            className={hoveredRouteNode ? "animate-dash-fast" : "animate-dash"} 
                          />

                          {/* Stargate to Arbitrum */}
                          <path d="M 170 140 L 240 100" stroke="rgba(255,79,18,0.1)" strokeWidth="2.5" />
                          <path 
                            d="M 170 140 L 240 100" 
                            stroke="#ff4f12" 
                            strokeWidth="2.5" 
                            strokeDasharray="6 12" 
                            className={hoveredRouteNode ? "animate-dash-fast" : "animate-dash"} 
                          />

                          {/* Alternate Path (Inactive) */}
                          <path d="M 40 100 L 170 140" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" strokeDasharray="3 3" />

                          {/* Dynamic Route Nodes */}
                          {routeNodes.map((node) => {
                            const isHovered = hoveredRouteNode === node.id;
                            return (
                              <g 
                                key={node.id}
                                className="cursor-pointer group/node"
                                onMouseEnter={() => setHoveredRouteNode(node.id)}
                                onMouseLeave={() => setHoveredRouteNode(null)}
                              >
                                {/* Glow Ring on Hover */}
                                {isHovered && (
                                  <motion.circle 
                                    initial={{ r: node.r - 2, opacity: 0 }}
                                    animate={{ r: node.r + 7, opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                    cx={node.cx} 
                                    cy={node.cy} 
                                    fill="none" 
                                    stroke={node.color} 
                                    strokeWidth="1"
                                    className="pointer-events-none"
                                  />
                                )}
                                
                                {/* Inner Circle Background */}
                                <circle 
                                  cx={node.cx} 
                                  cy={node.cy} 
                                  r={node.r} 
                                  fill="#08080c" 
                                  stroke={isHovered ? node.color : "rgba(255,255,255,0.08)"} 
                                  strokeWidth="1.5" 
                                  className="transition-all duration-300"
                                />

                                {/* Logo Asset */}
                                <g transform={`translate(${node.cx - 12}, ${node.cy - 12})`} className="pointer-events-none">
                                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                                    {node.logo}
                                  </svg>
                                </g>

                                {/* Small Label Text below */}
                                <text 
                                  x={node.cx} 
                                  y={node.cy + 30} 
                                  fill={isHovered ? "white" : "#64748b"} 
                                  fontSize="8" 
                                  fontWeight={isHovered ? "bold" : "semibold"} 
                                  textAnchor="middle" 
                                  fontFamily="sans-serif"
                                  className="transition-colors duration-300 pointer-events-none"
                                >
                                  {node.label}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 2: "One Platform, Total Control" */}
      <section className="py-24 px-6 relative z-10 border-t border-white/5 bg-[#030303]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white">One Platform, Total Control</h2>
            <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm">
              Everything you need to navigate the decentralized web with confidence, engineered for raw accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Unified Dashboard",
                desc: "See all your tokens, DeFi liquidity pools, yields, and NFTs in a single aggregated workspace.",
                icon: <Layers className="w-6 h-6 text-[#ff4f12]" />
              },
              {
                title: "Secure Connection",
                desc: "100% read-only access ensuring your private keys never leave your custody or get compromised.",
                icon: <Lock className="w-6 h-6 text-[#ff4f12]" />
              },
              {
                title: "Real-Time Sync",
                desc: "Instant websocket triggers update your wallet balances automatically as blocks propagate.",
                icon: <RefreshCw className="w-6 h-6 text-[#ff4f12]" />
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-white/5 bg-[#0a0a0f]/40 relative overflow-hidden group hover:border-[#ff4f12]/30 transition-colors duration-300">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section 3: "Amplified with modern capabilities" */}
      <section className="py-24 px-6 relative z-10 border-t border-white/5 bg-gradient-to-b from-[#030303] to-[#050508]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-xs uppercase font-bold text-[#ff4f12] tracking-widest bg-[#ff4f12]/10 border border-[#ff4f12]/20 px-3 py-1 rounded-full">
              POWER TOOLS
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-4 mb-4">
              Amplified with modern capabilities.
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              Power tools built for active web3 users who require millisecond performance and detailed asset indexes.
            </p>
          </div>

          {/* Grid layout of 5 cards (2 large top, 3 small bottom) */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-16">
            
            {/* Card 1: Advanced Security (Span 3) */}
            <div className="md:col-span-3 p-8 rounded-3xl border border-white/5 bg-[#0a0a0f]/60 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between h-[360px] group hover:border-[#10b981]/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-emerald-500/5 blur-[50px] rounded-full pointer-events-none" />
              <div>
                <h3 className="text-xl font-bold text-white mb-1.5 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" /> Advanced Security
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
                  Zero private-key storage. Cryptographically secure read-only monitoring connects directly to indexers.
                </p>
              </div>

              {/* security shield visualizer (Split Console & Radar) */}
              <div className="flex flex-col sm:flex-row items-center gap-6 h-48 mt-2 w-full">
                {/* Audit Console Log Feed */}
                <div className="w-full sm:w-1/2 bg-[#050508]/80 border border-white/5 rounded-2xl p-4 font-mono text-[9px] text-emerald-400/80 space-y-1.5 h-36 overflow-hidden relative shadow-inner">
                  {/* Blinking scan effect line */}
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-500/10 animate-[bounce_2s_infinite]" />
                  <div className="flex items-center justify-between border-b border-white/5 pb-1 mb-1.5">
                    <span className="text-[7.5px] text-slate-500 font-bold uppercase tracking-wider">Audit Console</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="space-y-1 select-none">
                    {logs.map((log, idx) => (
                      <p key={idx} className={`flex items-center gap-1.5 transition-all duration-300 ${idx === logs.length - 1 ? "text-emerald-400 font-bold" : "text-emerald-400/60"}`}>
                        <span className="text-emerald-500 font-bold">&gt;</span>
                        <span className="truncate">{log}</span>
                      </p>
                    ))}
                  </div>
                </div>

                {/* Rotating Scanner Radar & Shield */}
                <div className="w-full sm:w-1/2 flex items-center justify-center relative h-36">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    {/* Concentric Rotating Outer Radar */}
                    <div className="absolute inset-0 rounded-full border border-dashed border-emerald-500/20 animate-[spin_12s_linear_infinite] group-hover:border-emerald-500/40 transition-colors" />
                    <div className="absolute inset-3 rounded-full border border-emerald-500/10 animate-[spin_6s_linear_infinite_reverse]" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent animate-[spin_4s_linear_infinite] pointer-events-none" />
                    
                    {/* Inner Shield Logo */}
                    <div className="w-14 h-14 rounded-full bg-[#08080c] border border-emerald-500/20 group-hover:border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] transition-all duration-500 z-10">
                      <svg className="w-6 h-6 text-emerald-400 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>

                    {/* Blinking satellite dots */}
                    <div className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-emerald-400/80 animate-ping" />
                    <div className="absolute top-4 right-6 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Premium Card Mockup (Span 3) */}
            <div className="md:col-span-3 p-8 rounded-3xl border border-white/5 bg-[#0a0a0f]/60 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between h-[360px] group hover:border-[#ff4f12]/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#ff4f12]/5 blur-[60px] rounded-full pointer-events-none" />
              <div>
                <h3 className="text-xl font-bold text-white mb-1.5">Premium Card</h3>
                <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
                  Get the ultimate hardware tracking physical metal card to authorize secure read logins on-the-go.
                </p>
              </div>

              {/* 3D Rotatable debit card */}
              <div className="h-44 w-full relative flex items-center justify-center mt-2 perspective-1000">
                <motion.div 
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    rotateX: rotate.x,
                    rotateY: rotate.y,
                    transformStyle: "preserve-3d"
                  }}
                  className="w-64 h-38 rounded-2xl bg-gradient-to-br from-[#121218] via-[#050508] to-[#1a1a24] border border-white/10 p-5 flex flex-col justify-between shadow-2xl relative cursor-grab active:cursor-grabbing"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold font-mono tracking-widest text-[#ff4f12]">WAE SYNC PRESET</span>
                    <div className="w-7 h-5 bg-white/10 rounded flex items-center justify-center font-mono text-[8px] text-white">CHIP</div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-mono tracking-widest text-white/80">0x9f2d .... .... b18c</p>
                    <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 uppercase">
                      <span>Afnan Ahmad Tariq</span>
                      <span>05/29</span>
                    </div>
                  </div>

                  {/* Gloss accent */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                </motion.div>
              </div>
            </div>

            {/* Card 3: Wallet Analytics (Span 2) */}
            <div className="md:col-span-2 p-6 rounded-3xl border border-white/5 bg-[#0a0a0f]/60 backdrop-blur-sm flex flex-col justify-between h-[360px] group hover:border-[#ff4f12]/30 transition-all duration-300">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Wallet Analytics</h3>
                <p className="text-slate-400 text-xs">
                  Detailed distribution ratios of your multichain tokens.
                </p>
              </div>

              {/* Donut SVG Pie Chart */}
              <div className="h-40 w-full relative flex items-center justify-center mt-4">
                <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 36 36">
                  {/* Base Circle */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="3" />
                  {/* ETH: 45% */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ff4f12" strokeWidth="3.2" strokeDasharray="45 100" strokeDashoffset="0" />
                  {/* BTC: 35% */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#a855f7" strokeWidth="3.2" strokeDasharray="35 100" strokeDashoffset="-45" />
                  {/* SOL: 15% */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#14F195" strokeWidth="3.2" strokeDasharray="15 100" strokeDashoffset="-80" />
                  {/* USDC: 5% */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0052ff" strokeWidth="3.2" strokeDasharray="5 100" strokeDashoffset="-95" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                  <span className="text-sm font-bold text-white">45%</span>
                  <span className="text-[7px] text-slate-500 font-bold uppercase tracking-wider">ETH Ratio</span>
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-1 text-[9px] font-mono font-semibold text-slate-400 mt-2">
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#ff4f12]" /> ETH (45%)</div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" /> BTC (35%)</div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#14F195]" /> SOL (15%)</div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#0052ff]" /> USDC (5%)</div>
              </div>
            </div>

            {/* Card 4: Instant Swaps Widget (Span 2) */}
            <div className="md:col-span-2 p-6 rounded-3xl border border-white/5 bg-[#0a0a0f]/60 backdrop-blur-sm flex flex-col justify-between h-[360px] group hover:border-[#ff4f12]/30 transition-all duration-300">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Instant Swaps</h3>
                <p className="text-slate-400 text-xs">
                  DEX aggregation route logic live.
                </p>
              </div>

              {/* interactive swap UI */}
              <div className="p-3 border border-white/5 rounded-2xl bg-white/2 space-y-2 mt-3 relative">
                
                {/* Pay Row */}
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-500 font-bold block">YOU PAY</span>
                    <input 
                      type="number" 
                      value={swapPay} 
                      onChange={(e) => {
                        setSwapPay(e.target.value);
                        setSwapReceive((parseFloat(e.target.value || "0") * (payToken === "ETH" ? 3240.50 : 1/3240.50)).toFixed(2));
                      }} 
                      className="bg-transparent text-sm font-bold text-white outline-none w-20"
                    />
                  </div>
                  <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono font-bold text-white">{payToken}</span>
                </div>

                {/* Flip Divider */}
                <div className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 z-10">
                  <button 
                    onClick={flipTokens}
                    className="w-7 h-7 rounded-full bg-[#ff4f12] text-white flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    <ArrowDownUp className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Receive Row */}
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex justify-between items-center pt-4">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-500 font-bold block">YOU RECEIVE</span>
                    <span className="text-sm font-bold text-white font-mono block">{swapReceive}</span>
                  </div>
                  <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono font-bold text-white">{receiveToken}</span>
                </div>

                <button 
                  onClick={handleSwap} 
                  disabled={isSwapping}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ff5722] to-[#ff2b06] text-white font-semibold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  {isSwapping ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Swap Assets"}
                </button>
              </div>

              {/* Toast Success */}
              <div className="h-6 flex items-center justify-center">
                {swapNotification && (
                  <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    {swapNotification}
                  </span>
                )}
              </div>
            </div>

            {/* Card 5: DeFi Yields (Span 2) */}
            <div className="md:col-span-2 p-6 rounded-3xl border border-white/5 bg-[#0a0a0f]/60 backdrop-blur-sm flex flex-col justify-between h-[360px] group hover:border-[#ff4f12]/30 transition-all duration-300">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">DeFi Interest</h3>
                <p className="text-slate-400 text-xs">
                  Active APR percentages from liquidity pools.
                </p>
              </div>

              <div className="space-y-2 mt-4">
                {[
                  { pool: "ETH-USDC LP", dex: "Uniswap V3", apr: "18.4% APR" },
                  { pool: "SOL Liquid Staking", dex: "Jito SOL", apr: "7.8% APR" },
                  { pool: "DAI Supply Collateral", dex: "Maker DAO", apr: "5.1% APR" }
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 border border-white/5 rounded-xl bg-white/2 flex items-center justify-between text-[11px] font-semibold">
                    <div>
                      <p className="text-white text-xs">{item.pool}</p>
                      <p className="text-slate-500 text-[9px] font-mono">{item.dex}</p>
                    </div>
                    <span className="text-[#ff4f12] font-bold font-mono">{item.apr}</span>
                  </div>
                ))}
              </div>

              <div className="text-[10px] text-slate-500 font-mono text-center flex items-center justify-center gap-1">
                <CircleDot className="w-2.5 h-2.5 text-[#ff4f12]" /> Synchronized with liquidity nodes
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 relative z-10 border-t border-white/5 bg-[#030303]">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#ff4f12]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase font-bold text-[#ff4f12] tracking-widest bg-[#ff4f12]/10 border border-[#ff4f12]/20 px-3 py-1 rounded-full">
              PRICING PLANS
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-4 mb-4">
              Transparent pricing for everyone.
            </h2>
            <p className="text-slate-400 mt-2 max-w-xl mx-auto text-sm">
              Select the perfect plan for your tracking and analysis needs. Save 20% by subscribing annually.
            </p>

            {/* Toggle Switch */}
            <div className="inline-flex items-center gap-3 p-1 rounded-full bg-white/5 border border-white/10 mt-8">
              <button 
                onClick={() => setIsAnnual(false)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${!isAnnual ? 'bg-[#ff4f12] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setIsAnnual(true)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${isAnnual ? 'bg-[#ff4f12] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                Annually <span className="text-[9px] text-white bg-black/30 px-2 py-0.5 rounded-full font-black">SAVE 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Free Pack */}
            <div className="p-8 rounded-3xl border border-white/5 bg-[#0a0a0f]/40 backdrop-blur-sm flex flex-col justify-between h-[450px] group hover:border-[#ff4f12]/20 transition-all">
              <div>
                <span className="text-[10px] font-bold text-slate-500 font-mono tracking-widest uppercase">BASIC ACCESS</span>
                <h3 className="text-2xl font-extrabold text-white mt-2 mb-1">Free Pack</h3>
                <p className="text-slate-400 text-xs mb-6">Explore the baseline portfolio aggregates.</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-white">$0</span>
                  <span className="text-slate-500 text-xs">/month</span>
                </div>
                <ul className="space-y-3.5 text-xs text-slate-400 font-medium">
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#ff4f12]" /> Track up to 3 wallets</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#ff4f12]" /> Standard RPC sync (10m)</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#ff4f12]" /> Asset breakdown metrics</li>
                  <li className="flex items-center gap-2.5 text-slate-600"><X className="w-4 h-4" /> Priority RPC socket updates</li>
                </ul>
              </div>
              <button className="w-full py-3 rounded-full border border-slate-800 text-white font-bold text-xs hover:bg-white/5 transition-colors">
                Get Started
              </button>
            </div>

            {/* Pro Pack (Recommended Accent) */}
            <div className="p-8 rounded-3xl border border-[#ff4f12]/40 bg-[#0a0a0f] relative overflow-hidden flex flex-col justify-between h-[450px] shadow-[0_0_35px_rgba(255,79,18,0.15)] group hover:scale-[1.02] transition-all">
              <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-[#ff5722] to-[#ff2b06] text-black font-extrabold text-[9px] rounded-bl-xl tracking-widest font-mono uppercase">
                RECOMMENDED
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#ff4f12] font-mono tracking-widest uppercase">POWER INVESTOR</span>
                <h3 className="text-2xl font-extrabold text-white mt-2 mb-1">Pro Pack</h3>
                <p className="text-slate-400 text-xs mb-6">Designed for active web3 traders.</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-white">${isAnnual ? '15' : '19'}</span>
                  <span className="text-slate-500 text-xs">/month</span>
                </div>
                <ul className="space-y-3.5 text-xs text-slate-300 font-medium">
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#ff4f12]" /> Unlimited wallet tracking</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#ff4f12]" /> Priority RPC sync (60s)</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#ff4f12]" /> DeFi staking APR logs</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#ff4f12]" /> Tax exporter interface</li>
                </ul>
              </div>
              <button className="w-full py-3 rounded-full bg-gradient-to-r from-[#ff5722] to-[#ff2b06] text-white font-bold text-xs hover:brightness-110 transition-all shadow-[0_0_20px_rgba(255,79,18,0.2)]">
                Go Pro
              </button>
            </div>

            {/* Elite Pack */}
            <div className="p-8 rounded-3xl border border-white/5 bg-[#0a0a0f]/40 backdrop-blur-sm flex flex-col justify-between h-[450px] group hover:border-[#ff4f12]/20 transition-all">
              <div>
                <span className="text-[10px] font-bold text-slate-500 font-mono tracking-widest uppercase">INSTITUTIONAL</span>
                <h3 className="text-2xl font-extrabold text-white mt-2 mb-1">Elite Pack</h3>
                <p className="text-slate-400 text-xs mb-6">Tailored for fund teams and OTC managers.</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-white">${isAnnual ? '39' : '49'}</span>
                  <span className="text-slate-500 text-xs">/month</span>
                </div>
                <ul className="space-y-3.5 text-xs text-slate-400 font-medium">
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#ff4f12]" /> Unlimited wallets & teams</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#ff4f12]" /> Real-time RPC websocket sync</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#ff4f12]" /> Dedicated node endpoint</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#ff4f12]" /> Premium dashboard beta access</li>
                </ul>
              </div>
              <button className="w-full py-3 rounded-full border border-slate-800 text-white font-bold text-xs hover:bg-white/5 transition-colors">
                Go Elite
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Mobile App Promotion Section */}
      <section className="py-24 px-6 relative z-10 border-t border-white/5 bg-gradient-to-b from-[#030303] to-[#050508] overflow-hidden">
        {/* Left Side Section Circuits */}
        <div className="absolute left-0 top-0 bottom-0 w-[120px] pointer-events-none z-0 hidden lg:block select-none opacity-[0.25]">
          <svg className="w-full h-full" viewBox="0 0 100 600" preserveAspectRatio="none" fill="none">
            <path d="M 10,0 L 10,120 L 40,150 L 40,300 L 15,330 L 15,480 L 35,500 L 35,600" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" />
            <path d="M 30,0 L 30,160 L 60,190 L 60,350 L 35,380 L 35,520 L 55,540 L 55,600" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" />
            
            <path d="M 10,0 L 10,120 L 40,150 L 40,300 L 15,330 L 15,480 L 35,500 L 35,600" stroke="#ff4f12" strokeWidth="2" strokeLinecap="round" className="animate-circuit-1" />
            <path d="M 30,0 L 30,160 L 60,190 L 60,350 L 35,380 L 35,520 L 55,540 L 55,600" stroke="#ff4f12" strokeWidth="2" strokeLinecap="round" className="animate-circuit-2" />
          </svg>
        </div>

        {/* Right Side Section Circuits */}
        <div className="absolute right-0 top-0 bottom-0 w-[120px] pointer-events-none z-0 hidden lg:block select-none opacity-[0.25]">
          <svg className="w-full h-full" viewBox="0 0 100 600" preserveAspectRatio="none" fill="none">
            <path d="M 90,0 L 90,120 L 60,150 L 60,300 L 85,330 L 85,480 L 65,500 L 65,600" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" />
            <path d="M 70,0 L 70,160 L 40,190 L 40,350 L 65,380 L 65,520 L 45,540 L 45,600" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" />

            <path d="M 90,0 L 90,120 L 60,150 L 60,300 L 85,330 L 85,480 L 65,500 L 65,600" stroke="#ff4f12" strokeWidth="2" strokeLinecap="round" className="animate-circuit-1" />
            <path d="M 70,0 L 70,160 L 40,190 L 40,350 L 65,380 L 65,520 L 45,540 L 45,600" stroke="#ff4f12" strokeWidth="2" strokeLinecap="round" className="animate-circuit-2" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
          
          {/* Custom phone frame container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-56 h-96 rounded-[32px] border-4 border-slate-800 bg-black p-2 relative overflow-hidden mb-12 shadow-[0_0_50px_rgba(255,79,18,0.1)]"
          >
            {/* Camera notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-slate-800 rounded-full z-20 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
            </div>

            {/* Mobile Screen content */}
            <div className="w-full h-full rounded-[24px] overflow-hidden bg-[#030303] flex flex-col relative pt-5 p-3 text-left">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-[8px] font-bold text-[#ff4f12] font-mono">WAE SYNC MOBILE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>

              {/* Balance */}
              <p className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">NET WORTH</p>
              <h4 className="text-sm font-extrabold text-white mb-2">$14,834.12</h4>

              {/* Mini Sparkline */}
              <div className="h-10 w-full relative mb-3 bg-white/2 border border-white/5 rounded-lg overflow-hidden flex items-end">
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <path d="M 0 35 Q 20 15 40 25 T 80 10 T 100 5 L 100 40 L 0 40 Z" fill="rgba(255,79,18,0.08)" />
                  <path d="M 0 35 Q 20 15 40 25 T 80 10 T 100 5" fill="none" stroke="#ff4f12" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Tokens list */}
              <div className="space-y-1">
                {[
                  { sym: "ETH", val: "$4,250", change: "+3.8%" },
                  { sym: "SOL", val: "$2,151", change: "+8.4%" },
                  { sym: "BTC", val: "$8,432", change: "+2.1%" }
                ].map((item, idx) => (
                  <div key={idx} className="p-1.5 border border-white/5 rounded-lg bg-white/2 flex items-center justify-between text-[8px] font-bold font-mono">
                    <span className="text-white">{item.sym}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">{item.val}</span>
                      <span className="text-emerald-500 text-[7px]">{item.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Track on the go. Available for iOS and Android.
          </h2>
          <p className="text-slate-400 max-w-md mx-auto text-sm mb-8 leading-relaxed">
            Take your dashboards and RPC socket notification system wherever you travel. Setup takes 30 seconds.
          </p>

          {/* Download buttons */}
          <div className="flex gap-4 items-center flex-wrap justify-center">
            <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2.5 text-xs font-bold text-white">
              {appleStoreIcon} Download on App Store
            </button>
            <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2.5 text-xs font-bold text-white">
              {googlePlayIcon} Get it on Google Play
            </button>
          </div>

        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="py-24 px-6 relative z-10 border-t border-white/5 bg-[#030303]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase font-bold text-[#ff4f12] tracking-widest bg-[#ff4f12]/10 border border-[#ff4f12]/20 px-3 py-1 rounded-full">
              FAQS
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-4 mb-4">
              Frequently asked questions.
            </h2>
            <p className="text-slate-400 max-w-md mx-auto text-sm">
              Got queries? We have answers to help you navigate your multi-chain trackers.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <div 
                key={idx} 
                className="border border-white/5 rounded-2xl bg-[#0a0a0f]/40 backdrop-blur-sm overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left text-sm md:text-base font-bold text-white hover:bg-white/2 transition-colors"
                >
                  <span>{item.question}</span>
                  <Plus className={`w-4 h-4 text-[#ff4f12] transform transition-transform duration-300 ${
                    activeFAQ === idx ? 'rotate-45' : ''
                  }`} />
                </button>

                <AnimatePresence>
                  {activeFAQ === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 pt-1 text-slate-400 text-xs md:text-sm leading-relaxed border-t border-white/2">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#050508] py-16 px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          
          {/* Logo Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0c0c12] border border-[#ff4f12]/30 flex items-center justify-center shadow-[0_0_12px_rgba(255,79,18,0.15)] overflow-hidden">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M2 12c3-4 5-4 8 0s5 4 8 0" stroke="#ff4f12" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M6 12c3 4 5 4 8 0s5-4 8 0" stroke="#ff8f66" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white">Wae Sync</span>
            </div>
            <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
              The ultimate multi-chain dashboard for modern web3 investors and OTC managers who value precision.
            </p>
          </div>

          {/* Links Columns */}
          {[
            {
              title: "Product",
              links: ["Dashboard", "Asset Tracking", "DeFi Yields", "RPC Syncer"]
            },
            {
              title: "Company",
              links: ["About Us", "Press Kit", "Security Audit", "API Docs"]
            },
            {
              title: "Legal",
              links: ["Privacy Policy", "Terms of Service", "Node Agreements", "Licensing"]
            }
          ].map((col, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{col.title}</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                {col.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a href="#" className="hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        <div className="max-w-6xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[10px] text-slate-500 font-mono">
            © 2026 Wae Sync Inc. All rights reserved. Made for premium decentralized browsing experiences.
          </div>
          {/* Social Icons */}
          <div className="flex gap-4 items-center">
            {["Twitter", "GitHub", "Discord"].map((social, idx) => (
              <a 
                key={idx} 
                href="#" 
                className="text-xs font-bold text-slate-500 hover:text-[#ff4f12] transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}