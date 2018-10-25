import {KEY_CODE, MOBILE_RESOLUTION} from './constants';

export const mainMenuButton = document.querySelector(`.header__menu-button`);
export const wrap = document.querySelector(`.header__menus-inner`);
export const mainMenu = document.querySelector(`.main-menu`);
export const socialMenu = document.querySelector(`.header-social`);
export const mainMenuOverlay = document.querySelector(`.header__overlay`);

/**
 * Функция-callback для обработчика клика по кнопке открытия/закрытия функции
 */
const onButtonClick = function () {
  mainMenuButton.classList.toggle(`header__menu-button--close`);
  wrap.classList.toggle(`header__menus-inner--open`);
  mainMenu.classList.toggle(`main-menu--open`);
  socialMenu.classList.toggle(`header-social--open`);
  mainMenuOverlay.classList.toggle(`header__overlay--open`);
};

/**
 * Функция-callback для обрабочика нажатия клавиш на документе
 * @param {Event} e
 */
const onDocumentkeydown = function (e) {
  if(e.keyCode === KEY_CODE.ESC && mainMenuButton.classList.contains(`header__menu-button--close`)) {
    onButtonClick();
  }
};

/**
 * Функция-callback, которая следит за изменением расширения окна и, если оно больше мобильного разрешения при включенном меню - закрывает меню
 */
const onWindowResize = function () {
  if (window.innerWidth > MOBILE_RESOLUTION && mainMenuButton.classList.contains(`header__menu-button--close`)) {
    onButtonClick();
  }
};

/**
 * Функция-callback, закрывающая меню при клике на любой его пункт
 * @param {Event} e
 */
const onMenuClick = function (e) {
  if ((e.target.classList.contains(`header-social__link`) || e.target.classList.contains(`main-menu__link`)) && mainMenuButton.classList.contains(`header__menu-button--close`)) {
    onButtonClick();
  }
};

export const menuToggleFunctions = {
  onButtonClick: onButtonClick,
  onDocumentkeydown: onDocumentkeydown,
  onWindowResize: onWindowResize,
  onMenuClick: onMenuClick
};
