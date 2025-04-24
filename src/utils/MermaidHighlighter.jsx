
export const highlightMermaid = (code) => {
  if (!code) return "";

  return code
    .split("\n")
    .map((line) => {
      const trimmedLine = line.trim();
      let highlightedLine = line;

      // Highlight flowchart declaration
      if (trimmedLine.startsWith("flowchart")) {
        highlightedLine = line.replace(
          /(flowchart\s+TD)/,
          '<span class="flowchart">$1</span>',
        );
      }
      // Highlight comments and metadata
      else if (trimmedLine.startsWith("%%")) {
        if (trimmedLine.includes("Type:")) {
          highlightedLine = line.replace(
            /(%%.+?Type:)(.+)/,
            '<span class="comment">$1</span><span class="type">$2</span>',
          );
        } else if (trimmedLine.includes("Description:")) {
          highlightedLine = line.replace(
            /(%%.+?Description:)(.+)/,
            '<span class="comment">$1</span><span class="description">$2</span>',
          );
        } else {
          highlightedLine = `<span class="comment">${line}</span>`;
        }
      }
      // Highlight node definitions: A(text)
      else if (/^[A-Z]+\([^)]+\)/.test(trimmedLine)) {
        highlightedLine = line.replace(
          /([A-Z]+)(\()([^)]+)(\))/,
          '<span class="node-id">$1</span>$2<span class="node-text">$3</span>$4',
        );
      }
      // Highlight edges: A --> B
      else if (/^[A-Z]+\s*-->/.test(trimmedLine)) {
        highlightedLine = line.replace(
          /([A-Z]+)(\s*-->?\s*)([A-Z]+)/,
          '<span class="node-id">$1</span><span class="arrow">$2</span><span class="node-id">$3</span>',
        );
      }

      return highlightedLine;
    })
    .join("\n");
};