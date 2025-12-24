/**
 * Colorist Popup Script
 * Handles all popup UI interactions
 */

// DOM Elements
const eyedropperBtn = document.getElementById('eyedropper-btn');
const pasteBtn = document.getElementById('paste-btn');
const uploadBtn = document.getElementById('upload-btn');
const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const currentColorSection = document.getElementById('current-color');
const colorPreview = document.getElementById('color-preview');
const hexValue = document.getElementById('hex-value');
const rgbValue = document.getElementById('rgb-value');
const hslValue = document.getElementById('hsl-value');
const paletteSection = document.getElementById('palette-section');
const paletteColors = document.getElementById('palette-colors');
const savePaletteBtn = document.getElementById('save-palette-btn');
const exportBtn = document.getElementById('export-btn');
const savedPalettes = document.getElementById('saved-palettes');
const refreshBtn = document.getElementById('refresh-btn');
const generateHarmoniesBtn = document.getElementById('generate-harmonies-btn');
const harmonyHint = document.getElementById('harmony-hint');
const paletteTitle = document.getElementById('palette-title');
const paletteType = document.getElementById('palette-type');

// Hidden paste target for clipboard handling
let pasteTarget = null;

// Current state
let currentColor = null;
let currentPalette = [];
let isFromImage = false; // Track if palette came from image extraction

/**
 * Initialize the popup
 */
async function init() {
  // Load saved palettes
  await loadSavedPalettes();
  
  // Set up event listeners
  setupEventListeners();
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
  // Eyedropper button
  eyedropperBtn.addEventListener('click', handleEyedropper);

  // Paste button - now triggers focus on hidden paste area
  pasteBtn.addEventListener('click', handlePasteClick);

  // Upload button
  uploadBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', handleFileUpload);

  // Drop zone
  dropZone.addEventListener('dragover', handleDragOver);
  dropZone.addEventListener('dragleave', handleDragLeave);
  dropZone.addEventListener('drop', handleDrop);

  // Copy buttons
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', handleCopy);
  });

  // Palette actions
  savePaletteBtn.addEventListener('click', savePalette);
  exportBtn.addEventListener('click', exportPalette);

  // Refresh button
  if (refreshBtn) {
    refreshBtn.addEventListener('click', handleRefresh);
  }

  // Generate harmonies button
  if (generateHarmoniesBtn) {
    generateHarmoniesBtn.addEventListener('click', handleGenerateHarmonies);
  }

  // Set up hidden paste target for reliable clipboard handling
  setupPasteTarget();

  // Also listen for paste anywhere in the popup
  document.addEventListener('paste', handlePasteEvent);
}

/**
 * Handle eyedropper color picking
 */
async function handleEyedropper() {
  // Check if EyeDropper API is supported
  if (!window.EyeDropper) {
    alert('EyeDropper API is not supported in this browser. Please use Chrome 95+.');
    return;
  }
  
  try {
    const eyeDropper = new EyeDropper();
    const result = await eyeDropper.open();
    
    // Got a color!
    const hex = result.sRGBHex;
    setCurrentColor(hex);
    generatePalette(hex);
    
  } catch (err) {
    // User cancelled or error occurred
    console.log('EyeDropper cancelled:', err);
  }
}

/**
 * Set up hidden paste target element
 * This allows us to reliably capture paste events with images
 */
function setupPasteTarget() {
  // Create a hidden contenteditable div to receive paste events
  pasteTarget = document.createElement('div');
  pasteTarget.setAttribute('contenteditable', 'true');
  pasteTarget.style.cssText = `
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  `;
  document.body.appendChild(pasteTarget);
}

/**
 * Handle paste button click
 * Shows instructions and focuses the paste target
 */
function handlePasteClick() {
  // First try the modern clipboard API for text
  tryClipboardRead();
}

/**
 * Try to read clipboard using the modern API
 */
