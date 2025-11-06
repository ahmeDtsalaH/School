import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Students from '../components/Students.vue';
import Teachers from '../components/Teachers.vue';
import Accounts from '../components/Accounts.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/students',
    name: 'Students',
    component: Students,
  },
  {
    path: '/teachers',
    name: 'Teachers',
    component: Teachers,
  },
  {
    path: '/accounts',
    name: 'Accounts',
    component: Accounts,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
