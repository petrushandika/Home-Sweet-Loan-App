"use client";

import * as React from "react";
import { X } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface ResponsiveModalProps {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function ResponsiveModal({
  children,
  trigger,
  title,
  description,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  className,
}: ResponsiveModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const sheetRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  // Internal state for uncontrolled mode
  const [internalOpen, setInternalOpen] = React.useState(false);

  // Use controlled or uncontrolled state
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange : setInternalOpen;

  // Reset transform when modal opens
  React.useEffect(() => {
    if (open && sheetRef.current) {
      sheetRef.current.style.transform = "translateY(0)";
    }
  }, [open]);

  const handleClose = React.useCallback(() => {
    setOpen?.(false);
  }, [setOpen]);

  const handleDrag = React.useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const startY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const startTime = Date.now();
      let currentY = startY;
      setIsDragging(true);

      const handleMove = (moveE: TouchEvent | MouseEvent) => {
        currentY =
          "touches" in moveE ? moveE.touches[0].clientY : moveE.clientY;
        const deltaY = currentY - startY;
        if (deltaY > 0 && sheetRef.current) {
          sheetRef.current.style.transform = `translateY(${deltaY}px)`;
          sheetRef.current.style.transition = "none";
        }
      };

      const handleEnd = () => {
        const deltaY = currentY - startY;
        const deltaTime = Date.now() - startTime;
        const velocity = deltaY / deltaTime;

        const shouldClose = deltaY > 80 || velocity > 0.3;

        if (shouldClose) {
          if (sheetRef.current) {
            sheetRef.current.style.transition = "transform 0.2s ease-out";
            sheetRef.current.style.transform = "translateY(100%)";
          }
          setTimeout(() => {
            handleClose();
            if (sheetRef.current) {
              sheetRef.current.style.transform = "translateY(0)";
            }
          }, 200);
        } else {
          if (sheetRef.current) {
            sheetRef.current.style.transition =
              "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)";
            sheetRef.current.style.transform = "translateY(0)";
          }
        }

        setIsDragging(false);
        document.removeEventListener("touchmove", handleMove as EventListener);
        document.removeEventListener("touchend", handleEnd);
        document.removeEventListener("mousemove", handleMove as EventListener);
        document.removeEventListener("mouseup", handleEnd);
      };

      document.addEventListener("touchmove", handleMove as EventListener, {
        passive: false,
      });
      document.addEventListener("touchend", handleEnd);
      document.addEventListener("mousemove", handleMove as EventListener);
      document.addEventListener("mouseup", handleEnd);
    },
    [handleClose]
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent
          className={cn(
            "sm:max-w-[500px] max-h-[85vh] flex flex-col rounded-3xl border-border bg-card shadow-2xl animate-smooth-in overflow-hidden",
            className
          )}
        >
          <DialogHeader className="shrink-0 p-6 pb-2">
            <DialogTitle className="text-2xl font-bold text-foreground">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-muted-foreground font-medium">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2 emerald-scrollbar">
            {children}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent
        ref={sheetRef}
        side="bottom"
        className={cn(
          "rounded-t-[32px] border-t-0 bg-card p-0 shadow-[0_-8px_30px_rgb(0,0,0,0.12)] max-h-[90vh] flex flex-col [&>button]:hidden",
          className
        )}
      >
        <div className="shrink-0">
          <div className="pt-3 pb-2">
            <div
              className={cn(
                "bottom-sheet-handle cursor-grab active:cursor-grabbing",
                isDragging && "bg-slate-400 dark:bg-slate-600"
              )}
              onTouchStart={handleDrag}
              onMouseDown={handleDrag}
            />
          </div>
          <div className="px-6 pb-4 flex items-start justify-between">
            <SheetHeader className="text-left flex-1">
              <SheetTitle className="text-2xl font-bold text-foreground">
                {title}
              </SheetTitle>
              {description && (
                <SheetDescription className="text-muted-foreground font-medium">
                  {description}
                </SheetDescription>
              )}
            </SheetHeader>
            <SheetClose asChild>
              <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none shrink-0 ml-4">
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <span className="sr-only">Close</span>
              </button>
            </SheetClose>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6 emerald-scrollbar">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
