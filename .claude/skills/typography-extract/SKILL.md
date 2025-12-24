# 📝 Typography Extract Skill

> Identify fonts and typography properties from web elements

## When to Apply This Skill

Apply this skill when:
- User hovers over text and wants font details
- User asks to identify a font
- User wants to capture typography from a website
- Building the typography analysis feature

## Properties to Extract

From any text element, capture:

```json
{
  "fontFamily": {
    "primary": "Inter",
    "fallbacks": ["system-ui", "-apple-system", "sans-serif"],
    "fullStack": "Inter, system-ui, -apple-system, sans-serif"
  },
  "fontWeight": {
    "value": 500,
    "name": "Medium"
  },
  "fontSize": {
    "px": 16,
    "rem": 1,
    "pt": 12
  },
  "lineHeight": {
    "value": 1.6,
    "px": 25.6
  },
  "letterSpacing": {
    "value": "-0.01em",
    "px": -0.16
  },
  "textColor": "#1E293B",
  "textTransform": "none",
  "fontStyle": "normal"
}
```

## Font Weight Names

| Value | Name |
|-------|------|
| 100 | Thin |
| 200 | Extra Light |
| 300 | Light |
| 400 | Regular |
| 500 | Medium |
| 600 | Semi Bold |
| 700 | Bold |
| 800 | Extra Bold |
| 900 | Black |

## Common Web Fonts Database

### Google Fonts (Free)
| Font | Category | Similar To |
|------|----------|------------|
| Inter | Sans-serif | SF Pro, Helvetica |
| Roboto | Sans-serif | Arial, Helvetica |
| Open Sans | Sans-serif | Segoe UI |
| Lato | Sans-serif | Proxima Nova |
| Poppins | Sans-serif | Circular |
| Montserrat | Sans-serif | Gotham |
| Playfair Display | Serif | Georgia, Times |
| Merriweather | Serif | Charter |
| Source Code Pro | Monospace | Consolas |
| JetBrains Mono | Monospace | Fira Code |

### System Fonts
| Font | Platform |
|------|----------|
| San Francisco | macOS, iOS |
| Segoe UI | Windows |
| Roboto | Android |
| Ubuntu | Ubuntu Linux |

## Type Scale Detection

Analyze the page for type hierarchy:

```javascript
const analyzeTypeScale = (elements) => {
  const sizes = [...new Set(elements.map(el => 
    parseFloat(getComputedStyle(el).fontSize)
  ))].sort((a, b) => b - a);
  
  // Calculate ratio between consecutive sizes
  const ratios = [];
  for (let i = 0; i < sizes.length - 1; i++) {
    ratios.push(sizes[i] / sizes[i + 1]);
  }
  
  const avgRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;
  
  return {
    sizes,
    averageRatio: avgRatio.toFixed(3),
    suggestedScale: identifyScale(avgRatio)
  };
};
```

### Common Type Scales

| Ratio | Name | Use Case |
|-------|------|----------|
| 1.067 | Minor Second | Compact UIs |
| 1.125 | Major Second | Body copy |
| 1.200 | Minor Third | General purpose |
| 1.250 | Major Third | Most common |
| 1.333 | Perfect Fourth | Headlines |
| 1.414 | Augmented Fourth | High contrast |
| 1.500 | Perfect Fifth | Dramatic |
| 1.618 | Golden Ratio | Classic |

## Google Fonts API Integration

To check if a font is available on Google Fonts:

```javascript
const checkGoogleFont = async (fontName) => {
  const response = await fetch(
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}`
  );
  return response.ok;
};
```

## Output Format

```
┌─────────────────────────────────────────────────────────────┐
│                    TYPOGRAPHY ANALYSIS                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Font: Inter                                                 │
│  Weight: 500 (Medium)                                        │
│  Size: 16px / 1rem                                           │
│  Line Height: 1.6 (25.6px)                                   │
│  Letter Spacing: -0.01em                                     │
│  Color: #1E293B                                              │
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  📦 Source: Google Fonts (free)                              │
│  🔗 https://fonts.google.com/specimen/Inter                  │
│                                                              │
│  💡 Similar alternatives:                                    │
│     • SF Pro (Apple system font)                             │
│     • Roboto (Google's default)                              │
│     • Helvetica Neue (Classic)                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## CSS Export

Generate ready-to-use CSS:

```css
/* Typography captured from [URL] */
.text-style {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-weight: 500;
  font-size: 1rem; /* 16px */
  line-height: 1.6;
  letter-spacing: -0.01em;
  color: #1E293B;
}
```

## Tailwind Export

```javascript
{
  fontFamily: {
    'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
  },
  fontSize: {
    'base': ['1rem', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
  }
}
```
