
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeSourceCode } from './actions';
import { AntiPatternResult } from '../lib/analyzer';
import CodeInput from '../components/CodeInput';
import PatternCard from '../components/PatternCard';
import { Wand2, Code2, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [code, setCode] = useState('');
  const [results, setResults] = useState<AntiPatternResult[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!code.trim()) return;

    setIsAnalyzing(true);
    setResults(null);

    // Server Action
    const data = await analyzeSourceCode(code);

    setResults(data);
    setIsAnalyzing(false);
  };

  return (
    <main className="min-h-screen lg:h-screen w-full lg:overflow-hidden flex flex-col p-6 md:p-8 lg:p-12 max-w-[1600px] mx-auto gap-8">

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="flex flex-col gap-2 shrink-0"
      >
        <div className="flex items-center gap-3">
          <img src="/icon.svg" alt="Logo" className="w-10 h-10 rounded-lg" />
          <h2 className="text-zinc-500 uppercase tracking-[0.3em] text-sm font-medium">Static Analysis Tool</h2>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[0.9]">
          The Code <span className="text-zinc-600">Refinery.</span>
        </h1>
      </motion.header>


      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:overflow-hidden min-h-0">

        {/* Left Col: Input */}
        <section className="flex flex-col gap-4 h-auto lg:h-full relative">
          <div className="h-[60vh] lg:h-auto lg:flex-1 min-h-0">
            <CodeInput value={code} onChange={setCode} disabled={isAnalyzing} />
          </div>

          <div className="flex justify-end shrink-0 w-full lg:w-auto">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAnalyze}
              disabled={isAnalyzing || !code}
              className="relative w-full lg:w-auto overflow-hidden group bg-white text-black px-8 py-4 rounded-full font-medium text-lg tracking-wide shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isAnalyzing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    >
                      <Wand2 className="w-5 h-5" />
                    </motion.div>
                    Refining...
                  </>
                ) : (
                  <>Analyze Code <Wand2 className="w-5 h-5" /></>
                )}
              </span>
              <div className="absolute inset-0 bg-electric-lime transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-electric-lime blur-xl" />
            </motion.button>
          </div>
        </section>


        {/* Right Col: Results */}
        <section className="relative h-auto lg:h-full flex flex-col min-h-0">
          <AnimatePresence mode="wait">

            {/* 1. Idle State */}
            {!results && !isAnalyzing && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden lg:flex absolute inset-0 flex-col items-center justify-center text-zinc-700 gap-4"
              >
                <Code2 className="w-16 h-16 opacity-20" />
                <p className="font-serif italic text-2xl opacity-40">Waiting for raw material...</p>
              </motion.div>
            )}

            {/* 2. Loading State */}
            {isAnalyzing && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-6 py-12 lg:py-0"
              >
                <div className="relative w-24 h-24">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-t-2 border-l-2 border-electric-lime/50 rounded-full"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-2 border-b-2 border-r-2 border-white/20 rounded-full"
                  />
                </div>
                <p className="text-zinc-500 tracking-widest text-xs uppercase animate-pulse">Running AST Analysis</p>
              </motion.div>
            )}

            {/* 3. Results State */}
            {results && (
              <motion.div
                key="results"
                className="flex flex-col gap-4 h-auto lg:h-full lg:overflow-y-auto custom-scrollbar lg:pr-4 pb-20 lg:pb-0"
              >
                <div className="flex items-center justify-between mb-4 shrink-0 pt-8 lg:pt-0 border-t border-white/5 lg:border-none">
                  <h3 className="text-2xl font-serif text-white">Detection Report</h3>
                  <div className="text-zinc-500 font-mono text-sm">
                    {results.length} Issues Found
                  </div>
                </div>

                {results.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-10 rounded-xl flex flex-col items-center text-center gap-4"
                  >
                    <CheckCircle2 className="w-16 h-16 text-electric-lime" />
                    <h4 className="text-xl text-white font-medium">Immaculate Code</h4>
                    <p className="text-zinc-400">No anti-patterns detected. This code meets the highest standards of craftsmanship.</p>
                  </motion.div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {results.map((result, idx) => (
                      <PatternCard key={idx} result={result} index={idx} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}
