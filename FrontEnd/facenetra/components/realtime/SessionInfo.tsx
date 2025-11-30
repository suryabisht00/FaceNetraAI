'use client';

import { Info, Clock } from 'lucide-react';

interface SessionInfoProps {
  sessionId: string | null;
  cameraAccess: string;
}

export const SessionInfo = ({ sessionId, cameraAccess }: SessionInfoProps) => (
  sessionId ? (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Info className="w-5 h-5 mr-2 text-blue-400" />
        Session Information
      </h3>
      <p className="text-gray-300"><strong>Session ID:</strong> {sessionId}</p>
      <p className="text-gray-300"><strong>Status:</strong> Active</p>
      <p className="text-gray-300"><strong>Camera Access:</strong> {cameraAccess}</p>
      <div className="flex items-center text-gray-400 text-sm mt-2">
        <Clock className="w-4 h-4 mr-1" />
        Real-time processing active
      </div>
    </div>
  ) : null
);
