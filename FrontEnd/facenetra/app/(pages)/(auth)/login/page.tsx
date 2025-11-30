'use client';

import Link from 'next/link';
import { useRealtimeAPI } from '@/lib/hooks/useRealtimeAPI';
import { VideoContainer } from '@/components/realtime/VideoContainer';
import { Camera, ArrowLeft, AlertCircle, Compass, Clock } from 'lucide-react';

export default function LoginPage() {
  const {
    isStreaming,
    cameraAccess,
    detectionResult,
    taskStatus,
    error,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    startLivenessTask,
    resetTaskSession,
  } = useRealtimeAPI();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center text-white hover:text-purple-300 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Camera className="w-8 h-8 mr-3 text-purple-400" />
            Face Verification Login
          </h1>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg flex items-center mb-6">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <div>
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera Feed - 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Camera className="w-6 h-6 mr-2 text-purple-400" />
                Camera
              </h2>
              <VideoContainer videoRef={videoRef} canvasRef={canvasRef} isStreaming={isStreaming} />
              {!isStreaming && (
                <div className="text-center text-gray-400 mt-4">
                  <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Click &quot;Start Camera&quot; to begin verification</p>
                </div>
              )}
              {isStreaming && (
                <div className="text-center text-green-400 mt-4">
                  <div className="inline-flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                    Camera active
                  </div>
                </div>
              )}

              {/* Camera Controls */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                {!isStreaming ? (
                  <button
                    onClick={startCamera}
                    disabled={cameraAccess === 'denied'}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Camera
                  </button>
                ) : (
                  <button
                    onClick={stopCamera}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Stop Camera
                  </button>
                )}
                
                {isStreaming && !taskStatus?.active && (
                  <button
                    onClick={startLivenessTask}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Start Verification
                  </button>
                )}
                
                {taskStatus?.result && (
                  <button
                    onClick={resetTaskSession}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Info - 1 column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Head Direction */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Compass className="w-5 h-5 mr-2 text-blue-400" />
                Head Direction
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {detectionResult?.head_pose?.direction || 'Forward'}
                </div>
                <div className="text-sm text-gray-400">
                  Keep your head {taskStatus?.current_task?.description?.toLowerCase() || 'centered'}
                </div>
              </div>
            </div>

            {/* Liveness Tasks */}
            {taskStatus && (
              <div className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 ${
                taskStatus.active 
                  ? 'border-orange-500' 
                  : taskStatus.result?.final_result 
                  ? 'border-green-500' 
                  : 'border-red-500'
              }`}>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-orange-400" />
                  Liveness Verification Tasks
                </h3>
                
                {/* Task Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 text-sm">
                      {taskStatus.active 
                        ? `Task ${(taskStatus.completed_tasks || 0) + 1}/${taskStatus.total_tasks || 0}`
                        : 'Complete'
                      }
                    </span>
                    <span className="font-bold text-orange-400 text-lg">
                      {taskStatus.active 
                        ? `${Math.ceil(taskStatus.time_remaining || 0)}s`
                        : `${taskStatus.result?.duration?.toFixed(1) || '0.0'}s`
                      }
                    </span>
                  </div>
                  
                  {/* Current Task Display */}
                  {taskStatus.active && (
                    <div className="text-2xl font-bold text-center text-blue-400 my-4 py-3 bg-blue-900/30 rounded-lg transition-all duration-75">
                      {taskStatus.current_task?.description || 'Preparing...'}
                    </div>
                  )}
                  
                  {/* Task List */}
                  <div className="space-y-2">
                    {taskStatus.tasks?.map((task: string, index: number) => (
                      <div
                        key={index}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-75 ${
                          index < (taskStatus.completed_tasks || 0)
                            ? 'bg-green-500 text-white'
                            : index === (taskStatus.completed_tasks || 0) && taskStatus.active
                            ? 'bg-orange-500 text-white animate-pulse'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {task}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Final Result */}
                {taskStatus.result && (
                  <div className={`mt-4 text-center p-4 rounded-lg font-bold text-lg ${
                    taskStatus.result.final_result 
                      ? 'bg-green-600 text-white' 
                      : 'bg-red-600 text-white'
                  }`}>
                    {taskStatus.result.final_result ? '✓ VERIFIED' : '✗ VERIFICATION FAILED'}
                  </div>
                )}
              </div>
            )}

            {/* Instructions */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-3">Instructions</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Start the camera</li>
                <li>• Position your face in the frame</li>
                <li>• Click &quot;Start Verification&quot;</li>
                <li>• Follow the on-screen tasks</li>
                <li>• Complete all tasks within time limit</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-400 text-sm">
          Secured by AI-powered face verification
        </footer>
      </div>
    </div>
  );
}
