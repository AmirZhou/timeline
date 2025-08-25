/**
 * Build script to embed compiled CSS into the CSS injection utility
 * This creates a self-contained component library with automatic CSS injection
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_CSS_PATH = path.join(__dirname, '../dist/timeline.css');
const INJECT_CSS_PATH = path.join(__dirname, '../src/utils/injectCSS.ts');

function embedCSS() {
  try {
    // Read the compiled CSS file
    const cssContent = fs.readFileSync(DIST_CSS_PATH, 'utf8');
    
    // Escape the CSS for JavaScript string literal
    const escapedCSS = cssContent
      .replace(/\\/g, '\\\\')  // Escape backslashes
      .replace(/`/g, '\\`')    // Escape template literals
      .replace(/\$/g, '\\$');  // Escape template literal variables

    // Create the updated CSS injection utility
    const injectionCode = `/**
 * CSS Injection Utility for Timeline Component
 * Automatically injects compiled CSS into the document head when Timeline is imported
 */

// Flag to ensure CSS is only injected once
let cssInjected = false;

/**
 * Injects the compiled CSS into the document head
 * This provides automatic styling without requiring manual CSS imports
 */
export function injectTimelineCSS(): void {
  // Skip injection if already injected or in SSR environment
  if (cssInjected || typeof document === 'undefined') {
    return;
  }

  // Check if CSS is already injected by another instance
  if (document.getElementById('bitravage-timeline-styles')) {
    cssInjected = true;
    return;
  }

  // Create style element
  const styleElement = document.createElement('style');
  styleElement.id = 'bitravage-timeline-styles';
  styleElement.type = 'text/css';
  
  // Inject compiled CSS content
  styleElement.textContent = getCompiledCSS();
  
  // Inject into document head
  document.head.appendChild(styleElement);
  
  // Mark as injected
  cssInjected = true;
}

/**
 * Returns the compiled Tailwind + custom CSS
 * This content is automatically embedded during the build process
 */
function getCompiledCSS(): string {
  return \`${escapedCSS}\`;
}`;

    // Write the updated injection utility
    fs.writeFileSync(INJECT_CSS_PATH, injectionCode, 'utf8');
    
    console.log('✅ CSS successfully embedded into injection utility');
    console.log(`📏 CSS size: ${Math.round(cssContent.length / 1024 * 100) / 100}KB`);
    
  } catch (error) {
    console.error('❌ Error embedding CSS:', error.message);
    process.exit(1);
  }
}

// Run the embedding process
embedCSS();