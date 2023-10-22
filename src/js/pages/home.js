import CheckUserAuth from './auth/check-user-auth';
import Stories from '../network/stories';

const Home = {
  _currentPage: 1,
  _itemsPerPage: 6,
  _listStory: [],

  async init() {
    CheckUserAuth.checkLoginState();
    await this._initialData();
    this._initialListener();
  },

  async _initialData() {
    const preloaderWrapper = document.getElementById('preloaderWrapper');
    preloaderWrapper.style.visibility = 'visible';
    try {
      const response = await Stories.getAllStories();
      const responseRecords = response.data;
      this._listStory = responseRecords.listStory;
      this._currentPage = 1; // Atur ulang halaman saat ini ke 1
      this._populateStoryRecordToCard(this._listStory);
    } catch (error) {
      console.error(error);
    } finally {
      preloaderWrapper.style.visibility = 'hidden';
    }
  },

  _initialListener() {
    const recordDetailModal = document.getElementById('recordDetailModal');
    recordDetailModal.addEventListener('show.bs.modal', (event) => {
      const modalTitle = recordDetailModal.querySelector('.modal-title');
      modalTitle.focus();

      const button = event.relatedTarget;
      const dataRecord = this._listStory.find((item) => {
        return item.id == button.dataset.recordId;
      });

      this._populateDetailStoryToModal(dataRecord);
    });

    const previousPageButton = document.getElementById('previousPage');
    const nextPageButton = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');

    previousPageButton.addEventListener('click', () => {
      if (this._currentPage > 1) {
        this._currentPage--; // Kurangi halaman saat ini
        this._populateStoryRecordToCard(this._listStory);
        this._updatePagination(pageNumbers);
      }
    });

    nextPageButton.addEventListener('click', () => {
      const totalPages = Math.ceil(this._listStory.length / this._itemsPerPage);
      if (this._currentPage < totalPages) {
        this._currentPage++; // Tambahkan halaman saat ini
        this._populateStoryRecordToCard(this._listStory);
        this._updatePagination(pageNumbers);
      }
    });

    this._updatePagination(pageNumbers);
  },


  _populateStoryRecordToCard(listStory = null) {
    if (!(typeof listStory === 'object')) {
      throw new Error(`Parameter listStory should be an object. The value is ${listStory}`);
    }

    if (!Array.isArray(listStory)) {
      throw new Error(`Parameter listStory should be an array. The value is ${listStory}`);
    }

    const recordBodyCard = document.querySelector('#recordsCard');
    const start = (this._currentPage - 1) * this._itemsPerPage;
    const end = start + this._itemsPerPage;
    const itemsToDisplay = listStory.slice(start, end);

    recordBodyCard.innerHTML = '';

    if (itemsToDisplay.length <= 0) {
      recordBodyCard.innerHTML = this._templateEmptyBodyCard();
      return;
    }

    itemsToDisplay.forEach((item, idx) => {
      recordBodyCard.innerHTML += this._templateBodyCard(idx, item);
    });
  },

  _updatePagination(pageNumbers) {
    const totalPages = Math.ceil(this._listStory.length / this._itemsPerPage);
    pageNumbers.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const pageNumber = document.createElement('button');
      pageNumber.classList.add('btn', 'btn-secondary', 'mx-1');
      pageNumber.textContent = i;
      pageNumber.addEventListener('click', () => {
        this._currentPage = i;
        this._populateStoryRecordToCard(this._listStory);
        this._updatePagination(pageNumbers);
      });

      if (i === this._currentPage) {
        pageNumber.classList.add('active');
      }

      pageNumbers.appendChild(pageNumber);
    }
  },


  _populateDetailStoryToModal(storyRecord) {
    if (!(typeof storyRecord === 'object')) {
      throw new Error(`Parameter storyRecord should be an object. The value is ${storyRecord}`);
    }

    const imgDetailRecord = document.querySelector('#recordDetailModal #imgDetailRecord');
    const nameDetailRecord = document.querySelector('#recordDetailModal #nameDetailRecord');
    const createdAtDetailRecord = document.querySelector('#recordDetailModal #dateDetailRecord');
    const descriptionDetailRecord = document.querySelector('#recordDetailModal #noteDetailRecord');

    imgDetailRecord.setAttribute('src', storyRecord.photoUrl);
    imgDetailRecord.setAttribute('alt', `Card Story Image - ${storyRecord.name}`);
    nameDetailRecord.textContent = storyRecord.name;

    // Ubah format tanggal dari ISO 8601 menjadi "Senin, 1 Agustus 2022"
    const date = new Date(storyRecord.createdAt);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('id-ID', options);
    createdAtDetailRecord.textContent = formattedDate;

    descriptionDetailRecord.textContent = storyRecord.description || '-';
  },

  _templateBodyCard(index, storyRecord) {
    return `
      <card-home
        name="${storyRecord.name}"
        storyID="${storyRecord.id}"
        description="${storyRecord.description.slice(0, 85)}..."
        photoUrl="${storyRecord.photoUrl}"
        createdAt="${storyRecord.createdAt}"
        classes="h-100 bg-primary text-bg-primary bg-gradient"
      ></card-home>
    `;
  },

  _templateEmptyBodyCard() {
    return `
      <div class="text-center">Tidak ada list cerita</div>
    `;
  },
};

export default Home;
