import {INTERMEDIATE_PROJECTS_RESOLUTION, INTERMEDIATE_RESOLUTION, MOBILE_RESOLUTION, DESKTOP_RESOLUTION, FIXED_NAVBAR_CLASS_NAME, VISIBLE_NAVBAR_CLASS_NAME, SCROLL_HEIGHT} from './constants';
import {wrapHide, wrapList, projectsList, modalList} from './project-callback';
import {navbar} from './scroll';
import Slider from './slider';

export const slider = new Slider();

/**
 * Функция вычиляет размеры карточек проекта в зависимости от размеров окна.
 * И сбрасывает смещение слайдера в сторону.
 */
export const onWindowResize = function () {
  const width = wrapHide.offsetWidth;

  if (window.innerWidth > INTERMEDIATE_PROJECTS_RESOLUTION) {
    wrapHide.style.height = (projectsList.children.length - 1) > 12 ? `${width / slider.capacitySlider * 4 + SCROLL_HEIGHT}px` : `${width / slider.capacitySlider * 4}px`;
    wrapList.style.height = (projectsList.children.length - 1) > 12 ? `${width / slider.capacitySlider * 4 + SCROLL_HEIGHT}px` : `${width / slider.capacitySlider * 4}px`;
    projectsList.style.width = `${Math.ceil((projectsList.children.length - 1) / 4) * width / 3}px`;
  }

  if (window.innerWidth <= INTERMEDIATE_PROJECTS_RESOLUTION) {
    slider.sliderWidth = width;

    slider.capacitySlider = window.innerWidth > INTERMEDIATE_RESOLUTION ? 4 : 3;
    wrapHide.style.height = `${width / slider.capacitySlider * 2}px`;
    wrapList.style.height = wrapHide.style.height;
    projectsList.style.width = `${Math.ceil((projectsList.children.length - 1) / 2) / slider.capacitySlider * width}px`;

    if (window.innerWidth >= DESKTOP_RESOLUTION) {
      wrapList.style.transform = ``;
      slider.offset = 0;
    }

    slider.conversionTabIndex(projectsList);
  }

  Array.from(projectsList.children).forEach((it, i) => {
    if (i > 0) {
      it.style.width = `${width / slider.capacitySlider}px`;
      it.style.height = `${width / slider.capacitySlider}px`;
    }
  });

  if (document.documentElement.clientWidth > MOBILE_RESOLUTION) {
    modalList.style.width = `0`;
  }

  if (document.documentElement.clientWidth <= MOBILE_RESOLUTION) {
    navbar.classList.remove(FIXED_NAVBAR_CLASS_NAME);
    navbar.classList.remove(VISIBLE_NAVBAR_CLASS_NAME);
  }
};

onWindowResize();
