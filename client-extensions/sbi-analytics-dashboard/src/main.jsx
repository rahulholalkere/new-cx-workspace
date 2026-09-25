import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

(function () {
  if (customElements.get('sbi-analytics-dashboard')) return;

  class SbiAnalyticsDashboard extends HTMLElement {
    constructor() {
      super();
      this.root = null;
    }

    static get observedAttributes() {
      return ['dashboard-title'];
    }

    connectedCallback() {
      this.render();
    }

    attributeChangedCallback() {
      this.render();
    }

    render() {
      if (!this.root) {
        const shadowRoot = this.attachShadow({ mode: 'open' });
        this.root = ReactDOM.createRoot(shadowRoot);
      }

      const title = this.getAttribute('dashboard-title') || 'Platform Analytics';
      this.root.render(<App dashboardTitle={title} />);
    }

    disconnectedCallback() {
      if (this.root) {
        this.root.unmount();
      }
    }
  }

  customElements.define('sbi-analytics-dashboard', SbiAnalyticsDashboard);
})();