import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';

/**
 * A component that renders markdown content with interactive elements.
 * Supports clicking on sections and paragraphs with highlight functionality.
 */
function InteractiveMarkdown({ content, onElementClick }) {
  const [activeSection, setActiveSection] = useState(null);

  // Custom components for ReactMarkdown
  const components = {
    // Handle headings (sections)
    h1: ({ children, ...props }) => (
      <h1
        {...props}
        className={`interactive-heading ${activeSection === props.id ? 'active' : ''}`}
        onClick={() => {
          setActiveSection(props.id);
          onElementClick?.({ type: 'section', id: props.id, content: children });
        }}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        {...props}
        className={`interactive-heading ${activeSection === props.id ? 'active' : ''}`}
        onClick={() => {
          setActiveSection(props.id);
          onElementClick?.({ type: 'section', id: props.id, content: children });
        }}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        {...props}
        className={`interactive-heading ${activeSection === props.id ? 'active' : ''}`}
        onClick={() => {
          setActiveSection(props.id);
          onElementClick?.({ type: 'section', id: props.id, content: children });
        }}
      >
        {children}
      </h3>
    ),

    // Handle paragraphs
    p: ({ children, ...props }) => (
      <p
        {...props}
        className="interactive-paragraph"
        onClick={() => {
          onElementClick?.({ type: 'paragraph', content: children });
        }}
      >
        {children}
      </p>
    ),

    // Handle lists
    li: ({ children, ...props }) => (
      <li
        {...props}
        className="interactive-list-item"
        onClick={(e) => {
          // Prevent triggering parent paragraph click
          e.stopPropagation();
          onElementClick?.({ type: 'list-item', content: children });
        }}
      >
        {children}
      </li>
    ),
  };

  return (
    <div className="interactive-markdown">
      <ReactMarkdown components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

InteractiveMarkdown.propTypes = {
  /** The markdown content to render */
  content: PropTypes.string.isRequired,
  /** Callback function when an element is clicked */
  onElementClick: PropTypes.func,
};

export default InteractiveMarkdown; 