import React, { useState } from 'react';
import { useTimelineState } from '../providers/TimelineStateProvider';

export const SyncStatusBar: React.FC = () => {
  const { syncStatus, triggerSync, lastFetch } = useTimelineState();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncDelay, setSyncDelay] = useState<number | null>(null);

  if (!syncStatus) return null;

  const lastSyncTime = lastFetch ? lastFetch.toLocaleString() : 'Never';
  const isRecent = lastFetch && (Date.now() - lastFetch.getTime()) < 5 * 60 * 1000; // 5 minutes
  const isVeryRecent = lastFetch && (Date.now() - lastFetch.getTime()) < 30 * 1000; // 30 seconds
  
  // Calculate potential delay warning
  const showDelayWarning = isVeryRecent && !isSyncing;

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncDelay(null);
    
    const startTime = Date.now();
    
    try {
      await triggerSync();
      const duration = Date.now() - startTime;
      setSyncDelay(Math.round(duration / 1000));
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isRecent ? 'bg-green-500' : 'bg-gray-400'} ${isSyncing ? 'animate-pulse' : ''}`}></div>
            <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded">DIRECT API</span>
          </div>
          <span className="text-sm text-gray-600">
            Last fetched: <span className="font-medium text-gray-900">{lastSyncTime}</span>
          </span>
          {syncStatus.recordCount > 0 && (
            <span className="text-sm text-gray-500 ml-2">
              ({syncStatus.recordCount} records)
            </span>
          )}
          {syncDelay && (
            <span className="text-xs text-gray-500 ml-2">
              ({syncDelay}s fetch time)
            </span>
          )}
        </div>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className={`text-sm font-medium px-3 py-1 rounded-md transition-colors duration-200 flex items-center gap-1 ${
            isSyncing 
              ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
              : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
          }`}
        >
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={isSyncing ? 'animate-spin' : ''}
          >
            <path d="M12 4V2L9 5L12 8V6C15.31 6 18 8.69 18 12C18 13.01 17.75 13.97 17.3 14.8L18.76 16.26C19.54 15.03 20 13.57 20 12C20 7.58 16.42 4 12 4Z" fill="currentColor"/>
            <path d="M12 18C8.69 18 6 15.31 6 12C6 10.99 6.25 10.03 6.7 9.2L5.24 7.74C4.46 8.97 4 10.43 4 12C4 16.42 7.58 20 12 20V22L15 19L12 16V18Z" fill="currentColor"/>
          </svg>
          {isSyncing ? 'Fetching...' : 'Refresh'}
        </button>
      </div>
      
      {showDelayWarning && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 13C11.45 13 11 12.55 11 12V8C11 7.45 11.45 7 12 7C12.55 7 13 7.45 13 8V12C13 12.55 12.55 13 12 13ZM13 17H11V15H13V17Z" fill="currentColor" className="text-yellow-600"/>
            </svg>
            <span className="text-sm text-yellow-800">
              Direct API bypasses caching - all data is fresh from Notion! No propagation delays.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};