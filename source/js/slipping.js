import {DURATION_SCROLL} from './constants';
import animate from './animate';

class Slip {
  constructor() {
    this.anchors = document.querySelectorAll(`[href^="#"]`);
  }

  /**
   * Функция запускает `анимацию` плавного скрола к указанному якорю.
   * @param {Event} e
   */
  scrolling(e) {
    e.preventDefault();

    const target = e.target.href ? e.target.href.replace( /[^#]*(.*)/, '$1' ) : ``;

    if (target.length > 1) {
      const from = window.pageYOffset;
      let to = document.querySelector(target).getBoundingClientRect().top + window.pageYOffset;

      const scrollingBy = function (progress) {
        if (to < from) {
          window.scrollTo(0, from - (from - to) * progress);
        } else {
          window.scrollTo(0,  from + (to - from) * progress);
        }
      };

      animate(scrollingBy, DURATION_SCROLL, 'linear');
    }
  };

  /**
   * Функция развешивает колбэки плавной прокрутки на все подходящие для этого ссылки
   */
  addEvents() {
    Array.from(this.anchors).forEach((it) => {
      it.addEventListener(`click`, this.scrolling);
    });
  }
}

export default Slip;
