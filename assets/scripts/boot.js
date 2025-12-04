// ASCII-Vision 95 Boot Screen
// Simple and elegant boot sequence

class BootScreen {
  constructor() {
    this.bootComplete = false;
    this.bootContainer = null;
  }

  init() {
    this.createBootScreen();
    this.startBootSequence();
  }

  createBootScreen() {
    this.bootContainer = document.createElement("div");
    this.bootContainer.id = "bootScreen";
    this.bootContainer.innerHTML = `
      <div class="boot-content">
        <div class="boot-logo">
          <div class="logo-text">SPECTRA OS</div>
          <div class="logo-subtitle">ASCII-Vision 95</div>
        </div>
        <div class="boot-progress">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
          <div class="boot-status">Initializing system...</div>
        </div>
        <div class="boot-footer">Spectra Studios &copy; 1995-2025</div>
      </div>
    `;
    document.body.appendChild(this.bootContainer);
  }

  async startBootSequence() {
    const statusText = this.bootContainer.querySelector(".boot-status");
    const progressFill = this.bootContainer.querySelector(".progress-fill");

    await this.wait(800);

    // Fade in logo
    this.bootContainer.querySelector(".boot-logo").classList.add("active");
    await this.wait(600);

    // Show progress bar
    this.bootContainer.querySelector(".boot-progress").classList.add("active");
    await this.wait(400);

    // Progress through boot stages
    const stages = [
      { text: "Loading character sets...", progress: 20 },
      { text: "Initializing canvas renderer...", progress: 40 },
      { text: "Loading window manager...", progress: 60 },
      { text: "Preparing interface...", progress: 80 },
      { text: "Ready to start...", progress: 100 },
    ];

    for (const stage of stages) {
      statusText.textContent = stage.text;
      progressFill.style.width = stage.progress + "%";
      await this.wait(400);
    }

    await this.wait(600);
    await this.fadeOut();
  }

  async fadeOut() {
    this.bootContainer.classList.add("fade-out");
    await this.wait(800);
    this.bootContainer.remove();
    this.bootComplete = true;
    document.body.classList.add("boot-complete");
  }

  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Initialize boot screen on page load
window.addEventListener("DOMContentLoaded", () => {
  const boot = new BootScreen();
  boot.init();
});