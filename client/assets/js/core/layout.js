import { renderSidebar } from '../components/sidebar.js';
import { renderNavbar } from '../components/navbar.js';
import { initNavigation } from './navigation.js';

// Every app page (dashboard, assignments, ...) calls this once.
// The page needs <div id="sidebar-slot"> and <div id="navbar-slot"> in its HTML.
export async function initAppLayout({ activePage, title }) {
  const sidebarSlot = document.getElementById('sidebar-slot');
  const navbarSlot = document.getElementById('navbar-slot');

  try {
    await Promise.all([
      renderSidebar(sidebarSlot, activePage),
      renderNavbar(navbarSlot, title),
    ]);
  } catch (error) {
    console.error(error);
    navbarSlot.className = 'alert alert-danger m-3';
    navbarSlot.textContent = 'The navigation could not be loaded. Please refresh the page.';
    return;
  }

  initNavigation();
}