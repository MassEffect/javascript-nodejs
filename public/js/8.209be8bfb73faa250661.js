webpackJsonp_name_([8],{

/***/ 28:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var notification = __webpack_require__(23);
	var getCsrfCookie = __webpack_require__(37);
	// Wrapper about XHR
	// # Global Events
	// triggers document.loadstart/loadend on communication start/end
	//    --> unless options.noGlobalEvents is set
	//
	// # Events
	// triggers fail/success on load end:
	//    --> by default status=200 is ok, the others are failures
	//    --> options.normalStatuses = [201,409] allow given statuses
	//    --> fail event has .reason field
	//    --> success event has .result field
	//
	// # JSON
	//    --> send(object) calls JSON.stringify
	//    --> adds Accept: json (we want json) by default, unless options.raw
	// if options.json or server returned json content type
	//    --> autoparse json
	//    --> fail if error
	//
	// # CSRF
	//    --> requests sends header X-XSRF-TOKEN from cookie
	
	function xhr(options) {
	
	  var request = new XMLHttpRequest();
	
	  var method = options.method || "GET";
	
	  var body = options.body;
	  var url = options.url;
	
	  request.open(method, url, options.sync ? false : true);
	
	  request.method = method;
	
	  // token/header names same as angular $http for easier interop
	  var csrfCookie = getCsrfCookie();
	  if (csrfCookie && !options.skipCsrf) {
	    request.setRequestHeader("X-XSRF-TOKEN", csrfCookie);
	  }
	
	  if (({}).toString.call(body) == "[object Object]") {
	    // must be OPENed to setRequestHeader
	    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	    body = JSON.stringify(body);
	  }
	
	  if (!options.noGlobalEvents) {
	    request.addEventListener("loadstart", function (event) {
	      var e = wrapEvent("xhrstart", event);
	      document.dispatchEvent(e);
	    });
	    request.addEventListener("loadend", function (event) {
	      var e = wrapEvent("xhrend", event);
	      document.dispatchEvent(e);
	    });
	    request.addEventListener("success", function (event) {
	      var e = wrapEvent("xhrsuccess", event);
	      e.result = event.result;
	      document.dispatchEvent(e);
	    });
	    request.addEventListener("fail", function (event) {
	      var e = wrapEvent("xhrfail", event);
	      e.reason = event.reason;
	      document.dispatchEvent(e);
	    });
	  }
	
	  if (!options.raw) {
	    // means we want json
	    request.setRequestHeader("Accept", "application/json");
	  }
	
	  request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	
	  var normalStatuses = options.normalStatuses || [200];
	
	  function wrapEvent(name, e) {
	    var event = new CustomEvent(name);
	    event.originalEvent = e;
	    return event;
	  }
	
	  function fail(reason, originalEvent) {
	    var e = wrapEvent("fail", originalEvent);
	    e.reason = reason;
	    request.dispatchEvent(e);
	  }
	
	  function success(result, originalEvent) {
	    var e = wrapEvent("success", originalEvent);
	    e.result = result;
	    request.dispatchEvent(e);
	  }
	
	  request.addEventListener("error", function (e) {
	    fail("Ошибка связи с сервером.", e);
	  });
	
	  request.addEventListener("timeout", function (e) {
	    fail("Превышено максимально допустимое время ожидания ответа от сервера.", e);
	  });
	
	  request.addEventListener("abort", function (e) {
	    fail("Запрос был прерван.", e);
	  });
	
	  request.addEventListener("load", function (e) {
	    if (!request.status) {
	      // does that ever happen?
	      fail("Не получен ответ от сервера.", e);
	      return;
	    }
	
	    if (normalStatuses.indexOf(request.status) == -1) {
	      fail("Ошибка на стороне сервера (код " + request.status + "), попытайтесь позднее", e);
	      return;
	    }
	
	    var result = request.responseText;
	    var contentType = request.getResponseHeader("Content-Type");
	    if (contentType.match(/^application\/json/) || options.json) {
	      // autoparse json if WANT or RECEIVED json
	      try {
	        result = JSON.parse(result);
	      } catch (e) {
	        fail("Некорректный формат ответа от сервера", e);
	        return;
	      }
	    }
	
	    success(result, e);
	  });
	
	  // defer to let other handlers be assigned
	  setTimeout(function () {
	    request.send(body);
	  }, 0);
	
	  return request;
	}
	
	function addUrlParam(url, name, value) {
	  var param = encodeURIComponent(name) + "=" + encodeURIComponent(value);
	  if (~url.indexOf("?")) {
	    return url + "&" + param;
	  } else {
	    return url + "?" + param;
	  }
	}
	
	document.addEventListener("xhrfail", function (event) {
	  new notification.Error(event.reason);
	});
	
	module.exports = xhr;

/***/ },

/***/ 37:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = function () {
	  var csrfCookie = document.cookie.match(/XSRF-TOKEN=([\w-]+)/);
	  return csrfCookie ? csrfCookie[1] : null;
	};

/***/ },

/***/ 41:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.AuthModal = __webpack_require__(56);

/***/ },

/***/ 52:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.thumb = function (url, width, height) {
	  // sometimes this may be called without url
	  if (!url) return url;
	
	  var pixelRatio = window.devicePixelRatio;
	
	  // return pixelRatio times larger image for retina
	  width *= pixelRatio;
	  height *= pixelRatio;
	
	  var modifier = width <= 160 && height <= 160 ? "t" : width <= 320 && height <= 320 ? "m" : width <= 640 && height <= 640 ? "i" : width <= 1024 && height <= 1024 ? "h" : "";
	
	  return url.slice(0, url.lastIndexOf(".")) + modifier + url.slice(url.lastIndexOf("."));
	};

/***/ },

/***/ 56:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var xhr = __webpack_require__(28);
	
	var delegate = __webpack_require__(27);
	var Modal = __webpack_require__(9);
	var Spinner = __webpack_require__(36);
	
	var loginForm = __webpack_require__(80);
	var registerForm = __webpack_require__(81);
	var forgotForm = __webpack_require__(82);
	
	var clientRender = __webpack_require__(78);
	
	/**
	 * Options:
	 *   - callback: function to be called after successful login (by default - go to successRedirect)
	 *   - message: form message to be shown when the login form appears ("Log in to leave the comment")
	 *   - successRedirect: the page to redirect (current page by default)
	 *       - after immediate login
	 *       - after registration for "confirm email" link
	 */
	function AuthModal(options) {
	  Modal.apply(this, arguments);
	  options = options || {};
	
	  if (!options.successRedirect) {
	    options.successRedirect = window.location.href;
	  }
	
	  var self = this;
	  if (!options.callback) {
	    options.callback = function () {
	      self.successRedirect();
	    };
	  }
	
	  this.options = options;
	  this.setContent(clientRender(loginForm));
	
	  if (options.message) {
	    this.showFormMessage(options.message, "info");
	  }
	
	  this.initEventHandlers();
	}
	AuthModal.prototype = Object.create(Modal.prototype);
	
	delegate.delegateMixin(AuthModal.prototype);
	
	AuthModal.prototype.successRedirect = function () {
	  if (window.location.href == this.options.successRedirect) {
	    window.location.reload();
	  } else {
	    window.location.href = this.options.successRedirect;
	  }
	};
	
	AuthModal.prototype.clearFormMessages = function () {
	  /*
	   remove error for this notation:
	   span.text-input.text-input_invalid.login-form__input
	   input.text-input__control#password(type="password", name="password")
	   span.text-inpuxt__err Пароли не совпадают
	   */
	  [].forEach.call(this.elem.querySelectorAll(".text-input_invalid"), function (elem) {
	    elem.classList.remove("text-input_invalid");
	  });
	
	  [].forEach.call(this.elem.querySelectorAll(".text-input__err"), function (elem) {
	    elem.remove();
	  });
	
	  // clear form-wide notification
	  this.elem.querySelector("[data-notification]").innerHTML = "";
	};
	
	AuthModal.prototype.request = function (options) {
	  var request = xhr(options);
	
	  request.addEventListener("loadstart", (function () {
	    var onEnd = this.startRequestIndication();
	    request.addEventListener("loadend", onEnd);
	  }).bind(this));
	
	  return request;
	};
	
	AuthModal.prototype.startRequestIndication = function () {
	  this.showOverlay();
	  var self = this;
	
	  var submitButton = this.elem.querySelector("[type=\"submit\"]");
	
	  if (submitButton) {
	    var spinner = new Spinner({
	      elem: submitButton,
	      size: "small",
	      "class": "submit-button__spinner",
	      elemClass: "submit-button_progress"
	    });
	    spinner.start();
	  }
	
	  return function onEnd() {
	    self.hideOverlay();
	    if (spinner) spinner.stop();
	  };
	};
	
	AuthModal.prototype.initEventHandlers = function () {
	
	  this.delegate("[data-switch=\"register-form\"]", "click", function (e) {
	    e.preventDefault();
	    this.setContent(clientRender(registerForm));
	  });
	
	  this.delegate("[data-switch=\"login-form\"]", "click", function (e) {
	    e.preventDefault();
	    this.setContent(clientRender(loginForm));
	  });
	
	  this.delegate("[data-switch=\"forgot-form\"]", "click", function (e) {
	    e.preventDefault();
	
	    // move currently entered email into forgotForm
	    var oldEmailInput = this.elem.querySelector("[type=\"email\"]");
	    this.setContent(clientRender(forgotForm));
	    var newEmailInput = this.elem.querySelector("[type=\"email\"]");
	    newEmailInput.value = oldEmailInput.value;
	  });
	
	  this.delegate("[data-form=\"login\"]", "submit", function (event) {
	    event.preventDefault();
	    this.submitLoginForm(event.target);
	  });
	
	  this.delegate("[data-form=\"register\"]", "submit", function (event) {
	    event.preventDefault();
	    this.submitRegisterForm(event.target);
	  });
	
	  this.delegate("[data-form=\"forgot\"]", "submit", function (event) {
	    event.preventDefault();
	    this.submitForgotForm(event.target);
	  });
	
	  this.delegate("[data-provider]", "click", function (event) {
	    event.preventDefault();
	    this.openAuthPopup("/auth/login/" + event.delegateTarget.dataset.provider);
	  });
	
	  this.delegate("[data-action-verify-email]", "click", function (event) {
	    event.preventDefault();
	
	    var payload = new FormData();
	    payload.append("email", event.delegateTarget.dataset.actionVerifyEmail);
	
	    var request = this.request({
	      method: "POST",
	      url: "/auth/reverify",
	      body: payload
	    });
	
	    var self = this;
	    request.addEventListener("success", function (event) {
	
	      if (this.status == 200) {
	        self.showFormMessage("Письмо-подтверждение отправлено ещё раз.", "success");
	      } else {
	        self.showFormMessage(event.result, "error");
	      }
	    });
	  });
	};
	
	AuthModal.prototype.submitRegisterForm = function (form) {
	
	  this.clearFormMessages();
	
	  var hasErrors = false;
	  if (!form.elements.email.value) {
	    hasErrors = true;
	    this.showInputError(form.elements.email, "Введите, пожалуста, email.");
	  }
	
	  if (!form.elements.displayName.value) {
	    hasErrors = true;
	    this.showInputError(form.elements.displayName, "Введите, пожалуста, имя пользователя.");
	  }
	
	  if (!form.elements.password.value) {
	    hasErrors = true;
	    this.showInputError(form.elements.password, "Введите, пожалуста, пароль.");
	  }
	
	  if (hasErrors) return;
	
	  var payload = new FormData(form);
	  payload.append("successRedirect", this.options.successRedirect);
	
	  var request = this.request({
	    method: "POST",
	    url: "/auth/register",
	    normalStatuses: [201, 400],
	    body: payload
	  });
	
	  var self = this;
	  request.addEventListener("success", function (event) {
	
	    if (this.status == 201) {
	      self.setContent(clientRender(loginForm));
	      self.showFormMessage("<p>С адреса notify@javascript.ru отправлено письмо со ссылкой-подтверждением.</p>" + "<p><a href='#' data-action-verify-email='" + form.elements.email.value + "'>перезапросить подтверждение.</a></p>", "success");
	      return;
	    }
	
	    if (this.status == 400) {
	      for (var field in event.result.errors) {
	        self.showInputError(form.elements[field], event.result.errors[field]);
	      }
	      return;
	    }
	
	    self.showFormMessage("Неизвестный статус ответа сервера", "error");
	  });
	};
	
	AuthModal.prototype.submitForgotForm = function (form) {
	
	  this.clearFormMessages();
	
	  var hasErrors = false;
	  if (!form.elements.email.value) {
	    hasErrors = true;
	    this.showInputError(form.elements.email, "Введите, пожалуста, email.");
	  }
	
	  if (hasErrors) return;
	
	  var payload = new FormData(form);
	  payload.append("successRedirect", this.options.successRedirect);
	
	  var request = this.request({
	    method: "POST",
	    url: "/auth/forgot",
	    normalStatuses: [200, 404],
	    body: payload
	  });
	
	  var self = this;
	  request.addEventListener("success", function (event) {
	
	    if (this.status == 200) {
	      self.setContent(clientRender(loginForm));
	      self.showFormMessage(event.result, "success");
	    } else if (this.status == 404) {
	      self.showFormMessage(event.result, "error");
	    }
	  });
	};
	
	AuthModal.prototype.showInputError = function (input, error) {
	  input.parentNode.classList.add("text-input_invalid");
	  var errorSpan = document.createElement("span");
	  errorSpan.className = "text-input__err";
	  errorSpan.innerHTML = error;
	  input.parentNode.appendChild(errorSpan);
	};
	
	AuthModal.prototype.showFormMessage = function (message, type) {
	  if (message.indexOf("<p>") !== 0) {
	    message = "<p>" + message + "</p>";
	  }
	
	  if (["info", "error", "warning", "success"].indexOf(type) == -1) {
	    throw new Error("Unsupported type: " + type);
	  }
	
	  var container = document.createElement("div");
	  container.className = "login-form__" + type;
	  container.innerHTML = message;
	
	  this.elem.querySelector("[data-notification]").innerHTML = "";
	  this.elem.querySelector("[data-notification]").appendChild(container);
	};
	
	AuthModal.prototype.submitLoginForm = function (form) {
	
	  this.clearFormMessages();
	
	  var hasErrors = false;
	  if (!form.elements.login.value) {
	    hasErrors = true;
	    this.showInputError(form.elements.login, "Введите, пожалуста, имя или email.");
	  }
	
	  if (!form.elements.password.value) {
	    hasErrors = true;
	    this.showInputError(form.elements.password, "Введите, пожалуста, пароль.");
	  }
	
	  if (hasErrors) return;
	
	  var request = this.request({
	    method: "POST",
	    url: "/auth/login/local",
	    normalStatuses: [200, 401],
	    body: new FormData(form)
	  });
	
	  var self = this;
	  request.addEventListener("success", function (event) {
	
	    if (this.status != 200) {
	      self.onAuthFailure(event.result.message);
	      return;
	    }
	
	    self.onAuthSuccess(event.result.user);
	  });
	};
	
	AuthModal.prototype.openAuthPopup = function (url) {
	  if (this.authPopup && !this.authPopup.closed) {
	    this.authPopup.close(); // close old popup if any
	  }
	  var width = 800,
	      height = 600;
	  var top = (window.outerHeight - height) / 2;
	  var left = (window.outerWidth - width) / 2;
	  window.authModal = this;
	  this.authPopup = window.open(url, "authModal", "width=" + width + ",height=" + height + ",scrollbars=0,top=" + top + ",left=" + left);
	};
	
	/*
	 все обработчики авторизации (включая Facebook из popup-а и локальный)
	 в итоге триггерят один из этих каллбэков
	 */
	AuthModal.prototype.onAuthSuccess = function (user) {
	  window.currentUser = user;
	  this.options.callback();
	};
	
	AuthModal.prototype.onAuthFailure = function (errorMessage) {
	  this.showFormMessage(errorMessage || "Отказ в авторизации.", "error");
	};
	
	module.exports = AuthModal;

/***/ },

/***/ 78:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var bem = __webpack_require__(83)();
	var thumb = __webpack_require__(52).thumb;
	
	module.exports = function (template, locals) {
	  locals = locals ? Object.create(locals) : {};
	  addStandardHelpers(locals);
	
	  return template(locals);
	};
	
	function addStandardHelpers(locals) {
	  locals.bem = bem;
	
	  locals.thumb = thumb;
	}

/***/ },

/***/ 80:
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(85);
	
	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (bem) {
	buf.push("");
	var bem_chain = [];
	var bem_chain_contexts = ['block'];
	jade_mixins["b"] = function(tag, isElement, noBlockClass){
	var block = (this && this.block), attributes = (this && this.attributes) || {};
	bem.call(this, buf, bem_chain, bem_chain_contexts, tag, isElement, noBlockClass)
	};
	
	
	
	
	
	
	
	
	
	jade_mixins["e"] = function(tag){
	var block = (this && this.block), attributes = (this && this.attributes) || {};
	jade_mixins["b"].call({
	block: function(){
	block && block();
	},
	attributes: jade.merge([attributes])
	}, tag, true);
	};
	jade_mixins["b"].call({
	block: function(){
	jade_mixins["e"].call({
	block: function(){
	jade_mixins["e"].call({
	block: function(){
	jade_mixins["e"].call({
	block: function(){
	buf.push("Вход в систему");
	},
	attributes: {"class": "title"}
	}, 'h4');
	jade_mixins["e"].call({
	block: function(){
	jade_mixins["e"].call({
	block: function(){
	buf.push("регистрация");
	},
	attributes: {"type": "button","data-switch": "register-form","class": "button-link __register"}
	}, 'button');
	},
	attributes: {"class": "header-aside"}
	});
	},
	attributes: {"class": "line __header"}
	});
	jade_mixins["e"].call({
	attributes: {"data-notification": true,"class": "line __notification"}
	});
	jade_mixins["e"].call({
	block: function(){
	jade_mixins["e"].call({
	block: function(){
	buf.push("Email:");
	},
	attributes: {"for": "login","class": "label"}
	}, 'label');
	jade_mixins["b"].call({
	block: function(){
	jade_mixins["e"].call({
	attributes: {"id": "login","name": "login","type": "email","autofocus": true,"class": "control"}
	}, 'input');
	},
	attributes: {"class": "text-input __input"}
	}, 'span');
	},
	attributes: {"class": "line"}
	});
	jade_mixins["e"].call({
	block: function(){
	jade_mixins["e"].call({
	block: function(){
	buf.push("Пароль:");
	},
	attributes: {"for": "password","class": "label"}
	}, 'label');
	jade_mixins["b"].call({
	block: function(){
	jade_mixins["e"].call({
	attributes: {"id": "password","type": "password","name": "password","class": "control"}
	}, 'input');
	jade_mixins["e"].call({
	block: function(){
	buf.push("Забыли?");
	},
	attributes: {"type": "button","data-switch": "forgot-form","class": "aside __forgot __button-link"}
	}, 'button');
	},
	attributes: {"class": "text-input _with-aside __input"}
	}, 'span');
	},
	attributes: {"class": "line"}
	});
	jade_mixins["e"].call({
	block: function(){
	jade_mixins["b"].call({
	block: function(){
	jade_mixins["e"].call({
	block: function(){
	buf.push("Войти");
	},
	attributes: {"class": "text"}
	}, 'span');
	},
	attributes: {"type": "submit","class": "submit-button _small __submit"}
	}, 'button');
	},
	attributes: {"class": "line __footer"}
	});
	jade_mixins["e"].call({
	block: function(){
	jade_mixins["e"].call({
	block: function(){
	buf.push("Вход через социальные сети");
	},
	attributes: {"class": "social-logins-title"}
	}, 'h5');
	buf.push(" ");
	jade_mixins["b"].call({
	block: function(){
	buf.push("Facebook");
	},
	attributes: {"data-provider": "facebook","class": "social-login _facebook __social-login"}
	}, 'button');
	buf.push(" ");
	jade_mixins["b"].call({
	block: function(){
	buf.push("Google+");
	},
	attributes: {"data-provider": "google","class": "social-login _google __social-login"}
	}, 'button');
	buf.push(" ");
	jade_mixins["b"].call({
	block: function(){
	buf.push("Вконтакте");
	},
	attributes: {"data-provider": "vkontakte","class": "social-login _vkontakte __social-login"}
	}, 'button');
	buf.push(" ");
	jade_mixins["b"].call({
	block: function(){
	buf.push("Github");
	},
	attributes: {"data-provider": "github","class": "social-login _github __social-login"}
	}, 'button');
	buf.push(" ");
	jade_mixins["b"].call({
	block: function(){
	buf.push("Яндекс");
	},
	attributes: {"data-provider": "yandex","class": "social-login _yandex __social-login"}
	}, 'button');
	},
	attributes: {"class": "line __social-logins"}
	});
	jade_mixins["b"].call({
	attributes: {"type": "button","title": "закрыть","class": "close-button __close"}
	}, 'button');
	},
	attributes: {"action": "#","class": "form"}
	}, 'form');
	},
	attributes: {"data-form": "login","class": "login-form"}
	});}.call(this,"bem" in locals_for_with?locals_for_with.bem:typeof bem!=="undefined"?bem:undefined));;return buf.join("");
	}

/***/ },

