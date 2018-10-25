import {PATH_TO_IMAGE, LIST_CLASS_NAME, ITEM_CLASS_NAME, POPUP_CLASS_NAME, SQUARE_PROJECT_CLASS_NAME, MOBILE_RESOLUTION, TABLET_RESOLUTION} from './constants';

const projectsList = document.querySelector(`.${LIST_CLASS_NAME}`);
const popupsWrap = document.querySelector(`.projects__project-popups`);

class Project {
  constructor(dataArray, callback) {
    this.projects = [];
    this.popups = [];
    this.activeInput = null;
    this.makeElements(dataArray);
    this.addEvents(callback);
  };

  /**
   * Возвращает шаблон карточки проекта в виде строки
   */
  get templateProject() {
    return `<acrticle class="projects__project project" tabindex="0">
    <button class="project__button" type="button" tabindex="-1">Read more</button>
      <picture class="project__picture">
        <img class="project__logo project__logo--d" src="" alt="">
      </picture>
      <picture class="project__picture-active">
        <img class="project__logo-active project__logo-active--d" src="" alt="">
      </picture>
    </acrticle>`;
  };

  /**
   * Возвращает шаблон краткого описания проекта в виде строки
   */
  get templateDescription() {
    return `<h3 class="popup__headline"></h3>
    <p class="popup__text"></p>
    <a class="popup__link" href="" target="_blank"></a>
    <button class="popup__close-button" type="button">
      <picture>
        <source media="(max-width: 640px)" srcset="img/decorative/btn-close.png">
        <source media="(max-width: 768px)" srcset="img/decorative/search-btn-t.png">
        <img src="img/decorative/search-btn-d.png" alt="close">
      </picture>
    </button>`;
  };

  /**
   * Возвращает шаблон тега picture внутри карточки проекта в случае, если изображения адаптивные
   */
  get templateAdaptiveImage() {
    return `<source class="project__logo project__logo--m" media="(max-width: ${MOBILE_RESOLUTION}px)">
    <source class="project__logo project__logo--t" media="(max-width: ${TABLET_RESOLUTION}px)">
    <img class="project__logo project__logo--d" src="" alt="">`;
  };

  /**
   * Возвращает шаблон тега picture внутри карточки проекта для активного изображения в случае, если изображения адаптивные
   */
  get templateAdaptiveActiveImage() {
    return `<source class="project__logo-active project__logo-active--m" media="(max-width: ${MOBILE_RESOLUTION}px)">
    <source class="project__logo-active project__logo-active--t" media="(max-width: ${TABLET_RESOLUTION}px)">
    <img class="project__logo-active project__logo-active--d" src="" alt="">`;
  };

  /**
   * Возвращает индекс активного проекта в массиве всех проектов.
   */
  activeIndex() {
    return this.projects.indexOf(this.activeInput);
  };

  /**
   * Создает и возвращает node-элемент карточки проекта на основе шаблона templateProject
   */
  createProject() {
    const wrap = document.createElement(`li`);
    wrap.className = ITEM_CLASS_NAME;
    wrap.innerHTML = this.templateProject;

    return wrap;
  };
  /**
   * Создает и возвращает node-элемент краткого описания проекта на основе шаблона templateDescription
   */
  createDescription() {
    const wrap = document.createElement(`div`);
    wrap.className = POPUP_CLASS_NAME;
    wrap.innerHTML = this.templateDescription;

    return wrap;
  };

  /**
   * Заполняет данными node-элемент карточки поректа на основе переданных в оюъекте данных.
   * Возвращает заполненный node-элемент.
   * @param {Object} data
   */
  fillElement(data) {
    const elem = this.createProject();

    if (data.isSquareLogo) {
      elem.querySelector(`.project`).classList.add(SQUARE_PROJECT_CLASS_NAME);
    }

    if (data.isOnlyImage) {
      elem.querySelector(`.project__logo--d`).src = `${PATH_TO_IMAGE}${data.image}.${data.extension}`;
      elem.querySelector(`.project__logo-active--d`).src = `${PATH_TO_IMAGE}${data.image}-active.${data.extension}`;
    } else {
      const picture = elem.querySelector(`.project__picture`);
      const pictureActive = elem.querySelector(`.project__picture-active`);

      picture.innerHTML = this.templateAdaptiveImage;
      pictureActive.innerHTML = this.templateAdaptiveActiveImage;


      picture.querySelector(`.project__logo--t`).srcset = `${PATH_TO_IMAGE}${data.image}-t.${data.extension}`;
      picture.querySelector(`.project__logo--m`).srcset = `${PATH_TO_IMAGE}${data.image}-m.${data.extension}`;
      picture.querySelector(`.project__logo--d`).src = `${PATH_TO_IMAGE}${data.image}-d.${data.extension}`;

      pictureActive.querySelector(`.project__logo-active--t`).srcset = `${PATH_TO_IMAGE}${data.image}-active-t.${data.extension}`;
      pictureActive.querySelector(`.project__logo-active--m`).srcset = `${PATH_TO_IMAGE}${data.image}-active-m.${data.extension}`;
      pictureActive.querySelector(`.project__logo-active--d`).src = `${PATH_TO_IMAGE}${data.image}-active-d.${data.extension}`;
    }

    if (data.width) {
      elem.querySelector(`.project__logo--d`).style.width = data.width;
      elem.querySelector(`.project__logo-active--d`).style.width = data.width;
    }

    elem.querySelector(`.project__logo`).alt = data.alt;
    elem.querySelector(`.project__logo-active`).alt = data.alt;

    return elem;
  };

  /**
   * Заполняет данными node-элемент краткого описания поректа на основе переданных в оюъекте данных.
   * Возвращает заполненный node-элемент.
   * @param {Object} data
   */
  fillDescription(data) {
    const elem = this.createDescription();
    elem.querySelector(`.popup__headline`).textContent = data.headline;
    elem.querySelector(`.popup__text`).textContent = data.text;
    elem.querySelector(`.popup__link`).href = data.link;
    elem.querySelector(`.popup__link`).textContent = data.link;

    return elem;
  }

  /**
   * Принимает массив с объектами, содержащими данные о проектах, на основе которых создает карточки проектов и помещает их в разметку
   * @param {Array} array
   */
  makeElements(array) {
    array.forEach((it) => {
      const project = this.fillElement(it);
      const description = this.fillDescription(it)

      projectsList.appendChild(project);
      popupsWrap.appendChild(description);
      this.projects.push(project);
      this.popups.push(description);
    });
  };

  /**
   * Функция проходит по всем карточкам проекта и вешает обработчики событий на кнопки развертывания краткого описания объекта
   * @param {Function} callback
   */
  addEvents(callback) {
    this.projects.forEach((it) => {
      // const button = it.querySelector(`.${PROJECT_BUTTON_CLASS_NAME}`);

      it.addEventListener(`click`, callback);
      it.addEventListener(`keydown`, callback);
    });
  };
}

export default Project;
