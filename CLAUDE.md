# CLAUDE.md

This file provides guidance to LLM coding agents when working with this Shiny-React application.

## Project Overview

This is **shiny-texteditor**, a Shiny-React application created from a template. This project uses the Shiny-React library to enable bidirectional communication between React frontend components and Shiny servers.

**Architecture**:
- **Frontend**: React with TypeScript using shiny-react hooks
- **Backend**: Shiny server (both R and Python versions available)
- **Communication**: Real-time data flow via shiny-react library
- **Build System**: ESBuild bundling for fast development

## Tools

You may have access to a shadcn MCP server. If so, use it to find and install UI components when the user asks you to implement UI.

IMPORTANT: in most cases, the user will already be running `npm run dev` while you are working, so you do not need to run `npm run build` yourself, or start the Shiny app with `npm run shinyapp`. If you want to know whether a build is working, ask the user what the output is from the relevant command, and offer to run it if they are not doing so already.

## Directory Structure

This project contains either an R backend or Python backend.

```
shiny-texteditor/
├── package.json            # Build configuration and npm dependencies
├── tsconfig.json           # TypeScript configuration
├── CLAUDE.md               # This file - instructions for LLM coding agents
├── SHINY-REACT.md          # Comprehensive shiny-react library documentation
├── srcts/                  # React TypeScript source code
│   ├── main.tsx            # React app entry point
│   ├── *.tsx               # React components using shiny-react hooks
│   └── styles.css/globals.css  # CSS styling
├── r/                      # R Shiny backend
│   ├── app.R               # Main R Shiny application
│   ├── shinyreact.R        # R functions for shiny-react
│   └── www/
│       └── app/             # Built assets (auto-generated)
│           ├── main.js      # Built JavaScript bundle
│           └── main.css     # Built CSS bundle
└── py/                     # Python Shiny backend
    ├── app.py              # Main Python Shiny application
    ├── shinyreact.py       # Python functions for shiny-react
│   └── www/
│       └── app/             # Built assets (auto-generated)
│           ├── main.js      # Built JavaScript bundle
│           └── main.css     # Built CSS bundle
```

## Key Files and Their Purpose

### Frontend (React/TypeScript)
- **`srcts/main.tsx`**: Entry point that mounts the React app to the DOM
- **`srcts/*.tsx`**: React components using shiny-react hooks
- **`srcts/styles.css`**: Application styling

### Backend (Shiny)
- **`r/app.R`** or **`py/app.py`**: Main Shiny server application
- **`r/shinyreact.R`** or **`py/shinyreact.py`**: Utility functions for bare page setup and custom renderers
- **`r/www/app/`** or **`py/www/app/`**: Auto-generated build output (JavaScript and CSS bundles)

## Available npm Scripts

This application includes several npm scripts for different development and build workflows:

### Development Scripts (Recommended)

- **`npm run dev`** - 🚀 **Primary development command** - Builds frontend and starts Shiny server automatically with hot-reload
- **`npm run watch`** - 👀 **Frontend-only watching** - Watch TypeScript/React files for changes and rebuild automatically
- **`npm run shinyapp`** - 🖥️ **Backend-only server** - Start only the Shiny server (Python by default)

### Build Scripts

- **`npm run build`** - 🔨 **Development build** - Build frontend once with TypeScript checking and CSS processing
- **`npm run build-prod`** - 📦 **Production build** - Optimized build with minification (advanced templates)
- **`npm run clean`** - 🧹 **Clean build** - Remove all generated build files

### Port Configuration

You can customize the port (default is 8000):
```bash
# Use custom port
PORT=3000 npm run dev
PORT=3000 npm run shinyapp
```

## Quick Start Development Workflow

### Method 1: All-in-One Development (Recommended)

```bash
# Install dependencies
npm install

# Start development with hot-reload (builds frontend + starts server)
npm run dev
```

This single command will:
- Build the TypeScript/React frontend with CSS processing
- Start the Shiny server with hot-reload enabled
- Automatically open your browser to `http://localhost:8000`
- Watch for changes and rebuild/restart as needed

### Method 2: Manual Development Setup

If you prefer more control, you can run the frontend and backend separately:

1. **Start build watcher** (in one terminal):
   ```bash
   npm run watch
   ```

