import { html } from 'lit';
import { allLocales } from '../../../generated/locale-codes';
import { updateWhenLocaleChanges } from '@lit/localize';
import { getLocale, localeNames, setLocaleFromUrl } from '../../localization.js';
import LitWithoutShadowDom from '../base/LitWithoutShadowDom';

class LocalePicker extends LitWithoutShadowDom {
  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  render() {
    return html`
      <div class="dropdown">
        <button
          class="btn btn-secondary bg-primary dropdown-toggle"
          type="button"
          id="localeDropdown"
          data-bs-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <i class="bi bi-translate"></i>
          ${localeNames[getLocale()]}
        </button>
        <div class="dropdown-menu" aria-labelledby="localeDropdown">
          ${allLocales.map((locale) => {
            return html`
              <a
                class="dropdown-item"
                href="javascript:void(0);"
                @click=${() => this._localeChanged(locale)}
              >
                ${localeNames[locale]}
              </a>
            `;
          })}
        </div>
      </div>
    `;
  }

  _localeChanged(newLocale) {
    if (newLocale !== getLocale()) {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', newLocale);
      window.history.pushState(null, '', url.toString());
      setLocaleFromUrl();
    }
  }
}

customElements.define('locale-picker', LocalePicker);
