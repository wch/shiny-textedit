import { cn } from "@/lib/utils";
import React from "react";

interface OutputSectionProps {
  title: string;
  children: React.ReactNode;
  titleLevel?: "h3" | "h4";
  contentClassName?: string;
  scrollable?: boolean;
}

export function OutputSection({
  title,
  children,
  titleLevel = "h3",
  contentClassName = "",
}: OutputSectionProps) {
  const TitleTag = titleLevel;

  return (
    <div>
      <TitleTag className="text-xs font-semibold text-muted-foreground uppercase mb-2">
        {title}
      </TitleTag>
      <div
        className={cn(
          `bg-muted p-3 rounded text-xs font-mono max-h-40 overflow-auto`,
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
