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

  // Get head direction from detection result
  const headDirection = detectionResult?.head_pose?.direction || 'Looking Straight';
  
  // Get current task description
  const currentTaskDescription = taskStatus?.current_task?.description || 'Position your face within the circle to begin.';

  // Handle try again - reset session and restart camera
  const handleTryAgain = async () => {
    await resetTaskSession();
    // Small delay to ensure session is cleared
    setTimeout(() => {
      startCamera();
    }, 500);
  };

  // Handle stop camera button click
  const handleStopCamera = () => {
    stopCamera(false); // false = don't preserve task status
  };

  // Handle retake verification - refresh the page
  const handleRetakeVerification = () => {
    window.location.reload();
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#0B0F1A]">
      <div className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col w-full max-w-[960px] flex-1">

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center grow py-8 px-4 text-center">
        {/* Error Display */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg flex items-center mb-6 w-full max-w-md">
            <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
            <div>
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {/* Title - only show when not streaming */}
        {!isStreaming && (
          <>
            {/* <h1 className="text-[#E5E7EB] tracking-light text-[24px] sm:text-[32px] font-bold leading-tight px-4 text-center pb-3 pt-6">
              Current Head Direction: {headDirection}
            </h1> */}
            {/* <p className="text-[#E5E7EB]/70 text-base mb-8">
              {currentTaskDescription}
            </p> */}
          </>
        )}

        {/* Camera Feed with circular design - hide when result is available */}
        {!taskStatus?.result && (
          <div className="relative flex items-center justify-center w-full max-w-sm aspect-square my-6 mx-auto">
            <VideoContainer 
              videoRef={videoRef} 
              canvasRef={canvasRef} 
              isStreaming={isStreaming}
              headDirection={headDirection}
              completedTasks={taskStatus?.completed_tasks || 0}
              totalTasks={taskStatus?.total_tasks || 0}
            />
          </div>
        )}

        {/* Task Status with Timer - shown when task is active */}
        {taskStatus?.active && (
          <div className="w-full max-w-md mb-6 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[#E5E7EB] text-lg font-bold">
                Liveness Verification Tasks
              </p>
              <span className="text-[#ff6a00] font-bold text-xl">
                {Math.ceil(taskStatus.time_remaining || 0)}s
              </span>
            </div>
            <p className="text-[#E5E7EB]/70 text-sm mb-2">
              Task {(taskStatus.completed_tasks || 0) + 1}/{taskStatus.total_tasks || 0}
            </p>
            <p className="text-[#ff6a00] text-2xl font-bold mb-3">
              {taskStatus.current_task?.description || 'Preparing...'}
            </p>
          </div>
        )}

        {/* Verification Result - Show prominently when available */}
        {taskStatus?.result && (
          <div className={`w-full max-w-md mb-6 p-8 rounded-3xl border-2 ${
            taskStatus.result.final_result
              ? 'bg-linear-to-br from-green-900/80 to-green-800/60 border-green-500'
              : 'bg-linear-to-br from-red-900/80 to-red-800/60 border-red-500'
          } backdrop-blur-sm shadow-2xl`}
          style={{
            boxShadow: taskStatus.result.final_result
              ? '0 0 30px rgba(34, 197, 94, 0.4)'
              : '0 0 30px rgba(239, 68, 68, 0.4)'
          }}>
            {/* Main Result */}
            <div className="text-center mb-6">
              <div className={`text-6xl mb-4 ${
                taskStatus.result.final_result ? 'text-green-300' : 'text-red-300'
              }`}>
                {taskStatus.result.final_result ? '✓' : '✗'}
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {taskStatus.result.final_result ? 'VERIFICATION PASSED' : 'VERIFICATION FAILED'}
              </h2>
              <p className={`text-lg ${
                taskStatus.result.final_result ? 'text-green-200' : 'text-red-200'
              }`}>
                {taskStatus.result.final_result 
                  ? 'Live person detected successfully' 
                  : 'Verification requirements not met'}
              </p>
            </div>

            {/* Face Verification Results */}
            {taskStatus.faceVerification && taskStatus.result.final_result && (
              <div className="mb-6 p-6 rounded-2xl bg-blue-900/40 border border-blue-400/30">
                <h3 className="text-xl font-bold text-blue-200 mb-4 flex items-center gap-2">
                  <span>🔍</span>
                  Face Recognition Results
                </h3>
                <div className="space-y-3">
                  {/* Match Status */}
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 text-sm">Status:</span>
                    <span className={`font-bold px-3 py-1 rounded-lg ${
                      taskStatus.faceVerification.matchFound 
                        ? 'bg-blue-500/30 text-blue-200' 
                        : 'bg-purple-500/30 text-purple-200'
                    }`}>
                      {taskStatus.faceVerification.matchFound ? '✅ Match Found' : '🆕 New User'}
                    </span>
                  </div>

                  {/* User Name */}
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 text-sm">User:</span>
                    <span className="text-white font-bold">
                      {taskStatus.faceVerification.userName}
                    </span>
                  </div>

                  {/* Vector ID */}
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 text-sm">Vector ID:</span>
                    <span className="text-green-300 font-mono text-xs bg-black/30 px-2 py-1 rounded">
                      {taskStatus.faceVerification.vectorId}
                    </span>
                  </div>

                  {/* Confidence */}
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 text-sm">Confidence:</span>
                    <span className="text-green-300 font-bold">
                      {(taskStatus.faceVerification.confidence * 100).toFixed(1)}%
                    </span>
                  </div>

                  {/* Cloudinary Image */}
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <span className="text-white/80 text-sm block mb-2">Captured Image:</span>
                    <a 
                      href={taskStatus.faceVerification.cloudinaryUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors underline"
                    >
                      <span>🖼️ View Image on Cloudinary</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    {/* Preview thumbnail */}
                    <div className="mt-3">
                      <img 
                        src={taskStatus.faceVerification.cloudinaryUrl} 
                        alt="Captured face" 
                        className="w-full rounded-lg border-2 border-white/20 shadow-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Results */}
            <div className="space-y-4 bg-black/30 rounded-xl p-6">
              {/* Task Completion */}
              <div className="flex justify-between items-center">
                <span className="text-white/80 text-sm">Tasks Completed:</span>
                <span className="text-white font-bold">
                  {taskStatus.result.completed || 0}/{taskStatus.result.total || 0}
                </span>
              </div>

              {/* Success Rate */}
              {taskStatus.result.success_rate !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Success Rate:</span>
                  <span className={`font-bold ${
                    (taskStatus.result.success_rate || 0) >= 80 ? 'text-green-300' : 'text-orange-300'
                  }`}>
                    {taskStatus.result.success_rate?.toFixed(1)}%
                  </span>
                </div>
              )}

              {/* Duration */}
              {taskStatus.result.duration !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Duration:</span>
                  <span className="text-white font-bold">
                    {taskStatus.result.duration?.toFixed(1)}s
                  </span>
                </div>
              )}

              {/* Anti-Spoof Status */}
              {taskStatus.result.anti_spoof_passed !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Anti-Spoof Check:</span>
                  <span className={`font-bold ${
                    taskStatus.result.anti_spoof_passed ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {taskStatus.result.anti_spoof_passed ? 'PASSED ✓' : 'FAILED ✗'}
                  </span>
                </div>
              )}

              {/* Anti-Spoof Validation Details */}
              {taskStatus.result.anti_spoof_validation && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-white/80 text-xs mb-2">Anti-Spoof Details:</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-white/70">Real Predictions:</span>
                      <span className="text-white">
                        {taskStatus.result.anti_spoof_validation.real_predictions}/
                        {taskStatus.result.anti_spoof_validation.total_predictions}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Real Percentage:</span>
                      <span className={`font-semibold ${
                        taskStatus.result.anti_spoof_validation.real_percentage >= 60 
                          ? 'text-green-300' 
                          : 'text-red-300'
                      }`}>
                        {taskStatus.result.anti_spoof_validation.real_percentage?.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Avg Confidence:</span>
                      <span className="text-white">
                        {(taskStatus.result.anti_spoof_validation.average_confidence * 100)?.toFixed(1)}%
                      </span>
                    </div>
                    {taskStatus.result.anti_spoof_validation.reason && (
                      <p className="text-white/60 italic mt-2 text-xs">
                        {taskStatus.result.anti_spoof_validation.reason}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Task Checklist - Only show if tasks exist and no result yet */}
        {taskStatus?.tasks && taskStatus.tasks.length > 0 && !taskStatus.result && (
          <div className="w-full max-w-md mt-10 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <p className="text-[#E5E7EB] text-lg font-bold leading-normal mb-4">
              Please complete the following actions:
            </p>
            <div className="px-4">
              {taskStatus.tasks.map((task: string, index: number) => {
                const isCompleted = index < (taskStatus.completed_tasks || 0);
                return (
                  <label key={index} className="flex gap-x-3 py-3 flex-row items-center">
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      disabled
                      className={`h-5 w-5 rounded border-2 appearance-none focus:ring-0 focus:ring-offset-0 focus:outline-none transition-all duration-300 ${
                        isCompleted
                          ? 'bg-green-500 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                          : 'bg-transparent border-[#6b472e]'
                      }`}
                      style={{
                        backgroundImage: isCompleted
                          ? "url('data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27white%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath d=%27M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z%27/%3e%3c/svg%3e')"
                          : 'none',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                      }}
                    />
                    <p className="text-white text-base font-normal leading-normal">
                      {task}
                    </p>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex px-4 py-8 justify-center">
          {taskStatus?.result ? (
            // Show buttons when result is available
            <div className="flex gap-4">
              <button
                onClick={handleRetakeVerification}
                className="flex min-w-[84px] max-w-60 w-48 cursor-pointer items-center justify-center rounded-2xl h-14 px-5 bg-[#ff6a00] text-white text-lg font-bold tracking-[0.015em] hover:bg-[#ff7a10] transition-colors"
                style={{
                  boxShadow: '0 0 15px rgba(255,106,0,0.5)'
                }}
              >
                <span className="truncate">Retake Verification</span>
              </button>
              {taskStatus.result.final_result && (
                <Link 
                  href="/feed"
                  className="flex min-w-[84px] max-w-60 w-48 cursor-pointer items-center justify-center rounded-2xl h-14 px-5 bg-green-600 text-white text-lg font-bold tracking-[0.015em] hover:bg-green-700 transition-colors"
                >
                  <span className="truncate">Continue</span>
                </Link>
              )}
            </div>
          ) : !isStreaming ? (
            <button
              onClick={startCamera}
              disabled={cameraAccess === 'denied'}
              className="flex min-w-[84px] max-w-[480px] w-64 cursor-pointer items-center justify-center rounded-2xl h-14 px-5 bg-[#ff6a00] text-white text-lg font-bold tracking-[0.015em] hover:bg-[#ff7a10] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                boxShadow: '0 0 15px rgba(255,106,0,0.5)'
              }}
            >
              <span className="truncate">Start Camera</span>
            </button>
          ) : !taskStatus?.active ? (
            <button
              onClick={startLivenessTask}
              className="flex min-w-[84px] max-w-[480px] w-64 cursor-pointer items-center justify-center rounded-2xl h-14 px-5 bg-[#ff6a00] text-white text-lg font-bold tracking-[0.015em] hover:bg-[#ff7a10] transition-colors"
              style={{
                boxShadow: '0 0 15px rgba(255,106,0,0.5)'
              }}
            >
              <span className="truncate">Start Verification</span>
            </button>
          ) : (
            <button
              onClick={handleStopCamera}
              className="flex min-w-[84px] max-w-[480px] w-64 cursor-pointer items-center justify-center rounded-2xl h-14 px-5 bg-red-600 text-white text-lg font-bold tracking-[0.015em] hover:bg-red-700 transition-colors"
            >
              <span className="truncate">Stop Camera</span>
            </button>
          )}
        </div>
      </main>
        </div>
      </div>
    </div>
  );
}
