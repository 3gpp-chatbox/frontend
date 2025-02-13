# AI-Powered RAG-KG Assistant for 3GPP Procedural Insights

A React-based web application that provides an intelligent assistant for analyzing and visualizing 3GPP specifications using Retrieval-Augmented Generation (RAG) and Knowledge Graphs.

## Features

- 📑 Extract procedural models from 3GPP specifications
- 🔍 Visualize procedures as Flow Property Graphs
- 🤖 RAG-based intelligent querying
- 🔄 Real-world data validation
- ✏️ Expert-driven knowledge graph updates

## Tech Stack

- **Frontend Framework:** React with TypeScript
- **Build Tool:** Vite
- **UI Components:** Material-UI (MUI)
- **State Management:** Zustand
- **Graph Visualization:** D3.js & React Force Graph
- **Styling:** TailwindCSS
- **Testing:** Vitest & React Testing Library
- **API Client:** Axios
- **Data Fetching:** React Query
- **Routing:** React Router DOM

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/3gpp-rag-kg-assistant.git
   cd 3gpp-rag-kg-assistant
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
frontend-repo/
│── src/               # Source code folder
│   ├── components/    # Reusable UI components
│   ├── pages/        # Page-level components
│   ├── assets/       # Static files (images, icons, etc.)
│   ├── styles/       # Global and component styles
│   ├── utils/        # Helper functions
│   ├── hooks/        # Custom React hooks
│   ├── context/      # Global state management
│── public/           # Static public assets
│── .gitignore        # Git ignore rules
│── package.json      # Dependencies and scripts
│── vite.config.ts    # Vite configuration
│── tsconfig.json     # TypeScript configuration
│── index.html        # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run format` - Format code with Prettier

## Key Dependencies

### Core Dependencies
- `react` & `react-dom` - UI framework
- `@mui/material` & `@mui/icons-material` - Material UI components
- `react-router-dom` - Routing
- `zustand` - State management
- `react-force-graph` & `d3` - Graph visualization
- `react-query` - Data fetching
- `axios` - HTTP client

### Development Dependencies
- `typescript` - Type checking
- `vite` - Build tool
- `eslint` & `prettier` - Code quality
- `tailwindcss` - Utility-first CSS
- `vitest` & `@testing-library/react` - Testing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
