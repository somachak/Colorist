/**
 * Colorist Content Script
 * Runs on web pages to extract colors and typography
 */

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received:', message);
  
  switch (message.type) {
    case 'EXTRACT_COLORS':
      const colors = extractPageColors();
      sendResponse({ colors });
      break;
      
    case 'EXTRACT_TYPOGRAPHY':
      const typography = extractTypography(message.selector);
      sendResponse({ typography });
      break;
      
    default:
      console.log('Unknown message type:', message.type);
  }
});

/**
 * Extract colors from the current page
 * Analyzes CSS to find primary, background, accent, and text colors
 */
function extractPageColors() {
  const colors = {
    primary: [],
    background: [],
    text: [],
    accent: [],
    border: []
  };
  
  // Get all elements
  const elements = document.querySelectorAll('*');
  const colorCounts = {};
  
  elements.forEach(el => {
    const styles = window.getComputedStyle(el);
    
    // Background colors
    const bgColor = styles.backgroundColor;
    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
      colorCounts[bgColor] = (colorCounts[bgColor] || 0) + 1;
    }
    
    // Text colors
    const textColor = styles.color;
    if (textColor) {
      const key = `text:${textColor}`;
      colorCounts[key] = (colorCounts[key] || 0) + 1;
    }
    
    // Border colors
    const borderColor = styles.borderColor;
    if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)') {
      const key = `border:${borderColor}`;
      colorCounts[key] = (colorCounts[key] || 0) + 1;
    }
  });
  
  // Sort and categorize
  const sorted = Object.entries(colorCounts)
    .sort((a, b) => b[1] - a[1]);
  
  sorted.forEach(([key, count]) => {
    if (key.startsWith('text:')) {
      colors.text.push(key.replace('text:', ''));
    } else if (key.startsWith('border:')) {
      colors.border.push(key.replace('border:', ''));
    } else {
      colors.background.push(key);
    }
  });
  
  // Limit results
  colors.background = colors.background.slice(0, 5);
  colors.text = colors.text.slice(0, 5);
  colors.border = colors.border.slice(0, 3);
  
  return colors;
}

/**
 * Extract typography information from an element
 */
function extractTypography(selector) {
  const el = selector ? document.querySelector(selector) : document.body;
  if (!el) return null;
  
  const styles = window.getComputedStyle(el);
  
  return {
    fontFamily: styles.fontFamily,
    fontSize: styles.fontSize,
    fontWeight: styles.fontWeight,
    lineHeight: styles.lineHeight,
    letterSpacing: styles.letterSpacing,
    color: styles.color,
    textTransform: styles.textTransform
  };
}

console.log('Colorist content script loaded');
