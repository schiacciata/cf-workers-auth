import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const readmePath = join(process.cwd(), 'README.md');
const readmeContent = readFileSync(readmePath, 'utf-8');

console.log(`[+] Read README.md (${readmeContent.length} chars)`);

const classesPath = join(process.cwd(), 'src', 'core');
const classes = readdirSync(classesPath)
    .filter(c => c !== 'Base.ts')
    .map(c => `• [${c}](src/core/${c})\n`)
    .join('\n');

console.log('[+] Found classes:\n\n', classes);

const classesSpace = readmeContent
    .split('**Avaible classes:**')
    .pop()
    ?.split('# Installation')
    [0] || '';

writeFileSync(readmePath, readmeContent.replace(classesSpace, `\n\n${classes}\n`));

console.log('[+] Updated', readmePath);