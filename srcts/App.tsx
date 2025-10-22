import {
  CodeEditor,
  type CursorContext,
  type EditInfo,
  type Language,
  type SelectionInfo,
} from "@/components/code-editor";
import {
  CodeContextDisplay,
  CursorPositionDisplay,
  OutputSection,
  RecentEditsList,
  SelectionList,
} from "@/components/output-displays";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
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

  const [cursorContext, setCursorContext] = useShinyInput<CursorContext | null>(
    "cursor_context",
    null,
    { debounceMs: 100 },
  );

  const [lineCount] = useShinyOutput<number>("line_count", 0);
  const [charCount] = useShinyOutput<number>("char_count", 0);
  const [wordCount] = useShinyOutput<number>("word_count", 0);
  const [cursorInfo] = useShinyOutput<string>("cursor_info", "");

  // Server-side outputs for display
  const [cursorPosition] = useShinyOutput<{
    line: number;
    column: number;
    language: string;
  } | null>("cursor_position", null);
  const [currentSelections] = useShinyOutput<SelectionInfo[] | null>(
    "current_selections",
    null,
  );
  const [contextPrefix] = useShinyOutput<string | null>("context_prefix", null);
  const [contextSuffix] = useShinyOutput<string | null>("context_suffix", null);
  const [recentEditsServer] = useShinyOutput<EditInfo[] | null>(
    "recent_edits_server",
    null,
  );

  const handleCodeChange = (value: string) => {
    setCodeContent(value);
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedLanguage(event.target.value as Language);
  };

  const handleCursorChange = (context: CursorContext) => {
    setCursorContext(context);
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
              <NativeSelect
                id="language-select"
                value={selectedLanguage}
                onChange={handleLanguageChange}
              >
                <NativeSelectOption value="r">R</NativeSelectOption>
                <NativeSelectOption value="python">Python</NativeSelectOption>
                <NativeSelectOption value="javascript">
                  JavaScript
                </NativeSelectOption>
                <NativeSelectOption value="typescript">
                  TypeScript
                </NativeSelectOption>
                <NativeSelectOption value="html">HTML</NativeSelectOption>
                <NativeSelectOption value="css">CSS</NativeSelectOption>
                <NativeSelectOption value="json">JSON</NativeSelectOption>
              </NativeSelect>
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
              onCursorChange={handleCursorChange}
              language={selectedLanguage}
              theme={isDarkMode ? "dark" : "light"}
              className="border border-border rounded-lg overflow-hidden flex-1"
            />
          </div>

          <div className="border border-border rounded-lg overflow-hidden bg-card flex flex-col">
            <div className="px-4 py-2 border-b border-border flex-shrink-0">
              <h2 className="text-sm font-semibold text-card-foreground">
                Server Output
              </h2>
            </div>
            <div className="flex-1 overflow-auto">
              <div className="p-4 space-y-4">
                {/* Server-side data sections - always visible */}
                <OutputSection title="Cursor Position">
                  <CursorPositionDisplay position={cursorPosition} />
                </OutputSection>

                <OutputSection title="Current Selection(s)">
                  <SelectionList selections={currentSelections} />
                </OutputSection>

                <OutputSection title="Context (Prefix)">
                  <CodeContextDisplay
                    content={contextPrefix}
                    sliceFrom="end"
                    emptyMessage="No prefix"
                  />
                </OutputSection>

                <OutputSection title="Context (Suffix)">
                  <CodeContextDisplay
                    content={contextSuffix}
                    sliceFrom="start"
                    emptyMessage="No suffix"
                  />
                </OutputSection>

                <OutputSection title="Recent Edits">
                  <RecentEditsList edits={recentEditsServer} />
                </OutputSection>

                <OutputSection title="Server Response (Text Summary)">
                  <pre className="whitespace-pre-wrap">
                    {cursorInfo || "(waiting for server)"}
                  </pre>
                </OutputSection>

                {/* Accordion for client-side debug data */}
                <Accordion
                  type="single"
                  collapsible
                  className="border-t border-border pt-4"
                >
                  <AccordionItem value="client-debug" className="border-0">
                    <AccordionTrigger className="py-2">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase">
                        Client-Side Debug Data
                      </h3>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <OutputSection title="Cursor Position (Client)">
                        <CursorPositionDisplay
                          position={
                            cursorContext
                              ? {
                                  line: cursorContext.line,
                                  column: cursorContext.column,
                                }
                              : null
                          }
                        />
                      </OutputSection>

                      <OutputSection title="Current Selection(s) (Client)">
                        <SelectionList selections={cursorContext?.selections} />
                      </OutputSection>

                      <OutputSection title="Context Prefix (Client)">
                        <CodeContextDisplay
                          content={cursorContext?.prefix}
                          sliceFrom="end"
                          emptyMessage="No prefix"
                        />
                      </OutputSection>

                      <OutputSection title="Context Suffix (Client)">
                        <CodeContextDisplay
                          content={cursorContext?.suffix}
                          sliceFrom="start"
                          emptyMessage="No suffix"
                        />
                      </OutputSection>

                      <OutputSection title="Recent Edits (Client)">
                        <RecentEditsList edits={cursorContext?.recentEdits} />
                      </OutputSection>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
