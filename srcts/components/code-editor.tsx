import type { Theme } from "@/hooks/useSystemTheme";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { python } from "@codemirror/lang-python";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import { r } from "codemirror-lang-r";
import React, { useCallback, useRef } from "react";

const DEBOUNCE_MS = 0;

export type Language =
  | "javascript"
  | "typescript"
  | "python"
  | "r"
  | "html"
  | "css"
  | "json";

export interface EditInfo {
  timestamp: number;
  from: number;
  to: number;
  insert: string;
  remove: string;
}

export interface CursorContext {
  line: number;
  column: number;
  prefix: string;
  suffix: string;
  language: Language;
  recentEdits: EditInfo[];
}

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
  theme?: Theme;
  className?: string;
  onCursorChange?: (context: CursorContext) => void;
}

export function CodeEditor({
  value,
  onChange,
  language,
  theme = "dark",
  className = "",
  onCursorChange,
}: CodeEditorProps) {
  const debounceTimerRef = useRef<number | null>(null);
  const recentEditsRef = useRef<EditInfo[]>([]);

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

  // Handle cursor position and context extraction
  const handleUpdate = useCallback(
    (update: ViewUpdate) => {
      if (!onCursorChange) return;

      // Track document changes (edits)
      if (update.docChanged) {
        const timestamp = Date.now();
        update.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
          const edit: EditInfo = {
            timestamp,
            from: fromA,
            to: toA,
            insert: inserted.toString(),
            remove: update.startState.doc.sliceString(fromA, toA),
          };
          recentEditsRef.current.push(edit);
        });

        // Keep only last 20 edits
        if (recentEditsRef.current.length > 20) {
          recentEditsRef.current = recentEditsRef.current.slice(-20);
        }

        // Remove edits older than 30 seconds
        const cutoffTime = timestamp - 30000;
        recentEditsRef.current = recentEditsRef.current.filter(
          (edit) => edit.timestamp > cutoffTime,
        );
      }

      // Only process if selection changed
      if (update.selectionSet || update.docChanged) {
        const state = update.state;
        const selection = state.selection.main;
        const cursorPos = selection.head;

        // Get line and column
        const line = state.doc.lineAt(cursorPos);
        const lineNumber = line.number;
        const column = cursorPos - line.from;

        // Extract prefix (up to 1000 chars before cursor)
        const prefixStart = Math.max(0, cursorPos - 1000);
        const prefix = state.doc.sliceString(prefixStart, cursorPos);

        // Extract suffix (up to 200 chars after cursor)
        const suffixEnd = Math.min(state.doc.length, cursorPos + 200);
        const suffix = state.doc.sliceString(cursorPos, suffixEnd);

        // Debounce the callback
        if (debounceTimerRef.current !== null) {
          clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = window.setTimeout(() => {
          onCursorChange({
            line: lineNumber,
            column: column,
            prefix: prefix,
            suffix: suffix,
            language: language,
            recentEdits: [...recentEditsRef.current],
          });
        }, DEBOUNCE_MS);
      }
    },
    [onCursorChange, language],
  );

  return (
    <div className={className}>
      <CodeMirror
        value={value}
        height="100%"
        theme={theme === "dark" ? vscodeDark : vscodeLight}
        extensions={[getLanguageExtension()]}
        onChange={(value) => onChange(value)}
        onUpdate={handleUpdate}
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
