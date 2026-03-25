import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const ROOT_DIR = process.cwd();
const TARGET_EXTENSIONS = new Set(['.tsx', '.ts', '.jsx', '.js', '.md', '.html']);
const SKIP_DIRECTORIES = new Set([
  '.git',
  '.next',
  '.turbo',
  'coverage',
  'dist',
  'build',
  'node_modules',
  'out',
]);

const COLORS = {
  red: '\u001b[31m',
  yellow: '\u001b[33m',
  cyan: '\u001b[36m',
  gray: '\u001b[90m',
  reset: '\u001b[0m',
};

const UMLAUTS = {
  aeLower: '\u00E4',
  aeUpper: '\u00C4',
  oeLower: '\u00F6',
  oeUpper: '\u00D6',
  ueLower: '\u00FC',
  ueUpper: '\u00DC',
  sz: '\u00DF',
};

const MOJIBAKE = {
  aeLower: '\u00C3\u00A4',
  aeUpper: '\u00C3\u201E',
  oeLower: '\u00C3\u00B6',
  oeUpper: '\u00C3\u2013',
  ueLower: '\u00C3\u00BC',
  ueUpper: '\u00C3\u0153',
  sz: '\u00C3\u0178',
};

const PATTERNS = [
  { regex: new RegExp(MOJIBAKE.aeLower, 'g'), reason: `Mojibake for ${UMLAUTS.aeLower}` },
  { regex: new RegExp(MOJIBAKE.aeUpper, 'g'), reason: `Mojibake for ${UMLAUTS.aeUpper}` },
  { regex: new RegExp(MOJIBAKE.oeLower, 'g'), reason: `Mojibake for ${UMLAUTS.oeLower}` },
  { regex: new RegExp(MOJIBAKE.oeUpper, 'g'), reason: `Mojibake for ${UMLAUTS.oeUpper}` },
  { regex: new RegExp(MOJIBAKE.ueLower, 'g'), reason: `Mojibake for ${UMLAUTS.ueLower}` },
  { regex: new RegExp(MOJIBAKE.ueUpper, 'g'), reason: `Mojibake for ${UMLAUTS.ueUpper}` },
  { regex: new RegExp(MOJIBAKE.sz, 'g'), reason: `Mojibake for ${UMLAUTS.sz}` },
  { regex: /&auml;/g, reason: `HTML entity instead of ${UMLAUTS.aeLower}` },
  { regex: /&ouml;/g, reason: `HTML entity instead of ${UMLAUTS.oeLower}` },
  { regex: /&uuml;/g, reason: `HTML entity instead of ${UMLAUTS.ueLower}` },
  { regex: /&amp;auml;/g, reason: `Double-encoded HTML entity for ${UMLAUTS.aeLower}` },
  { regex: /&amp;ouml;/g, reason: `Double-encoded HTML entity for ${UMLAUTS.oeLower}` },
  { regex: /\uFFFD/g, reason: 'Replacement character indicates decoding issue' },
];

function walk(directory, files) {
  let entries = [];

  try {
    entries = readdirSync(directory, { withFileTypes: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      `${COLORS.yellow}Skipping unreadable directory:${COLORS.reset} ${relative(ROOT_DIR, directory) || directory} ${COLORS.gray}(${message})${COLORS.reset}`,
    );
    return;
  }

  for (const entry of entries) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      if (!SKIP_DIRECTORIES.has(entry.name)) {
        walk(fullPath, files);
      }
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (TARGET_EXTENSIONS.has(extname(entry.name))) {
      files.push(fullPath);
    }
  }
}

function normalizeLine(line) {
  return line.replace(/\t/g, '  ').trim();
}

function collectMatches(filePath) {
  let source = '';

  try {
    source = readFileSync(filePath, 'utf8');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      `${COLORS.yellow}Skipping unreadable file:${COLORS.reset} ${relative(ROOT_DIR, filePath)} ${COLORS.gray}(${message})${COLORS.reset}`,
    );
    return [];
  }

  const matches = [];
  const lines = source.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const pattern of PATTERNS) {
      pattern.regex.lastIndex = 0;
      if (!pattern.regex.test(line)) {
        continue;
      }

      matches.push({
        file: relative(ROOT_DIR, filePath),
        line: index + 1,
        text: normalizeLine(line),
        reason: pattern.reason,
      });
    }
  });

  return matches;
}

function main() {
  const files = [];
  walk(ROOT_DIR, files);

  const allMatches = files.flatMap((filePath) => collectMatches(filePath));

  if (allMatches.length === 0) {
    console.log(`${COLORS.cyan}No German umlaut formatting issues found.${COLORS.reset}`);
    process.exit(0);
  }

  for (const match of allMatches) {
    console.log(`${COLORS.red}[UMLAUT ERROR]${COLORS.reset}`);
    console.log(`file: ${match.file}`);
    console.log(`line: ${match.line}`);
    console.log(`text: ${match.text}`);
    console.log(`${COLORS.gray}reason: ${match.reason}${COLORS.reset}`);
    console.log('');
  }

  console.error(
    `${COLORS.red}Found ${allMatches.length} German umlaut formatting issue(s).${COLORS.reset}`,
  );
  process.exit(1);
}

main();
