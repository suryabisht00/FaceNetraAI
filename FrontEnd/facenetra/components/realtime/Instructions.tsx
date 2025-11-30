'use client';

import { HelpCircle, Camera, Eye, AlertTriangle } from 'lucide-react';

export const Instructions = () => (
  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
      <HelpCircle className="w-5 h-5 mr-2 text-blue-400" />
      Instructions
    </h3>
    <ul className="list-disc list-inside space-y-2 text-gray-300">
      <li className="flex items-start">
        <Camera className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
        Click &quot;Start Camera&quot; to begin real-time detection
      </li>
      <li className="flex items-start">
        <Eye className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
        Grant camera permissions when prompted
      </li>
      <li>Position your face clearly in front of the camera</li>
      <li>Ensure only ONE face is visible (multiple faces will terminate session)</li>
      <li>The system will detect if the face is real or fake</li>
      <li>Green indicators show real face, red shows fake face</li>
      <li>Click &quot;Start Liveness&quot; to begin verification tasks</li>
      <li>Follow the on-screen instructions for liveness verification</li>
      <li className="flex items-start">
        <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
        Click &quot;Stop Camera&quot; when finished
      </li>
    </ul>
  </div>
);
