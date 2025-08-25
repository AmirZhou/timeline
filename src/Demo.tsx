import React, { useState } from 'react';
import { Timeline } from './Timeline';

export const Demo: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showDemo, setShowDemo] = useState(true);

  if (!showDemo) {
    // Show just the timeline component without demo UI
    return (
      <div>
        <Timeline theme={theme} />
        <button
          onClick={() => setShowDemo(true)}
          style={{
            position: 'fixed',
            top: 10,
            right: 10,
            padding: '8px 16px',
            background: 'rgba(0,255,0,0.2)',
            border: '1px solid #00ff00',
            color: '#00ff00',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Show Demo UI
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: theme === 'dark' ? '#000' : '#f5f5f5',
      color: theme === 'dark' ? '#fff' : '#000',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        marginBottom: '20px'
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '10px',
          color: '#00ff00'
        }}>
          @bitravage/timeline Demo
        </h1>

        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="radio"
              name="theme"
              checked={theme === 'dark'}
              onChange={() => setTheme('dark')}
            />
            Dark Theme
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="radio"
              name="theme"
              checked={theme === 'light'}
              onChange={() => setTheme('light')}
            />
            Light Theme
          </label>

          <button
            onClick={() => setShowDemo(false)}
            style={{
              padding: '8px 16px',
              background: 'rgba(0,255,0,0.2)',
              border: '1px solid #00ff00',
              color: '#00ff00',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Hide Demo UI
          </button>
        </div>

        <div style={{
          background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <h2 style={{ marginBottom: '16px', color: '#00ff00' }}>Usage Example:</h2>
          <pre style={{
            background: theme === 'dark' ? '#111' : '#f8f8f8',
            padding: '12px',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '14px',
            border: `1px solid ${theme === 'dark' ? '#333' : '#ddd'}`
          }}>
            {`import { Timeline } from '@bitravage/timeline';

// Basic usage (reads from environment variables)
<Timeline />

// With configuration
<Timeline 
  theme="${theme}" 
  convexUrl="https://your-deployment.convex.cloud"
  className="my-timeline"
/>`}
          </pre>
        </div>
      </div>

      {/* The actual Timeline component */}
      <Timeline
        theme={theme}
        className="demo-timeline"
      />
    </div>
  );
};