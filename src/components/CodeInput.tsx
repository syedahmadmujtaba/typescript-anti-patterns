
'use client';

import { motion } from 'framer-motion';

interface CodeInputProps {
    value: string;
    onChange: (val: string) => void;
    disabled?: boolean;
}

export default function CodeInput({ value, onChange, disabled }: CodeInputProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative w-full h-full glass-panel rounded-2xl p-1 group focus-within:ring-2 focus-within:ring-electric-lime/50 transition-all duration-500"
        >
            <div className="absolute inset-x-0 top-0 h-8 bg-black/20 rounded-t-xl flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <div className="ml-4 text-xs text-zinc-600 font-mono">input.ts</div>
            </div>

            <textarea
                className="w-full h-full pt-10 pb-4 px-4 bg-transparent text-sm text-zinc-300 font-mono resize-none focus:outline-none placeholder:text-zinc-700 custom-scrollbar"
                spellCheck={false}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                placeholder="// Paste your TypeScript code here to analyze..."
            />

            {/* Decorative corner glow */}
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-electric-lime opacity-0 blur-3xl group-focus-within:opacity-10 transition-opacity duration-700 pointer-events-none" />
        </motion.div>
    );
}
