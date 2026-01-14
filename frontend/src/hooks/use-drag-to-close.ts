"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseDragToCloseProps {
  onClose: () => void;
  threshold?: number;
}

export function useDragToClose({
  onClose,
  threshold = 150,
}: UseDragToCloseProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    setStartY(touch.clientY);
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      const deltaY = touch.clientY - startY;

      // Only allow dragging down
      if (deltaY > 0) {
        setTranslateY(deltaY);
        if (containerRef.current) {
          containerRef.current.style.transform = `translateY(${deltaY}px)`;
          containerRef.current.style.transition = "none";
        }
      }
    },
    [isDragging, startY]
  );

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;

    if (translateY > threshold) {
      // Close the sheet
      if (containerRef.current) {
        containerRef.current.style.transition = "transform 0.3s ease-out";
        containerRef.current.style.transform = "translateY(100%)";
      }
      setTimeout(() => {
        onClose();
      }, 300);
    } else {
      // Reset position
      if (containerRef.current) {
        containerRef.current.style.transition = "transform 0.3s ease-out";
        containerRef.current.style.transform = "translateY(0)";
      }
    }

    setIsDragging(false);
    setStartY(0);
    setTranslateY(0);
  }, [isDragging, translateY, threshold, onClose]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { containerRef, isDragging };
}
