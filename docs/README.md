# ASCII-Vision 95 - Developer Documentation

This documentation folder contains comprehensive technical information about the ASCII art generator project, including JavaScript concepts, algorithms, mathematical foundations, and recent feature implementations.

## Documentation Structure

- **[Module Architecture](module-architecture.md)** - JavaScript module structure and organization (START HERE)
- **[JavaScript Concepts](javascript-concepts.md)** - Core JavaScript patterns and techniques used in this project
- **[ASCII Conversion Algorithm](ascii-conversion-algorithm.md)** - Complete breakdown of the image-to-ASCII conversion process
- **[Mathematical Foundations](mathematical-foundations.md)** - The math behind brightness, contrast, and luminosity calculations
- **[Code Architecture](code-architecture.md)** - Design patterns and architectural decisions

## Recent Updates (December 2025)

### Color Palette System
- Added 8 color palettes for full-color ASCII art
- Color transformation functions in `ascii-converter.js`
- Dynamic palette selector that appears when Full Color mode is active

### Mobile Optimizations
- Enlarged ASCII output canvas (65-70vh on mobile) for better viewing
- Disabled window dragging and resizing on screens ≤900px
- Prevents accidental disruption during portrait mode usage

### PNG Export Improvements
- Smart dimension calculation (600-1200px bounds)
- Proper aspect ratio preservation
- Compact file sizes optimized for mobile sharing
- Centered content with appropriate padding

## Purpose

This documentation is designed to:

1. **Teach JavaScript** - Explain modern JavaScript concepts with real-world examples from the codebase
2. **Document Algorithms** - Provide clear explanations of the core ASCII conversion logic
3. **Share Knowledge** - Help developers understand the mathematical and technical foundations
4. **Support Learning** - Serve as a reference for students and developers
5. **Track Features** - Document new implementations and improvements

## Target Audience

- JavaScript learners looking for practical examples
- Developers interested in image processing and canvas manipulation
- Students studying algorithms and data structures
- Anyone curious about how ASCII art generators work
- Mobile web developers interested in responsive design patterns

## Non-Indexed

This documentation folder is excluded from search engine indexing (via robots.txt) to keep it as internal developer documentation.

---

**Created by:** Adishesha Nandkoomar  
**Studio:** Spectra Studios  
**Project:** ASCII-Vision 95  
**Last Updated:** December 3, 2025