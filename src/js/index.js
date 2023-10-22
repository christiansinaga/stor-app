// Import our custom CSS
import '../scss/main.scss';

// Import components
import './components/index';

// Import javascript file as needed
import Home from './pages/home';
import Add from './pages/story/add';
import Dashboard from './pages/story/dashboard';
import Login from './pages/auth/login';
import Register from './pages/auth/register';


import './utils/firebase';
import { Forms, Buttons, Transitions, Dropdowns, Cards, Close, Modals, Spinners } from 'bootstrap';

const routes = {
  '/': Home,
  '/index.html': Home,
  '/story/add.html': Add,
  '/story/dashboard.html': Dashboard,
  '/auth/login.html': Login,
  '/auth/register.html': Register,
};

const detectRoute = () => routes[window.location.pathname];

const initPages = () => {
  const main = document.querySelector('main');
  const footer = document.querySelector('footer');

  if (main && footer) {
    main.style.minHeight = `calc(100vh - ${footer.clientHeight}px)`;
  }
};

window.addEventListener('DOMContentLoaded', async () => {
  initPages();

  const route = detectRoute();
  console.log(route);
  route.init();
});
