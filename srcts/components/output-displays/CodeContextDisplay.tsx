import React from "react";

interface CodeContextDisplayProps {
  content: string | null | undefined;
  maxLength?: number;
  sliceFrom?: "start" | "end";
  emptyMessage?: string;
}

export function CodeContextDisplay({
  content,
  maxLength = 200,
  sliceFrom = "end",
  emptyMessage = "No context",
}: CodeContextDisplayProps) {
  if (!content) {
    return <div className="text-muted-foreground">{emptyMessage}</div>;
  }

  const displayContent =
    sliceFrom === "end" ? content.slice(-maxLength) : content.slice(0, maxLength);

  return (
    <pre className="whitespace-pre-wrap break-all">{displayContent}</pre>
  );
}
