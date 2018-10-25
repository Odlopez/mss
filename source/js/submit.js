import Form from './form';
import createHint from './hint';

/**
 * Функци- callback для форм. При сабмите создает объект из конструктора форм и с помощью его методов создает и отрисовыывает сообщение-подсказку пользователю
 * @param {Event} e
 */
const onSubmitClick = function (e) {
  e.preventDefault();
  const formObj = new Form(e.target.form);
  const isSuccessful = createHint(formObj.form, formObj.correctness);
  if (isSuccessful) {
    e.target.form.reset();
  }
}

export default onSubmitClick;
