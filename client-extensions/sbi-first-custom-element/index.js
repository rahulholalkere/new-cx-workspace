class SBICustomElement extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div>
                <h1>Welcome to SBI Custom Element</h1>
                <p>This is a custom element created for demonstration purposes.</p>
            </div>
        `;
    }

    disconnectedCallback() {
        console.log('SBICustomElement has been removed from the DOM.');
    }
}

// Ensure the tag name matches the client-extension.yaml entry
if(!customElements.get('sbi-first-custom-element')) {
    customElements.define('sbi-first-custom-element', SBICustomElement);
}