2. **Run Shiny server** (in another terminal):
   ```bash
   # For R backend
   R -e "options(shiny.autoreload = TRUE); shiny::runApp('r/app.R', port=8000)"

   # For Python backend
   shiny run py/app.py --port 8000 --reload
   ```

3. **Open browser**: Navigate to `http://localhost:8000`

### Production Deployment

For production builds:
```bash
# Create optimized production build
npm run build-prod

# Deploy the generated www/app/ directories along with your Shiny app
```

## How Shiny-React Works

### Core Concepts
- **`useShinyInput<T>(id, defaultValue)`**: Sends data FROM React TO Shiny server
- **`useShinyOutput<T>(id, defaultValue)`**: Receives data FROM Shiny server TO React
- **Real-time bidirectional communication**: Changes in React trigger server updates, server responses update React UI

### Basic Example
```typescript
import { useShinyInput, useShinyOutput } from "@posit/shiny-react";

function MyComponent() {
  const [inputValue, setInputValue] = useShinyInput<string>("my_input", "default");
  const [outputValue] = useShinyOutput<string>("my_output", undefined);

  return (
    <div>
      <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
      <div>Server says: {outputValue}</div>
    </div>
  );
}
```

## Common Development Tasks

### Starting Development
- **Quick start**: Run `npm run dev` - Starts both frontend building and backend server with hot-reload
- **Frontend only**: Run `npm run watch` - Rebuilds frontend on file changes
- **Backend only**: Run `npm run shinyapp` - Starts only the Shiny server

### Adding a New Input/Output Pair
1. **In React component**: Add `useShinyInput` and `useShinyOutput` hooks
2. **In Shiny server**: Add corresponding input handler and output renderer
3. **Automatic rebuild**: Changes are detected automatically with watch mode

### Adding New React Components
1. **Create component file** in `srcts/` directory
2. **Import and use** in main component or `main.tsx`
3. **Follow shiny-react patterns** for any Shiny communication
4. **Update styling** in `styles.css` or `globals.css` if needed

### Modifying Backend Logic
- **R**: Edit `r/app.R` for server logic, `r/shinyreact.R` for utilities
- **Python**: Edit `py/app.py` for server logic, `py/shinyreact.py` for utilities
- **No rebuild needed** for backend changes (Shiny auto-reloads)

### Making Production Builds
- **Development build**: Run `npm run build`
- **Production build**: Run `npm run build-prod` (if available)
- **Clean build**: Run `npm run clean` to remove generated files

## Troubleshooting

### Common Issues
1. **"Shiny not found" errors**: Ensure Shiny server is running and accessible
2. **Build failures**: Check that all dependencies are installed (`npm install`)
3. **Hot reload not working**: Restart development mode
4. **Data not syncing**: Verify matching input/output IDs between React and Shiny
5. **TypeScript errors**: Check type definitions and imports
6. **Port already in use**: Use `PORT=<number> npm run dev` to change the port

### Development Tips
- **Use browser DevTools**: Check console for React/JavaScript errors
- **Monitor Shiny logs**: Watch R/Python console for server-side errors
- **Verify IDs match**: Input/output IDs must be identical in React and Shiny code
- **Check network tab**: Verify WebSocket communication between client and server

### Port Conflicts
If port 8000 is in use:
```bash
# Use environment variable (recommended)
PORT=8001 npm run dev

# Or manual server startup
R -e "shiny::runApp('r/app.R', port=8001)"
shiny run py/app.py --port 8001
```

## Key Dependencies

- **@posit/shiny-react**: Core library for React-Shiny communication
- **react + react-dom**: React framework
- **typescript**: TypeScript compiler and type checking
- **esbuild**: Fast JavaScript bundling

---

## Comprehensive Shiny-React Documentation

**📚 For complete API reference, advanced patterns, and detailed examples**, see: @SHINY-REACT.md

The SHINY-REACT.md file contains:
- Complete API documentation for all hooks and components
- Advanced input patterns (file uploads, compound forms, etc.)
- Debouncing and event priority concepts
- Server-to-client messaging
- Backend patterns for R and Python
- Shiny reactivity system explanation
- Data serialization details
- shadcn/ui integration guide
- Troubleshooting and best practices
