'use client';

import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Play, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageGalleryProps {
  images: { url: string; altText?: string | null }[];
  productName: string;
  categoryName: string;
  videoUrl?: string | null;
}

export function ProductImageGallery({
  images,
  productName,
  categoryName,
  videoUrl,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isVideoActive, setIsVideoActive] = useState(false);

  const hasImages = images && images.length > 0;
  const currentImage = hasImages ? images[selectedIndex] : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Display Container */}
      <div className="relative aspect-square w-full rounded-2xl bg-gradient-to-br from-slate-900 via-zinc-800 to-amber-950 overflow-hidden flex flex-col items-center justify-center text-center border border-slate-200 shadow-inner">
        {isVideoActive && videoUrl ? (
          <div className="w-full h-full bg-black flex items-center justify-center">
            {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
              <iframe
                src={videoUrl.replace('watch?v=', 'embed/')}
                title={`${productName} fireworks video demo`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            )}
          </div>
        ) : hasImages && currentImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={currentImage.url}
            alt={currentImage.altText || productName}
            className="w-full h-full object-cover transition-all duration-300"
          />
        ) : (
          <div className="space-y-4 p-8 select-none">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shadow-lg">
              <Sparkles className="w-10 h-10 text-amber-400 animate-pulse" />
            </div>
            <div>
              <span className="text-amber-400 font-bold text-sm tracking-wider uppercase">
                {categoryName}
              </span>
              <h3 className="text-lg font-black text-white mt-1">{productName}</h3>
            </div>

            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs text-zinc-200 border border-white/20">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Certified Genuine Sivakasi Batch</span>
            </div>

            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Manufacturer original fireworks packaging. Actual batch photo update in progress.
            </p>
          </div>
        )}

        {/* 80% Discount Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-red-600 text-white font-black text-sm px-3 py-1 rounded-lg shadow-md">
            80% OFF
          </span>
        </div>

        {/* Next / Prev Navigation Arrows (if multiple photos) */}
        {hasImages && images.length > 1 && !isVideoActive && (
          <>
            <button
              type="button"
              onClick={() => setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer"
              title="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer"
              title="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row (if multiple images or video) */}
      {(images.length > 1 || videoUrl) && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-0.5">
          {images.map((img, idx) => (
            <button
              key={img.url + idx}
              type="button"
              onClick={() => {
                setIsVideoActive(false);
                setSelectedIndex(idx);
              }}
              className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                !isVideoActive && selectedIndex === idx
                  ? 'border-red-600 ring-2 ring-red-200'
                  : 'border-slate-200 opacity-70 hover:opacity-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}

          {/* Video Thumbnail Button */}
          {videoUrl && (
            <button
              type="button"
              onClick={() => setIsVideoActive(true)}
              className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 flex flex-col items-center justify-center bg-slate-900 text-white transition cursor-pointer ${
                isVideoActive
                  ? 'border-red-600 ring-2 ring-red-200'
                  : 'border-slate-200 opacity-70 hover:opacity-100'
              }`}
            >
              <Play className="w-5 h-5 fill-red-500 text-red-500" />
              <span className="text-[9px] font-bold mt-0.5">Video</span>
            </button>
          )}
        </div>
      )}

      {/* Trust Line */}
      <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          100% Sivakasi Genuine
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Green Cracker Standard
        </span>
      </div>
    </div>
  );
}
