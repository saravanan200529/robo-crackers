'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Star, Video, Loader2, Link as LinkIcon } from 'lucide-react';

export interface UploadedMediaItem {
  url: string;
  altText?: string;
  isPrimary?: boolean;
}

interface MediaUploaderProps {
  images: UploadedMediaItem[];
  onChange: (images: UploadedMediaItem[]) => void;
  videoUrl?: string;
  onVideoChange?: (url: string) => void;
  folder?: string;
}

export function MediaUploader({
  images,
  onChange,
  videoUrl = '',
  onVideoChange,
  folder = 'products',
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    await uploadFiles(Array.from(files));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFiles = async (fileList: File[]) => {
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('folder', folder);

    fileList.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      const newUploaded: UploadedMediaItem[] = data.files
        .filter((f: any) => !f.isVideo)
        .map((f: any, idx: number) => ({
          url: f.url,
          altText: f.name,
          isPrimary: images.length === 0 && idx === 0,
        }));

      // Check if a video was uploaded
      const uploadedVideo = data.files.find((f: any) => f.isVideo);
      if (uploadedVideo && onVideoChange) {
        onVideoChange(uploadedVideo.url);
      }

      if (newUploaded.length > 0) {
        // If there were no prior images, ensure the first is marked primary
        const updated = [...images, ...newUploaded];
        if (!updated.some((img) => img.isPrimary)) {
          updated[0].isPrimary = true;
        }
        onChange(updated);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
      updated[0].isPrimary = true;
    }
    onChange(updated);
  };

  const handleSetPrimary = (indexToPrimary: number) => {
    const updated = images.map((img, idx) => ({
      ...img,
      isPrimary: idx === indexToPrimary,
    }));
    onChange(updated);
  };

  const handleAddManualUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;

    const newImg: UploadedMediaItem = {
      url: manualUrl.trim(),
      altText: 'Product photo',
      isPrimary: images.length === 0,
    };
    onChange([...images, newImg]);
    setManualUrl('');
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block font-bold text-slate-800 text-xs sm:text-sm">
            Product Photos & Media Gallery
          </label>
          <span className="text-[11px] text-slate-500">
            Upload multiple photos. Mark one as primary for catalog thumbnails.
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-bold text-red-600 hover:text-red-700 inline-flex items-center gap-1 cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Hide URL input' : '+ Add via URL'}</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
          {error}
        </div>
      )}

      {/* Manual URL Input */}
      {showUrlInput && (
        <div className="flex gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://example.com/fireworks-box.jpg"
            className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-red-500"
          />
          <button
            type="button"
            onClick={handleAddManualUrl}
            className="px-3 py-1.5 bg-red-600 text-white font-bold text-xs rounded-lg hover:bg-red-700 cursor-pointer"
          >
            Add
          </button>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            uploadFiles(Array.from(e.dataTransfer.files));
          }
        }}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
          uploading
            ? 'border-amber-400 bg-amber-50/50'
            : 'border-slate-300 hover:border-red-500 hover:bg-red-50/20 bg-slate-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4"
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploading ? (
          <>
            <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
            <span className="text-xs font-bold text-slate-700">Uploading photos to server...</span>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                Click or drag & drop firecracker photos here
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Supports JPG, PNG, WebP (up to 10MB each) and MP4 videos (up to 50MB)
              </p>
            </div>
          </>
        )}
      </div>

      {/* Uploaded Images Gallery Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-700 block">
            Uploaded Photos ({images.length})
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div
                key={img.url + idx}
                className={`relative group rounded-xl overflow-hidden border-2 bg-slate-100 aspect-square shadow-xs transition ${
                  img.isPrimary ? 'border-red-600 ring-2 ring-red-200' : 'border-slate-200'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.altText || `Product photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Primary Badge */}
                {img.isPrimary ? (
                  <span className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" />
                    <span>Primary</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetPrimary(idx);
                    }}
                    className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 bg-slate-900/80 hover:bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow transition cursor-pointer"
                  >
                    Set Primary
                  </button>
                )}

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(idx);
                  }}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-slate-900/80 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition cursor-pointer shadow-md"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video URL Field */}
      {onVideoChange && (
        <div className="pt-2">
          <label className="block font-bold text-slate-700 text-xs mb-1">
            Video Link (Optional MP4 or YouTube Demo)
          </label>
          <div className="relative">
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => onVideoChange(e.target.value)}
              placeholder="e.g. /uploads/products/win-wheel-demo.mp4 or https://youtube.com/watch?v=..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs outline-none focus:bg-white focus:border-red-500"
            />
            <Video className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      )}
    </div>
  );
}
