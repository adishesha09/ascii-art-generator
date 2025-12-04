# ASCII Conversion Algorithm

This document provides a complete breakdown of how the ASCII-Vision 95 application converts images into ASCII art, including both monochrome and colored output.

## Table of Contents

1. [Algorithm Overview](#algorithm-overview)
2. [Step-by-Step Process](#step-by-step-process)
3. [Core Conversion Logic](#core-conversion-logic)
4. [Character Mapping](#character-mapping)
5. [Color Mode](#color-mode)
6. [Complete Code Walkthrough](#complete-code-walkthrough)

---

## Algorithm Overview

### High-Level Flow

```
Image File → Load → Scale → Adjust → Extract Pixels → Map to Characters → Render Output
```

### Key Steps

1. **Load Image**: Convert file to Image object
2. **Scale**: Resize to target output width
3. **Adjust**: Apply brightness/contrast modifications
4. **Extract Pixels**: Get RGB values for each pixel
5. **Calculate Brightness**: Convert RGB to grayscale brightness
6. **Map to Character**: Select character based on brightness
7. **Render**: Display as text or colored HTML

---

## Step-by-Step Process

### Step 1: Load and Scale Image

```javascript
function loadImage(file) {
  const img = new Image();
  img.src = URL.createObjectURL(file);
  
  img.onload = () => {
    currentImage = img;
    // Image is ready for processing
  };
}
```

**What happens:**
- Browser creates object URL from file
- Image loads asynchronously
- Stored for later processing

### Step 2: Create Processing Canvas

```javascript
const canvas = document.createElement("canvas");
const scale = outputWidth / currentImage.width;
canvas.width = outputWidth;
canvas.height = currentImage.height * scale;

const ctx = canvas.getContext("2d");
ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
```

**Purpose:**
- Resize image to target ASCII width
- Maintain aspect ratio
- Prepare for pixel extraction

**Example:**
- Original image: 800×600
- Output width: 80 characters
- Scale: 80/800 = 0.1
- Canvas: 80×60

### Step 3: Apply Brightness and Contrast

```javascript
function applyBrightnessContrast(ctx, width, height, brightness, contrast) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  
  for (let i = 0; i < data.length; i += 4) {
    // Apply brightness (simple addition)
    data[i] = clamp(data[i] + brightness);       // Red
    data[i + 1] = clamp(data[i + 1] + brightness); // Green
    data[i + 2] = clamp(data[i + 2] + brightness); // Blue
    
    // Apply contrast (scale from midpoint)
    data[i] = clamp(contrastFactor * (data[i] - 128) + 128);
    data[i + 1] = clamp(contrastFactor * (data[i + 1] - 128) + 128);
    data[i + 2] = clamp(contrastFactor * (data[i + 2] - 128) + 128);
  }
  
  ctx.putImageData(imageData, 0, 0);
}

function clamp(value) {
  return Math.max(0, Math.min(255, value));
}
```

**See [Mathematical Foundations](mathematical-foundations.md) for the math behind this.**

### Step 4: Extract Pixel Data

```javascript
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const data = imageData.data;
```

**Data structure:**
```
[R, G, B, A, R, G, B, A, R, G, B, A, ...]
 ↑  ↑  ↑  ↑  ← Pixel 1
          ↑  ↑  ↑  ↑  ← Pixel 2
                  ↑  ↑  ↑  ↑  ← Pixel 3
```

- Flat array of all pixels
- 4 values per pixel (RGBA)
- Row-by-row, left-to-right

### Step 5: Process Each Pixel

```javascript
for (let y = 0; y < canvas.height; y++) {
  for (let x = 0; x < canvas.width; x++) {
    // Calculate index in flat array
    const i = (y * canvas.width + x) * 4;
    
    // Extract RGB values
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Calculate brightness
    const brightnessValue = r * 0.299 + g * 0.587 + b * 0.114;
    
    // Normalize to 0-1 range
    let normalizedBrightness = brightnessValue / 255;
    
    // Apply inversion if enabled
    if (isInverted) {
      normalizedBrightness = 1 - normalizedBrightness;
    }
    
    // Map to character
    const charIndex = Math.floor(
      normalizedBrightness * (selectedCharSet.length - 1)
    );
    const char = selectedCharSet[charIndex];
    
    ascii += char;
  }
  ascii += "\n"; // Newline at end of row
}
```

**Index calculation:**
```
i = (y * width + x) * 4

Example: Pixel at (2, 1) in 80-wide image
i = (1 * 80 + 2) * 4
i = 82 * 4
i = 328
```

---

## Core Conversion Logic

### Brightness Calculation (Luminosity Method)

```javascript
const brightnessValue = r * 0.299 + g * 0.587 + b * 0.114;
```

**Why these weights?**
- Human eye is more sensitive to green
- Less sensitive to blue
- Red is in the middle
- These are ITU-R BT.601 standard weights

**Example:**
```
RGB: (100, 150, 50)
Brightness = 100×0.299 + 150×0.587 + 50×0.114
          = 29.9 + 88.05 + 5.7
          = 123.65
```

### Normalization

```javascript
let normalizedBrightness = brightnessValue / 255;
```

**Result:** Value from 0.0 (black) to 1.0 (white)

### Character Index Mapping

```javascript
const charIndex = Math.floor(
  normalizedBrightness * (selectedCharSet.length - 1)
);
```

**Example with Medium character set (9 characters):**
```javascript
// Character set: ["#", "$", "%", "*", "+", "-", ":", ".", " "]
// Length: 9, so indices 0-8

// Dark pixel (brightness = 0.1)
charIndex = Math.floor(0.1 * 8) = Math.floor(0.8) = 0 → "#"

// Mid pixel (brightness = 0.5)
charIndex = Math.floor(0.5 * 8) = Math.floor(4.0) = 4 → "+"

// Bright pixel (brightness = 0.9)
charIndex = Math.floor(0.9 * 8) = Math.floor(7.2) = 7 → "."

// White pixel (brightness = 1.0)
charIndex = Math.floor(1.0 * 8) = Math.floor(8.0) = 8 → " "
```

**Why `length - 1`?**
- Array indices are 0-based
- 9 characters → indices 0-8
- Without `-1`, we'd get index 9 (out of bounds)

---

## Character Mapping

### Character Set Design

```javascript
const charSets = {
  dense: ["@", "#", "$", "%", "&", "*", "+", "-", ":", ".", " "],
  medium: ["#", "$", "%", "*", "+", "-", ":", ".", " "],
  light: ["▓", "▒", "░", ":", ".", " "],
  blocks: ["█", "▄", "▌", "▐", "·", " "],
  simple: ["@", "*", ".", " "],
  retro: ["║", "═", "╔", "╗", "╚", "╝", " ", " "],
};
```

**Ordering principle:**
- First character: Darkest/densest
- Last character: Lightest (usually space)
- Progressive density decrease

**Visual density:**
```
@ = Very dense (darkest)
# = Dense
$ = Medium-dense
% = Medium
* = Medium-light
+ = Light
- = Very light
. = Minimal
  = Empty (white)
```

### Inversion

```javascript
if (isInverted) {
  normalizedBrightness = 1 - normalizedBrightness;
}
```

**Effect:**
- 0.0 becomes 1.0 (black → white)
- 1.0 becomes 0.0 (white → black)
- Creates negative image effect

---

## Color Mode

### Monochrome Output

```javascript
asciiOutput.textContent = ascii;
```

**Result:** Plain text, single color

### Colored Output

```javascript
function renderColoredASCII(colorData) {
  asciiOutput.innerHTML = "";
  
  colorData.forEach((row) => {
    const lineDiv = document.createElement("div");
    lineDiv.style.lineHeight = "1";
    lineDiv.style.height = "1em";
    
    row.forEach((pixel) => {
      const span = document.createElement("span");
      span.textContent = pixel.char;
      span.style.color = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
      lineDiv.appendChild(span);
    });
    
    asciiOutput.appendChild(lineDiv);
  });
}
```

**Structure:**
```html
<div> <!-- Row 1 -->
  <span style="color: rgb(100, 50, 30)">@</span>
  <span style="color: rgb(120, 60, 40)">#</span>
  <!-- ... -->
</div>
<div> <!-- Row 2 -->
  <!-- ... -->
</div>
```

### Color Data Storage

```javascript
for (let x = 0; x < canvas.width; x++) {
  const i = (y * canvas.width + x) * 4;
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  
  const char = /* ... calculated char ... */;
  
  if (isColorMode) {
    row.push({ char, r, g, b });
  }
}
```

**Each pixel stores:**
- `char`: The ASCII character
- `r`, `g`, `b`: Original color values

---

## Complete Code Walkthrough

### Full renderASCII() Function

```javascript
function renderASCII() {
  // ===== STEP 1: VALIDATION =====
  if (!currentImage) return;
  
  // ===== STEP 2: GET SETTINGS =====
  const outputWidth = parseInt(widthSlider.value);
  const brightness = parseInt(brightnessSlider.value);
  const contrast = parseInt(contrastSlider.value);
  const selectedCharSet = charSets[charSetSelect.value];
  const isColorMode = colorMode.value === "color";
  
  // ===== STEP 3: CREATE CANVAS =====
  const canvas = document.createElement("canvas");
  const scale = outputWidth / currentImage.width;
  canvas.width = outputWidth;
  canvas.height = currentImage.height * scale;
  
  const ctx = canvas.getContext("2d");
  ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
  
  // ===== STEP 4: ADJUST IMAGE =====
  if (brightness !== 0 || contrast !== 0) {
    applyBrightnessContrast(ctx, canvas.width, canvas.height, brightness, contrast);
  }
  
  // ===== STEP 5: UPDATE PREVIEW =====
  processedPreview.width = canvas.width;
  processedPreview.height = canvas.height;
  processedPreview.getContext("2d").drawImage(canvas, 0, 0);
  
  // ===== STEP 6: GET PIXEL DATA =====
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // ===== STEP 7: CONVERT TO ASCII =====
  let ascii = "";
  let colorData = [];
  
  for (let y = 0; y < canvas.height; y++) {
    let row = [];
    
    for (let x = 0; x < canvas.width; x++) {
      // Get pixel position
      const i = (y * canvas.width + x) * 4;
      
      // Extract colors
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Calculate brightness (luminosity method)
      const brightnessValue = r * 0.299 + g * 0.587 + b * 0.114;
      
      // Normalize to 0-1
      let normalizedBrightness = brightnessValue / 255;
      
      // Apply inversion
      if (isInverted) {
        normalizedBrightness = 1 - normalizedBrightness;
      }
      
      // Map to character index
      const charIndex = Math.floor(
        normalizedBrightness * (selectedCharSet.length - 1)
      );
      const char = selectedCharSet[charIndex];
      
      // Add to output
      ascii += char;
      
      // Store color data if in color mode
      if (isColorMode) {
        row.push({ char, r, g, b });
      }
    }
    
    // Newline at end of row
    ascii += "\n";
    
    if (isColorMode) {
      colorData.push(row);
    }
  }
  
  // ===== STEP 8: RENDER OUTPUT =====
  currentAscii = ascii;
  
  if (isColorMode) {
    renderColoredASCII(colorData);
  } else {
    asciiOutput.innerHTML = "";
    asciiOutput.textContent = ascii;
  }
}
```

---

## Algorithm Complexity

### Time Complexity

```
O(w × h)
```

Where:
- `w` = output width (40-120 characters)
- `h` = output height (proportional to input image)

**For typical 80×60 output:**
- 4,800 pixels to process
- Very fast on modern hardware

### Space Complexity

```
O(w × h)
```

**Memory usage:**
- ImageData array: `w × h × 4` bytes
- ASCII string: `w × h` characters
- Color data (if enabled): `w × h × 16` bytes (4 properties × 4 bytes)

---

## Performance Considerations

1. **Canvas reuse**: Create canvas once per render, not per pixel
2. **Batch DOM updates**: Build full HTML structure before inserting
3. **Typed arrays**: ImageData uses efficient Uint8ClampedArray
4. **Integer math**: Use integers where possible for speed

---

## Summary

The ASCII conversion algorithm:

1. **Scales** image to target width
2. **Adjusts** brightness and contrast
3. **Extracts** pixel RGB values
4. **Calculates** perceptual brightness using weighted formula
5. **Maps** brightness to character index
6. **Renders** as monochrome text or colored HTML

The core insight: **Characters are arranged by visual density, and each pixel's brightness determines which character to use.**
