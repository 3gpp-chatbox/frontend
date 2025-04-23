# 3GPP Flow Editor Frontend

A modern web application for visualizing and editing 3GPP procedure flows using interactive diagrams.

## 🚀 Features

- **Interactive Flow Diagrams**: Visualize 3GPP procedures using Mermaid.js
- **Real-time Editing**: Edit diagrams with live preview
- **Dual View**: Switch between JSON and Mermaid syntax views
- **Smart Layout**: Automatic diagram layout with zoom and pan controls
- **State Preservation**: Maintains diagram position and zoom level during edits
- **Error Handling**: Immediate feedback for syntax errors

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16.0.0 or higher)
- npm (v7.0.0 or higher) or yarn

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 💻 Usage

### Basic Operations

1. **Select a Procedure**:
   - Choose a procedure from the list at the top of the page
   - View its description and details in the description panel

2. **Edit the Flow**:
   - Use the code editor panel to modify the Mermaid syntax
   - Switch between JSON and Mermaid views using the toggle button
   - Changes are reflected in real-time in the diagram view

3. **Diagram Interaction**:
   - Zoom: Use mouse wheel or pinch gesture
   - Pan: Click and drag the diagram
   - Reset: Click "Reset View" to return to default position
   - Click on nodes or edges to highlight their definitions in the code

4. **Save Changes**:
   - Click "Save Changes" when you're done editing
   - Confirm your changes in the dialog
   - View validation feedback in the notification area

### Keyboard Shortcuts

- `Ctrl + S`: Save changes
- `Ctrl + Z`: Undo
- `Ctrl + Shift + Z`: Redo
- `Ctrl + /`: Toggle comment

## 🔧 Configuration

The application uses several configuration files:
- `vite.config.js`: Vite bundler configuration
- `package.json`: Project dependencies and scripts
- `.eslintrc.js`: ESLint configuration
- `.prettierrc`: Prettier formatting rules

## 🎨 Customization

### Theme Customization

The application uses CSS variables for theming. You can modify the colors in `src/index.css`:

```css
:root {
  --black-900: #000000;
  --blue-500: #3b82f6;
  /* ... other color variables */
}
```

### Mermaid Configuration

Modify Mermaid.js settings in `src/components/FlowDiagram.jsx`:

```javascript
mermaid.initialize({
  theme: "dark",
  // ... other settings
});
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Code Style

This project follows strict code style guidelines:
- Uses ESLint for code linting
- Follows Google-style docstrings
- Requires type annotations for all functions
- Uses Prettier for code formatting


## 🙏 Acknowledgments

- [Mermaid.js](https://mermaid-js.github.io/mermaid/#/) for diagram rendering
- [React](https://reactjs.org/) for the UI framework
- [Vite](https://vitejs.dev/) for the build tool
