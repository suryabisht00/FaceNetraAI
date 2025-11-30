'use client';

import { WifiOff } from 'lucide-react';

interface OfflineIndicatorProps {
  offline: boolean;
}

export const OfflineIndicator = ({ offline }: OfflineIndicatorProps) => (
  offline ? (
    <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg flex items-center">
      <WifiOff className="w-5 h-5 mr-2" />
      <strong>Connection Lost:</strong> Unable to communicate with server. Attempting to reconnect...
    </div>
  ) : null
);
