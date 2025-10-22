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
  const { isDarkMode, toggle } = useDarkMode({ applyDarkClass: true });

  const [codeContent, setCodeContent] = useShinyInput<string>(
    "code_content",
    DEFAULT_CODE,
    { debounceMs: 100 },
  );

  const [selectedLanguage, setSelectedLanguage] = useShinyInput<Language>(
    "selected_language",
    "r",
    { debounceMs: 0 },
  );

  const [lineCount] = useShinyOutput<number>("line_count", 0);
  const [charCount] = useShinyOutput<number>("char_count", 0);
  const [wordCount] = useShinyOutput<number>("word_count", 0);
  const [editorContent] = useShinyOutput<string>("editor_content", "");

  const handleCodeChange = (value: string) => {
    setCodeContent(value);
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedLanguage(event.target.value as Language);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex-shrink-0 px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Code Editor</h1>
          <div className="flex gap-6 items-center">
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Lines: {lineCount}</span>
              <span>Words: {wordCount}</span>
              <span>Characters: {charCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <label
                htmlFor="language-select"
                className="text-sm text-muted-foreground"
              >
                Language:
              </label>
              <select
                id="language-select"
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="bg-background text-foreground border border-input rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
      </div>

      <div className="flex-1 px-6 pb-6 overflow-hidden">
        <div className="grid grid-cols-2 gap-4 h-full">
          <div className="flex flex-col">
            <CodeEditor
              value={codeContent}
              onChange={handleCodeChange}
              language={selectedLanguage}
              theme={isDarkMode ? "dark" : "light"}
              className="border border-border rounded-lg overflow-hidden flex-1"
            />
          </div>

          <div className="border border-border rounded-lg overflow-hidden bg-card flex flex-col">
            <div className="px-4 py-2 border-b border-border flex-shrink-0">
              <h2 className="text-sm font-semibold text-card-foreground">
                Server Output (editor_content)
              </h2>
            </div>
            <div className="flex-1 overflow-auto bg-muted">
              <pre className="p-4 text-sm font-mono text-muted-foreground">
                {editorContent || "(empty)"}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
