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

// Current state
let currentColor = null;
let currentPalette = [];

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
  
  // Paste button
  pasteBtn.addEventListener('click', handlePaste);
  
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
 * Handle paste from clipboard
 */
async function handlePaste() {
  try {
    const clipboardItems = await navigator.clipboard.read();
    
    for (const item of clipboardItems) {
      // Check for image
      if (item.types.includes('image/png') || item.types.includes('image/jpeg')) {
        const imageType = item.types.find(t => t.startsWith('image/'));
        const blob = await item.getType(imageType);
        await extractColorsFromImage(blob);
        return;
      }
      
      // Check for text (might be a color code)
      if (item.types.includes('text/plain')) {
        const blob = await item.getType('text/plain');
        const text = await blob.text();
        
        // Try to parse as color
        if (isValidColorCode(text)) {
          setCurrentColor(text);
          generatePalette(text);
          return;
        }
      }
    }
    
    alert('No valid image or color code found in clipboard.');
    
  } catch (err) {
    console.error('Paste error:', err);
    alert('Could not read clipboard. Please try again.');
  }
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
  
  return new Promise((resolve, reject) => {
    img.onload = () => {
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Scale down for performance
      const maxSize = 100;
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      // Draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Get pixel data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const colors = extractDominantColors(imageData.data, 5);
      
      // Set first color as current
      if (colors.length > 0) {
        setCurrentColor(colors[0]);
        setPalette(colors);
      }
      
      resolve(colors);
    };
    
    img.onerror = reject;
    
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
  const palette = [baseHex];
  
  // Complementary
  palette.push(hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
  
  // Analogous
  palette.push(hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l));
  palette.push(hslToHex((hsl.h + 330) % 360, hsl.s, hsl.l));
  
  // Lighter/darker variations
  palette.push(hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 20, 95)));
  
  setPalette(palette);
}

/**
 * Set the palette display
 */
function setPalette(colors) {
  currentPalette = colors;
  
  // Clear existing
  paletteColors.innerHTML = '';
  
  // Add color swatches
  colors.forEach(color => {
    const swatch = document.createElement('div');
    swatch.className = 'palette-color';
    swatch.style.backgroundColor = color;
    swatch.title = color;
    swatch.addEventListener('click', () => {
      setCurrentColor(color);
      copyToClipboard(color);
    });
    paletteColors.appendChild(swatch);
  });
  
  // Show section
  paletteSection.classList.remove('hidden');
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
