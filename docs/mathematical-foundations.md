# Mathematical Foundations

This document explains the mathematical concepts and formulas used in the ASCII art generator for image processing and conversion.

## Table of Contents

1. [Brightness Calculation](#brightness-calculation)
2. [Contrast Adjustment](#contrast-adjustment)
3. [Brightness Adjustment](#brightness-adjustment)
4. [Normalization](#normalization)
5. [Character Mapping Math](#character-mapping-math)
6. [Color Space Conversions](#color-space-conversions)

---

## Brightness Calculation

### The Luminosity Method

**Formula:**
```
L = 0.299R + 0.587G + 0.114B
```

Where:
- `L` = Luminosity (perceived brightness)
- `R` = Red channel value (0-255)
- `G` = Green channel value (0-255)
- `B` = Blue channel value (0-255)

**Code implementation:**
```javascript
const brightnessValue = r * 0.299 + g * 0.587 + b * 0.114;
```

### Why These Coefficients?

The human eye doesn't perceive all colors equally:

| Color | Weight | Reason |
|-------|--------|--------|
| Green | 0.587 | Eyes are most sensitive to green |
| Red | 0.299 | Medium sensitivity |
| Blue | 0.114 | Least sensitive to blue |

**Total:** 0.299 + 0.587 + 0.114 = 1.000 (weighted average)

### Standard Reference

These weights come from the **ITU-R BT.601** standard, used in:
- Television broadcasting
- Video processing
- Image compression (JPEG, MPEG)

### Alternative Methods (Not Used)

**Average Method:**
```
L = (R + G + B) / 3
```
❌ Doesn't match human perception

**Lightness Method:**
```
L = (max(R, G, B) + min(R, G, B)) / 2
```
❌ Less accurate for grayscale conversion

### Mathematical Proof

Why weighted average is better:

```
Color: Pure Green (0, 255, 0)

Average method: (0 + 255 + 0) / 3 = 85
Luminosity method: 0×0.299 + 255×0.587 + 0×0.114 = 149.685

Human perception: Green appears very bright ✓ (Luminosity is correct)
```

---

## Contrast Adjustment

### The Formula

**Contrast factor:**
```
f = (259 × (C + 255)) / (255 × (259 - C))
```

Where:
- `f` = Contrast multiplication factor
- `C` = Contrast adjustment value (-50 to +50)

**Pixel adjustment:**
```
P' = f × (P - 128) + 128
```

Where:
- `P` = Original pixel value (0-255)
- `P'` = Adjusted pixel value (0-255)
- `128` = Midpoint (gray)

**Code implementation:**
```javascript
const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));

for (let i = 0; i < data.length; i += 4) {
  data[i] = clamp(contrastFactor * (data[i] - 128) + 128);     // Red
  data[i + 1] = clamp(contrastFactor * (data[i + 1] - 128) + 128); // Green
  data[i + 2] = clamp(contrastFactor * (data[i + 2] - 128) + 128); // Blue
}
```

### How It Works

1. **Subtract 128**: Center the range around zero
   - Bright values (>128) become positive
   - Dark values (<128) become negative

2. **Multiply by factor**: Scale the distance from midpoint
   - Factor > 1: Increases distance (more contrast)
   - Factor < 1: Decreases distance (less contrast)

3. **Add 128 back**: Return to 0-255 range

4. **Clamp**: Ensure values stay within 0-255

### Example Calculations

**Increase contrast (C = +25):**
```
f = (259 × (25 + 255)) / (255 × (259 - 25))
f = (259 × 280) / (255 × 234)
f = 72,520 / 59,670
f ≈ 1.216

Dark pixel (P = 50):
P' = 1.216 × (50 - 128) + 128
P' = 1.216 × (-78) + 128
P' = -94.848 + 128
P' = 33.152 ≈ 33 (darker)

Bright pixel (P = 200):
P' = 1.216 × (200 - 128) + 128
P' = 1.216 × 72 + 128
P' = 87.552 + 128
P' = 215.552 ≈ 216 (brighter)
```

**Decrease contrast (C = -25):**
```
f = (259 × (-25 + 255)) / (255 × (259 - (-25)))
f = (259 × 230) / (255 × 284)
f = 59,570 / 72,420
f ≈ 0.823

Dark pixel (P = 50):
P' = 0.823 × (50 - 128) + 128
P' = 0.823 × (-78) + 128
P' = -64.194 + 128
P' = 63.806 ≈ 64 (lighter)

Bright pixel (P = 200):
P' = 0.823 × (200 - 128) + 128
P' = 0.823 × 72 + 128
P' = 59.256 + 128
P' = 187.256 ≈ 187 (darker)
```

**Result:** Distance from midpoint (128) changes, but midpoint stays at 128.

### Visual Representation

```
Original:     [0 --- 50 --- 128 --- 200 --- 255]
                     ↑              ↑

High contrast: [0 --- 33 --- 128 --- 216 --- 255]
                     ↑              ↑
                   (darker)      (brighter)

Low contrast:  [0 --- 64 --- 128 --- 187 --- 255]
                     ↑              ↑
                   (lighter)     (darker)
```

---

## Brightness Adjustment

### The Formula

**Simple addition:**
```
P' = P + B
```

Where:
- `P` = Original pixel value (0-255)
- `B` = Brightness adjustment (-50 to +50)
- `P'` = Adjusted pixel value (clamped to 0-255)

**Code implementation:**
```javascript
data[i] = clamp(data[i] + brightness);       // Red
data[i + 1] = clamp(data[i + 1] + brightness); // Green
data[i + 2] = clamp(data[i + 2] + brightness); // Blue

function clamp(value) {
  return Math.max(0, Math.min(255, value));
}
```

### Why Simple Addition?

Brightness is a **uniform shift** of all values:
- Add to all pixels equally
- Maintains relative differences
- Intuitive and fast

### Example Calculations

**Increase brightness (B = +30):**
```
Dark pixel: 50 + 30 = 80
Mid pixel: 128 + 30 = 158
Bright pixel: 200 + 30 = 230
Very bright: 240 + 30 = 270 → clamped to 255
```

**Decrease brightness (B = -30):**
```
Dark pixel: 50 - 30 = 20
Mid pixel: 128 - 30 = 98
Bright pixel: 200 - 30 = 170
Very dark: 10 - 30 = -20 → clamped to 0
```

### Clamping Function

**Mathematical definition:**
```
clamp(x) = min(max(x, 0), 255)
         = { 0    if x < 0
           { x    if 0 ≤ x ≤ 255
           { 255  if x > 255
```

**Why needed:**
- RGB values must be 0-255
- Adding/subtracting can overflow
- Prevents invalid values

---

## Normalization

### Purpose

Convert brightness from 0-255 range to 0-1 range for character mapping.

### Formula

```
N = L / 255
```

Where:
- `N` = Normalized brightness (0.0 to 1.0)
- `L` = Luminosity value (0 to 255)

**Code implementation:**
```javascript
let normalizedBrightness = brightnessValue / 255;
```

### Why Normalize?

1. **Standard range**: 0.0 (black) to 1.0 (white)
2. **Independent of color depth**: Works with any bit depth
3. **Easier math**: Percentages and ratios are clearer
4. **Character mapping**: Multiply by array length

### Example Conversions

| Luminosity | Normalized | Perception |
|------------|------------|------------|
| 0 | 0.000 | Pure black |
| 64 | 0.251 | Dark gray |
| 128 | 0.502 | Medium gray |
| 191 | 0.749 | Light gray |
| 255 | 1.000 | Pure white |

---

## Character Mapping Math

### Index Calculation

**Formula:**
```
i = floor(N × (n - 1))
```

Where:
- `i` = Character index (0 to n-1)
- `N` = Normalized brightness (0.0 to 1.0)
- `n` = Number of characters in set
- `floor()` = Round down to integer

**Code implementation:**
```javascript
const charIndex = Math.floor(
  normalizedBrightness * (selectedCharSet.length - 1)
);
const char = selectedCharSet[charIndex];
```

### Why `(n - 1)`?

**Array indexing:**
- 9 characters → indices 0-8
- Without `-1`: brightness 1.0 gives index 9 (out of bounds)
- With `-1`: brightness 1.0 gives index 8 (last character)

### Mathematical Proof

For character set with n=9 characters:

```
Brightness = 0.0:
i = floor(0.0 × 8) = floor(0.0) = 0 ✓

Brightness = 0.5:
i = floor(0.5 × 8) = floor(4.0) = 4 ✓

Brightness = 1.0:
i = floor(1.0 × 8) = floor(8.0) = 8 ✓ (last index)

WITHOUT (n-1):
Brightness = 1.0:
i = floor(1.0 × 9) = floor(9.0) = 9 ✗ (out of bounds)
```

### Distribution Analysis

For 9 characters, brightness ranges map to:

| Brightness Range | Index | Character | Percentage |
|-----------------|-------|-----------|------------|
| 0.000 - 0.124 | 0 | # | 12.5% |
| 0.125 - 0.249 | 1 | $ | 12.5% |
| 0.250 - 0.374 | 2 | % | 12.5% |
| 0.375 - 0.499 | 3 | * | 12.5% |
| 0.500 - 0.624 | 4 | + | 12.5% |
| 0.625 - 0.749 | 5 | - | 12.5% |
| 0.750 - 0.874 | 6 | : | 12.5% |
| 0.875 - 0.999 | 7 | . | 12.5% |
| 1.000 | 8 | (space) | edge case |

**Equal distribution** across brightness spectrum.

### Floor Function Importance

```javascript
Math.floor(4.9) = 4
Math.round(4.9) = 5
Math.ceil(4.9) = 5
```

**Why floor?**
- Consistent boundaries
- No rounding errors
- Predictable mapping

---

## Color Space Conversions

### RGB to Grayscale

**Already covered:** Luminosity method is the primary conversion.

### RGB Color Preservation

In color mode, we keep original RGB:

```javascript
if (isColorMode) {
  row.push({ char, r, g, b });
}
```

**Later rendered as:**
```javascript
span.style.color = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
```

**No conversion needed** - RGB stays RGB.

### Inversion Formula

**Mathematical operation:**
```
N' = 1 - N
```

Where:
- `N` = Original normalized brightness
- `N'` = Inverted normalized brightness

**Effect:**
```
0.0 → 1.0 (black becomes white)
0.2 → 0.8 (dark becomes light)
0.5 → 0.5 (gray stays gray)
0.8 → 0.2 (light becomes dark)
1.0 → 0.0 (white becomes black)
```

**Code implementation:**
```javascript
if (isInverted) {
  normalizedBrightness = 1 - normalizedBrightness;
}
```

---

## Scaling Mathematics

### Aspect Ratio Preservation

**Formula:**
```
scale = targetWidth / originalWidth
scaledHeight = originalHeight × scale
```

**Example:**
```
Original: 800×600
Target width: 80

scale = 80 / 800 = 0.1
scaledHeight = 600 × 0.1 = 60

Result: 80×60
```

**Code implementation:**
```javascript
const scale = outputWidth / currentImage.width;
canvas.height = currentImage.height * scale;
```

### Pixel Position Calculation

**2D to 1D index:**
```
i = (y × width + x) × 4
```

**Why × 4?** RGBA = 4 values per pixel

**Example:**
```
Pixel at (3, 2) in 80-wide image:
i = (2 × 80 + 3) × 4
i = (160 + 3) × 4
i = 163 × 4
i = 652

Access:
R = data[652]
G = data[653]
B = data[654]
A = data[655]
```

---

## Summary of Key Formulas

| Concept | Formula | Purpose |
|---------|---------|---------|
| Luminosity | `L = 0.299R + 0.587G + 0.114B` | Perceptual brightness |
| Contrast Factor | `f = (259(C + 255)) / (255(259 - C))` | Calculate multiplier |
| Contrast Adjust | `P' = f(P - 128) + 128` | Apply contrast |
| Brightness Adjust | `P' = clamp(P + B)` | Shift brightness |
| Normalization | `N = L / 255` | Convert to 0-1 range |
| Character Index | `i = floor(N × (n - 1))` | Map to character |
| Inversion | `N' = 1 - N` | Flip brightness |
| Clamp | `clamp(x) = min(max(x, 0), 255)` | Keep in valid range |
| Pixel Index | `i = (y × w + x) × 4` | Locate in array |

---

## References

- **ITU-R BT.601**: Standard for digital video and RGB-to-YCbCr conversion
- **Photometric Luminance**: Human vision color perception research
- **Digital Image Processing** by Gonzalez & Woods: Standard textbook for image processing algorithms
