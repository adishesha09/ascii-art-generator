/**
 * Main Application Entry Point
 * Coordinates all modules and manages application state
 */

// Application state
const AppState = {
  currentImage: null,
  currentAscii: "",
  isInverted: false,
  settings: {
    outputWidth: 80,
    brightness: 0,
    contrast: 0,
    charSetKey: "medium",
    colorMode: "monochrome",
    colorPalette: "original",
  },
};
/**
 * Initializes the entire application
 */
function initializeApp() {
  // Initialize UI components
  window.UIControls.initializeClock();
  window.UIControls.setupTaskbar();
  window.UIControls.setupDesktopIcons();

  // Initialize windows
  const mainWindow = document.getElementById("mainWindow");
  const readmeWindow = document.getElementById("readmeWindow");

  if (mainWindow) {
    window.WindowManager.initializeWindow(mainWindow, {
      callbacks: {
        onMinimize: (win) => {
          win.style.display = "none";
        },
        onMaximize: (win) => {
          window.WindowManager.toggleMaximize(win);
        },
        onClose: (win) => {
          win.style.display = "none";
        },
      },
    });
  }

  if (readmeWindow) {
    window.WindowManager.initializeWindow(readmeWindow, {
      callbacks: {
        onClose: (win) => {
          win.style.display = "none";
        },
      },
    });
  }

  // Setup file controls
  window.UIControls.setupFileControls({
    onImageLoad: handleImageLoad,
  });

  // Setup sliders
  window.UIControls.setupSliderControls({
    onWidthChange: (value) => {
      AppState.settings.outputWidth = value;
    },
    onBrightnessChange: (value) => {
      AppState.settings.brightness = value;
    },
    onContrastChange: (value) => {
      AppState.settings.contrast = value;
    },
  });

  // Setup action buttons
  window.UIControls.setupActionButtons({
    onRender: handleRender,
    onCopy: handleCopy,
    onDownload: handleDownload,
    onSavePng: handleSavePng,
    onInvert: handleInvert,
    onClear: handleClear,
  });

  // Setup menus
  window.UIControls.setupMenus({
    onResetSettings: resetSettings,
  });

  // Setup character set and color mode selectors
  const charSetSelect = document.getElementById("charSet");
  const colorModeSelect = document.getElementById("colorMode");
  const colorPaletteSelect = document.getElementById("colorPalette");
  const paletteGroup = document.getElementById("paletteGroup");

  if (charSetSelect) {
    charSetSelect.addEventListener("change", (e) => {
      AppState.settings.charSetKey = e.target.value;
    });
  }

  if (colorModeSelect) {
    colorModeSelect.addEventListener("change", (e) => {
      AppState.settings.colorMode = e.target.value;
      // Show/hide palette selector based on color mode
      if (paletteGroup) {
        paletteGroup.style.display =
          e.target.value === "color" ? "block" : "none";
      }
    });
  }

  if (colorPaletteSelect) {
    colorPaletteSelect.addEventListener("change", (e) => {
      AppState.settings.colorPalette = e.target.value;
    });
  }
}

/**
 * Handles image loading
 * @param {HTMLImageElement} image - The loaded image
 * @param {Object} file - File information
 */
function handleImageLoad(image, file) {
  AppState.currentImage = image;

  // Update preview
  const originalPreview = document.getElementById("originalPreview");
  if (originalPreview) {
    originalPreview.src = image.src;
    originalPreview.style.display = "block";
  }

  // Don't auto-render - let user click Render ASCII button
  // handleRender();
}

/**
 * Handles ASCII rendering
 */
function handleRender() {
  if (!AppState.currentImage) {
    console.log("Please upload an image first.");
    return;
  }

  const isColorMode = AppState.settings.colorMode === "color";

  // Convert image to ASCII
  const result = window.ASCIIConverter.convertImageToASCII(
    AppState.currentImage,
    {
      outputWidth: AppState.settings.outputWidth,
      brightness: AppState.settings.brightness,
      contrast: AppState.settings.contrast,
      charSetKey: AppState.settings.charSetKey,
      isColorMode: isColorMode,
      isInverted: AppState.isInverted,
      colorPalette: AppState.settings.colorPalette,
    }
  );

  AppState.currentAscii = result.ascii;

  // Update processed preview
  const processedPreview = document.getElementById("processedPreview");
  if (processedPreview && result.processedCanvas) {
    processedPreview.width = result.processedCanvas.width;
    processedPreview.height = result.processedCanvas.height;
    processedPreview.getContext("2d").drawImage(result.processedCanvas, 0, 0);
  }

  // Update output
  const asciiOutput = document.getElementById("ascii");
  if (asciiOutput) {
    if (isColorMode && result.colorData) {
      window.ASCIIConverter.renderColoredASCII(asciiOutput, result.colorData);
    } else {
      asciiOutput.innerHTML = "";
      asciiOutput.textContent = result.ascii;
    }
  }
}

