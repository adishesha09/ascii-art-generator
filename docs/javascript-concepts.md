# JavaScript Concepts in ASCII-Vision 95

This document explains the key JavaScript concepts, patterns, and techniques used throughout the ASCII art generator project.

> **Note:** The code examples reference the original structure. The codebase is now modularized - see [Module Architecture](module-architecture.md) for the current organization.

## Table of Contents

1. [DOM Manipulation](#dom-manipulation)
2. [Event Handling](#event-handling)
3. [Canvas API](#canvas-api)
4. [Array Methods](#array-methods)
5. [Closures and Scope](#closures-and-scope)
6. [Object Literals](#object-literals)
7. [Guard Clauses](#guard-clauses)
8. [Async Operations](#async-operations)
9. [Modern ES6+ Features](#modern-es6-features)

---

## DOM Manipulation

### Selecting Elements

The project uses `getElementById()` for direct element access:

```javascript
const fileInput = document.getElementById("fileInput");
const asciiOutput = document.getElementById("ascii");
```

**Why this approach?** 
- Direct and performant for unique elements
- Clear and readable
- Type-safe when elements exist

### Creating Elements Dynamically

```javascript
const canvas = document.createElement("canvas");
const span = document.createElement("span");
```

**Use case:** Creating preview canvases and colored ASCII output elements on-the-fly.

### Modifying Element Properties

```javascript
originalPreview.src = img.src;
originalPreview.style.display = "block";
asciiOutput.textContent = ascii;
```

**Key concepts:**
- Direct property assignment
- Style manipulation
- Content updates

---

## Event Handling

### Standard Event Listeners

```javascript
fileInput.addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (!file) return;
  loadImage(file);
});
```

**Concepts demonstrated:**
- Event listener registration
- Event object access
- Inline anonymous functions
- Guard clause pattern

### Input Events for Real-Time Updates

```javascript
widthSlider.addEventListener("input", function() {
  widthValue.textContent = this.value;
});
```

**Why "input" vs "change"?**
- `input` fires during dragging (real-time)
- `change` fires only after release

### Drag and Drop Events

```javascript
document.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.stopPropagation();
});

document.addEventListener("drop", (e) => {
  e.preventDefault();
  e.stopPropagation();
  const files = e.dataTransfer.files;
  // Process files
});
```

**Key techniques:**
- Preventing default browser behavior
- Accessing dropped files via `dataTransfer`
- Event propagation control

---

## Canvas API

### Creating and Setting Up Canvas

```javascript
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = outputWidth;
canvas.height = currentImage.height * scale;
```

**Canvas basics:**
- Dynamic canvas creation
- 2D rendering context
- Dimension configuration

### Drawing Images

```javascript
ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
```

**Parameters:**
1. Image source
2. X position (0)
3. Y position (0)
4. Target width
5. Target height

### Pixel Manipulation

```javascript
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const data = imageData.data; // RGBA array

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];     // Red
  const g = data[i + 1]; // Green
  const b = data[i + 2]; // Blue
  const a = data[i + 3]; // Alpha
}
```

**ImageData structure:**
- Flat Uint8ClampedArray
- 4 values per pixel (RGBA)
- Values from 0-255
- Loop by +4 to process each pixel

### Putting Data Back

```javascript
ctx.putImageData(imageData, 0, 0);
```

---

## Array Methods

### Map Method

```javascript
const maxLineLength = Math.max(...lines.map(line => line.length));
```

**What it does:**
- Transforms each line into its length
- Returns new array of lengths
- Original array unchanged

### Spread Operator with Arrays

```javascript
Math.max(...arrayOfNumbers)
```

**Why spread?**
- `Math.max()` expects individual arguments, not an array
- Spreads array elements as separate arguments
- Elegant syntax vs `apply()`

### ForEach for Side Effects

```javascript
lines.forEach((line, index) => {
  ctx.fillText(line, 20, 20 + index * lineHeight);
});
```

**When to use forEach:**
- Performing actions (side effects)
- Not creating new array
- When index is needed

---

## Closures and Scope

### Closure in Event Handlers

```javascript
function makeResizable(windowElement) {
  const resizers = document.createElement("div");
  
  resizer.addEventListener("mousedown", (e) => {
    // This function "closes over" windowElement
    const startWidth = parseInt(
      document.defaultView.getComputedStyle(windowElement).width, 10
    );
    
    const doResize = (e) => {
      // This nested function also has access to windowElement and startWidth
      windowElement.style.width = Math.max(400, startWidth + dx) + "px";
    };
  });
}
```

**Closure benefits:**
- Functions remember their creation environment
- Access to outer variables
- Data privacy

### Module Pattern with IIFE (Implicit)

```javascript
// In main.js - State variables at module level
const AppState = {
  currentImage: null,
  currentAscii: "",
  isInverted: false,
  settings: { /* ... */ }
};

// Functions can access this state
function handleRender() {
  if (!AppState.currentImage) return;
  // Use AppState.currentImage
}
```

**Pattern:**
- Module-level state encapsulation
- Functions form a closure over module state
- Exported via `window.App` for controlled access
- See [Module Architecture](module-architecture.md) for details

---

## Object Literals

### Configuration Objects

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

**Usage:**
```javascript
const selectedCharSet = charSets[charSetSelect.value];
```

**Benefits:**
- Clean data organization
- Easy to extend
- Readable and maintainable

### Object Property Access

```javascript
// Dot notation
charSets.medium

// Bracket notation (dynamic)
charSets[charSetSelect.value]
```

---

## Guard Clauses

### Early Return Pattern

```javascript
function renderASCII() {
  // Guard clause
  if (!currentImage) return;
  
  // Main logic only runs if guard passes
  const outputWidth = parseInt(widthSlider.value);
  // ... rest of function
}
```

**Benefits:**
- Reduces nesting
- Makes requirements explicit
- Improves readability
- Fail-fast approach

### Multiple Guards

```javascript
function loadImage(file) {
  const img = new Image();
  
  img.onload = () => {
    currentImage = img;
    // success logic
  };
  
  img.onerror = () => {
    console.log("Error loading image");
    // guard against bad loads
  };
}
```

---

## Async Operations

### Promises with Clipboard API

```javascript
navigator.clipboard.writeText(currentAscii)
  .then(() => {
    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied';
    setTimeout(() => {
      copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
    }, 2000);
  })
  .catch((err) => {
    console.error("Failed to copy: ", err);
  });
```

**Promise chain:**
1. Attempt async operation
2. Handle success with `.then()`
3. Handle error with `.catch()`
4. Provide user feedback

### File Reading with Image.onload

```javascript
const img = new Image();
img.src = URL.createObjectURL(file);

img.onload = () => {
  currentImage = img;
  // Image is ready
};
```

**Callback pattern:**
- Image loading is asynchronous
- `onload` fires when complete
- Prevents rendering before image ready

### SetInterval for Clock

```javascript
function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  clock.textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);
updateClock(); // Call immediately first time
```

---

## Modern ES6+ Features

### Arrow Functions

```javascript
// Traditional function
widthSlider.addEventListener("input", function() {
  widthValue.textContent = this.value;
});

// Arrow function
colorData.forEach((row) => {
  // Process row
});
```

**When to use each:**
- Regular functions: When you need `this` binding
- Arrow functions: Callbacks, array methods, no `this` needed

### Template Literals

```javascript
fileInfo.textContent = `${file.name} (${img.width}×${img.height})`;
ctx.fillStyle = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
```

**Advantages:**
- Cleaner string interpolation
- Multi-line strings
- Expression embedding

### Destructuring

```javascript
const {char, r, g, b} = pixel;
// Instead of:
// const char = pixel.char;
// const r = pixel.r;
// etc.
```

### Const and Let

```javascript
const fileInput = document.getElementById("fileInput"); // Won't reassign
let currentImage = null; // Will reassign
```

**Best practice:**
- Use `const` by default
- Use `let` only when reassigning
- Never use `var`

### String Methods

```javascript
const hours = now.getHours().toString().padStart(2, "0");
```

**padStart():**
- Ensures minimum length
- Pads from the left
- "9" becomes "09"

---

## Key Takeaways

1. **DOM manipulation** is central to web interactivity
2. **Event handling** connects user actions to code
3. **Canvas API** enables pixel-level image processing
4. **Closures** provide data privacy and state management
5. **Guard clauses** make code more readable and robust
6. **Modern ES6+** features improve code clarity
7. **Async operations** require careful handling with promises/callbacks

These concepts work together to create a responsive, functional web application.