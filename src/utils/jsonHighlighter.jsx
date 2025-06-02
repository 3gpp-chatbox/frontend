export const highlightJson = (json, highlightedElement) => {
  if (!json) return "";

  // Parse and re-stringify to ensure proper formatting
  // try {
  //   const parsed = JSON.parse(json);
  //   json = JSON.stringify(parsed, null, 2);
  // } catch (e) {
  //   console.warn("JSON parsing failed, using original string");
  // }

  let lines = json.split("\n");
  let result = [];
  let indentLevel = 0;
  let foldable = new Set(); // Track which lines can be folded
  let inHighlightBlock = false;
  let bracketCount = 0;
  let currentObjectStart = -1;
  let targetObjectStart = -1;

  // First pass: identify foldable lines and object boundaries
  lines.forEach((line, i) => {
    const trimmedLine = line.trim();
    if (trimmedLine.endsWith("{") || trimmedLine.endsWith("[")) {
      foldable.add(i);
      if (trimmedLine.endsWith("{")) {
        currentObjectStart = i;
      }
    }

    // Check if this line contains our target identifier
    if (highlightedElement) {
      if (highlightedElement.type === 'node') {
        // Use the node's text property for matching instead of the flowchart ID
        const nodeText = highlightedElement.text;
        // Match against the node's text in the JSON
        if (line.includes(`"id": "${nodeText}"`) || line.includes(`"text": "${nodeText}"`)) {
          targetObjectStart = currentObjectStart;
        }
      } else if (highlightedElement.type === 'edge') {
        if (line.includes(`"description": "${highlightedElement.id}"`)) {
          targetObjectStart = currentObjectStart;
        }
      }
    }
  });

  // Reset bracket count for second pass
  bracketCount = 0;

  // Second pass: generate HTML with fold buttons and highlighting
  lines.forEach((line, i) => {
    const indent = line.match(/^\s*/)[0].length;
    indentLevel = Math.floor(indent / 2);
    const trimmedLine = line.trim();

    // Track object/array nesting level
    const openBrackets = (trimmedLine.match(/[{\[]/g) || []).length;
    const closeBrackets = (trimmedLine.match(/[}\]]/g) || []).length;
    
    // Start highlighting if we're at the target object's opening bracket
    if (i === targetObjectStart) {
      inHighlightBlock = true;
      bracketCount = 0;
    }

    // Update bracket count
    bracketCount += openBrackets - closeBrackets;

    let lineHtml = line
      .replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
        function (match) {
          let cls = "json-number";
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = "json-key";
              // Don't remove the colon, just wrap the key in a span
              return `<span class="${cls}">${match}</span>`;
            } else {
              cls = "json-string";
            }
          } else if (/true|false/.test(match)) {
            cls = "json-boolean";
          } else if (/null/.test(match)) {
            cls = "json-null";
          }
          return `<span class="${cls}">${match}</span>`;
        },
      )
      .replace(
        /[{}\[\],]/g, // Added comma to the punctuation pattern
        (match) => `<span class="json-punctuation">${match}</span>`,
      );

    // Add fold button if line is foldable
    const lineContent = foldable.has(i)
      ? `<button class="fold-button" data-line="${i}">▼</button>${lineHtml}`
      : lineHtml;

    // Wrap the line in a highlight span if we're in a highlight block
    if (inHighlightBlock) {
      result.push(
        `<div class="code-line orange-highlight" data-line="${i}" data-level="${indentLevel}">${lineContent}</div>`,
      );
    } else {
      result.push(
        `<div class="code-line" data-line="${i}" data-level="${indentLevel}">${lineContent}</div>`,
      );
    }

    // Check if we've reached the end of our highlight block
    if (inHighlightBlock && bracketCount === 0 && closeBrackets > 0) {
      inHighlightBlock = false;
    }
  });

  return result.join("");
};
