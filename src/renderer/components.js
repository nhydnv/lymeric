class TitleBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="title-bar">
        <button id="min">-</button>
        <button id="close">x</button>
      </div>
    `;
  }
}

class PlayButton extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg" id="play-btn">
        <path d="M15 8.66025L0 17.3205L0 -6.67572e-06L15 8.66025Z" fill="white"/>
      </svg>
    `;
  }
}

class PauseButton extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" id="pause-btn">
        <rect width="6" height="16" fill="white"/>
        <rect x="11" width="6" height="16" fill="white"/>
      </svg>
    `;
  }
}

customElements.define("title-bar", TitleBar);
customElements.define("play-button", PlayButton);
customElements.define("pause-button", PauseButton);