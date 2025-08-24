import React, { useState } from 'react';
import { useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface NotionRecord {
  id: string;
  title: string;
  assignee: string | null;
  status: string | null;
  lastModified: string;
}

const DirectNotionTest: React.FC = () => {
  const [data, setData] = useState<NotionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const DATABASE_ID = '2584f2e11dba819eb0f5fc54bff7b13f';
  const fetchRawNotionData = useAction(api.testing.rawNotionApi.fetchRawNotionData);
  
  const fetchDirectFromNotion = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🧪 DirectNotionTest: Calling raw Notion API via Convex action...');
      
      const result = await fetchRawNotionData({
        databaseId: DATABASE_ID,
        pageSize: 10
      });
      
      console.log('🧪 DirectNotionTest: Raw API result:', result);
      
      if (result.success && result.records) {
        setData(result.records);
        setLastFetch(new Date().toLocaleTimeString());
      } else {
        throw new Error('Raw API call succeeded but returned no data');
      }
      
    } catch (err) {
      console.error('🧪 DirectNotionTest Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ 
      border: '2px solid #ef4444', 
      padding: '20px', 
      margin: '20px',
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      borderRadius: '8px'
    }}>
      <h2 style={{ color: '#ef4444', marginBottom: '16px' }}>
        🧪 RAW NOTION API TEST (Bypasses Sync Logic)
      </h2>
      
      <div style={{ marginBottom: '16px' }}>
        <button 
          onClick={fetchDirectFromNotion}
          disabled={loading}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? '🔄 Fetching...' : '🧪 Fetch Raw API Data'}
        </button>
        
        {lastFetch && (
          <span style={{ marginLeft: '12px', color: '#9ca3af' }}>
            Last fetch: {lastFetch}
          </span>
        )}
      </div>

      {error && (
        <div style={{ 
          color: '#ef4444', 
          backgroundColor: '#451a1a', 
          padding: '12px', 
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          ❌ Error: {error}
          {error.includes('CORS') && (
            <div style={{ marginTop: '8px', fontSize: '14px' }}>
              💡 This is expected - CORS prevents direct browser calls to Notion API
            </div>
          )}
        </div>
      )}

      {data.length > 0 && (
        <div>
          <h3 style={{ color: '#10b981', marginBottom: '12px' }}>
            ✅ Raw API Results ({data.length} records)
          </h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {data.map((record, index) => (
              <div 
                key={record.id} 
                style={{ 
                  border: '1px solid #374151',
                  padding: '8px',
                  marginBottom: '8px',
                  borderRadius: '4px',
                  backgroundColor: '#262626'
                }}
              >
                <div style={{ fontWeight: 'bold', color: '#60a5fa' }}>
                  #{index + 1}: {record.title}
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                  Assignee: {record.assignee || 'None'} | 
                  Status: {record.status || 'None'} |
                  Modified: {new Date(record.lastModified).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.length === 0 && !loading && !error && (
        <div style={{ color: '#9ca3af' }}>
          No data fetched yet. Click the button to test direct API access.
        </div>
      )}
    </div>
  );
};

export default DirectNotionTest;