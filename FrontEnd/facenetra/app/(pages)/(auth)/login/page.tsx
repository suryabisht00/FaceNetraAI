'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRealtimeAPI } from '@/lib/hooks/useRealtimeAPI';
import { VideoContainer } from '@/components/realtime/VideoContainer';
import { Camera, ArrowLeft, AlertCircle, Compass, Clock } from 'lucide-react';
import Toast from '@/components/ui/Toast';

export default function LoginPage() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  
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
  } = useRealtimeAPI({
    onLoginSuccess: (message) => {
      setToastMessage(message);
      setToastType('success');
      setShowToast(true);
    },
    onLoginError: (message) => {
      setToastMessage(message);
      setToastType('error');
      setShowToast(true);
    },
  });

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
      {/* Toast Notification */}
      {showToast && (
        <Toast 
          message={toastMessage} 
          type={toastType}
          onClose={() => setShowToast(false)} 
        />
      )}
      
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
          <>
            {(taskStatus.faceVerification || (taskStatus.result.final_result && taskStatus.result.anti_spoof_passed)) ? (
              // Show processing loader when face verification data exists OR when both checks passed
              <div className="w-full max-w-md mb-6 p-8 rounded-3xl border-2 bg-gradient-to-br from-blue-900/80 to-purple-800/60 border-blue-500 backdrop-blur-sm shadow-2xl"
                style={{
                  boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)'
                }}
              >
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-6"></div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Processing Login...
                  </h2>
                  <p className="text-blue-200">
                    Please wait while we authenticate you
                  </p>
                </div>
              </div>
            ) : (
              // Show error only when verification actually failed (either anti-spoof or final_result is false)
              <div className="w-full max-w-md mb-6 p-8 rounded-3xl border-2 bg-gradient-to-br from-red-900/80 to-red-800/60 border-red-500 backdrop-blur-sm shadow-2xl"
                style={{
                  boxShadow: '0 0 30px rgba(239, 68, 68, 0.4)'
                }}
              >
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4 text-red-300">✗</div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    VERIFICATION FAILED
                  </h2>
                  <p className="text-lg text-red-200">
                    {!taskStatus.result.anti_spoof_passed 
                      ? 'Anti-spoof check failed. Please use a real person.' 
                      : !taskStatus.result.final_result
                      ? 'Liveness verification failed. Please complete all tasks.'
                      : 'Verification requirements not met. Please try again.'}
                  </p>
                </div>
                
                <div className="space-y-4 bg-black/30 rounded-xl p-6">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 text-sm">Tasks Completed:</span>
                    <span className="text-white font-bold">
                      {taskStatus.result.completed || 0}/{taskStatus.result.total || 0}
                    </span>
                  </div>
                  
                  {taskStatus.result.success_rate !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-white/80 text-sm">Success Rate:</span>
                      <span className="font-bold text-orange-300">
                        {taskStatus.result.success_rate?.toFixed(1)}%
                      </span>
                    </div>
                  )}
                  
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
                </div>
              </div>
            )}
          </>
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
            // Show "Try Again" button only when verification actually failed (not just waiting for face verification)
            (!taskStatus.faceVerification && !(taskStatus.result.final_result && taskStatus.result.anti_spoof_passed)) && (
              <button
                onClick={handleRetakeVerification}
                className="flex min-w-[84px] max-w-60 w-48 cursor-pointer items-center justify-center rounded-2xl h-14 px-5 bg-[#ff6a00] text-white text-lg font-bold tracking-[0.015em] hover:bg-[#ff7a10] transition-colors"
                style={{
                  boxShadow: '0 0 15px rgba(255,106,0,0.5)'
                }}
              >
                <span className="truncate">Try Again</span>
              </button>
            )
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
