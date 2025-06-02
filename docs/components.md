# Components Documentation

This document provides an overview and usage guide for the React components in the `src/components/` directory. It covers conventions, prop types, usage patterns, and concrete examples for key components.

---

## 📦 Component Conventions

- **PropTypes:** All components use [PropTypes](https://reactjs.org/docs/typechecking-with-proptypes.html) for type safety and documentation.
- **JSDoc Comments:** Each component starts with a JSDoc-style comment describing its purpose and props.
- **Stateless/Stateful:** Components are stateless unless they manage their own UI state.
- **Reusability:** Components are designed to be reusable and composable.
- **File Naming:** Each component is in its own `.jsx` file, named in PascalCase.

---

## 🧩 Example Component Structure

```jsx
/**
 * Component for rendering and interacting with Mermaid flow diagrams.
 * @component
 * @param {string} mermaidCode - The Mermaid diagram code to render
 * @param {string} [direction='TD'] - Diagram direction
 * @param {Function} onElementClick - Callback for element click events
 */
function FlowDiagram({ mermaidCode, direction = "TD", onElementClick }) { ... }

FlowDiagram.propTypes = {
  mermaidCode: PropTypes.string.isRequired,
  direction: PropTypes.string,
  onElementClick: PropTypes.func,
};

export default FlowDiagram;
```

---

## 🔑 Key Components

### `FlowDiagram.jsx`
- **Purpose:** Renders and interacts with Mermaid flow diagrams (zoom, pan, click).
- **Props:**
  - `mermaidCode` (string, required): Mermaid code to render.
  - `direction` (string, optional): Diagram direction (default: 'TD').
  - `onElementClick` (function, optional): Callback for diagram element clicks.
- **Usage:**
  ```jsx
  import FlowDiagram from '../components/FlowDiagram';
  <FlowDiagram mermaidCode={code} direction="LR" onElementClick={handler} />
  ```

### `JsonViewer.jsx`
- **Purpose:** Displays and edits JSON data with multiple view modes (JSON, Mermaid, Reference).
- **Props:** See the top of `JsonViewer.jsx` for a full prop list and types.
- **Usage:**
  ```jsx
  import JsonViewer from '../components/JsonViewer';
  <JsonViewer
    onMermaidCodeChange={fn}
    selectedProcedure={proc}
    onProcedureUpdate={fn}
    highlightedElement={el}
    setHighlightedElement={fn}
    highlightedSection={section}
    markdownContent={md}
    onEditorFocus={fn}
    setHighlightedSection={fn}
  />
  ```

### `SearchProcedure.jsx`
- **Purpose:** Search bar and dropdown for finding procedures.
- **Props:**
  - `onProcedureSelect` (function, required): Callback when a procedure is selected.
- **Usage:**
  ```jsx
  import SearchProcedure from '../components/SearchProcedure';
  <SearchProcedure onProcedureSelect={fn} />
  ```

### `Comparison.jsx`
- **Purpose:** UI for comparing two versions of a procedure (side-by-side diff).
- **Props:**
  - `left` (object, required): Left-side version data.
  - `right` (object, required): Right-side version data.
  - `onClose` (function, required): Close handler.
  - `selectedProcedure` (object, required): The procedure being compared.
- **Usage:**
  ```jsx
  import Comparison from '../components/Comparison';
  <Comparison left={leftVer} right={rightVer} onClose={closeFn} selectedProcedure={proc} />
  ```

### `modals/` and `editor/`
- **Purpose:** Contain modal dialogs (e.g., SaveConfirmation, DeleteConfirmation, DescriptionModal) and editor-specific UI (e.g., EditorHeader, FormatGuide).
- **Props:** Each modal and editor component documents its own props at the top of the file.
- **Usage:**
  ```jsx
  import DescriptionModal from '../components/modals/DescriptionModal';
  <DescriptionModal isOpen={open} onClose={closeFn} procedure={proc} />
  ```

---

## 📝 Adding New Components

1. Create a new `.jsx` file in `src/components/` (or a subfolder).
2. Add a JSDoc comment at the top describing the component and its props.
3. Use PropTypes to document and validate props.
4. Export the component as a default export.
5. Add usage examples in the docstring or here in the documentation if helpful.

---

## 📚 See Also
- [React PropTypes Documentation](https://reactjs.org/docs/typechecking-with-proptypes.html)
- [Component Usage in README](../README.md)
