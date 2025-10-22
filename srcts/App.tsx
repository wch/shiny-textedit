import { CodeEditor, type Language } from "@/components/code-editor";
import { useShinyInput, useShinyOutput } from "@posit/shiny-react";
import React from "react";

const DEFAULT_CODE = `# R Example
print("Hello from Shiny Code Editor!")

# Calculate some statistics
data <- mtcars
summary(data$mpg)
`;

export function App() {
  const [codeContent, setCodeContent] = useShinyInput<string>(
    "code_content",
    DEFAULT_CODE,
    { debounceMs: 300 },
  );

  const [selectedLanguage, setSelectedLanguage] = useShinyInput<Language>(
    "selected_language",
    "r",
    { debounceMs: 0 },
  );

  const [lineCount] = useShinyOutput<number>("line_count", 0);
  const [charCount] = useShinyOutput<number>("char_count", 0);
  const [wordCount] = useShinyOutput<number>("word_count", 0);

  const handleCodeChange = (value: string) => {
    setCodeContent(value);
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value as Language);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Code Editor</h1>
            <div className="flex gap-6 items-center">
              <div className="flex gap-4 text-sm text-slate-400">
                <span>Lines: {lineCount}</span>
                <span>Words: {wordCount}</span>
                <span>Characters: {charCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="language-select" className="text-sm text-slate-400">
                  Language:
                </label>
                <select
                  id="language-select"
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  className="bg-slate-800 text-white border border-slate-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="r">R</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="json">JSON</option>
                </select>
              </div>
            </div>
          </div>

          <CodeEditor
            value={codeContent}
            onChange={handleCodeChange}
            language={selectedLanguage}
            className="border border-slate-700 rounded-lg overflow-hidden"
          />
        </div>
      </div>
    </div>
  );
}
