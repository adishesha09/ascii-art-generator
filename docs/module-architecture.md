# JavaScript Module Structure

The JavaScript code has been modularized for better maintainability and educational purposes. Each module has a specific responsibility:

## Module Overview

```
assets/scripts/
├── boot.js                  # Boot screen animation (unchanged)
├── image-processor.js       # Image manipulation utilities
├── ascii-converter.js       # Core ASCII conversion logic
├── window-manager.js        # Window drag/resize/maximize
├── ui-controls.js          # UI event handlers and controls
└── main.js                 # Application entry point & state management
```

## Module Descriptions

### 1. **image-processor.js**
**Purpose:** Handles all image manipulation operations

**Exports:**
- `loadImageFromFile(file)` - Loads an image from a File object
- `createSampleImage()` - Generates demo image
- `applyBrightnessContrast(ctx, width, height, brightness, contrast)` - Image adjustments
- `clamp(value)` - Utility for clamping pixel values

**Used by:** ascii-converter.js, main.js

---

### 2. **ascii-converter.js**
**Purpose:** Core ASCII art generation logic

**Exports:**
- `charSets` - Object containing all character set definitions
- `convertImageToASCII(image, options)` - Main conversion function
- `renderColoredASCII(outputElement, colorData)` - Renders colored HTML output
- `getPlaceholderASCII()` - Returns default placeholder text

**Dependencies:** image-processor.js (for brightness/contrast)

**Used by:** main.js

---

### 3. **window-manager.js**
**Purpose:** Handles all Windows 95-style window interactions

**Exports:**
- `setupWindowControls(windowElement, callbacks)` - Initialize min/max/close buttons
- `toggleMaximize(windowElement)` - Toggle maximize state
- `makeDraggable(windowElement)` - Enable window dragging
- `makeResizable(windowElement)` - Add resize handles
- `initializeWindow(windowElement, options)` - Setup everything at once

**Used by:** main.js

---

### 4. **ui-controls.js**
**Purpose:** All user interface event handlers and interactions

**Exports:**
- `initializeClock()` - Setup taskbar clock
- `setupFileControls(callbacks)` - File upload and drag-drop
- `setupSliderControls(callbacks)` - Brightness/contrast/width sliders
- `setupActionButtons(callbacks)` - Render/copy/download buttons
- `setupMenus(callbacks)` - Menu system
- `setupTaskbar()` - Taskbar interactions
- `setupDesktopIcons()` - Desktop icon handlers

**Used by:** main.js

---

### 5. **main.js**
**Purpose:** Application entry point, coordinates all modules

**Responsibilities:**
- Manages application state (current image, settings, etc.)
- Initializes all modules in correct order
- Handles business logic (render, export, etc.)
- Coordinates communication between modules

**Exports:**
- `App.state` - Access to application state (for debugging)
- `App.resetSettings()` - Reset to defaults

---

## How Modules Communicate

All modules export their functionality to the `window` object for simplicity:

```javascript
// In image-processor.js
window.ImageProcessor = { ... }

// In main.js
const image = await window.ImageProcessor.loadImageFromFile(file);
```

This approach:
- ✅ No build step required
- ✅ Works with simple `<script>` tags
- ✅ Easy to understand for beginners
- ✅ Maintains single-file deployment simplicity

## Loading Order (Critical!)

Modules must be loaded in dependency order in `index.html`:

```html
<script src="/assets/scripts/boot.js"></script>
<script src="/assets/scripts/image-processor.js"></script>     <!-- No dependencies -->
<script src="/assets/scripts/ascii-converter.js"></script>     <!-- Needs image-processor -->
<script src="/assets/scripts/window-manager.js"></script>      <!-- No dependencies -->
<script src="/assets/scripts/ui-controls.js"></script>         <!-- No dependencies -->
<script src="/assets/scripts/main.js"></script>                <!-- Needs all others -->
```

## Benefits of This Structure

### For Maintenance
- **Separation of Concerns:** Each file has a single, clear purpose
- **Easier Debugging:** Know exactly where to look for issues
- **Reduced Complexity:** Smaller files are easier to understand
- **Better Testing:** Can test modules in isolation

### For Learning
- **Clear Examples:** Each module demonstrates specific concepts
  - `image-processor.js` → Canvas API & pixel manipulation
  - `ascii-converter.js` → Algorithms & data transformation
  - `window-manager.js` → DOM manipulation & event handling
  - `ui-controls.js` → Event delegation & callbacks
  - `main.js` → State management & coordination

### For Extension
- **Add New Features:** Modify only relevant module
- **Replace Components:** Swap out individual modules
- **Reuse Code:** Import modules in other projects

## Common Tasks

### Adding a New Character Set
**File:** `ascii-converter.js`
```javascript
const charSets = {
  // Add your new set here
  mySet: ["█", "▓", "▒", "░", " "],
  // ... existing sets
};
```

### Adding a New Export Format
**File:** `main.js` - Add new handler function
**File:** `ui-controls.js` - Add button setup

### Modifying Window Behavior
**File:** `window-manager.js` - Update relevant functions

### Adding New Menu Items
**File:** `ui-controls.js` - Modify `setupMenus()` function

## Migration from Original script.js

The original `script.js` (~600 lines) has been split into:
- `image-processor.js` (~130 lines)
- `ascii-converter.js` (~170 lines)
- `window-manager.js` (~200 lines)
- `ui-controls.js` (~310 lines)
- `main.js` (~380 lines)

**Total:** ~1190 lines (includes extensive documentation comments)

The original `script.js` file can be kept as backup or removed.

## Debugging

Access application state from browser console:
```javascript
// View current state
console.log(App.state);

// Check current image
console.log(App.state.currentImage);

// View settings
console.log(App.state.settings);

// Reset settings
App.resetSettings();
```

## Future Improvements

Possible next steps for further modularization:
1. **Export Module:** Separate PNG/TXT export logic
2. **Settings Module:** Centralize all settings management
3. **Menu Builder:** Generic menu creation utility
4. **Event Bus:** Decouple module communication

---

Built with educational purposes in mind by Spectra Studios.