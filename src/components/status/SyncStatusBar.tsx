import React, { useState } from 'react';
import { useTimelineState } from '../providers/TimelineStateProvider';
import { ErrorFallback } from './ErrorFallback';

export const SyncStatusBar: React.FC = () => {
  try {
    const { syncStatus, triggerSync, lastFetch } = useTimelineState();
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncDelay, setSyncDelay] = useState<number | null>(null);
    const [syncError, setSyncError] = useState<string | null>(null);

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
      setSyncError(null);
      await triggerSync();
      const duration = Date.now() - startTime;
      setSyncDelay(Math.round(duration / 1000));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sync failed';
      console.error('Sync failed:', error);
      setSyncError(errorMessage);
    } finally {
      setIsSyncing(false);
    }
  };

  const statusColor = syncError ? 'bg-red-500' : (isRecent ? 'bg-[#00ff00]' : 'bg-gray-400');
  const hasError = syncStatus.status === 'error' || syncError;

  return (
    <div className={`bg-black/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 mb-6 focus-within:ring-2 focus-within:ring-green-400 focus-within:ring-opacity-50 ${hasError ? 'border-red-500/30' : ''}`}>
      {hasError && (
        <div className="mb-2 text-sm text-red-400">
          ⚠️ {syncError || syncStatus.error || 'Sync error occurred'}
        </div>
      )}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${statusColor} ${isSyncing ? 'animate-pulse' : ''}`}></div>
          <span className={`text-sm ${hasError ? 'text-red-400' : 'text-gray-400'}`}>
            Last synced: <span className={`font-medium ${hasError ? 'text-red-300' : 'text-white'}`}>{lastSyncTime}</span>
          </span>
        </div>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className={`text-sm font-medium px-3 py-1 transition-all duration-200 motion-reduce:transition-none flex items-center gap-1 ${
            isSyncing 
              ? 'text-gray-500 cursor-not-allowed' 
              : 'text-[#00ff00] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#00ff00] focus:ring-opacity-50'
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
      
    </div>
  );
  } catch (error) {
    console.error('SyncStatusBar error:', error);
    return (
      <ErrorFallback 
        message="Failed to load sync status" 
      />
    );
  }
};