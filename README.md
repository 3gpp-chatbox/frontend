# 3GPP Flow Editor Frontend

A modern web application for visualizing and editing 3GPP procedure flows using interactive diagrams. This tool helps in understanding, analyzing, and modifying 3GPP protocol procedures through an intuitive visual interface.

## 🚀 Features

- **Interactive Flow Diagrams**: 
  - Visualize 3GPP procedures using Mermaid.js
  - Real-time diagram updates
  - Zoom and pan capabilities
  - Node and edge highlighting

- **Advanced Search**:
  - Filter procedures by name, entity, document spec, release, and version
  - Real-time filtering
  - Hierarchical document organization
  - Quick access to procedure details

- **Version Control**:
  - Track Baseline procedure graph changes
  - View baseline graph version history
  - Compare different versions
  - Commit messages and titles for changes

- **Smart Editing**:
  - Dual view: JSON and Mermaid syntax
  - Real-time syntax validation
  - Auto-layout capabilities
  - State preservation during edits

- **Document Management**:
  - View procedure reference sections
  - Entity-specific reference sections views

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16.0.0 or higher)
- npm (v7.0.0 or higher) or yarn
- Git

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

3. Create `.env` file in the root directory and add your backend API URL:
   ```env
   VITE_API_BASE_URL=""  # Replace with your backend URL
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## 💻 Usage

### Basic Operations

1. **Search and Select Procedures**:
   - Use the search bar to find procedures
   - Click "Advanced Search" for detailed filtering
   - Select a procedure to view its flow diagram
   - View procedure details in the description panel

2. **Edit Procedure Flows**:
   - Modify the flow using the code editor
   - Switch between JSON and Mermaid views
   - Real-time preview of changes
   - Validate syntax before saving

3. **Baseline Version Management**:
   - View baseline version history
   - Compare different baseline versions
   - Create new versions with commit messages
   - Track changes over time

4. **Diagram Interaction**:
   - Zoom: Mouse wheel or pinch gesture
   - Pan: Click and drag
   - Reset View: Click "Reset View" button
   - Node Selection: Click to highlight in code
   - Edge Selection: Click to view connections

## 🔧 Configuration

### Environment Variables
- `VITE_API_BASE_URL`: Backend API URL

### Project Structure
```
frontend/
├── src/
│   ├── components/     # React components
│   ├── API/           # API integration
│   ├── functions/        # functions used
│   └── utils/         # Utility components
├── APP.jsx           # main app
└── index.css            # CSS and styling
```

## 🎨 Customization

### Theme Customization
Modify colors and styles in `src/index.css`:
```css
:root {

  --black-900: #000000;
  --black-800: #1a1a1a;
  --black-700: #2d2d2d;
  --black-600: #9c9595;
  --black-500: #404040;
  --black-100: #585353;
  --black-200: #9c9595;

  --silver-50: #fafafa;
  --silver-100: #f4f4f5;
  --silver-200: #e4e4e7;
  --silver-300: #d4d4d8;
  --silver-400: #a1a1aa;
  --silver-500: #71717a;
  --silver-600: #52525b;
  --silver-700: #3f3f46;
  --silver-800: #27272a;
  --silver-900: #18181b;

  --blue-300: #93c5fd;
  --blue-400: #60a5fa;
  --blue-500: #3b82f6;
  --blue-600: #2563eb;
  --blue-700: #1d4ed8;

  --orange-300: #f97316;
  --orange-400: #fb923c;
  --orange-500: #f59e0b;
  --orange-600: #d97706;
  --orange-700: #b45309;
```

## 🧪 Testing

Run tests using:
```bash
npm test
# or
yarn test
```

## 📝 Code Style

This project follows strict code style guidelines:
- ESLint for code linting
- Prettier for code formatting
- Google-style docstrings
- Component-based architecture

## 📚 Documentation

- [Component Documentation](docs/components.md)
- [User Guide](docs/user-guide.md)

## 🙏 Acknowledgments

- [Mermaid.js](https://mermaid-js.github.io/mermaid/#/) for diagram rendering
- [React](https://reactjs.org/) for the UI framework
- [Vite](https://vitejs.dev/) for the build tool
- [FastAPI](https://fastapi.tiangolo.com/) for the backend API


