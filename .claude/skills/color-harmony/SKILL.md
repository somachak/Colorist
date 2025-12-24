# Color Harmony Generation Skill

> **PURPOSE**: Automatically generate harmonious color palettes from a base color
> **TRIGGERS**: When user provides a color and asks for palette suggestions

---

## When To Apply This Skill

Apply this skill when:
- User provides a hex color (e.g., #3B82F6)
- User asks for "complementary colors"
- User asks for "a palette based on [color]"
- User wants "colors that go with [color]"

---

## Color Harmony Rules

### Primary Harmonies

| Harmony Type | Calculation | Use Case |
|--------------|-------------|----------|
| **Complementary** | +180° on color wheel | High contrast, attention-grabbing |
| **Analogous** | ±30° neighbors | Harmonious, nature-inspired |
| **Triadic** | +120° apart | Vibrant, balanced |
| **Split-Complementary** | +150° and +210° | Contrast with less tension |
| **Tetradic** | +90°, +180°, +270° | Rich, complex schemes |

### Shade Variations

For any color, also generate:
- **Lighter**: +15-20% lightness
- **Darker**: -15-20% lightness
- **Muted**: -20% saturation
- **Vivid**: +20% saturation (max 100%)

---

## Output Format

When generating a palette, return:

```json
{
  "base": "#3B82F6",
  "harmonies": {
    "complementary": "#F6923B",
    "analogous": ["#3B46F6", "#3BC4F6"],
    "triadic": ["#82F63B", "#F63B82"],
    "split_complementary": ["#F6D93B", "#F6503B"]
  },
  "variations": {
    "lighter": "#6BA3F8",
    "darker": "#1E5DC4",
    "muted": "#5B8AD6",
    "vivid": "#1B6EFF"
  },
  "recommendations": {
    "primary": "#3B82F6",
    "secondary": "#F6923B",
    "accent": "#82F63B",
    "background_light": "#F0F6FF",
    "background_dark": "#0A1628",
    "text_on_primary": "#FFFFFF"
  }
}
```

---

## Accessibility Considerations

Always check and report:
- Contrast ratio of text on each color
- WCAG AA compliance (4.5:1 for normal text)
- WCAG AAA compliance (7:1 for normal text)
- Suggested text color (black or white) for each swatch

---

## Example Interaction

**User**: "Generate a palette from #667EEA"

**Claude**: 
Here's a harmonious palette based on #667EEA (a purple-blue):

| Role | Color | Contrast |
|------|-------|----------|
| Primary | #667EEA | White text ✓ |
| Complementary | #EADC66 | Black text ✓ |
| Analogous 1 | #8866EA | White text ✓ |
| Analogous 2 | #66B0EA | Black text ✓ |
| Light variant | #A8B5F5 | Black text ✓ |
| Dark variant | #3D4DB0 | White text ✓ |

This palette works well for:
- Tech/SaaS products (professional, trustworthy)
- Creative apps (energetic yet sophisticated)
- Dark mode interfaces (the primary pops beautifully)

---

## Reference: Color Psychology

| Color Family | Associations | Best For |
|--------------|--------------|----------|
| Blue | Trust, calm, professional | Finance, healthcare, tech |
| Purple | Luxury, creativity, wisdom | Beauty, premium, creative |
| Green | Growth, nature, health | Wellness, eco, finance |
| Orange | Energy, warmth, enthusiasm | Food, fitness, entertainment |
| Red | Passion, urgency, excitement | Sales, gaming, food |
| Yellow | Optimism, clarity, warmth | Kids, food, attention |

---

*This skill is automatically applied when Claude detects color-related palette requests.*
