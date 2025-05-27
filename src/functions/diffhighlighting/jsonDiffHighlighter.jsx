/**
 * A specialized JSON highlighter for line-by-line diff views.
 * This highlighter uses regex patterns to highlight JSON syntax without parsing the entire JSON.
 */

export const highlightJsonDiff = (line) => {
  if (!line) return "";

  // Highlight keys (with colon)
  line = line.replace(
    /("(?:\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*")\s*:/g,
    '<span class="json-key-simple">$1</span>:'
  );

  // Highlight all values (strings, numbers, booleans, null)
  line = line.replace(
    /(:\s*)("(?:\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null)/g,
    (match, prefix, value) => `${prefix}<span class="json-value-simple">${value}</span>`
  );

  // Optionally, highlight punctuation (optional, but can be left unstyled for simplicity)
  // line = line.replace(/([{}\[\],])/g, '<span class="json-punctuation-simple">$1</span>');

  return line;
};

// Export additional utility functions if needed for the diff view
export const isObjectStart = (line) => {
  return /[{[]/.test(line.trim());
};

export const isObjectEnd = (line) => {
  return /[}\]]/.test(line.trim());
};

export const getIndentLevel = (line) => {
  const match = line.match(/^\s*/);
  return match ? Math.floor(match[0].length / 2) : 0;
}; 