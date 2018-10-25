import {FIXED_NAVBAR_CLASS_NAME, VISIBLE_NAVBAR_CLASS_NAME, MOBILE_RESOLUTION} from './constants';

export const navbar = document.querySelector(`.header__navigation`);

class Scroll {
  constructor() {
    this.direction = `bottom`;
    this.scrollTop = null;
  }

  /**
   * Определяет направление скрола и записывает его в свойство объекта конструктора
   * @param {this} self
   */
  getDirection(self) {
    if (document.documentElement.scrollTop > self.scrollTop) {
      self.direction = `bottom`;
      return;
    }
    self.direction = `top`;
  };

  /**
   * Возвращает функцию-callback для обработчика события scroll на window
   */
  onScroll() {
    const self = this;

    // Проявляет navbar в случае скролла пользователя вверх
    return function() {
      self.getDirection(self);

      if (document.documentElement.clientWidth > MOBILE_RESOLUTION) {
        if (self.scrollTop && self.direction === `top`) {
          navbar.classList.add(FIXED_NAVBAR_CLASS_NAME);
          setTimeout(function() {
            navbar.classList.add(VISIBLE_NAVBAR_CLASS_NAME);
          }, 0);
        } else if (self.direction === `bottom` && navbar.classList.contains(FIXED_NAVBAR_CLASS_NAME)) {
          navbar.classList.remove(VISIBLE_NAVBAR_CLASS_NAME);
          setTimeout(function() {
            navbar.classList.add(FIXED_NAVBAR_CLASS_NAME);
          }, 0);
        }
      }

      self.scrollTop = document.documentElement.scrollTop;
    }
  };
};

export default Scroll;
