/**
 * Utility module for mapping diagram elements to their corresponding sections in the reference content.
 * @module referenceMapper
 */

/**
 * Maps diagram elements (nodes/edges) to sections in the reference content.
 * Extracts section and text references from element IDs and finds their positions in the content.
 *
 * @param {string} content - The markdown content to search in
 * @param {Object} element - The diagram element to map
 * @param {string} element.id - Element identifier containing section_ref and text_ref
 * @returns {Object|null} Reference section information or null if not found
 * @property {number} lineNumber - Line number where the reference was found
 * @property {number} contextStart - Starting line number for the section context
 * @property {number} contextEnd - Ending line number for the section context
 * @property {string} matchedText - The matched text content
 * @property {string} sectionContent - The entire section content
 * @property {Object} refs - Reference identifiers
 * @property {string} refs.section - Section reference
 * @property {string} refs.text - Text reference
 */
export const mapElementToReference = (content, element) => {
  if (!content || !element) return null;

  console.log("Mapping element to reference:", element);

  let sectionRef = "";
  let textRef = "";

  const id = element.id || "";

  // Extract section_ref and text_ref
  const sectionMatch = id.match(/\[section_ref:\s*([^\]]+)\]/);
  if (sectionMatch) {
    sectionRef = sectionMatch[1].trim();
  }

  const textMatch = id.match(/\[text_ref:\s*([^\]]+)\]/);
  if (textMatch) {
    textRef = textMatch[1]
      .trim()
      .replace(/^\.\.\./, "")
      .replace(/\.\.\.$/g, "");
  }

  console.log("Extracted refs:", { sectionRef, textRef });

  const lines = content.split("\n");
  let foundIndex = -1;
  let contextStart = 0;
  let contextEnd = 0;

  // First find the base section (without -a, -b, -c)
  const baseSection = sectionRef.replace(/-[a-z]$/, "");
  const subSection = sectionRef.match(/-([a-z])$/)?.[1];

  console.log(
    "Looking for base section:",
    baseSection,
    "subsection:",
    subSection,
  );

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
    // Find section end
    let sectionEnd = lines.length;
    for (let i = sectionStartIndex + 1; i < lines.length; i++) {
      if (lines[i].match(/^#+\s/)) {
        sectionEnd = i;
        break;
      }
    }

    // First try to find the text_ref if it exists
    if (textRef) {
      const searchText = textRef
        .replace(/\.\.\./g, "")
        .toLowerCase()
        .trim();

      console.log("Searching for text:", searchText);

      // Look for the text within the section
      for (let i = sectionStartIndex; i < sectionEnd; i++) {
        const line = lines[i].toLowerCase();
        if (line.includes(searchText)) {
          foundIndex = i;
          console.log("Found text at line:", i + 1, "Content:", lines[i]);
          break;
        }
      }
    }

    // If text wasn't found or didn't exist, look for subsection
    if (foundIndex === -1 && subSection) {
      for (let i = sectionStartIndex; i < sectionEnd; i++) {
        const line = lines[i].toLowerCase();
        if (line.includes(`${subSection})`)) {
          foundIndex = i;
          console.log("Found subsection at line:", i + 1, "Content:", lines[i]);
          break;
        }
      }
    }

    // If we still haven't found anything, use section start
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
    sectionContent: lines.slice(contextStart, contextEnd + 1).join("\n"),
    refs: {
      section: sectionRef,
      text: textRef,
    },
  };

  console.log("Mapping result:", result);
  return result;
};
