"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductLightboxProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
  open: boolean;
}

export default function ProductLightbox({
  images,
  initialIndex,
  onClose,
  open,
}: ProductLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset index when opening with a different image
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
      setImageLoaded(false);
      // Lock body scroll
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, initialIndex]);

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(((index % images.length) + images.length) % images.length);
      setImageLoaded(false);
    },
    [images.length],
  );

  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          goPrev();
          break;
        case "ArrowRight":
          e.preventDefault();
          goNext();
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, goNext, goPrev, onClose]);

  if (!open) return null;

  const hasMultiple = images.length > 1;

  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <span className="text-sm text-white/60">
          {currentIndex + 1} / {images.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "rounded-md p-2 text-white/70 transition-colors",
            "hover:bg-white/10 hover:text-white",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
          )}
          aria-label="Close lightbox"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Main image area */}
      <div className="relative flex flex-1 items-center justify-center px-4">
        {/* Previous arrow */}
        {hasMultiple && (
          <button
            type="button"
            onClick={goPrev}
            className={cn(
              "absolute left-4 z-10 flex h-12 w-12 items-center justify-center",
              "rounded-full bg-white/10 text-white/80 backdrop-blur-sm transition-colors",
              "hover:bg-white/20 hover:text-white",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
            )}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
        )}

        {/* Image */}
        <div
          className="relative flex h-full w-full max-w-4xl items-center justify-center"
          onClick={onClose}
        >
          <div className="relative h-[70vh] w-full">
            <Image
              src={images[currentIndex]}
              alt={`Product image ${currentIndex + 1}`}
              fill
              sizes="90vw"
              className={cn(
                "object-contain transition-opacity duration-300",
                imageLoaded ? "opacity-100" : "opacity-0",
              )}
              onLoad={() => setImageLoaded(true)}
              priority
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              </div>
            )}
          </div>
        </div>

        {/* Next arrow */}
        {hasMultiple && (
          <button
            type="button"
            onClick={goNext}
            className={cn(
              "absolute right-4 z-10 flex h-12 w-12 items-center justify-center",
              "rounded-full bg-white/10 text-white/80 backdrop-blur-sm transition-colors",
              "hover:bg-white/20 hover:text-white",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
            )}
            aria-label="Next image"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {hasMultiple && (
        <div className="flex items-center justify-center gap-2 px-4 py-4">
          {images.map((img, idx) => (
            <button
              key={img}
              type="button"
              onClick={() => goTo(idx)}
              className={cn(
                "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md transition-all",
                idx === currentIndex
                  ? "ring-2 ring-white ring-offset-2 ring-offset-black"
                  : "opacity-50 hover:opacity-80",
              )}
              aria-label={`Go to image ${idx + 1}`}
              aria-current={idx === currentIndex ? "true" : undefined}
            >
              <Image
                src={img}
                alt={`Product image ${idx + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