/***/ 81:
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(85);
	
	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (bem) {
	buf.push("");
	var bem_chain = [];
	var bem_chain_contexts = ['block'];
	jade_mixins["b"] = function(tag, isElement, noBlockClass){
	var block = (this && this.block), attributes = (this && this.attributes) || {};
	bem.call(this, buf, bem_chain, bem_chain_contexts, tag, isElement, noBlockClass)
	};
	
	
	
	
	
	
	
	
	
	jade_mixins["e"] = function(tag){
	var block = (this && this.block), attributes = (this && this.attributes) || {};
	jade_mixins["b"].call({
	block: function(){
	block && block();
	},
	attributes: jade.merge([attributes])
	}, tag, true);
	};
	jade_mixins["b"].call({
	block: function(){
	jade_mixins["e"].call({
	block: function(){
	jade_mixins["e"].call({
	block: function(){
	jade_mixins["e"].call({
	block: function(){
	buf.push("Регистрация");
	},
	attributes: {"class": "title"}
	}, 'h4');
	jade_mixins["e"].call({
	block: function(){
	jade_mixins["e"].call({
	block: function(){
	buf.push("вход");
	},
	attributes: {"type": "button","data-switch": "login-form","class": "button-link"}
	}, 'button');
	},
	attributes: {"class": "header-aside"}
	});
	},
	attributes: {"class": "line __header"}
	});
	jade_mixins["e"].call({
	attributes: {"data-notification": true,"class": "line __notification"}
	});
	jade_mixins["e"].call({
	block: function(){
	jade_mixins["e"].call({
	block: function(){
	buf.push("Email:");
	},
	attributes: {"for": "register-email","class": "label"}
	}, 'label');
	jade_mixins["b"].call({
	block: function(){
	jade_mixins["e"].call({
	attributes: {"id": "register-email","name": "email","type": "email","required": true,"autofocus": true,"class": "control"}
	}, 'input');
	},
	attributes: {"class": "text-input __input"}
	}, 'span');
	},
	attributes: {"class": "line"}
	});
	jade_mixins["e"].call({
	block: function(){
	jade_mixins["e"].call({
	block: function(){
	buf.push("Имя пользователя:");
	},
	attributes: {"for": "register-displayName","class": "label"}
	}, 'label');
	jade_mixins["b"].call({
	block: function(){
	jade_mixins["e"].call({
	attributes: {"id": "register-displayName","name": "displayName","required": true,"class": "control"}
	}, 'input');
	},
	attributes: {"class": "text-input __input"}
	}, 'span');
	},
	attributes: {"class": "line"}
	});
	jade_mixins["e"].call({
	block: function(){
	jade_mixins["e"].call({
	block: function(){
	buf.push("Пароль:");
	},
	attributes: {"for": "register-password","class": "label"}
	}, 'label');
	jade_mixins["b"].call({
	block: function(){
	jade_mixins["e"].call({
	attributes: {"id": "register-password","type": "password","name": "password","required": true,"class": "control"}
	}, 'input');
	},
	attributes: {"class": "text-input __input"}
	}, 'span');
	},
	attributes: {"class": "line"}
	});
	jade_mixins["e"].call({
	block: function(){
	jade_mixins["b"].call({
	block: function(){
	jade_mixins["e"].call({
	block: function(){
	buf.push("Зарегистрироваться");
	},
	attributes: {"class": "text"}
	}, 'span');
	},
	attributes: {"type": "submit","class": "submit-button _small submit"}
	}, 'button');
	},
	attributes: {"class": "line __footer"}
	});
	jade_mixins["e"].call({
	block: function(){
	jade_mixins["e"].call({
	block: function(){
	buf.push("Вход через социальные сети");
	},
	attributes: {"class": "social-logins-title"}
	}, 'h5');
	buf.push(" ");
	jade_mixins["b"].call({
	block: function(){
	buf.push("Facebook");
	},
	attributes: {"data-provider": "facebook","class": "social-login _facebook __social-login"}
	}, 'button');
	buf.push(" ");
	jade_mixins["b"].call({
	block: function(){
	buf.push("Google+");
	},
	attributes: {"data-provider": "google","class": "social-login _google __social-login"}
	}, 'button');
	buf.push(" ");
	jade_mixins["b"].call({
	block: function(){
	buf.push("Вконтакте");
	},
	attributes: {"data-provider": "vkontakte","class": "social-login _vkontakte __social-login"}
	}, 'button');
	buf.push(" ");
	jade_mixins["b"].call({
	block: function(){
	buf.push("Github");
	},
	attributes: {"data-provider": "github","class": "social-login _github __social-login"}
	}, 'button');
	buf.push(" ");
	jade_mixins["b"].call({
	block: function(){
	buf.push("Яндекс");
	},
	attributes: {"data-provider": "yandex","class": "social-login _yandex __social-login"}
	}, 'button');
	},
	attributes: {"class": "line __social-logins"}
	});
	jade_mixins["b"].call({
	attributes: {"type": "button","title": "закрыть","class": "close-button __close"}
	}, 'button');
	},
	attributes: {"action": "#","data-form": "register","class": "form"}
	}, 'form');
	},
	attributes: {"class": "login-form"}
	});}.call(this,"bem" in locals_for_with?locals_for_with.bem:typeof bem!=="undefined"?bem:undefined));;return buf.join("");
	}

/***/ },

/***/ 82:
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(85);
	
	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (bem) {
	buf.push("");
	var bem_chain = [];
	var bem_chain_contexts = ['block'];
	jade_mixins["b"] = function(tag, isElement, noBlockClass){
	var block = (this && this.block), attributes = (this && this.attributes) || {};
	bem.call(this, buf, bem_chain, bem_chain_contexts, tag, isElement, noBlockClass)
	};
	
	
	
	
	
	
	
	
	
	jade_mixins["e"] = function(tag){
	var block = (this && this.block), attributes = (this && this.attributes) || {};
	jade_mixins["b"].call({
	block: function(){
	block && block();
	},
	attributes: jade.merge([attributes])
	}, tag, true);
	};
	jade_mixins["b"].call({
	block: function(){
	jade_mixins["e"].call({
	block: function(){
	jade_mixins["e"].call({
	block: function(){
	jade_mixins["e"].call({
	block: function(){
	buf.push("Восстановление пароля");
	},
	attributes: {"class": "title"}
	}, 'h4');
	},
	attributes: {"class": "line __header"}
	});
	jade_mixins["e"].call({
	attributes: {"data-notification": true,"class": "line __notification"}
	});
	jade_mixins["e"].call({
	block: function(){
	jade_mixins["e"].call({
	block: function(){
	buf.push("Email:");
	},
	attributes: {"for": "forgot-email","class": "label"}
	}, 'label');
	jade_mixins["b"].call({
	block: function(){
	jade_mixins["e"].call({
	attributes: {"id": "forgot-email","name": "email","type": "email","autofocus": true,"class": "control"}
	}, 'input');
	},
	attributes: {"class": "text-input __input"}
	}, 'span');
	},
	attributes: {"class": "line"}
	});
	jade_mixins["e"].call({
	block: function(){
	jade_mixins["b"].call({
	block: function(){
	jade_mixins["e"].call({
	block: function(){
	buf.push("Восстановить пароль");
	},
	attributes: {"class": "text"}
	}, 'span');
	},
	attributes: {"type": "submit","class": "submit-button _small __submit"}
	}, 'button');
	},
	attributes: {"class": "line"}
	});
	jade_mixins["e"].call({
	block: function(){
	jade_mixins["e"].call({
	block: function(){
	buf.push("Вход");
	},
	attributes: {"type": "button","data-switch": "login-form","class": "button-link"}
	}, 'button');
	buf.push(" ");
	jade_mixins["e"].call({
	block: function(){
	buf.push("/");
	},
	attributes: {"class": "separator"}
	}, 'span');
	buf.push(" ");
	jade_mixins["e"].call({
	block: function(){
	buf.push("Регистрация");
	},
	attributes: {"data-switch": "register-form","class": "button-link"}
	}, 'button');
	},
	attributes: {"class": "line __footer"}
	});
	jade_mixins["e"].call({
	block: function(){
	jade_mixins["e"].call({
	block: function(){
	buf.push("Вход через социальные сети");
	},
	attributes: {"class": "social-logins-title"}
	}, 'h5');
	buf.push(" ");
	jade_mixins["b"].call({
	block: function(){
	buf.push("Facebook");
	},
	attributes: {"data-provider": "facebook","class": "social-login _facebook __social-login"}
	}, 'button');
	buf.push(" ");
	jade_mixins["b"].call({
	block: function(){
	buf.push("Google+");
	},
	attributes: {"data-provider": "google","class": "social-login _google __social-login"}
	}, 'button');
	buf.push(" ");
	jade_mixins["b"].call({
	block: function(){
	buf.push("Вконтакте");
	},
	attributes: {"data-provider": "vkontakte","class": "social-login _vkontakte __social-login"}
	}, 'button');
	buf.push(" ");
	jade_mixins["b"].call({
	block: function(){
	buf.push("Github");
	},
	attributes: {"data-provider": "github","class": "social-login _github __social-login"}
	}, 'button');
	buf.push(" ");
	jade_mixins["b"].call({
	block: function(){
	buf.push("Яндекс");
	},
	attributes: {"data-provider": "yandex","class": "social-login _yandex __social-login"}
	}, 'button');
	},
	attributes: {"class": "line __social-logins"}
	});
	jade_mixins["b"].call({
	attributes: {"type": "button","title": "закрыть","class": "close-button __close"}
	}, 'button');
	},
	attributes: {"action": "#","data-form": "forgot","class": "form"}
	}, 'form');
	},
	attributes: {"class": "login-form"}
	});}.call(this,"bem" in locals_for_with?locals_for_with.bem:typeof bem!=="undefined"?bem:undefined));;return buf.join("");
	}

/***/ },

/***/ 83:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	// Adapted from bemto.jade, copyright(c) 2012 Roman Komarov <kizu@kizu.ru>
	
	/* jshint -W106 */
	
	var jade = __webpack_require__(85);
	
	module.exports = function (settings) {
	  settings = settings || {};
	
	  settings.prefix = settings.prefix || "";
	  settings.element = settings.element || "__";
	  settings.modifier = settings.modifier || "_";
	  settings.default_tag = settings.default_tag || "div";
	
	  return function (buf, bem_chain, bem_chain_contexts, tag, isElement) {
	    //console.log("-->", arguments);
	    var block = this.block;
	    var attributes = this.attributes || {};
	
	    // Rewriting the class for elements and modifiers
	    if (attributes["class"]) {
	      var bem_classes = attributes["class"];
	
	      if (bem_classes instanceof Array) {
	        bem_classes = bem_classes.join(" ");
	      }
	      bem_classes = bem_classes.split(" ");
	
	      var bem_block;
	      try {
	        bem_block = bem_classes[0].match(new RegExp("^(((?!" + settings.element + "|" + settings.modifier + ").)+)"))[1];
	      } catch (e) {
	        throw new Error("Incorrect bem class: " + bem_classes[0]);
	      }
	
	      if (!isElement) {
	        bem_chain[bem_chain.length] = bem_block;
	        bem_classes[0] = bem_classes[0];
	      } else {
	        bem_classes[0] = bem_chain[bem_chain.length - 1] + settings.element + bem_classes[0];
	      }
	
	      var current_block = (isElement ? bem_chain[bem_chain.length - 1] + settings.element : "") + bem_block;
	
	      // Adding the block if there is only modifier and/or element
	      if (bem_classes.indexOf(current_block) === -1) {
	        bem_classes[bem_classes.length] = current_block;
	      }
	
	      for (var i = 0; i < bem_classes.length; i++) {
	        var klass = bem_classes[i];
	
	        if (klass.match(new RegExp("^(?!" + settings.element + ")" + settings.modifier))) {
	          // Expanding the modifiers
	          bem_classes[i] = current_block + klass;
	        } else if (klass.match(new RegExp("^" + settings.element))) {
	          //- Expanding the mixed in elements
	          if (bem_chain[bem_chain.length - 2]) {
	            bem_classes[i] = bem_chain[bem_chain.length - 2] + klass;
	          } else {
	            bem_classes[i] = bem_chain[bem_chain.length - 1] + klass;
	          }
	        }
	
	        // Adding prefixes
	        if (bem_classes[i].match(new RegExp("^" + current_block + "($|(?=" + settings.element + "|" + settings.modifier + "))"))) {
	          bem_classes[i] = settings.prefix + bem_classes[i];
	        }
	      }
	
	      // Write modified classes to attributes in the correct order
	      attributes["class"] = bem_classes.sort().join(" ");
	    }
	
	    bem_tag(buf, block, attributes, bem_chain, bem_chain_contexts, tag);
	
	    // Closing actions (remove the current block from the chain)
	    if (!isElement) {
	      bem_chain.pop();
	    }
	    bem_chain_contexts.pop();
	  };
	
	  // used for tweaking what tag we are throwing and do we need to wrap anything here
	  function bem_tag(buf, block, attributes, bem_chain, bem_chain_contexts, tag) {
	    // rewriting tag name on different contexts
	    var newTag = tag || settings.default_tag;
	    var contextIndex = bem_chain_contexts.length;
	
	    //Checks for contexts if no tag given
	    //console.log(bem_chain_contexts, tag);
	    if (!tag) {
	      if (bem_chain_contexts[contextIndex - 1] === "inline") {
	        newTag = "span";
	      } else if (bem_chain_contexts[contextIndex - 1] === "list") {
	        newTag = "li";
	      }
	
	      //Attributes context checks
	      if (attributes.href) {
	        newTag = "a";
	      } else if (attributes["for"]) {
	        newTag = "label";
	      } else if (attributes.src) {
	        newTag = "img";
	      }
	    }
	
	    //Contextual wrappers
	    if (bem_chain_contexts[contextIndex - 1] === "list" && newTag !== "li") {
	      buf.push("<li>");
	    } else if (bem_chain_contexts[contextIndex - 1] !== "list" && bem_chain_contexts[contextIndex - 1] !== "pseudo-list" && newTag === "li") {
	      buf.push("<ul>");
	      bem_chain_contexts[bem_chain_contexts.length] = "pseudo-list";
	    } else if (bem_chain_contexts[contextIndex - 1] === "pseudo-list" && newTag !== "li") {
	      buf.push("</ul>");
	      bem_chain_contexts.pop();
	    }
	
	    //Setting context
	    if (["a", "abbr", "acronym", "b", "br", "code", "em", "font", "i", "img", "ins", "kbd", "map", "samp", "small", "span", "strong", "sub", "sup", "label", "p", "h1", "h2", "h3", "h4", "h5", "h6"].indexOf(newTag) !== -1) {
	      bem_chain_contexts[bem_chain_contexts.length] = "inline";
	    } else if (["ul", "ol"].indexOf(newTag) !== -1) {
	      bem_chain_contexts[bem_chain_contexts.length] = "list";
	    } else {
	      bem_chain_contexts[bem_chain_contexts.length] = "block";
	    }
	
	    switch (newTag) {
	      case "img":
	        // If there is no title we don't need it to show even if there is some alt
	        if (attributes.alt && !attributes.title) {
	          attributes.title = "";
	        }
	        // If we have title, we must have it in alt if it's not set
	        if (attributes.title && !attributes.alt) {
	          attributes.alt = attributes.title;
	        }
	        if (!attributes.alt) {
	          attributes.alt = "";
	        }
	        break;
	      case "input":
	        if (!attributes.type) {
	          attributes.type = "text";
	        }
	        break;
	      case "html":
	        buf.push("<!DOCTYPE HTML>");
	        break;
	      case "a":
	        if (!attributes.href) {
	          attributes.href = "#";
	        }
	    }
	
	    buf.push("<" + newTag + jade.attrs(jade.merge([attributes]), true) + ">");
	
	    if (block) block();
	
	    if (["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "menuitem", "meta", "param", "source", "track", "wbr"].indexOf(newTag) == -1) {
	      buf.push("</" + newTag + ">");
	    }
	
	    // Closing all the wrapper tails
	    if (bem_chain_contexts[contextIndex - 1] === "list" && newTag != "li") {
	      buf.push("</li>");
	    }
	  }
	};

/***/ },

/***/ 85:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	/**
	 * Merge two attribute objects giving precedence
	 * to values in object `b`. Classes are special-cased
	 * allowing for arrays and merging/joining appropriately
	 * resulting in a string.
	 *
	 * @param {Object} a
	 * @param {Object} b
	 * @return {Object} a
	 * @api private
	 */
	
	exports.merge = function merge(a, b) {
	  if (arguments.length === 1) {
	    var attrs = a[0];
	    for (var i = 1; i < a.length; i++) {
	      attrs = merge(attrs, a[i]);
	    }
	    return attrs;
	  }
	  var ac = a["class"];
	  var bc = b["class"];
	
	  if (ac || bc) {
	    ac = ac || [];
	    bc = bc || [];
	    if (!Array.isArray(ac)) ac = [ac];
	    if (!Array.isArray(bc)) bc = [bc];
	    a["class"] = ac.concat(bc).filter(nulls);
	  }
	
	  for (var key in b) {
	    if (key != "class") {
	      a[key] = b[key];
	    }
	  }
	
	  return a;
	};
	
	/**
	 * Filter null `val`s.
	 *
	 * @param {*} val
	 * @return {Boolean}
	 * @api private
	 */
	
	function nulls(val) {
	  return val != null && val !== "";
	}
	
	/**
	 * join array as classes.
	 *
	 * @param {*} val
	 * @return {String}
	 */
	exports.joinClasses = joinClasses;
	function joinClasses(val) {
	  return (Array.isArray(val) ? val.map(joinClasses) : val && typeof val === "object" ? Object.keys(val).filter(function (key) {
	    return val[key];
	  }) : [val]).filter(nulls).join(" ");
	}
	
	/**
	 * Render the given classes.
	 *
	 * @param {Array} classes
	 * @param {Array.<Boolean>} escaped
	 * @return {String}
	 */
	exports.cls = function cls(classes, escaped) {
	  var buf = [];
	  for (var i = 0; i < classes.length; i++) {
	    if (escaped && escaped[i]) {
	      buf.push(exports.escape(joinClasses([classes[i]])));
	    } else {
	      buf.push(joinClasses(classes[i]));
	    }
	  }
	  var text = joinClasses(buf);
	  if (text.length) {
	    return " class=\"" + text + "\"";
	  } else {
	    return "";
	  }
	};
	
	exports.style = function (val) {
	  if (val && typeof val === "object") {
	    return Object.keys(val).map(function (style) {
	      return style + ":" + val[style];
	    }).join(";");
	  } else {
	    return val;
	  }
	};
	/**
	 * Render the given attribute.
	 *
	 * @param {String} key
	 * @param {String} val
	 * @param {Boolean} escaped
	 * @param {Boolean} terse
	 * @return {String}
	 */
	exports.attr = function attr(key, val, escaped, terse) {
	  if (key === "style") {
	    val = exports.style(val);
	  }
	  if ("boolean" == typeof val || null == val) {
	    if (val) {
	      return " " + (terse ? key : key + "=\"" + key + "\"");
	    } else {
	      return "";
	    }
	  } else if (0 == key.indexOf("data") && "string" != typeof val) {
	    if (JSON.stringify(val).indexOf("&") !== -1) {
	      console.warn("Since Jade 2.0.0, ampersands (`&`) in data attributes " + "will be escaped to `&amp;`");
	    };
	    if (val && typeof val.toISOString === "function") {
	      console.warn("Jade will eliminate the double quotes around dates in " + "ISO form after 2.0.0");
	    }
	    return " " + key + "='" + JSON.stringify(val).replace(/'/g, "&apos;") + "'";
	  } else if (escaped) {
	    if (val && typeof val.toISOString === "function") {
	      console.warn("Jade will stringify dates in ISO form after 2.0.0");
	    }
	    return " " + key + "=\"" + exports.escape(val) + "\"";
	  } else {
	    if (val && typeof val.toISOString === "function") {
	      console.warn("Jade will stringify dates in ISO form after 2.0.0");
	    }
	    return " " + key + "=\"" + val + "\"";
	  }
	};
	
	/**
	 * Render the given attributes object.
	 *
	 * @param {Object} obj
	 * @param {Object} escaped
	 * @return {String}
	 */
	exports.attrs = function attrs(obj, terse) {
	  var buf = [];
	
	  var keys = Object.keys(obj);
	
	  if (keys.length) {
	    for (var i = 0; i < keys.length; ++i) {
	      var key = keys[i],
	          val = obj[key];
	
	      if ("class" == key) {
	        if (val = joinClasses(val)) {
	          buf.push(" " + key + "=\"" + val + "\"");
	        }
	      } else {
	        buf.push(exports.attr(key, val, false, terse));
	      }
	    }
	  }
	
	  return buf.join("");
	};
	
	/**
	 * Escape the given string of `html`.
	 *
	 * @param {String} html
	 * @return {String}
	 * @api private
	 */
	
	exports.escape = function escape(html) {
	  var result = String(html).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
	  if (result === "" + html) {
	    return html;
	  } else {
	    return result;
	  }
	};
	
	/**
	 * Re-throw the given `err` in context to the
	 * the jade in `filename` at the given `lineno`.
	 *
	 * @param {Error} err
	 * @param {String} filename
	 * @param {String} lineno
	 * @api private
	 */
	
	exports.rethrow = function rethrow(err, filename, lineno, str) {
	  if (!(err instanceof Error)) throw err;
	  if ((typeof window != "undefined" || !filename) && !str) {
	    err.message += " on line " + lineno;
	    throw err;
	  }
	  try {
	    str = str || __webpack_require__(87).readFileSync(filename, "utf8");
	  } catch (ex) {
	    rethrow(err, null, lineno);
	  }
	  var context = 3,
	      lines = str.split("\n"),
	      start = Math.max(lineno - context, 0),
	      end = Math.min(lines.length, lineno + context);
	
	  // Error context
	  var context = lines.slice(start, end).map(function (line, i) {
	    var curr = i + start + 1;
	    return (curr == lineno ? "  > " : "    ") + curr + "| " + line;
	  }).join("\n");
	
	  // Alter exception message
	  err.path = filename;
	  err.message = (filename || "Jade") + ":" + lineno + "\n" + context + "\n\n" + err.message;
	  throw err;
	};

/***/ },

