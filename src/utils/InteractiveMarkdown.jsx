import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * A component that renders markdown content with interactive elements.
 * Renders the markdown file directly with line-by-line highlighting support.
 */
function InteractiveMarkdown({ content, highlightedSection }) {
  const markdownRef = useRef(null);
  const [lines, setLines] = useState([]);

  // Split content into lines when it changes
  useEffect(() => {
    if (!content) return;
    setLines(content.split('\n'));
  }, [content]);

  // Handle highlighting
  useEffect(() => {
    if (!highlightedSection || !markdownRef.current) {
      console.log("Skipping highlight effect:", {
        hasHighlightedSection: !!highlightedSection,
        hasMarkdownRef: !!markdownRef.current
      });
      return;
    }

    console.log("Applying highlights to content");
    
    // Clear existing highlights first
    const existingHighlights = markdownRef.current.querySelectorAll('.highlighted-line, .highlighted-context');
    existingHighlights.forEach(el => {
      el.classList.remove('highlighted-line', 'highlighted-context');
      el.style.backgroundColor = '';
    });

    // Get all line elements
    const lineElements = markdownRef.current.querySelectorAll('.line');
    console.log(`Found ${lineElements.length} lines in content`);

    // Extract section_ref and text_ref from highlightedSection
    const { refs } = highlightedSection;
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
      console.log("Found section boundaries:", { start: sectionStartLine, end: sectionEndLine });
      
      // Look for specific text within the section first
      if (textRef) {
        const cleanTextRef = textRef.toLowerCase().replace(/\.\.\./g, '').trim();
        for (let i = sectionStartLine; i <= sectionEndLine; i++) {
          const lineContent = lineElements[i].textContent.toLowerCase();
          if (lineContent.includes(cleanTextRef)) {
            lineElements[i].classList.add('highlighted-line');
            textMatchLine = i;
            console.log("Found matching text at line:", i + 1);
            break;
          }
        }
      }

      // Add context highlighting to the section
      for (let i = sectionStartLine; i <= sectionEndLine; i++) {
        if (!lineElements[i].classList.contains('highlighted-line')) {
          lineElements[i].classList.add('highlighted-context');
        }
      }

      // Scroll to the text match if found, otherwise to section header
      setTimeout(() => {
        const targetLine = textMatchLine !== null ? lineElements[textMatchLine] : lineElements[sectionStartLine];
        if (targetLine) {
          targetLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
          console.log("Scrolled to", textMatchLine !== null ? "text match" : "section header");
        }
      }, 100);
    } else {
      console.log("No matching section found");
    }
  }, [highlightedSection]);

  return (
    <div className="interactive-markdown" ref={markdownRef}>
      <pre className="markdown-content">
        {lines.map((line, index) => (
          <div 
            key={index}
            className="line"
            data-line={index + 1}
          >
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
      text: PropTypes.string
    })
  })
};

export default InteractiveMarkdown; 