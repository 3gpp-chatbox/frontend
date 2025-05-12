/**
 * Maps diagram elements (nodes/edges) to sections in the reference content.
 * Returns the position to scroll to and the text to highlight.
 */
export const mapElementToReference = (content, element) => {
  if (!content || !element) return null;

  let searchText = '';
  if (element.type === 'node') {
    searchText = element.text;
  } else if (element.type === 'edge') {
    searchText = element.label;
  }

  if (!searchText) return null;

  // Clean up search text
  searchText = searchText.toLowerCase().trim();

  // Split content into lines to find the exact position
  const lines = content.split('\n');
  let foundIndex = -1;
  let contextStart = 0;
  let contextEnd = 0;

  // Find the most relevant section
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    
    // Check for section headers that might contain our search text
    if (line.includes(searchText) || 
        (line.startsWith('#') && line.includes(searchText.replace(/[^a-z0-9\s]/g, '')))) {
      foundIndex = i;
      
      // Find the context boundaries (start of the section)
      for (let j = i; j >= 0; j--) {
        if (lines[j].startsWith('#')) {
          contextStart = j;
          break;
        }
      }
      
      // Find the end of the section
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].startsWith('#')) {
          contextEnd = j - 1;
          break;
        }
        if (j === lines.length - 1) {
          contextEnd = j;
        }
      }
      
      break;
    }
  }

  if (foundIndex === -1) return null;

  return {
    lineNumber: foundIndex + 1, // Convert to 1-based index
    contextStart: contextStart + 1,
    contextEnd: contextEnd + 1,
    matchedText: lines[foundIndex],
    sectionContent: lines.slice(contextStart, contextEnd + 1).join('\n')
  };
}; 