import { loadHtml } from '../core/component-loader.js';

// Puts the sidebar into the page and highlights the link for the current page.
// activePage must match a data-page value in client/components/sidebar.html.
export async function renderSidebar(slot, activePage) {
  slot.innerHTML = await loadHtml('/components/sidebar.html');

  const activeLink = slot.querySelector(`[data-page="${activePage}"]`);
  if (activeLink) {
    activeLink.setAttribute('aria-current', 'page');
  }
}