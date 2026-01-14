class TitleBar extends HTMLElement {
  constructor() {
    super();
    // Create a shadow root
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './components/title-bar.css';

    const titleBar = document.createElement('div');
    titleBar.classList.add('title-bar');

    const minBtn = document.createElement('button');
    minBtn.id = 'min';
    minBtn.innerText = '-';
    minBtn.addEventListener("click", () => window.controls.minimizeWindow());

    const closeBtn = document.createElement('button');
    closeBtn.id = 'close';
    closeBtn.innerText = 'x';
    closeBtn.addEventListener("click", () => window.controls.closeWindow());

    titleBar.append(minBtn, closeBtn);
    this.shadowRoot.append(link, titleBar);
  }
}

class PlayButton extends HTMLElement {
  constructor() {
    super();
    // Create a shadow root
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './components/playback-button.css';
    this.shadowRoot.append(link);
    this.shadowRoot.innerHTML += `
      <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg" id="play-btn">
        <path d="M15 8.66025L0 17.3205L0 -6.67572e-06L15 8.66025Z" fill="currentColor"/>
      </svg>
    `;
  }
}

class PauseButton extends HTMLElement {
  constructor() {
    super();
    // Create a shadow root
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './components/playback-button.css';
    this.shadowRoot.append(link);
    this.shadowRoot.innerHTML += `
      <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" id="pause-btn">
        <rect width="6" height="16" fill="currentColor"/>
        <rect x="11" width="6" height="16" fill="currentColor"/>
      </svg>
    `;
  }
}

class ThemeButton extends HTMLElement {
  static observedAttributes = ['fill', 'stroke'];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  
  connectedCallback() {
    // Create a shadow root
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }

  setFill(color) {
    this.setAttribute('fill', color);
  }

  setStroke(color) {
    this.setAttribute('stroke', color);
  }

  render() {
    const fill = this.getAttribute('fill') || 'black';
    const stroke = this.getAttribute('stroke') || 'white';
    this.shadowRoot.innerHTML = `
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="5" cy="5" r="4.5" fill="${fill}" stroke="${stroke}"/>
      </svg>
    `;
  }
}

customElements.define("title-bar", TitleBar);
customElements.define("play-button", PlayButton);
customElements.define("pause-button", PauseButton);
customElements.define("theme-button", ThemeButton);