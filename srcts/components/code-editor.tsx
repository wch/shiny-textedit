import type { Theme } from "@/hooks/useSystemTheme";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { python } from "@codemirror/lang-python";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";
import { r } from "codemirror-lang-r";
import React from "react";

export type Language =
  | "javascript"
  | "typescript"
  | "python"
  | "r"
  | "html"
  | "css"
  | "json";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
  theme?: Theme;
  className?: string;
}

export function CodeEditor({
  value,
  onChange,
  language,
  theme = "dark",
  className = "",
}: CodeEditorProps) {
  // Get the appropriate language extension based on selected language
  const getLanguageExtension = () => {
    switch (language) {
      case "javascript":
        return javascript({ jsx: false });
      case "typescript":
        return javascript({ typescript: true });
      case "python":
        return python();
      case "r":
        return r();
      case "html":
        return html();
      case "css":
        return css();
      case "json":
        return json();
      default:
        return javascript();
    }
  };

  return (
    <div className={className}>
      <CodeMirror
        value={value}
        height="600px"
        theme={theme === "dark" ? vscodeDark : vscodeLight}
        extensions={[getLanguageExtension()]}
        onChange={(value) => onChange(value)}
        style={{
          fontSize: "14px",
        }}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          searchKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
      />
    </div>
  );
}
