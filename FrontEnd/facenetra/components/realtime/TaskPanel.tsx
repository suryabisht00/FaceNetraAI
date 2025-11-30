'use client';

import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

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

interface TaskPanelProps {
  taskStatus: TaskStatus | null;
}

export const TaskPanel = ({ taskStatus }: TaskPanelProps) => {
  if (!taskStatus) return null;

  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 ${taskStatus.active ? 'border-orange-500 animate-pulse' : taskStatus.result?.final_result ? 'border-green-500' : 'border-red-500'}`}>
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Clock className="w-6 h-6 mr-2 text-orange-400" />
        Liveness Verification Tasks
      </h3>
      <div className="flex justify-between mb-3">
        <span className="text-gray-300">{taskStatus.active ? `Task ${(taskStatus.completed_tasks || 0) + 1}/${taskStatus.total_tasks || 0}` : 'Session Complete'}</span>
        <span className="font-bold text-orange-400">{taskStatus.active ? `${Math.ceil(taskStatus.time_remaining || 0)}s` : `${taskStatus.result?.duration?.toFixed(1) || '0.0'}s`}</span>
      </div>
      <div className="text-xl font-bold text-center mb-3 text-blue-400">
        {taskStatus.active ? taskStatus.current_task?.description || 'Preparing...' : taskStatus.result?.final_result ? 'PASSED!' : 'FAILED!'}
      </div>
      <div className="flex gap-2 flex-wrap mb-3">
        {taskStatus.tasks?.map((task: string, index: number) => (
          <div
            key={index}
            className={`px-3 py-1 rounded-full text-xs ${index < (taskStatus.completed_tasks || 0) ? 'bg-green-500 text-white' : index === (taskStatus.completed_tasks || 0) ? 'bg-orange-500 text-white animate-pulse' : 'bg-gray-600 text-gray-300'}`}
          >
            {task}
          </div>
        ))}
      </div>
      {taskStatus.result && (
        <>
          <div className="mb-3 space-y-2">
            <p className="text-gray-300"><strong>Tasks Completed:</strong> {taskStatus.result.completed || 0}/{taskStatus.result.total || 0}</p>
            <p className="text-gray-300"><strong>Success Rate:</strong> {((taskStatus.result.success_rate || 0) * 100).toFixed(1)}%</p>
            <p className="text-gray-300"><strong>Tasks Status:</strong> {taskStatus.result.passed ? 'PASSED' : 'FAILED'}</p>
          </div>
          {taskStatus.result.anti_spoof_validation && (
            <div className={`p-3 rounded border-l-4 ${taskStatus.result.anti_spoof_passed ? 'bg-green-900/50 border-green-500' : 'bg-red-900/50 border-red-500'}`}>
              <h4 className="font-bold text-gray-200 flex items-center">
                {taskStatus.result.anti_spoof_passed ? <CheckCircle className="w-4 h-4 mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                Anti-Spoof Validation
              </h4>
              <p className="text-gray-300">Status: {taskStatus.result.anti_spoof_passed ? 'PASSED' : 'FAILED'}</p>
              <p className="text-gray-300">Real Predictions: {taskStatus.result.anti_spoof_validation.real_predictions}/{taskStatus.result.anti_spoof_validation.total_predictions}</p>
              <p className="text-gray-300">Avg Confidence: {taskStatus.result.anti_spoof_validation.average_confidence.toFixed(2)}</p>
              <p className="text-gray-300 text-sm">Reason: {taskStatus.result.anti_spoof_validation.reason}</p>
            </div>
          )}
          <div className={`text-center p-3 rounded font-bold ${taskStatus.result.final_result ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
            FINAL RESULT: {taskStatus.result.final_result ? 'LIVE PERSON VERIFIED' : 'VERIFICATION FAILED'}
          </div>
        </>
      )}
      {taskStatus.active && (taskStatus.time_remaining || 0) <= 5 && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-lg flex items-center mt-3">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Time running out! Complete the task quickly.
        </div>
      )}
    </div>
  );
};
