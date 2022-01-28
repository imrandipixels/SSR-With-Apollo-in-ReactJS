// ./routes/index.js
import MainPage from '../../src/container/Home';
import AnotherPage from '../../src/container/About';

const routes = [
  {
    path: '/',
    name: 'home',
    exact: true,
    component: MainPage,
  },
  {
    path: '/another',
    name: 'another',
    component: AnotherPage,
  },
];

export default routes;
