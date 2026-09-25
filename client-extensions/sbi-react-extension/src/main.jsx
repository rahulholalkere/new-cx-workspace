import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

(function () {
  // Prevent duplicate registration on Liferay SPA page switches
  if (customElements.get('sbi-react-extension')) return;

  class SbiReactExtension extends HTMLElement {
    constructor() {
      super();
      this.root = null;
    }

    connectedCallback() {
      if (!this.root) {
        // Attach Shadow DOM for style isolation from Liferay Theme
        const shadowRoot = this.attachShadow({ mode: 'open' });
        this.root = ReactDOM.createRoot(shadowRoot);
      }

      // Read attributes passed from Liferay or client-extension.yaml
      const cardTitle = this.getAttribute('card-title') || 'React Client Extension';
      this.root.render(<App cardTitle={cardTitle} />);
    }

    disconnectedCallback() {
      // Clean up React root on unmount
      if (this.root) {
        this.root.unmount();
      }
    }
  }

  customElements.define('sbi-react-extension', SbiReactExtension);
})();