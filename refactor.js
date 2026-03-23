const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const variations = [
    '(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")',
    "(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')",
    'process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"',
    "process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'"
];

const importStatement = 'import { API_BASE_URL } from "@/lib/api-config";\n';

function refactorFile(filePath) {
    if (filePath.endsWith('api-config.ts')) return; // skip the config itself
    
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    for (const v of variations) {
        content = content.split(v).join('API_BASE_URL');
    }

    if (content !== originalContent) {
        // Add import statement at the top, after "use client"; if it exists
        if (!content.includes('import { API_BASE_URL }')) {
            if (content.startsWith('"use client";') || content.startsWith("'use client';")) {
                const firstNewLine = content.indexOf('\n');
                content = content.slice(0, firstNewLine + 1) + importStatement + content.slice(firstNewLine + 1);
            } else {
                content = importStatement + content;
            }
        }
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Refactored: ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            refactorFile(fullPath);
        }
    }
}

walkDir(srcDir);
console.log('Done refactoring.');
