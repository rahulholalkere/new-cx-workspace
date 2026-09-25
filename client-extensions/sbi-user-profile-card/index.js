(function () {
  // Check if the custom element is already registered in the browser
  if (customElements.get('sbi-user-profile-card')) {
    return;
  }

  class UserProfileCard extends HTMLElement {
    static get observedAttributes() {
      return ['card-title'];
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.userData = null;
      this.loading = true;
      this.error = null;
    }

    connectedCallback() {
      this.render();
      this.fetchUserProfile();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        this.render();
      }
    }

    async fetchUserProfile() {
      try {
        const authToken = window.Liferay?.authToken || '';

        const response = await fetch('/o/headless-admin-user/v1.0/my-user-account', {
          headers: {
            'x-csrf-token': authToken,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}`);
        }

        this.userData = await response.json();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
        this.render();
      }
    }

    render() {
      const cardTitle = this.getAttribute('card-title') || 'Current User Profile';

      let content = '';

      if (this.loading) {
        content = `<p class="loading">Fetching profile data...</p>`;
      } else if (this.error) {
        content = `<p class="error">Failed to load profile: ${this.error}</p>`;
      } else if (this.userData) {
        const initials = `${this.userData.givenName?.[0] || ''}${this.userData.familyName?.[0] || ''}`;
        content = `
          <div class="profile-header">
            <div class="avatar">${initials}</div>
            <div>
              <strong>${this.userData.name}</strong>
              <br />
              <small style="color: #6b6c7e;">${this.userData.emailAddress}</small>
            </div>
          </div>
        `;
      }

      this.shadowRoot.innerHTML = `
        <style>
          @import url('/o/sbi-user-profile-card/index.css');
        </style>
        <div class="profile-card">
          <h4>${cardTitle}</h4>
          ${content}
        </div>
      `;
    }
  }

  // Register the element safely
  customElements.define('sbi-user-profile-card', UserProfileCard);
})();