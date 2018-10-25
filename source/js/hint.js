import {HINT_LIFETIME, HINT_CLASS_NAMES, SUBMIT_CLASS_NAME, HINT_MESSAGES} from './constants';

/**
 * Функция принимает в качестве параметра `ссылку` на форму и удаляет в этой форме сообщение-подсказку
 * @param {Node} form
 */
const deleteHint = function (form) {
  const hint = form.querySelector(`.${HINT_CLASS_NAMES.MAIN}`);

  if (hint) {
    form.removeChild(hint);
  }
};

/**
 * Функция принимает `ссылку` на форму и информацию о ее валидности, на основании которой создает сообщение-подсказу и отрисовывает ее в документе.
 * В случае, если форма заполнена корректно, через заданный интервал удаляет сообщение-подсказку.
 * @param {Node} form
 * @param {String} correctness
 */
const createHint = function (form, correctness) {
  const hint = document.createElement(`span`);

  hint.className = `${HINT_CLASS_NAMES.MAIN} ${correctness !== `valid` ? HINT_CLASS_NAMES.ERROR : ``} ${HINT_CLASS_NAMES.MAIN}--${form.name}`;
  hint.textContent = HINT_MESSAGES[form.name][correctness];
  hint.setAttribute(`aria-live`, `polite`);
  hint.setAttribute(`role`, `status`);

  deleteHint(form);
  form.querySelector(`.${SUBMIT_CLASS_NAME}`).insertAdjacentElement(`afterend`, hint);

  if (!hint.classList.contains(HINT_CLASS_NAMES.ERROR)) {
    setTimeout(function() {
      deleteHint(form);
    }, HINT_LIFETIME);

    return true;
  }
};

export default createHint;
