'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileCode, X, CheckCircle2 } from 'lucide-react';
import { useState, useCallback } from 'react';

interface FileUploadProps {
    onFileLoad: (content: string, filename: string) => void;
    disabled?: boolean;
}

interface UploadedFile {
    name: string;
    size: number;
    content: string;
    lines: number;
}

export default function FileUpload({ onFileLoad, disabled }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
    const [error, setError] = useState<string>('');

    const validateFile = (file: File): string | null => {
        // Check file extension
        if (!file.name.match(/\.(tsx?|ts)$/i)) {
            return 'Only .ts and .tsx files are allowed';
        }

        // Check file size (max 1MB)
        if (file.size > 1024 * 1024) {
            return 'File size must be less than 1MB';
        }

        return null;
    };

    const processFile = useCallback(async (file: File) => {
        setError('');

        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const content = await file.text();
            const lines = content.split('\n').length;

            const fileData = {
                name: file.name,
                size: file.size,
                content,
                lines,
            };

            setUploadedFile(fileData);
            onFileLoad(content, file.name);
        } catch (err) {
            setError('Failed to read file');
            console.error(err);
        }
    }, [onFileLoad]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (disabled) return;

        const file = e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    }, [disabled, processFile]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) {
            setIsDragging(true);
        }
    }, [disabled]);

    const handleDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    }, [processFile]);

    const handleClear = useCallback(() => {
        setUploadedFile(null);
        setError('');
    }, []);

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative w-full h-full glass-panel rounded-2xl overflow-hidden"
        >
            <AnimatePresence mode="wait">
                {!uploadedFile ? (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex flex-col items-center justify-center"
                    >
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            className={`
                                relative w-full h-full flex flex-col items-center justify-center gap-6 p-8
                                border-2 border-dashed rounded-2xl transition-all duration-300
                                ${isDragging
                                    ? 'border-electric-lime bg-electric-lime/5 scale-[0.98]'
                                    : 'border-zinc-800 hover:border-zinc-700'
                                }
                                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                            `}
                        >
                            <input
                                type="file"
                                accept=".ts,.tsx"
                                onChange={handleFileInput}
                                disabled={disabled}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            />

                            <motion.div
                                animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Upload className={`w-16 h-16 ${isDragging ? 'text-electric-lime' : 'text-zinc-600'} transition-colors`} />
                            </motion.div>

                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-serif text-white">
                                    {isDragging ? 'Drop it here' : 'Upload TypeScript File'}
                                </h3>
                                <p className="text-zinc-500 text-sm">
                                    Drag & drop or click to browse
                                </p>
                                <p className="text-zinc-700 text-xs font-mono">
                                    .ts • .tsx • max 1MB
                                </p>
                            </div>

                            {/* Decorative glow */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-electric-lime opacity-0 blur-3xl group-hover:opacity-5 transition-opacity duration-700 pointer-events-none" />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 text-red-400 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute inset-0 flex flex-col p-6 overflow-hidden"
                    >
                        {/* File header bar */}
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5 shrink-0">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-lg bg-electric-lime/10 flex items-center justify-center shrink-0">
                                    <FileCode className="w-5 h-5 text-electric-lime" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-white font-medium truncate max-w-[200px]">
                                        {uploadedFile.name}
                                    </h3>
                                    <p className="text-zinc-600 text-xs font-mono">
                                        {formatFileSize(uploadedFile.size)} • {uploadedFile.lines} lines
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleClear}
                                disabled={disabled}
                                className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-red-500/20 border border-zinc-800 hover:border-red-500/30 flex items-center justify-center transition-colors disabled:opacity-50 shrink-0"
                            >
                                <X className="w-4 h-4 text-zinc-500 hover:text-red-400" />
                            </motion.button>
                        </div>

                        {/* File preview */}
                        <div className="flex-1 bg-black/20 rounded-xl p-4 overflow-auto custom-scrollbar min-h-0">
                            <pre className="text-xs text-zinc-400 font-mono leading-relaxed">
                                {uploadedFile.content}
                            </pre>
                        </div>

                        {/* Success indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 flex items-center gap-2 text-electric-lime text-sm shrink-0"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Ready to analyze</span>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
