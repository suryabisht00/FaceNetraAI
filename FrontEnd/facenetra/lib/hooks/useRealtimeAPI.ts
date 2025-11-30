import { useState, useRef, useCallback, useEffect } from 'react';

const API_BASE_URL = '/api/proxy'; // Use Next.js API proxy
const API_KEY = 'dz_live_2024_secure_api_key_xyz789';

interface DetectionResult {
  status: string;
  confidence: number;
  is_real: boolean;
  blinks?: number;
  head_pose?: { direction: string; pitch: number; yaw: number; roll: number };
  eyes?: { left_center: [number, number]; right_center: [number, number]; blinking: boolean };
  face_detected?: boolean;
  anti_spoof_summary?: {
    real_count: number;
    fake_count: number;
    real_percentage: number;
    fake_percentage: number;
    total_processed: number;
    status: string;
  };
  task_session?: any;
  session_id?: string;
}

interface TaskStatus {
  active?: boolean;
  completed_tasks?: number;
  total_tasks?: number;
  time_remaining?: number;
  current_task?: { description: string; task: string; index: number; total: number };
  tasks?: string[];
  result?: {
    passed?: boolean;
    completed?: number;
    total?: number;
    success_rate?: number;
    duration?: number;
    anti_spoof_passed?: boolean;
    final_result?: boolean;
    anti_spoof_validation?: {
      real_predictions: number;
      total_predictions: number;
      real_percentage: number;
      average_confidence: number;
      reason: string;
      is_valid: boolean;
    };
  };
  [key: string]: unknown;
}

export const useRealtimeAPI = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [cameraAccess, setCameraAccess] = useState('Not granted');
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [taskStatus, setTaskStatus] = useState<TaskStatus | null>(null);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const taskIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processingFrameRef = useRef(false);
  const lastFrameTimeRef = useRef(0);

  const createSession = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create' }),
      });
      const data = await response.json();
      if (data.success) {
        setSessionId(data.session_id);
        return true;
      } else {
        setError(data.message);
        return false;
      }
    } catch (err: any) {
      setError('Failed to create session: ' + err.message);
      return false;
    }
  }, []);

  const endSession = useCallback(async () => {
    if (sessionId) {
      try {
        await fetch(`${API_BASE_URL}/session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'end', session_id: sessionId }),
        });
      } catch (err) {
        console.error('Error ending session:', err);
      }
      setSessionId(null);
    }
  }, [sessionId]);

  const getUserMedia = useCallback(async (): Promise<boolean> => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera access not supported');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise<void>((resolve, reject) => {
          videoRef.current!.onloadedmetadata = () => {
            if (canvasRef.current) {
              canvasRef.current.width = videoRef.current!.videoWidth;
              canvasRef.current.height = videoRef.current!.videoHeight;
            }
            setCameraAccess('Granted');
            resolve();
          };
          videoRef.current!.onerror = reject;
          setTimeout(() => reject(new Error('Camera access timeout')), 10000);
        });
      }
      return true;
    } catch (err: any) {
      setCameraAccess('Denied');
      let errorMessage = 'Camera access denied. ';
      if (err.name === 'NotAllowedError') {
        errorMessage += 'Please grant camera permissions and try again.';
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.';
      } else if (err.name === 'NotReadableError') {
        errorMessage += 'Camera is being used by another application.';
      } else {
        errorMessage += err.message;
      }
      setError(errorMessage);
      return false;
    }
  }, []);

  const stopCamera = useCallback(async () => {
    setIsStreaming(false);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (taskIntervalRef.current) {
      clearInterval(taskIntervalRef.current);
      taskIntervalRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraAccess('Not granted');
    await endSession();
    setDetectionResult(null);
    setTaskStatus(null);
    setOffline(false);
    setError(null);
  }, [endSession]);

  const captureAndProcessFrame = useCallback(async () => {
    if (!sessionId || !videoRef.current || !canvasRef.current) return;
    if (videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) return;
    if (processingFrameRef.current) return;

    const now = Date.now();
    const timeSinceLastFrame = now - lastFrameTimeRef.current;
    
    // Throttle to ~20 FPS (50ms between frames) for faster UI updates
    if (timeSinceLastFrame < 50) return;

    try {
      processingFrameRef.current = true;
      lastFrameTimeRef.current = now;
      
      const ctx = canvasRef.current.getContext('2d')!;
      ctx.drawImage(videoRef.current, 0, 0);
      const frameData = canvasRef.current.toDataURL('image/jpeg', 0.6);

      const response = await fetch(`${API_BASE_URL}/process_frame`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, frame: frameData }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();

      if (result.error) {
        if (result.error.includes('Invalid session_id')) {
          await stopCamera();
          setError('Session expired. Restart camera.');
        } else {
          setError(result.error);
        }
      } else {
        setDetectionResult(result);
        setOffline(false);
        setError(null);
      }
    } catch (err) {
      console.error('Frame processing error:', err);
      setOffline(true);
    } finally {
      processingFrameRef.current = false;
    }
  }, [sessionId, stopCamera]);

  // Continuous frame processing loop using requestAnimationFrame
  const frameLoop = useCallback(() => {
    captureAndProcessFrame();
    if (isStreaming) {
      animationFrameRef.current = requestAnimationFrame(frameLoop);
    }
  }, [isStreaming, captureAndProcessFrame]);

  // Start the frame loop when streaming begins
  useEffect(() => {
    if (isStreaming) {
      lastFrameTimeRef.current = Date.now();
      animationFrameRef.current = requestAnimationFrame(frameLoop);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isStreaming, frameLoop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (taskIntervalRef.current) {
        clearInterval(taskIntervalRef.current);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = useCallback(async () => {
    if (!(await createSession())) return;
    if (!(await getUserMedia())) {
      await endSession();
      return;
    }
    setIsStreaming(true);
  }, [createSession, getUserMedia, endSession]);

  const updateTaskStatus = useCallback(async () => {
    if (!sessionId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/liveness/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status' }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setTaskStatus(data.session_status || data);
      setError(null);
      
      // Automatically stop camera when task session completes
      if (data.session_status && !data.session_status.active && data.session_status.result) {
        console.log('Task session completed, stopping camera...');
        await stopCamera();
      }
      
      // If task is no longer active, stop polling
      if (data.session_status && !data.session_status.active) {
        if (taskIntervalRef.current) {
          clearInterval(taskIntervalRef.current);
          taskIntervalRef.current = null;
        }
      }
    } catch (err: any) {
      console.error('Error updating task status:', err);
      setError('Failed to update task status: ' + err.message);
      // Optionally stop polling on persistent errors
      if (taskIntervalRef.current) {
        clearInterval(taskIntervalRef.current);
        taskIntervalRef.current = null;
      }
    }
  }, [sessionId, stopCamera]);

  const startLivenessTask = useCallback(async () => {
    if (!sessionId) {
      setError('No active session. Start camera first.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/liveness/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' }),
      });
      const data = await response.json();
      if (data.success) {
        setTaskStatus(data.session_status);
        taskIntervalRef.current = setInterval(updateTaskStatus, 100);
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError('Error starting liveness task: ' + err.message);
    }
  }, [sessionId, updateTaskStatus]);

  const resetTaskSession = useCallback(async () => {
    if (!sessionId) {
      setError('No active session.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/liveness/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
      const data = await response.json();
      if (data.success) {
        setTaskStatus(null);
        if (taskIntervalRef.current) {
          clearInterval(taskIntervalRef.current);
          taskIntervalRef.current = null;
        }
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError('Error resetting task session: ' + err.message);
    }
  }, [sessionId]);

  return {
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
  };
};
