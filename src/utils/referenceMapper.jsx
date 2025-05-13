/**
 * Maps diagram elements (nodes/edges) to sections in the reference content.
 * Returns the position to scroll to and the text to highlight.
 */
export const mapElementToReference = (content, element) => {
  if (!content || !element) return null;

  console.log("Mapping element to reference:", element);

  let sectionRef = '';
  let textRef = '';
  
  const id = element.id || '';
  
  // Extract section_ref and text_ref
  const sectionMatch = id.match(/\[section_ref:\s*([^\]]+)\]/);
  if (sectionMatch) {
    sectionRef = sectionMatch[1].trim();
  }

  const textMatch = id.match(/\[text_ref:\s*([^\]]+)\]/);
  if (textMatch) {
    textRef = textMatch[1].trim().replace(/^\.\.\./, '').replace(/\.\.\.$/g, '');
  }

  console.log("Extracted refs:", { sectionRef, textRef });

  const lines = content.split('\n');
  let foundIndex = -1;
  let contextStart = 0;
  let contextEnd = 0;

  // First find the base section (without -a, -b, -c)
  const baseSection = sectionRef.replace(/-[a-z]$/, '');
  const subSection = sectionRef.match(/-([a-z])$/)?.[1];
  
  console.log("Looking for base section:", baseSection, "subsection:", subSection);

  // Find the section start
  let sectionStartIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes(baseSection)) {
      sectionStartIndex = i;
      console.log("Found base section at line:", i + 1, "Content:", line);
      break;
    }
  }

  if (sectionStartIndex !== -1) {
    // Clean up text_ref for searching
    const searchText = textRef
      .replace(/\.\.\./g, '')
      .toLowerCase()
      .trim();
    
    console.log("Searching for text:", searchText);

    // Search within the section
    let sectionEnd = lines.length;
    for (let i = sectionStartIndex + 1; i < lines.length; i++) {
      if (lines[i].match(/^#+\s/)) {
        sectionEnd = i;
        break;
      }
    }

    // Look for the subsection and text
    for (let i = sectionStartIndex; i < sectionEnd; i++) {
      const line = lines[i].toLowerCase();
      
      // If we have a subsection, look for it specifically
      if (subSection) {
        if (line.includes(`${subSection})`)) {
          foundIndex = i;
          console.log("Found subsection at line:", i + 1, "Content:", lines[i]);
          break;
        }
      }
      // Otherwise look for the text
      else if (line.includes(searchText)) {
        foundIndex = i;
        console.log("Found text at line:", i + 1, "Content:", lines[i]);
        break;
      }
    }

    // If we still haven't found the specific line, use section start
    if (foundIndex === -1) {
      foundIndex = sectionStartIndex;
      console.log("Using section start as fallback");
    }

    // Set context boundaries
    contextStart = sectionStartIndex;
    contextEnd = sectionEnd - 1;
  }

  if (sectionStartIndex === -1) {
    console.warn("Could not find section:", sectionRef);
    return null;
  }

  const result = {
    lineNumber: foundIndex + 1,
    contextStart: contextStart + 1,
    contextEnd: contextEnd + 1,
    matchedText: lines[foundIndex],
    sectionContent: lines.slice(contextStart, contextEnd + 1).join('\n'),
    refs: {
      section: sectionRef,
      text: textRef
    }
  };

  console.log("Mapping result:", result);
  return result;
}; 