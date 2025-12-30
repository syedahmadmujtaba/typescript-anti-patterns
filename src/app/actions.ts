
'use server';

import { analyzeCode, AntiPatternResult } from '../lib/analyzer';

export async function analyzeSourceCode(code: string): Promise<AntiPatternResult[]> {
    // Simulate a slight delay for the "premium feel" (so the loader can be seen)
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
        const results = analyzeCode(code);
        return results;
    } catch (error) {
        console.error('Analysis failed:', error);
        return [];
    }
}
