'use client';

import { forwardRef } from 'react';
import { Camera } from 'lucide-react';

interface VideoContainerProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isStreaming: boolean;
  headDirection?: string;
  completedTasks?: number;
  totalTasks?: number;
}

const VideoContainer = forwardRef<HTMLDivElement, VideoContainerProps>(
  ({ videoRef, canvasRef, isStreaming, headDirection = 'Forward', completedTasks = 0, totalTasks = 0 }, ref) => {
    // Determine border color and glow based on task completion
    const hasActiveTasks = totalTasks > 0;
    const hasCompletedTasks = completedTasks > 0;
    
    // Show green for each completed task, orange for active tasks
    const borderColor = hasActiveTasks && hasCompletedTasks
      ? 'border-green-500' 
      : hasActiveTasks
      ? 'border-[#ff6a00]'
      : 'border-gray-500';
    
    const boxShadowColor = hasActiveTasks && hasCompletedTasks
      ? '0 0 15px 5px rgba(34, 197, 94, 0.4), 0 0 30px 10px rgba(34, 197, 94, 0.3)'
      : hasActiveTasks
      ? '0 0 15px 5px rgba(255, 106, 0, 0.3), 0 0 30px 10px rgba(255, 106, 0, 0.2)'
      : '0 0 10px 2px rgba(156, 163, 175, 0.2)';
    
    return (
    <>
      {/* Glowing ring with dynamic color - turns green when tasks are completed */}
      <div className={`absolute inset-0 rounded-full border-4 ${borderColor} transition-all duration-500`}
           style={{
             boxShadow: boxShadowColor
           }}>
      </div>
      
      {/* Camera feed circle */}
      <div className="w-[90%] h-[90%] bg-center bg-no-repeat bg-cover aspect-square rounded-full overflow-hidden bg-black/50 flex items-center justify-center flex-1">
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
    </>
  );
  }
);
VideoContainer.displayName = 'VideoContainer';

export { VideoContainer };
