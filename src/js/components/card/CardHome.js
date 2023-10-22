import { html } from 'lit';
import LitWithoutShadowDom from '../base/LitWithoutShadowDom';

class CardHome extends LitWithoutShadowDom {
  static properties = {
    name: { type: String, reflect: true },
    storyID: { type: String, reflect: true },
    description: { type: String, reflect: true },
    photoUrl: { type: String, reflect: true },
    createdAt: { type: String, reflect: true },
  };

  constructor() {
    super();
    this.name = '';
    this.storyID = '';
    this.description = '';
    this.photoUrl = '';
    this.createdAt = '';
  }

  // Function to limit the description to a maximum of 20 characters
  truncateDescription(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  render() {
    // Limit the description to a maximum of 20 characters
    const truncatedDescription = this.truncateDescription(this.description, 70);

    return html`
      <div class="mb-3">
        <div class="card">
          <img class="card-img-top" src="${this.photoUrl}" alt="Story Image - ${this.name}" style="width: 100%; height: 200px;">
          <div class="card-body">
            <h5 class="card-title">${this.name}</h5>
            <p class="card-text text-justify">${truncatedDescription}</p>
            <div class="d-flex justify-content-end align-items-center mt-3">
              <a
                class="btn btn-primary"
                href="#"
                data-bs-toggle="modal"
                data-bs-target="#recordDetailModal"
                data-record-id="${this.storyID}"
              >
                <i class="bi bi-eye-fill me-1"></i>Show Detail
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('card-home', CardHome);
