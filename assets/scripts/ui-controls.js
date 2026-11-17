/**
 * UI Controls Module
 * Handles user interface interactions: file upload, buttons, sliders, menus, export
 */

/**
 * Initializes clock in taskbar
 */
function initializeClock() {
  const clock = document.getElementById("clock");
  if (!clock) return;

  function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    clock.textContent = `${hours}:${minutes}:${seconds}`;
  }

  setInterval(updateClock, 1000);
  updateClock();
}

/**
 * Sets up file input controls
 * @param {Object} callbacks - Callback functions for file operations
 */
function setupFileControls(callbacks) {
  const fileInput = document.getElementById("fileInput");
  const fileInfo = document.getElementById("fileInfo");
  const sampleBtn = document.getElementById("sampleBtn");

  if (fileInput) {
    fileInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const image = await window.ImageProcessor.loadImageFromFile(file);
        if (callbacks.onImageLoad) {
          callbacks.onImageLoad(image, file);
        }
        if (fileInfo) {
          fileInfo.textContent = `${file.name} (${image.width}×${image.height})`;
        }
      } catch (error) {
        console.error("Error loading image:", error);
      }
    });
  }

  if (sampleBtn) {
    sampleBtn.addEventListener("click", async () => {
      try {
        const image = await window.ImageProcessor.createSampleImage();
        if (callbacks.onImageLoad) {
          callbacks.onImageLoad(image, { name: "sample.png" });
        }
        if (fileInfo) {
          fileInfo.textContent = `sample.png (${image.width}×${image.height})`;
        }
      } catch (error) {
        console.error("Error creating sample:", error);
      }
    });
  }

  // Drag and drop support
  document.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  document.addEventListener("drop", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;

    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        try {
          const image = await window.ImageProcessor.loadImageFromFile(file);
          if (callbacks.onImageLoad) {
            callbacks.onImageLoad(image, file);
          }
          if (fileInfo) {
            fileInfo.textContent = `${file.name} (${image.width}×${image.height})`;
          }
        } catch (error) {
          console.error("Error loading dropped image:", error);
        }
      } else {
        console.log("Please drop an image file");
      }
    }
  });
}

/**
 * Sets up slider controls
 * @param {Object} callbacks - Callback functions for slider changes
 */
function setupSliderControls(callbacks) {
  const widthSlider = document.getElementById("widthSlider");
  const widthValue = document.getElementById("widthValue");
  const brightnessSlider = document.getElementById("brightnessSlider");
  const brightnessValue = document.getElementById("brightnessValue");
  const contrastSlider = document.getElementById("contrastSlider");
  const contrastValue = document.getElementById("contrastValue");

  if (widthSlider && widthValue) {
    widthSlider.addEventListener("input", function () {
      widthValue.textContent = this.value;
      if (callbacks.onWidthChange) {
        callbacks.onWidthChange(parseInt(this.value));
      }
    });
  }

  if (brightnessSlider && brightnessValue) {
    brightnessSlider.addEventListener("input", function () {
      brightnessValue.textContent = this.value;
      if (callbacks.onBrightnessChange) {
        callbacks.onBrightnessChange(parseInt(this.value));
      }
    });
  }

  if (contrastSlider && contrastValue) {
    contrastSlider.addEventListener("input", function () {
      contrastValue.textContent = this.value;
      if (callbacks.onContrastChange) {
        callbacks.onContrastChange(parseInt(this.value));
      }
    });
  }
}

/**
 * Sets up action buttons (render, copy, download, etc.)
 * @param {Object} callbacks - Callback functions for button actions
 */