async function tryClipboardRead() {
  try {
    // Try reading text first (most reliable)
    const text = await navigator.clipboard.readText();
    if (text && isValidColorCode(text.trim())) {
      const cleanedColor = text.trim().startsWith('#') ? text.trim() : '#' + text.trim();
      setCurrentColor(cleanedColor);
      generatePalette(cleanedColor);
      showNotification('Color pasted!');
      return;
    }

    // Try reading images (less reliable, but worth trying)
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        const imageType = item.types.find(t => t.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          await extractColorsFromImage(blob);
          showNotification('Colors extracted from image!');
          return;
        }
      }
    } catch (imageErr) {
      // Image reading failed, show helpful message
      console.log('Image clipboard read not supported:', imageErr);
    }

    // If we got here, no valid content found
    showNotification('No color or image found. Try Cmd/Ctrl+V after copying an image, or use Upload.', 'warning');

  } catch (err) {
    console.error('Clipboard read error:', err);
    showNotification('Cannot access clipboard. Use Cmd/Ctrl+V or drag & drop an image.', 'warning');
  }
}

/**
 * Handle paste event (from Cmd/Ctrl+V)
 * This is more reliable for images than the clipboard API
 */
function handlePasteEvent(event) {
  const items = event.clipboardData?.items;
  if (!items) return;

  // First pass: look for actual image data (most reliable)
  for (const item of items) {
    if (item.type.startsWith('image/')) {
      event.preventDefault();
      const blob = item.getAsFile();
      if (blob) {
        extractColorsFromImage(blob);
        showNotification('Colors extracted from image!');
      }
      return;
    }
  }

  // Second pass: look for HTML with image (common when copying from web)
  for (const item of items) {
    if (item.type === 'text/html') {
      item.getAsString((html) => {
        const imgUrl = extractImageUrlFromHtml(html);
        if (imgUrl) {
          event.preventDefault();
          loadImageFromUrl(imgUrl);
        }
      });
      return;
    }
  }

  // Third pass: look for plain text (could be color code or image URL)
  for (const item of items) {
    if (item.type === 'text/plain') {
      item.getAsString((text) => {
        const trimmed = text.trim();

        // Check if it's a color code
        if (isValidColorCode(trimmed)) {
          event.preventDefault();
          const cleanedColor = trimmed.startsWith('#') ? trimmed : '#' + trimmed;
          setCurrentColor(cleanedColor);
          generatePalette(cleanedColor);
          showNotification('Color pasted!');
          return;
        }

        // Check if it's an image URL
        if (isImageUrl(trimmed)) {
          event.preventDefault();
          loadImageFromUrl(trimmed);
        }
      });
      return;
    }
  }
}

/**
 * Extract image URL from HTML string
 */
function extractImageUrlFromHtml(html) {
  // Create a temporary element to parse HTML
  const div = document.createElement('div');
  div.innerHTML = html;

  // Look for img tags
  const img = div.querySelector('img');
  if (img && img.src) {
    return img.src;
  }

  // Look for background-image in style
  const elementsWithBg = div.querySelectorAll('[style*="background"]');
  for (const el of elementsWithBg) {
    const match = el.style.backgroundImage?.match(/url\(["']?([^"')]+)["']?\)/);
    if (match) {
      return match[1];
    }
  }

  // Try to find URLs in the HTML directly
  const urlMatch = html.match(/https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|gif|webp)/i);
  if (urlMatch) {
    return urlMatch[0];
  }

  return null;
}

/**
 * Check if a string is an image URL
 */
function isImageUrl(str) {
  try {
    const url = new URL(str);
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url.pathname) ||
           str.includes('image') ||
           str.includes('photo') ||
           str.includes('pinimg.com'); // Pinterest
  } catch {
    return false;
  }
}

/**
 * Load image from URL and extract colors
 */
