const OPEN_CLASS = 'sidebar-open';
const DESKTOP_QUERY = '(min-width: 992px)';

// Opens and closes the sidebar drawer on tablet and mobile screens.
// On desktop the sidebar is always visible, so this has no visible effect there.
export function initNavigation() {
  const toggleButton = document.getElementById('sidebar-toggle');
  const overlay = document.getElementById('sidebar-overlay');
  const sidebar = document.getElementById('sidebar');
  if (!toggleButton || !overlay || !sidebar) return;

  function setOpen(isOpen) {
    document.body.classList.toggle(OPEN_CLASS, isOpen);
    toggleButton.setAttribute('aria-expanded', String(isOpen));
  }

  function isOpen() {
    return document.body.classList.contains(OPEN_CLASS);
  }

  toggleButton.addEventListener('click', () => setOpen(!isOpen()));
  overlay.addEventListener('click', () => setOpen(false));

  sidebar.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggleButton.focus();
    }
  });

  // If the window grows to desktop width while the drawer is open, close it.
  window.matchMedia(DESKTOP_QUERY).addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}