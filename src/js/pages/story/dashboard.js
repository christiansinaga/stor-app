import CheckUserAuth from '../auth/check-user-auth';
import Stories from '../../network/stories';
import Utils from '../../utils/utils';
import Config from '../../config/config';
const Dashboard = {
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
      // Mengambil daftar cerita dari server
      const response = await Stories.getAllStories();
      const responseRecords = response.data;
      const allStories = responseRecords.listStory;
  
      console.log('All Stories:', allStories); // Tambahkan baris ini
  
      // Mengambil nama pengguna yang sudah login dari penyimpanan lokal
      const loggedInUsername = Utils.getName(Config.NAME);
      console.log('Logged In Username:', loggedInUsername);
  
      // Menyaring cerita berdasarkan nama pengguna yang sudah login
      const userStories = allStories.filter(story => story.name === loggedInUsername);
  
      this._listStory = userStories; // Memperbarui daftar cerita
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
  },

  _populateStoryRecordToCard(listStory = null) {
    if (!(typeof listStory === 'object')) {
      throw new Error(`Parameter listStory should be an object. The value is ${listStory}`);
    }
  
    if (!Array.isArray(listStory)) {
      throw new Error(`Parameter listStory should be an array. The value is ${listStory}`);
    }
  
    const recordBodyCard = document.querySelector('#recordsCard');
  
    console.log('Number of cards to be added:', listStory.length); // Tambahkan baris ini
  
    recordBodyCard.innerHTML = '';
    if (listStory.length <= 0) {
      recordBodyCard.innerHTML = this._templateEmptyBodyCard();
      return;
    }
  
    listStory.forEach((item, idx) => {
      console.log('Adding card:', item); // Tambahkan baris ini
  
      recordBodyCard.innerHTML += this._templateBodyCard(idx, listStory[idx]);
    });
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
    var date = new Date(storyRecord.createdAt);
    date = date.toISOString().substring(0, 10);
    createdAtDetailRecord.textContent = date;
    descriptionDetailRecord.textContent = storyRecord.description || '-';
  },

  _templateBodyCard(index, storyRecord) {
    console.log('Creating card for story:', storyRecord); // Tambahkan baris ini
  
    return `
      <card-Dashboard
        name="${storyRecord.name}"
        storyID="${storyRecord.id}"
        description="${storyRecord.description.slice(0, 85)}..."
        photoUrl="${storyRecord.photoUrl}"
        createdAt="${storyRecord.createdAt}"
        classes="h-100 bg-primary text-bg-primary bg-gradient"
      ></card-Dashboard>
    `;
  },
  

  _templateEmptyBodyCard() {
    return `
      <div class="text-center">Tidak ada list story</div>
    `;
  },
};

export default Dashboard;
