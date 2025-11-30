'use client';

import { CheckCircle, XCircle, Eye, Compass, EyeOff, Eye as EyeIcon, Activity } from 'lucide-react';

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
  task_session?: Record<string, unknown>;
  session_id?: string;
}

interface StatusPanelProps {
  detectionResult: DetectionResult | null;
  isStreaming?: boolean;
}

export const StatusPanel = ({ detectionResult, isStreaming = false }: StatusPanelProps) => {
  const getStatusColor = () => {
    if (!detectionResult || !isStreaming) return 'border-gray-500';
    return detectionResult.is_real && detectionResult.confidence > 0.5
      ? 'border-green-500'
      : 'border-red-500';
  };

  const getConfidenceWidth = () => {
    if (!detectionResult) return '0%';
    return `${(detectionResult.confidence * 100).toFixed(1)}%`;
  };

  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 ${getStatusColor()}`}>
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Activity className="w-6 h-6 mr-2 text-blue-400" />
        Detection Status
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
          <span className="text-gray-300 flex items-center">
            <Eye className="w-4 h-4 mr-2" />
            Status:
          </span>
          <span className="text-white font-medium">
            {isStreaming ? (detectionResult?.status || 'Detecting...') : 'No detection'}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
          <span className="text-gray-300">Confidence:</span>
          <span className="text-white font-medium font-mono">
            {detectionResult?.confidence?.toFixed(2) || '0.00'}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
          <span className="text-gray-300">Result:</span>
          <span className={`font-medium flex items-center ${
            detectionResult?.is_real ? 'text-green-400' : 'text-red-400'
          }`}>
            {detectionResult?.is_real ? (
              <CheckCircle className="w-4 h-4 mr-1" />
            ) : (
              <XCircle className="w-4 h-4 mr-1" />
            )}
            {isStreaming 
              ? (detectionResult ? (detectionResult.is_real ? 'REAL FACE' : 'FAKE FACE') : '-')
              : '-'
            }
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
          <span className="text-gray-300">Blinks:</span>
          <span className="text-white font-medium">{detectionResult?.blinks || 0}</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
          <span className="text-gray-300 flex items-center">
            <Compass className="w-4 h-4 mr-2" />
            Head Direction:
          </span>
          <span className="text-white font-medium">
            {detectionResult?.head_pose?.direction || 'Forward'}
          </span>
        </div>
        
        {detectionResult?.eyes && (
          <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
            <span className="text-gray-300 flex items-center">
              {detectionResult.eyes.blinking ? (
                <EyeIcon className="w-4 h-4 mr-2 text-blue-400" />
              ) : (
                <EyeOff className="w-4 h-4 mr-2 text-gray-400" />
              )}
              Eyes:
            </span>
            <span className="text-white font-medium">
              {detectionResult.eyes.blinking ? 'Closed' : 'Open'}
            </span>
          </div>
        )}
        
        {detectionResult?.face_detected !== undefined && (
          <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
            <span className="text-gray-300">Face Detected:</span>
            <span className={`font-medium ${
              detectionResult.face_detected ? 'text-green-400' : 'text-red-400'
            }`}>
              {detectionResult.face_detected ? 'Yes' : 'No'}
            </span>
          </div>
        )}
      </div>
      
      {/* Confidence Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-300 mb-1">
          <span>Confidence Level</span>
          <span>{getConfidenceWidth()}</span>
        </div>
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ${
              detectionResult?.is_real ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: getConfidenceWidth() }}
          />
        </div>
      </div>
      
      {/* Anti-Spoof Summary */}
      {detectionResult?.anti_spoof_summary && detectionResult.anti_spoof_summary.total_processed > 0 && (
        <div className={`p-4 rounded-lg mt-4 border border-purple-500 ${
          detectionResult.anti_spoof_summary.status === 'Real'
            ? 'bg-green-900/30 border-green-500'
            : 'bg-red-900/30 border-red-500'
        }`}>
          <h4 className="font-bold text-purple-300 mb-2 flex items-center">
            {detectionResult.anti_spoof_summary.status === 'Real' ? (
              <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
            ) : (
              <XCircle className="w-4 h-4 mr-2 text-red-400" />
            )}
            Anti-Spoof Summary
          </h4>
          <div className="text-sm text-gray-300 space-y-1">
            <p>Real: {detectionResult.anti_spoof_summary.real_count} ({detectionResult.anti_spoof_summary.real_percentage.toFixed(1)}%)</p>
            <p>Fake: {detectionResult.anti_spoof_summary.fake_count} ({detectionResult.anti_spoof_summary.fake_percentage.toFixed(1)}%)</p>
            <p>Total: {detectionResult.anti_spoof_summary.total_processed}</p>
            <p className={`font-semibold ${
              detectionResult.anti_spoof_summary.status === 'Real' ? 'text-green-400' : 'text-red-400'
            }`}>
              Status: {detectionResult.anti_spoof_summary.status}
            </p>
          </div>
        </div>
      )}
      
      {/* No Data Message */}
      {!isStreaming && (
        <div className="text-center text-gray-400 p-4 mt-4">
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Start camera to see detection data</p>
        </div>
      )}
    </div>
  );
};
