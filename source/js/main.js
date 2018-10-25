import '@babel/polyfill';
import Polyfill from './polifill';
import Slip from './slipping';

const polifill = new Polyfill();
const slip = new Slip();

polifill.closest();
slip.addEvents();
