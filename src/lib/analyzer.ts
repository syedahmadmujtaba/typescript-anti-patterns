
import ts from 'typescript';

export interface AntiPatternResult {
    id: string;
    name: string;
    description: string;
    line: number;
    message: string;
    severity: 'high' | 'medium' | 'low';
}

export function analyzeCode(code: string, filename: string = 'temp.ts'): AntiPatternResult[] {
    // Determine script kind based on file extension
    const scriptKind = filename.endsWith('.tsx')
        ? ts.ScriptKind.TSX
        : ts.ScriptKind.TS;

    const sourceFile = ts.createSourceFile(
        filename,
        code,
        ts.ScriptTarget.Latest,
        true,
        scriptKind
    );

    const results: AntiPatternResult[] = [];

    function visit(node: ts.Node) {
        // 1. Any Type Abuse
        if (node.kind === ts.SyntaxKind.AnyKeyword) {
            results.push({
                id: 'any-type',
                name: 'Any Type Abuse',
                description: 'Usage of "any" disables type checking.',
                line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
                message: 'Avoid using "any". It bypasses the type system.',
                severity: 'high',
            });
        }
        // Also check for implicit 'any' in variable declarations if possible, but pure AST check for 'any' keyword is safer for "Abuse"
        // The user requirement specifically mentions "processData(input: any): any" which is explicit.

        // 2. Long Parameter List (> 3 parameters)
        if (ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node) || ts.isArrowFunction(node) || ts.isFunctionExpression(node)) {
            if (node.parameters.length > 3) {
                results.push({
                    id: 'long-param-list',
                    name: 'Long Parameter List',
                    description: `Function has ${node.parameters.length} parameters.`,
                    line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
                    message: 'Consider refactoring to use a parameter object.',
                    severity: 'medium',
                });
            }
        }

        // 3. Magic Numbers (Non-0/1 numeric literals in logic)
        if (ts.isNumericLiteral(node)) {
            const value = Number(node.text);
            const parent = node.parent;

            // Ignore 0, 1, -1
            if (value !== 0 && value !== 1 && value !== -1) {
                // Filter out declarations (const X = 5) and property assignments (timeout: 5000) if we want to be strict "in logic"
                // However, "const TAX_RATE = 1.15" is the GOOD pattern. "price * 1.15" is the bad one.
                // So we should flag it if it's NOT in a VariableDeclaration or EnumMember or PropertyAssignment (maybe)
                // Let's stick to the prompt: "not part of a declaration". 

                const isDeclaration =
                    ts.isVariableDeclaration(parent) ||
                    ts.isEnumMember(parent) ||
                    ts.isPropertyAssignment(parent) || // often config
                    ts.isPropertyDeclaration(parent);

                if (!isDeclaration) {
                    results.push({
                        id: 'magic-number',
                        name: 'Magic Number',
                        description: `Unnamed numeric literal "${value}" found.`,
                        line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
                        message: 'Extract this number into a named constant.',
                        severity: 'low',
                    });
                }
            }
        }

        // 4. God Class (> 20 methods or > 300 lines)
        if (ts.isClassDeclaration(node)) {
            const methodCount = node.members.filter(m => ts.isMethodDeclaration(m)).length;
            const startLine = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line;
            const endLine = sourceFile.getLineAndCharacterOfPosition(node.getEnd()).line;
            const lineCount = endLine - startLine;

            if (methodCount > 20 || lineCount > 300) {
                results.push({
                    id: 'god-class',
                    name: 'God Class',
                    description: `Class has ${methodCount} methods and ${lineCount} lines.`,
                    line: startLine + 1,
                    message: 'This class does too much. Verify Single Responsibility Principle.',
                    severity: 'high',
                });
            }
        }

        // 5. Callback Hell (Nesting depth > 4)
        // We can detect this by checking the ancestry chain of arrow functions or function expressions
        if (ts.isArrowFunction(node) || ts.isFunctionExpression(node) || ts.isFunctionDeclaration(node)) {
            let depth = 0;
            let current: ts.Node = node.parent;
            while (current) {
                if (ts.isArrowFunction(current) || ts.isFunctionExpression(current) || ts.isFunctionDeclaration(current) || ts.isMethodDeclaration(current)) {
                    depth++;
                }
                current = current.parent;
            }

            if (depth > 4) {
                results.push({
                    id: 'callback-hell',
                    name: 'Callback Hell',
                    description: `Function nesting depth is ${depth}.`,
                    line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
                    message: 'Refactor using Promises or Async/Await to flatten the code.',
                    severity: 'high',
                });
            }
        }

        // 6. Non-Null Assertion Abuse (!)
        if (ts.isNonNullExpression(node)) {
            results.push({
                id: 'non-null-assertion',
                name: 'Non-Null Assertion',
                description: 'Usage of "!" operator.',
                line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
                message: 'Avoid non-null assertions. Use optional chaining or guard clauses.',
                severity: 'medium',
            });
        }

        ts.forEachChild(node, visit);
    }

    visit(sourceFile);

    // Deduplicate results if needed (sometimes AST traversal hits same node twice if logic overlaps, but here checks are distinct)
    return results;
}
