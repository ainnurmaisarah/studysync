import { initAppLayout } from '../core/layout.js';
import { formatLongDate } from '../utils/formatters.js';

initAppLayout({ activePage: 'dashboard', title: 'Dashboard' });

document.getElementById('today-date').textContent = formatLongDate(new Date());