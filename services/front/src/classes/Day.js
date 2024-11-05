import dayjs from 'dayjs';

class Day {
  constructor(isoDay) {
    this.iso = isoDay;
    this.number = null;
    this.isWeekend = null;
    this.day = null;
    this.classes = [];
    this.setDay();
  }

  setDay() {
    if (this.iso) {
      const day = dayjs(this.iso);
      const dayOfWeek = day.day();
      this.day = day;
      this.number = day.date();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        this.isWeekend = true;
      } else {
        this.isWeekend = false;
      }
    }
  }

  setClass(className) {
    const classes = new Set(this.classes);
    classes.add(className);
    this.classes = [...classes];
  }

  delClass(className) {
    const classes = new Set(this.classes);
    classes.delete(className);
    this.classes = [...classes];
  }
}

export default Day;
