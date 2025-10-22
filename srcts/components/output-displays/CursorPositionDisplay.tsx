import React from "react";

interface CursorPositionDisplayProps {
  position:
    | { line: number; column: number; language?: string }
    | null
    | undefined;
  emptyMessage?: string;
  showLanguage?: boolean;
}

export function CursorPositionDisplay({
  position,
  emptyMessage = "No position data",
  showLanguage = false,
}: CursorPositionDisplayProps) {
  if (!position) {
    return <div className="text-muted-foreground">{emptyMessage}</div>;
  }

  return (
    <div>
      Line {position.line}, Column {position.column}
      {showLanguage && position.language && ` (${position.language})`}
    </div>
  );
}
