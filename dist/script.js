"use strict";

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (factory) {
  if (typeof define === "function" && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object") {
    // Node/CommonJS
    module.exports = factory();
  } else {
    // Browser globals
    window.Validation = factory();
  }
})(function () {
  var Validation = /*#__PURE__*/function () {
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
    function Validation(options) {
      _classCallCheck(this, Validation);

      this.formClass = options && options.formClass ? options.formClass : 'form-check';
      this.$form = options && options.$form ? options.$form : document.getElementsByClassName(this.formClass)[0];
      this.formFieldClass = options && options.formClass ? options.formClass : 'form-check__field';
      this.$formFields = options && options.$formFields ? options.$formFields : this.$form.getElementsByClassName(this.formFieldClass);
      this.errorWrapperClass = options && options.errorWrapperClass ? options.errorWrapperClass : 'form-check__error';
      this.errorShowClass = options && options.errorShowClass ? options.errorShowClass : 'form-check__error--show';
      this.buttonClass = options && options.buttonClass ? options.buttonClass : 'form-check__button';
      this.$button = options && options.$button ? options.$button : this.$form.getElementsByClassName(this.buttonClass)[0];
      this.buttonDisabledClass = options && options.buttonDisabledClass ? options.buttonDisabledClass : 'form-check__button--disabled';
      this.rulesList = new Map([['input-empty', {
        checkEvents: ['change'],
        errorMessage: 'Обязательное поле',
        functionCheck: this.validateInputEmpty
      }], ['min-count-symbol', {
        checkEvents: ['change'],
        errorMessage: 'Минимум символов: ',
        functionCheck: this.validateMinCountSymbols
      }]]);
    }

    _createClass(Validation, [{
      key: "init",
      value: function init() {
        this.fieldsArray = this.createFieldsArray();
        this.addAllListeners();
        this.createErrorWrappers();
        this.validationForm(false);
      } // Создание объекта с полями

    }, {
      key: "createFieldsArray",
      value: function createFieldsArray() {
        var fieldsArray = [];

        var _iterator = _createForOfIteratorHelper(this.$formFields),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var $formField = _step.value;
            // Собираем дата атрибуты для определения типа проверки и элемента
            var elem = $formField.dataset.elem;
            var rules = $formField.dataset.rule.split(', '); // Определяем элемент, который будем проверять

            var $elem = void 0;

            if (elem !== 'self-dispatch') {
              $elem = $formField.querySelector(elem);
            } else {
              $elem = $formField;
            }

            var fieldObject = {
              elem: elem,
              rules: rules,
              $elem: $elem,
              $field: $formField
            };
            fieldsArray.push(fieldObject);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        return fieldsArray;
      } // Валидация всей формы

    }, {
      key: "validationForm",
      value: function validationForm(showError) {
        var errors = [];

        var _iterator2 = _createForOfIteratorHelper(this.fieldsArray),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var field = _step2.value;
            var error = this.validateField(field, showError);

            if (error !== false) {
              errors.push(error);
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        if (errors.length > 0) {
          this.$button.classList.add(this.buttonDisabledClass);
        } else {
          this.$button.classList.remove(this.buttonDisabledClass);
        }
      } // Валидация одного поля

    }, {
      key: "validateField",
      value: function validateField(field, showError) {
        var errors = []; // Выполняем последовательно проверки

        var _iterator3 = _createForOfIteratorHelper(field.rules),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var rule = _step3.value;
            var errorMessage = this.rulesList.get(rule).errorMessage;
            var validateResult = this.rulesList.get(rule).functionCheck(field.$field, field.$elem, errorMessage);

            if (!validateResult.validate) {
              errors.push(validateResult);
            }
          } // Определяем наиболее приоритетную ошибку и оставляем в массиве только ее

        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        if (errors.length > 0) {
          errors.sort(function (a, b) {
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
      } // Создание полей с ошибками

    }, {
      key: "createErrorWrappers",
      value: function createErrorWrappers() {
        var _iterator4 = _createForOfIteratorHelper(this.fieldsArray),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var field = _step4.value;
            var template = "<div class=\"".concat(this.errorWrapperClass, "\"></div>");

            if (field.$field.getElementsByClassName(this.errorWrapperClass).length > 0) {
              field.$field.insertAdjacentHTML('beforeEnd', template);
            }

            field.$field.insertAdjacentHTML('beforeEnd', template);
            field.$error = field.$field.getElementsByClassName(this.errorWrapperClass)[0];
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      } // Создание событий

    }, {
      key: "addAllListeners",
      value: function addAllListeners() {
        var _this = this;

        var _iterator5 = _createForOfIteratorHelper(this.fieldsArray),
            _step5;

        try {
          var _loop = function _loop() {
            var field = _step5.value;

            var _iterator6 = _createForOfIteratorHelper(field.rules),
                _step6;

            try {
              for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                var rule = _step6.value;

                var eventChecks = _this.rulesList.get(rule).checkEvents;

                var _iterator7 = _createForOfIteratorHelper(eventChecks),
                    _step7;

                try {
                  for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                    var eventCheck = _step7.value;
                    field.$elem.addEventListener(eventCheck, function () {
                      _this.validateField.bind(_this, field, true)();

                      _this.validationForm.bind(_this, false)();
                    });
                  }
                } catch (err) {
                  _iterator7.e(err);
                } finally {
                  _iterator7.f();
                }
              }
            } catch (err) {
              _iterator6.e(err);
            } finally {
              _iterator6.f();
            }
          };

          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            _loop();
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }

        this.$button.addEventListener('click', function (event) {
          event.preventDefault();

          _this.validationForm(true);
        });
      } // Проверка пустого поля

    }, {
      key: "validateInputEmpty",
      value: function validateInputEmpty($field, $elem, errorMessage) {
        var val = $elem.value;
        var validate = val !== '';
        var priority = 100;
        return {
          validate: validate,
          message: errorMessage,
          priority: priority
        };
      } // Проверка минимального количества символов

    }, {
      key: "validateMinCountSymbols",
      value: function validateMinCountSymbols($field, $elem, errorMessage) {
        var val = $elem.value;
        var minCount = parseInt($field.dataset.minCountSymbol);
        var validate = val.length >= minCount;
        var message = errorMessage + minCount;
        var priority = 200;
        return {
          validate: validate,
          message: message,
          priority: priority
        };
      }
    }]);

    return Validation;
  }();

  return Validation;
});
//# sourceMappingURL=script.js.map