'use client';

import { forwardRef } from 'react';
import { Camera } from 'lucide-react';

interface VideoContainerProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isStreaming: boolean;
}

const VideoContainer = forwardRef<HTMLDivElement, VideoContainerProps>(
  ({ videoRef, canvasRef, isStreaming }, ref) => (
    <div ref={ref} className="relative bg-black/50 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={`w-full h-full object-cover ${isStreaming ? 'block' : 'hidden'}`}
      />
      <canvas ref={canvasRef} className="hidden" />
      {!isStreaming && (
        <div className="text-center text-gray-400">
          <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Camera feed will appear here</p>
        </div>
      )}
    </div>
  )
);
VideoContainer.displayName = 'VideoContainer';

export { VideoContainer };
