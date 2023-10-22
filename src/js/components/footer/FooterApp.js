import LitWithoutShadowDom from '../base/LitWithoutShadowDom';
import { html } from 'lit';
import { updateWhenLocaleChanges } from '@lit/localize';

class FooterApp extends LitWithoutShadowDom {
  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  render() {
    return html`
      <div
        class="container d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top"
      >
        <p class="col-md-4 mb-0 copyright">&copy; 2023 Story App</p>
        <locale-picker class="d-block mb-3"></locale-picker>
      </div>
    `;
  }
}

customElements.define('footer-app', FooterApp);
