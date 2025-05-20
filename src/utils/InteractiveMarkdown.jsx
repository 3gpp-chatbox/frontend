import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

/**
 * A component that renders markdown content with interactive elements.
 * Provides line-by-line highlighting support and section navigation.
 *
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.content - The markdown content to render
 * @param {Object} [props.highlightedSection] - Section to highlight
 * @param {Object} props.highlightedSection.refs - Reference information
 * @param {string} props.highlightedSection.refs.section - Section reference
 * @param {string} props.highlightedSection.refs.text - Text reference
 * @param {string} [props.highlightedSection.type] - Type of highlight ('node' or 'edge')
 * @returns {JSX.Element} The rendered markdown with highlighting
 */
function InteractiveMarkdown({ content, highlightedSection }) {
  const markdownRef = useRef(null);
  const [lines, setLines] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Split content into lines when it changes
  useEffect(() => {
    if (!content) return;
    setLines(content.split("\n"));
  }, [content]);

  // Handle initial mounting and highlighting
  useEffect(() => {
    if (!isInitialized && markdownRef.current && highlightedSection) {
      setIsInitialized(true);
      // Force a re-render of highlights after the component is fully mounted
      setTimeout(() => {
        applyHighlights(highlightedSection, markdownRef.current);
      }, 100);
    }
  }, [isInitialized, highlightedSection]);

  // Handle highlighting
  useEffect(() => {
    if (!highlightedSection || !markdownRef.current) {
      console.log("Skipping highlight effect:", {
        hasHighlightedSection: !!highlightedSection,
        hasMarkdownRef: !!markdownRef.current,
      });
      return;
    }

    applyHighlights(highlightedSection, markdownRef.current);
  }, [highlightedSection]);

  /**
   * Applies highlighting to the specified section and text in the content.
   * Handles both primary highlighting for specific text and context highlighting for sections.
   *
   * @param {Object} section - Section information for highlighting
   * @param {Object} section.refs - Reference information
   * @param {string} section.refs.section - Section reference
   * @param {string} section.refs.text - Text reference
   * @param {string} [section.type] - Type of highlight ('node' or 'edge')
   * @param {HTMLElement} container - Container element with the content
   */
  const applyHighlights = (section, container) => {
    console.log("Applying highlights to content");

    // Clear existing highlights first
    const existingHighlights = container.querySelectorAll(
      ".highlighted-line, .highlighted-context, .highlighted-section"
    );
    existingHighlights.forEach((el) => {
      el.classList.remove("highlighted-line", "highlighted-context", "highlighted-section");
    });

    // Get all line elements
    const lineElements = container.querySelectorAll(".line");
    console.log(`Found ${lineElements.length} lines in content`);

    // Extract section_ref and text_ref from highlightedSection
    const { refs } = section;
    if (!refs) {
      console.log("No refs found in highlightedSection");
      return;
    }

    const { section: sectionRef, text: textRef } = refs;
    console.log("Looking for refs:", { sectionRef, textRef });

    let foundHighlight = false;
    let sectionStartLine = null;
    let sectionEndLine = null;
    let textMatchLine = null;

    // First pass: Find the section boundaries
    for (let i = 0; i < lineElements.length; i++) {
      const lineContent = lineElements[i].textContent.toLowerCase();

      // Check for section header
      if (lineContent.includes(sectionRef?.toLowerCase())) {
        sectionStartLine = i;
        foundHighlight = true;

        // Find section end (next section header or end of content)
        for (let j = i + 1; j < lineElements.length; j++) {
          if (lineElements[j].textContent.match(/^#+\s/)) {
            sectionEndLine = j - 1;
            break;
          }
        }
        if (!sectionEndLine) sectionEndLine = lineElements.length - 1;
        break;
      }
    }

    // If we found the section, highlight it and look for specific text
    if (foundHighlight) {
      console.log("Found section boundaries:", {
        start: sectionStartLine,
        end: sectionEndLine,
      });

      // Add blue highlight to the entire section
      for (let i = sectionStartLine; i <= sectionEndLine; i++) {
        lineElements[i].classList.add("highlighted-section");
      }

      // Look for specific text within the section
      if (textRef) {
        const cleanTextRef = textRef
          .toLowerCase()
          .replace(/\.\.\./g, "")
          .replace(/^%%\s*text_reference:\s*/i, '')
          .replace(/^looking for text:\s*/i, '')
          .trim();
        console.log("Looking for text:", cleanTextRef, "type:", section.type);

        for (let i = sectionStartLine; i <= sectionEndLine; i++) {
          const lineContent = lineElements[i].textContent.toLowerCase();

          // For nodes, we need to be more flexible in matching since the node text might be part of a longer line
          // For edges, we want to match the exact text
          const isNode = section.type === "node";
          const isMatch = isNode
            ? lineContent.includes(cleanTextRef)
            : lineContent === cleanTextRef;

          if (isMatch) {
            // Remove section highlight from this line and add orange highlight
            lineElements[i].classList.remove("highlighted-section");
            lineElements[i].classList.add("highlighted-line"); // Orange highlight for text match
            textMatchLine = i;
            console.log(
              "Found matching text at line:",
              i + 1,
              "for",
              isNode ? "node" : "edge",
            );
            break;
          }
        }
      }

      // Scroll to the text match if found, otherwise to section header
      setTimeout(() => {
        const targetLine =
          textMatchLine !== null
            ? lineElements[textMatchLine]
            : lineElements[sectionStartLine];
        if (targetLine) {
          targetLine.scrollIntoView({ behavior: "smooth", block: "center" });
          console.log(
            "Scrolled to",
            textMatchLine !== null ? "text match" : "section header",
          );
        }
      }, 100);
    } else {
      console.log("No matching section found");
    }
  };

  return (
    <div className="interactive-markdown" ref={markdownRef}>
      <pre className="markdown-content">
        {lines.map((line, index) => (
          <div key={index} className="line" data-line={index + 1}>
            {line}
          </div>
        ))}
      </pre>
    </div>
  );
}

InteractiveMarkdown.propTypes = {
  /** The markdown content to render */
  content: PropTypes.string.isRequired,
  /** The section to highlight */
  highlightedSection: PropTypes.shape({
    refs: PropTypes.shape({
      section: PropTypes.string,
      text: PropTypes.string,
    }),
  }),
};

export default InteractiveMarkdown;