/**
 * This file is the webpack entry for all scripts that must be used in the website.
 */
import 'modernizr';

import { initComponents } from "./component/components";

const div = document.body;
initComponents(div);
