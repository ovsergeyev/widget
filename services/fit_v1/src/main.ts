import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './assets/styles/main.scss';
import App from './App.vue';
import PrimeVue, { defaultOptions } from 'primevue/config';
import Fitness from './presets/fitness';
// import Aura from './presets/aura';
import smoothScroll from './directives/smooth-scroll.directive';

import Button from 'primevue/button';
import Card from 'primevue/card';
import Checkbox from 'primevue/checkbox';
import DatePicker from 'primevue/datepicker';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputMask from 'primevue/inputmask';
import Menubar from 'primevue/menubar';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';

const pinia = createPinia();
const app = createApp(App);

app.use(PrimeVue, {
  unstyled: true,
  pt: Fitness,
  // theme: {
  //   preset: Aura,
  // },
  locale: {
    ...defaultOptions.locale,
    firstDayOfWeek: 1,
    dayNames: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
    dayNamesShort: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
    dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    monthNames: [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь',
    ],
    monthNamesShort: [
      'Янв',
      'Февр',
      'Март',
      'Апр',
      'Май',
      'Июнь',
      'Июль',
      'Авг',
      'Сент',
      'Окт',
      'Ноя',
      'Дек',
    ],
  },
});
app.use(pinia);
app.use(ToastService);

app.component('Button', Button);
app.component('Card', Card);
app.component('Checkbox', Checkbox);
app.component('DatePicker', DatePicker);
app.component('Dialog', Dialog);
app.component('InputMask', InputMask);
app.component('InputText', InputText);
app.component('Menubar', Menubar);
app.component('Toast', Toast);

app.directive('smooth-scroll', smoothScroll);

app.mount('#app');
