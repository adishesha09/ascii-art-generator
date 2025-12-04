/**
 * ASCII Converter Module
 * Handles the core ASCII art conversion logic
 */

// Character set definitions for different ASCII art styles
const charSets = {
  dense: ["@", "#", "$", "%", "&", "*", "+", "-", ":", ".", " "],
  medium: ["#", "$", "%", "*", "+", "-", ":", ".", " "],
  light: ["▓", "▒", "░", ":", ".", " "],
  blocks: ["█", "▄", "▌", "▐", "·", " "],
  simple: ["@", "*", ".", " "],
  retro: ["║", "═", "╔", "╗", "╚", "╝", " ", " "],
};

// Color palette definitions
const colorPalettes = {
  original: (r, g, b) => ({ r, g, b }),
  matrix: (r, g, b) => {
    const brightness = r * 0.299 + g * 0.587 + b * 0.114;
    return { r: 0, g: Math.floor(brightness), b: 0 };
  },
  amber: (r, g, b) => {
    const brightness = r * 0.299 + g * 0.587 + b * 0.114;
    return { r: Math.floor(brightness), g: Math.floor(brightness * 0.7), b: 0 };
  },
  cyan: (r, g, b) => {
    const brightness = r * 0.299 + g * 0.587 + b * 0.114;
    return { r: 0, g: Math.floor(brightness * 0.8), b: Math.floor(brightness) };
  },
  fire: (r, g, b) => {
    const brightness = r * 0.299 + g * 0.587 + b * 0.114;
    const normalized = brightness / 255;
    return {
      r: Math.floor(brightness),
      g: Math.floor(brightness * normalized * 0.5),
      b: 0
    };
  },
  ice: (r, g, b) => {
    const brightness = r * 0.299 + g * 0.587 + b * 0.114;
    const normalized = brightness / 255;
    return {
      r: Math.floor(brightness * 0.6),
      g: Math.floor(brightness * 0.8),
      b: Math.floor(brightness)
    };
  },
  purple: (r, g, b) => {
    const brightness = r * 0.299 + g * 0.587 + b * 0.114;
    return {
      r: Math.floor(brightness * 0.8),
      g: Math.floor(brightness * 0.3),
      b: Math.floor(brightness)
    };
  },
  grayscale: (r, g, b) => {
    const gray = Math.floor(r * 0.299 + g * 0.587 + b * 0.114);
    return { r: gray, g: gray, b: gray };
  }
};

/**
 * Converts an image to ASCII art
 * @param {HTMLImageElement} image - The source image
 * @param {Object} options - Conversion options
 * @param {number} options.outputWidth - Target width in characters
 * @param {number} options.brightness - Brightness adjustment (-50 to 50)
 * @param {number} options.contrast - Contrast adjustment (-50 to 50)
 * @param {string} options.charSetKey - Key for character set to use
 * @param {boolean} options.isColorMode - Whether to generate colored ASCII
 * @param {boolean} options.isInverted - Whether to invert brightness
 * @param {string} options.colorPalette - Color palette to apply (default: 'original')
 * @returns {Object} Result object with ascii text and optional color data
 */
function convertImageToASCII(image, options) {
  const {
    outputWidth,
    brightness,
    contrast,
    charSetKey,
    isColorMode,
    isInverted,
    colorPalette = 'original',
  } = options;

  const selectedCharSet = charSets[charSetKey];

  // Set up canvas for processing
  const canvas = document.createElement("canvas");
  const scale = outputWidth / image.width;
  canvas.width = outputWidth;
  canvas.height = Math.floor(image.height * scale);

  const ctx = canvas.getContext("2d");

  // Draw the image to the canvas
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  // Apply brightness and contrast if needed
  if (brightness !== 0 || contrast !== 0) {
    const imageProcessor = window.ImageProcessor;
    if (imageProcessor) {
      imageProcessor.applyBrightnessContrast(
        ctx,
        canvas.width,
        canvas.height,
        brightness,
        contrast
      );
    }
  }

  // Get pixel data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Generate ASCII art
  let ascii = "";
  let colorData = []; // Store color information for each character

  for (let y = 0; y < canvas.height; y++) {
    let row = [];
    for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Calculate brightness using luminosity method
      const brightnessValue = r * 0.299 + g * 0.587 + b * 0.114;

      // Map brightness to character
      let normalisedBrightness = brightnessValue / 255;

      // Invert if needed
      if (isInverted) {
        normalisedBrightness = 1 - normalisedBrightness;
      }

      const charIndex = Math.floor(
        normalisedBrightness * (selectedCharSet.length - 1)
      );
      const char = selectedCharSet[charIndex];
      ascii += char;

      // Store color for this character
      if (isColorMode) {
        // Apply color palette transformation
        const paletteFunc = colorPalettes[colorPalette] || colorPalettes.original;
        const transformedColor = paletteFunc(r, g, b);
        row.push({ 
          char, 
          r: transformedColor.r, 
          g: transformedColor.g, 
          b: transformedColor.b 
        });
      }
    }
    ascii += "\n";
    if (isColorMode) {
      colorData.push(row);
    }
  }

  return {
    ascii,
    colorData: isColorMode ? colorData : null,
    processedCanvas: canvas,
  };
}

/**
 * Renders colored ASCII art to a DOM element using HTML
 * @param {HTMLElement} outputElement - The element to render into
 * @param {Array} colorData - 2D array of character/color data
 */
function renderColoredASCII(outputElement, colorData) {
  // Clear existing content
  outputElement.innerHTML = "";

  // Create HTML for colored ASCII
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

    outputElement.appendChild(lineDiv);
  });
}

/**
 * Gets the default/placeholder ASCII art
 * @returns {string} The placeholder ASCII text
 */
function getPlaceholderASCII() {
  return `╔══════════════════════════════════════════════╗
║                                              ║
║      Upload an image to generate ASCII       ║
║                                              ║
╚══════════════════════════════════════════════╝`;
}

// Export functions for use in other modules
window.ASCIIConverter = {
  charSets,
  colorPalettes,
  convertImageToASCII,
  renderColoredASCII,
  getPlaceholderASCII,
};