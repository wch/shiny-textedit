import type { EditInfo } from "@/components/code-editor";
import React from "react";

interface RecentEditsListProps {
  edits: EditInfo[] | null | undefined;
  maxEdits?: number;
  emptyMessage?: string;
}

export function RecentEditsList({
  edits,
  maxEdits = 5,
  emptyMessage = "No recent edits",
}: RecentEditsListProps) {
  if (!edits || edits.length === 0) {
    return <div className="text-muted-foreground">{emptyMessage}</div>;
  }

  return (
    <div className="space-y-2">
      {edits
        .slice(-maxEdits)
        .reverse()
        .map((edit, index) => (
          <div
            key={index}
            className="border-b border-border pb-1 last:border-b-0"
          >
            <div className="text-muted-foreground text-[10px]">
              Pos {edit.from}-{edit.to}
            </div>
            {edit.remove && (
              <div className="text-red-400">- &quot;{edit.remove}&quot;</div>
            )}
            {edit.insert && (
              <div className="text-green-400">+ &quot;{edit.insert}&quot;</div>
            )}
          </div>
        ))}
    </div>
  );
}