function setupActionButtons(callbacks) {
  const renderBtn = document.getElementById("renderBtn");
  const copyBtn = document.getElementById("copyBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const savePngBtn = document.getElementById("savePngBtn");
  const invertBtn = document.getElementById("invertBtn");
  const clearBtn = document.getElementById("clearBtn");

  if (renderBtn) {
    renderBtn.addEventListener("click", () => {
      if (callbacks.onRender) callbacks.onRender();
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      if (callbacks.onCopy) callbacks.onCopy(copyBtn);
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      if (callbacks.onDownload) callbacks.onDownload(downloadBtn);
    });
  }

  if (savePngBtn) {
    savePngBtn.addEventListener("click", () => {
      if (callbacks.onSavePng) callbacks.onSavePng(savePngBtn);
    });
  }

  if (invertBtn) {
    invertBtn.addEventListener("click", () => {
      if (callbacks.onInvert) callbacks.onInvert(invertBtn);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (callbacks.onClear) callbacks.onClear();
    });
  }
}

/**
 * Sets up menu system
 * @param {Object} callbacks - Callback functions for menu actions
 */
function setupMenus(callbacks) {
  const menuItems = document.querySelectorAll(".menu-item");

  // File menu
  if (menuItems[0]) {
    menuItems[0].addEventListener("click", (e) => {
      e.stopPropagation();
      const dropdown = createMenuDropdown([
        {
          label: "Open Image...",
          action: () => document.getElementById("fileInput")?.click(),
        },
        {
          label: "Load Sample",
          action: () => document.getElementById("sampleBtn")?.click(),
        },
        { label: "---" },
        {
          label: "Save ASCII Art",
          action: () => document.getElementById("downloadBtn")?.click(),
        },
        { label: "---" },
        {
          label: "Exit",
          action: () => {
            const mainWindow = document.getElementById("mainWindow");
            if (mainWindow) mainWindow.style.display = "none";
          },
        },
      ]);
      showDropdown(menuItems[0], dropdown);
    });
  }

  // Edit menu
  if (menuItems[1]) {
    menuItems[1].addEventListener("click", (e) => {
      e.stopPropagation();
      const dropdown = createMenuDropdown([
        {
          label: "Copy ASCII",
          action: () => document.getElementById("copyBtn")?.click(),
        },
        {
          label: "Clear Output",
          action: () => document.getElementById("clearBtn")?.click(),
        },
        { label: "---" },
        {
          label: "Invert Colors",
          action: () => document.getElementById("invertBtn")?.click(),
        },
      ]);
      showDropdown(menuItems[1], dropdown);
    });
  }

  // View menu
  if (menuItems[2]) {
    menuItems[2].addEventListener("click", (e) => {
      e.stopPropagation();
      const dropdown = createMenuDropdown([
        {
          label: "Maximize Window",
          action: () => {
            const mainWindow = document.getElementById("mainWindow");
            if (mainWindow) window.WindowManager.toggleMaximize(mainWindow);
          },
        },
        { label: "---" },
        {
          label: "Show Preview",
          action: () => alert("Preview panels are always visible"),
        },
        { label: "Toggle CRT Effect", action: toggleCRT },
      ]);
      showDropdown(menuItems[2], dropdown);
    });
  }

  // Options menu
  if (menuItems[3]) {
    menuItems[3].addEventListener("click", (e) => {
      e.stopPropagation();
      const dropdown = createMenuDropdown([
        {
          label: "Character Sets",
          action: () => document.getElementById("charSet")?.focus(),
        },
        {
          label: "Brightness/Contrast",
          action: () => document.getElementById("brightnessSlider")?.focus(),
        },
        { label: "---" },
        {
          label: "Reset All Settings",
          action: () => callbacks.onResetSettings?.(),
        },
      ]);
      showDropdown(menuItems[3], dropdown);
    });
  }

  // Help menu
  if (menuItems[4]) {
    menuItems[4].addEventListener("click", (e) => {
      e.stopPropagation();
      const dropdown = createMenuDropdown([
        {
          label: "View README",
          action: () => {
            const readme = document.getElementById("readmeWindow");
            if (readme) readme.style.display = "block";
          },
        },
        { label: "---" },
        { label: "About ASCII-Vision 95", action: showAbout },
        {
          label: "Visit Spectra Studios",
          action: () => window.open("https://spectrastudios.co.za", "_blank"),
        },
      ]);
      showDropdown(menuItems[4], dropdown);
    });
  }
}

/**
 * Creates a dropdown menu
 * @param {Array} items - Menu items with label and action
 * @returns {HTMLElement} Dropdown element
 */
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

/**
 * Shows a dropdown menu
 * @param {HTMLElement} menuItem - The menu item that triggered the dropdown
 * @param {HTMLElement} dropdown - The dropdown element to show
 */
function showDropdown(menuItem, dropdown) {
  closeAllDropdowns();

  const rect = menuItem.getBoundingClientRect();
  dropdown.style.position = "absolute";
  dropdown.style.top = rect.bottom + "px";
  dropdown.style.left = rect.left + "px";
  document.body.appendChild(dropdown);

  setTimeout(() => {
    document.addEventListener(
      "click",
      (e) => {
        if (
          !e.target.closest(".menu-dropdown") &&
          !e.target.closest(".menu-item")
        ) {
          closeAllDropdowns();
        }
      },
      { once: true }
    );
  }, 10);
}

/**
 * Closes all open dropdown menus
 */
function closeAllDropdowns() {
  document.querySelectorAll(".menu-dropdown").forEach((d) => d.remove());
}

/**
 * Toggles CRT effect
 */
function toggleCRT() {
  const crt = document.querySelector(".crt-effect");
  if (crt) {
    crt.style.display = crt.style.display === "none" ? "block" : "none";
  }
}

/**
 * Shows about dialog
 */
function showAbout() {
  const aboutMsg = `ASCII-Vision 95

A retro-styled ASCII art generator inspired by Windows 95.

Developed by: Adishesha Nandkoomar
Studio: Spectra Studios
Website: spectrastudios.co.za

© 2025 Spectra Studios. All rights reserved.`;

  alert(aboutMsg);
}

/**
 * Sets up taskbar functionality
 */
function setupTaskbar() {
  const taskbarItems = document.querySelectorAll(".taskbar-item");

  if (taskbarItems[0]) {
    taskbarItems[0].addEventListener("click", () => {
      const mainWindow = document.getElementById("mainWindow");
      if (mainWindow) {
        mainWindow.style.display = "block";
      }
    });
  }

  if (taskbarItems[1]) {
    taskbarItems[1].addEventListener("click", () => {
      const readmeWindow = document.getElementById("readmeWindow");
      if (readmeWindow) {
        readmeWindow.style.display = "block";
      }
    });
  }
}

/**
 * Sets up desktop icons
 */
function setupDesktopIcons() {
  // These are already set up via onclick in HTML
  // Exposing functions globally for HTML onclick handlers
  window.openReadme = function () {
    const readmeWindow = document.getElementById("readmeWindow");
    if (readmeWindow) readmeWindow.style.display = "block";
  };

  window.closeReadme = function () {
    const readmeWindow = document.getElementById("readmeWindow");
    if (readmeWindow) readmeWindow.style.display = "none";
  };

  window.openMainWindow = function () {
    const mainWindow = document.getElementById("mainWindow");
    if (mainWindow) mainWindow.style.display = "block";
  };
}

// Export functions for use in other modules
window.UIControls = {
  initializeClock,
  setupFileControls,
  setupSliderControls,
  setupActionButtons,
  setupMenus,
  setupTaskbar,
  setupDesktopIcons,
};