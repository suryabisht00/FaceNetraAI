'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

interface MediaFile {
  file: File;
  preview: string;
  type: 'image' | 'video';
  id: string;
}

interface CreatePostProps {
  onSuccess?: () => void;
}

export default function CreatePost({ onSuccess }: CreatePostProps) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE' | 'FRIENDS_ONLY'>('PUBLIC');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (mediaFiles.length + files.length > 10) {
      setError('You can upload a maximum of 10 media files');
      return;
    }

    const newMediaFiles: MediaFile[] = files.map((file) => {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (!isVideo && !isImage) {
        setError('Only image and video files are allowed');
        return null;
      }

      // Check file size (max 50MB for videos, 10MB for images)
      const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setError(`File size exceeds limit. Max ${isVideo ? '50MB' : '10MB'} per file`);
        return null;
      }

      return {
        file,
        preview: URL.createObjectURL(file),
        type: isVideo ? 'video' as const : 'image' as const,
        id: Math.random().toString(36).substring(7),
      };
    }).filter(Boolean) as MediaFile[];

    setMediaFiles((prev) => [...prev, ...newMediaFiles]);
    setError(null);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeMedia = (id: string) => {
    setMediaFiles((prev) => {
      const updated = prev.filter((media) => media.id !== id);
      // Revoke URL to free memory
      const removed = prev.find((media) => media.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.preview);
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() && mediaFiles.length === 0) {
      setError('Please add some content or media to your post');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
        return;
      }

      let uploadedMedia: Array<{
        url: string;
        type: 'IMAGE' | 'VIDEO' | 'GIF';
        width?: number;
        height?: number;
        fileSize?: number;
      }> = [];

      // Upload media files
      if (mediaFiles.length > 0) {
        const progressPerFile = 80 / mediaFiles.length;

        for (let i = 0; i < mediaFiles.length; i++) {
          const mediaFile = mediaFiles[i];
          const formData = new FormData();
          formData.append('file', mediaFile.file);
          formData.append('type', mediaFile.type);

          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          if (!uploadResponse.ok) {
            throw new Error('Failed to upload media');
          }

          const uploadData = await uploadResponse.json();

          if (uploadData.success) {
            uploadedMedia.push({
              url: uploadData.data.url,
              type: mediaFile.type === 'video' ? 'VIDEO' : 'IMAGE',
              width: uploadData.data.width,
              height: uploadData.data.height,
              fileSize: uploadData.data.size,
            });
          }

          setUploadProgress((i + 1) * progressPerFile);
        }
      }

      setUploadProgress(85);

      // Create post
      const postType = uploadedMedia.length > 0
        ? uploadedMedia[0].type === 'VIDEO'
          ? 'VIDEO'
          : 'IMAGE'
        : 'TEXT';

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: content.trim(),
          postType,
          visibility,
          media: uploadedMedia,
        }),
      });

      setUploadProgress(95);

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const data = await response.json();

      if (data.success) {
        setUploadProgress(100);

        // Clear form
        setContent('');
        setMediaFiles([]);
        setVisibility('PUBLIC');

        // Cleanup URLs
        mediaFiles.forEach((media) => URL.revokeObjectURL(media.preview));

        // Call success callback
        if (onSuccess) {
          onSuccess();
        } else {
          // Redirect to feed
          setTimeout(() => {
            router.push('/feed');
          }, 500);
        }
      }
    } catch (err) {
      console.error('Post creation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#0B0F1A] border border-primary/20 rounded-2xl p-6">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold">Create Post</h3>
            <p className="text-gray-400 text-sm">Share something with your network</p>
          </div>
        </div>

        {/* Content Textarea */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full bg-[#1a1f2e] border border-primary/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-primary/40 transition-all min-h-[120px]"
          disabled={isUploading}
        />

        {/* Media Preview */}
        {mediaFiles.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {mediaFiles.map((media) => (
              <div key={media.id} className="relative group rounded-xl overflow-hidden bg-[#1a1f2e] aspect-square">
                {media.type === 'image' ? (
                  <img
                    src={media.preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={media.preview}
                    className="w-full h-full object-cover"
                    muted
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeMedia(media.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500/90 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  disabled={isUploading}
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {media.type === 'video' && (
                  <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                    VIDEO
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
              <span>Uploading...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full h-2 bg-[#1a1f2e] rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {/* Media Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-xl text-white text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isUploading || mediaFiles.length >= 10}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Add Media</span>
            {mediaFiles.length > 0 && <span className="text-primary">({mediaFiles.length}/10)</span>}
          </button>

          {/* Visibility Selector */}
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as 'PUBLIC' | 'PRIVATE' | 'FRIENDS_ONLY')}
            className="px-4 py-2 bg-[#1a1f2e] border border-primary/20 rounded-xl text-white text-sm focus:outline-none focus:border-primary/40 disabled:opacity-50"
            disabled={isUploading}
          >
            <option value="PUBLIC">🌍 Public</option>
            <option value="FRIENDS_ONLY">👥 Friends Only</option>
            <option value="PRIVATE">🔒 Private</option>
          </select>

          {/* Submit Button */}
          <button
            type="submit"
            className="ml-auto px-6 py-2 bg-primary hover:bg-primary/90 rounded-xl text-white font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            disabled={isUploading || (!content.trim() && mediaFiles.length === 0)}
          >
            {isUploading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
