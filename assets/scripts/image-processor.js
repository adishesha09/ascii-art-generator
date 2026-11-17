/**
 * Image Processor Module
 * Handles image manipulation: brightness, contrast, and pixel operations
 */

/**
 * Clamps a value between 0 and 255
 * @param {number} value - The value to clamp
 * @returns {number} Clamped value
 */
function clamp(value) {
  return Math.max(0, Math.min(255, value));
}

/**
 * Applies brightness and contrast adjustments to image data
 * @param {CanvasRenderingContext2D} ctx - Canvas context containing the image
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number} brightness - Brightness adjustment (-50 to 50)
 * @param {number} contrast - Contrast adjustment (-50 to 50)
 */
function applyBrightnessContrast(ctx, width, height, brightness, contrast) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Contrast factor calculation
  const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  for (let i = 0; i < data.length; i += 4) {
    // Apply brightness
    data[i] = clamp(data[i] + brightness);
    data[i + 1] = clamp(data[i + 1] + brightness);
    data[i + 2] = clamp(data[i + 2] + brightness);

    // Apply contrast
    data[i] = clamp(contrastFactor * (data[i] - 128) + 128);
    data[i + 1] = clamp(contrastFactor * (data[i + 1] - 128) + 128);
    data[i + 2] = clamp(contrastFactor * (data[i + 2] - 128) + 128);
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Loads an image from a file
 * @param {File} file - The image file to load
 * @returns {Promise<HTMLImageElement>} Promise that resolves with the loaded image
 */
function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      resolve(img);
    };

    img.onerror = () => {
      reject(new Error("Error loading image"));
    };
  });
}

/**
 * Creates a sample image for demo purposes
 * @returns {Promise<HTMLImageElement>} Promise that resolves with sample image
 */
function createSampleImage() {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 200;
    canvas.height = 100;

    // Draw a simple retro computer screen
    ctx.fillStyle = "#000080";
    ctx.fillRect(0, 0, 200, 150);

    // Draw some retro UI elements
    ctx.fillStyle = "#C0C0C0";
    ctx.fillRect(20, 20, 160, 110);

    // Draw title bar
    ctx.fillStyle = "#000080";
    ctx.fillRect(22, 22, 156, 20);

    // Draw text
    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 12px "MS Sans Serif"';
    ctx.fillText("ASCII-VISION 95", 30, 36);

    // Draw some ASCII art in the window
    ctx.fillStyle = "#000000";
    ctx.font = "10px monospace";
    ctx.fillText("╔══════════════╗", 40, 60);
    ctx.fillText("║ ASCII READY  ║", 40, 72);
    ctx.fillText("╚══════════════╝", 40, 84);

    // Convert to image
    const dataUrl = canvas.toDataURL("image/png");
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = dataUrl;
  });
}

// Export functions for use in other modules
window.ImageProcessor = {
  clamp,
  applyBrightnessContrast,
  loadImageFromFile,
  createSampleImage,
};
