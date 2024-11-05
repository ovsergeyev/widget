import axios, { AxiosInstance } from 'axios';

export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const part = parts.pop();
    if (part !== undefined) {
      return part.split(';').shift() || null;
    }
  }
  return null;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

export const setCookie = (name: string, value: string, expire: string | null = null) => {
  let expireString = null;
  if (!expire) {
    const date = new Date();
    date.setTime(date.getTime() + (1 * 24 * 60 * 60 * 1000));
    expireString = "expires=" + date.toUTCString();
  } else {
    const date = new Date(expire);
    expireString = "expires=" + date.toUTCString();
  }

  let cookieString = `${name}=${value};${expireString};path=/;Secure;SameSite=None`;

  document.cookie = cookieString;
}