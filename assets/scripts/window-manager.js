/**
 * Window Manager Module
 * Handles window dragging, resizing, maximize/minimize, and controls
 */

// State variables
let isDragging = false;
let isResizing = false;
let currentWindow = null;
let offsetX, offsetY;
let startX, startY, startWidth, startHeight;

/**
 * Sets up window control buttons (minimize, maximize, close)
 * @param {HTMLElement} windowElement - The window element
 * @param {Object} callbacks - Callback functions for window actions
 */
function setupWindowControls(windowElement, callbacks = {}) {
  const windowBtns = windowElement.querySelectorAll(".window-btn");

  // Minimize button
  if (windowBtns[0]) {
    windowBtns[0].addEventListener("click", () => {
      if (callbacks.onMinimize) {
        callbacks.onMinimize(windowElement);
      } else {
        windowElement.style.display = "none";
      }
    });
  }

  // Maximize/Restore button
  if (windowBtns[1]) {
    windowBtns[1].addEventListener("click", () => {
      if (callbacks.onMaximize) {
        callbacks.onMaximize(windowElement);
      } else {
        toggleMaximize(windowElement);
      }
    });
  }

  // Close button
  if (windowBtns[2]) {
    windowBtns[2].addEventListener("click", () => {
      if (callbacks.onClose) {
        callbacks.onClose(windowElement);
      } else {
        windowElement.style.display = "none";
      }
    });
  }

  // Double-click header to maximize/restore
  const header = windowElement.querySelector(".window-header");
  if (header) {
    header.addEventListener("dblclick", (e) => {
      if (!e.target.classList.contains("window-btn")) {
        if (callbacks.onMaximize) {
          callbacks.onMaximize(windowElement);
        } else {
          toggleMaximize(windowElement);
        }
      }
    });
  }
}

/**
 * Toggles window maximize/restore state
 * @param {HTMLElement} windowElement - The window to toggle
 */
function toggleMaximize(windowElement) {
  const isMaximized = windowElement.classList.contains("maximized");

  if (!isMaximized) {
    // Save current state
    windowElement.dataset.prevWidth = windowElement.style.width || "";
    windowElement.dataset.prevHeight = windowElement.style.height || "";
    windowElement.dataset.prevTop = windowElement.style.top || "";
    windowElement.dataset.prevLeft = windowElement.style.left || "";
    windowElement.dataset.prevMaxWidth = windowElement.style.maxWidth || "";

    // Maximize
    windowElement.style.width = "100%";
    windowElement.style.height = "calc(100vh - 40px)";
    windowElement.style.top = "0";
    windowElement.style.left = "0";
    windowElement.style.maxWidth = "100%";
    windowElement.classList.add("maximized");
  } else {
    // Restore
    windowElement.style.width = windowElement.dataset.prevWidth;
    windowElement.style.height = windowElement.dataset.prevHeight;
    windowElement.style.top = windowElement.dataset.prevTop;
    windowElement.style.left = windowElement.dataset.prevLeft;
    windowElement.style.maxWidth = windowElement.dataset.prevMaxWidth;
    windowElement.classList.remove("maximized");
  }
}

/**
 * Makes a window draggable
 * @param {HTMLElement} windowElement - The window element to make draggable
 */
function makeDraggable(windowElement) {
  const header = windowElement.querySelector(".window-header");
  if (!header) return;

  // Disable dragging only on mobile/tablet screens
  const isMobile = window.matchMedia("(max-width: 900px)").matches;

  if (isMobile) {
    return; // Skip dragging setup on mobile
  }

  header.addEventListener("mousedown", (e) => {
    // Don't drag if clicking buttons or if maximized
    if (
      e.target.classList.contains("window-btn") ||
      windowElement.classList.contains("maximized")
    ) {
      return;
    }

    isDragging = true;
    currentWindow = windowElement;
    offsetX = e.clientX - windowElement.offsetLeft;
    offsetY = e.clientY - windowElement.offsetTop;

    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
  });
}

/**
 * Handles dragging movement
 * @param {MouseEvent} e - Mouse event
 */
function drag(e) {
  if (!isDragging || !currentWindow) return;

  const newLeft = e.clientX - offsetX;
  const newTop = e.clientY - offsetY;

  // Keep window within viewport bounds
  const maxLeft = window.innerWidth - 200;
  const maxTop = window.innerHeight - 100;

  currentWindow.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + "px";
  currentWindow.style.top = Math.max(0, Math.min(newTop, maxTop)) + "px";
}

/**
 * Stops dragging
 */
function stopDrag() {
  isDragging = false;
  currentWindow = null;
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);
}

/**
 * Makes a window resizable
 * @param {HTMLElement} windowElement - The window element to make resizable
 */
function makeResizable(windowElement) {
  // Disable resizing only on mobile/tablet screens
  const isMobile = window.matchMedia("(max-width: 900px)").matches;

  if (isMobile) {
    return; // Skip resizing setup on mobile
  }

  const resizers = document.createElement("div");
  resizers.className = "window-resizers";

  const positions = [
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
    "top",
    "bottom",
    "left",
    "right",
  ];

  positions.forEach((pos) => {
    const resizer = document.createElement("div");
    resizer.className = `resizer resizer-${pos}`;
    resizers.appendChild(resizer);

    resizer.addEventListener("mousedown", (e) => {
      if (windowElement.classList.contains("maximized")) return;
      e.preventDefault();
      e.stopPropagation();

      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = parseInt(
        document.defaultView.getComputedStyle(windowElement).width,
        10
      );
      startHeight = parseInt(
        document.defaultView.getComputedStyle(windowElement).height,
        10
      );

      const startLeft = windowElement.offsetLeft;
      const startTop = windowElement.offsetTop;

      const doResize = (e) => {
        if (!isResizing) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (pos.includes("right")) {
          windowElement.style.width = Math.max(400, startWidth + dx) + "px";
        }
        if (pos.includes("left")) {
          const newWidth = Math.max(400, startWidth - dx);
          windowElement.style.width = newWidth + "px";
          windowElement.style.left = startLeft + (startWidth - newWidth) + "px";
        }
        if (pos.includes("bottom")) {
          windowElement.style.height = Math.max(400, startHeight + dy) + "px";
        }
        if (pos.includes("top")) {
          const newHeight = Math.max(400, startHeight - dy);
          windowElement.style.height = newHeight + "px";
          windowElement.style.top = startTop + (startHeight - newHeight) + "px";
        }
      };

      const stopResize = () => {
        isResizing = false;
        document.removeEventListener("mousemove", doResize);
        document.removeEventListener("mouseup", stopResize);
      };

      document.addEventListener("mousemove", doResize);
      document.addEventListener("mouseup", stopResize);
    });
  });

  windowElement.appendChild(resizers);
}

/**
 * Initializes a window with all management features
 * @param {HTMLElement} windowElement - The window to initialize
 * @param {Object} options - Configuration options
 */
function initializeWindow(windowElement, options = {}) {
  setupWindowControls(windowElement, options.callbacks);
  makeDraggable(windowElement);
  makeResizable(windowElement);
}

// Export functions for use in other modules
window.WindowManager = {
  setupWindowControls,
  toggleMaximize,
  makeDraggable,
  makeResizable,
  initializeWindow,
};