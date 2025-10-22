import { MinimalTiptap } from "@/components/minimal-tiptap";
import { useShinyInput, useShinyOutput } from "@posit/shiny-react";
import React from "react";

export function App() {
  const [editorContent, setEditorContent] = useShinyInput<string>(
    "editor_content",
    "<h1>Welcome to Shiny Text Editor</h1><p>Start editing your document here...</p>",
    { debounceMs: 100 },
  );

  const [wordCount] = useShinyOutput<number>("word_count", 0);
  const [charCount] = useShinyOutput<number>("char_count", 0);

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Text Editor</h1>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Words: {wordCount}</span>
              <span>Characters: {charCount}</span>
            </div>
          </div>

          <MinimalTiptap
            content={editorContent}
            onChange={handleEditorChange}
            placeholder="Start writing..."
            className="bg-card"
          />
        </div>
      </div>
    </div>
  );
}