async function loadImageFromUrl(url) {
  showNotification('Loading image...', 'info');

  try {
    // Try to fetch the image as a blob to avoid CORS issues
    const response = await fetch(url, { mode: 'cors' });
    if (response.ok) {
      const blob = await response.blob();
      if (blob.type.startsWith('image/')) {
        await extractColorsFromImage(blob);
        showNotification('Colors extracted from image!');
        return;
      }
    }
  } catch (fetchError) {
    console.log('Fetch failed, trying direct load:', fetchError);
  }

  // Fallback: try loading directly (might work for some images)
  try {
    await extractColorsFromImage(url);
    showNotification('Colors extracted from image!');
  } catch (loadError) {
    console.error('Image load failed:', loadError);
    showNotification('Could not load image. Try downloading it first, then use Upload.', 'warning');
  }
}

/**
 * Handle refresh/reset
 */
function handleRefresh() {
  // Reset state
  currentColor = null;
  currentPalette = [];
  isFromImage = false;

  // Hide sections
  currentColorSection.classList.add('hidden');
  paletteSection.classList.add('hidden');

  // Hide generate harmonies button and hint
  if (generateHarmoniesBtn) generateHarmoniesBtn.classList.add('hidden');
  if (harmonyHint) harmonyHint.classList.add('hidden');

  // Reset displays
  colorPreview.style.backgroundColor = '#000';
  hexValue.textContent = '#000000';
  rgbValue.textContent = 'rgb(0, 0, 0)';
  hslValue.textContent = 'hsl(0, 0%, 0%)';
  paletteColors.innerHTML = '';

  // Reset palette title
  if (paletteTitle) paletteTitle.textContent = 'Generated Palette';
  if (paletteType) paletteType.textContent = '';

  showNotification('Reset! Pick a new color.');
}

/**
 * Handle generate harmonies button click
 */
function handleGenerateHarmonies() {
  if (!currentColor) {
    showNotification('Pick a color first!', 'warning');
    return;
  }

  // Generate harmonies from the current color
  generatePalette(currentColor);
  isFromImage = false;

  // Update UI
  updatePaletteUI('harmony');
  showNotification('Harmonies generated from ' + currentColor);
}

/**
 * Show a notification message
 */
function showNotification(message, type = 'success') {
  // Remove any existing notification
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;

  // Define colors for different types
  const colors = {
    success: { bg: '#D1FAE5', text: '#065F46' },
    warning: { bg: '#FEF3C7', text: '#92400E' },
    info: { bg: '#DBEAFE', text: '#1E40AF' },
    error: { bg: '#FEE2E2', text: '#991B1B' }
  };
  const colorScheme = colors[type] || colors.success;

  // Style it
  notification.style.cssText = `
    position: fixed;
    bottom: 16px;
    left: 16px;
    right: 16px;
    padding: 12px;
    background: ${colorScheme.bg};
    color: ${colorScheme.text};
    border-radius: 8px;
    font-size: 12px;
    text-align: center;
    z-index: 1000;
    animation: slideUp 0.3s ease;
  `;

  document.body.appendChild(notification);

  // Remove after 3 seconds (longer for warnings/errors)
  const duration = (type === 'warning' || type === 'error') ? 5000 : 3000;
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s';
    setTimeout(() => notification.remove(), 300);
  }, duration);
}

/**
 * Handle file upload
 */
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    extractColorsFromImage(file);
  }
}

/**
 * Handle drag over
 */
function handleDragOver(event) {
  event.preventDefault();
  dropZone.classList.add('active');
}

/**
 * Handle drag leave
 */
function handleDragLeave(event) {
  event.preventDefault();
  dropZone.classList.remove('active');
}

/**
 * Handle drop
 */
function handleDrop(event) {
  event.preventDefault();
  dropZone.classList.remove('active');
  
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    extractColorsFromImage(file);
  }
}

/**
 * Extract colors from an image
 */
