import { createRouter, createWebHistory } from 'vue-router'
// import Home from './components/Home.vue'
import Buttons from './views/Buttons.vue';
import Calendar from './views/Calendar.vue';
import Cards from './views/Cards.vue';
import Forms from './views/Forms.vue';
import Home from './views/Home.vue';
import Test from './views/Test.vue';
import Typography from './views/Typography.vue';
import Widget from './views/Widget.vue';

const routes = [
  { path: '/', component: Widget },
  { path: '/buttons', component: Buttons },
  { path: '/calendar', component: Calendar },
  { path: '/cards', component: Cards },
  { path: '/forms', component: Forms },
  { path: '/test', component: Test },
  { path: '/typography', component: Typography },
  { path: '/widget', component: Widget },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router