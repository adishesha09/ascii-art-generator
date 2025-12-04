# Code Architecture

This document explains the overall structure, design patterns, and architectural decisions in the ASCII-Vision 95 project.

> **Note:** The JavaScript codebase has been modularized into separate files. For detailed information about the module structure, see [Module Architecture](module-architecture.md).

## Table of Contents

1. [Project Structure](#project-structure)
2. [Design Patterns](#design-patterns)
3. [Module Organization](#module-organization)
4. [State Management](#state-management)
5. [Event Flow](#event-flow)
6. [Rendering Pipeline](#rendering-pipeline)
7. [Best Practices](#best-practices)

---

## Project Structure

### File Organization

```
ascii-art-generator/
├── index.html              # Main HTML structure
├── README.md               # Project documentation
├── robots.txt              # Search engine directives
├── sitemap.xml             # Site structure for SEO
├── assets/
│   ├── images/             # Image assets (if any)
│   ├── scripts/
│   │   ├── boot.js                # Initial boot sequence
│   │   ├── image-processor.js     # Image manipulation utilities
│   │   ├── ascii-converter.js     # ASCII conversion logic
│   │   ├── window-manager.js      # Window drag/resize/maximize
│   │   ├── ui-controls.js         # UI event handlers
│   │   └── main.js                # Application entry point
│   └── stylesheets/
│       ├── base.css        # CSS reset and base styles
│       ├── boot.css        # Boot screen styles
│       ├── components.css  # Reusable component styles
│       ├── controls.css    # Form control styles
│       ├── output.css      # ASCII output area styles
│       ├── responsive.css  # Media queries
│       ├── style.css       # Main stylesheet (imports others)
│       ├── taskbar.css     # Windows 95 taskbar styles
│       └── windows.css     # Window system styles
└── docs/                   # Technical documentation
    ├── README.md
    ├── javascript-concepts.md
    ├── ascii-conversion-algorithm.md
    ├── mathematical-foundations.md
    └── code-architecture.md (this file)
```

### Separation of Concerns

**HTML (Structure)**
- Semantic markup
- Accessibility attributes
- Minimal inline styles

**CSS (Presentation)**
- Modular stylesheets
- Component-based organization
- Windows 95 theme implementation

**JavaScript (Behavior)**
- DOM manipulation
- Event handling
- Business logic
- Image processing

---

## Design Patterns

### 1. Module Pattern (Implicit)

The application uses the module pattern through script-level scope:

```javascript
// Private state (module scope)
let currentImage = null;
let currentAscii = "";
let isInverted = false;

// Public interface (global functions)
function loadImage(file) { /* ... */ }
function renderASCII() { /* ... */ }
```

**Benefits:**
- Encapsulation
- Namespace protection
- Clear API boundaries

### 2. Observer Pattern (Event Listeners)

UI changes trigger updates through event listeners:

```javascript
widthSlider.addEventListener("input", function() {
  widthValue.textContent = this.value;
});

renderBtn.addEventListener("click", function() {
  if (currentImage) {
    renderASCII();
  }
});
```

**Benefits:**
- Loose coupling
- Reactive updates
- Easy to extend

### 3. Strategy Pattern (Character Sets)

Different ASCII rendering strategies:

```javascript
const charSets = {
  dense: ["@", "#", "$", /* ... */],
  medium: ["#", "$", "%", /* ... */],
  light: ["▓", "▒", "░", /* ... */],
  // ... more strategies
};

const selectedCharSet = charSets[charSetSelect.value];
```

**Benefits:**
- Easy to add new character sets
- Runtime strategy selection
- Clean configuration

### 4. Factory Pattern (Element Creation)

Dynamic element creation:

```javascript
function createMenuDropdown(items) {
  const dropdown = document.createElement("div");
  dropdown.className = "menu-dropdown";
  
  items.forEach((item) => {
    if (item.label === "---") {
      const separator = document.createElement("div");
      separator.className = "menu-separator";
      dropdown.appendChild(separator);
    } else {
      const menuItem = document.createElement("div");
      menuItem.className = "menu-dropdown-item";
      menuItem.textContent = item.label;
      menuItem.addEventListener("click", () => {
        item.action();
        closeAllDropdowns();
      });
      dropdown.appendChild(menuItem);
    }
  });
  
  return dropdown;
}
```

**Benefits:**
- Centralized creation logic
- Consistent structure
- Reusability

### 5. Command Pattern (Menu Actions)

Menu items encapsulate actions:

```javascript
const dropdown = createMenuDropdown([
  { label: "Open Image...", action: () => fileInput.click() },
  { label: "Load Sample", action: () => sampleBtn.click() },
  { label: "Save ASCII Art", action: () => downloadBtn.click() },
]);
```

**Benefits:**
- Decoupled from UI
- Testable actions
- Easy to extend

### 6. Guard Clause Pattern

Early returns for validation:

```javascript
function renderASCII() {
  if (!currentImage) return; // Guard clause
  
  // Main logic only if valid
  const outputWidth = parseInt(widthSlider.value);
  // ...
}
```

**Benefits:**
- Reduced nesting
- Clear preconditions
- Better readability

---

## Module Organization

### Physical Module Structure

The codebase is now organized into separate JavaScript modules:

#### 1. **image-processor.js** - Image Manipulation
```javascript
window.ImageProcessor = {
  loadImageFromFile(file),
  createSampleImage(),
  applyBrightnessContrast(ctx, width, height, brightness, contrast),
  clamp(value)
};
```

#### 2. **ascii-converter.js** - Core Conversion Logic
```javascript
window.ASCIIConverter = {
  charSets,
  convertImageToASCII(image, options),
  renderColoredASCII(outputElement, colorData),
  getPlaceholderASCII()
};
```

#### 3. **window-manager.js** - Window System
```javascript
window.WindowManager = {
  setupWindowControls(windowElement, callbacks),
  toggleMaximize(windowElement),
  makeDraggable(windowElement),
  makeResizable(windowElement),
  initializeWindow(windowElement, options)
};
```

#### 4. **ui-controls.js** - User Interface
```javascript
window.UIControls = {
  initializeClock(),
  setupFileControls(callbacks),
  setupSliderControls(callbacks),
  setupActionButtons(callbacks),
  setupMenus(callbacks),
  setupTaskbar(),
  setupDesktopIcons()
};
```

#### 5. **main.js** - Application Coordinator
```javascript
window.App = {
  state: AppState,
  resetSettings()
};
// Initializes all modules and manages application state
```

For complete details, see [Module Architecture](module-architecture.md).

---

## State Management

### Application State

```javascript
// Image state
let currentImage = null;    // Currently loaded image
let currentAscii = "";      // Generated ASCII output

// UI state
let isInverted = false;     // Inversion toggle
let isMaximized = false;    // Window maximize state
let isMinimized = false;    // Window minimize state

// Interaction state
let isDragging = false;     // Window dragging
let isResizing = false;     // Window resizing
let currentWindow = null;   // Active window reference
```

### State Flow

```
User Action → Event → Update State → Update UI
```

**Example:**
```
Click "Invert" → Click Event → isInverted = !isInverted → renderASCII() → Update Display
```

### Single Source of Truth

- **currentImage**: Master reference for image data
- **currentAscii**: Master reference for ASCII output
- UI always reflects state, never the reverse

---

## Event Flow

### Event Delegation Pattern

For dynamically created elements:

```javascript
document.addEventListener("click", (e) => {
  if (!e.target.closest(".menu-dropdown") && 
      !e.target.closest(".menu-item")) {
    closeAllDropdowns();
  }
});
```

### Event Propagation Control

```javascript
menuItems[0].addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent bubbling to document
  // Show dropdown
});
```

### Custom Event Chains

```javascript
// Load → Process → Render chain
loadImage(file) → img.onload → currentImage = img → (manual) renderASCII()
```

---

## Rendering Pipeline

### Pipeline Stages

```
1. Input Validation
   ↓
2. Settings Extraction
   ↓
3. Canvas Creation
   ↓
4. Image Scaling
   ↓
5. Brightness/Contrast Adjustment
   ↓
6. Pixel Data Extraction
   ↓
7. ASCII Conversion (per pixel)
   ↓
8. Output Rendering (monochrome or color)
   ↓
9. UI Update (preview, buttons, etc.)
```

### Rendering Modes

**Monochrome:**
```javascript
asciiOutput.textContent = ascii;
```
- Simple text content
- Single color
- Fast rendering

**Color:**
```javascript
colorData.forEach((row) => {
  const lineDiv = document.createElement("div");
  row.forEach((pixel) => {
    const span = document.createElement("span");
    span.textContent = pixel.char;
    span.style.color = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
    lineDiv.appendChild(span);
  });
  asciiOutput.appendChild(lineDiv);
});
```
- HTML structure
- Individual character styling
- More complex, slower

### Performance Optimization

1. **Batch DOM updates**: Build full structure before inserting
2. **Reuse canvases**: Don't create unnecessarily
3. **Avoid layout thrashing**: Read all, then write all
4. **Debounce/throttle**: Not implemented, but could be for sliders

---

## Best Practices

### 1. Defensive Programming

```javascript
// Guard clauses
if (!currentImage) return;
if (!file) return;

// Safe defaults
const brightness = parseInt(brightnessSlider.value) || 0;

// Clamping
function clamp(value) {
  return Math.max(0, Math.min(255, value));
}
```

### 2. Clear Function Names

```javascript
function loadImage(file) { /* ... */ }           // Does what it says
function renderASCII() { /* ... */ }              // Clear purpose
function applyBrightnessContrast() { /* ... */ }  // Descriptive
```

### 3. Single Responsibility

Each function does one thing:
- `loadImage()`: Only loads
- `renderASCII()`: Only renders
- `applyBrightnessContrast()`: Only adjusts image

### 4. Consistent Naming

```javascript
// Getters
const ctx = canvas.getContext("2d");

// Boolean prefixes
let isInverted = false;
let isDragging = false;

// Event handlers
fileInput.addEventListener("change", /* ... */);
```

### 5. Comments Where Needed

```javascript
// Calculate brightness (taken from luminosity method provided by Claude Sonnet 4.5)
const brightnessValue = r * 0.299 + g * 0.587 + b * 0.114;

// Contrast factor
const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
```

### 6. Error Handling

```javascript
img.onerror = () => {
  console.log("Error loading image");
};

navigator.clipboard.writeText(currentAscii)
  .catch((err) => {
    console.error("Failed to copy: ", err);
  });
```

### 7. User Feedback

```javascript
copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied';
setTimeout(() => {
  copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
}, 2000);
```

---

## Code Quality Checklist

- ✓ Consistent indentation (2 spaces)
- ✓ Meaningful variable names
- ✓ Functions < 50 lines (mostly)
- ✓ Guard clauses for validation
- ✓ Comments for complex logic
- ✓ Error handling for async operations
- ✓ Event listener cleanup (could be improved)
- ✓ No global namespace pollution
- ✓ DRY principle followed
- ✓ Separation of concerns

---

## Future Improvements

### Completed Refactorings

1. ✅ **Split into modules:** (COMPLETED)
   - `image-processor.js`
   - `ascii-converter.js`
   - `window-manager.js`
   - `ui-controls.js`
   - `main.js`
   
   See [Module Architecture](module-architecture.md) for details.

### Potential Future Refactorings

1. **Use classes for organization:**
   ```javascript
   class ASCIIConverter {
     constructor() { /* ... */ }
     loadImage(file) { /* ... */ }
     render() { /* ... */ }
   }
   ```

3. **Implement pub/sub for events:**
   ```javascript
   EventBus.publish('image:loaded', image);
   EventBus.subscribe('image:loaded', (image) => { /* ... */ });
   ```

4. **Add unit tests:**
   ```javascript
   test('clamp function keeps values in range', () => {
     expect(clamp(300)).toBe(255);
     expect(clamp(-10)).toBe(0);
   });
   ```

5. **Use a build system:**
   - Webpack or Vite
   - Minification
   - Tree shaking
   - Code splitting

---

## Summary

The ASCII-Vision 95 architecture demonstrates:

- **Clear separation** of concerns (HTML/CSS/JS)
- **Modular design** through logical code organization
- **Multiple design patterns** working together
- **Single-page application** structure
- **Event-driven** programming model
- **Functional programming** style with some OOP concepts
- **Progressive enhancement** approach

The codebase is maintainable, extensible, and follows modern JavaScript best practices while maintaining simplicity appropriate for its scope.
