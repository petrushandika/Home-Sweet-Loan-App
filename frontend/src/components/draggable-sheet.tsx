"use client";

import * as React from "react";
import { useDragToClose } from "@/hooks/use-drag-to-close";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface DraggableSheetProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

export function DraggableSheet({
  children,
  trigger,
  open,
  onOpenChange,
  side = "bottom",
  className,
}: DraggableSheetProps) {
  const { containerRef, isDragging } = useDragToClose({
    onClose: () => onOpenChange?.(false),
    threshold: 150,
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        ref={side === "bottom" ? containerRef : undefined}
        side={side}
        className={cn(className)}
      >
        {side === "bottom" && (
          <div
            className={cn(
              "bottom-sheet-handle mt-3",
              isDragging && "bg-slate-400 dark:bg-slate-600"
            )}
          />
        )}
        {children}
      </SheetContent>
    </Sheet>
  );
}
