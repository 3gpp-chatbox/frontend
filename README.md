# 3GPP Knowledge Graph Chat Frontend

A modern React-based frontend for querying the 3GPP knowledge graph using natural language. Built with React, Vite, and Mantine UI.

## Features

- Clean and intuitive chat interface
- Real-time query processing
- Responsive design
- Error handling and loading states
- Modern UI components with Mantine

## Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher
- Backend API running on port 5000

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Development

The application is built with:
- React 18
- Vite
- Mantine UI Components
- Axios for API calls

The main components are:
- `src/App.jsx` - Main application component with chat interface
- `src/main.jsx` - Application entry point with provider setup

## API Integration

The frontend expects the following API endpoint:
- POST `/api/query` - Accepts natural language queries about 3GPP specifications
  - Request body: `{ query: string }`
  - Response: `{ answer: string }`

## Building for Production

To create a production build:
```bash
npm run build
```

The build output will be in the `dist` directory.
