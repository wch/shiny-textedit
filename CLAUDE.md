# CLAUDE.md

This file provides guidance to LLM coding agents when working with this Shiny-React application.

## Project Overview

This is **shiny-texteditor**, a code editor application built with Shiny-React that demonstrates bidirectional communication between a React frontend and Shiny backend.

**What This Application Does**:
- Full-featured code editor with syntax highlighting for 7 languages (R, Python, JavaScript, TypeScript, HTML, CSS, JSON)
- Real-time statistics (line count, word count, character count) calculated by the Shiny server
- **Cursor position and context tracking** for LLM autocomplete integration
- **Context extraction**: Sends prefix (text before cursor) and suffix (text after cursor) to server
- Light/dark mode toggle with system preference detection and localStorage persistence
- Two-panel layout showing the editor and cursor context/server output side-by-side

**Architecture**:
- **Frontend**: React with TypeScript using CodeMirror 6 for code editing
- **Backend**: Shiny server (R backend currently in use)
- **Communication**: Real-time data flow via shiny-react library
- **Build System**: ESBuild bundling for fast development
- **UI Components**: Custom components with Radix UI primitives and Tailwind CSS

## Tools

You may have access to a shadcn MCP server. If so, use it to find and install UI components when the user asks you to implement UI.

IMPORTANT: in most cases, the user will already be running `npm run dev` while you are working, so you do not need to run `npm run build` yourself, or start the Shiny app with `npm run shinyapp`. If you want to know whether a build is working, ask the user what the output is from the relevant command, and offer to run it if they are not doing so already.

## Current Application Implementation

### Frontend Components

**Main Application (`srcts/App.tsx`)**:
- Uses `useDarkMode` hook for theme management with `applyDarkClass: true` (adds `dark` class to document)
- Uses semantic Tailwind color classes (`bg-background`, `text-foreground`, `border-border`, etc.)
- Language selector dropdown for switching between 7 supported languages
- Two-panel grid layout with flexbox for full viewport height
- Real-time statistics display (lines, words, characters)
- Dark mode toggle switch with sun/moon icons
- **Cursor context tracking**: Sends cursor position and surrounding code to server

**CodeEditor Component (`srcts/components/code-editor.tsx`)**:
- Built with CodeMirror 6 (`@uiw/react-codemirror`)
- Language extensions: JavaScript, TypeScript, Python, R, HTML, CSS, JSON
- Themes: VS Code Dark and VS Code Light (14px font size)
- Full-height editor that adapts to container size (`height="100%"`)
- All standard code editor features (line numbers, bracket matching, autocompletion, etc.)
- **Cursor tracking**: Uses `onUpdate` callback to extract cursor position and context
- **Context extraction**: Prefix (1000 chars before cursor), Suffix (200 chars after cursor)
- **Debounced updates**: 200ms delay to avoid excessive server calls
- Exports `CursorContext` interface with `{line, column, prefix, suffix, language}`

**UI Components**:
- `srcts/components/ui/switch.tsx`: Custom switch with icon support (Radix UI)
- `srcts/components/ui/card.tsx`: Card component (shadcn/ui)
- `srcts/components/ui/input.tsx`: Input component (shadcn/ui)

**Hooks**:
- `srcts/hooks/use-dark-mode.tsx`: Dark mode management with system preference detection and localStorage
- `srcts/hooks/useSystemTheme.ts`: Legacy hook (replaced by use-dark-mode)

### Backend (R Shiny)

**`r/app.R`**:
- Calculates line count, word count, and character count from code content
- Sends back the editor content via `output$editor_content`
- **Processes cursor context** for LLM autocomplete integration
- Uses `render_json()` for all outputs
- All inputs are debounced client-side (code_content: 100ms, cursor_context: 100ms, selected_language: 0ms)

**Shiny Input/Output Flow**:
```
React → Shiny Inputs:
- code_content (string): The code being edited
- selected_language (string): Currently selected language
- cursor_context (object): {line, column, prefix, suffix, language} - cursor position and surrounding code

Shiny → React Outputs:
- line_count (number): Number of lines in code
- word_count (number): Number of words in code
- char_count (number): Number of characters in code
- editor_content (string): Echo of the code content from server
- cursor_info (string): Formatted cursor context information for LLM integration
```

