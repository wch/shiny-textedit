import type { SelectionInfo } from "@/components/code-editor";
import React from "react";

interface SelectionListProps {
  selections: SelectionInfo[] | null | undefined;
  emptyMessage?: string;
}

export function SelectionList({
  selections,
  emptyMessage = "No selection",
}: SelectionListProps) {
  if (!selections || selections.length === 0) {
    return <div className="text-muted-foreground">{emptyMessage}</div>;
  }

  return (
    <div className="space-y-2">
      {selections.map((selection, index) => {
        const hasText = selection.text.length > 0;
        return (
          <div
            key={index}
            className="border-b border-border pb-1 last:border-b-0"
          >
            <div className="text-muted-foreground text-[10px]">
              {hasText ? (
                <>
                  Line {selection.fromLine}:{selection.fromColumn} → Line{" "}
                  {selection.toLine}:{selection.toColumn} (Pos {selection.from}
                  -{selection.to})
                </>
              ) : (
                <>
                  Line {selection.fromLine}:{selection.fromColumn} (Pos{" "}
                  {selection.from})
                </>
              )}
            </div>
            {hasText ? (
              <div className="text-blue-400 mt-1">
                &quot;
                {selection.text.length > 50
                  ? selection.text.substring(0, 50) + "..."
                  : selection.text}
                &quot;
              </div>
            ) : (
              <div className="text-muted-foreground text-[10px] mt-1">
                (cursor only)
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
