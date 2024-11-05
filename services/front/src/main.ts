import 'bootstrap/dist/css/bootstrap.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-green/theme.css';
import 'primeflex/primeflex.css';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InputMask from 'primevue/inputmask';
import Checkbox from 'primevue/checkbox';
import Carousel from 'primevue/carousel';
import App from './App.vue';
import '@/assets/styles.scss';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(PrimeVue, {
  ripple: true,
});

app.component('PrimeDialog', Dialog);
app.component('InputText', InputText);
app.component('PrimeButton', Button);
app.component('InputMask', InputMask);
app.component('InputCheckbox', Checkbox);
app.component('PrimeCarousel', Carousel);

app.mount('#app');
