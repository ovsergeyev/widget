import { createApp } from 'vue'
import router from './router.ts';
// import './style.css'
import './assets/styles/main.scss';
import App from './App.vue'
import PrimeVue, { defaultOptions } from 'primevue/config';
// import mainPreset from './assets/presets/index.ts';
import Fitness from './presets/fitness';

import Button from 'primevue/button';
import Card from 'primevue/card';
import DatePicker from 'primevue/datepicker';
import InputText from 'primevue/inputtext';
import InputMask from 'primevue/inputmask';
import Menubar from 'primevue/menubar';

const app = createApp(App);

app.use(router);

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

app.component('Button', Button);
app.component('Card', Card);
app.component('DatePicker', DatePicker);
app.component('InputMask', InputMask);
app.component('InputText', InputText);
app.component('Menubar', Menubar);

console.log('vue', app);

app.mount('#app');