async function extractColorsFromImage(imageSource) {
  const img = new Image();

  // Enable CORS for external URLs
  img.crossOrigin = 'anonymous';

  return new Promise((resolve, reject) => {
    img.onload = () => {
      try {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Scale down for performance
        const maxSize = 100;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = Math.max(1, img.width * scale);
        canvas.height = Math.max(1, img.height * scale);

        // Draw image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Get pixel data
        let imageData;
        try {
          imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        } catch (securityError) {
          // CORS blocked - canvas is tainted
          console.error('Canvas tainted by CORS:', securityError);
          reject(new Error('Image blocked by website security. Try downloading and uploading instead.'));
          return;
        }

        const colors = extractDominantColors(imageData.data, 5);

        // Check if we got valid colors (not all black/empty)
        const allBlack = colors.every(c => c === '#000000' || c === '#202020');
        if (colors.length === 0 || allBlack) {
          reject(new Error('Could not extract colors from image.'));
          return;
        }

        // Set first color as current and mark as from image
        isFromImage = true;
        setCurrentColor(colors[0]);
        setPalette(colors);
        updatePaletteUI('extracted');

        resolve(colors);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image.'));
    };

    // Load image from blob or file
    if (imageSource instanceof Blob) {
      img.src = URL.createObjectURL(imageSource);
    } else {
      img.src = imageSource;
    }
  });
}

/**
 * Extract dominant colors from pixel data
 * Simple implementation - can be improved with K-means
 */
function extractDominantColors(pixelData, count) {
  const colorCounts = {};
  
  // Sample every 4th pixel for performance
  for (let i = 0; i < pixelData.length; i += 16) {
    const r = pixelData[i];
    const g = pixelData[i + 1];
    const b = pixelData[i + 2];
    const a = pixelData[i + 3];
    
    // Skip transparent pixels
    if (a < 128) continue;
    
    // Quantize to reduce color space
    const qr = Math.round(r / 32) * 32;
    const qg = Math.round(g / 32) * 32;
    const qb = Math.round(b / 32) * 32;
    
    const key = `${qr},${qg},${qb}`;
    colorCounts[key] = (colorCounts[key] || 0) + 1;
  }
  
  // Sort by frequency
  const sorted = Object.entries(colorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count);
  
  // Convert to hex
  return sorted.map(([key]) => {
    const [r, g, b] = key.split(',').map(Number);
    return rgbToHex(r, g, b);
  });
}

/**
 * Set the current color display
 */
function setCurrentColor(hex) {
  currentColor = hex.toUpperCase();
  
  // Update preview
  colorPreview.style.backgroundColor = currentColor;
  
  // Update values
  hexValue.textContent = currentColor;
  rgbValue.textContent = hexToRgb(currentColor);
  hslValue.textContent = hexToHsl(currentColor);
  
  // Show section
  currentColorSection.classList.remove('hidden');
}

/**
 * Generate a harmonious palette from a base color
 */
function generatePalette(baseHex) {
  const hsl = hexToHslValues(baseHex);
  const palette = [baseHex.toUpperCase()];

  // Complementary
  palette.push(hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));

  // Analogous
  palette.push(hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l));
  palette.push(hslToHex((hsl.h + 330) % 360, hsl.s, hsl.l));

  // Lighter/darker variations
  palette.push(hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 20, 95)));

  // Mark as NOT from image (these are generated harmonies)
  isFromImage = false;

  setPalette(palette);
  updatePaletteUI('harmony');
}

/**
 * Set the palette display
 */
function setPalette(colors) {
  currentPalette = colors;

  // Clear existing
  paletteColors.innerHTML = '';

  // Add color swatches
  colors.forEach((color, index) => {
    const swatch = document.createElement('div');
    swatch.className = 'palette-color';
    swatch.style.backgroundColor = color;

    // If from image, clicking generates harmonies. Otherwise, just copy.
    if (isFromImage) {
      swatch.title = `${color} - Click to generate harmonies`;
      swatch.addEventListener('click', () => {
        setCurrentColor(color);
        generatePalette(color);
        showNotification('Harmonies generated from ' + color);
      });
    } else {
      swatch.title = `${color} - Click to copy`;
      swatch.addEventListener('click', () => {
        setCurrentColor(color);
        copyToClipboard(color);
        showNotification('Copied ' + color);
      });
    }

    paletteColors.appendChild(swatch);
  });

  // Show section
  paletteSection.classList.remove('hidden');
}

