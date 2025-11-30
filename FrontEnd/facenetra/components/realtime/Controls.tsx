'use client';

import { Button } from './ui/button';
import { Play, Square, RotateCcw, Zap, Loader2 } from 'lucide-react';

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

interface ControlsProps {
  isStreaming: boolean;
  onStartCamera: () => void;
  onStopCamera: () => void;
  onStartLiveness: () => void;
  onResetTasks: () => void;
  taskStatus?: TaskStatus | null;
}

export const Controls = ({
  isStreaming,
  onStartCamera,
  onStopCamera,
  onStartLiveness,
  onResetTasks,
  taskStatus,
}: ControlsProps) => (
  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
    <h3 className="text-lg font-semibold text-white mb-4">Controls</h3>
    <div className="grid grid-cols-2 gap-4">
      <Button
        onClick={onStartCamera}
        disabled={isStreaming}
        className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center disabled:opacity-50"
      >
        {isStreaming ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Play className="w-4 h-4 mr-2" />
        )}
        {isStreaming ? 'Streaming...' : 'Start Camera'}
      </Button>
      <Button
        onClick={onStartLiveness}
        disabled={!isStreaming || taskStatus?.active}
        className="bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center disabled:opacity-50"
      >
        <Zap className="w-4 h-4 mr-2" />
        {taskStatus?.active ? 'Task Active' : 'Start Liveness'}
      </Button>
      <Button
        onClick={onResetTasks}
        disabled={!isStreaming}
        className="bg-gray-600 hover:bg-gray-700 text-white flex items-center justify-center disabled:opacity-50"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset Tasks
      </Button>
      <Button
        onClick={onStopCamera}
        disabled={!isStreaming}
        className="bg-red-600 hover:bg-red-700 text-white flex items-center justify-center disabled:opacity-50"
      >
        <Square className="w-4 h-4 mr-2" />
        Stop Camera
      </Button>
    </div>
    {taskStatus?.active && (
      <div className="mt-4 p-3 bg-orange-900/50 border border-orange-500 text-orange-200 rounded-lg">
        <p className="text-sm font-medium">Liveness task in progress...</p>
        <p className="text-xs">Follow the instructions in the task panel</p>
      </div>
    )}
  </div>
);