### Key Dependencies

**Code Editor**:
- `@uiw/react-codemirror`: React wrapper for CodeMirror 6
- `@codemirror/lang-*`: Official language support (JavaScript, Python, HTML, CSS, JSON)
- `codemirror-lang-r`: Community R language support
- `@uiw/codemirror-theme-vscode`: VS Code themes (dark and light)

**UI Framework**:
- `@radix-ui/react-switch`: Accessible switch component
- `lucide-react`: Icon library (Sun, Moon icons)
- `tailwind-merge` and `class-variance-authority`: Tailwind CSS utilities

### Layout Structure

The application uses a full-viewport flexbox layout:
- **Header** (flex-shrink-0): Title, stats, language selector, dark mode toggle
- **Content Area** (flex-1): Two-column grid layout
  - **Left Panel**: CodeEditor component (fills height)
  - **Right Panel**: Cursor context and server output display (fills height)
    - Cursor Position: Line and column numbers
    - Context (Prefix): Last 200 chars of text before cursor
    - Context (Suffix): First 200 chars of text after cursor
    - Server Response: Formatted cursor info from Shiny

Both panels are exactly the same height and fill the remaining viewport space after the header.

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
│   ├── App.tsx             # Main application component
│   ├── components/
│   │   ├── code-editor.tsx      # CodeMirror wrapper component
│   │   └── ui/
│   │       ├── switch.tsx       # Custom switch with icon support
│   │       ├── card.tsx         # Card component
│   │       └── input.tsx        # Input component
│   ├── hooks/
│   │   ├── use-dark-mode.tsx    # Dark mode hook with localStorage
│   │   └── useSystemTheme.ts    # System theme detection (legacy)
│   ├── lib/
│   │   └── utils.ts             # Utility functions (cn helper)
│   └── globals.css              # Global styles and Tailwind imports
├── r/                      # R Shiny backend
│   ├── app.R               # Main R Shiny application
│   ├── shinyreact.R        # R functions for shiny-react
│   └── www/
│       └── app/             # Built assets (auto-generated)
│           ├── main.js      # Built JavaScript bundle
│           └── main.css     # Built CSS bundle
└── py/                     # Python Shiny backend (not currently used)
    ├── app.py              # Main Python Shiny application
    ├── shinyreact.py       # Python functions for shiny-react
    └── www/
        └── app/             # Built assets (auto-generated)
            ├── main.js      # Built JavaScript bundle
            └── main.css     # Built CSS bundle
