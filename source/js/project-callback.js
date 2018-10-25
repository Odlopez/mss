import {
  ACTIVE_POPUP_CLASS_NAME,
  CLOSE_BUTTON_CLASS_NAME,
  PROJECT_BUTTON_CLASS_NAME,
  PROJECT_CLASS_NAME,
  KEY_CODE,
  ACTIVE_ITEM_CLASS_NAME,
  ACTIVE_PROJECT_CLASS_NAME,
  INTERMEDIATE_PROJECTS_RESOLUTION,
  MOBILE_RESOLUTION} from './constants';
import projectsData from './projects-data';
import createProjects from './create-projects';
import Modal from './modal';

const modal = new Modal();
const popupsWrap = document.querySelector(`.projects__project-popups`);
export const wrapList = document.querySelector(`.projects__wrap-list`);
export const wrapHide = document.querySelector(`.projects__wrap-hide`);
export const projectsList = document.querySelector(`.projects__list`);
export const modalList = document.querySelector(`.projects__item-modal`);

/**
 * Функция-callback открывающая блок с кратким описанием проекта
 * @param {Event} e
 */
const openDescription = function (e) {
  if (e.type.toLowerCase() === `keydown` && !(e.keyCode === KEY_CODE.ENTER)) {
    return;
  }

  // Если какая-либо карточка проекта уже открыта - закрываем ее.
  if (projectsObj.activeInput) {
    closeDescription(e);
  }

  // Записываем в глобальный объект информацию об активном проекте
  projectsObj.activeInput = e.target.closest(`li`);
  const project = projectsObj.activeInput.querySelector(`.${PROJECT_CLASS_NAME}`);

  // Определяем соответствующий этому проекту попап с кратким описанием и его кнопку закрытия
  const popup = projectsObj.popups[projectsObj.activeIndex()];
  const closeButton = popup.querySelector(`.${CLOSE_BUTTON_CLASS_NAME}`);

  // Высчитываем расстояние от активного элемента до верхушки родительского блока-обертки
  const spaceBelow = wrapHide.offsetHeight - projectsObj.activeInput.offsetTop - projectsObj.activeInput.offsetHeight;

  // Записываем в глобальный объект функцию удаления класса, чтобы ее потом можно было удалить из обработчика
  modal.removeclassFunc = modal.removeClass(ACTIVE_POPUP_CLASS_NAME, popupsWrap, closeDescription);

  // Открываем попап с кратким описанием проекта
  project.classList.add(ACTIVE_PROJECT_CLASS_NAME);
  popup.classList.add(ACTIVE_POPUP_CLASS_NAME);
  projectsObj.activeInput.classList.add(ACTIVE_ITEM_CLASS_NAME);

  // Определяем, в зависимости от расширения экрана и расстоянии активного элемента до родительского блока-обертки, положение попапа в окне
  if (document.documentElement.clientWidth > INTERMEDIATE_PROJECTS_RESOLUTION) {
    if (spaceBelow < popup.clientHeight) {
      popup.style.top = `${projectsObj.activeInput.offsetTop}px`;
      popup.style.transform = `translateY(-100%)`;
    } else {
      popup.style.top = `${projectsObj.activeInput.offsetTop + projectsObj.activeInput.clientHeight}px`;
    }
  } else {
    popup.style.top = `${projectsObj.activeInput.offsetTop + wrapHide.offsetTop}px`;
    popup.style.transform = `translateY(-100%)`;
  }

  // Если расширение экрана мобильное - отображаем оверлей.
  if (document.documentElement.clientWidth <= MOBILE_RESOLUTION) {
    modalList.style.width = `${projectsList.offsetWidth}px`;
    popupsWrap.style.height = `${wrapHide.offsetTop}px`;
  }

  // Запрещаем распространение события
  e.stopPropagation();

  // Переносим фокус на окно с кратким описанием объекта
  popup.tabIndex = 0;
  popup.focus();

  // Развешиваем обработчики событий
  e.target.removeEventListener(`click`, openDescription);
  closeButton.addEventListener(`click`, closeDescription);
  closeButton.addEventListener(`blur`, loopsFocus);
  document.addEventListener(`keydown`, modal.removeclassFunc);
  document.addEventListener(`click`, modal.removeclassFunc);
};

/**
 * Функция-callback закрывающая блок с кратким описанием проекта
 * @param {Event} e
 */
const closeDescription = function (e) {
  // Определяем открытые активные элементы и необходимые у них кнопки
  const popup = projectsObj.popups[projectsObj.activeIndex()];
  const projectButton = projectsObj.activeInput.querySelector(`.${PROJECT_BUTTON_CLASS_NAME}`);
  const closeButton = popup.querySelector(`.${CLOSE_BUTTON_CLASS_NAME}`);
  const project = projectsObj.activeInput.querySelector(`.${PROJECT_CLASS_NAME}`);

  // Скрываем все
  project.classList.remove(ACTIVE_PROJECT_CLASS_NAME);
  projectsObj.activeInput.classList.remove(ACTIVE_ITEM_CLASS_NAME);
  popup.classList.remove(ACTIVE_POPUP_CLASS_NAME);
  modalList.style.width = `0`;
  popupsWrap.style.height = `0`;

  // Запрещаем распространение события
  e.stopPropagation();

  // Убираем возможность фокусироваться на попапе, переносим фокус на "кнопку" проекта
  popup.tabIndex = ``;
  project.focus();

  // Удаляем из глобального объекта ссылку на активный элемент
  projectsObj.activeInput = null;

  // Удаляем обработчики событий
  projectButton.addEventListener(`click`, openDescription);
  closeButton.removeEventListener(`click`, closeDescription);
  closeButton.removeEventListener(`blur`, loopsFocus);
  document.removeEventListener(`keydown`, modal.removeclassFunc);
  document.removeEventListener(`click`, modal.removeclassFunc);
};

/**
 * Функция "клавиатурной ловушки", не позволяет фокусу "сбежать" с модального окна
 */
const loopsFocus = function () {
  projectsObj.popups[projectsObj.activeIndex()].focus();
};

export const projectsObj = new createProjects(projectsData, openDescription);
