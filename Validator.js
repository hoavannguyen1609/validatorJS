"use strict";
const Validator = (o) => {
  const f = document.querySelector(o.form);
  if (f) {
    const g = (e, s) => {
      while (e.parentElement) {
        if (e.parentElement.matches(s)) return e.parentElement;
        e = e.parentElement;
      }
    };

    const R = {};
    const v = (i, r) => {
      let m;
      const e = g(i, o.parentSelector);
      for (let x = 0; x < R[r.s].length; x++) {
        switch (i.type) {
          case "radio":
          case "checkbox":
            m = R[r.s][x](f.querySelector(r.s + ":checked"));
            break;
          default:
            m = R[r.s][x](i.value);
            break;
        }
        if (m) break;
      }

      if (m) {
        e.querySelector(o.errorSelector).innerText = m;
        e.classList.add(o.invalidClass);
      } else {
        e.querySelector(o.errorSelector).innerText = "";
        e.classList.remove(o.invalidClass);
      }
      return m;
    };

    f.onsubmit = (e) => {
      e.preventDefault();
      let F = true;
      o.rules.forEach((r) => {
        if (v(f.querySelector(r.s), r)) F = false;
      });

      if (F) {
        if (typeof o.onSubmit === "function") {
          o.onSubmit(
            Array.from(f.querySelectorAll("[name]")).reduce((v, i) => {
              switch (i.type) {
                case "radio":
                  if (v[i.name] === null || v[i.name] === undefined) {
                    if (
                      f.querySelector('input[name="' + i.name + '"]:checked')
                    ) {
                      v[i.name] = f.querySelector(
                        'input[name="' + i.name + '"]:checked'
                      ).value;
                    }
                  }
                  break;
                case "checkbox":
                  if (!i.matches(":checked")) {
                    v[i.name] = "";
                    return v;
                  }
                  if (!Array.isArray(v[i.name])) v[i.name] = [];
                  else v[i.name].push(i.value);
                  break;
                case "file":
                  v[i.name] = i.files;
                  break;
                default:
                  v[i.name] = i.value;
                  break;
              }
              return v;
            }, {})
          );
        } else {
          f.onsubmit();
        }
      }
    };

    o.rules.forEach((r) => {
      if (Array.isArray(R[r.s])) R[r.s].push(r.t);
      else R[r.s] = [r.t];

      Array.from(f.querySelectorAll(r.s)).forEach((i) => {
        i.onblur = () => v(i, r);
        i.oninput = () => {
          const e = g(i, o.parentSelector);
          e.querySelector(o.errorSelector).innerText = "";
          e.classList.remove(o.invalidClass);
        };
      });
    });
  }
  return false;
};

Validator.isRequired = (s, m) => {
  return {
    s,
    t(v) {
      if (v !== undefined || v === null)
        return v ? undefined : m || "Vui lòng nhập trường này";
      return v.trim() ? undefined : m || "Vui lòng nhập trường này";
    },
  };
};

Validator.isEmail = (s, m) => {
  return {
    s,
    t(v) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)
        ? undefined
        : m || "Vui lòng nhập email";
    },
  };
};

Validator.minLength = (s, l, m) => {
  return {
    s,
    t(v) {
      return v.length >= l
        ? undefined
        : m || `Trường này nhập tối thiểu ${l} ký tự`;
    },
  };
};

Validator.maxLength = (s, l, m) => {
  return {
    s,
    t(v) {
      return v.length <= l
        ? undefined
        : m || `Trường này nhập tối đa ${l} ký tự`;
    },
  };
};

Validator.isConfirmed = (s, g, m) => {
  return {
    s,
    t(v) {
      return v === g() ? undefined : m || "Giá trị nhập lại không trùng khớp";
    },
  };
};

Validator.isPhone = (s, m) => {
  return {
    s,
    t(v) {
      return /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/.test(
        v
      )
        ? undefined
        : m || "Vui lòng nhập số điện thoại Việt Nam";
    },
  };
};

Validator.isStrongPassword = (s, m) => {
  return {
    s,
    t(v) {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/.test(
        v
      )
        ? undefined
        : m || "Vui lòng nhập mật khẩu mạnh";
    },
  };
};

Validator.isNumeric = (s, m) => {
  return {
    s,
    t(v) {
      return /^\d+$/.test(v) ? undefined : m || "Vui lòng nhập số 0 - 9";
    },
  };
};

Validator.isString = (s, m) => {
  return {
    s,
    t(v) {
      return /^[a-zA-Z0-9]+$/.test(v)
        ? undefined
        : m || "Vui lòng nhập chữ hoặc số";
    },
  };
};

Validator.isAlpha = (s, m) => {
  return {
    s,
    t(v) {
      return /^[a-zA-Z]+$/.test(v) ? undefined : m || "Vui lòng nhập chữ";
    },
  };
};
