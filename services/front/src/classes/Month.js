import { ref, reactive } from 'vue';
import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
import utc from 'dayjs/plugin/utc';
import Day from './Day';

const monthsNames = [
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
];

dayjs.extend(objectSupport);
dayjs.extend(utc);

class Month {
  constructor(monthIndex, year) {
    this.monthIndex = monthIndex;
    this.year = year;
    this.title = monthsNames[monthIndex];
    this.days = [];
    this.setDays();
  }

  setDays() {
    const days = ref([]);
    const firstDay = dayjs.utc({
      year: this.year,
      month: this.monthIndex,
      day: 1,
    });
    const weekDay = firstDay.day() !== 0 ? firstDay.day() : 7;
    let currentDate = firstDay.subtract(weekDay - 1, 'days');

    for (let i = 35; i > 0; i -= 1) {
      const day = new Day(currentDate.format('YYYY-MM-DD'));
      if (this.monthIndex > day.day.month()) {
        day.setClass('prev-month');
      }

      if (this.monthIndex < day.day.month()) {
        day.setClass('next-month');
      }
      days.value.push(day);
      currentDate = currentDate.add(1, 'day');
    }

    this.days = reactive(days);
  }

  setActiveDay(day) {
    this.days.forEach((el) => {
      if (day.iso !== el.iso) {
        el.delClass('active');
      } else {
        el.setClass('active');
      }
    });
  }

  getActiveDay() {
    const activeDay = this.days.find((day) => {
      const activeClass = day.classes.find((el) => el === 'active');
      if (activeClass) {
        return true;
      }
      return false;
    });
    return activeDay || null;
  }
}

export default Month;
