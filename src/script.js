(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === "object") {
        // Node/CommonJS
        module.exports = factory();
    } else {
        // Browser globals
        window.Validation = factory();
    }
})(function () {

    class Validation {

        /* Example options
        {
            formClass:'form-check',     // String
            $form:document.getElementsByClassName(this.formClass)[0],       // node element
            formFieldClass:'form-check__field',     // String
            $formFields:document.getElementsByClassName('form-check__field'),       // html collection
            errorWrapperClass:'form-check__error',     // String
            errorShowClass:'form-check__error--show',     // String
            buttonClass:'form-check__button',     // String
            $button:document.getElementsByClassName(this.formClass)[0],       // node element
            buttonDisabledClass:'form-check__button--disabled',     // String
        }
         */

        constructor(options) {
            this.formClass = options && options.formClass ? options.formClass : 'form-check';
            this.$form = options && options.$form ? options.$form : document.getElementsByClassName(this.formClass)[0];

            this.formFieldClass = options && options.formClass ? options.formClass : 'form-check__field';
            this.$formFields = options && options.$formFields ? options.$formFields : this.$form.getElementsByClassName(this.formFieldClass);
            this.errorWrapperClass = options && options.errorWrapperClass ? options.errorWrapperClass : 'form-check__error';
            this.errorShowClass = options && options.errorShowClass ? options.errorShowClass : 'form-check__error--show';
            this.buttonClass = options && options.buttonClass ? options.buttonClass : 'form-check__button';
            this.$button = options && options.$button ? options.$button : this.$form.getElementsByClassName(this.buttonClass)[0];
            this.buttonDisabledClass = options && options.buttonDisabledClass ? options.buttonDisabledClass : 'form-check__button--disabled';

            this.rulesList = new Map([
                ['input-empty', {
                    checkEvents: ['change'],
                    errorMessage: 'Обязательное поле',
                    functionCheck: this.validateInputEmpty,
                }],
                ['min-count-symbol', {
                    checkEvents: ['change'],
                    errorMessage: 'Минимум символов: ',
                    functionCheck: this.validateMinCountSymbols,
                }],
            ]);
        }

        init() {
            this.fieldsArray = this.createFieldsArray();
            this.addAllListeners();
            this.createErrorWrappers();
            this.validationForm(false);
        }

        // Создание объекта с полями
        createFieldsArray() {
            let fieldsArray = [];

            for (let $formField of this.$formFields) {

                // Собираем дата атрибуты для определения типа проверки и элемента
                let elem = $formField.dataset.elem;
                let rules = $formField.dataset.rule.split(', ');

                // Определяем элемент, который будем проверять
                let $elem;

                if (elem !== 'self-dispatch') {
                    $elem = $formField.querySelector(elem);
                } else {
                    $elem = $formField;
                }

                let fieldObject = {
                    elem: elem,
                    rules: rules,
                    $elem: $elem,
                    $field: $formField
                };

                fieldsArray.push(fieldObject);
            }

            return fieldsArray;
        }

        // Валидация всей формы
        validationForm(showError) {
            let errors = [];

            for (let field of this.fieldsArray) {
                let error = this.validateField(field, showError);

                if (error !== false) {
                    errors.push(error);
                }
            }

            if (errors.length > 0) {
                this.$button.classList.add(this.buttonDisabledClass);
            } else {
                this.$button.classList.remove(this.buttonDisabledClass);
            }
        }

        // Валидация одного поля
        validateField(field, showError) {
            let errors = [];

            // Выполняем последовательно проверки
            for (let rule of field.rules) {
                let errorMessage = this.rulesList.get(rule).errorMessage;

                let validateResult = this.rulesList.get(rule).functionCheck(field.$field, field.$elem, errorMessage);

                if (!validateResult.validate) {
                    errors.push(validateResult);
                }
            }

            // Определяем наиболее приоритетную ошибку и оставляем в массиве только ее
            if (errors.length > 0) {
                errors.sort((a, b) => {
                    return a.priority < b.priority ? 1 : -1;
                });

                errors = errors[0];
            } else {
                field.$field.classList.remove(this.errorShowClass);
                return false;
            }

            field.$error.textContent = errors.message;

            if (showError) {
                field.$field.classList.add(this.errorShowClass);
            }

            return errors;
        }

        // Создание полей с ошибками
        createErrorWrappers() {
            for (let field of this.fieldsArray) {
                let template = `<div class="${this.errorWrapperClass}"></div>`;

                if (field.$field.getElementsByClassName(this.errorWrapperClass).length > 0) {
                    field.$field.insertAdjacentHTML('beforeEnd', template);
                }

                field.$field.insertAdjacentHTML('beforeEnd', template);
                field.$error = field.$field.getElementsByClassName(this.errorWrapperClass)[0];
            }
        }

        // Создание событий
        addAllListeners() {
            for (let field of this.fieldsArray) {
                for (let rule of field.rules) {
                    let eventChecks = this.rulesList.get(rule).checkEvents;

                    for (let eventCheck of eventChecks) {
                        field.$elem.addEventListener(eventCheck, () => {
                            this.validateField.bind(this, field, true)();
                            this.validationForm.bind(this, false)();
                        });
                    }
                }
            }

            this.$button.addEventListener('click', (event) => {
                event.preventDefault();
                this.validationForm(true);
            });
        }

        // Проверка пустого поля
        validateInputEmpty($field, $elem, errorMessage) {
            let val = $elem.value;
            let validate = val !== '';
            let priority = 100;

            return {
                validate: validate,
                message: errorMessage,
                priority: priority
            };
        }

        // Проверка минимального количества символов
        validateMinCountSymbols($field, $elem, errorMessage) {
            let val = $elem.value;
            let minCount = parseInt($field.dataset.minCountSymbol);
            let validate = val.length >= minCount;
            let message = errorMessage + minCount;
            let priority = 200;

            return {
                validate: validate,
                message: message,
                priority: priority
            };
        }
    }

    return Validation;
});