/**
 * Handles copy to clipboard
 * @param {HTMLElement} button - The copy button
 */
function handleCopy(button) {
  if (!AppState.currentAscii) {
    console.log("No ASCII art to copy");
    return;
  }

  navigator.clipboard
    .writeText(AppState.currentAscii)
    .then(() => {
      const originalHTML = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check"></i> Copied';
      setTimeout(() => {
        button.innerHTML = originalHTML;
      }, 2000);
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
}

/**
 * Handles download as text file
 * @param {HTMLElement} button - The download button
 */
function handleDownload(button) {
  if (!AppState.currentAscii) {
    console.log("No ASCII art to download");
    return;
  }

  const blob = new Blob([AppState.currentAscii], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ascii-art.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Visual feedback
  const originalHTML = button.innerHTML;
  button.innerHTML = '<i class="fas fa-check"></i> Downloaded';
  setTimeout(() => {
    button.innerHTML = originalHTML;
  }, 2000);
}

/**
 * Handles save as PNG
 * @param {HTMLElement} button - The save PNG button
 */
function handleSavePng(button) {
  if (!AppState.currentAscii) {
    console.log("No ASCII art to save as PNG");
    return;
  }

  const isColorMode = AppState.settings.colorMode === "color";
  const asciiOutput = document.getElementById("ascii");

  // Create canvas for PNG export
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const lines = AppState.currentAscii.split("\n");
  const maxLineLength = Math.max(...lines.map((line) => line.length));

  // Use square-ish aspect ratio for better appearance
  // Monospace fonts typically have ~0.6 width-to-height ratio
  const baseFontSize = 10;
  const baseCharWidth = baseFontSize * 0.6; // 6px
  const baseLineHeight = baseFontSize; // 10px - much tighter, closer to square
  const padding = 100;

  // Natural content dimensions
  const naturalWidth = maxLineLength * baseCharWidth + padding;
  const naturalHeight = lines.length * baseLineHeight + padding;

  // Set tighter bounds for more compact images
  const minDimension = 600;
  const maxDimension = 1200; // Reduced from 1600

  // Calculate aspect ratio
  const aspectRatio = naturalWidth / naturalHeight;

  // Determine final dimensions
  let finalWidth, finalHeight;

  // Apply bounds intelligently
  if (naturalWidth > maxDimension || naturalHeight > maxDimension) {
    // Scale down proportionally
    if (naturalWidth > naturalHeight) {
      finalWidth = Math.min(naturalWidth, maxDimension);
      finalHeight = Math.round(finalWidth / aspectRatio);
    } else {
      finalHeight = Math.min(naturalHeight, maxDimension);
      finalWidth = Math.round(finalHeight * aspectRatio);
    }
  } else if (naturalWidth < minDimension && naturalHeight < minDimension) {
    // Scale up proportionally
    if (naturalWidth > naturalHeight) {
      finalWidth = minDimension;
      finalHeight = Math.round(finalWidth / aspectRatio);
    } else {
      finalHeight = minDimension;
      finalWidth = Math.round(finalHeight * aspectRatio);
    }
  } else {
    // Use natural dimensions
    finalWidth = Math.round(naturalWidth);
    finalHeight = Math.round(naturalHeight);
  }

  canvas.width = finalWidth;
  canvas.height = finalHeight;

  // Calculate font size to fit the final canvas
  const availableWidth = finalWidth - padding;
  const availableHeight = finalHeight - padding;

  const charWidthRatio = 0.6;

  const maxFontSizeByWidth = Math.floor(
    availableWidth / maxLineLength / charWidthRatio
  );
  const maxFontSizeByHeight = Math.floor(availableHeight / lines.length);

  const fontSize = Math.max(
    6,
    Math.min(maxFontSizeByWidth, maxFontSizeByHeight, 12)
  );
  const adjustedLineHeight = fontSize; // 1:1 ratio for tighter spacing
  const adjustedCharWidth = fontSize * charWidthRatio;

  // Draw background (black for both modes)
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Set text style
  ctx.font = `${fontSize}px "Courier New", monospace`;
  ctx.textBaseline = "top";

  // Center the ASCII art on canvas
  const totalTextWidth = maxLineLength * adjustedCharWidth;
  const totalTextHeight = lines.length * adjustedLineHeight;
  const startX = (canvas.width - totalTextWidth) / 2;
  const startY = (canvas.height - totalTextHeight) / 2;

  if (isColorMode) {
    // Render colored ASCII from the DOM
    const rows = asciiOutput.children;

    for (let y = 0; y < rows.length; y++) {
      const row = rows[y];
      const spans = row.children;
      let xOffset = 0;

      for (let x = 0; x < spans.length; x++) {
        const span = spans[x];
        const char = span.textContent;
        const color = span.style.color;

        ctx.fillStyle = color;
        ctx.fillText(char, startX + xOffset, startY + y * adjustedLineHeight);
        xOffset += adjustedCharWidth;
      }
    }
  } else {
    // Monochrome with green terminal style
    ctx.fillStyle = "#00ff00";
    ctx.shadowColor = "#00ff00";
    ctx.shadowBlur = 2;

    // Draw each line of ASCII art
    lines.forEach((line, index) => {
      ctx.fillText(line, startX, startY + index * adjustedLineHeight);
    });
  }

  // Convert canvas to blob and download
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ascii-art.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Visual feedback
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Saved';
    setTimeout(() => {
      button.innerHTML = originalHTML;
    }, 2000);
  });
}

/**
 * Handles color inversion toggle
 * @param {HTMLElement} button - The invert button
 */
function handleInvert(button) {
  AppState.isInverted = !AppState.isInverted;
  button.innerHTML = AppState.isInverted
    ? '<i class="fas fa-adjust fa-flip-horizontal"></i> Invert'
    : '<i class="fas fa-adjust"></i> Revert';

  if (AppState.currentImage) {
    handleRender();
  }
}

/**
 * Handles clearing the output
 */
function handleClear() {
  AppState.currentImage = null;
  AppState.currentAscii = "";

  const asciiOutput = document.getElementById("ascii");
  if (asciiOutput) {
    asciiOutput.textContent = window.ASCIIConverter.getPlaceholderASCII();
  }

  const originalPreview = document.getElementById("originalPreview");
  if (originalPreview) {
    originalPreview.src = "";
    originalPreview.style.display = "none";
  }

  const processedPreview = document.getElementById("processedPreview");
  if (processedPreview) {
    const ctx = processedPreview.getContext("2d");
    ctx.clearRect(0, 0, processedPreview.width, processedPreview.height);
  }

  const fileInfo = document.getElementById("fileInfo");
  if (fileInfo) {
    fileInfo.textContent = "No file selected";
  }

  const fileInput = document.getElementById("fileInput");
  if (fileInput) {
    fileInput.value = "";
  }
}

/**
 * Resets all settings to defaults
 */
function resetSettings() {
  AppState.settings = {
    outputWidth: 80,
    brightness: 0,
    contrast: 0,
    charSetKey: "medium",
    colorMode: "monochrome",
    colorPalette: "original",
  };

  AppState.isInverted = false;

  // Update UI
  const widthSlider = document.getElementById("widthSlider");
  const widthValue = document.getElementById("widthValue");
  const brightnessSlider = document.getElementById("brightnessSlider");
  const brightnessValue = document.getElementById("brightnessValue");
  const contrastSlider = document.getElementById("contrastSlider");
  const contrastValue = document.getElementById("contrastValue");
  const charSetSelect = document.getElementById("charSet");
  const colorModeSelect = document.getElementById("colorMode");
  const colorPaletteSelect = document.getElementById("colorPalette");
  const paletteGroup = document.getElementById("paletteGroup");
  const invertBtn = document.getElementById("invertBtn");

  if (widthSlider) widthSlider.value = 80;
  if (widthValue) widthValue.textContent = "80";
  if (brightnessSlider) brightnessSlider.value = 0;
  if (brightnessValue) brightnessValue.textContent = "0";
  if (contrastSlider) contrastSlider.value = 0;
  if (contrastValue) contrastValue.textContent = "0";
  if (charSetSelect) charSetSelect.value = "medium";
  if (colorModeSelect) colorModeSelect.value = "monochrome";
  if (colorPaletteSelect) colorPaletteSelect.value = "original";
  if (paletteGroup) paletteGroup.style.display = "none";
  if (invertBtn) {
    invertBtn.innerHTML =
      '<i class="fas fa-adjust fa-flip-horizontal"></i> Invert';
  }

  console.log("Settings reset to defaults");
}

// Initialize app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}

// Export for debugging purposes
window.App = {
  state: AppState,
  resetSettings,
};