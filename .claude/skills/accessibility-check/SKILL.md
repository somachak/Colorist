# ♿ Accessibility Check Skill

> Calculate WCAG contrast ratios and compliance for color combinations

## When to Apply This Skill

Apply this skill when:
- User provides two colors (foreground/background)
- User asks about accessibility or contrast
- User wants to verify WCAG compliance
- Building UI with text on colored backgrounds

## WCAG Contrast Requirements

| Level | Normal Text | Large Text | UI Components |
|-------|-------------|------------|---------------|
| AA | 4.5:1 | 3:1 | 3:1 |
| AAA | 7:1 | 4.5:1 | Not defined |

**Large Text** = 18pt (24px) or 14pt (18.67px) bold

## Contrast Calculation Formula

### Relative Luminance
```javascript
const getLuminance = (r, g, b) => {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};
```

### Contrast Ratio
```javascript
const getContrastRatio = (color1, color2) => {
  const l1 = getLuminance(color1.r, color1.g, color1.b);
  const l2 = getLuminance(color2.r, color2.g, color2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};
```

## Output Format

When checking accessibility, return:

```json
{
  "foreground": "#FFFFFF",
  "background": "#3B82F6",
  "contrastRatio": 4.68,
  "compliance": {
    "normalText": { "AA": true, "AAA": false },
    "largeText": { "AA": true, "AAA": true },
    "uiComponents": { "AA": true }
  },
  "recommendations": [
    "Safe for large headings (AAA)",
    "Safe for body text (AA)",
    "Consider darkening background to #2563EB for AAA body text"
  ]
}
```

## Visual Representation

```
┌─────────────────────────────────────────────────────────────┐
│                   CONTRAST CHECK: 4.68:1                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Foreground: #FFFFFF (White)                                 │
│  Background: #3B82F6 (Blue)                                  │
│                                                              │
│  ┌─────────────────┬────────────────┬────────────────┐      │
│  │                 │      AA        │      AAA       │      │
│  ├─────────────────┼────────────────┼────────────────┤      │
│  │ Normal Text     │      ✅        │      ❌        │      │
│  │ Large Text      │      ✅        │      ✅        │      │
│  │ UI Components   │      ✅        │      —         │      │
│  └─────────────────┴────────────────┴────────────────┘      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Colorblind Simulation

Also provide simulations for:
- **Protanopia** (red-blind, ~1% of males)
- **Deuteranopia** (green-blind, ~1% of males)
- **Tritanopia** (blue-blind, ~0.003% of population)
- **Achromatopsia** (complete colorblindness, rare)

### Simulation Matrices

```javascript
const colorBlindMatrices = {
  protanopia: [
    [0.567, 0.433, 0],
    [0.558, 0.442, 0],
    [0, 0.242, 0.758]
  ],
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7]
  ],
  tritanopia: [
    [0.95, 0.05, 0],
    [0, 0.433, 0.567],
    [0, 0.475, 0.525]
  ]
};
```

## Suggested Fixes

When contrast fails, suggest specific adjustments:

```
Current: #6B7280 on #F3F4F6 = 3.94:1 (fails AA)

Suggestions to reach AA (4.5:1):
├── Darken text to #4B5563 → 5.91:1 ✅
├── Lighten background to #FFFFFF → 4.69:1 ✅
└── Both: #525252 on #FAFAFA → 7.05:1 ✅ (AAA!)
```

## Integration Points

This skill should be triggered:
1. After color-harmony generates a palette
2. When user picks two colors from a page
3. When exporting design tokens
4. In the accessibility tab of the extension popup
