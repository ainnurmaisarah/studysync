import { loadHtml } from '../core/component-loader.js';

// Puts the top bar into the page and shows the current page's title in it.
export async function renderNavbar(slot, pageTitle) {
  slot.innerHTML = await loadHtml('/components/navbar.html');
  slot.querySelector('#topbar-title').textContent = pageTitle;
}