/**
 * Update palette UI based on mode (extracted from image vs generated harmonies)
 */
function updatePaletteUI(mode) {
  if (mode === 'extracted') {
    // Extracted from image - show generate harmonies button
    if (paletteTitle) paletteTitle.textContent = 'Extracted Colors';
    if (paletteType) {
      paletteType.textContent = 'from image';
      paletteType.style.color = '#8B5CF6';
    }
    if (generateHarmoniesBtn) generateHarmoniesBtn.classList.remove('hidden');
    if (harmonyHint) harmonyHint.classList.remove('hidden');
  } else {
    // Generated harmonies - hide the button
    if (paletteTitle) paletteTitle.textContent = 'Color Harmonies';
    if (paletteType) {
      paletteType.textContent = 'complementary + analogous';
      paletteType.style.color = '#059669';
    }
    if (generateHarmoniesBtn) generateHarmoniesBtn.classList.add('hidden');
    if (harmonyHint) harmonyHint.classList.add('hidden');
  }
}

/**
 * Handle copy button clicks
 */
function handleCopy(event) {
  const target = event.target.dataset.target;
  let value = '';
  
  switch (target) {
    case 'hex':
      value = hexValue.textContent;
      break;
    case 'rgb':
      value = rgbValue.textContent;
      break;
    case 'hsl':
      value = hslValue.textContent;
      break;
  }
  
  copyToClipboard(value);
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    // Could add visual feedback here
  } catch (err) {
    console.error('Copy failed:', err);
  }
}

/**
 * Save current palette
 */
async function savePalette() {
  if (currentPalette.length === 0) return;
  
  const palettes = await chrome.storage.local.get('palettes') || { palettes: [] };
  const savedList = palettes.palettes || [];
  
  savedList.unshift({
    id: Date.now(),
    colors: currentPalette,
    createdAt: new Date().toISOString()
  });
  
  // Keep only last 20
  if (savedList.length > 20) {
    savedList.pop();
  }
  
  await chrome.storage.local.set({ palettes: savedList });
  await loadSavedPalettes();
}

/**
 * Load saved palettes
 */
async function loadSavedPalettes() {
  const result = await chrome.storage.local.get('palettes');
  const palettes = result.palettes || [];
  
  if (palettes.length === 0) {
    savedPalettes.innerHTML = '<p class="empty-state">No saved palettes yet</p>';
    return;
  }
  
  savedPalettes.innerHTML = '';
  
  palettes.forEach(palette => {
    const div = document.createElement('div');
    div.className = 'saved-palette';
    
    palette.colors.forEach(color => {
      const swatch = document.createElement('div');
      swatch.style.flex = '1';
      swatch.style.backgroundColor = color;
      div.appendChild(swatch);
    });
    
    div.addEventListener('click', () => {
      setPalette(palette.colors);
      setCurrentColor(palette.colors[0]);
    });
    
    savedPalettes.appendChild(div);
  });
}

/**
 * Export palette
 */
function exportPalette() {
  if (currentPalette.length === 0) return;
  
  // Simple CSS export for now
  const css = `:root {\n${currentPalette.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')}\n}`;
  
  copyToClipboard(css);
  alert('CSS variables copied to clipboard!');
}

// ============ Color Conversion Utilities ============

function isValidColorCode(text) {
  return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(text.trim());
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return 'rgb(0, 0, 0)';
  
  return `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`;
}

function hexToHslValues(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };
  
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function hexToHsl(hex) {
  const { h, s, l } = hexToHslValues(hex);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

// Initialize
init();
