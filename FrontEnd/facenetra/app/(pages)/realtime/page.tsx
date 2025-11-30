'use client';

import Link from 'next/link';
import { useRealtimeAPI } from '@/lib/hooks/useRealtimeAPI';
import { VideoContainer } from '@/components/realtime/VideoContainer';
import { Controls } from '@/components/realtime/Controls';
import { StatusPanel } from '@/components/realtime/StatusPanel';
import { TaskPanel } from '@/components/realtime/TaskPanel';
import { SessionInfo } from '@/components/realtime/SessionInfo';
import { Instructions } from '@/components/realtime/Instructions';
import { OfflineIndicator } from '@/components/realtime/OfflineIndicator';
import { Camera, ArrowLeft, AlertCircle } from 'lucide-react';

export default function RealtimePage() {
  const {
    isStreaming,
    sessionId,
    cameraAccess,
    detectionResult,
    taskStatus,
    offline,
    error,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    startLivenessTask,
    resetTaskSession,
  } = useRealtimeAPI();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center text-white hover:text-purple-300 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Camera className="w-8 h-8 mr-3 text-purple-400" />
            Real-time Face Anti-Spoofing Detection
          </h1>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg flex items-center mb-6">
            <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
            <div>
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <SessionInfo sessionId={sessionId} cameraAccess={cameraAccess} />
            <Instructions />
            <Controls
              isStreaming={isStreaming}
              onStartCamera={startCamera}
              onStopCamera={stopCamera}
              onStartLiveness={startLivenessTask}
              onResetTasks={resetTaskSession}
              taskStatus={taskStatus}
            />
            <OfflineIndicator offline={offline} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Camera className="w-6 h-6 mr-2 text-purple-400" />
                Live Camera Feed
              </h2>
              <VideoContainer 
                videoRef={videoRef} 
                canvasRef={canvasRef} 
                isStreaming={isStreaming}
                completedTasks={taskStatus?.completed_tasks || 0}
                totalTasks={taskStatus?.total_tasks || 0}
              />
              {!isStreaming && (
                <div className="text-center text-gray-400 mt-4">
                  <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Click &quot;Start Camera&quot; to begin detection</p>
                </div>
              )}
              {isStreaming && (
                <div className="text-center text-green-400 mt-4">
                  <div className="inline-flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                    Camera active - Processing frames
                  </div>
                </div>
              )}
            </div>

            {/* Status and Task Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatusPanel detectionResult={detectionResult} isStreaming={isStreaming} />
              <TaskPanel taskStatus={taskStatus} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-400 text-sm">
          Powered by AI-driven face recognition technology
        </footer>
      </div>
    </div>
  );
}
