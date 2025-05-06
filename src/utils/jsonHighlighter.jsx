export const highlightJson = (json) => {
    if (!json) return "";
  
    // Parse and re-stringify to ensure proper formatting
    try {
      const parsed = JSON.parse(json);
      json = JSON.stringify(parsed, null, 2);
    } catch (e) {
      console.warn("JSON parsing failed, using original string");
    }
  
    let lines = json.split("\n");
    let result = [];
    let indentLevel = 0;
    let foldable = new Set(); // Track which lines can be folded
  
    // First pass: identify foldable lines
    lines.forEach((line, i) => {
      const trimmedLine = line.trim();
      if (trimmedLine.endsWith("{") || trimmedLine.endsWith("[")) {
        foldable.add(i);
      }
    });
  
    // Second pass: generate HTML with fold buttons
    lines.forEach((line, i) => {
      const indent = line.match(/^\s*/)[0].length;
      indentLevel = Math.floor(indent / 2);
  
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
      if (foldable.has(i)) {
        const foldButton = `<button class="fold-button" data-line="${i}">▼</button>`;
        result.push(
          `<div class="code-line" data-line="${i}" data-level="${indentLevel}">${foldButton}${lineHtml}</div>`,
        );
      } else {
        result.push(
          `<div class="code-line" data-line="${i}" data-level="${indentLevel}">${lineHtml}</div>`,
        );
      }
    });
  
    return result.join("");
  };
  