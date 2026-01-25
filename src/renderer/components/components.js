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

class PlayIcon extends HTMLElement {
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

class PauseIcon extends HTMLElement {
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

class ThemeIcon extends HTMLElement {
  static observedAttributes = ['fill', 'stroke'];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  
  connectedCallback() {
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

class CornerButton extends HTMLElement {
  #state = 0;
  #directions = [
    {
      name: 'bottom-right',
      arrow: '↘',
    },
    {
      name: 'bottom-left',
      arrow: '↙',
    },
    {
      name: 'top-left',
      arrow: '↖',
    },
    {
      name: 'top-right',
      arrow: '↗',
    },
  ];

  constructor() {
    super();
  }

  connectedCallback() {
    const btn = document.createElement('button');
    btn.title = 'Move to corner';
    btn.id = 'corner-btn';
    btn.innerHTML = this.#directions[this.#state].arrow;
    btn.addEventListener('click', () => {
      window.controls.moveToCorner(this.#directions[this.#state].name);
      this.#state = (this.#state + 1) % 4;
      btn.innerHTML = this.#directions[this.#state].arrow;
    });
    this.appendChild(btn);
  }
}

customElements.define("title-bar", TitleBar);
customElements.define("play-icon", PlayIcon);
customElements.define("pause-icon", PauseIcon);
customElements.define("theme-icon", ThemeIcon);
customElements.define("corner-button", CornerButton);