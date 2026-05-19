"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, Zap, ChevronRight, BarChart2, Globe } from 'lucide-react';

const CryptoLandingPage = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  // Animation variants for clean, staggered reveals
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 overflow-hidden">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-slate-950" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-white">Wave<span className="text-cyan-400">Sync</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
            <a href="#analytics" className="hover:text-cyan-400 transition-colors">Analytics</a>
            <a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a>
          </div>
          <button className="px-5 py-2.5 text-sm font-medium rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400/50 transition-all text-white shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]">
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 flex flex-col items-center justify-center min-h-[90vh]">
        {/* Abstract Neon Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none" />

        <motion.div 
          initial="hidden" animate="visible" variants={staggerContainer}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            v2.0 Trading Engine Live
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
            Predicting Crypto Waves, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Riding the Sentiment.
            </span>
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Our cutting-edge sentiment analysis service sifts through millions of data points in real-time to give you the ultimate trading advantage.
          </motion.p>
          
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
              Get Started <ChevronRight className="w-4 h-4" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-transparent border border-slate-700 text-white font-medium hover:bg-slate-800 transition-colors">
              View Analytics
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats/Visuals Section */}
      <section id="analytics" className="py-24 px-6 relative border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Precision in Every Data Point</h2>
            <p className="text-slate-400">Institutional-grade metrics delivered with minimalist clarity.</p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { title: "Predictive Accuracy", value: "87%", icon: <Activity />, color: "text-cyan-400", border: "hover:border-cyan-500/50" },
              { title: "Market Coverage", value: "99.9%", icon: <Globe />, color: "text-purple-400", border: "hover:border-purple-500/50" },
              { title: "Execution Speed", value: "12ms", icon: <Zap />, color: "text-pink-400", border: "hover:border-pink-500/50" }
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeUp} className={`p-8 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-sm transition-colors duration-500 group ${stat.border}`}>
                <div className={`w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${stat.color}`}>
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-bold text-white mb-2">{stat.value}</h3>
                <p className="text-slate-400 font-medium">{stat.title}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Mock Dashboard Visual */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="mt-16 rounded-3xl border border-white/10 bg-slate-900/80 p-4 md:p-8 relative overflow-hidden shadow-[0_0_50px_rgba(147,51,234,0.15)]"
          >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[100px] rounded-full" />
            <div className="flex items-center justify-between mb-8">
              <div>
                <h4 className="text-white font-semibold flex items-center gap-2"><BarChart2 className="w-5 h-5 text-cyan-400"/> Live Sentiment Tracking</h4>
                <p className="text-sm text-slate-400 mt-1">BTC/USD Social Volume vs Price Action</p>
              </div>
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              </div>
            </div>
            {/* Minimalist chart representation */}
            <div className="h-64 w-full flex items-end gap-2 relative">
              {Array.from({ length: 40 }).map((_, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-gradient-to-t from-cyan-500/20 to-purple-500/50 rounded-t-sm hover:from-cyan-400 hover:to-purple-400 transition-colors"
                  style={{ height: `${Math.random() * 80 + 20}%`, opacity: Math.random() * 0.5 + 0.5 }}
                />
              ))}
              {/* Fake trendline overlay */}
              <svg className="absolute inset-0 h-full w-full pointer-events-none" preserveAspectRatio="none">
                 <path d="M0,150 Q100,50 200,100 T400,80 T600,120 T800,40 T1000,90" fill="none" stroke="cyan" strokeWidth="2" strokeDasharray="4 4" className="opacity-50 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"/>
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 relative bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Affordable Excellence</h2>
            
            {/* Toggle */}
            <div className="inline-flex items-center gap-3 p-1 rounded-full bg-slate-900 border border-white/5">
              <button 
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!isAnnual ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${isAnnual ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                Annually <span className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full">Save 20%</span>
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Starter Plan */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-white/10 transition-colors"
            >
              <Shield className="w-8 h-8 text-slate-400 mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-2">Starter Pack</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">${isAnnual ? '79' : '99'}</span>
                <span className="text-slate-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 text-slate-400">
                <li className="flex items-center justify-between border-b border-white/5 pb-2"><span>Usage Options</span> <span className="text-white">Basic</span></li>
                <li className="flex items-center justify-between border-b border-white/5 pb-2"><span>Analytics Access</span> <span className="text-white">Standard</span></li>
                <li className="flex items-center justify-between pb-2"><span>Data Retention</span> <span className="text-white">1 Month</span></li>
              </ul>
              <button className="w-full py-3 rounded-full border border-slate-700 text-white font-medium hover:bg-slate-800 transition-colors">
                Get Started
              </button>
            </motion.div>

            {/* Pro Plan (Highlighted with Neon) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="p-8 rounded-3xl bg-slate-900 border border-cyan-500/40 relative overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.15)]"
            >
              <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                <Zap className="w-32 h-32 text-cyan-400" />
              </div>
              <Zap className="w-8 h-8 text-cyan-400 mb-6 relative z-10" />
              <h3 className="text-2xl font-semibold text-white mb-2 relative z-10">Full Pack</h3>
              <p className="text-sm text-cyan-400 mb-4 relative z-10">Get the full private access to all features</p>
              <div className="mb-6 relative z-10">
                <span className="text-4xl font-bold text-white">${isAnnual ? '159' : '199'}</span>
                <span className="text-slate-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 text-slate-300 relative z-10">
                <li className="flex items-center justify-between border-b border-white/5 pb-2"><span>Usage Options</span> <span className="text-white font-medium">Unlimited</span></li>
                <li className="flex items-center justify-between border-b border-white/5 pb-2"><span>Analytics Access</span> <span className="text-white font-medium">Advanced API</span></li>
                <li className="flex items-center justify-between pb-2"><span>Data Retention</span> <span className="text-white font-medium">1 Year</span></li>
              </ul>
              <button className="w-full py-3 rounded-full bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.4)] relative z-10">
                Get Started
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center">
              <Zap className="w-3 h-3 text-slate-950" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">Wave<span className="text-cyan-400">Sync</span></span>
          </div>
          <div className="text-sm text-slate-500">
            © 2026 WaveSync Analytics. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CryptoLandingPage;