export const findDifferences = (oldContent, newContent) => {
  if (!oldContent || !newContent) return [];
  
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');
  const differences = [];
  
  // Create a mapping of line numbers to their content
  const lineMap = new Map();
  oldLines.forEach((line, index) => {
    lineMap.set(line.trim(), index);
  });
  
  // Find added, modified, or removed lines
  newLines.forEach((line, newIndex) => {
    const trimmedLine = line.trim();
    const oldIndex = lineMap.get(trimmedLine);
    
    if (oldIndex === undefined) {
      // Line was added or modified
      differences.push({
        type: 'added',
        line: newIndex,
        content: line
      });
    }
  });
  
  oldLines.forEach((line, oldIndex) => {
    const trimmedLine = line.trim();
    if (!newLines.some(newLine => newLine.trim() === trimmedLine)) {
      // Line was removed
      differences.push({
        type: 'removed',
        line: oldIndex,
        content: line
      });
    }
  });
  
  return differences;
};

export const applyDiffHighlighting = (content, differences) => {
  const lines = content.split('\n');
  
  return lines.map((line, index) => {
    const diff = differences.find(d => d.line === index);
    if (diff) {
      // Use a wrapper div with a semi-transparent background overlay
      return `<div class="code-line"><div class="diff-overlay ${diff.type === 'added' ? 'diff-added' : 'diff-removed'}">${line}</div></div>`;
    }
    return `<div class="code-line">${line}</div>`;
  }).join('\n');
};