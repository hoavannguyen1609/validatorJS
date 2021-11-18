"use strict";
const Validator = (options) => {
  const getParent = (element, selector) => {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  };

  const selectorRules = {};

  const validate = (inputElement, rule) => {
    let errorMessage;
    const errorElement = getParent(
      inputElement,
      options.parentSelector
    ).querySelector(options.errorSelector);
    for (let i = 0; i < selectorRules[rule.selector].length; i++) {
      switch (inputElement.type) {
        case "radio":
          errorMessage = selectorRules[rule.selector][i](
            formElement.querySelector(rule.selector + ":checked")
          );
        case "checkbox":
          errorMessage = selectorRules[rule.selector][i](
            formElement.querySelector(rule.selector + ":checked")
          );
          break;
        default:
          errorMessage = selectorRules[rule.selector][i](inputElement.value);
      }
      if (errorMessage) break;
    }

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      getParent(inputElement, options.parentSelector).classList.add("invalid");
    } else {
      errorElement.innerText = "";
      getParent(inputElement, options.parentSelector).classList.remove(
        "invalid"
      );
    }
    return errorMessage;
  };
  const formElement = document.querySelector(options.form);

  if (formElement) {
    formElement.onsubmit = (e) => {
      e.preventDefault();
      let isFormValid = true;
      options.rules.forEach((rule) => {
        let isValid = validate(formElement.querySelector(rule.selector), rule);
        if (isValid) isFormValid = false;
      });

      if (isFormValid) {
        if (typeof options.onSubmit === "function") {
          let formValues = Array.from(
            formElement.querySelectorAll("[name]")
          ).reduce((values, input) => {
            switch (input.type) {
              case "radio":
                if (
                  values[input.name] === null ||
                  values[input.name] === undefined
                ) {
                  if (
                    formElement.querySelector(
                      'input[name="' + input.name + '"]:checked'
                    )
                  ) {
                    values[input.name] = formElement.querySelector(
                      'input[name="' + input.name + '"]:checked'
                    ).value;
                  }
                }
                break;
              case "checkbox":
                if (!input.matches(":checked")) {
                  values[input.name] = "";
                  return values;
                }
                if (!Array.isArray(values[input.name])) {
                  values[input.name] = [];
                }
                values[input.name].push(input.value);
                break;
              case "file":
                values[input.name] = input.files;
                break;
              default:
                values[input.name] = input.value;
                break;
            }
            return values;
          }, {});
          options.onSubmit(formValues);
        } else {
          formElement.onsubmit();
        }
      }
      return false;
    };

    options.rules.forEach((rule) => {
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      Array.from(formElement.querySelectorAll(rule.selector)).forEach(
        (inputElement) => {
          const errorElement = getParent(
            inputElement,
            options.parentSelector
          ).querySelector(options.errorSelector);
          inputElement.onblur = () => validate(inputElement, rule);
          inputElement.oninput = () => {
            errorElement.innerText = "";
            getParent(inputElement, options.parentSelector).classList.remove(
              "invalid"
            );
          };
        }
      );
    });
  }
  return false;
};

Validator.isRequired = (selector, message) => {
  return {
    selector,
    test(value) {
      if (value !== undefined || value === null)
        return value ? undefined : message || "Vui lòng nhập trường này";
      return value.trim() ? undefined : message || "Vui lòng nhập trường này";
    },
  };
};

Validator.isEmail = (selector, message) => {
  return {
    selector,
    test(value) {
      const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : message || "Vui lòng nhập email";
    },
  };
};

Validator.minLength = (selector, min, message) => {
  return {
    selector,
    test(value) {
      return value.length >= min
        ? undefined
        : message || `Trường này nhập tối thiểu ${min} ký tự`;
    },
  };
};

Validator.maxLength = (selector, max, message) => {
  return {
    selector,
    test(value) {
      return value.length <= max
        ? undefined
        : message || `Trường này nhập tối đa ${max} ký tự`;
    },
  };
};

Validator.isConfirmed = (selector, getConfirmValue, message) => {
  return {
    selector,
    test(value) {
      return value === getConfirmValue()
        ? undefined
        : message || "Giá trị nhập lại không trùng khớp";
    },
  };
};
