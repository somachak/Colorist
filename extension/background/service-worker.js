/**
 * Colorist Service Worker
 * Handles background operations and cross-tab communication
 */

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Colorist installed:', details.reason);
  
  // Initialize storage
  chrome.storage.local.get('palettes', (result) => {
    if (!result.palettes) {
      chrome.storage.local.set({ palettes: [] });
    }
  });
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);
  
  switch (message.type) {
    case 'GET_PAGE_COLORS':
      // Forward to content script
      chrome.tabs.sendMessage(sender.tab?.id || message.tabId, {
        type: 'EXTRACT_COLORS'
      }, sendResponse);
      return true; // Keep channel open for async response
      
    case 'SAVE_PALETTE':
      savePalette(message.palette);
      sendResponse({ success: true });
      break;
      
    default:
      console.log('Unknown message type:', message.type);
  }
});

/**
 * Save a palette to storage
 */
async function savePalette(palette) {
  const result = await chrome.storage.local.get('palettes');
  const palettes = result.palettes || [];
  
  palettes.unshift({
    id: Date.now(),
    colors: palette.colors,
    name: palette.name || 'Untitled',
    createdAt: new Date().toISOString()
  });
  
  // Keep only last 50
  if (palettes.length > 50) {
    palettes.pop();
  }
  
  await chrome.storage.local.set({ palettes });
}
