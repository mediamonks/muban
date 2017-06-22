/**
 * Code being executed on production builds on start
 */
import { initComponents } from './component/components';

// Makes the website interactive, all hbs components are already loaded and registered, since they
// are included in the webpack entry
const div = document.body;
initComponents(div);
