'use client';

import { forwardRef } from 'react';
import { Camera } from 'lucide-react';

interface VideoContainerProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isStreaming: boolean;
  headDirection?: string;
}

const VideoContainer = forwardRef<HTMLDivElement, VideoContainerProps>(
  ({ videoRef, canvasRef, isStreaming, headDirection = 'Forward' }, ref) => (
    <div ref={ref} className="relative flex items-center justify-center w-full max-w-sm aspect-square mx-auto">
      {/* Orange glowing ring */}
      <div className="absolute inset-0 rounded-full border-4 border-[#ff6a00]" 
           style={{
             boxShadow: '0 0 15px 5px rgba(255, 106, 0, 0.3), 0 0 30px 10px rgba(255, 106, 0, 0.2)'
           }}>
      </div>
      
      {/* Camera feed circle */}
      <div className="w-[90%] h-[90%] rounded-full overflow-hidden bg-black/50 flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`w-full h-full object-cover ${isStreaming ? 'block' : 'hidden'}`}
        />
        {!isStreaming && (
          <div className="text-center text-gray-400">
            <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Camera feed will appear here</p>
          </div>
        )}
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Head direction overlay - shown when streaming */}
      {isStreaming && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-center">
          <h2 className="text-[#E5E7EB] text-2xl font-bold">
            Current Head Direction: {headDirection}
          </h2>
        </div>
      )}
    </div>
  )
);
VideoContainer.displayName = 'VideoContainer';

export { VideoContainer };
