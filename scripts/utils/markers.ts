/**
 * Marker-based section replacement in Markdown files.
 *
 * Markers follow the pattern:
 *   <!-- STATUS:BEGIN -->
 *   ...generated content...
 *   <!-- STATUS:END -->
 *
 * If markers are absent the content is appended at the end of the file.
 */

export function makeMarker(id: string): { begin: string; end: string } {
  return {
    begin: `<!-- ${id}:BEGIN -->`,
    end: `<!-- ${id}:END -->`,
  };
}

export function replaceMarkerSection(
  fileContent: string,
  markerId: string,
  newContent: string,
): string {
  const { begin, end } = makeMarker(markerId);
  const pattern = new RegExp(
    `${escapeRegex(begin)}[\\s\\S]*?${escapeRegex(end)}`,
    "m",
  );

  const replacement = `${begin}\n${newContent.trim()}\n${end}`;

  if (pattern.test(fileContent)) {
    return fileContent.replace(pattern, replacement);
  }

  // Markers absent — append as new section
  return `${fileContent.trimEnd()}\n\n${replacement}\n`;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
