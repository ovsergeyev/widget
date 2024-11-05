import axios, { AxiosInstance } from 'axios';

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const waitForElement = (selector: string, interval: number, timeout: number) => {
  return new Promise((resolve, reject) => {
    const targetEl = document.querySelector(selector);
    if (targetEl) {
      resolve(targetEl);
      return;
    }

    const maxAttempts = Math.floor(timeout / interval);
    let attempts = 0;

    const intervalId = setInterval(() => {
      const newTargetEl = document.querySelector(selector);
      if (newTargetEl) {
        clearInterval(intervalId);
        resolve(newTargetEl);
      } else {
        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(intervalId);
          reject(new Error(`Element with selector "${selector}" not found`));
        }
      }
    }, interval);
  });
};

export const getWordWithCaseByNumber = (words: string[], number: number): string => {
  let wordIndex: number;

  // Если число равно 1 или заканчивается на 1 (но не 11), то это именительный падеж
  if (number === 1 || (number % 10 === 1 && number !== 11)) {
    wordIndex = 0; // nominative case
  }

  // Если число от 2 до 4 (кроме 11-14), то это родительный падеж
  else if ((number % 10 >= 2 && number % 10 <= 4) && (number < 10 || number >= 20)) {
    wordIndex = 1; // genitive case
  }
  // Если число от 5 до 20 или заканчивается на 5-9 (кроме 11-14), то это родительный падеж множественного числа
  else if ((number >= 5 && number <= 20) || (number % 10 >= 5 && number % 10 <= 9 && (number < 10 || number >= 20))) {
    wordIndex = 2; // genitive case plural
  }
  // Во всех остальных случаях это родительный падеж множественного числа
  else {
    wordIndex = 2; // genitive case plural
  }

  return words[wordIndex];
};

export const getPriceString = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};
