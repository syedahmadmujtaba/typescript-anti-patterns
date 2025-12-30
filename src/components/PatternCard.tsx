
'use client';

import { motion } from 'framer-motion';
import { AntiPatternResult } from '@/lib/analyzer';
import { AlertTriangle, XCircle, Info, Zap } from 'lucide-react';
import clsx from 'clsx';

interface PatternCardProps {
    result: AntiPatternResult;
    index: number;
}

export default function PatternCard({ result, index }: PatternCardProps) {
    const isHigh = result.severity === 'high';
    const isMedium = result.severity === 'medium';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: 'backOut' }}
            whileHover={{ scale: 1.02 }}
            className={clsx(
                "glass-panel p-6 rounded-xl relative overflow-hidden group border",
                isHigh ? "border-red-500/20" : isMedium ? "border-orange-500/20" : "border-blue-500/20"
            )}
        >
            {/* Glow Effect */}
            <div
                className={clsx(
                    "absolute top-0 right-0 w-32 h-32 bg-linear-to-bl opacity-10 blur-2xl transition-opacity group-hover:opacity-20",
                    isHigh ? "from-red-500" : isMedium ? "from-orange-500" : "from-blue-500"
                )}
            />

            <div className="flex items-start justify-between gap-4 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        {isHigh ? <XCircle className="w-5 h-5 text-red-400" /> :
                            isMedium ? <AlertTriangle className="w-5 h-5 text-orange-400" /> :
                                <Info className="w-5 h-5 text-blue-400" />}

                        <h3 className="font-serif text-xl font-medium tracking-wide text-white">
                            {result.name}
                        </h3>

                        <span className="text-xs font-mono text-zinc-500 px-2 py-0.5 rounded-full border border-zinc-800 bg-black/40">
                            Line {result.line}
                        </span>
                    </div>

                    <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
                        {result.description}
                    </p>

                    <div className="mt-4 pl-3 border-l-2 border-zinc-800">
                        <p className={clsx(
                            "text-sm font-medium",
                            isHigh ? "text-red-300" : isMedium ? "text-orange-300" : "text-blue-300"
                        )}>
                            fix: {result.message}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <span className={clsx(
                        "text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded bg-opacity-10",
                        isHigh ? "bg-red-500 text-red-500" : isMedium ? "bg-orange-500 text-orange-500" : "bg-blue-500 text-blue-500"
                    )}>
                        {result.severity}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