/***/ 87:
/***/ function(module, exports, __webpack_require__) {

	/* (ignored) */

/***/ }

});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jbGllbnQveGhyLmpzPzY4NTIqKiIsIndlYnBhY2s6Ly8vLi9jbGllbnQvZ2V0Q3NyZkNvb2tpZS5qcz9kMTJhKioiLCJ3ZWJwYWNrOi8vLy4vaGFuZGxlcnMvYXV0aC9jbGllbnQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2ltYWdlLmpzPzhkYTkiLCJ3ZWJwYWNrOi8vLy4vaGFuZGxlcnMvYXV0aC9jbGllbnQvYXV0aE1vZGFsLmpzIiwid2VicGFjazovLy8uL2NsaWVudC9jbGllbnRSZW5kZXIuanMiLCJ3ZWJwYWNrOi8vLy4vaGFuZGxlcnMvYXV0aC90ZW1wbGF0ZXMvbG9naW4tZm9ybS5qYWRlIiwid2VicGFjazovLy8uL2hhbmRsZXJzL2F1dGgvdGVtcGxhdGVzL3JlZ2lzdGVyLWZvcm0uamFkZSIsIndlYnBhY2s6Ly8vLi9oYW5kbGVycy9hdXRoL3RlbXBsYXRlcy9mb3Jnb3QtZm9ybS5qYWRlIiwid2VicGFjazovLy8uL34vYmVtLWphZGUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9qYWRlL2xpYi9ydW50aW1lLmpzIiwid2VicGFjazovLy9mcyAoaWdub3JlZCkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBLEtBQUksWUFBWSxHQUFHLG1CQUFPLENBQUMsRUFBcUIsQ0FBQyxDQUFDO0FBQ2xELEtBQUksYUFBYSxHQUFHLG1CQUFPLENBQUMsRUFBc0IsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVCcEQsVUFBUyxHQUFHLENBQUMsT0FBTyxFQUFFOztBQUVwQixPQUFJLE9BQU8sR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDOztBQUVuQyxPQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQzs7QUFFckMsT0FBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztBQUN4QixPQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDOztB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Q0Q7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNELGNBQWE7QUFDYixFQUFDO0FBQ0QsRUFBQztBQUNELGNBQWE7QUFDYixFQUFDO0FBQ0QsRUFBQztBQUNELGNBQWE7QUFDYixFQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDO0FBQ0QsY0FBYTtBQUNiLEVBQUM7QUFDRCxFQUFDO0FBQ0QsY0FBYTtBQUNiLEVBQUM7QUFDRCxFQUFDO0FBQ0QsY0FBYTtBQUNiLEVBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNELGNBQWE7QUFDYixFQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDO0FBQ0QsY0FBYTtBQUNiLEVBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7QUFDRCxjQUFhO0FBQ2IsRUFBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNELGNBQWE7QUFDYixFQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDO0FBQ0QsY0FBYTtBQUNiLEVBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7QUFDRCxjQUFhO0FBQ2IsRUFBQztBQUNELEVBQUM7QUFDRCxjQUFhO0FBQ2IsRUFBQztBQUNEO0FBQ0EsY0FBYTtBQUNiLEVBQUM7QUFDRCxFQUFDO0FBQ0QsY0FBYTtBQUNiLEVBQUM7QUFDRCxFQUFDO0FBQ0QsY0FBYTtBQUNiLEVBQUMsR0FBRyxrR0FBa0c7QUFDdEcsRTs7Ozs7OztBQ2hMQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUMsbUNBQW1DLEVBQUU7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNEO0FBQ0EsRUFBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNELGNBQWE7QUFDYixFQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7QUFDRCxjQUFhO0FBQ2IsRUFBQztBQUNELEVBQUM7QUFDRCxjQUFhO0FBQ2IsRUFBQztBQUNELEVBQUM7QUFDRCxjQUFhO0FBQ2IsRUFBQztBQUNEO0FBQ0EsY0FBYTtBQUNiLEVBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNELGNBQWE7QUFDYixFQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiLEVBQUM7QUFDRCxFQUFDO0FBQ0QsY0FBYTtBQUNiLEVBQUM7QUFDRCxFQUFDO0FBQ0QsY0FBYTtBQUNiLEVBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNELGNBQWE7QUFDYixFQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiLEVBQUM7QUFDRCxFQUFDO0FBQ0QsY0FBYTtBQUNiLEVBQUM7QUFDRCxFQUFDO0FBQ0QsY0FBYTtBQUNiLEVBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNELGNBQWE7QUFDYixFQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiLEVBQUM7QUFDRCxFQUFDO0FBQ0QsY0FBYTtBQUNiLEVBQUM7QUFDRCxFQUFDO0FBQ0QsY0FBYTtBQUNiLEVBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7QUFDRCxjQUFhO0FBQ2IsRUFBQztBQUNELEVBQUM7QUFDRCxjQUFhO0FBQ2IsRUFBQztBQUNELEVBQUM7QUFDRCxjQUFhO0FBQ2IsRUFBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDO0FBQ0QsY0FBYTtBQUNiLEVBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7QUFDRCxjQUFhO0FBQ2IsRUFBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNELGNBQWE7QUFDYixFQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDO0FBQ0QsY0FBYTtBQUNiLEVBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7QUFDRCxjQUFhO0FBQ2IsRUFBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNELGNBQWE7QUFDYixFQUFDO0FBQ0QsRUFBQztBQUNELGNBQWE7QUFDYixFQUFDO0FBQ0Q7QUFDQSxjQUFhO0FBQ2IsRUFBQztBQUNELEVBQUM7QUFDRCxjQUFhO0FBQ2IsRUFBQztBQUNELEVBQUM7QUFDRCxjQUFhO0FBQ2IsRUFBQyxHQUFHLGtHQUFrRztBQUN0RyxFOzs7Ozs7O0FDN0xBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQyxtQ0FBbUMsRUFBRTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQVVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDO0FBQ0Q7QUFDQSxFQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDO0FBQ0QsY0FBYTtBQUNiLEVBQUM7QUFDRCxFQUFDO0FBQ0QsY0FBYTtBQUNiLEVBQUM7QUFDRDtBQUNBLGNBQWE7QUFDYixFQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7QUFDRCxjQUFhO0FBQ2IsRUFBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYixFQUFDO0FBQ0QsRUFBQztBQUNELGNBQWE7QUFDYixFQUFDO0FBQ0QsRUFBQztBQUNELGNBQWE7QUFDYixFQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDO0FBQ0QsY0FBYTtBQUNiLEVBQUM7QUFDRCxFQUFDO0FBQ0QsY0FBYTtBQUNiLEVBQUM7QUFDRCxFQUFDO0FBQ0QsY0FBYTtBQUNiLEVBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNELGNBQWE7QUFDYixFQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDO0FBQ0QsY0FBYTtBQUNiLEVBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7QUFDRCxjQUFhO0FBQ2IsRUFBQztBQUNELEVBQUM7QUFDRCxjQUFhO0FBQ2IsRUFBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDO0FBQ0QsY0FBYTtBQUNiLEVBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7QUFDRCxjQUFhO0FBQ2IsRUFBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNELGNBQWE7QUFDYixFQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDO0FBQ0QsY0FBYTtBQUNiLEVBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7QUFDRCxjQUFhO0FBQ2IsRUFBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNELGNBQWE7QUFDYixFQUFDO0FBQ0QsRUFBQztBQUNELGNBQWE7QUFDYixFQUFDO0FBQ0Q7QUFDQSxjQUFhO0FBQ2IsRUFBQztBQUNELEVBQUM7QUFDRCxjQUFhO0FBQ2IsRUFBQztBQUNELEVBQUM7QUFDRCxjQUFhO0FBQ2IsRUFBQyxHQUFHLGtHQUFrRztBQUN0RyxFOzs7Ozs7Ozs7Ozs7O0FDaktBLEtBQUksSUFBSSxHQUFHLG1CQUFPLENBQUMsRUFBa0IsQ0FBQyxDQUFDOztBQUV2QyxPQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsUUFBUSxFQUFFO0FBQ2xDLFdBQVEsR0FBRyxRQUFRLElBQUksRUFBRSxDQUFDOztBQUUxQixXQUFRLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO0FBQ3hDLFdBQVEsQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUM7QUFDNUMsV0FBUSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxJQUFJLEdBQUcsQ0FBQztBQUM3QyxXQUFRLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxXQUFXLElBQUksS0FBSyxDQUFDOztBQUVyRCxVQUFPLFVBQVMsR0FBRyxFQUFFLFNBQVMsRUFBRSxrQkFBa0IsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFOztBQUVsRSxTQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3ZCLFNBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDOzs7QUFHdkMsU0FBSSxVQUFVLFNBQU0sRUFBRTtBQUNwQixXQUFJLFdBQVcsR0FBRyxVQUFVLFNBQU0sQ0FBQzs7QUFFbkMsV0FBSSxXQUFXLFlBQVksS0FBSyxFQUFFO0FBQ2hDLG9CQUFXLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyQztBQUNELGtCQUFXLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFckMsV0FBSSxTQUFTLENBQUM7QUFDZCxXQUFJO0FBQ0Ysa0JBQVMsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsT0FBTyxHQUFHLEdBQUcsR0FBRyxRQUFRLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEgsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNWLGVBQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0Q7O0FBRUQsV0FBSSxDQUFDLFNBQVMsRUFBRTtBQUNkLGtCQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLFNBQVMsQ0FBQztBQUN4QyxvQkFBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQyxNQUFNO0FBQ0wsb0JBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0Rjs7QUFFRCxXQUFJLGFBQWEsR0FBRyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsT0FBTyxHQUFHLEVBQUUsSUFBSSxTQUFTLENBQUM7OztBQUd0RyxXQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDN0Msb0JBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEdBQUcsYUFBYSxDQUFDO1FBQ2pEOztBQUVELFlBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzNDLGFBQUksS0FBSyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFM0IsYUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsT0FBTyxHQUFHLEdBQUcsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRTs7QUFFaEYsc0JBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxhQUFhLEdBQUcsS0FBSyxDQUFDO1VBQ3hDLE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRTs7QUFFMUQsZUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRTtBQUNuQyx3QkFBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUMxRCxNQUFNO0FBQ0wsd0JBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDMUQ7VUFDRjs7O0FBR0QsYUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLEdBQUcsR0FBRyxhQUFhLEdBQUcsUUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLEdBQUcsR0FBRyxHQUFHLFFBQVEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRTtBQUN4SCxzQkFBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1VBQ25EO1FBQ0Y7OztBQUdELGlCQUFVLFNBQU0sR0FBRyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ2pEOztBQUVELFlBQU8sQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLENBQUM7OztBQUdwRSxTQUFJLENBQUMsU0FBUyxFQUFFO0FBQ2QsZ0JBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztNQUNqQjtBQUNELHVCQUFrQixDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzFCLENBQUM7OztBQUlGLFlBQVMsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7O0FBRTNFLFNBQUksTUFBTSxHQUFHLEdBQUcsSUFBSSxRQUFRLENBQUMsV0FBVyxDQUFDO0FBQ3pDLFNBQUksWUFBWSxHQUFHLGtCQUFrQixDQUFDLE1BQU0sQ0FBQzs7OztBQUk3QyxTQUFJLENBQUMsR0FBRyxFQUFFO0FBQ1IsV0FBSSxrQkFBa0IsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLEtBQUssUUFBUSxFQUFFO0FBQ3JELGVBQU0sR0FBRyxNQUFNLENBQUM7UUFDakIsTUFBTSxJQUFJLGtCQUFrQixDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsS0FBSyxNQUFNLEVBQUU7QUFDMUQsZUFBTSxHQUFHLElBQUksQ0FBQztRQUNmOzs7QUFJRCxXQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUU7QUFDbkIsZUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNkLE1BQU0sSUFBSSxVQUFVLE9BQUksRUFBRTtBQUN6QixlQUFNLEdBQUcsT0FBTyxDQUFDO1FBQ2xCLE1BQU0sSUFBSSxVQUFVLENBQUMsR0FBRyxFQUFFO0FBQ3pCLGVBQU0sR0FBRyxLQUFLLENBQUM7UUFDaEI7TUFDRjs7O0FBR0QsU0FBSSxrQkFBa0IsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLEtBQUssTUFBTSxJQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUU7QUFDdEUsVUFBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztNQUNsQixNQUFNLElBQUksa0JBQWtCLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxLQUFLLE1BQU0sSUFBSSxrQkFBa0IsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLEtBQUssYUFBYSxJQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUU7QUFDdkksVUFBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNqQix5QkFBa0IsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsR0FBRyxhQUFhLENBQUM7TUFDL0QsTUFBTSxJQUFJLGtCQUFrQixDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsS0FBSyxhQUFhLElBQUksTUFBTSxLQUFLLElBQUksRUFBRTtBQUNwRixVQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2xCLHlCQUFrQixDQUFDLEdBQUcsRUFBRSxDQUFDO01BQzFCOzs7QUFHRCxTQUFJLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDeE4seUJBQWtCLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDO01BQzFELE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDOUMseUJBQWtCLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDO01BQ3hELE1BQU07QUFDTCx5QkFBa0IsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsR0FBRyxPQUFPLENBQUM7TUFDekQ7O0FBRUQsYUFBUSxNQUFNO0FBQ2QsWUFBSyxLQUFLOztBQUVSLGFBQUksVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUU7QUFDdkMscUJBQVUsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1VBQ3ZCOztBQUVELGFBQUksVUFBVSxDQUFDLEtBQUssSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7QUFDdkMscUJBQVUsQ0FBQyxHQUFHLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQztVQUNuQztBQUNELGFBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFO0FBQ25CLHFCQUFVLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztVQUNyQjtBQUNELGVBQU07QUFDUixZQUFLLE9BQU87QUFDVixhQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRTtBQUNwQixxQkFBVSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7VUFDMUI7QUFDRCxlQUFNO0FBQ1IsWUFBSyxNQUFNO0FBQ1QsWUFBRyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzVCLGVBQU07QUFDUixZQUFLLEdBQUc7QUFDTixhQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRTtBQUNwQixxQkFBVSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7VUFDdkI7QUFBQSxNQUNGOztBQUVELFFBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDOztBQUUxRSxTQUFJLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQzs7QUFFbkIsU0FBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtBQUMvSixVQUFHLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUM7TUFDL0I7OztBQUdELFNBQUksa0JBQWtCLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxLQUFLLE1BQU0sSUFBSSxNQUFNLElBQUksSUFBSSxFQUFFO0FBQ3JFLFVBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7TUFDbkI7SUFDRjtFQUdGLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQy9KRCxRQUFPLENBQUMsS0FBSyxHQUFHLFNBQVMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDbkMsT0FBSSxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUMxQixTQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakIsVUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDakMsWUFBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDNUI7QUFDRCxZQUFPLEtBQUssQ0FBQztJQUNkO0FBQ0QsT0FBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3BCLE9BQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFcEIsT0FBSSxFQUFFLElBQUksRUFBRSxFQUFFO0FBQ1osT0FBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFDZCxPQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQztBQUNkLFNBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2xDLFNBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2xDLE1BQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxQzs7QUFFRCxRQUFLLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRTtBQUNqQixTQUFJLEdBQUcsSUFBSSxPQUFPLEVBQUU7QUFDbEIsUUFBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUNqQjtJQUNGOztBQUVELFVBQU8sQ0FBQyxDQUFDO0VBQ1YsQ0FBQzs7Ozs7Ozs7OztBQVVGLFVBQVMsS0FBSyxDQUFDLEdBQUcsRUFBRTtBQUNsQixVQUFPLEdBQUcsSUFBSSxJQUFJLElBQUksR0FBRyxLQUFLLEVBQUUsQ0FBQztFQUNsQzs7Ozs7Ozs7QUFRRCxRQUFPLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztBQUNsQyxVQUFTLFdBQVcsQ0FBQyxHQUFHLEVBQUU7QUFDeEIsVUFBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsR0FDOUMsR0FBRyxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsR0FBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsRUFBRTtBQUFFLFlBQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQUUsQ0FBQyxHQUMvRixDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDbEM7Ozs7Ozs7OztBQVNELFFBQU8sQ0FBQyxHQUFHLEdBQUcsU0FBUyxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRTtBQUMzQyxPQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDYixRQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN2QyxTQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDekIsVUFBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ3JELE1BQU07QUFDTCxVQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ25DO0lBQ0Y7QUFDRCxPQUFJLElBQUksR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUIsT0FBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2YsWUFBTyxXQUFVLEdBQUcsSUFBSSxHQUFHLElBQUcsQ0FBQztJQUNoQyxNQUFNO0FBQ0wsWUFBTyxFQUFFLENBQUM7SUFDWDtFQUNGLENBQUM7O0FBR0YsUUFBTyxDQUFDLEtBQUssR0FBRyxVQUFVLEdBQUcsRUFBRTtBQUM3QixPQUFJLEdBQUcsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7QUFDbEMsWUFBTyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEtBQUssRUFBRTtBQUMzQyxjQUFPLEtBQUssR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQ2pDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDZCxNQUFNO0FBQ0wsWUFBTyxHQUFHLENBQUM7SUFDWjtFQUNGLENBQUM7Ozs7Ozs7Ozs7QUFVRixRQUFPLENBQUMsSUFBSSxHQUFHLFNBQVMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRTtBQUNyRCxPQUFJLEdBQUcsS0FBSyxPQUFPLEVBQUU7QUFDbkIsUUFBRyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUI7QUFDRCxPQUFJLFNBQVMsSUFBSSxPQUFPLEdBQUcsSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFO0FBQzFDLFNBQUksR0FBRyxFQUFFO0FBQ1AsY0FBTyxHQUFHLElBQUksS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsS0FBSSxHQUFHLEdBQUcsR0FBRyxJQUFHLENBQUMsQ0FBQztNQUNyRCxNQUFNO0FBQ0wsY0FBTyxFQUFFLENBQUM7TUFDWDtJQUNGLE1BQU0sSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxRQUFRLElBQUksT0FBTyxHQUFHLEVBQUU7QUFDN0QsU0FBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUMzQyxjQUFPLENBQUMsSUFBSSxDQUFDLHdEQUF3RCxHQUN4RCw0QkFBNEIsQ0FBQyxDQUFDO01BQzVDLENBQUM7QUFDRixTQUFJLEdBQUcsSUFBSSxPQUFPLEdBQUcsQ0FBQyxXQUFXLEtBQUssVUFBVSxFQUFFO0FBQ2hELGNBQU8sQ0FBQyxJQUFJLENBQUMsd0RBQXdELEdBQ3hELHNCQUFzQixDQUFDLENBQUM7TUFDdEM7QUFDRCxZQUFPLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDN0UsTUFBTSxJQUFJLE9BQU8sRUFBRTtBQUNsQixTQUFJLEdBQUcsSUFBSSxPQUFPLEdBQUcsQ0FBQyxXQUFXLEtBQUssVUFBVSxFQUFFO0FBQ2hELGNBQU8sQ0FBQyxJQUFJLENBQUMsbURBQW1ELENBQUMsQ0FBQztNQUNuRTtBQUNELFlBQU8sR0FBRyxHQUFHLEdBQUcsR0FBRyxLQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFHLENBQUM7SUFDckQsTUFBTTtBQUNMLFNBQUksR0FBRyxJQUFJLE9BQU8sR0FBRyxDQUFDLFdBQVcsS0FBSyxVQUFVLEVBQUU7QUFDaEQsY0FBTyxDQUFDLElBQUksQ0FBQyxtREFBbUQsQ0FBQyxDQUFDO01BQ25FO0FBQ0QsWUFBTyxHQUFHLEdBQUcsR0FBRyxHQUFHLEtBQUksR0FBRyxHQUFHLEdBQUcsSUFBRyxDQUFDO0lBQ3JDO0VBQ0YsQ0FBQzs7Ozs7Ozs7O0FBU0YsUUFBTyxDQUFDLEtBQUssR0FBRyxTQUFTLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFDO0FBQ3hDLE9BQUksR0FBRyxHQUFHLEVBQUUsQ0FBQzs7QUFFYixPQUFJLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUU1QixPQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDZixVQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtBQUNwQyxXQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1dBQ2IsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFbkIsV0FBSSxPQUFPLElBQUksR0FBRyxFQUFFO0FBQ2xCLGFBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUMxQixjQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsS0FBSSxHQUFHLEdBQUcsR0FBRyxJQUFHLENBQUMsQ0FBQztVQUN4QztRQUNGLE1BQU07QUFDTCxZQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNoRDtNQUNGO0lBQ0Y7O0FBRUQsVUFBTyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3JCLENBQUM7Ozs7Ozs7Ozs7QUFVRixRQUFPLENBQUMsTUFBTSxHQUFHLFNBQVMsTUFBTSxDQUFDLElBQUksRUFBQztBQUNwQyxPQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQ3RCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQ3RCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQ3JCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQ3JCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDM0IsT0FBSSxNQUFNLEtBQUssRUFBRSxHQUFHLElBQUk7QUFBRSxZQUFPLElBQUksQ0FBQzs7QUFDakMsWUFBTyxNQUFNLENBQUM7SUFBQTtFQUNwQixDQUFDOzs7Ozs7Ozs7Ozs7QUFZRixRQUFPLENBQUMsT0FBTyxHQUFHLFNBQVMsT0FBTyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBQztBQUM1RCxPQUFJLEVBQUUsR0FBRyxZQUFZLEtBQUssQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDO0FBQ3ZDLE9BQUksQ0FBQyxPQUFPLE1BQU0sSUFBSSxXQUFXLElBQUksQ0FBQyxRQUFRLEtBQUssQ0FBQyxHQUFHLEVBQUU7QUFDdkQsUUFBRyxDQUFDLE9BQU8sSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDO0FBQ3BDLFdBQU0sR0FBRyxDQUFDO0lBQ1g7QUFDRCxPQUFJO0FBQ0YsUUFBRyxHQUFHLEdBQUcsSUFBSSxtQkFBTyxDQUFDLEVBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDO0lBQzFELENBQUMsT0FBTyxFQUFFLEVBQUU7QUFDWCxZQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUM7SUFDM0I7QUFDRCxPQUFJLE9BQU8sR0FBRyxDQUFDO09BQ1gsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO09BQ3ZCLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxPQUFPLEVBQUUsQ0FBQyxDQUFDO09BQ3JDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDOzs7QUFHbkQsT0FBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVMsSUFBSSxFQUFFLENBQUMsRUFBQztBQUN6RCxTQUFJLElBQUksR0FBRyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUN6QixZQUFPLENBQUMsSUFBSSxJQUFJLE1BQU0sR0FBRyxNQUFNLEdBQUcsTUFBTSxJQUNwQyxJQUFJLEdBQ0osSUFBSSxHQUNKLElBQUksQ0FBQztJQUNWLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7OztBQUdkLE1BQUcsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO0FBQ3BCLE1BQUcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxRQUFRLElBQUksTUFBTSxJQUFJLEdBQUcsR0FBRyxNQUFNLEdBQzdDLElBQUksR0FBRyxPQUFPLEdBQUcsTUFBTSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUM7QUFDMUMsU0FBTSxHQUFHLENBQUM7RUFDWCxDOzs7Ozs7O0FDdk9ELGdCIiwic291cmNlc0NvbnRlbnQiOlsidmFyIG5vdGlmaWNhdGlvbiA9IHJlcXVpcmUoJ2NsaWVudC9ub3RpZmljYXRpb24nKTtcbnZhciBnZXRDc3JmQ29va2llID0gcmVxdWlyZSgnY2xpZW50L2dldENzcmZDb29raWUnKTtcbi8vIFdyYXBwZXIgYWJvdXQgWEhSXG4vLyAjIEdsb2JhbCBFdmVudHNcbi8vIHRyaWdnZXJzIGRvY3VtZW50LmxvYWRzdGFydC9sb2FkZW5kIG9uIGNvbW11bmljYXRpb24gc3RhcnQvZW5kXG4vLyAgICAtLT4gdW5sZXNzIG9wdGlvbnMubm9HbG9iYWxFdmVudHMgaXMgc2V0XG4vL1xuLy8gIyBFdmVudHNcbi8vIHRyaWdnZXJzIGZhaWwvc3VjY2VzcyBvbiBsb2FkIGVuZDpcbi8vICAgIC0tPiBieSBkZWZhdWx0IHN0YXR1cz0yMDAgaXMgb2ssIHRoZSBvdGhlcnMgYXJlIGZhaWx1cmVzXG4vLyAgICAtLT4gb3B0aW9ucy5ub3JtYWxTdGF0dXNlcyA9IFsyMDEsNDA5XSBhbGxvdyBnaXZlbiBzdGF0dXNlc1xuLy8gICAgLS0+IGZhaWwgZXZlbnQgaGFzIC5yZWFzb24gZmllbGRcbi8vICAgIC0tPiBzdWNjZXNzIGV2ZW50IGhhcyAucmVzdWx0IGZpZWxkXG4vL1xuLy8gIyBKU09OXG4vLyAgICAtLT4gc2VuZChvYmplY3QpIGNhbGxzIEpTT04uc3RyaW5naWZ5XG4vLyAgICAtLT4gYWRkcyBBY2NlcHQ6IGpzb24gKHdlIHdhbnQganNvbikgYnkgZGVmYXVsdCwgdW5sZXNzIG9wdGlvbnMucmF3XG4vLyBpZiBvcHRpb25zLmpzb24gb3Igc2VydmVyIHJldHVybmVkIGpzb24gY29udGVudCB0eXBlXG4vLyAgICAtLT4gYXV0b3BhcnNlIGpzb25cbi8vICAgIC0tPiBmYWlsIGlmIGVycm9yXG4vL1xuLy8gIyBDU1JGXG4vLyAgICAtLT4gcmVxdWVzdHMgc2VuZHMgaGVhZGVyIFgtWFNSRi1UT0tFTiBmcm9tIGNvb2tpZVxuXG5mdW5jdGlvbiB4aHIob3B0aW9ucykge1xuXG4gIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgdmFyIG1ldGhvZCA9IG9wdGlvbnMubWV0aG9kIHx8ICdHRVQnO1xuXG4gIHZhciBib2R5ID0gb3B0aW9ucy5ib2R5O1xuICB2YXIgdXJsID0gb3B0aW9ucy51cmw7XG5cbiAgcmVxdWVzdC5vcGVuKG1ldGhvZCwgdXJsLCBvcHRpb25zLnN5bmMgPyBmYWxzZSA6IHRydWUpO1xuXG4gIHJlcXVlc3QubWV0aG9kID0gbWV0aG9kO1xuXG4gIC8vIHRva2VuL2hlYWRlciBuYW1lcyBzYW1lIGFzIGFuZ3VsYXIgJGh0dHAgZm9yIGVhc2llciBpbnRlcm9wXG4gIHZhciBjc3JmQ29va2llID0gZ2V0Q3NyZkNvb2tpZSgpXG4gIGlmIChjc3JmQ29va2llICYmICFvcHRpb25zLnNraXBDc3JmKSB7XG4gICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKFwiWC1YU1JGLVRPS0VOXCIsIGNzcmZDb29raWUpO1xuICB9XG5cbiAgaWYgKHt9LnRvU3RyaW5nLmNhbGwoYm9keSkgPT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICAvLyBtdXN0IGJlIE9QRU5lZCB0byBzZXRSZXF1ZXN0SGVhZGVyXG4gICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PVVURi04XCIpO1xuICAgIGJvZHkgPSBKU09OLnN0cmluZ2lmeShib2R5KTtcbiAgfVxuXG5cbiAgaWYgKCFvcHRpb25zLm5vR2xvYmFsRXZlbnRzKSB7XG4gICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdsb2Fkc3RhcnQnLCBldmVudCA9PiB7XG4gICAgICB2YXIgZSA9IHdyYXBFdmVudCgneGhyc3RhcnQnLCBldmVudCk7XG4gICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGUpO1xuICAgIH0pO1xuICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcignbG9hZGVuZCcsIGV2ZW50ID0+IHtcbiAgICAgIHZhciBlID0gd3JhcEV2ZW50KCd4aHJlbmQnLCBldmVudCk7XG4gICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGUpO1xuICAgIH0pO1xuICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcignc3VjY2VzcycsIGV2ZW50ID0+IHtcbiAgICAgIHZhciBlID0gd3JhcEV2ZW50KCd4aHJzdWNjZXNzJywgZXZlbnQpO1xuICAgICAgZS5yZXN1bHQgPSBldmVudC5yZXN1bHQ7XG4gICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGUpO1xuICAgIH0pO1xuICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcignZmFpbCcsIGV2ZW50ID0+IHtcbiAgICAgIHZhciBlID0gd3JhcEV2ZW50KCd4aHJmYWlsJywgZXZlbnQpO1xuICAgICAgZS5yZWFzb24gPSBldmVudC5yZWFzb247XG4gICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGUpO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKCFvcHRpb25zLnJhdykgeyAvLyBtZWFucyB3ZSB3YW50IGpzb25cbiAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICB9XG5cbiAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdYLVJlcXVlc3RlZC1XaXRoJywgXCJYTUxIdHRwUmVxdWVzdFwiKTtcblxuICB2YXIgbm9ybWFsU3RhdHVzZXMgPSBvcHRpb25zLm5vcm1hbFN0YXR1c2VzIHx8IFsyMDBdO1xuXG4gIGZ1bmN0aW9uIHdyYXBFdmVudChuYW1lLCBlKSB7XG4gICAgdmFyIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KG5hbWUpO1xuICAgIGV2ZW50Lm9yaWdpbmFsRXZlbnQgPSBlO1xuICAgIHJldHVybiBldmVudDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZhaWwocmVhc29uLCBvcmlnaW5hbEV2ZW50KSB7XG4gICAgdmFyIGUgPSB3cmFwRXZlbnQoXCJmYWlsXCIsIG9yaWdpbmFsRXZlbnQpO1xuICAgIGUucmVhc29uID0gcmVhc29uO1xuICAgIHJlcXVlc3QuZGlzcGF0Y2hFdmVudChlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzdWx0LCBvcmlnaW5hbEV2ZW50KSB7XG4gICAgdmFyIGUgPSB3cmFwRXZlbnQoXCJzdWNjZXNzXCIsIG9yaWdpbmFsRXZlbnQpO1xuICAgIGUucmVzdWx0ID0gcmVzdWx0O1xuICAgIHJlcXVlc3QuZGlzcGF0Y2hFdmVudChlKTtcbiAgfVxuXG4gIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIGUgPT4ge1xuICAgIGZhaWwoXCLQntGI0LjQsdC60LAg0YHQstGP0LfQuCDRgSDRgdC10YDQstC10YDQvtC8LlwiLCBlKTtcbiAgfSk7XG5cbiAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKFwidGltZW91dFwiLCBlID0+IHtcbiAgICBmYWlsKFwi0J/RgNC10LLRi9GI0LXQvdC+INC80LDQutGB0LjQvNCw0LvRjNC90L4g0LTQvtC/0YPRgdGC0LjQvNC+0LUg0LLRgNC10LzRjyDQvtC20LjQtNCw0L3QuNGPINC+0YLQstC10YLQsCDQvtGCINGB0LXRgNCy0LXRgNCwLlwiLCBlKTtcbiAgfSk7XG5cbiAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgZSA9PiB7XG4gICAgZmFpbChcItCX0LDQv9GA0L7RgSDQsdGL0Lsg0L/RgNC10YDQstCw0L0uXCIsIGUpO1xuICB9KTtcblxuICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGUgPT4ge1xuICAgIGlmICghcmVxdWVzdC5zdGF0dXMpIHsgLy8gZG9lcyB0aGF0IGV2ZXIgaGFwcGVuP1xuICAgICAgZmFpbChcItCd0LUg0L/QvtC70YPRh9C10L0g0L7RgtCy0LXRgiDQvtGCINGB0LXRgNCy0LXRgNCwLlwiLCBlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobm9ybWFsU3RhdHVzZXMuaW5kZXhPZihyZXF1ZXN0LnN0YXR1cykgPT0gLTEpIHtcbiAgICAgIGZhaWwoXCLQntGI0LjQsdC60LAg0L3QsCDRgdGC0L7RgNC+0L3QtSDRgdC10YDQstC10YDQsCAo0LrQvtC0IFwiICsgcmVxdWVzdC5zdGF0dXMgKyBcIiksINC/0L7Qv9GL0YLQsNC50YLQtdGB0Ywg0L/QvtC30LTQvdC10LVcIiwgZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IHJlcXVlc3QucmVzcG9uc2VUZXh0O1xuICAgIHZhciBjb250ZW50VHlwZSA9IHJlcXVlc3QuZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LVR5cGVcIik7XG4gICAgaWYgKGNvbnRlbnRUeXBlLm1hdGNoKC9eYXBwbGljYXRpb25cXC9qc29uLykgfHwgb3B0aW9ucy5qc29uKSB7IC8vIGF1dG9wYXJzZSBqc29uIGlmIFdBTlQgb3IgUkVDRUlWRUQganNvblxuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShyZXN1bHQpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBmYWlsKFwi0J3QtdC60L7RgNGA0LXQutGC0L3Ri9C5INGE0L7RgNC80LDRgiDQvtGC0LLQtdGC0LAg0L7RgiDRgdC10YDQstC10YDQsFwiLCBlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHN1Y2Nlc3MocmVzdWx0LCBlKTtcbiAgfSk7XG5cbiAgLy8gZGVmZXIgdG8gbGV0IG90aGVyIGhhbmRsZXJzIGJlIGFzc2lnbmVkXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgcmVxdWVzdC5zZW5kKGJvZHkpO1xuICB9LCAwKTtcblxuICByZXR1cm4gcmVxdWVzdDtcblxufVxuXG5cbmZ1bmN0aW9uIGFkZFVybFBhcmFtKHVybCwgbmFtZSwgdmFsdWUpIHtcbiAgdmFyIHBhcmFtID0gZW5jb2RlVVJJQ29tcG9uZW50KG5hbWUpICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcbiAgaWYgKH51cmwuaW5kZXhPZignPycpKSB7XG4gICAgcmV0dXJuIHVybCArICcmJyArIHBhcmFtO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB1cmwgKyAnPycgKyBwYXJhbTtcbiAgfVxuXG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3hocmZhaWwnLCBmdW5jdGlvbihldmVudCkge1xuICBuZXcgbm90aWZpY2F0aW9uLkVycm9yKGV2ZW50LnJlYXNvbik7XG59KTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IHhocjtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vY2xpZW50L3hoci5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBjc3JmQ29va2llID0gZG9jdW1lbnQuY29va2llLm1hdGNoKC9YU1JGLVRPS0VOPShbXFx3LV0rKS8pO1xuICByZXR1cm4gY3NyZkNvb2tpZSA/IGNzcmZDb29raWVbMV0gOiBudWxsO1xufTtcblxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9jbGllbnQvZ2V0Q3NyZkNvb2tpZS5qc1xuICoqLyIsImV4cG9ydHMuQXV0aE1vZGFsID0gcmVxdWlyZSgnLi9hdXRoTW9kYWwnKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vaGFuZGxlcnMvYXV0aC9jbGllbnQvaW5kZXguanNcbiAqKi8iLCJcbmV4cG9ydHMudGh1bWIgPSBmdW5jdGlvbih1cmwsIHdpZHRoLCBoZWlnaHQpIHtcbiAgLy8gc29tZXRpbWVzIHRoaXMgbWF5IGJlIGNhbGxlZCB3aXRob3V0IHVybFxuICBpZiAoIXVybCkgcmV0dXJuIHVybDtcblxuICB2YXIgcGl4ZWxSYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuXG4gIC8vIHJldHVybiBwaXhlbFJhdGlvIHRpbWVzIGxhcmdlciBpbWFnZSBmb3IgcmV0aW5hXG4gIHdpZHRoICo9IHBpeGVsUmF0aW87XG4gIGhlaWdodCAqPSBwaXhlbFJhdGlvO1xuXG4gIHZhciBtb2RpZmllciA9ICh3aWR0aCA8PSAxNjAgJiYgaGVpZ2h0IDw9IDE2MCkgPyAndCcgOlxuICAgICh3aWR0aCA8PSAzMjAgJiYgaGVpZ2h0IDw9IDMyMCkgPyAnbScgOlxuICAgICAgKHdpZHRoIDw9IDY0MCAmJiBoZWlnaHQgPD0gNjQwKSA/ICdpJyA6XG4gICAgICAgICh3aWR0aCA8PSAxMDI0ICYmIGhlaWdodCA8PSAxMDI0KSA/ICdoJyA6ICcnO1xuXG4gIHJldHVybiB1cmwuc2xpY2UoMCwgdXJsLmxhc3RJbmRleE9mKCcuJykpICsgbW9kaWZpZXIgKyB1cmwuc2xpY2UodXJsLmxhc3RJbmRleE9mKCcuJykpO1xufTtcblxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9jbGllbnQvaW1hZ2UuanNcbiAqKi8iLCJ2YXIgeGhyID0gcmVxdWlyZSgnY2xpZW50L3hocicpO1xuXG52YXIgZGVsZWdhdGUgPSByZXF1aXJlKCdjbGllbnQvZGVsZWdhdGUnKTtcbnZhciBNb2RhbCA9IHJlcXVpcmUoJ2NsaWVudC9oZWFkL21vZGFsJyk7XG52YXIgU3Bpbm5lciA9IHJlcXVpcmUoJ2NsaWVudC9zcGlubmVyJyk7XG5cblxudmFyIGxvZ2luRm9ybSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9sb2dpbi1mb3JtLmphZGUnKTtcbnZhciByZWdpc3RlckZvcm0gPSByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvcmVnaXN0ZXItZm9ybS5qYWRlJyk7XG52YXIgZm9yZ290Rm9ybSA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy9mb3Jnb3QtZm9ybS5qYWRlJyk7XG5cbnZhciBjbGllbnRSZW5kZXIgPSByZXF1aXJlKCdjbGllbnQvY2xpZW50UmVuZGVyJyk7XG5cbi8qKlxuICogT3B0aW9uczpcbiAqICAgLSBjYWxsYmFjazogZnVuY3Rpb24gdG8gYmUgY2FsbGVkIGFmdGVyIHN1Y2Nlc3NmdWwgbG9naW4gKGJ5IGRlZmF1bHQgLSBnbyB0byBzdWNjZXNzUmVkaXJlY3QpXG4gKiAgIC0gbWVzc2FnZTogZm9ybSBtZXNzYWdlIHRvIGJlIHNob3duIHdoZW4gdGhlIGxvZ2luIGZvcm0gYXBwZWFycyAoXCJMb2cgaW4gdG8gbGVhdmUgdGhlIGNvbW1lbnRcIilcbiAqICAgLSBzdWNjZXNzUmVkaXJlY3Q6IHRoZSBwYWdlIHRvIHJlZGlyZWN0IChjdXJyZW50IHBhZ2UgYnkgZGVmYXVsdClcbiAqICAgICAgIC0gYWZ0ZXIgaW1tZWRpYXRlIGxvZ2luXG4gKiAgICAgICAtIGFmdGVyIHJlZ2lzdHJhdGlvbiBmb3IgXCJjb25maXJtIGVtYWlsXCIgbGlua1xuICovXG5mdW5jdGlvbiBBdXRoTW9kYWwob3B0aW9ucykge1xuICBNb2RhbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICBpZiAoIW9wdGlvbnMuc3VjY2Vzc1JlZGlyZWN0KSB7XG4gICAgb3B0aW9ucy5zdWNjZXNzUmVkaXJlY3QgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgfVxuXG4gIHZhciBzZWxmID0gdGhpcztcbiAgaWYgKCFvcHRpb25zLmNhbGxiYWNrKSB7XG4gICAgb3B0aW9ucy5jYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgc2VsZi5zdWNjZXNzUmVkaXJlY3QoKTtcbiAgICB9O1xuICB9XG5cbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgdGhpcy5zZXRDb250ZW50KGNsaWVudFJlbmRlcihsb2dpbkZvcm0pKTtcblxuICBpZiAob3B0aW9ucy5tZXNzYWdlKSB7XG4gICAgdGhpcy5zaG93Rm9ybU1lc3NhZ2Uob3B0aW9ucy5tZXNzYWdlLCAnaW5mbycpO1xuICB9XG5cbiAgdGhpcy5pbml0RXZlbnRIYW5kbGVycygpO1xufVxuQXV0aE1vZGFsLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoTW9kYWwucHJvdG90eXBlKTtcblxuXG5kZWxlZ2F0ZS5kZWxlZ2F0ZU1peGluKEF1dGhNb2RhbC5wcm90b3R5cGUpO1xuXG5BdXRoTW9kYWwucHJvdG90eXBlLnN1Y2Nlc3NSZWRpcmVjdCA9IGZ1bmN0aW9uKCkge1xuICBpZiAod2luZG93LmxvY2F0aW9uLmhyZWYgPT0gdGhpcy5vcHRpb25zLnN1Y2Nlc3NSZWRpcmVjdCkge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgfSBlbHNlIHtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHRoaXMub3B0aW9ucy5zdWNjZXNzUmVkaXJlY3Q7XG4gIH1cbn07XG5cbkF1dGhNb2RhbC5wcm90b3R5cGUuY2xlYXJGb3JtTWVzc2FnZXMgPSBmdW5jdGlvbigpIHtcbiAgLypcbiAgIHJlbW92ZSBlcnJvciBmb3IgdGhpcyBub3RhdGlvbjpcbiAgIHNwYW4udGV4dC1pbnB1dC50ZXh0LWlucHV0X2ludmFsaWQubG9naW4tZm9ybV9faW5wdXRcbiAgIGlucHV0LnRleHQtaW5wdXRfX2NvbnRyb2wjcGFzc3dvcmQodHlwZT1cInBhc3N3b3JkXCIsIG5hbWU9XCJwYXNzd29yZFwiKVxuICAgc3Bhbi50ZXh0LWlucHV4dF9fZXJyINCf0LDRgNC+0LvQuCDQvdC1INGB0L7QstC/0LDQtNCw0Y7RglxuICAgKi9cbiAgW10uZm9yRWFjaC5jYWxsKHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yQWxsKCcudGV4dC1pbnB1dF9pbnZhbGlkJyksIGZ1bmN0aW9uKGVsZW0pIHtcbiAgICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3RleHQtaW5wdXRfaW52YWxpZCcpO1xuICB9KTtcblxuICBbXS5mb3JFYWNoLmNhbGwodGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3JBbGwoJy50ZXh0LWlucHV0X19lcnInKSwgZnVuY3Rpb24oZWxlbSkge1xuICAgIGVsZW0ucmVtb3ZlKCk7XG4gIH0pO1xuXG4gIC8vIGNsZWFyIGZvcm0td2lkZSBub3RpZmljYXRpb25cbiAgdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW5vdGlmaWNhdGlvbl0nKS5pbm5lckhUTUwgPSAnJztcbn07XG5cbkF1dGhNb2RhbC5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgdmFyIHJlcXVlc3QgPSB4aHIob3B0aW9ucyk7XG5cbiAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdsb2Fkc3RhcnQnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgb25FbmQgPSB0aGlzLnN0YXJ0UmVxdWVzdEluZGljYXRpb24oKTtcbiAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRlbmQnLCBvbkVuZCk7XG4gIH0uYmluZCh0aGlzKSk7XG5cbiAgcmV0dXJuIHJlcXVlc3Q7XG59O1xuXG5BdXRoTW9kYWwucHJvdG90eXBlLnN0YXJ0UmVxdWVzdEluZGljYXRpb24gPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5zaG93T3ZlcmxheSgpO1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdmFyIHN1Ym1pdEJ1dHRvbiA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCdbdHlwZT1cInN1Ym1pdFwiXScpO1xuXG4gIGlmIChzdWJtaXRCdXR0b24pIHtcbiAgICB2YXIgc3Bpbm5lciA9IG5ldyBTcGlubmVyKHtcbiAgICAgIGVsZW06ICAgICAgc3VibWl0QnV0dG9uLFxuICAgICAgc2l6ZTogICAgICAnc21hbGwnLFxuICAgICAgY2xhc3M6ICAgICAnc3VibWl0LWJ1dHRvbl9fc3Bpbm5lcicsXG4gICAgICBlbGVtQ2xhc3M6ICdzdWJtaXQtYnV0dG9uX3Byb2dyZXNzJ1xuICAgIH0pO1xuICAgIHNwaW5uZXIuc3RhcnQoKTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiBvbkVuZCgpIHtcbiAgICBzZWxmLmhpZGVPdmVybGF5KCk7XG4gICAgaWYgKHNwaW5uZXIpIHNwaW5uZXIuc3RvcCgpO1xuICB9O1xuXG59O1xuXG5BdXRoTW9kYWwucHJvdG90eXBlLmluaXRFdmVudEhhbmRsZXJzID0gZnVuY3Rpb24oKSB7XG5cbiAgdGhpcy5kZWxlZ2F0ZSgnW2RhdGEtc3dpdGNoPVwicmVnaXN0ZXItZm9ybVwiXScsICdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5zZXRDb250ZW50KGNsaWVudFJlbmRlcihyZWdpc3RlckZvcm0pKTtcbiAgfSk7XG5cbiAgdGhpcy5kZWxlZ2F0ZSgnW2RhdGEtc3dpdGNoPVwibG9naW4tZm9ybVwiXScsICdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5zZXRDb250ZW50KGNsaWVudFJlbmRlcihsb2dpbkZvcm0pKTtcbiAgfSk7XG5cbiAgdGhpcy5kZWxlZ2F0ZSgnW2RhdGEtc3dpdGNoPVwiZm9yZ290LWZvcm1cIl0nLCAnY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgLy8gbW92ZSBjdXJyZW50bHkgZW50ZXJlZCBlbWFpbCBpbnRvIGZvcmdvdEZvcm1cbiAgICB2YXIgb2xkRW1haWxJbnB1dCA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCdbdHlwZT1cImVtYWlsXCJdJyk7XG4gICAgdGhpcy5zZXRDb250ZW50KGNsaWVudFJlbmRlcihmb3Jnb3RGb3JtKSk7XG4gICAgdmFyIG5ld0VtYWlsSW5wdXQgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignW3R5cGU9XCJlbWFpbFwiXScpO1xuICAgIG5ld0VtYWlsSW5wdXQudmFsdWUgPSBvbGRFbWFpbElucHV0LnZhbHVlO1xuICB9KTtcblxuXG4gIHRoaXMuZGVsZWdhdGUoJ1tkYXRhLWZvcm09XCJsb2dpblwiXScsICdzdWJtaXQnLCBmdW5jdGlvbihldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5zdWJtaXRMb2dpbkZvcm0oZXZlbnQudGFyZ2V0KTtcbiAgfSk7XG5cblxuICB0aGlzLmRlbGVnYXRlKCdbZGF0YS1mb3JtPVwicmVnaXN0ZXJcIl0nLCAnc3VibWl0JywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuc3VibWl0UmVnaXN0ZXJGb3JtKGV2ZW50LnRhcmdldCk7XG4gIH0pO1xuXG4gIHRoaXMuZGVsZWdhdGUoJ1tkYXRhLWZvcm09XCJmb3Jnb3RcIl0nLCAnc3VibWl0JywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuc3VibWl0Rm9yZ290Rm9ybShldmVudC50YXJnZXQpO1xuICB9KTtcblxuICB0aGlzLmRlbGVnYXRlKFwiW2RhdGEtcHJvdmlkZXJdXCIsIFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMub3BlbkF1dGhQb3B1cCgnL2F1dGgvbG9naW4vJyArIGV2ZW50LmRlbGVnYXRlVGFyZ2V0LmRhdGFzZXQucHJvdmlkZXIpO1xuICB9KTtcblxuICB0aGlzLmRlbGVnYXRlKCdbZGF0YS1hY3Rpb24tdmVyaWZ5LWVtYWlsXScsICdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIHZhciBwYXlsb2FkID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgcGF5bG9hZC5hcHBlbmQoXCJlbWFpbFwiLCBldmVudC5kZWxlZ2F0ZVRhcmdldC5kYXRhc2V0LmFjdGlvblZlcmlmeUVtYWlsKTtcblxuICAgIHZhciByZXF1ZXN0ID0gdGhpcy5yZXF1ZXN0KHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgdXJsOiAgICAnL2F1dGgvcmV2ZXJpZnknLFxuICAgICAgYm9keTogcGF5bG9hZFxuICAgIH0pO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcignc3VjY2VzcycsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICAgIGlmICh0aGlzLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgc2VsZi5zaG93Rm9ybU1lc3NhZ2UoXCLQn9C40YHRjNC80L4t0L/QvtC00YLQstC10YDQttC00LXQvdC40LUg0L7RgtC/0YDQsNCy0LvQtdC90L4g0LXRidGRINGA0LDQty5cIiwgJ3N1Y2Nlc3MnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYuc2hvd0Zvcm1NZXNzYWdlKGV2ZW50LnJlc3VsdCwgJ2Vycm9yJyk7XG4gICAgICB9XG5cbiAgICB9KTtcblxuICB9KTtcbn07XG5cbkF1dGhNb2RhbC5wcm90b3R5cGUuc3VibWl0UmVnaXN0ZXJGb3JtID0gZnVuY3Rpb24oZm9ybSkge1xuXG4gIHRoaXMuY2xlYXJGb3JtTWVzc2FnZXMoKTtcblxuICB2YXIgaGFzRXJyb3JzID0gZmFsc2U7XG4gIGlmICghZm9ybS5lbGVtZW50cy5lbWFpbC52YWx1ZSkge1xuICAgIGhhc0Vycm9ycyA9IHRydWU7XG4gICAgdGhpcy5zaG93SW5wdXRFcnJvcihmb3JtLmVsZW1lbnRzLmVtYWlsLCAn0JLQstC10LTQuNGC0LUsINC/0L7QttCw0LvRg9GB0YLQsCwgZW1haWwuJyk7XG4gIH1cblxuICBpZiAoIWZvcm0uZWxlbWVudHMuZGlzcGxheU5hbWUudmFsdWUpIHtcbiAgICBoYXNFcnJvcnMgPSB0cnVlO1xuICAgIHRoaXMuc2hvd0lucHV0RXJyb3IoZm9ybS5lbGVtZW50cy5kaXNwbGF5TmFtZSwgJ9CS0LLQtdC00LjRgtC1LCDQv9C+0LbQsNC70YPRgdGC0LAsINC40LzRjyDQv9C+0LvRjNC30L7QstCw0YLQtdC70Y8uJyk7XG4gIH1cblxuICBpZiAoIWZvcm0uZWxlbWVudHMucGFzc3dvcmQudmFsdWUpIHtcbiAgICBoYXNFcnJvcnMgPSB0cnVlO1xuICAgIHRoaXMuc2hvd0lucHV0RXJyb3IoZm9ybS5lbGVtZW50cy5wYXNzd29yZCwgJ9CS0LLQtdC00LjRgtC1LCDQv9C+0LbQsNC70YPRgdGC0LAsINC/0LDRgNC+0LvRjC4nKTtcbiAgfVxuXG4gIGlmIChoYXNFcnJvcnMpIHJldHVybjtcblxuICB2YXIgcGF5bG9hZCA9IG5ldyBGb3JtRGF0YShmb3JtKTtcbiAgcGF5bG9hZC5hcHBlbmQoXCJzdWNjZXNzUmVkaXJlY3RcIiwgdGhpcy5vcHRpb25zLnN1Y2Nlc3NSZWRpcmVjdCk7XG5cbiAgdmFyIHJlcXVlc3QgPSB0aGlzLnJlcXVlc3Qoe1xuICAgIG1ldGhvZDogICAgICAgICAgJ1BPU1QnLFxuICAgIHVybDogICAgICAgICAgICAgJy9hdXRoL3JlZ2lzdGVyJyxcbiAgICBub3JtYWxTdGF0dXNlczogWzIwMSwgNDAwXSxcbiAgICBib2R5OiBwYXlsb2FkXG4gIH0pO1xuXG4gIHZhciBzZWxmID0gdGhpcztcbiAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdzdWNjZXNzJywgZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgIGlmICh0aGlzLnN0YXR1cyA9PSAyMDEpIHtcbiAgICAgIHNlbGYuc2V0Q29udGVudChjbGllbnRSZW5kZXIobG9naW5Gb3JtKSk7XG4gICAgICBzZWxmLnNob3dGb3JtTWVzc2FnZShcbiAgICAgICAgICBcIjxwPtChINCw0LTRgNC10YHQsCBub3RpZnlAamF2YXNjcmlwdC5ydSDQvtGC0L/RgNCw0LLQu9C10L3QviDQv9C40YHRjNC80L4g0YHQviDRgdGB0YvQu9C60L7QuS3Qv9C+0LTRgtCy0LXRgNC20LTQtdC90LjQtdC8LjwvcD5cIiArXG4gICAgICAgICAgXCI8cD48YSBocmVmPScjJyBkYXRhLWFjdGlvbi12ZXJpZnktZW1haWw9J1wiICsgZm9ybS5lbGVtZW50cy5lbWFpbC52YWx1ZSArIFwiJz7Qv9C10YDQtdC30LDQv9GA0L7RgdC40YLRjCDQv9C+0LTRgtCy0LXRgNC20LTQtdC90LjQtS48L2E+PC9wPlwiLFxuICAgICAgICAnc3VjY2VzcydcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3RhdHVzID09IDQwMCkge1xuICAgICAgZm9yICh2YXIgZmllbGQgaW4gZXZlbnQucmVzdWx0LmVycm9ycykge1xuICAgICAgICBzZWxmLnNob3dJbnB1dEVycm9yKGZvcm0uZWxlbWVudHNbZmllbGRdLCBldmVudC5yZXN1bHQuZXJyb3JzW2ZpZWxkXSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2VsZi5zaG93Rm9ybU1lc3NhZ2UoXCLQndC10LjQt9Cy0LXRgdGC0L3Ri9C5INGB0YLQsNGC0YPRgSDQvtGC0LLQtdGC0LAg0YHQtdGA0LLQtdGA0LBcIiwgJ2Vycm9yJyk7XG4gIH0pO1xuXG59O1xuXG5cbkF1dGhNb2RhbC5wcm90b3R5cGUuc3VibWl0Rm9yZ290Rm9ybSA9IGZ1bmN0aW9uKGZvcm0pIHtcblxuICB0aGlzLmNsZWFyRm9ybU1lc3NhZ2VzKCk7XG5cbiAgdmFyIGhhc0Vycm9ycyA9IGZhbHNlO1xuICBpZiAoIWZvcm0uZWxlbWVudHMuZW1haWwudmFsdWUpIHtcbiAgICBoYXNFcnJvcnMgPSB0cnVlO1xuICAgIHRoaXMuc2hvd0lucHV0RXJyb3IoZm9ybS5lbGVtZW50cy5lbWFpbCwgJ9CS0LLQtdC00LjRgtC1LCDQv9C+0LbQsNC70YPRgdGC0LAsIGVtYWlsLicpO1xuICB9XG5cbiAgaWYgKGhhc0Vycm9ycykgcmV0dXJuO1xuXG4gIHZhciBwYXlsb2FkID0gbmV3IEZvcm1EYXRhKGZvcm0pO1xuICBwYXlsb2FkLmFwcGVuZChcInN1Y2Nlc3NSZWRpcmVjdFwiLCB0aGlzLm9wdGlvbnMuc3VjY2Vzc1JlZGlyZWN0KTtcblxuICB2YXIgcmVxdWVzdCA9IHRoaXMucmVxdWVzdCh7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgdXJsOiAgICAnL2F1dGgvZm9yZ290JyxcbiAgICBub3JtYWxTdGF0dXNlczogWzIwMCwgNDA0XSxcbiAgICBib2R5OiBwYXlsb2FkXG4gIH0pO1xuXG4gIHZhciBzZWxmID0gdGhpcztcbiAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdzdWNjZXNzJywgZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgIGlmICh0aGlzLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgIHNlbGYuc2V0Q29udGVudChjbGllbnRSZW5kZXIobG9naW5Gb3JtKSk7XG4gICAgICBzZWxmLnNob3dGb3JtTWVzc2FnZShldmVudC5yZXN1bHQsICdzdWNjZXNzJyk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXR1cyA9PSA0MDQpIHtcbiAgICAgIHNlbGYuc2hvd0Zvcm1NZXNzYWdlKGV2ZW50LnJlc3VsdCwgJ2Vycm9yJyk7XG4gICAgfVxuICB9KTtcblxufTtcblxuXG5BdXRoTW9kYWwucHJvdG90eXBlLnNob3dJbnB1dEVycm9yID0gZnVuY3Rpb24oaW5wdXQsIGVycm9yKSB7XG4gIGlucHV0LnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgndGV4dC1pbnB1dF9pbnZhbGlkJyk7XG4gIHZhciBlcnJvclNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gIGVycm9yU3Bhbi5jbGFzc05hbWUgPSAndGV4dC1pbnB1dF9fZXJyJztcbiAgZXJyb3JTcGFuLmlubmVySFRNTCA9IGVycm9yO1xuICBpbnB1dC5wYXJlbnROb2RlLmFwcGVuZENoaWxkKGVycm9yU3Bhbik7XG59O1xuXG5BdXRoTW9kYWwucHJvdG90eXBlLnNob3dGb3JtTWVzc2FnZSA9IGZ1bmN0aW9uKG1lc3NhZ2UsIHR5cGUpIHtcbiAgaWYgKG1lc3NhZ2UuaW5kZXhPZignPHA+JykgIT09IDApIHtcbiAgICBtZXNzYWdlID0gJzxwPicgKyBtZXNzYWdlICsgJzwvcD4nO1xuICB9XG5cbiAgaWYgKFsnaW5mbycsICdlcnJvcicsICd3YXJuaW5nJywgJ3N1Y2Nlc3MnXS5pbmRleE9mKHR5cGUpID09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVW5zdXBwb3J0ZWQgdHlwZTogXCIgKyB0eXBlKTtcbiAgfVxuXG4gIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29udGFpbmVyLmNsYXNzTmFtZSA9ICdsb2dpbi1mb3JtX18nICsgdHlwZTtcbiAgY29udGFpbmVyLmlubmVySFRNTCA9IG1lc3NhZ2U7XG5cbiAgdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW5vdGlmaWNhdGlvbl0nKS5pbm5lckhUTUwgPSAnJztcbiAgdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW5vdGlmaWNhdGlvbl0nKS5hcHBlbmRDaGlsZChjb250YWluZXIpO1xufTtcblxuQXV0aE1vZGFsLnByb3RvdHlwZS5zdWJtaXRMb2dpbkZvcm0gPSBmdW5jdGlvbihmb3JtKSB7XG5cbiAgdGhpcy5jbGVhckZvcm1NZXNzYWdlcygpO1xuXG4gIHZhciBoYXNFcnJvcnMgPSBmYWxzZTtcbiAgaWYgKCFmb3JtLmVsZW1lbnRzLmxvZ2luLnZhbHVlKSB7XG4gICAgaGFzRXJyb3JzID0gdHJ1ZTtcbiAgICB0aGlzLnNob3dJbnB1dEVycm9yKGZvcm0uZWxlbWVudHMubG9naW4sICfQktCy0LXQtNC40YLQtSwg0L/QvtC20LDQu9GD0YHRgtCwLCDQuNC80Y8g0LjQu9C4IGVtYWlsLicpO1xuICB9XG5cbiAgaWYgKCFmb3JtLmVsZW1lbnRzLnBhc3N3b3JkLnZhbHVlKSB7XG4gICAgaGFzRXJyb3JzID0gdHJ1ZTtcbiAgICB0aGlzLnNob3dJbnB1dEVycm9yKGZvcm0uZWxlbWVudHMucGFzc3dvcmQsICfQktCy0LXQtNC40YLQtSwg0L/QvtC20LDQu9GD0YHRgtCwLCDQv9Cw0YDQvtC70YwuJyk7XG4gIH1cblxuICBpZiAoaGFzRXJyb3JzKSByZXR1cm47XG5cbiAgdmFyIHJlcXVlc3QgPSB0aGlzLnJlcXVlc3Qoe1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIHVybDogICAgJy9hdXRoL2xvZ2luL2xvY2FsJyxcbiAgICBub3JtYWxTdGF0dXNlczogWzIwMCwgNDAxXSxcbiAgICBib2R5OiBuZXcgRm9ybURhdGEoZm9ybSlcbiAgfSk7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3N1Y2Nlc3MnLCBmdW5jdGlvbihldmVudCkge1xuXG4gICAgaWYgKHRoaXMuc3RhdHVzICE9IDIwMCkge1xuICAgICAgc2VsZi5vbkF1dGhGYWlsdXJlKGV2ZW50LnJlc3VsdC5tZXNzYWdlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzZWxmLm9uQXV0aFN1Y2Nlc3MoZXZlbnQucmVzdWx0LnVzZXIpO1xuICB9KTtcblxufTtcblxuQXV0aE1vZGFsLnByb3RvdHlwZS5vcGVuQXV0aFBvcHVwID0gZnVuY3Rpb24odXJsKSB7XG4gIGlmICh0aGlzLmF1dGhQb3B1cCAmJiAhdGhpcy5hdXRoUG9wdXAuY2xvc2VkKSB7XG4gICAgdGhpcy5hdXRoUG9wdXAuY2xvc2UoKTsgLy8gY2xvc2Ugb2xkIHBvcHVwIGlmIGFueVxuICB9XG4gIHZhciB3aWR0aCA9IDgwMCwgaGVpZ2h0ID0gNjAwO1xuICB2YXIgdG9wID0gKHdpbmRvdy5vdXRlckhlaWdodCAtIGhlaWdodCkgLyAyO1xuICB2YXIgbGVmdCA9ICh3aW5kb3cub3V0ZXJXaWR0aCAtIHdpZHRoKSAvIDI7XG4gIHdpbmRvdy5hdXRoTW9kYWwgPSB0aGlzO1xuICB0aGlzLmF1dGhQb3B1cCA9IHdpbmRvdy5vcGVuKHVybCwgJ2F1dGhNb2RhbCcsICd3aWR0aD0nICsgd2lkdGggKyAnLGhlaWdodD0nICsgaGVpZ2h0ICsgJyxzY3JvbGxiYXJzPTAsdG9wPScgKyB0b3AgKyAnLGxlZnQ9JyArIGxlZnQpO1xufTtcblxuLypcbiDQstGB0LUg0L7QsdGA0LDQsdC+0YLRh9C40LrQuCDQsNCy0YLQvtGA0LjQt9Cw0YbQuNC4ICjQstC60LvRjtGH0LDRjyBGYWNlYm9vayDQuNC3IHBvcHVwLdCwINC4INC70L7QutCw0LvRjNC90YvQuSlcbiDQsiDQuNGC0L7Qs9C1INGC0YDQuNCz0LPQtdGA0Y/RgiDQvtC00LjQvSDQuNC3INGN0YLQuNGFINC60LDQu9C70LHRjdC60L7QslxuICovXG5BdXRoTW9kYWwucHJvdG90eXBlLm9uQXV0aFN1Y2Nlc3MgPSBmdW5jdGlvbih1c2VyKSB7XG4gIHdpbmRvdy5jdXJyZW50VXNlciA9IHVzZXI7XG4gIHRoaXMub3B0aW9ucy5jYWxsYmFjaygpO1xufTtcblxuXG5BdXRoTW9kYWwucHJvdG90eXBlLm9uQXV0aEZhaWx1cmUgPSBmdW5jdGlvbihlcnJvck1lc3NhZ2UpIHtcbiAgdGhpcy5zaG93Rm9ybU1lc3NhZ2UoZXJyb3JNZXNzYWdlIHx8IFwi0J7RgtC60LDQtyDQsiDQsNCy0YLQvtGA0LjQt9Cw0YbQuNC4LlwiLCAnZXJyb3InKTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBBdXRoTW9kYWw7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2hhbmRsZXJzL2F1dGgvY2xpZW50L2F1dGhNb2RhbC5qc1xuICoqLyIsInZhciBiZW0gPSByZXF1aXJlKCdiZW0tamFkZScpKCk7XG52YXIgdGh1bWIgPSByZXF1aXJlKCdjbGllbnQvaW1hZ2UnKS50aHVtYjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0ZW1wbGF0ZSwgbG9jYWxzKSB7XG4gIGxvY2FscyA9IGxvY2FscyA/IE9iamVjdC5jcmVhdGUobG9jYWxzKSA6IHt9O1xuICBhZGRTdGFuZGFyZEhlbHBlcnMobG9jYWxzKTtcblxuICByZXR1cm4gdGVtcGxhdGUobG9jYWxzKTtcbn07XG5cbmZ1bmN0aW9uIGFkZFN0YW5kYXJkSGVscGVycyhsb2NhbHMpIHtcbiAgbG9jYWxzLmJlbSA9IGJlbTtcblxuICBsb2NhbHMudGh1bWIgPSB0aHVtYjtcbn1cblxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9jbGllbnQvY2xpZW50UmVuZGVyLmpzXG4gKiovIiwidmFyIGphZGUgPSByZXF1aXJlKFwiL3Jvb3QvamF2YXNjcmlwdC1ub2RlanMvbm9kZV9tb2R1bGVzL2phZGUvbGliL3J1bnRpbWUuanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChiZW0pIHtcbmJ1Zi5wdXNoKFwiXCIpO1xudmFyIGJlbV9jaGFpbiA9IFtdO1xudmFyIGJlbV9jaGFpbl9jb250ZXh0cyA9IFsnYmxvY2snXTtcbmphZGVfbWl4aW5zW1wiYlwiXSA9IGZ1bmN0aW9uKHRhZywgaXNFbGVtZW50LCBub0Jsb2NrQ2xhc3Mpe1xudmFyIGJsb2NrID0gKHRoaXMgJiYgdGhpcy5ibG9jayksIGF0dHJpYnV0ZXMgPSAodGhpcyAmJiB0aGlzLmF0dHJpYnV0ZXMpIHx8IHt9O1xuYmVtLmNhbGwodGhpcywgYnVmLCBiZW1fY2hhaW4sIGJlbV9jaGFpbl9jb250ZXh0cywgdGFnLCBpc0VsZW1lbnQsIG5vQmxvY2tDbGFzcylcbn07XG5cblxuXG5cblxuXG5cblxuXG5qYWRlX21peGluc1tcImVcIl0gPSBmdW5jdGlvbih0YWcpe1xudmFyIGJsb2NrID0gKHRoaXMgJiYgdGhpcy5ibG9jayksIGF0dHJpYnV0ZXMgPSAodGhpcyAmJiB0aGlzLmF0dHJpYnV0ZXMpIHx8IHt9O1xuamFkZV9taXhpbnNbXCJiXCJdLmNhbGwoe1xuYmxvY2s6IGZ1bmN0aW9uKCl7XG5ibG9jayAmJiBibG9jaygpO1xufSxcbmF0dHJpYnV0ZXM6IGphZGUubWVyZ2UoW2F0dHJpYnV0ZXNdKVxufSwgdGFnLCB0cnVlKTtcbn07XG5qYWRlX21peGluc1tcImJcIl0uY2FsbCh7XG5ibG9jazogZnVuY3Rpb24oKXtcbmphZGVfbWl4aW5zW1wiZVwiXS5jYWxsKHtcbmJsb2NrOiBmdW5jdGlvbigpe1xuamFkZV9taXhpbnNbXCJlXCJdLmNhbGwoe1xuYmxvY2s6IGZ1bmN0aW9uKCl7XG5qYWRlX21peGluc1tcImVcIl0uY2FsbCh7XG5ibG9jazogZnVuY3Rpb24oKXtcbmJ1Zi5wdXNoKFwi0JLRhdC+0LQg0LIg0YHQuNGB0YLQtdC80YNcIik7XG59LFxuYXR0cmlidXRlczoge1wiY2xhc3NcIjogXCJ0aXRsZVwifVxufSwgJ2g0Jyk7XG5qYWRlX21peGluc1tcImVcIl0uY2FsbCh7XG5ibG9jazogZnVuY3Rpb24oKXtcbmphZGVfbWl4aW5zW1wiZVwiXS5jYWxsKHtcbmJsb2NrOiBmdW5jdGlvbigpe1xuYnVmLnB1c2goXCLRgNC10LPQuNGB0YLRgNCw0YbQuNGPXCIpO1xufSxcbmF0dHJpYnV0ZXM6IHtcInR5cGVcIjogXCJidXR0b25cIixcImRhdGEtc3dpdGNoXCI6IFwicmVnaXN0ZXItZm9ybVwiLFwiY2xhc3NcIjogXCJidXR0b24tbGluayBfX3JlZ2lzdGVyXCJ9XG59LCAnYnV0dG9uJyk7XG59LFxuYXR0cmlidXRlczoge1wiY2xhc3NcIjogXCJoZWFkZXItYXNpZGVcIn1cbn0pO1xufSxcbmF0dHJpYnV0ZXM6IHtcImNsYXNzXCI6IFwibGluZSBfX2hlYWRlclwifVxufSk7XG5qYWRlX21peGluc1tcImVcIl0uY2FsbCh7XG5hdHRyaWJ1dGVzOiB7XCJkYXRhLW5vdGlmaWNhdGlvblwiOiB0cnVlLFwiY2xhc3NcIjogXCJsaW5lIF9fbm90aWZpY2F0aW9uXCJ9XG59KTtcbmphZGVfbWl4aW5zW1wiZVwiXS5jYWxsKHtcbmJsb2NrOiBmdW5jdGlvbigpe1xuamFkZV9taXhpbnNbXCJlXCJdLmNhbGwoe1xuYmxvY2s6IGZ1bmN0aW9uKCl7XG5idWYucHVzaChcIkVtYWlsOlwiKTtcbn0sXG5hdHRyaWJ1dGVzOiB7XCJmb3JcIjogXCJsb2dpblwiLFwiY2xhc3NcIjogXCJsYWJlbFwifVxufSwgJ2xhYmVsJyk7XG5qYWRlX21peGluc1tcImJcIl0uY2FsbCh7XG5ibG9jazogZnVuY3Rpb24oKXtcbmphZGVfbWl4aW5zW1wiZVwiXS5jYWxsKHtcbmF0dHJpYnV0ZXM6IHtcImlkXCI6IFwibG9naW5cIixcIm5hbWVcIjogXCJsb2dpblwiLFwidHlwZVwiOiBcImVtYWlsXCIsXCJhdXRvZm9jdXNcIjogdHJ1ZSxcImNsYXNzXCI6IFwiY29udHJvbFwifVxufSwgJ2lucHV0Jyk7XG59LFxuYXR0cmlidXRlczoge1wiY2xhc3NcIjogXCJ0ZXh0LWlucHV0IF9faW5wdXRcIn1cbn0sICdzcGFuJyk7XG59LFxuYXR0cmlidXRlczoge1wiY2xhc3NcIjogXCJsaW5lXCJ9XG59KTtcbmphZGVfbWl4aW5zW1wiZVwiXS5jYWxsKHtcbmJsb2NrOiBmdW5jdGlvbigpe1xuamFkZV9taXhpbnNbXCJlXCJdLmNhbGwoe1xuYmxvY2s6IGZ1bmN0aW9uKCl7XG5idWYucHVzaChcItCf0LDRgNC+0LvRjDpcIik7XG59LFxuYXR0cmlidXRlczoge1wiZm9yXCI6IFwicGFzc3dvcmRcIixcImNsYXNzXCI6IFwibGFiZWxcIn1cbn0sICdsYWJlbCcpO1xuamFkZV9taXhpbnNbXCJiXCJdLmNhbGwoe1xuYmxvY2s6IGZ1bmN0aW9uKCl7XG5qYWRlX21peGluc1tcImVcIl0uY2FsbCh7XG5hdHRyaWJ1dGVzOiB7XCJpZFwiOiBcInBhc3N3b3JkXCIsXCJ0eXBlXCI6IFwicGFzc3dvcmRcIixcIm5hbWVcIjogXCJwYXNzd29yZFwiLFwiY2xhc3NcIjogXCJjb250cm9sXCJ9XG59LCAnaW5wdXQnKTtcbmphZGVfbWl4aW5zW1wiZVwiXS5jYWxsKHtcbmJsb2NrOiBmdW5jdGlvbigpe1xuYnVmLnB1c2goXCLQl9Cw0LHRi9C70Lg/XCIpO1xufSxcbmF0dHJpYnV0ZXM6IHtcInR5cGVcIjogXCJidXR0b25cIixcImRhdGEtc3dpdGNoXCI6IFwiZm9yZ290LWZvcm1cIixcImNsYXNzXCI6IFwiYXNpZGUgX19mb3Jnb3QgX19idXR0b24tbGlua1wifVxufSwgJ2J1dHRvbicpO1xufSxcbmF0dHJpYnV0ZXM6IHtcImNsYXNzXCI6IFwidGV4dC1pbnB1dCBfd2l0aC1hc2lkZSBfX2lucHV0XCJ9XG59LCAnc3BhbicpO1xufSxcbmF0dHJpYnV0ZXM6IHtcImNsYXNzXCI6IFwibGluZVwifVxufSk7XG5qYWRlX21peGluc1tcImVcIl0uY2FsbCh7XG5ibG9jazogZnVuY3Rpb24oKXtcbmphZGVfbWl4aW5zW1wiYlwiXS5jYWxsKHtcbmJsb2NrOiBmdW5jdGlvbigpe1xuamFkZV9taXhpbnNbXCJlXCJdLmNhbGwoe1xuYmxvY2s6IGZ1bmN0aW9uKCl7XG5idWYucHVzaChcItCS0L7QudGC0LhcIik7XG59LFxuYXR0cmlidXRlczoge1wiY2xhc3NcIjogXCJ0ZXh0XCJ9XG59LCAnc3BhbicpO1xufSxcbmF0dHJpYnV0ZXM6IHtcInR5cGVcIjogXCJzdWJtaXRcIixcImNsYXNzXCI6IFwic3VibWl0LWJ1dHRvbiBfc21hbGwgX19zdWJtaXRcIn1cbn0sICdidXR0b24nKTtcbn0sXG5hdHRyaWJ1dGVzOiB7XCJjbGFzc1wiOiBcImxpbmUgX19mb290ZXJcIn1cbn0pO1xuamFkZV9taXhpbnNbXCJlXCJdLmNhbGwoe1xuYmxvY2s6IGZ1bmN0aW9uKCl7XG5qYWRlX21peGluc1tcImVcIl0uY2FsbCh7XG5ibG9jazogZnVuY3Rpb24oKXtcbmJ1Zi5wdXNoKFwi0JLRhdC+0LQg0YfQtdGA0LXQtyDRgdC+0YbQuNCw0LvRjNC90YvQtSDRgdC10YLQuFwiKTtcbn0sXG5hdHRyaWJ1dGVzOiB7XCJjbGFzc1wiOiBcInNvY2lhbC1sb2dpbnMtdGl0bGVcIn1cbn0sICdoNScpO1xuYnVmLnB1c2goXCIgXCIpO1xuamFkZV9taXhpbnNbXCJiXCJdLmNhbGwoe1xuYmxvY2s6IGZ1bmN0aW9uKCl7XG5idWYucHVzaChcIkZhY2Vib29rXCIpO1xufSxcbmF0dHJpYnV0ZXM6IHtcImRhdGEtcHJvdmlkZXJcIjogXCJmYWNlYm9va1wiLFwiY2xhc3NcIjogXCJzb2NpYWwtbG9naW4gX2ZhY2Vib29rIF9fc29jaWFsLWxvZ2luXCJ9XG59LCAnYnV0dG9uJyk7XG5idWYucHVzaChcIiBcIik7XG5qYWRlX21peGluc1tcImJcIl0uY2FsbCh7XG5ibG9jazogZnVuY3Rpb24oKXtcbmJ1Zi5wdXNoKFwiR29vZ2xlK1wiKTtcbn0sXG5hdHRyaWJ1dGVzOiB7XCJkYXRhLXByb3ZpZGVyXCI6IFwiZ29vZ2xlXCIsXCJjbGFzc1wiOiBcInNvY2lhbC1sb2dpbiBfZ29vZ2xlIF9fc29jaWFsLWxvZ2luXCJ9XG59LCAnYnV0dG9uJyk7XG5idWYucHVzaChcIiBcIik7XG5qYWRlX21peGluc1tcImJcIl0uY2FsbCh7XG5ibG9jazogZnVuY3Rpb24oKXtcbmJ1Zi5wdXNoKFwi0JLQutC+0L3RgtCw0LrRgtC1XCIpO1xufSxcbmF0dHJpYnV0ZXM6IHtcImRhdGEtcHJvdmlkZXJcIjogXCJ2a29udGFrdGVcIixcImNsYXNzXCI6IFwic29jaWFsLWxvZ2luIF92a29udGFrdGUgX19zb2NpYWwtbG9naW5cIn1cbn0sICdidXR0b24nKTtcbmJ1Zi5wdXNoKFwiIFwiKTtcbmphZGVfbWl4aW5zW1wiYlwiXS5jYWxsKHtcbmJsb2NrOiBmdW5jdGlvbigpe1xuYnVmLnB1c2goXCJHaXRodWJcIik7XG59LFxuYXR0cmlidXRlczoge1wiZGF0YS1wcm92aWRlclwiOiBcImdpdGh1YlwiLFwiY2xhc3NcIjogXCJzb2NpYWwtbG9naW4gX2dpdGh1YiBfX3NvY2lhbC1sb2dpblwifVxufSwgJ2J1dHRvbicpO1xuYnVmLnB1c2goXCIgXCIpO1xuamFkZV9taXhpbnNbXCJiXCJdLmNhbGwoe1xuYmxvY2s6IGZ1bmN0aW9uKCl7XG5idWYucHVzaChcItCv0L3QtNC10LrRgVwiKTtcbn0sXG5hdHRyaWJ1dGVzOiB7XCJkYXRhLXByb3ZpZGVyXCI6IFwieWFuZGV4XCIsXCJjbGFzc1wiOiBcInNvY2lhbC1sb2dpbiBfeWFuZGV4IF9fc29jaWFsLWxvZ2luXCJ9XG59LCAnYnV0dG9uJyk7XG59LFxuYXR0cmlidXRlczoge1wiY2xhc3NcIjogXCJsaW5lIF9fc29jaWFsLWxvZ2luc1wifVxufSk7XG5qYWRlX21peGluc1tcImJcIl0uY2FsbCh7XG5hdHRyaWJ1dGVzOiB7XCJ0eXBlXCI6IFwiYnV0dG9uXCIsXCJ0aXRsZVwiOiBcItC30LDQutGA0YvRgtGMXCIsXCJjbGFzc1wiOiBcImNsb3NlLWJ1dHRvbiBfX2Nsb3NlXCJ9XG59LCAnYnV0dG9uJyk7XG59LFxuYXR0cmlidXRlczoge1wiYWN0aW9uXCI6IFwiI1wiLFwiY2xhc3NcIjogXCJmb3JtXCJ9XG59LCAnZm9ybScpO1xufSxcbmF0dHJpYnV0ZXM6IHtcImRhdGEtZm9ybVwiOiBcImxvZ2luXCIsXCJjbGFzc1wiOiBcImxvZ2luLWZvcm1cIn1cbn0pO30uY2FsbCh0aGlzLFwiYmVtXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5iZW06dHlwZW9mIGJlbSE9PVwidW5kZWZpbmVkXCI/YmVtOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2hhbmRsZXJzL2F1dGgvdGVtcGxhdGVzL2xvZ2luLWZvcm0uamFkZVxuICoqIG1vZHVsZSBpZCA9IDgwXG4gKiogbW9kdWxlIGNodW5rcyA9IDhcbiAqKi8iLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCIvcm9vdC9qYXZhc2NyaXB0LW5vZGVqcy9ub2RlX21vZHVsZXMvamFkZS9saWIvcnVudGltZS5qc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGJlbSkge1xuYnVmLnB1c2goXCJcIik7XG52YXIgYmVtX2NoYWluID0gW107XG52YXIgYmVtX2NoYWluX2NvbnRleHRzID0gWydibG9jayddO1xuamFkZV9taXhpbnNbXCJiXCJdID0gZnVuY3Rpb24odGFnLCBpc0VsZW1lbnQsIG5vQmxvY2tDbGFzcyl7XG52YXIgYmxvY2sgPSAodGhpcyAmJiB0aGlzLmJsb2NrKSwgYXR0cmlidXRlcyA9ICh0aGlzICYmIHRoaXMuYXR0cmlidXRlcykgfHwge307XG5iZW0uY2FsbCh0aGlzLCBidWYsIGJlbV9jaGFpbiwgYmVtX2NoYWluX2NvbnRleHRzLCB0YWcsIGlzRWxlbWVudCwgbm9CbG9ja0NsYXNzKVxufTtcblxuXG5cblxuXG5cblxuXG5cbmphZGVfbWl4aW5zW1wiZVwiXSA9IGZ1bmN0aW9uKHRhZyl7XG52YXIgYmxvY2sgPSAodGhpcyAmJiB0aGlzLmJsb2NrKSwgYXR0cmlidXRlcyA9ICh0aGlzICYmIHRoaXMuYXR0cmlidXRlcykgfHwge307XG5qYWRlX21peGluc1tcImJcIl0uY2FsbCh7XG5ibG9jazogZnVuY3Rpb24oKXtcbmJsb2NrICYmIGJsb2NrKCk7XG59LFxuYXR0cmlidXRlczogamFkZS5tZXJnZShbYXR0cmlidXRlc10pXG59LCB0YWcsIHRydWUpO1xufTtcbmphZGVfbWl4aW5zW1wiYlwiXS5jYWxsKHtcbmJsb2NrOiBmdW5jdGlvbigpe1xuamFkZV9taXhpbnNbXCJlXCJdLmNhbGwoe1xuYmxvY2s6IGZ1bmN0aW9uKCl7XG5qYWRlX21peGluc1tcImVcIl0uY2FsbCh7XG5ibG9jazogZnVuY3Rpb24oKXtcbmphZGVfbWl4aW5zW1wiZVwiXS5jYWxsKHtcbmJsb2NrOiBmdW5jdGlvbigpe1xuYnVmLnB1c2goXCLQoNC10LPQuNGB0YLRgNCw0YbQuNGPXCIpO1xufSxcbmF0dHJpYnV0ZXM6IHtcImNsYXNzXCI6IFwidGl0bGVcIn1cbn0sICdoNCcpO1xuamFkZV9taXhpbnNbXCJlXCJdLmNhbGwoe1xuYmxvY2s6IGZ1bmN0aW9uKCl7XG5qYWRlX21peGluc1tcImVcIl0uY2FsbCh7XG5ibG9jazogZnVuY3Rpb24oKXtcbmJ1Zi5wdXNoKFwi0LLRhdC+0LRcIik7XG59LFxuYXR0cmlidXRlczoge1widHlwZVwiOiBcImJ1dHRvblwiLFwiZGF0YS1zd2l0Y2hcIjogXCJsb2dpbi1mb3JtXCIsXCJjbGFzc1wiOiBcImJ1dHRvbi1saW5rXCJ9XG59LCAnYnV0dG9uJyk7XG59LFxuYXR0cmlidXRlczoge1wiY2xhc3NcIjogXCJoZWFkZXItYXNpZGVcIn1cbn0pO1xufSxcbmF0dHJpYnV0ZXM6IHtcImNsYXNzXCI6IFwibGluZSBfX2hlYWRlclwifVxufSk7XG5qYWRlX21peGluc1tcImVcIl0uY2FsbCh7XG5hdHRyaWJ1dGVzOiB7XCJkYXRhLW5vdGlmaWNhdGlvblwiOiB0cnVlLFwiY2xhc3NcIjogXCJsaW5lIF9fbm90aWZpY2F0aW9uXCJ9XG59KTtcbmphZGVfbWl4aW5zW1wiZVwiXS5jYWxsKHtcbmJsb2NrOiBmdW5jdGlvbigpe1xuamFkZV9taXhpbnNbXCJlXCJdLmNhbGwoe1xuYmxvY2s6IGZ1bmN0aW9uKCl7XG5idWYucHVzaChcIkVtYWlsOlwiKTtcbn0sXG5hdHRyaWJ1dGVzOiB7XCJmb3JcIjogXCJyZWdpc3Rlci1lbWFpbFwiLFwiY2xhc3NcIjogXCJsYWJlbFwifVxufSwgJ2xhYmVsJyk7XG5qYWRlX21peGluc1tcImJcIl0uY2FsbCh7XG5ibG9jazogZnVuY3Rpb24oKXtcbmphZGVfbWl4aW5zW1wiZVwiXS5jYWxsKHtcbmF0dHJpYnV0ZXM6IHtcImlkXCI6IFwicmVnaXN0ZXItZW1haWxcIixcIm5hbWVcIjogXCJlbWFpbFwiLFwidHlwZVwiOiBcImVtYWlsXCIsXCJyZXF1aXJlZFwiOiB0cnVlLFwiYXV0b2ZvY3VzXCI6IHRydWUsXCJjbGFzc1wiOiBcImNvbnRyb2xcIn1cbn0sICdpbnB1dCcpO1xufSxcbmF0dHJpYnV0ZXM6IHtcImNsYXNzXCI6IFwidGV4dC1pbnB1dCBfX2lucHV0XCJ9XG59LCAnc3BhbicpO1xufSxcbmF0dHJpYnV0ZXM6IHtcImNsYXNzXCI6IFwibGluZVwifVxufSk7XG5qYWRlX21peGluc1tcImVcIl0uY2FsbCh7XG5ibG9jazogZnVuY3Rpb24oKXtcbmphZGVfbWl4aW5zW1wiZVwiXS5jYWxsKHtcbmJsb2NrOiBmdW5jdGlvbigpe1xuYnVmLnB1c2goXCLQmNC80Y8g0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPOlwiKTtcbn0sXG5hdHRyaWJ1dGVzOiB7XCJmb3JcIjogXCJyZWdpc3Rlci1kaXNwbGF5TmFtZVwiLFwiY2xhc3NcIjogXCJsYWJlbFwifVxufSwgJ2xhYmVsJyk7XG5qYWRlX21peGluc1tcImJcIl0uY2FsbCh7XG5ibG9jazogZnVuY3Rpb24oKXtcbmphZGVfbWl4aW5zW1wiZVwiXS5jYWxsKHtcbmF0dHJpYnV0ZXM6IHtcImlkXCI6IFwicmVnaXN0ZXItZGlzcGxheU5hbWVcIixcIm5hbWVcIjogXCJkaXNwbGF5TmFtZVwiLFwicmVxdWlyZWRcIjogdHJ1ZSxcImNsYXNzXCI6IFwiY29udHJvbFwifVxufSwgJ2lucHV0Jyk7XG59LFxuYXR0cmlidXRlczoge1wiY2xhc3NcIjogXCJ0ZXh0LWlucHV0IF9faW5wdXRcIn1cbn0sICdzcGFuJyk7XG59LFxuYXR0cmlidXRlczoge1wiY2xhc3NcIjogXCJsaW5lXCJ9XG59KTtcbmphZGVfbWl4aW5zW1wiZVwiXS5jYWxsKHtcbmJsb2NrOiBmdW5jdGlvbigpe1xuamFkZV9taXhpbnNbXCJlXCJdLmNhbGwoe1xuYmxvY2s6IGZ1bmN0aW9uKCl7XG5idWYucHVzaChcItCf0LDRgNC+0LvRjDpcIik7XG59LFxuYXR0cmlidXRlczoge1wiZm9yXCI6IFwicmVnaXN0ZXItcGFzc3dvcmRcIixcImNsYXNzXCI6IFwibGFiZWxcIn1cbn0sICdsYWJlbCcpO1xuamFkZV9taXhpbnNbXCJiXCJdLmNhbGwoe1xuYmxvY2s6IGZ1bmN0aW9uKCl7XG5qYWRlX21peGluc1tcImVcIl0uY2FsbCh7XG5hdHRyaWJ1dGVzOiB7XCJpZFwiOiBcInJlZ2lzdGVyLXBhc3N3b3JkXCIsXCJ0eXBlXCI6IFwicGFzc3dvcmRcIixcIm5hbWVcIjogXCJwYXNzd29yZFwiLFwicmVxdWlyZWRcIjogdHJ1ZSxcImNsYXNzXCI6IFwiY29udHJvbFwifVxufSwgJ2lucHV0Jyk7XG59LFxuYXR0cmlidXRlczoge1wiY2xhc3NcIjogXCJ0ZXh0LWlucHV0IF9faW5wdXRcIn1cbn0sICdzcGFuJyk7XG59LFxuYXR0cmlidXRlczoge1wiY2xhc3NcIjogXCJsaW5lXCJ9XG59KTtcbmphZGVfbWl4aW5zW1wiZVwiXS5jYWxsKHtcbmJsb2NrOiBmdW5jdGlvbigpe1xuamFkZV9taXhpbnNbXCJiXCJdLmNhbGwoe1xuYmxvY2s6IGZ1bmN0aW9uKCl7XG5qYWRlX21peGluc1tcImVcIl0uY2FsbCh7XG5ibG9jazogZnVuY3Rpb24oKXtcbmJ1Zi5wdXNoKFwi0JfQsNGA0LXQs9C40YHRgtGA0LjRgNC+0LLQsNGC0YzRgdGPXCIpO1xufSxcbmF0dHJpYnV0ZXM6IHtcImNsYXNzXCI6IFwidGV4dFwifVxufSwgJ3NwYW4nKTtcbn0sXG5hdHRyaWJ1dGVzOiB7XCJ0eXBlXCI6IFwic3VibWl0XCIsXCJjbGFzc1wiOiBcInN1Ym1pdC1idXR0b24gX3NtYWxsIHN1Ym1pdFwifVxufSwgJ2J1dHRvbicpO1xufSxcbmF0dHJpYnV0ZXM6IHtcImNsYXNzXCI6IFwibGluZSBfX2Zvb3RlclwifVxufSk7XG5qYWRlX21peGluc1tcImVcIl0uY2FsbCh7XG5ibG9jazogZnVuY3Rpb24oKXtcbmphZGVfbWl4aW5zW1wiZVwiXS5jYWxsKHtcbmJsb2NrOiBmdW5jdGlvbigpe1xuYnVmLnB1c2goXCLQktGF0L7QtCDRh9C10YDQtdC3INGB0L7RhtC40LDQu9GM0L3Ri9C1INGB0LXRgtC4XCIpO1xufSxcbmF0dHJpYnV0ZXM6IHtcImNsYXNzXCI6IFwic29jaWFsLWxvZ2lucy10aXRsZVwifVxufSwgJ2g1Jyk7XG5idWYucHVzaChcIiBcIik7XG5qYWRlX21peGluc1tcImJcIl0uY2FsbCh7XG5ibG9jazogZnVuY3Rpb24oKXtcbmJ1Zi5wdXNoKFwiRmFjZWJvb2tcIik7XG59LFxuYXR0cmlidXRlczoge1wiZGF0YS1wcm92aWRlclwiOiBcImZhY2Vib29rXCIsXCJjbGFzc1wiOiBcInNvY2lhbC1sb2dpbiBfZmFjZWJvb2sgX19zb2NpYWwtbG9naW5cIn1cbn0sICdidXR0b24nKTtcbmJ1Zi5wdXNoKFwiIFwiKTtcbmphZGVfbWl4aW5zW1wiYlwiXS5jYWxsKHtcbmJsb2NrOiBmdW5jdGlvbigpe1xuYnVmLnB1c2goXCJHb29nbGUrXCIpO1xufSxcbmF0dHJpYnV0ZXM6IHtcImRhdGEtcHJvdmlkZXJcIjogXCJnb29nbGVcIixcImNsYXNzXCI6IFwic29jaWFsLWxvZ2luIF9nb29nbGUgX19zb2NpYWwtbG9naW5cIn1cbn0sICdidXR0b24nKTtcbmJ1Zi5wdXNoKFwiIFwiKTtcbmphZGVfbWl4aW5zW1wiYlwiXS5jYWxsKHtcbmJsb2NrOiBmdW5jdGlvbigpe1xuYnVmLnB1c2goXCLQktC60L7QvdGC0LDQutGC0LVcIik7XG59LFxuYXR0cmlidXRlczoge1wiZGF0YS1wcm92aWRlclwiOiBcInZrb250YWt0ZVwiLFwiY2xhc3NcIjogXCJzb2NpYWwtbG9naW4gX3Zrb250YWt0ZSBfX3NvY2lhbC1sb2dpblwifVxufSwgJ2J1dHRvbicpO1xuYnVmLnB1c2goXCIgXCIpO1xuamFkZV9taXhpbnNbXCJiXCJdLmNhbGwoe1xuYmxvY2s6IGZ1bmN0aW9uKCl7XG5idWYucHVzaChcIkdpdGh1YlwiKTtcbn0sXG5hdHRyaWJ1dGVzOiB7XCJkYXRhLXByb3ZpZGVyXCI6IFwiZ2l0aHViXCIsXCJjbGFzc1wiOiBcInNvY2lhbC1sb2dpbiBfZ2l0aHViIF9fc29jaWFsLWxvZ2luXCJ9XG59LCAnYnV0dG9uJyk7XG5idWYucHVzaChcIiBcIik7XG5qYWRlX21peGluc1tcImJcIl0uY2FsbCh7XG5ibG9jazogZnVuY3Rpb24oKXtcbmJ1Zi5wdXNoKFwi0K/QvdC00LXQutGBXCIpO1xufSxcbmF0dHJpYnV0ZXM6IHtcImRhdGEtcHJvdmlkZXJcIjogXCJ5YW5kZXhcIixcImNsYXNzXCI6IFwic29jaWFsLWxvZ2luIF95YW5kZXggX19zb2NpYWwtbG9naW5cIn1cbn0sICdidXR0b24nKTtcbn0sXG5hdHRyaWJ1dGVzOiB7XCJjbGFzc1wiOiBcImxpbmUgX19zb2NpYWwtbG9naW5zXCJ9XG59KTtcbmphZGVfbWl4aW5zW1wiYlwiXS5jYWxsKHtcbmF0dHJpYnV0ZXM6IHtcInR5cGVcIjogXCJidXR0b25cIixcInRpdGxlXCI6IFwi0LfQsNC60YDRi9GC0YxcIixcImNsYXNzXCI6IFwiY2xvc2UtYnV0dG9uIF9fY2xvc2VcIn1cbn0sICdidXR0b24nKTtcbn0sXG5hdHRyaWJ1dGVzOiB7XCJhY3Rpb25cIjogXCIjXCIsXCJkYXRhLWZvcm1cIjogXCJyZWdpc3RlclwiLFwiY2xhc3NcIjogXCJmb3JtXCJ9XG59LCAnZm9ybScpO1xufSxcbmF0dHJpYnV0ZXM6IHtcImNsYXNzXCI6IFwibG9naW4tZm9ybVwifVxufSk7fS5jYWxsKHRoaXMsXCJiZW1cIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmJlbTp0eXBlb2YgYmVtIT09XCJ1bmRlZmluZWRcIj9iZW06dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vaGFuZGxlcnMvYXV0aC90ZW1wbGF0ZXMvcmVnaXN0ZXItZm9ybS5qYWRlXG4gKiogbW9kdWxlIGlkID0gODFcbiAqKiBtb2R1bGUgY2h1bmtzID0gOFxuICoqLyIsInZhciBqYWRlID0gcmVxdWlyZShcIi9yb290L2phdmFzY3JpcHQtbm9kZWpzL25vZGVfbW9kdWxlcy9qYWRlL2xpYi9ydW50aW1lLmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoYmVtKSB7XG5idWYucHVzaChcIlwiKTtcbnZhciBiZW1fY2hhaW4gPSBbXTtcbnZhciBiZW1fY2hhaW5fY29udGV4dHMgPSBbJ2Jsb2NrJ107XG5qYWRlX21peGluc1tcImJcIl0gPSBmdW5jdGlvbih0YWcsIGlzRWxlbWVudCwgbm9CbG9ja0NsYXNzKXtcbnZhciBibG9jayA9ICh0aGlzICYmIHRoaXMuYmxvY2spLCBhdHRyaWJ1dGVzID0gKHRoaXMgJiYgdGhpcy5hdHRyaWJ1dGVzKSB8fCB7fTtcbmJlbS5jYWxsKHRoaXMsIGJ1ZiwgYmVtX2NoYWluLCBiZW1fY2hhaW5fY29udGV4dHMsIHRhZywgaXNFbGVtZW50LCBub0Jsb2NrQ2xhc3MpXG59O1xuXG5cblxuXG5cblxuXG5cblxuamFkZV9taXhpbnNbXCJlXCJdID0gZnVuY3Rpb24odGFnKXtcbnZhciBibG9jayA9ICh0aGlzICYmIHRoaXMuYmxvY2spLCBhdHRyaWJ1dGVzID0gKHRoaXMgJiYgdGhpcy5hdHRyaWJ1dGVzKSB8fCB7fTtcbmphZGVfbWl4aW5zW1wiYlwiXS5jYWxsKHtcbmJsb2NrOiBmdW5jdGlvbigpe1xuYmxvY2sgJiYgYmxvY2soKTtcbn0sXG5hdHRyaWJ1dGVzOiBqYWRlLm1lcmdlKFthdHRyaWJ1dGVzXSlcbn0sIHRhZywgdHJ1ZSk7XG59O1xuamFkZV9taXhpbnNbXCJiXCJdLmNhbGwoe1xuYmxvY2s6IGZ1bmN0aW9uKCl7XG5qYWRlX21peGluc1tcImVcIl0uY2FsbCh7XG5ibG9jazogZnVuY3Rpb24oKXtcbmphZGVfbWl4aW5zW1wiZVwiXS5jYWxsKHtcbmJsb2NrOiBmdW5jdGlvbigpe1xuamFkZV9taXhpbnNbXCJlXCJdLmNhbGwoe1xuYmxvY2s6IGZ1bmN0aW9uKCl7XG5idWYucHVzaChcItCS0L7RgdGB0YLQsNC90L7QstC70LXQvdC40LUg0L/QsNGA0L7Qu9GPXCIpO1xufSxcbmF0dHJpYnV0ZXM6IHtcImNsYXNzXCI6IFwidGl0bGVcIn1cbn0sICdoNCcpO1xufSxcbmF0dHJpYnV0ZXM6IHtcImNsYXNzXCI6IFwibGluZSBfX2hlYWRlclwifVxufSk7XG5qYWRlX21peGluc1tcImVcIl0uY2FsbCh7XG5hdHRyaWJ1dGVzOiB7XCJkYXRhLW5vdGlmaWNhdGlvblwiOiB0cnVlLFwiY2xhc3NcIjogXCJsaW5lIF9fbm90aWZpY2F0aW9uXCJ9XG59KTtcbmphZGVfbWl4aW5zW1wiZVwiXS5jYWxsKHtcbmJsb2NrOiBmdW5jdGlvbigpe1xuamFkZV9taXhpbnNbXCJlXCJdLmNhbGwoe1xuYmxvY2s6IGZ1bmN0aW9uKCl7XG5idWYucHVzaChcIkVtYWlsOlwiKTtcbn0sXG5hdHRyaWJ1dGVzOiB7XCJmb3JcIjogXCJmb3Jnb3QtZW1haWxcIixcImNsYXNzXCI6IFwibGFiZWxcIn1cbn0sICdsYWJlbCcpO1xuamFkZV9taXhpbnNbXCJiXCJdLmNhbGwoe1xuYmxvY2s6IGZ1bmN0aW9uKCl7XG5qYWRlX21peGluc1tcImVcIl0uY2FsbCh7XG5hdHRyaWJ1dGVzOiB7XCJpZFwiOiBcImZvcmdvdC1lbWFpbFwiLFwibmFtZVwiOiBcImVtYWlsXCIsXCJ0eXBlXCI6IFwiZW1haWxcIixcImF1dG9mb2N1c1wiOiB0cnVlLFwiY2xhc3NcIjogXCJjb250cm9sXCJ9XG59LCAnaW5wdXQnKTtcbn0sXG5hdHRyaWJ1dGVzOiB7XCJjbGFzc1wiOiBcInRleHQtaW5wdXQgX19pbnB1dFwifVxufSwgJ3NwYW4nKTtcbn0sXG5hdHRyaWJ1dGVzOiB7XCJjbGFzc1wiOiBcImxpbmVcIn1cbn0pO1xuamFkZV9taXhpbnNbXCJlXCJdLmNhbGwoe1xuYmxvY2s6IGZ1bmN0aW9uKCl7XG5qYWRlX21peGluc1tcImJcIl0uY2FsbCh7XG5ibG9jazogZnVuY3Rpb24oKXtcbmphZGVfbWl4aW5zW1wiZVwiXS5jYWxsKHtcbmJsb2NrOiBmdW5jdGlvbigpe1xuYnVmLnB1c2goXCLQktC+0YHRgdGC0LDQvdC+0LLQuNGC0Ywg0L/QsNGA0L7Qu9GMXCIpO1xufSxcbmF0dHJpYnV0ZXM6IHtcImNsYXNzXCI6IFwidGV4dFwifVxufSwgJ3NwYW4nKTtcbn0sXG5hdHRyaWJ1dGVzOiB7XCJ0eXBlXCI6IFwic3VibWl0XCIsXCJjbGFzc1wiOiBcInN1Ym1pdC1idXR0b24gX3NtYWxsIF9fc3VibWl0XCJ9XG59LCAnYnV0dG9uJyk7XG59LFxuYXR0cmlidXRlczoge1wiY2xhc3NcIjogXCJsaW5lXCJ9XG59KTtcbmphZGVfbWl4aW5zW1wiZVwiXS5jYWxsKHtcbmJsb2NrOiBmdW5jdGlvbigpe1xuamFkZV9taXhpbnNbXCJlXCJdLmNhbGwoe1xuYmxvY2s6IGZ1bmN0aW9uKCl7XG5idWYucHVzaChcItCS0YXQvtC0XCIpO1xufSxcbmF0dHJpYnV0ZXM6IHtcInR5cGVcIjogXCJidXR0b25cIixcImRhdGEtc3dpdGNoXCI6IFwibG9naW4tZm9ybVwiLFwiY2xhc3NcIjogXCJidXR0b24tbGlua1wifVxufSwgJ2J1dHRvbicpO1xuYnVmLnB1c2goXCIgXCIpO1xuamFkZV9taXhpbnNbXCJlXCJdLmNhbGwoe1xuYmxvY2s6IGZ1bmN0aW9uKCl7XG5idWYucHVzaChcIi9cIik7XG59LFxuYXR0cmlidXRlczoge1wiY2xhc3NcIjogXCJzZXBhcmF0b3JcIn1cbn0sICdzcGFuJyk7XG5idWYucHVzaChcIiBcIik7XG5qYWRlX21peGluc1tcImVcIl0uY2FsbCh7XG5ibG9jazogZnVuY3Rpb24oKXtcbmJ1Zi5wdXNoKFwi0KDQtdCz0LjRgdGC0YDQsNGG0LjRj1wiKTtcbn0sXG5hdHRyaWJ1dGVzOiB7XCJkYXRhLXN3aXRjaFwiOiBcInJlZ2lzdGVyLWZvcm1cIixcImNsYXNzXCI6IFwiYnV0dG9uLWxpbmtcIn1cbn0sICdidXR0b24nKTtcbn0sXG5hdHRyaWJ1dGVzOiB7XCJjbGFzc1wiOiBcImxpbmUgX19mb290ZXJcIn1cbn0pO1xuamFkZV9taXhpbnNbXCJlXCJdLmNhbGwoe1xuYmxvY2s6IGZ1bmN0aW9uKCl7XG5qYWRlX21peGluc1tcImVcIl0uY2FsbCh7XG5ibG9jazogZnVuY3Rpb24oKXtcbmJ1Zi5wdXNoKFwi0JLRhdC+0LQg0YfQtdGA0LXQtyDRgdC+0YbQuNCw0LvRjNC90YvQtSDRgdC10YLQuFwiKTtcbn0sXG5hdHRyaWJ1dGVzOiB7XCJjbGFzc1wiOiBcInNvY2lhbC1sb2dpbnMtdGl0bGVcIn1cbn0sICdoNScpO1xuYnVmLnB1c2goXCIgXCIpO1xuamFkZV9taXhpbnNbXCJiXCJdLmNhbGwoe1xuYmxvY2s6IGZ1bmN0aW9uKCl7XG5idWYucHVzaChcIkZhY2Vib29rXCIpO1xufSxcbmF0dHJpYnV0ZXM6IHtcImRhdGEtcHJvdmlkZXJcIjogXCJmYWNlYm9va1wiLFwiY2xhc3NcIjogXCJzb2NpYWwtbG9naW4gX2ZhY2Vib29rIF9fc29jaWFsLWxvZ2luXCJ9XG59LCAnYnV0dG9uJyk7XG5idWYucHVzaChcIiBcIik7XG5qYWRlX21peGluc1tcImJcIl0uY2FsbCh7XG5ibG9jazogZnVuY3Rpb24oKXtcbmJ1Zi5wdXNoKFwiR29vZ2xlK1wiKTtcbn0sXG5hdHRyaWJ1dGVzOiB7XCJkYXRhLXByb3ZpZGVyXCI6IFwiZ29vZ2xlXCIsXCJjbGFzc1wiOiBcInNvY2lhbC1sb2dpbiBfZ29vZ2xlIF9fc29jaWFsLWxvZ2luXCJ9XG59LCAnYnV0dG9uJyk7XG5idWYucHVzaChcIiBcIik7XG5qYWRlX21peGluc1tcImJcIl0uY2FsbCh7XG5ibG9jazogZnVuY3Rpb24oKXtcbmJ1Zi5wdXNoKFwi0JLQutC+0L3RgtCw0LrRgtC1XCIpO1xufSxcbmF0dHJpYnV0ZXM6IHtcImRhdGEtcHJvdmlkZXJcIjogXCJ2a29udGFrdGVcIixcImNsYXNzXCI6IFwic29jaWFsLWxvZ2luIF92a29udGFrdGUgX19zb2NpYWwtbG9naW5cIn1cbn0sICdidXR0b24nKTtcbmJ1Zi5wdXNoKFwiIFwiKTtcbmphZGVfbWl4aW5zW1wiYlwiXS5jYWxsKHtcbmJsb2NrOiBmdW5jdGlvbigpe1xuYnVmLnB1c2goXCJHaXRodWJcIik7XG59LFxuYXR0cmlidXRlczoge1wiZGF0YS1wcm92aWRlclwiOiBcImdpdGh1YlwiLFwiY2xhc3NcIjogXCJzb2NpYWwtbG9naW4gX2dpdGh1YiBfX3NvY2lhbC1sb2dpblwifVxufSwgJ2J1dHRvbicpO1xuYnVmLnB1c2goXCIgXCIpO1xuamFkZV9taXhpbnNbXCJiXCJdLmNhbGwoe1xuYmxvY2s6IGZ1bmN0aW9uKCl7XG5idWYucHVzaChcItCv0L3QtNC10LrRgVwiKTtcbn0sXG5hdHRyaWJ1dGVzOiB7XCJkYXRhLXByb3ZpZGVyXCI6IFwieWFuZGV4XCIsXCJjbGFzc1wiOiBcInNvY2lhbC1sb2dpbiBfeWFuZGV4IF9fc29jaWFsLWxvZ2luXCJ9XG59LCAnYnV0dG9uJyk7XG59LFxuYXR0cmlidXRlczoge1wiY2xhc3NcIjogXCJsaW5lIF9fc29jaWFsLWxvZ2luc1wifVxufSk7XG5qYWRlX21peGluc1tcImJcIl0uY2FsbCh7XG5hdHRyaWJ1dGVzOiB7XCJ0eXBlXCI6IFwiYnV0dG9uXCIsXCJ0aXRsZVwiOiBcItC30LDQutGA0YvRgtGMXCIsXCJjbGFzc1wiOiBcImNsb3NlLWJ1dHRvbiBfX2Nsb3NlXCJ9XG59LCAnYnV0dG9uJyk7XG59LFxuYXR0cmlidXRlczoge1wiYWN0aW9uXCI6IFwiI1wiLFwiZGF0YS1mb3JtXCI6IFwiZm9yZ290XCIsXCJjbGFzc1wiOiBcImZvcm1cIn1cbn0sICdmb3JtJyk7XG59LFxuYXR0cmlidXRlczoge1wiY2xhc3NcIjogXCJsb2dpbi1mb3JtXCJ9XG59KTt9LmNhbGwodGhpcyxcImJlbVwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguYmVtOnR5cGVvZiBiZW0hPT1cInVuZGVmaW5lZFwiP2JlbTp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9oYW5kbGVycy9hdXRoL3RlbXBsYXRlcy9mb3Jnb3QtZm9ybS5qYWRlXG4gKiogbW9kdWxlIGlkID0gODJcbiAqKiBtb2R1bGUgY2h1bmtzID0gOFxuICoqLyIsIi8vIEFkYXB0ZWQgZnJvbSBiZW10by5qYWRlLCBjb3B5cmlnaHQoYykgMjAxMiBSb21hbiBLb21hcm92IDxraXp1QGtpenUucnU+XG5cbi8qIGpzaGludCAtVzEwNiAqL1xuXG52YXIgamFkZSA9IHJlcXVpcmUoJ2phZGUvbGliL3J1bnRpbWUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzZXR0aW5ncykge1xuICBzZXR0aW5ncyA9IHNldHRpbmdzIHx8IHt9O1xuXG4gIHNldHRpbmdzLnByZWZpeCA9IHNldHRpbmdzLnByZWZpeCB8fCAnJztcbiAgc2V0dGluZ3MuZWxlbWVudCA9IHNldHRpbmdzLmVsZW1lbnQgfHwgJ19fJztcbiAgc2V0dGluZ3MubW9kaWZpZXIgPSBzZXR0aW5ncy5tb2RpZmllciB8fCAnXyc7XG4gIHNldHRpbmdzLmRlZmF1bHRfdGFnID0gc2V0dGluZ3MuZGVmYXVsdF90YWcgfHwgJ2Rpdic7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGJ1ZiwgYmVtX2NoYWluLCBiZW1fY2hhaW5fY29udGV4dHMsIHRhZywgaXNFbGVtZW50KSB7XG4gICAgLy9jb25zb2xlLmxvZyhcIi0tPlwiLCBhcmd1bWVudHMpO1xuICAgIHZhciBibG9jayA9IHRoaXMuYmxvY2s7XG4gICAgdmFyIGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXMgfHwge307XG5cbiAgICAvLyBSZXdyaXRpbmcgdGhlIGNsYXNzIGZvciBlbGVtZW50cyBhbmQgbW9kaWZpZXJzXG4gICAgaWYgKGF0dHJpYnV0ZXMuY2xhc3MpIHtcbiAgICAgIHZhciBiZW1fY2xhc3NlcyA9IGF0dHJpYnV0ZXMuY2xhc3M7XG5cbiAgICAgIGlmIChiZW1fY2xhc3NlcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIGJlbV9jbGFzc2VzID0gYmVtX2NsYXNzZXMuam9pbignICcpO1xuICAgICAgfVxuICAgICAgYmVtX2NsYXNzZXMgPSBiZW1fY2xhc3Nlcy5zcGxpdCgnICcpO1xuXG4gICAgICB2YXIgYmVtX2Jsb2NrO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYmVtX2Jsb2NrID0gYmVtX2NsYXNzZXNbMF0ubWF0Y2gobmV3IFJlZ0V4cCgnXigoKD8hJyArIHNldHRpbmdzLmVsZW1lbnQgKyAnfCcgKyBzZXR0aW5ncy5tb2RpZmllciArICcpLikrKScpKVsxXTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW5jb3JyZWN0IGJlbSBjbGFzczogXCIgKyBiZW1fY2xhc3Nlc1swXSk7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNFbGVtZW50KSB7XG4gICAgICAgIGJlbV9jaGFpbltiZW1fY2hhaW4ubGVuZ3RoXSA9IGJlbV9ibG9jaztcbiAgICAgICAgYmVtX2NsYXNzZXNbMF0gPSBiZW1fY2xhc3Nlc1swXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJlbV9jbGFzc2VzWzBdID0gYmVtX2NoYWluW2JlbV9jaGFpbi5sZW5ndGggLSAxXSArIHNldHRpbmdzLmVsZW1lbnQgKyBiZW1fY2xhc3Nlc1swXTtcbiAgICAgIH1cblxuICAgICAgdmFyIGN1cnJlbnRfYmxvY2sgPSAoaXNFbGVtZW50ID8gYmVtX2NoYWluW2JlbV9jaGFpbi5sZW5ndGggLSAxXSArIHNldHRpbmdzLmVsZW1lbnQgOiAnJykgKyBiZW1fYmxvY2s7XG5cbiAgICAgIC8vIEFkZGluZyB0aGUgYmxvY2sgaWYgdGhlcmUgaXMgb25seSBtb2RpZmllciBhbmQvb3IgZWxlbWVudFxuICAgICAgaWYgKGJlbV9jbGFzc2VzLmluZGV4T2YoY3VycmVudF9ibG9jaykgPT09IC0xKSB7XG4gICAgICAgIGJlbV9jbGFzc2VzW2JlbV9jbGFzc2VzLmxlbmd0aF0gPSBjdXJyZW50X2Jsb2NrO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJlbV9jbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBrbGFzcyA9IGJlbV9jbGFzc2VzW2ldO1xuXG4gICAgICAgIGlmIChrbGFzcy5tYXRjaChuZXcgUmVnRXhwKCdeKD8hJyArIHNldHRpbmdzLmVsZW1lbnQgKyAnKScgKyBzZXR0aW5ncy5tb2RpZmllcikpKSB7XG4gICAgICAgICAgLy8gRXhwYW5kaW5nIHRoZSBtb2RpZmllcnNcbiAgICAgICAgICBiZW1fY2xhc3Nlc1tpXSA9IGN1cnJlbnRfYmxvY2sgKyBrbGFzcztcbiAgICAgICAgfSBlbHNlIGlmIChrbGFzcy5tYXRjaChuZXcgUmVnRXhwKCdeJyArIHNldHRpbmdzLmVsZW1lbnQpKSkge1xuICAgICAgICAgIC8vLSBFeHBhbmRpbmcgdGhlIG1peGVkIGluIGVsZW1lbnRzXG4gICAgICAgICAgaWYgKGJlbV9jaGFpbltiZW1fY2hhaW4ubGVuZ3RoIC0gMl0pIHtcbiAgICAgICAgICAgIGJlbV9jbGFzc2VzW2ldID0gYmVtX2NoYWluW2JlbV9jaGFpbi5sZW5ndGggLSAyXSArIGtsYXNzO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiZW1fY2xhc3Nlc1tpXSA9IGJlbV9jaGFpbltiZW1fY2hhaW4ubGVuZ3RoIC0gMV0gKyBrbGFzcztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGRpbmcgcHJlZml4ZXNcbiAgICAgICAgaWYgKGJlbV9jbGFzc2VzW2ldLm1hdGNoKG5ldyBSZWdFeHAoJ14nICsgY3VycmVudF9ibG9jayArICcoJHwoPz0nICsgc2V0dGluZ3MuZWxlbWVudCArICd8JyArIHNldHRpbmdzLm1vZGlmaWVyICsgJykpJykpKSB7XG4gICAgICAgICAgYmVtX2NsYXNzZXNbaV0gPSBzZXR0aW5ncy5wcmVmaXggKyBiZW1fY2xhc3Nlc1tpXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBXcml0ZSBtb2RpZmllZCBjbGFzc2VzIHRvIGF0dHJpYnV0ZXMgaW4gdGhlIGNvcnJlY3Qgb3JkZXJcbiAgICAgIGF0dHJpYnV0ZXMuY2xhc3MgPSBiZW1fY2xhc3Nlcy5zb3J0KCkuam9pbignICcpO1xuICAgIH1cblxuICAgIGJlbV90YWcoYnVmLCBibG9jaywgYXR0cmlidXRlcywgYmVtX2NoYWluLCBiZW1fY2hhaW5fY29udGV4dHMsIHRhZyk7XG5cbiAgICAvLyBDbG9zaW5nIGFjdGlvbnMgKHJlbW92ZSB0aGUgY3VycmVudCBibG9jayBmcm9tIHRoZSBjaGFpbilcbiAgICBpZiAoIWlzRWxlbWVudCkge1xuICAgICAgYmVtX2NoYWluLnBvcCgpO1xuICAgIH1cbiAgICBiZW1fY2hhaW5fY29udGV4dHMucG9wKCk7XG4gIH07XG5cblxuICAvLyB1c2VkIGZvciB0d2Vha2luZyB3aGF0IHRhZyB3ZSBhcmUgdGhyb3dpbmcgYW5kIGRvIHdlIG5lZWQgdG8gd3JhcCBhbnl0aGluZyBoZXJlXG4gIGZ1bmN0aW9uIGJlbV90YWcoYnVmLCBibG9jaywgYXR0cmlidXRlcywgYmVtX2NoYWluLCBiZW1fY2hhaW5fY29udGV4dHMsIHRhZykge1xuICAgIC8vIHJld3JpdGluZyB0YWcgbmFtZSBvbiBkaWZmZXJlbnQgY29udGV4dHNcbiAgICB2YXIgbmV3VGFnID0gdGFnIHx8IHNldHRpbmdzLmRlZmF1bHRfdGFnO1xuICAgIHZhciBjb250ZXh0SW5kZXggPSBiZW1fY2hhaW5fY29udGV4dHMubGVuZ3RoO1xuXG4gICAgLy9DaGVja3MgZm9yIGNvbnRleHRzIGlmIG5vIHRhZyBnaXZlblxuICAgIC8vY29uc29sZS5sb2coYmVtX2NoYWluX2NvbnRleHRzLCB0YWcpO1xuICAgIGlmICghdGFnKSB7XG4gICAgICBpZiAoYmVtX2NoYWluX2NvbnRleHRzW2NvbnRleHRJbmRleCAtIDFdID09PSAnaW5saW5lJykge1xuICAgICAgICBuZXdUYWcgPSAnc3Bhbic7XG4gICAgICB9IGVsc2UgaWYgKGJlbV9jaGFpbl9jb250ZXh0c1tjb250ZXh0SW5kZXggLSAxXSA9PT0gJ2xpc3QnKSB7XG4gICAgICAgIG5ld1RhZyA9ICdsaSc7XG4gICAgICB9XG4gICAgICBcblxuICAgICAgLy9BdHRyaWJ1dGVzIGNvbnRleHQgY2hlY2tzXG4gICAgICBpZiAoYXR0cmlidXRlcy5ocmVmKSB7XG4gICAgICAgIG5ld1RhZyA9ICdhJztcbiAgICAgIH0gZWxzZSBpZiAoYXR0cmlidXRlcy5mb3IpIHtcbiAgICAgICAgbmV3VGFnID0gJ2xhYmVsJztcbiAgICAgIH0gZWxzZSBpZiAoYXR0cmlidXRlcy5zcmMpIHtcbiAgICAgICAgbmV3VGFnID0gJ2ltZyc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy9Db250ZXh0dWFsIHdyYXBwZXJzXG4gICAgaWYgKGJlbV9jaGFpbl9jb250ZXh0c1tjb250ZXh0SW5kZXggLSAxXSA9PT0gJ2xpc3QnICYmIG5ld1RhZyAhPT0gJ2xpJykge1xuICAgICAgYnVmLnB1c2goJzxsaT4nKTtcbiAgICB9IGVsc2UgaWYgKGJlbV9jaGFpbl9jb250ZXh0c1tjb250ZXh0SW5kZXggLSAxXSAhPT0gJ2xpc3QnICYmIGJlbV9jaGFpbl9jb250ZXh0c1tjb250ZXh0SW5kZXggLSAxXSAhPT0gJ3BzZXVkby1saXN0JyAmJiBuZXdUYWcgPT09ICdsaScpIHtcbiAgICAgIGJ1Zi5wdXNoKCc8dWw+Jyk7XG4gICAgICBiZW1fY2hhaW5fY29udGV4dHNbYmVtX2NoYWluX2NvbnRleHRzLmxlbmd0aF0gPSAncHNldWRvLWxpc3QnO1xuICAgIH0gZWxzZSBpZiAoYmVtX2NoYWluX2NvbnRleHRzW2NvbnRleHRJbmRleCAtIDFdID09PSAncHNldWRvLWxpc3QnICYmIG5ld1RhZyAhPT0gJ2xpJykge1xuICAgICAgYnVmLnB1c2goJzwvdWw+Jyk7XG4gICAgICBiZW1fY2hhaW5fY29udGV4dHMucG9wKCk7XG4gICAgfVxuXG4gICAgLy9TZXR0aW5nIGNvbnRleHRcbiAgICBpZiAoWydhJywgJ2FiYnInLCAnYWNyb255bScsICdiJywgJ2JyJywgJ2NvZGUnLCAnZW0nLCAnZm9udCcsICdpJywgJ2ltZycsICdpbnMnLCAna2JkJywgJ21hcCcsICdzYW1wJywgJ3NtYWxsJywgJ3NwYW4nLCAnc3Ryb25nJywgJ3N1YicsICdzdXAnLCAnbGFiZWwnLCAncCcsICdoMScsICdoMicsICdoMycsICdoNCcsICdoNScsICdoNiddLmluZGV4T2YobmV3VGFnKSAhPT0gLTEpIHtcbiAgICAgIGJlbV9jaGFpbl9jb250ZXh0c1tiZW1fY2hhaW5fY29udGV4dHMubGVuZ3RoXSA9ICdpbmxpbmUnO1xuICAgIH0gZWxzZSBpZiAoWyd1bCcsICdvbCddLmluZGV4T2YobmV3VGFnKSAhPT0gLTEpIHtcbiAgICAgIGJlbV9jaGFpbl9jb250ZXh0c1tiZW1fY2hhaW5fY29udGV4dHMubGVuZ3RoXSA9ICdsaXN0JztcbiAgICB9IGVsc2Uge1xuICAgICAgYmVtX2NoYWluX2NvbnRleHRzW2JlbV9jaGFpbl9jb250ZXh0cy5sZW5ndGhdID0gJ2Jsb2NrJztcbiAgICB9XG5cbiAgICBzd2l0Y2ggKG5ld1RhZykge1xuICAgIGNhc2UgJ2ltZyc6XG4gICAgICAvLyBJZiB0aGVyZSBpcyBubyB0aXRsZSB3ZSBkb24ndCBuZWVkIGl0IHRvIHNob3cgZXZlbiBpZiB0aGVyZSBpcyBzb21lIGFsdFxuICAgICAgaWYgKGF0dHJpYnV0ZXMuYWx0ICYmICFhdHRyaWJ1dGVzLnRpdGxlKSB7XG4gICAgICAgIGF0dHJpYnV0ZXMudGl0bGUgPSAnJztcbiAgICAgIH1cbiAgICAgIC8vIElmIHdlIGhhdmUgdGl0bGUsIHdlIG11c3QgaGF2ZSBpdCBpbiBhbHQgaWYgaXQncyBub3Qgc2V0XG4gICAgICBpZiAoYXR0cmlidXRlcy50aXRsZSAmJiAhYXR0cmlidXRlcy5hbHQpIHtcbiAgICAgICAgYXR0cmlidXRlcy5hbHQgPSBhdHRyaWJ1dGVzLnRpdGxlO1xuICAgICAgfVxuICAgICAgaWYgKCFhdHRyaWJ1dGVzLmFsdCkge1xuICAgICAgICBhdHRyaWJ1dGVzLmFsdCA9ICcnO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnaW5wdXQnOlxuICAgICAgaWYgKCFhdHRyaWJ1dGVzLnR5cGUpIHtcbiAgICAgICAgYXR0cmlidXRlcy50eXBlID0gXCJ0ZXh0XCI7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICdodG1sJzpcbiAgICAgIGJ1Zi5wdXNoKCc8IURPQ1RZUEUgSFRNTD4nKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2EnOlxuICAgICAgaWYgKCFhdHRyaWJ1dGVzLmhyZWYpIHtcbiAgICAgICAgYXR0cmlidXRlcy5ocmVmID0gJyMnO1xuICAgICAgfVxuICAgIH1cblxuICAgIGJ1Zi5wdXNoKCc8JyArIG5ld1RhZyArIGphZGUuYXR0cnMoamFkZS5tZXJnZShbYXR0cmlidXRlc10pLCB0cnVlKSArIFwiPlwiKTtcblxuICAgIGlmIChibG9jaykgYmxvY2soKTtcblxuICAgIGlmIChbJ2FyZWEnLCAnYmFzZScsICdicicsICdjb2wnLCAnZW1iZWQnLCAnaHInLCAnaW1nJywgJ2lucHV0JywgJ2tleWdlbicsICdsaW5rJywgJ21lbnVpdGVtJywgJ21ldGEnLCAncGFyYW0nLCAnc291cmNlJywgJ3RyYWNrJywgJ3diciddLmluZGV4T2YobmV3VGFnKSA9PSAtMSkge1xuICAgICAgYnVmLnB1c2goJzwvJyArIG5ld1RhZyArICc+Jyk7XG4gICAgfVxuXG4gICAgLy8gQ2xvc2luZyBhbGwgdGhlIHdyYXBwZXIgdGFpbHNcbiAgICBpZiAoYmVtX2NoYWluX2NvbnRleHRzW2NvbnRleHRJbmRleCAtIDFdID09PSAnbGlzdCcgJiYgbmV3VGFnICE9ICdsaScpIHtcbiAgICAgIGJ1Zi5wdXNoKCc8L2xpPicpO1xuICAgIH1cbiAgfVxuXG5cbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vYmVtLWphZGUvaW5kZXguanNcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogTWVyZ2UgdHdvIGF0dHJpYnV0ZSBvYmplY3RzIGdpdmluZyBwcmVjZWRlbmNlXG4gKiB0byB2YWx1ZXMgaW4gb2JqZWN0IGBiYC4gQ2xhc3NlcyBhcmUgc3BlY2lhbC1jYXNlZFxuICogYWxsb3dpbmcgZm9yIGFycmF5cyBhbmQgbWVyZ2luZy9qb2luaW5nIGFwcHJvcHJpYXRlbHlcbiAqIHJlc3VsdGluZyBpbiBhIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYVxuICogQHBhcmFtIHtPYmplY3R9IGJcbiAqIEByZXR1cm4ge09iamVjdH0gYVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5tZXJnZSA9IGZ1bmN0aW9uIG1lcmdlKGEsIGIpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICB2YXIgYXR0cnMgPSBhWzBdO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgICAgYXR0cnMgPSBtZXJnZShhdHRycywgYVtpXSk7XG4gICAgfVxuICAgIHJldHVybiBhdHRycztcbiAgfVxuICB2YXIgYWMgPSBhWydjbGFzcyddO1xuICB2YXIgYmMgPSBiWydjbGFzcyddO1xuXG4gIGlmIChhYyB8fCBiYykge1xuICAgIGFjID0gYWMgfHwgW107XG4gICAgYmMgPSBiYyB8fCBbXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYWMpKSBhYyA9IFthY107XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGJjKSkgYmMgPSBbYmNdO1xuICAgIGFbJ2NsYXNzJ10gPSBhYy5jb25jYXQoYmMpLmZpbHRlcihudWxscyk7XG4gIH1cblxuICBmb3IgKHZhciBrZXkgaW4gYikge1xuICAgIGlmIChrZXkgIT0gJ2NsYXNzJykge1xuICAgICAgYVtrZXldID0gYltrZXldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhO1xufTtcblxuLyoqXG4gKiBGaWx0ZXIgbnVsbCBgdmFsYHMuXG4gKlxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBudWxscyh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPSBudWxsICYmIHZhbCAhPT0gJyc7XG59XG5cbi8qKlxuICogam9pbiBhcnJheSBhcyBjbGFzc2VzLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuam9pbkNsYXNzZXMgPSBqb2luQ2xhc3NlcztcbmZ1bmN0aW9uIGpvaW5DbGFzc2VzKHZhbCkge1xuICByZXR1cm4gKEFycmF5LmlzQXJyYXkodmFsKSA/IHZhbC5tYXAoam9pbkNsYXNzZXMpIDpcbiAgICAodmFsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSA/IE9iamVjdC5rZXlzKHZhbCkuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIHZhbFtrZXldOyB9KSA6XG4gICAgW3ZhbF0pLmZpbHRlcihudWxscykuam9pbignICcpO1xufVxuXG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gY2xhc3Nlcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBjbGFzc2VzXG4gKiBAcGFyYW0ge0FycmF5LjxCb29sZWFuPn0gZXNjYXBlZFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmNscyA9IGZ1bmN0aW9uIGNscyhjbGFzc2VzLCBlc2NhcGVkKSB7XG4gIHZhciBidWYgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGVzY2FwZWQgJiYgZXNjYXBlZFtpXSkge1xuICAgICAgYnVmLnB1c2goZXhwb3J0cy5lc2NhcGUoam9pbkNsYXNzZXMoW2NsYXNzZXNbaV1dKSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBidWYucHVzaChqb2luQ2xhc3NlcyhjbGFzc2VzW2ldKSk7XG4gICAgfVxuICB9XG4gIHZhciB0ZXh0ID0gam9pbkNsYXNzZXMoYnVmKTtcbiAgaWYgKHRleHQubGVuZ3RoKSB7XG4gICAgcmV0dXJuICcgY2xhc3M9XCInICsgdGV4dCArICdcIic7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG59O1xuXG5cbmV4cG9ydHMuc3R5bGUgPSBmdW5jdGlvbiAodmFsKSB7XG4gIGlmICh2YWwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModmFsKS5tYXAoZnVuY3Rpb24gKHN0eWxlKSB7XG4gICAgICByZXR1cm4gc3R5bGUgKyAnOicgKyB2YWxbc3R5bGVdO1xuICAgIH0pLmpvaW4oJzsnKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdmFsO1xuICB9XG59O1xuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGF0dHJpYnV0ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGVzY2FwZWRcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdGVyc2VcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5hdHRyID0gZnVuY3Rpb24gYXR0cihrZXksIHZhbCwgZXNjYXBlZCwgdGVyc2UpIHtcbiAgaWYgKGtleSA9PT0gJ3N0eWxlJykge1xuICAgIHZhbCA9IGV4cG9ydHMuc3R5bGUodmFsKTtcbiAgfVxuICBpZiAoJ2Jvb2xlYW4nID09IHR5cGVvZiB2YWwgfHwgbnVsbCA9PSB2YWwpIHtcbiAgICBpZiAodmFsKSB7XG4gICAgICByZXR1cm4gJyAnICsgKHRlcnNlID8ga2V5IDoga2V5ICsgJz1cIicgKyBrZXkgKyAnXCInKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfSBlbHNlIGlmICgwID09IGtleS5pbmRleE9mKCdkYXRhJykgJiYgJ3N0cmluZycgIT0gdHlwZW9mIHZhbCkge1xuICAgIGlmIChKU09OLnN0cmluZ2lmeSh2YWwpLmluZGV4T2YoJyYnKSAhPT0gLTEpIHtcbiAgICAgIGNvbnNvbGUud2FybignU2luY2UgSmFkZSAyLjAuMCwgYW1wZXJzYW5kcyAoYCZgKSBpbiBkYXRhIGF0dHJpYnV0ZXMgJyArXG4gICAgICAgICAgICAgICAgICAgJ3dpbGwgYmUgZXNjYXBlZCB0byBgJmFtcDtgJyk7XG4gICAgfTtcbiAgICBpZiAodmFsICYmIHR5cGVvZiB2YWwudG9JU09TdHJpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUud2FybignSmFkZSB3aWxsIGVsaW1pbmF0ZSB0aGUgZG91YmxlIHF1b3RlcyBhcm91bmQgZGF0ZXMgaW4gJyArXG4gICAgICAgICAgICAgICAgICAgJ0lTTyBmb3JtIGFmdGVyIDIuMC4wJyk7XG4gICAgfVxuICAgIHJldHVybiAnICcgKyBrZXkgKyBcIj0nXCIgKyBKU09OLnN0cmluZ2lmeSh2YWwpLnJlcGxhY2UoLycvZywgJyZhcG9zOycpICsgXCInXCI7XG4gIH0gZWxzZSBpZiAoZXNjYXBlZCkge1xuICAgIGlmICh2YWwgJiYgdHlwZW9mIHZhbC50b0lTT1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc29sZS53YXJuKCdKYWRlIHdpbGwgc3RyaW5naWZ5IGRhdGVzIGluIElTTyBmb3JtIGFmdGVyIDIuMC4wJyk7XG4gICAgfVxuICAgIHJldHVybiAnICcgKyBrZXkgKyAnPVwiJyArIGV4cG9ydHMuZXNjYXBlKHZhbCkgKyAnXCInO1xuICB9IGVsc2Uge1xuICAgIGlmICh2YWwgJiYgdHlwZW9mIHZhbC50b0lTT1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc29sZS53YXJuKCdKYWRlIHdpbGwgc3RyaW5naWZ5IGRhdGVzIGluIElTTyBmb3JtIGFmdGVyIDIuMC4wJyk7XG4gICAgfVxuICAgIHJldHVybiAnICcgKyBrZXkgKyAnPVwiJyArIHZhbCArICdcIic7XG4gIH1cbn07XG5cbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBhdHRyaWJ1dGVzIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge09iamVjdH0gZXNjYXBlZFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmF0dHJzID0gZnVuY3Rpb24gYXR0cnMob2JqLCB0ZXJzZSl7XG4gIHZhciBidWYgPSBbXTtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG5cbiAgaWYgKGtleXMubGVuZ3RoKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXVxuICAgICAgICAsIHZhbCA9IG9ialtrZXldO1xuXG4gICAgICBpZiAoJ2NsYXNzJyA9PSBrZXkpIHtcbiAgICAgICAgaWYgKHZhbCA9IGpvaW5DbGFzc2VzKHZhbCkpIHtcbiAgICAgICAgICBidWYucHVzaCgnICcgKyBrZXkgKyAnPVwiJyArIHZhbCArICdcIicpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBidWYucHVzaChleHBvcnRzLmF0dHIoa2V5LCB2YWwsIGZhbHNlLCB0ZXJzZSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWYuam9pbignJyk7XG59O1xuXG4vKipcbiAqIEVzY2FwZSB0aGUgZ2l2ZW4gc3RyaW5nIG9mIGBodG1sYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaHRtbFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5lc2NhcGUgPSBmdW5jdGlvbiBlc2NhcGUoaHRtbCl7XG4gIHZhciByZXN1bHQgPSBTdHJpbmcoaHRtbClcbiAgICAucmVwbGFjZSgvJi9nLCAnJmFtcDsnKVxuICAgIC5yZXBsYWNlKC88L2csICcmbHQ7JylcbiAgICAucmVwbGFjZSgvPi9nLCAnJmd0OycpXG4gICAgLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKTtcbiAgaWYgKHJlc3VsdCA9PT0gJycgKyBodG1sKSByZXR1cm4gaHRtbDtcbiAgZWxzZSByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gKiBSZS10aHJvdyB0aGUgZ2l2ZW4gYGVycmAgaW4gY29udGV4dCB0byB0aGVcbiAqIHRoZSBqYWRlIGluIGBmaWxlbmFtZWAgYXQgdGhlIGdpdmVuIGBsaW5lbm9gLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVyclxuICogQHBhcmFtIHtTdHJpbmd9IGZpbGVuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gbGluZW5vXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLnJldGhyb3cgPSBmdW5jdGlvbiByZXRocm93KGVyciwgZmlsZW5hbWUsIGxpbmVubywgc3RyKXtcbiAgaWYgKCEoZXJyIGluc3RhbmNlb2YgRXJyb3IpKSB0aHJvdyBlcnI7XG4gIGlmICgodHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyB8fCAhZmlsZW5hbWUpICYmICFzdHIpIHtcbiAgICBlcnIubWVzc2FnZSArPSAnIG9uIGxpbmUgJyArIGxpbmVubztcbiAgICB0aHJvdyBlcnI7XG4gIH1cbiAgdHJ5IHtcbiAgICBzdHIgPSBzdHIgfHwgcmVxdWlyZSgnZnMnKS5yZWFkRmlsZVN5bmMoZmlsZW5hbWUsICd1dGY4JylcbiAgfSBjYXRjaCAoZXgpIHtcbiAgICByZXRocm93KGVyciwgbnVsbCwgbGluZW5vKVxuICB9XG4gIHZhciBjb250ZXh0ID0gM1xuICAgICwgbGluZXMgPSBzdHIuc3BsaXQoJ1xcbicpXG4gICAgLCBzdGFydCA9IE1hdGgubWF4KGxpbmVubyAtIGNvbnRleHQsIDApXG4gICAgLCBlbmQgPSBNYXRoLm1pbihsaW5lcy5sZW5ndGgsIGxpbmVubyArIGNvbnRleHQpO1xuXG4gIC8vIEVycm9yIGNvbnRleHRcbiAgdmFyIGNvbnRleHQgPSBsaW5lcy5zbGljZShzdGFydCwgZW5kKS5tYXAoZnVuY3Rpb24obGluZSwgaSl7XG4gICAgdmFyIGN1cnIgPSBpICsgc3RhcnQgKyAxO1xuICAgIHJldHVybiAoY3VyciA9PSBsaW5lbm8gPyAnICA+ICcgOiAnICAgICcpXG4gICAgICArIGN1cnJcbiAgICAgICsgJ3wgJ1xuICAgICAgKyBsaW5lO1xuICB9KS5qb2luKCdcXG4nKTtcblxuICAvLyBBbHRlciBleGNlcHRpb24gbWVzc2FnZVxuICBlcnIucGF0aCA9IGZpbGVuYW1lO1xuICBlcnIubWVzc2FnZSA9IChmaWxlbmFtZSB8fCAnSmFkZScpICsgJzonICsgbGluZW5vXG4gICAgKyAnXFxuJyArIGNvbnRleHQgKyAnXFxuXFxuJyArIGVyci5tZXNzYWdlO1xuICB0aHJvdyBlcnI7XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2phZGUvbGliL3J1bnRpbWUuanNcbiAqKi8iLCIvKiAoaWdub3JlZCkgKi9cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGZzIChpZ25vcmVkKVxuICoqIG1vZHVsZSBpZCA9IDg3XG4gKiogbW9kdWxlIGNodW5rcyA9IDhcbiAqKi8iXSwic291cmNlUm9vdCI6IiIsImZpbGUiOiI4LjIwOWJlOGJmYjczZmFhMjUwNjYxLmpzIn0=