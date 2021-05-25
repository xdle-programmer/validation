let $formDefault = document.getElementsByClassName('form-check')[0];

window.formDefault = new Validation({
    $form: $formDefault,
    errorWrapperClass: 'demo__error',
    errorShowClass: 'demo__input-wrapper--error'
});

window.formDefault.init();


class ValidationExtended extends Validation {
    constructor(options) {
        super(options);

        this.rulesList.set(
            'check-16', {
                checkEvents: ['change'],
                errorMessage: 'Поле содержит не 16 символов',
                functionCheck: this.validateContent16symbols,
            });
    }

    // Проверка контента, содержит ли поле 16 символов
    validateContent16symbols($field, $elem, errorMessage) {
        let val = $elem.value;
        let validate = val.length === 16;
        let priority = 100;

        return {
            validate: validate,
            message: errorMessage,
            priority: priority
        };
    }
}

let $formExtended = document.getElementsByClassName('form-check')[1];

window.formExtended = new ValidationExtended({
    $form: $formExtended,
    errorWrapperClass: 'demo__error',
    errorShowClass: 'demo__input-wrapper--error'
});
window.formExtended.init();
