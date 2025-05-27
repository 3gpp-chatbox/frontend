import { highlightJson } from "../utils/jsonHighlighter";
import { highlightMermaid } from "../utils/MermaidHighlighter";
import { diffLines } from "diff";

// Helper function to normalize Mermaid lines for comparison
const normalizeMermaidLine = (line) => {
  return line
    .trim()
    .replace(/\s+/g, ' ')  // Normalize whitespace
    .replace(/["']/g, '"') // Normalize quotes
    .replace(/->/g, '-->') // Normalize arrows
    .replace(/-->/g, '-->') // Ensure consistent arrow format
    .replace(/\[.*?\]/g, '[]') // Normalize node content
    .replace(/\(.*?\)/g, '()'); // Normalize edge labels
};

export const findDifferences = (oldContent, newContent) => {
  if (!oldContent || !newContent) return [];
  
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');
  const differences = [];
  
  // Create a mapping of normalized lines to their original content
  const lineMap = new Map();
  oldLines.forEach((line, index) => {
    const normalizedLine = normalizeMermaidLine(line);
    if (normalizedLine) {
      lineMap.set(normalizedLine, { index, content: line });
    }
  });
  
  // Find added and modified lines
  newLines.forEach((line, newIndex) => {
    const normalizedLine = normalizeMermaidLine(line);
    const oldLine = lineMap.get(normalizedLine);
    
    if (!oldLine) {
      // Line was added or modified
      differences.push({
        type: 'added',
        line: newIndex,
        content: line,
        isMermaid: true
      });
    } else {
      // Check if the actual content is different despite normalized form being same
      if (oldLine.content !== line) {
        differences.push({
          type: 'modified',
          line: newIndex,
          content: line,
          oldContent: oldLine.content,
          isMermaid: true
        });
      }
    }
  });
  
  // Find removed lines
  oldLines.forEach((line, oldIndex) => {
    const normalizedLine = normalizeMermaidLine(line);
    if (!newLines.some(newLine => normalizeMermaidLine(newLine) === normalizedLine)) {
      differences.push({
        type: 'removed',
        line: oldIndex,
        content: line,
        isMermaid: true
      });
    }
  });
  
  return differences;
};

export const applyDiffHighlighting = (content, differences, type = 'json') => {
  const lines = content.split('\n');
  const highlighter = type === 'mermaid' ? highlightMermaid : highlightJson;
  
  return lines.map((line, index) => {
    const diff = differences.find(d => d.line === index);
    const highlightedLine = highlighter(line);
    
    if (diff) {
      let diffClass = '';
      let diffContent = highlightedLine;
      
      if (diff.type === 'added') {
        diffClass = 'diff-added';
      } else if (diff.type === 'removed') {
        diffClass = 'diff-removed';
      } else if (diff.type === 'modified') {
        diffClass = 'diff-modified';
        // For modified lines, show both old and new content
        diffContent = `
          <div class="diff-old">${highlighter(diff.oldContent)}</div>
          <div class="diff-new">${highlightedLine}</div>
        `;
      }
      
      return `<div class="code-line">
        <div class="diff-overlay ${diffClass}">
          ${diffContent}
        </div>
      </div>`;
    }
    
    return `<div class="code-line">${highlightedLine}</div>`;
  }).join('\n');
};

/**
 * Computes a unified line-by-line diff for side-by-side comparison using the 'diff' library.
 * @param {string} oldContent
 * @param {string} newContent
 * @returns {Array<{left: string|null, right: string|null, type: string}>}
 */
export function computeLineDiffs(oldContent, newContent) {
  const diffs = diffLines(oldContent || '', newContent || '');
  const result = [];
  let i = 0;
  while (i < diffs.length) {
    const part = diffs[i];
    if (part.removed && i + 1 < diffs.length && diffs[i + 1].added) {
      // Collapse removed + added into modified
      const removedLines = part.value.split('\n');
      const addedLines = diffs[i + 1].value.split('\n');
      // Remove trailing empty lines
      if (removedLines[removedLines.length - 1] === '') removedLines.pop();
      if (addedLines[addedLines.length - 1] === '') addedLines.pop();
      const maxLen = Math.max(removedLines.length, addedLines.length);
      for (let j = 0; j < maxLen; j++) {
        result.push({
          left: removedLines[j] || null,
          right: addedLines[j] || null,
          type: 'modified'
        });
      }
      i += 2;
    } else if (part.added) {
      const lines = part.value.split('\n');
      if (lines[lines.length - 1] === '') lines.pop();
      lines.forEach(line => result.push({ left: null, right: line, type: 'added' }));
      i++;
    } else if (part.removed) {
      const lines = part.value.split('\n');
      if (lines[lines.length - 1] === '') lines.pop();
      lines.forEach(line => result.push({ left: line, right: null, type: 'removed' }));
      i++;
    } else {
      const lines = part.value.split('\n');
      if (lines[lines.length - 1] === '') lines.pop();
      lines.forEach(line => result.push({ left: line, right: line, type: 'unchanged' }));
      i++;
    }
  }
  return result;
}