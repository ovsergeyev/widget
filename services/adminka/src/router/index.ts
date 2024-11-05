import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// import MainPage from '../views/MainPage.vue';
import Profile from '@/views/Profile.vue';
import Users from '@/views/Users.vue';
import User from '@/views/User.vue';
import { useAuthStore } from '@/store/auth';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'main',
    component: Profile,
  },
  {
    path: '/users',
    name: 'users',
    component: Users,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/profile/:user_id',
    name: 'profile',
    component: User,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: User,
    meta: {
      requiresAuth: true,
      role: 'client'
    }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();

  if (!authStore.authChecked) {
    await authStore.getCurrentUser();
    authStore.authChecked = true
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    // console.log('isLogin', authStore.isLogin())
    if (!authStore.isLogin()) {
      console.log('login')
    } else if (to.meta.role !== authStore.user.role) {
      next({ path: '/' })
    } else {
      next();
    }
  } else {
    next();
  }
})

export default router;
