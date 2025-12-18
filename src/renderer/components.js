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

customElements.define("title-bar", TitleBar);