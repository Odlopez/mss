import {KEY_CODE} from './constants';

/**
 * Функция определяет является ли один элемент потомком другого
 * @param {Node} parent
 * @param {Node} child
 */
const isDescendant = function (parent, child) {
  let node = child.parentNode;

  while (node != null) {
    if (node == parent) {
      return true;
    }

    node = node.parentNode;
  }
  return false;
}

class Modal {
  constructor() {
    this.removeclassFunc = null;
    this.closeFunc = null;
    this.popup = null;
  };

  /**
   * Возвращает функцию-callback, которая при запуске скрывает переданный в аргументе node-элемент
   * @param {Node} element
   */
  hide(element) {
    const self = this;

    return function (e) {
      element.style.display = `none`;

      document.removeEventListener(`click`, self.closeFunc);
      document.removeEventListener(`keydown`, self.closeFunc);

      self.closeFunc = null;
      self.popup = null;

      e.stopPropagation();
    }
  };

    /**
   * Возвращает функцию-callback, которая при запуске показывает переданный в аргументе node-элемент
   * @param {Node} element
   */
  open(element) {
    const self = this;

    return function (e) {
      // В случае, если открыт какой-то другой попап - запускает функцию закрывающую данный попап
      if (self.popup && self.popup !== element) {
        self.closeFunc(e);
      }

      self.popup = element;
      element.style.display = `block`;

      /*
        Записывает в объект конструктора за ключом closeFunc функцию-callback, которая при вызове закрывает текущий открытый попап.
        Таким образом сохраняется ссылка на безымянную функцию для того, чтобы можно было удалить обработчик события с ее `участием`.
      */
      self.closeFunc = self.close(self.popup);

      document.addEventListener(`click`, self.closeFunc);
      document.addEventListener(`keydown`, self.closeFunc);

      e.stopPropagation();
    }
  };

  /**
   * Возвращает функцию-callback, которая скрывает элемент при нажатии на esc или клике не на переданный в качестве аргумента элемент.
   * @param {Node} element
   */
  close(element) {
    const self = this;

    return function (e) {

      if (e.keyCode === KEY_CODE.ESC && element) {
        self.hide(element)(e);
      }

      if (e.type === `click` && e.target !== element && !isDescendant(element, e.target)) {
        self.hide(element)(e);
      }
    }
  };

  /**
   * Возвращает функцию-callback, удаляющую указанный класс у найденного по этому классу элементу
   * Если передан необязательный параметр wrap, то поиск элемента будет происходить в нем.
   * Если передан необязательный параметр removeFunc, то данная функция будет запускаться вместо простого удаления класса у элемента
   * @param {String} className
   * @param {Node} wrap
   * @param {Function} removeFunc
   */
  removeClass(className, wrap, removeFunc) {
    removeFunc = removeFunc || function () {element.classList.remove(className)};

    return function (e) {
      const element = wrap ? wrap.querySelector(`.${className}`) : document.querySelector(`.${className}`);

      if (e.keyCode === KEY_CODE.ESC && element) {
        removeFunc(e);
      };

      if (e.type === `click` && !e.target.closest(`.${className}`) && element) {
        removeFunc(e);
      }
    }
  }
};

export default Modal;
