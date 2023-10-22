import Auth from '../../network/auth';
import Config from '../../config/config';
import Utils from '../../utils/utils';
import CheckUserAuth from './check-user-auth';
import Swal from 'sweetalert2';

const Login = {
  async init() {
    CheckUserAuth.checkLoginState();
    this._initialListener();
  },

  _initialListener() {
    const loginForm = document.querySelector('#loginForm');
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      event.stopPropagation();
      loginForm.classList.add('was-validated');
      await this._getLogged();
    });
  },

  _validateEmail(email) {
    // Ekspresi reguler untuk memeriksa format email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  },

  async _getLogged() {
    const formData = this._getFormData();

    if (this._validateFormData({ ...formData })) {
      // Validasi email sebelum mengirim permintaan login
      if (!this._validateEmail(formData.email)) {
        Swal.fire('Error', 'Alamat email tidak valid.', 'error');
        return;
      }

      const preloaderWrapper = document.getElementById('preloaderWrapper');
      preloaderWrapper.style.visibility = 'visible';
      try {
        const response = await Auth.login({
          email: formData.email,
          password: formData.password,
        });
        if (response.status === 200) {
          Utils.setUserToken(Config.USER_TOKEN_KEY, response.data.loginResult.token);
          Utils.setName(Config.NAME, response.data.loginResult.name);
          Swal.fire('Success', 'User berhasil masuk.', 'success').then(() => {
            this._goToHomePage();
          });
        } else {
          if (formData.password.length < 8) {
            Swal.fire('Error', 'Password harus minimal 8 karakter.', 'error');
          } else {
            Swal.fire('Error', response.response.data.message, 'error');
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        preloaderWrapper.style.visibility = 'hidden';
      }
    }
  },

  _getFormData() {
    const email = document.querySelector('#validationCustomRecordEmail');
    const password = document.querySelector('#validationCustomPassword');
    return {
      email: email.value,
      password: password.value,
    };
  },

  _validateFormData(formData) {
    if (formData.email === '' || !this._validateEmail(formData.email)) {
      Swal.fire('Error', 'Alamat email tidak valid.', 'error');
      return false;
    }
    if (formData.password === '' || formData.password.length < 8) {
      Swal.fire('Error', 'Password harus minimal 8 karakter.', 'error');
      return false;
    }
    return true;
  },

  _goToHomePage() {
    window.location.href = '/index.html';
  },
};

export default Login;
