import { CodeEditor, type Language } from "@/components/code-editor";
import { Switch } from "@/components/ui/switch";
import { useDarkMode } from "@/hooks/use-dark-mode";
import { useShinyInput, useShinyOutput } from "@posit/shiny-react";
import { MoonIcon, SunIcon } from "lucide-react";
import React from "react";

const DEFAULT_CODE = `# R Example
print("Hello from Shiny Code Editor!")

# Calculate some statistics
data <- mtcars
summary(data$mpg)
`;

export function App() {
  const { isDarkMode, toggle } = useDarkMode({ applyDarkClass: false });

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

  // Theme-specific styles
  const bgClass = isDarkMode ? "bg-slate-950" : "bg-gray-50";
  const titleClass = isDarkMode ? "text-white" : "text-gray-900";
  const statsClass = isDarkMode ? "text-slate-400" : "text-gray-600";
  const labelClass = isDarkMode ? "text-slate-400" : "text-gray-600";
  const selectClass = isDarkMode
    ? "bg-slate-800 text-white border-slate-700 focus:ring-blue-500"
    : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500";
  const editorBorderClass = isDarkMode ? "border-slate-700" : "border-gray-300";

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className={`text-3xl font-bold ${titleClass}`}>Code Editor</h1>
            <div className="flex gap-6 items-center">
              <div className={`flex gap-4 text-sm ${statsClass}`}>
                <span>Lines: {lineCount}</span>
                <span>Words: {wordCount}</span>
                <span>Characters: {charCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="language-select" className={`text-sm ${labelClass}`}>
                  Language:
                </label>
                <select
                  id="language-select"
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  className={`${selectClass} border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2`}
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
              <Switch
                icon={
                  isDarkMode ? (
                    <MoonIcon className="h-3 w-3" />
                  ) : (
                    <SunIcon className="h-3 w-3" />
                  )
                }
                checked={isDarkMode}
                onCheckedChange={toggle}
                className="h-7 w-12"
                thumbClassName="h-6 w-6 data-[state=checked]:translate-x-5"
              />
            </div>
          </div>

          <CodeEditor
            value={codeContent}
            onChange={handleCodeChange}
            language={selectedLanguage}
            theme={isDarkMode ? "dark" : "light"}
            className={`border ${editorBorderClass} rounded-lg overflow-hidden`}
          />
        </div>
      </div>
    </div>
  );
}
