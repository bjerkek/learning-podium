const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
        all: initial;
        display: inline-block;
    }
</style>
<header>
    <nav>
        <a href="">Link 1</a>
        <a href="">Link 2</a>
        <a href="">Link 3</a>
    </nav>
</header>
`;

class Header extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const { shadowRoot } = this;
        const node = document.importNode(template.content, true);
        shadowRoot.appendChild(node);
    }
}

if (!customElements.get('app-header')) {
    customElements.define('app-header', Header);
}
