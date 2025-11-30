'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceInFrame, setFaceInFrame] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'detecting' | 'success' | 'failed'>('idle');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup camera on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        setVerificationStatus('detecting');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please grant camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setFaceDetected(false);
    setFaceInFrame(false);
    setVerificationStatus('idle');
  };

  const simulateFaceDetection = () => {
    // Simulate face detection (replace with actual ML model later)
    const detected = Math.random() > 0.3;
    const inFrame = Math.random() > 0.2;
    
    setFaceDetected(detected);
    setFaceInFrame(detected && inFrame);
    
    if (detected && inFrame) {
      // Simulate successful verification after 2 seconds
      setTimeout(() => {
        setVerificationStatus('success');
        setTimeout(() => {
          // Redirect to feed or dashboard
          window.location.href = '/feed';
        }, 1500);
      }, 2000);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCameraActive && verificationStatus === 'detecting') {
      interval = setInterval(simulateFaceDetection, 500);
    }
    return () => clearInterval(interval);
  }, [isCameraActive, verificationStatus]);

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center px-4 py-8 pt-24 md:pt-32">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Face Login</h1>
          <p className="text-gray-400">Verify your identity with liveness detection</p>
        </div>

        {/* Camera Container */}
        <div className="backdrop-blur-md bg-[#0B0F1A]/80 border border-primary/20 rounded-2xl p-6 mb-6">
          <div className="relative aspect-[4/3] bg-black rounded-xl overflow-hidden mb-4">
            {isCameraActive ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                />
                
                {/* Face Detection Circle Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className={`w-64 h-64 rounded-full border-4 transition-all duration-300 ${
                    faceInFrame 
                      ? 'border-green-500 shadow-lg shadow-green-500/50' 
                      : faceDetected 
                      ? 'border-yellow-500 shadow-lg shadow-yellow-500/50' 
                      : 'border-primary/50 border-dashed'
                  }`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {!faceDetected && (
                        <p className="text-white text-sm text-center px-4">
                          Position your face in the circle
                        </p>
                      )}
                      {faceDetected && !faceInFrame && (
                        <p className="text-yellow-500 text-sm text-center px-4">
                          Move closer to the frame
                        </p>
                      )}
                      {faceInFrame && verificationStatus === 'detecting' && (
                        <p className="text-green-500 text-sm text-center px-4">
                          Verifying...
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Indicators */}
                <div className="absolute top-4 left-4 right-4 flex justify-between">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    faceDetected 
                      ? 'bg-green-500/20 text-green-500 border border-green-500/50' 
                      : 'bg-red-500/20 text-red-500 border border-red-500/50'
                  }`}>
                    {faceDetected ? 'Face Detected' : 'No Face'}
                  </div>
                  {verificationStatus === 'success' && (
                    <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-500 border border-green-500/50">
                      ✓ Verified
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <svg className="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">Camera is off</p>
              </div>
            )}
          </div>

          {/* Camera Controls */}
          <div className="flex gap-3">
            {!isCameraActive ? (
              <button
                onClick={startCamera}
                className="flex-1 py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Start Camera
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Stop Camera
              </button>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="backdrop-blur-md bg-[#0B0F1A]/80 border border-primary/20 rounded-2xl p-4 mb-6">
          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Instructions
          </h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Position your face within the circular frame</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Ensure good lighting on your face</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Keep your face centered and still</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Verification will start automatically</span>
            </li>
          </ul>
        </div>

        {/* Alternative Login */}
        <div className="text-center">
          <Link 
            href="/" 
            className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
