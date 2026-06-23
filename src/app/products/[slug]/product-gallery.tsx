"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import ProductLightbox from "@/components/product/ProductLightbox";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      {/* Main image */}
      <button
        type="button"
        className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#f5f3f0] cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c25b3e] focus-visible:ring-offset-2"
        onClick={() => setLightboxOpen(true)}
        aria-label="Open image gallery"
      >
        <Image
          src={images[selectedIndex]}
          alt={`${productName} - Image ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </button>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-[#f5f3f0] transition-all",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c25b3e] focus-visible:ring-offset-2",
                idx === selectedIndex
                  ? "ring-2 ring-[#303e39] ring-offset-2"
                  : "opacity-60 hover:opacity-100",
              )}
              aria-label={`View image ${idx + 1}`}
              aria-current={idx === selectedIndex ? "true" : undefined}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <ProductLightbox
        images={images}
        initialIndex={selectedIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