```

## Key Files and Their Purpose

### Frontend (React/TypeScript)
- **`srcts/main.tsx`**: Entry point that mounts the React app to the DOM
- **`srcts/App.tsx`**: Main application component with editor, stats, and dark mode
- **`srcts/components/code-editor.tsx`**: CodeMirror 6 wrapper with language support and theming
- **`srcts/components/ui/switch.tsx`**: Custom switch component with icon support (used for dark mode toggle)
- **`srcts/hooks/use-dark-mode.tsx`**: Dark mode management with system preference and localStorage
- **`srcts/globals.css`**: Global styles and Tailwind CSS imports

### Backend (Shiny - R)
- **`r/app.R`**: Main R Shiny server - calculates stats and echoes editor content
- **`r/shinyreact.R`**: Utility functions for bare page setup and custom renderers
- **`r/www/app/`**: Auto-generated build output (JavaScript and CSS bundles)

### Configuration
- **`package.json`**: Dependencies including CodeMirror, Radix UI, and language packages
- **`tsconfig.json`**: TypeScript configuration with path aliases
- **`components.json`**: shadcn/ui configuration

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

### Adding Support for a New Programming Language
1. **Install the language package**:
   ```bash
   npm install @codemirror/lang-<language>
   # or for community packages
   npm install codemirror-lang-<language>
   ```
2. **Import in `code-editor.tsx`**: Add the language import
3. **Update the Language type**: Add the new language to the union type
4. **Add to getLanguageExtension()**: Add a case in the switch statement
5. **Update App.tsx**: Add the language option to the select dropdown

### Modifying Editor Appearance
- **Font size**: Edit the `style` prop in `code-editor.tsx` (currently 14px)
- **Themes**: Change `vscodeDark` or `vscodeLight` imports to different themes
- **Height**: Editor uses `height="100%"` to fill its flex container
- **Editor features**: Modify the `basicSetup` object in `code-editor.tsx`

### Customizing Dark Mode
- **Default theme**: Modify `useDarkMode` options in `App.tsx`
- **Theme colors**: Update the theme-specific style classes (bgClass, titleClass, etc.)
- **Switch appearance**: Edit `Switch` component props in `App.tsx`
- **localStorage key**: Change in `use-dark-mode.tsx` if needed

### Adding New Statistics or Server Processing
1. **In `r/app.R`**: Add new `output$<name>` using `render_json({})`
2. **In `App.tsx`**: Add corresponding `useShinyOutput<type>("<name>", defaultValue)`
3. **Display in UI**: Add the output to the header or create a new panel

### Modifying the Layout
- **Panel sizing**: Edit the grid columns class in `App.tsx` (currently `grid-cols-2`)
- **Header content**: Modify the flex layout in the header section
- **Panel order**: Rearrange the div order in the grid
- **Full-height layout**: The layout uses flexbox with `h-screen`, `flex-1`, and `overflow-hidden`

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

## Implementation Notes

### CodeMirror Configuration
- **Height**: Set to `"100%"` to fill flex container (not fixed height)
- **Font size**: 14px for consistent appearance across themes
- **Themes**: VS Code Dark and VS Code Light from `@uiw/codemirror-theme-vscode`
- **Language switching**: Dynamically loads the appropriate language extension based on selection
- **Cursor tracking**: Uses CodeMirror's `onUpdate` callback with `ViewUpdate` to track cursor movements
- **Context extraction**: Extracts prefix/suffix using `doc.sliceString()` from editor state

### Dark Mode Implementation
- **Initial value**: Reads from localStorage first, falls back to system preference
- **Persistence**: Automatically saves to localStorage on every change
- **System sync**: Listens for system preference changes (only if no localStorage value exists)
- **Dark class**: Uses `applyDarkClass: true` to add `dark` class to document root
- **Semantic colors**: Uses Tailwind's semantic color classes that automatically adapt to dark mode

### Layout Architecture
- **Viewport-based**: Uses `h-screen` for exact viewport height (no page scroll)
- **Flexbox structure**: Header is fixed height, content area fills remaining space
- **Grid panels**: Two equal-width columns that both fill the content area height
- **No fixed heights**: All heights are relative to container for flexibility

### Shiny Communication
- **Debouncing**: Code content is debounced at 100ms client-side
- **Cursor context**: Debounced at 100ms to balance responsiveness with performance
- **No debouncing**: Language selector has 0ms debounce for instant switching
- **Type safety**: All inputs/outputs use TypeScript generics for type checking
- **Cursor data flow**: CodeMirror → React callback (200ms debounce) → Shiny input (100ms debounce)

### LLM Autocomplete Integration
- **Context extraction**: Captures 1000 chars before cursor (prefix) and 200 chars after (suffix)
- **Cursor position**: Tracks line number and column for precise positioning
- **Language context**: Includes programming language in cursor context
- **Ready for LLM**: All necessary context is sent to server for LLM API integration
- **Server processing**: Currently formats and displays context info; ready to add LLM API calls

## Key Dependencies

**Core Framework**:
- **@posit/shiny-react**: Core library for React-Shiny communication
- **react + react-dom**: React 19 framework
- **typescript**: TypeScript compiler and type checking
- **esbuild**: Fast JavaScript bundling

**Code Editor**:
- **@uiw/react-codemirror**: CodeMirror 6 React wrapper
- **@codemirror/lang-***: Language support packages (JavaScript, Python, HTML, CSS, JSON)
- **codemirror-lang-r**: R language support
- **@uiw/codemirror-theme-vscode**: VS Code themes

**UI Components**:
- **@radix-ui/react-switch**: Accessible switch primitive
- **lucide-react**: Icon library
- **tailwind-merge**: Tailwind CSS class merging
- **class-variance-authority**: Utility for managing component variants

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
