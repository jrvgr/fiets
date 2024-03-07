import { writable } from 'svelte/store';
import './app.css'
import App from './App.svelte'

const targetElement = document.getElementById('app');
const app = new App({
  target: targetElement ? targetElement : document.body,
})

export const latestCode = writable(localStorage.getItem('latestCode') || '');
export default app
