import '@babel/polyfill';
import Polyfill from './polifill';
import Slip from './slipping';
import './map';

const polifill = new Polyfill();
const slip = new Slip();

polifill.closest();
slip.addEvents();
