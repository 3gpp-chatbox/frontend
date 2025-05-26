/**
 * A specialized Mermaid highlighter for line-by-line diff views.
 * This highlighter uses regex patterns to highlight Mermaid syntax without parsing the entire diagram.
 */

export const highlightMermaidDiff = (line) => {
  if (!line) return "";
  
  // Process the line step by step to avoid overlapping matches
  let result = line;

  // 1. Highlight flowchart/graph declaration
  result = result.replace(
    /^(flowchart|graph)\s+([A-Za-z]+)/g,
    '<span class="mermaid-keyword">$1</span> <span class="mermaid-direction">$2</span>'
  );

  // 2. Highlight node definitions
  result = result.replace(
    /([A-Za-z0-9_]+)\s*\[([^\]]+)\]/g,
    '<span class="mermaid-node-id">$1</span><span class="mermaid-bracket">[</span><span class="mermaid-node-text">$2</span><span class="mermaid-bracket">]</span>'
  );

  // 3. Highlight edge definitions
  result = result.replace(
    /([A-Za-z0-9_]+)\s*(-->|==>|-.->|==>|~~~)\s*([A-Za-z0-9_]+)/g,
    '<span class="mermaid-node-id">$1</span><span class="mermaid-edge">$2</span><span class="mermaid-node-id">$3</span>'
  );

  // 4. Highlight edge labels
  result = result.replace(
    /\|([^|]+)\|/g,
    '<span class="mermaid-edge-label">|$1|</span>'
  );

  // 5. Highlight subgraph definitions
  result = result.replace(
    /subgraph\s+([A-Za-z0-9_]+)/g,
    '<span class="mermaid-keyword">subgraph</span> <span class="mermaid-subgraph-id">$1</span>'
  );

  // 6. Highlight end of subgraph
  result = result.replace(
    /^end$/,
    '<span class="mermaid-keyword">end</span>'
  );

  // 7. Highlight style definitions
  result = result.replace(
    /style\s+([A-Za-z0-9_]+)\s+([^;]+)/g,
    '<span class="mermaid-keyword">style</span> <span class="mermaid-node-id">$1</span> <span class="mermaid-style">$2</span>'
  );

  // 8. Highlight class definitions
  result = result.replace(
    /class\s+([A-Za-z0-9_]+)\s+([A-Za-z0-9_]+)/g,
    '<span class="mermaid-keyword">class</span> <span class="mermaid-node-id">$1</span> <span class="mermaid-class">$2</span>'
  );

  return result;
};

// Export additional utility functions for the diff view
export const isNodeDefinition = (line) => {
  return /[A-Za-z0-9_]+\[[^\]]+\]/.test(line.trim());
};

export const isEdgeDefinition = (line) => {
  return /[A-Za-z0-9_]+(-->|==>|-.->|==>|~~~)[A-Za-z0-9_]+/.test(line.trim());
};

export const isSubgraphDefinition = (line) => {
  return /^subgraph\s+[A-Za-z0-9_]+/.test(line.trim());
};

export const getIndentLevel = (line) => {
  const match = line.match(/^\s*/);
  return match ? Math.floor(match[0].length / 2) : 0;
}; 