import React from 'react';
import { useFlowState } from '../providers/FlowStateProvider';

export const SyncStatusBar: React.FC = () => {
  const { syncStatus, triggerSync } = useFlowState();

  if (!syncStatus) return null;

  const lastSyncTime = syncStatus.lastSyncTime ? new Date(syncStatus.lastSyncTime).toLocaleString() : 'Never';
  const isRecent = syncStatus.lastSyncTime && (Date.now() - new Date(syncStatus.lastSyncTime).getTime()) < 5 * 60 * 1000; // 5 minutes

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${isRecent ? 'bg-green-500' : 'bg-gray-400'}`}></div>
        <span className="text-sm text-gray-600">
          Last synced: <span className="font-medium text-gray-900">{lastSyncTime}</span>
        </span>
        {syncStatus.totalRecords && (
          <span className="text-sm text-gray-500 ml-2">
            ({syncStatus.totalRecords} records)
          </span>
        )}
      </div>
      <button 
        onClick={triggerSync}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-colors duration-200 flex items-center gap-1"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4V2L9 5L12 8V6C15.31 6 18 8.69 18 12C18 13.01 17.75 13.97 17.3 14.8L18.76 16.26C19.54 15.03 20 13.57 20 12C20 7.58 16.42 4 12 4Z" fill="currentColor"/>
          <path d="M12 18C8.69 18 6 15.31 6 12C6 10.99 6.25 10.03 6.7 9.2L5.24 7.74C4.46 8.97 4 10.43 4 12C4 16.42 7.58 20 12 20V22L15 19L12 16V18Z" fill="currentColor"/>
        </svg>
        Refresh
      </button>
    </div>
  );
};