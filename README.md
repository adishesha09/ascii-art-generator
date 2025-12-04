# ASCII-Vision 95

<div align="center">

![ASCII-Vision 95](https://img.shields.io/badge/ASCII--Vision%2095-v1.0-blue?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**A retro Windows 95-styled image to ASCII art converter**

[Live Demo](https://ascii-vision-95.vercel.app) • [Report Bug](https://github.com/adishesha09/ascii-art-generator/issues) • [Request Feature](https://github.com/adishesha09/ascii-art-generator/issues)

</div>

---

## Table of Contents

- [ASCII-Vision 95](#ascii-vision-95)
  - [Table of Contents](#table-of-contents)
  - [About](#about)
  - [Features](#features)
    - [Core Functionality](#core-functionality)
    - [Windows 95 Interface](#windows-95-interface)
    - [Image Processing](#image-processing)
  - [Demo](#demo)
    - [Screenshots](#screenshots)
    - [Live Demo](#live-demo)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running Locally](#running-locally)
    - [Deployment](#deployment)
  - [Usage](#usage)
    - [Basic Workflow](#basic-workflow)
    - [Menu Options](#menu-options)
  - [Architecture](#architecture)
    - [Project Structure](#project-structure)
    - [Technologies Used](#technologies-used)
      - [Frontend](#frontend)
      - [Libraries \& Tools](#libraries--tools)
      - [SEO \& Metadata](#seo--metadata)
      - [Features](#features-1)
  - [Customization](#customization)
    - [Modifying Character Sets](#modifying-character-sets)
    - [Color Modes](#color-modes)
    - [Changing Colors](#changing-colors)
    - [Adding New Features](#adding-new-features)
  - [Browser Support](#browser-support)
  - [Contributing](#contributing)
    - [Development Guidelines](#development-guidelines)
  - [Contact](#contact)
  - [Acknowledgments](#acknowledgments)

---

## About

**ASCII-Vision 95** is a nostalgic web application that transforms images into ASCII art with a fully functional Windows 95 interface. Built with vanilla JavaScript, HTML, and CSS, this tool captures the aesthetic of mid-90s computing while providing modern functionality including full-color ASCII art generation.

The application features a complete retro OS simulation including:
- Draggable and resizable windows
- Functional menu system
- Minimize/maximize/close controls
- Retro CRT screen effects
- Desktop icons and taskbar

Perfect for developers who appreciate retro design, ASCII art enthusiasts, or anyone looking to add a nostalgic touch to their projects.

---

## Features

### Core Functionality
- **Image to ASCII Conversion** - Upload any image and convert it to ASCII art
- **Drag-and-Drop Upload** - Simply drag images onto the window
- **Multiple Character Sets** - Choose from 6 different character sets (Dense, Medium, Light, Blocks, Simple, Retro)
- **Color Modes & Palettes** - Generate monochrome or full-color ASCII art with 8 color palettes (Original, Matrix Green, Amber Terminal, Cyan/Blue, Fire, Ice, Purple Haze, Grayscale)
- **Adjustable Output Width** - Control ASCII art dimensions (40-120 characters wide)
- **Brightness & Contrast Controls** - Fine-tune image processing with ±50 adjustments
- **Color Inversion** - Instantly invert ASCII art colors
- **Copy to Clipboard** - One-click copy functionality
- **Save as Text** - Download ASCII art as `.txt` file
- **Save as PNG** - Export as properly-sized PNG with optimized dimensions for mobile sharing
- **Sample Image** - Try the tool instantly with a built-in sample

### Windows 95 Interface
- **Boot Screen** - Authentic OS boot sequence with loading animation
- **Draggable Windows** - Move windows anywhere on desktop (disabled on mobile for better UX)
- **Resizable Windows** - Resize from any edge or corner on desktop (8 resize handles)
- **Maximize/Minimize** - Full window management capabilities
- **Mobile-Optimized** - Large canvas view (65-70% screen height) and locked windows prevent accidental disruption
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Functional Menus** - File, Edit, View, Options, and Help menus
- **Taskbar** - Complete with Start button, window items, and live clock
- **Desktop Icons** - Interactive icons for README and application
- **CRT Effect** - Optional scanline overlay for authentic retro feel

### Image Processing
- **Dual Preview** - Side-by-side original and processed image view
- **Real-time Processing** - Instant feedback on adjustments
- **Canvas-based Rendering** - Efficient pixel-level manipulation
- **Luminosity Calculation** - Accurate brightness mapping using standard formula

---

## Demo

### Screenshots

**Main Application Window**
```
╔═══════════════════════════════════╗
║     ASCII-VISION 95 v1.0         ║
║  Image to ASCII Converter        ║
╚═══════════════════════════════════╝
```

### Live Demo
Visit [ASCII-Vision 95](https://ascii-vision-95.vercel.app) to try it yourself!

---

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adishesha09/ascii-art-generator.git
   cd ascii-art-generator
   ```

2. **No build process required!** This is a pure HTML/CSS/JS application.

### Running Locally

**Option 1: Using Python (Recommended)**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Option 2: Using Node.js**
```bash
npx http-server -p 8000
```

**Option 3: Using VS Code**
- Install the "Live Server" extension
- Right-click on `index.html` and select "Open with Live Server"

Then navigate to `http://127.0.0.1:3000/` in your browser.

### Deployment

This project is optimized for **Vercel** deployment:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Import your GitHub repository at [vercel.com](https://vercel.com)
   - Vercel auto-detects static site configuration from `vercel.json`
   - Click Deploy

**Production optimizations included:**
- Asset caching headers (1-year cache for static files)
- Security headers (X-Frame-Options, XSS Protection, etc.)
- Proper routing configuration
- SEO-friendly URLs

---

## Usage

### Basic Workflow

1. **Load an Image**
   - Click "Select Image File" or drag & drop an image
   - Or click "Load Sample" to try with a demo image

2. **Adjust Settings**
   - **Output Width**: Control the size of ASCII output (40-120 characters)
   - **Character Set**: Choose from 6 different ASCII character sets
   - **Color Mode**: Select "Monochrome" or "Full Color" for vibrant results
   - **Color Palette**: Choose from 8 color palettes when in Full Color mode (Matrix, Amber, Fire, Ice, etc.)
   - **Brightness**: Adjust image brightness (-50 to +50)
   - **Contrast**: Adjust image contrast (-50 to +50)

3. **Generate ASCII Art**
   - Click "Render ASCII" button
   - View side-by-side preview of original and processed images

4. **Export Your Art**
   - **Copy**: Click to copy ASCII art to clipboard
   - **Save TXT**: Download as `ascii-art.txt`
   - **Save PNG**: Export as optimally-sized PNG (600-1200px) with proper aspect ratio, perfect for mobile sharing
   - **Invert**: Toggle color inversion
   - **Clear**: Reset output

### Menu Options

**File Menu**
- Open Image - Select a new image file
- Load Sample - Load demo image
- Save ASCII Art - Download as text file
- Exit - Close the application

**Edit Menu**
- Copy ASCII - Copy to clipboard
- Clear Output - Reset the output area
- Invert Colors - Toggle ASCII color inversion

**View Menu**
- Maximize Window - Fullscreen mode
- Toggle CRT Effect - Enable/disable scanline effect

**Options Menu**
- Character Sets - Quick access to character selection
- Brightness/Contrast - Focus adjustment sliders
- Reset All Settings - Return to defaults

**Help Menu**
- View README - Open README window
- About - Application information
- Visit Spectra Studios - Developer website

---

## Architecture

### Project Structure

```
ascii-art-generator/
├── index.html                      # Main application page
├── manifest.json                   # PWA manifest
├── browserconfig.xml               # Windows tile configuration
├── robots.txt                      # SEO crawling rules
├── sitemap.xml                     # Site structure
├── vercel.json                     # Vercel deployment config
├── .gitignore                      # Git ignore rules
├── assets/
│   ├── images/
│   │   ├── favicons/              # All favicon files
│   │   ├── social/                # Open Graph images
│   │   ├── screenshots/           # App screenshots
│   │   └── preview.png            # General preview
│   ├── scripts/
│   │   ├── boot.js                # Boot screen logic
│   │   ├── image-processor.js     # Image manipulation utilities
│   │   ├── ascii-converter.js     # ASCII conversion logic
│   │   ├── window-manager.js      # Window drag/resize/maximize
│   │   ├── ui-controls.js         # UI event handlers
│   │   └── main.js                # Application entry point
│   └── stylesheets/
│       ├── style.css              # Main stylesheet (imports)
│       ├── boot.css               # Boot screen styles
│       ├── base.css               # Reset & base styles
│       ├── taskbar.css            # Taskbar components
│       ├── windows.css            # Window system & menus
│       ├── components.css         # App components
│       ├── controls.css           # Form controls & buttons
│       ├── output.css             # Preview & output areas
│       └── responsive.css         # Media queries
├── docs/                          # Documentation files
│   ├── ascii-conversion-algorithm.md
│   ├── code-architecture.md
│   ├── javascript-concepts.md
│   ├── mathematical-foundations.md
│   ├── module-architecture.md     # JavaScript module structure
│   └── README.md
└── README.md                       # This file
```

### Technologies Used

#### Frontend
- **HTML5** - Semantic markup with JSON-LD structured data
- **CSS3** - Modular architecture with 8 separate stylesheets
- **Vanilla JavaScript** - No frameworks, pure ES6+

#### Libraries & Tools
- **Font Awesome 6.5.1** - Icon system
- **Canvas API** - Image processing
- **Clipboard API** - Copy functionality
- **File API** - Image upload and download

#### SEO & Metadata
- **JSON-LD Structured Data** - Rich search results
- **Open Graph Tags** - Social media previews
- **Twitter Cards** - Enhanced Twitter sharing
- **PWA Manifest** - Installable web app
- **Favicons & Icons** - Multi-platform support

#### Features
- **Responsive Design** - Mobile-first approach
- **CSS Grid & Flexbox** - Modern layout systems
- **CSS Custom Properties** - For theming (can be extended)
- **Event Delegation** - Efficient event handling

---

## Customization

### Modifying Character Sets

Edit the `charSets` object in `assets/scripts/ascii-converter.js`:

```javascript
const charSets = {
  custom: ["█", "▓", "▒", "░", " "],  // Add your own!
  dense: ["@", "#", "$", "%", "&", "*", "+", "-", ":", ".", " "],
  // ... other sets
};
```

For more details on the modular structure, see [Module Architecture](docs/module-architecture.md).

### Color Modes

The application supports two color modes with multiple palettes:
- **Monochrome**: Traditional green-on-black terminal ASCII (exports as green on black PNG)
- **Full Color**: Choose from 8 color palettes:
  - **Original Colors**: Uses actual RGB values from the image
  - **Matrix Green**: Classic green terminal aesthetic
  - **Amber Terminal**: Retro amber/orange monochrome
  - **Cyan/Blue**: Cool blue tones
  - **Fire (Red/Orange)**: Warm fire effect with brightness-based intensity
  - **Ice (Blue/White)**: Cool icy color scheme
  - **Purple Haze**: Purple color palette
  - **Grayscale**: Black and white conversion

### Changing Colors

Windows 95 color scheme is defined in CSS files:
- Primary gray: `#c0c0c0`
- Window blue: `#000080`
- Teal background: `#008080`

### Adding New Features

The modular architecture makes it easy to extend:

**CSS:**
1. Add new styles to appropriate CSS module
2. Import in `style.css` if creating a new module

**JavaScript:**
1. Identify which module handles your feature (see [Module Architecture](docs/module-architecture.md))
2. Add functionality to the appropriate module:
   - `image-processor.js` - Image manipulation
   - `ascii-converter.js` - ASCII conversion logic
   - `window-manager.js` - Window interactions
   - `ui-controls.js` - UI events and controls
   - `main.js` - Application state and coordination

---

## Browser Support

| Browser | Version |
| ------- | ------- |
| Chrome  | 90+     |
| Firefox | 88+     |
| Safari  | 14+     |
| Edge    | 90+     |
| Opera   | 76+     |

**Note**: Requires JavaScript enabled and Canvas API support.

---

## Contributing

Contributions are what make the open-source community amazing! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and structure
- Keep CSS modular (use appropriate module files)
- Keep JavaScript modular (see [Module Architecture](docs/module-architecture.md))
- Comment complex logic
- Test on multiple browsers
- Maintain Windows 95 aesthetic
- Update documentation when adding features

---

## Contact

**Adishesha Nandkoomar**
- Website: [spectrastudios.co.za](https://spectrastudios.co.za)
- Instagram: [@spectra._.studios](https://instagram.com/spectra._.studios)

**Project Link**: [https://github.com/adishesha09/ascii-art-generator](https://github.com/adishesha09/ascii-art-generator)

---

## Acknowledgments

- Inspired by classic 90s operating system UI/UX design
- Font Awesome for the icon system
- ASCII art community for character set inspiration
- All contributors and users of this project

---

<div align="center">

**Built by [Spectra Studios](https://spectrastudios.co.za)**

© 1995-2025 Spectra Studios. All rights reserved.

</div>