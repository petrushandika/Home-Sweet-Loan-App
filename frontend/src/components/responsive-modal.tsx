"use client"

import * as React from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface ResponsiveModalProps {
  children: React.ReactNode
  trigger?: React.ReactNode
  title: string
  description?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

export function ResponsiveModal({
  children,
  trigger,
  title,
  description,
  open,
  onOpenChange,
  className,
}: ResponsiveModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent className={cn("sm:max-w-[500px] rounded-3xl border-slate-200 shadow-2xl animate-smooth-in", className)}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900">{title}</DialogTitle>
            {description && (
              <DialogDescription className="text-slate-500 font-medium">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="py-4">
            {children}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent side="bottom" className={cn("rounded-t-[32px] border-t-0 bg-white p-6 pb-12 shadow-[0_-8px_30px_rgb(0,0,0,0.12)]", className)}>
        <div className="bottom-sheet-handle" />
        <SheetHeader className="text-left mb-6">
          <SheetTitle className="text-2xl font-bold text-slate-900">{title}</SheetTitle>
          {description && (
            <SheetDescription className="text-slate-500 font-medium">
              {description}
            </SheetDescription>
          ) || <div className="h-0" />}
        </SheetHeader>
        <div className="animate-smooth-in">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  )
}
