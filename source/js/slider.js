import {PROJECT_CLASS_NAME, SLIDER_DURATION} from './constants';
import {wrapHide, wrapList, projectsList} from './project-callback';

const buttonRight = wrapHide.querySelector(`.projects__slider-button--right`);
const buttonLeft = wrapHide.querySelector(`.projects__slider-button--left`);

class Slider {
  constructor() {
    this.rightButton = buttonRight;
    this.leftButton = buttonLeft;
    this.offset = 0;
    this.capacitySlider = 3;
    this.sliderWidth = wrapHide.offsetWidth;
  };

  /**
   * Возвращает функцию-callback для кнопок слайдера (в зависимости от переданной строки - на левую или на правую)
   * @param {String} direction
   */
  translate(direction) {
    const self = this;
    let calculateOffset;

    // Определяем в зависимости от кнопки функцию расчета величины смещения слайдера
    if (direction === `right`) {
      calculateOffset = function () {
        const projectWidth = self.sliderWidth / self.capacitySlider;
        return (Math.round(self.offset / projectWidth) - 1) * projectWidth;
      }
    } else {
      calculateOffset = function () {
        const projectWidth = self.sliderWidth / self.capacitySlider;
        return (Math.round(self.offset / projectWidth) + 1) * projectWidth;
      }
    }

    return function (e) {
      // Вычисляем размер сдвига и смещаем слайдер на эту величину
      self.offset = calculateOffset();
      wrapList.style.transform = `translateX(${self.offset}px)`;

      // Расставляет табиндексы кнопкам после того, как слайдер переместится
      setTimeout(function() {
        self.conversionTabIndex(projectsList);
      }, SLIDER_DURATION);

      // Отключаем ту или иную кнопку, в случае, если слайдер больше некуда листать
      if (self.offset >= -10) {
        self.rightButton.style.display = `none`;
        self.leftButton.style.display = `block`;
        self.offset = 0;
      } else {
        self.rightButton.style.display = `block`;
      }

      if (self.offset <= (projectsList.offsetWidth - self.sliderWidth) * -1) {
        self.leftButton.style.display = `none`;
        self.rightButton.style.display = `block`;
        self.offset = (projectsList.offsetWidth - self.sliderWidth) * -1;
      } else {
        self.leftButton.style.display = `block`;
      }
    };
  };

  /**
   * Возвращает функцию-callback для работы слайдера на touch-устройствах
   * @param {Node} elem
   */
  touchSlide(elem) {
    const self = this;

    return function (e) {
      let start = e.changedTouches[0].pageX;

      const onElementTouchmove = function (e) {
        let end = e.changedTouches[0].pageX;

        elem.style.transition = `none`;
        self.offset = self.offset + end - start;

        elem.style.transform = `translateX(${self.offset}px)`;

        start = end;
      }

      const onElementTouchend = function (e) {
        const projectWidth = self.sliderWidth / self.capacitySlider;

        elem.style.transition = ``;
        self.offset = Math.round(self.offset / projectWidth) * projectWidth;

        // Отключаем ту или иную кнопку, в случае, если слайдер больше некуда листать
        if (self.offset >= 0) {
          self.rightButton.style.display = `none`;
          self.leftButton.style.display = `initial`;
          self.offset = 0;
        } else {
          self.rightButton.style.display = `initial`;
        }

        if (self.offset <= (projectsList.offsetWidth - self.sliderWidth) * -1) {
          self.leftButton.style.display = `none`;
          self.rightButton.style.display = `initial`;
          self.offset = (projectsList.offsetWidth - self.sliderWidth) * -1;
        } else {
          self.leftButton.style.display = `initial`;
        }
        elem.style.transform = `translateX(${self.offset}px)`;


        elem.removeEventListener(`touchmove`, onElementTouchmove);
        elem.removeEventListener(`touchend`, onElementTouchmove);
      }

      elem.addEventListener(`touchmove`, onElementTouchmove);
      elem.addEventListener(`touchend`, onElementTouchend);
    }
  };

  /**
   * Проверяет все элементы списка, и если некоторые из них находятся вне экрана - назначает таким элементам tabindex = -1;
   * @param {Node} list
   */
  conversionTabIndex(list) {
    Array.from(list.children).forEach((it) => {
      const project = it.querySelector(`.${PROJECT_CLASS_NAME}`);

      if (project) {
        const indent = it.getBoundingClientRect().x;
        project.tabIndex = (Math.ceil(indent) < document.documentElement.clientWidth && Math.ceil(indent) >= 0) ? 0 : -1;
      }
    });
  }

  /**
   * Вешает обработчик клика на кнопки слайдера
   */
  addEvents() {
    this.rightButton.addEventListener(`click`, this.translate(`left`));
    this.leftButton.addEventListener(`click`, this.translate(`right`));
    wrapList.addEventListener(`touchstart`, this.touchSlide(wrapList));
  };
}

export default Slider;
