var tutorial =
webpackJsonp_name_([6],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var delegate = __webpack_require__(24);
	var prism = __webpack_require__(32);
	var xhr = __webpack_require__(25);
	var TutorialMapModal = __webpack_require__(21);
	
	exports.init = function () {
	
	  initTaskButtons();
	  initFolderList();
	
	  initSidebarHighlight();
	
	  delegate(document, "[data-action=\"tutorial-map\"]", "click", function (event) {
	    new TutorialMapModal();
	    event.preventDefault();
	  });
	
	  prism.init();
	
	  if (window.isEbook) {
	    __webpack_require__.e/* nsure */(2, function () {
	      __webpack_require__(23).init();
	    });
	  }
	};
	
	exports.TutorialMap = __webpack_require__(22);
	
	function initSidebarHighlight() {
	
	  function highlight() {
	
	    var current = document.getElementsByClassName("sidebar__navigation-link_active");
	    if (current[0]) current[0].classList.remove("sidebar__navigation-link_active");
	
	    var h2s = document.getElementsByTagName("h2");
	    for (var i = 0; i < h2s.length; i++) {
	      var h2 = h2s[i];
	      // first in-page header
	      if (h2.getBoundingClientRect().top > 0) break;
	    }
	    i--; // we need the one before it (currently reading)
	
	    if (i >= 0) {
	      var href = h2s[i].firstElementChild && h2s[i].firstElementChild.getAttribute("href");
	      var li = document.querySelector(".sidebar__navigation-link a[href=\"" + href + "\"]");
	      if (href && li) {
	        li.classList.add("sidebar__navigation-link_active");
	      }
	    }
	  }
	
	  document.addEventListener("DOMContentLoaded", function () {
	    highlight();
	
	    window.addEventListener("scroll", highlight);
	  });
	}
	
	function initTaskButtons() {
	  // solution button
	  delegate(document, ".task__solution", "click", function (event) {
	    event.target.closest(".task").classList.toggle("task__answer_open");
	  });
	
	  // close solution button
	  delegate(document, ".task__answer-close", "click", function (event) {
	    event.target.closest(".task").classList.toggle("task__answer_open");
	  });
	
	  // every step button (if any steps)
	  delegate(document, ".task__step-show", "click", function (event) {
	    event.target.closest(".task__step").classList.toggle("task__step_open");
	  });
	}
	
	function initFolderList() {
	  delegate(document, ".lessons-list__lesson_level_1 > .lessons-list__link", "click", function (event) {
	    var link = event.delegateTarget;
	    var openFolder = link.closest(".lessons-list").querySelector(".lessons-list__lesson_open");
	    // close the previous open folder (thus making an accordion)
	    if (openFolder && openFolder != link.parentNode) {
	      openFolder.classList.remove("lessons-list__lesson_open");
	    }
	    link.parentNode.classList.toggle("lessons-list__lesson_open");
	    event.preventDefault();
	  });
	}

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = trackSticky;
	
	function trackSticky() {
	
	  var stickyElems = document.querySelectorAll("[data-sticky]");
	
	  for (var i = 0; i < stickyElems.length; i++) {
	    var stickyElem = stickyElems[i];
	    var container = stickyElem.dataset.sticky ? document.querySelector(stickyElem.dataset.sticky) : document.body;
	
	    if (stickyElem.getBoundingClientRect().top < 0) {
	      // become fixed
	      if (stickyElem.style.cssText) {
	        // already fixed
	        // inertia: happens when scrolled fast too much to bottom
	        // http://ilyakantor.ru/screen/2015-02-24_1555.swf
	        return;
	      }
	
	      var savedLeft = stickyElem.getBoundingClientRect().left;
	      var placeholder = createPlaceholder(stickyElem);
	
	      stickyElem.parentNode.insertBefore(placeholder, stickyElem);
	
	      container.appendChild(stickyElem);
	      stickyElem.classList.add("sticky");
	      stickyElem.style.position = "fixed";
	      stickyElem.style.top = 0;
	      stickyElem.style.left = savedLeft + "px";
	      // zIndex < 1000, because it must be under an overlay,
	      // e.g. sitemap must show over the progress bar
	      stickyElem.style.zIndex = 101;
	      stickyElem.style.background = "white"; // non-transparent to cover the text
	      stickyElem.style.margin = 0;
	      stickyElem.style.width = placeholder.offsetWidth + "px"; // keep same width as before
	      stickyElem.placeholder = placeholder;
	    } else if (stickyElem.placeholder && stickyElem.placeholder.getBoundingClientRect().top > 0) {
	      // become non-fixed
	      stickyElem.style.cssText = "";
	      stickyElem.classList.remove("sticky");
	      stickyElem.placeholder.parentNode.insertBefore(stickyElem, stickyElem.placeholder);
	      stickyElem.placeholder.remove();
	
	      stickyElem.placeholder = null;
	    }
	  }
	}
	
	/**
	 * Creates a placeholder w/ same size & margin
	 * @param elem
	 * @returns {*|!HTMLElement}
	 */
	function createPlaceholder(elem) {
	  var placeholder = document.createElement("div");
	  var style = getComputedStyle(elem);
	  placeholder.style.width = elem.offsetWidth + "px";
	  placeholder.style.marginLeft = style.marginLeft;
	  placeholder.style.marginRight = style.marginRight;
	  placeholder.style.height = elem.offsetHeight + "px";
	  placeholder.style.marginBottom = style.marginBottom;
	  placeholder.style.marginTop = style.marginTop;
	  return placeholder;
	}

/***/ },
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var xhr = __webpack_require__(25);
	
	var delegate = __webpack_require__(24);
	var Modal = __webpack_require__(12);
	var Spinner = __webpack_require__(35);
	var TutorialMap = __webpack_require__(22);
	var trackSticky = __webpack_require__(8);
	
	/**
	 * Options:
	 *   - callback: function to be called after successful login (by default - go to successRedirect)
	 *   - message: form message to be shown when the login form appears ("Log in to leave the comment")
	 *   - successRedirect: the page to redirect (current page by default)
	 *       - after immediate login
	 *       - after registration for "confirm email" link
	 */
	function TutorialMapModal() {
	  Modal.apply(this, arguments);
	
	  var spinner = new Spinner();
	  this.setContent(spinner.elem);
	  spinner.start();
	
	  var request = this.request({
	    url: "/tutorial/map"
	  });
	
	  var self = this;
	
	  request.addEventListener("success", function (event) {
	    var wrapper = document.createElement("div");
	    wrapper.className = "tutorial-map-overlay";
	    wrapper.innerHTML = event.result + "<button class=\"close-button tutorial-map-overlay__close\"></button>";
	    document.body.classList.add("tutorial-map_on");
	    self.setContent(wrapper);
	
	    wrapper.addEventListener("scroll", trackSticky);
	
	    new TutorialMap(self.contentElem.firstElementChild);
	  });
	
	  request.addEventListener("fail", function () {
	    self.remove();
	  });
	}
	
	TutorialMapModal.prototype = Object.create(Modal.prototype);
	
	delegate.delegateMixin(TutorialMapModal.prototype);
	
	TutorialMapModal.prototype.remove = function () {
	  Modal.prototype.remove.apply(this, arguments);
	  document.body.classList.remove("tutorial-map_on");
	};
	
	TutorialMapModal.prototype.request = function (options) {
	  var request = xhr(options);
	
	  return request;
	};
	
	module.exports = TutorialMapModal;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var throttle = __webpack_require__(52);
	var delegate = __webpack_require__(24);
	
	function TutorialMap(elem) {
	  var _this = this;
	
	  this.elem = elem;
	
	  this.showTasksCheckbox = elem.querySelector("[data-tutorial-map-show-tasks]");
	  this.showTasksCheckbox.checked = +localStorage.showTasksCheckbox;
	
	  this.updateShowTasks();
	
	  this.showTasksCheckbox.onchange = this.updateShowTasks.bind(this);
	
	  this.filterInput = this.elem.querySelector("[data-tutorial-map-filter]");
	  this.textInputBlock = this.elem.querySelector(".tutorial-map__filter .text-input");
	
	  this.layoutSwitch = this.elem.querySelector("[data-tutorial-map-layout-switch]");
	  var isMapSingleColumn = +localStorage.isMapSingleColumn;
	  this.layoutSwitch.querySelector("[value=\"0\"]").checked = !isMapSingleColumn;
	  this.layoutSwitch.querySelector("[value=\"1\"]").checked = isMapSingleColumn;
	  this.updateLayout();
	  this.layoutSwitch.onchange = this.onLayoutSwitchChange.bind(this);
	
	  this.filterInput.oninput = this.onFilterInput.bind(this);
	  this.filterInput.onkeydown = this.onFilterKeydown.bind(this);
	
	  this.elem.querySelector(".close-button").onclick = function () {
	    _this.filterInput.value = "";
	    _this.showClearButton(false);
	    _this.filter("");
	  };
	
	  this.chaptersCollapsed = JSON.parse(localStorage.tutorialMapChapters || "{}");
	  this.showChaptersCollapsed();
	
	  this.delegate(".tutorial-map__item > .tutorial-map__link", "click", function (event) {
	    event.preventDefault();
	    var href = event.delegateTarget.getAttribute("href");
	    if (this.chaptersCollapsed[href]) {
	      delete this.chaptersCollapsed[href];
	    } else {
	      this.chaptersCollapsed[href] = 1;
	    }
	    localStorage.tutorialMapChapters = JSON.stringify(this.chaptersCollapsed);
	    this.showChaptersCollapsed();
	  });
	
	  var activeLink = this.elem.querySelector("[href=\"" + location.pathname + "\"]");
	  if (activeLink) {
	    activeLink.classList.add("tutorial-map__link_active");
	  }
	
	  this.focus();
	}
	
	TutorialMap.prototype.showChaptersCollapsed = function () {
	  var links = this.elem.querySelectorAll(".tutorial-map__item > .tutorial-map__link");
	  for (var i = 0; i < links.length; i++) {
	    var link = links[i];
	
	    if (this.chaptersCollapsed[link.getAttribute("href")]) {
	      link.parentNode.classList.add("tutorial-map__item_collapsed");
	    } else {
	      link.parentNode.classList.remove("tutorial-map__item_collapsed");
	    }
	  }
	};
	
	TutorialMap.prototype.onLayoutSwitchChange = function (event) {
	  this.updateLayout();
	};
	
	TutorialMap.prototype.updateLayout = function () {
	  var isMapSingleColumn = +this.elem.querySelector("[name=\"map-layout\"]:checked").value;
	  if (isMapSingleColumn) {
	    this.elem.classList.add("tutorial-map_singlecol");
	  } else {
	    this.elem.classList.remove("tutorial-map_singlecol");
	  }
	
	  localStorage.isMapSingleColumn = isMapSingleColumn ? "1" : "0";
	};
	
	TutorialMap.prototype.updateShowTasks = function () {
	  if (this.showTasksCheckbox.checked) {
	    this.elem.classList.add("tutorial-map_show-tasks");
	  } else {
	    this.elem.classList.remove("tutorial-map_show-tasks");
	  }
	
	  localStorage.showTasksCheckbox = this.showTasksCheckbox.checked ? "1" : "0";
	};
	
	TutorialMap.prototype.onFilterInput = function (event) {
	  this.showClearButton(event.target.value);
	  this.throttleFilter(event.target.value);
	};
	
	TutorialMap.prototype.onFilterKeydown = function (event) {
	  if (event.keyCode == 27) {
	    // escape
	    this.filterInput.value = "";
	    this.showClearButton(false);
	    this.filter("");
	  }
	};
	
	TutorialMap.prototype.showClearButton = function (show) {
	  if (show) {
	    this.textInputBlock.classList.add("text-input_clear-button");
	  } else {
	    this.textInputBlock.classList.remove("text-input_clear-button");
	  }
	};
	
	// focus on the map itself, to allow immediate scrolling with arrow up/down keys
	TutorialMap.prototype.focus = function () {
	  this.elem.tabIndex = -1;
	  this.elem.focus();
	};
	
	TutorialMap.prototype.filter = function (value) {
	  value = value.toLowerCase();
	  var showingTasks = this.showTasksCheckbox.checked;
	
	  var links = this.elem.querySelectorAll(".tutorial-map-link");
	
	  var topItems = this.elem.querySelectorAll(".tutorial-map__item");
	
	  function checkLiMatch(li) {
	    return isSubSequence(li.querySelector("a").innerHTML.toLowerCase(), value.replace(/\s/g, ""));
	  }
	
	  // an item is shown if any of its children is shown OR it's link matches the filter
	  for (var i = 0; i < topItems.length; i++) {
	    var li = topItems[i];
	    var subItems = li.querySelectorAll(".tutorial-map__sub-item");
	
	    var childMatch = Array.prototype.reduce.call(subItems, function (prevValue, subItem) {
	
	      var childMatch = false;
	
	      if (showingTasks) {
	        var subItems = subItem.querySelectorAll(".tutorial-map__sub-sub-item");
	        childMatch = Array.prototype.reduce.call(subItems, function (prevValue, subItem) {
	          var match = checkLiMatch(subItem);
	          subItem.hidden = !match;
	          return prevValue || match;
	        }, false);
	      }
	
	      var match = childMatch || checkLiMatch(subItem);
	      //console.log(subItem, match);
	      subItem.hidden = !match;
	
	      return prevValue || match;
	    }, false);
	
	    li.hidden = !(childMatch || checkLiMatch(li));
	  }
	};
	
	TutorialMap.prototype.throttleFilter = throttle(TutorialMap.prototype.filter, 200);
	delegate.delegateMixin(TutorialMap.prototype);
	
	function isSubSequence(str1, str2) {
	  var i = 0;
	  var j = 0;
	  while (i < str1.length && j < str2.length) {
	    if (str1[i] == str2[j]) {
	      i++;
	      j++;
	    } else {
	      i++;
	    }
	  }
	  return j == str2.length;
	}
	
	module.exports = TutorialMap;

/***/ },
/* 23 */,
/* 24 */,
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var notification = __webpack_require__(34);
	var getCsrfCookie = __webpack_require__(36);
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
	    var timeStart = Date.now();
	
	    request.send(body);
	
	    request.addEventListener("loadend", function () {
	      window.ga("send", "timing", "xhr", method + " " + url, Date.now() - timeStart);
	    });
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
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	__webpack_require__(56);
	__webpack_require__(57);
	__webpack_require__(58);
	__webpack_require__(59);
	__webpack_require__(60);
	__webpack_require__(61);
	__webpack_require__(62);
	__webpack_require__(63);
	__webpack_require__(64);
	__webpack_require__(65);
	__webpack_require__(66);
	__webpack_require__(67);
	__webpack_require__(68);
	__webpack_require__(69);
	__webpack_require__(70);
	
	Prism.tokenTag = "code"; // for iBooks to use monospace font
	
	var CodeBox = __webpack_require__(50);
	var CodeTabsBox = __webpack_require__(51);
	
	function initCodeBoxes(container) {
	
	  // highlight inline
	  var codeExampleElems = container.querySelectorAll(".code-example:not([data-prism-done])");
	
	  for (var i = 0; i < codeExampleElems.length; i++) {
	    var codeExampleElem = codeExampleElems[i];
	    new CodeBox(codeExampleElem);
	    codeExampleElem.setAttribute("data-prism-done", "1");
	  }
	}
	
	function initCodeTabsBox(container) {
	
	  var elems = container.querySelectorAll("div.code-tabs:not([data-prism-done])");
	
	  for (var i = 0; i < elems.length; i++) {
	    new CodeTabsBox(elems[i]);
	    elems[i].setAttribute("data-prism-done", "1");
	  }
	}
	
	exports.init = function () {
	
	  document.removeEventListener("DOMContentLoaded", Prism.highlightAll);
	
	  document.addEventListener("DOMContentLoaded", function () {
	    highlight(document);
	  });
	};
	
	function highlight(elem) {
	  initCodeBoxes(elem);
	  initCodeTabsBox(elem);
	}
	
	exports.highlight = highlight;

/***/ },
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = function () {
	  var csrfCookie = document.cookie.match(/XSRF-TOKEN=([\w-]+)/);
	  return csrfCookie ? csrfCookie[1] : null;
	};

/***/ },
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var resizeOnload = __webpack_require__(20);
	var isScrolledIntoView = __webpack_require__(76);
	var addLineNumbers = __webpack_require__(71);
	
	function CodeBox(elem) {
	
	  var preElem = elem.querySelector("pre");
	  var codeElem = preElem.querySelector("code");
	  var code = codeElem.textContent;
	
	  Prism.highlightElement(codeElem);
	  addLineNumbers(preElem);
	
	  addBlockHighlight(preElem, elem.dataset.highlightBlock);
	  addInlineHighlight(preElem, elem.dataset.highlightInline);
	
	  var isJS = preElem.classList.contains("language-javascript");
	  var isHTML = preElem.classList.contains("language-markup");
	  var isTrusted = elem.dataset.trusted;
	  var jsFrame;
	  var htmlResult;
	  var isFirstRun = true;
	
	  if (!isJS && !isHTML) {
	    return;
	  }var runElem = elem.querySelector("[data-action=\"run\"]");
	  if (runElem) {
	    runElem.onclick = function () {
	      this.blur();
	      run();
	      return false;
	    };
	  }
	
	  var editElem = elem.querySelector("[data-action=\"edit\"]");
	  if (editElem) {
	    editElem.onclick = function () {
	      this.blur();
	      edit();
	      return false;
	    };
	  }
	
	  // some code can't be executed by epub engine
	  if (elem.dataset.autorun !== undefined) {
	    if (window.ebookFormat == "epub" && elem.dataset.autorun == "no-epub") {
	      elem.querySelector("iframe").remove();
	    } else {
	      // timeout should be small, around 10ms, or remove it to make crawler process the autorun
	      setTimeout(run, 1000);
	    }
	  }
	
	  function postJSFrame() {
	    var win = jsFrame[0].contentWindow;
	    if (typeof win.postMessage != "function") {
	      alert("Извините, запуск кода требует более современный браузер");
	      return;
	    }
	    win.postMessage(code, "http://ru.lookatcode.com/showjs");
	  }
	
	  function runHTML() {
	
	    var frame;
	
	    if (htmlResult && elem.dataset.refresh) {
	      htmlResult.remove();
	      htmlResult = null;
	    }
	
	    if (!htmlResult) {
	      // take from HTML if exists there (in markup when autorun is specified)
	      htmlResult = elem.querySelector(".code-result");
	    }
	
	    if (!htmlResult) {
	      // otherwise create (or recreate if refresh)
	      htmlResult = document.createElement("div");
	      htmlResult.className = "code-result code-example__result";
	
	      frame = document.createElement("iframe");
	      frame.name = "frame-" + Math.random();
	      frame.className = "code-result__iframe";
	
	      if (elem.dataset.demoHeight === "0") {
	        // this html has nothing to show
	        frame.style.display = "none";
	      } else if (elem.dataset.demoHeight) {
	        var height = +elem.dataset.demoHeight;
	        frame.style.height = height + "px";
	      }
	      htmlResult.appendChild(frame);
	
	      elem.appendChild(htmlResult);
	    } else {
	      frame = htmlResult.querySelector("iframe");
	    }
	
	    if (isTrusted) {
	      var doc = frame.contentDocument || frame.contentWindow.document;
	
	      doc.open();
	      doc.write(normalizeHtml(code));
	      doc.close();
	
	      if (elem.dataset.demoHeight === undefined) {
	        resizeOnload.iframe(frame);
	      }
	
	      if (!(isFirstRun && elem.dataset.autorun !== undefined)) {
	        if (!isScrolledIntoView(htmlResult)) {
	          htmlResult.scrollIntoView(false);
	        }
	      }
	    } else {
	      var form = document.createElement("form");
	      form.style.display = "none";
	      form.method = "POST";
	      form.enctype = "multipart/form-data";
	      form.action = "http://ru.lookatcode.com/showhtml";
	      form.target = frame.name;
	
	      var textarea = document.createElement("textarea");
	      textarea.name = "code";
	      textarea.value = normalizeHtml(code);
	      form.appendChild(textarea);
	
	      frame.parentNode.insertBefore(form, frame.nextSibling);
	      form.submit();
	      form.remove();
	
	      if (!(isFirstRun && elem.dataset.autorun !== undefined)) {
	        frame.onload = function () {
	
	          if (elem.dataset.demoHeight === undefined) {
	            resizeOnload.iframe(frame);
	          }
	
	          if (!isScrolledIntoView(htmlResult)) {
	            htmlResult.scrollIntoView(false);
	          }
	        };
	      }
	    }
	  }
	
	  function runJS() {
	
	    if (isTrusted) {
	
	      try {
	        /* jshint -W061 */
	        window.eval.call(window, code);
	      } catch (e) {
	        console.error(e);
	        alert("Ошибка: " + e.message);
	      }
	    } else {
	
	      if (elem.dataset.refresh && jsFrame) {
	        jsFrame.remove();
	        jsFrame = null;
	      }
	
	      if (!jsFrame) {
	        // create iframe for js
	        jsFrame = document.createElement("iframe");
	        jsFrame.className = "js-frame";
	        jsFrame.src = "http://ru.lookatcode.com/showjs";
	        jsFrame.style.width = 0;
	        jsFrame.style.height = 0;
	        jsFrame.style.border = "none";
	        jsFrame.onload = function () {
	          postJSFrame();
	        };
	        document.body.appendChild(jsFrame);
	      } else {
	        postJSFrame();
	      }
	    }
	  }
	
	  function edit() {
	
	    var html;
	    if (isHTML) {
	      html = normalizeHtml(code);
	    } else {
	      var codeIndented = code.replace(/^/gim, "    ");
	      html = "<!DOCTYPE html>\n<html>\n\n<body>\n  <script>\n" + codeIndented + "\n  </script>\n</body>\n\n</html>";
	    }
	
	    var form = document.createElement("form");
	    form.action = "http://plnkr.co/edit/?p=preview";
	    form.method = "POST";
	    form.target = "_blank";
	
	    document.body.appendChild(form);
	
	    var textarea = document.createElement("textarea");
	    textarea.name = "files[index.html]";
	    textarea.value = html;
	    form.appendChild(textarea);
	
	    var input = document.createElement("input");
	    input.name = "description";
	    input.value = "Fork from " + window.location;
	    form.appendChild(input);
	
	    form.submit();
	    form.remove();
	  }
	
	  function normalizeHtml() {
	    var codeLc = code.toLowerCase();
	    var hasBodyStart = codeLc.match("<body>");
	    var hasBodyEnd = codeLc.match("</body>");
	    var hasHtmlStart = codeLc.match("<html>");
	    var hasHtmlEnd = codeLc.match("</html>");
	
	    var hasDocType = codeLc.match(/^\s*<!doctype/);
	
	    if (hasDocType) {
	      return code;
	    }
	
	    var result = code;
	
	    if (!hasHtmlStart) {
	      result = "<html>\n" + result;
	    }
	
	    if (!hasHtmlEnd) {
	      result = result + "\n</html>";
	    }
	
	    if (!hasBodyStart) {
	      result = result.replace("<html>", "<html>\n<head>\n  <meta charset=\"utf-8\">\n</head><body>\n");
	    }
	
	    if (!hasBodyEnd) {
	      result = result.replace("</html>", "\n</body>\n</html>");
	    }
	
	    result = "<!DOCTYPE HTML>\n" + result;
	
	    return result;
	  }
	
	  function run() {
	    if (isJS) {
	      runJS();
	    } else {
	      runHTML();
	    }
	    isFirstRun = false;
	  }
	}
	
	function addBlockHighlight(pre, lines) {
	
	  if (!lines) {
	    return;
	  }
	
	  var ranges = lines.replace(/\s+/g, "").split(",");
	
	  /*jshint -W084 */
	  for (var i = 0, range; range = ranges[i++];) {
	    range = range.split("-");
	
	    var start = +range[0],
	        end = +range[1] || start;
	
	    var mask = "<code class=\"block-highlight\" data-start=\"" + start + "\" data-end=\"" + end + "\">" + new Array(start + 1).join("\n") + "<code class=\"mask\">" + new Array(end - start + 2).join("\n") + "</code></code>";
	
	    pre.insertAdjacentHTML("afterBegin", mask);
	  }
	}
	
	function addInlineHighlight(pre, ranges) {
	
	  // select code with the language text, not block-highlighter
	  var codeElem = pre.querySelector("code[class*=\"language-\"]");
	
	  ranges = ranges ? ranges.split(",") : [];
	
	  for (var i = 0; i < ranges.length; i++) {
	    var piece = ranges[i].split(":");
	    var lineNum = +piece[0],
	        strRange = piece[1].split("-");
	    var start = +strRange[0],
	        end = +strRange[1];
	    var mask = "<code class=\"inline-highlight\">" + new Array(lineNum + 1).join("\n") + new Array(start + 1).join(" ") + "<code class=\"mask\">" + new Array(end - start + 1).join(" ") + "</code></code>";
	
	    codeElem.insertAdjacentHTML("afterBegin", mask);
	  }
	}
	
	module.exports = CodeBox;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var delegate = __webpack_require__(24);
	var addLineNumbers = __webpack_require__(71);
	
	function CodeTabsBox(elem) {
	  if (window.isEbook) {
	    return;
	  }
	
	  this.elem = elem;
	  this.translateX = 0;
	
	  this.switchesElem = elem.querySelector("[data-code-tabs-switches]");
	  this.switchesElemItems = this.switchesElem.firstElementChild;
	  this.arrowLeft = elem.querySelector("[data-code-tabs-left]");
	  this.arrowRight = elem.querySelector("[data-code-tabs-right]");
	
	  this.arrowLeft.onclick = (function (e) {
	    e.preventDefault();
	
	    this.translateX = Math.max(0, this.translateX - this.switchesElem.offsetWidth);
	    this.renderTranslate();
	  }).bind(this);
	
	  this.arrowRight.onclick = (function (e) {
	    e.preventDefault();
	
	    this.translateX = Math.min(this.translateX + this.switchesElem.offsetWidth, this.switchesElemItems.offsetWidth - this.switchesElem.offsetWidth);
	    this.renderTranslate();
	  }).bind(this);
	
	  this.delegate(".code-tabs__switch", "click", this.onSwitchClick);
	}
	
	CodeTabsBox.prototype.onSwitchClick = function (e) {
	  e.preventDefault();
	
	  var siblings = e.delegateTarget.parentNode.children;
	  var tabs = this.elem.querySelector("[data-code-tabs-content]").children;
	
	  var selectedIndex;
	  for (var i = 0; i < siblings.length; i++) {
	    var switchElem = siblings[i];
	    var tabElem = tabs[i];
	    if (switchElem == e.delegateTarget) {
	      selectedIndex = i;
	      tabElem.classList.add("code-tabs__section_current");
	      switchElem.classList.add("code-tabs__switch_current");
	    } else {
	      tabElem.classList.remove("code-tabs__section_current");
	      switchElem.classList.remove("code-tabs__switch_current");
	    }
	  }
	
	  if (selectedIndex === 0) {
	    this.elem.classList.add("code-tabs_result_on");
	  } else {
	    this.elem.classList.remove("code-tabs_result_on");
	
	    this.highlightTab(tabs[selectedIndex]);
	  }
	};
	
	CodeTabsBox.prototype.highlightTab = function (tab) {
	  if (tab.highlighted) return;
	  var preElem = tab.querySelector("pre");
	  var codeElem = preElem.querySelector("code");
	  Prism.highlightElement(codeElem);
	  addLineNumbers(preElem);
	  tab.highlighted = true;
	};
	
	CodeTabsBox.prototype.renderTranslate = function () {
	  this.switchesElemItems.style.transform = "translateX(-" + this.translateX + "px)";
	  if (this.translateX === 0) {
	    this.arrowLeft.setAttribute("disabled", "");
	  } else {
	    this.arrowLeft.removeAttribute("disabled");
	  }
	
	  if (this.translateX === this.switchesElemItems.offsetWidth - this.switchesElem.offsetWidth) {
	    this.arrowRight.setAttribute("disabled", "");
	  } else {
	    this.arrowRight.removeAttribute("disabled");
	  }
	};
	
	delegate.delegateMixin(CodeTabsBox.prototype);
	
	module.exports = CodeTabsBox;

/***/ },
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	self = (typeof window !== 'undefined')
		? window   // if in browser
		: (
			(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
			? self // if in worker
			: {}   // if in node js
		);
	
	/**
	 * Prism: Lightweight, robust, elegant syntax highlighting
	 * MIT license http://www.opensource.org/licenses/mit-license.php/
	 * @author Lea Verou http://lea.verou.me
	 */
	
	var Prism = (function(){
	
	// Private helper vars
	var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;
	
	var _ = self.Prism = {
		util: {
			encode: function (tokens) {
				if (tokens instanceof Token) {
					return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
				} else if (_.util.type(tokens) === 'Array') {
					return tokens.map(_.util.encode);
				} else {
					return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
				}
			},
	
			type: function (o) {
				return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
			},
	
			// Deep clone a language definition (e.g. to extend it)
			clone: function (o) {
				var type = _.util.type(o);
	
				switch (type) {
					case 'Object':
						var clone = {};
	
						for (var key in o) {
							if (o.hasOwnProperty(key)) {
								clone[key] = _.util.clone(o[key]);
							}
						}
	
						return clone;
	
					case 'Array':
						return o.slice();
				}
	
				return o;
			}
		},
	
		languages: {
			extend: function (id, redef) {
				var lang = _.util.clone(_.languages[id]);
	
				for (var key in redef) {
					lang[key] = redef[key];
				}
	
				return lang;
			},
	
			/**
			 * Insert a token before another token in a language literal
			 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
			 * we cannot just provide an object, we need anobject and a key.
			 * @param inside The key (or language id) of the parent
			 * @param before The key to insert before. If not provided, the function appends instead.
			 * @param insert Object with the key/value pairs to insert
			 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
			 */
			insertBefore: function (inside, before, insert, root) {
				root = root || _.languages;
				var grammar = root[inside];
				
				if (arguments.length == 2) {
					insert = arguments[1];
					
					for (var newToken in insert) {
						if (insert.hasOwnProperty(newToken)) {
							grammar[newToken] = insert[newToken];
						}
					}
					
					return grammar;
				}
				
				var ret = {};
	
				for (var token in grammar) {
	
					if (grammar.hasOwnProperty(token)) {
	
						if (token == before) {
	
							for (var newToken in insert) {
	
								if (insert.hasOwnProperty(newToken)) {
									ret[newToken] = insert[newToken];
								}
							}
						}
	
						ret[token] = grammar[token];
					}
				}
				
				// Update references in other language definitions
				_.languages.DFS(_.languages, function(key, value) {
					if (value === root[inside] && key != inside) {
						this[key] = ret;
					}
				});
	
				return root[inside] = ret;
			},
	
			// Traverse a language definition with Depth First Search
			DFS: function(o, callback, type) {
				for (var i in o) {
					if (o.hasOwnProperty(i)) {
						callback.call(o, i, o[i], type || i);
	
						if (_.util.type(o[i]) === 'Object') {
							_.languages.DFS(o[i], callback);
						}
						else if (_.util.type(o[i]) === 'Array') {
							_.languages.DFS(o[i], callback, i);
						}
					}
				}
			}
		},
	
		highlightAll: function(async, callback) {
			var elements = document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code');
	
			for (var i=0, element; element = elements[i++];) {
				_.highlightElement(element, async === true, callback);
			}
		},
	
		highlightElement: function(element, async, callback) {
			// Find language
			var language, grammar, parent = element;
	
			while (parent && !lang.test(parent.className)) {
				parent = parent.parentNode;
			}
	
			if (parent) {
				language = (parent.className.match(lang) || [,''])[1];
				grammar = _.languages[language];
			}
	
			if (!grammar) {
				return;
			}
	
			// Set language on the element, if not present
			element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
	
			// Set language on the parent, for styling
			parent = element.parentNode;
	
			if (/pre/i.test(parent.nodeName)) {
				parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
			}
	
			var code = element.textContent;
	
			if(!code) {
				return;
			}
	
			var env = {
				element: element,
				language: language,
				grammar: grammar,
				code: code
			};
	
			_.hooks.run('before-highlight', env);
	
			if (async && self.Worker) {
				var worker = new Worker(_.filename);
	
				worker.onmessage = function(evt) {
					env.highlightedCode = Token.stringify(JSON.parse(evt.data), language);
	
					_.hooks.run('before-insert', env);
	
					env.element.innerHTML = env.highlightedCode;
	
					callback && callback.call(env.element);
					_.hooks.run('after-highlight', env);
				};
	
				worker.postMessage(JSON.stringify({
					language: env.language,
					code: env.code
				}));
			}
			else {
				env.highlightedCode = _.highlight(env.code, env.grammar, env.language)
	
				_.hooks.run('before-insert', env);
	
				env.element.innerHTML = env.highlightedCode;
	
				callback && callback.call(element);
	
				_.hooks.run('after-highlight', env);
			}
		},
	
		highlight: function (text, grammar, language) {
			var tokens = _.tokenize(text, grammar);
			return Token.stringify(_.util.encode(tokens), language);
		},
	
		tokenize: function(text, grammar, language) {
			var Token = _.Token;
	
			var strarr = [text];
	
			var rest = grammar.rest;
	
			if (rest) {
				for (var token in rest) {
					grammar[token] = rest[token];
				}
	
				delete grammar.rest;
			}
	
			tokenloop: for (var token in grammar) {
				if(!grammar.hasOwnProperty(token) || !grammar[token]) {
					continue;
				}
	
				var patterns = grammar[token];
				patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];
	
				for (var j = 0; j < patterns.length; ++j) {
					var pattern = patterns[j],
						inside = pattern.inside,
						lookbehind = !!pattern.lookbehind,
						lookbehindLength = 0,
						alias = pattern.alias;
	
					pattern = pattern.pattern || pattern;
	
					for (var i=0; i<strarr.length; i++) { // Don’t cache length as it changes during the loop
	
						var str = strarr[i];
	
						if (strarr.length > text.length) {
							// Something went terribly wrong, ABORT, ABORT!
							break tokenloop;
						}
	
						if (str instanceof Token) {
							continue;
						}
	
						pattern.lastIndex = 0;
	
						var match = pattern.exec(str);
	
						if (match) {
							if(lookbehind) {
								lookbehindLength = match[1].length;
							}
	
							var from = match.index - 1 + lookbehindLength,
								match = match[0].slice(lookbehindLength),
								len = match.length,
								to = from + len,
								before = str.slice(0, from + 1),
								after = str.slice(to + 1);
	
							var args = [i, 1];
	
							if (before) {
								args.push(before);
							}
	
							var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias);
	
							args.push(wrapped);
	
							if (after) {
								args.push(after);
							}
	
							Array.prototype.splice.apply(strarr, args);
						}
					}
				}
			}
	
			return strarr;
		},
	
		hooks: {
			all: {},
	
			add: function (name, callback) {
				var hooks = _.hooks.all;
	
				hooks[name] = hooks[name] || [];
	
				hooks[name].push(callback);
			},
	
			run: function (name, env) {
				var callbacks = _.hooks.all[name];
	
				if (!callbacks || !callbacks.length) {
					return;
				}
	
				for (var i=0, callback; callback = callbacks[i++];) {
					callback(env);
				}
			}
		}
	};
	
	var Token = _.Token = function(type, content, alias) {
		this.type = type;
		this.content = content;
		this.alias = alias;
	};
	
	Token.stringify = function(o, language, parent) {
		if (typeof o == 'string') {
			return o;
		}
	
		if (Object.prototype.toString.call(o) == '[object Array]') {
			return o.map(function(element) {
				return Token.stringify(element, language, o);
			}).join('');
		}
	
		var env = {
			type: o.type,
			content: Token.stringify(o.content, language, parent),
			tag: Prism.tokenTag || 'span',
			classes: ['token', o.type],
			attributes: {},
			language: language,
			parent: parent
		};
	
		if (env.type == 'comment') {
			env.attributes['spellcheck'] = 'true';
		}
	
		if (o.alias) {
			var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
			Array.prototype.push.apply(env.classes, aliases);
		}
	
		_.hooks.run('wrap', env);
	
		var attributes = '';
	
		for (var name in env.attributes) {
			attributes += name + '="' + (env.attributes[name] || '') + '"';
		}
	
		return '<' + env.tag + ' class="' + env.classes.join(' ') + '" ' + attributes + '>' + env.content + '</' + env.tag + '>';
	
	};
	
	if (!self.document) {
		if (!self.addEventListener) {
			// in Node.js
			return self.Prism;
		}
	 	// In worker
		self.addEventListener('message', function(evt) {
			var message = JSON.parse(evt.data),
			    lang = message.language,
			    code = message.code;
	
			self.postMessage(JSON.stringify(_.util.encode(_.tokenize(code, _.languages[lang]))));
			self.close();
		}, false);
	
		return self.Prism;
	}
	
	// Get current script and highlight
	var script = document.getElementsByTagName('script');
	
	script = script[script.length - 1];
	
	if (script) {
		_.filename = script.src;
	
		if (document.addEventListener && !script.hasAttribute('data-manual')) {
			document.addEventListener('DOMContentLoaded', _.highlightAll);
		}
	}
	
	return self.Prism;
	
	})();
	
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = Prism;
	}


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	Prism.languages.markup = {
		'comment': /<!--[\w\W]*?-->/g,
		'prolog': /<\?.+?\?>/,
		'doctype': /<!DOCTYPE.+?>/,
		'cdata': /<!\[CDATA\[[\w\W]*?]]>/i,
		'tag': {
			pattern: /<\/?[\w:-]+\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+))?\s*)*\/?>/gi,
			inside: {
				'tag': {
					pattern: /^<\/?[\w:-]+/i,
					inside: {
						'punctuation': /^<\/?/,
						'namespace': /^[\w-]+?:/
					}
				},
				'attr-value': {
					pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/gi,
					inside: {
						'punctuation': /=|>|"/g
					}
				},
				'punctuation': /\/?>/g,
				'attr-name': {
					pattern: /[\w:-]+/g,
					inside: {
						'namespace': /^[\w-]+?:/
					}
				}
	
			}
		},
		'entity': /\&#?[\da-z]{1,8};/gi
	};
	
	// Plugin to make entity title show the real entity, idea by Roman Komarov
	Prism.hooks.add('wrap', function(env) {
	
		if (env.type === 'entity') {
			env.attributes['title'] = env.content.replace(/&amp;/, '&');
		}
	});


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	Prism.languages.css = {
		'comment': /\/\*[\w\W]*?\*\//g,
		'atrule': {
			pattern: /@[\w-]+?.*?(;|(?=\s*{))/gi,
			inside: {
				'punctuation': /[;:]/g
			}
		},
		'url': /url\((["']?).*?\1\)/gi,
		'selector': /[^\{\}\s][^\{\};]*(?=\s*\{)/g,
		'property': /(\b|\B)[\w-]+(?=\s*:)/ig,
		'string': /("|')(\\?.)*?\1/g,
		'important': /\B!important\b/gi,
		'punctuation': /[\{\};:]/g,
		'function': /[-a-z0-9]+(?=\()/ig
	};
	
	if (Prism.languages.markup) {
		Prism.languages.insertBefore('markup', 'tag', {
			'style': {
				pattern: /<style[\w\W]*?>[\w\W]*?<\/style>/ig,
				inside: {
					'tag': {
						pattern: /<style[\w\W]*?>|<\/style>/ig,
						inside: Prism.languages.markup.tag.inside
					},
					rest: Prism.languages.css
				},
				alias: 'language-css'
			}
		});
		
		Prism.languages.insertBefore('inside', 'attr-value', {
			'style-attr': {
				pattern: /\s*style=("|').+?\1/ig,
				inside: {
					'attr-name': {
						pattern: /^\s*style/ig,
						inside: Prism.languages.markup.tag.inside
					},
					'punctuation': /^\s*=\s*['"]|['"]\s*$/,
					'attr-value': {
						pattern: /.+/gi,
						inside: Prism.languages.css
					}
				},
				alias: 'language-css'
			}
		}, Prism.languages.markup.tag);
	}

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	Prism.languages.css.selector = {
		pattern: /[^\{\}\s][^\{\}]*(?=\s*\{)/g,
		inside: {
			'pseudo-element': /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/g,
			'pseudo-class': /:[-\w]+(?:\(.*\))?/g,
			'class': /\.[-:\.\w]+/g,
			'id': /#[-:\.\w]+/g
		}
	};
	
	Prism.languages.insertBefore('css', 'function', {
		'hexcode': /#[\da-f]{3,6}/gi,
		'entity': /\\[\da-f]{1,8}/gi,
		'number': /[\d%\.]+/g
	});

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	Prism.languages.clike = {
		'comment': [
			{
				pattern: /(^|[^\\])\/\*[\w\W]*?\*\//g,
				lookbehind: true
			},
			{
				pattern: /(^|[^\\:])\/\/.*?(\r?\n|$)/g,
				lookbehind: true
			}
		],
		'string': /("|')(\\?.)*?\1/g,
		'class-name': {
			pattern: /((?:(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/ig,
			lookbehind: true,
			inside: {
				punctuation: /(\.|\\)/
			}
		},
		'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/g,
		'boolean': /\b(true|false)\b/g,
		'function': {
			pattern: /[a-z0-9_]+\(/ig,
			inside: {
				punctuation: /\(/
			}
		},
		'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,
		'operator': /[-+]{1,2}|!|<=?|>=?|={1,3}|&{1,2}|\|?\||\?|\*|\/|\~|\^|\%/g,
		'ignore': /&(lt|gt|amp);/gi,
		'punctuation': /[{}[\];(),.:]/g
	};


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	Prism.languages.javascript = Prism.languages.extend('clike', {
		'keyword': /\b(break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|function|get|if|implements|import|in|instanceof|interface|let|new|null|package|private|protected|public|return|set|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/g,
		'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|-?Infinity)\b/g,
		'function': /(?!\d)[a-z0-9_$]+(?=\()/ig
	});
	
	Prism.languages.insertBefore('javascript', 'keyword', {
		'regex': {
			pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/g,
			lookbehind: true
		}
	});
	
	if (Prism.languages.markup) {
		Prism.languages.insertBefore('markup', 'tag', {
			'script': {
				pattern: /<script[\w\W]*?>[\w\W]*?<\/script>/ig,
				inside: {
					'tag': {
						pattern: /<script[\w\W]*?>|<\/script>/ig,
						inside: Prism.languages.markup.tag.inside
					},
					rest: Prism.languages.javascript
				},
				alias: 'language-javascript'
			}
		});
	}


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	(function(Prism) {
	
	// Ignore comments starting with { to privilege string interpolation highlighting
	var comment = /#(?!\{).+/g,
	    interpolation = {
	    	pattern: /#\{[^}]+\}/g,
	    	alias: 'variable'
	    };
	
	Prism.languages.coffeescript = Prism.languages.extend('javascript', {
		'comment': comment,
		'string': [
	
			// Strings are multiline
			/'(?:\\?[\s\S])*?'/g,
	
			{
				// Strings are multiline
				pattern: /"(?:\\?[\s\S])*?"/g,
				inside: {
					'interpolation': interpolation
				}
			}
		],
		'keyword': /\b(and|break|by|catch|class|continue|debugger|delete|do|each|else|extend|extends|false|finally|for|if|in|instanceof|is|isnt|let|loop|namespace|new|no|not|null|of|off|on|or|own|return|super|switch|then|this|throw|true|try|typeof|undefined|unless|until|when|while|window|with|yes|yield)\b/g,
		'class-member': {
			pattern: /@(?!\d)\w+/,
			alias: 'variable'
		}
	});
	
	Prism.languages.insertBefore('coffeescript', 'comment', {
		'multiline-comment': {
			pattern: /###[\s\S]+?###/g,
			alias: 'comment'
		},
	
		// Block regexp can contain comments and interpolation
		'block-regex': {
			pattern: /\/{3}[\s\S]*?\/{3}/,
			alias: 'regex',
			inside: {
				'comment': comment,
				'interpolation': interpolation
			}
		}
	});
	
	Prism.languages.insertBefore('coffeescript', 'string', {
		'inline-javascript': {
			pattern: /`(?:\\?[\s\S])*?`/g,
			inside: {
				'delimiter': {
					pattern: /^`|`$/g,
					alias: 'punctuation'
				},
				rest: Prism.languages.javascript
			}
		},
	
		// Block strings
		'multiline-string': [
			{
				pattern: /'''[\s\S]*?'''/,
				alias: 'string'
			},
			{
				pattern: /"""[\s\S]*?"""/,
				alias: 'string',
				inside: {
					interpolation: interpolation
				}
			}
		]
	
	});
	
	Prism.languages.insertBefore('coffeescript', 'keyword', {
		// Object property
		'property': /(?!\d)\w+(?=\s*:(?!:))/g
	});
	
	}(Prism));

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	Prism.languages.http = {
	    'request-line': {
	        pattern: /^(POST|GET|PUT|DELETE|OPTIONS|PATCH|TRACE|CONNECT)\b\shttps?:\/\/\S+\sHTTP\/[0-9.]+/g,
	        inside: {
	            // HTTP Verb
	            property: /^\b(POST|GET|PUT|DELETE|OPTIONS|PATCH|TRACE|CONNECT)\b/g,
	            // Path or query argument
	            'attr-name': /:\w+/g
	        }
	    },
	    'response-status': {
	        pattern: /^HTTP\/1.[01] [0-9]+.*/g,
	        inside: {
	            // Status, e.g. 200 OK
	            property: /[0-9]+[A-Z\s-]+$/ig
	        }
	    },
	    // HTTP header name
	    keyword: /^[\w-]+:(?=.+)/gm
	};
	
	// Create a mapping of Content-Type headers to language definitions
	var httpLanguages = {
	    'application/json': Prism.languages.javascript,
	    'application/xml': Prism.languages.markup,
	    'text/xml': Prism.languages.markup,
	    'text/html': Prism.languages.markup
	};
	
	// Insert each content type parser that has its associated language
	// currently loaded.
	for (var contentType in httpLanguages) {
	    if (httpLanguages[contentType]) {
	        var options = {};
	        options[contentType] = {
	            pattern: new RegExp('(content-type:\\s*' + contentType + '[\\w\\W]*?)\\n\\n[\\w\\W]*', 'gi'),
	            lookbehind: true,
	            inside: {
	                rest: httpLanguages[contentType]
	            }
	        };
	        Prism.languages.insertBefore('http', 'keyword', options);
	    }
	}


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	Prism.languages.scss = Prism.languages.extend('css', {
		'comment': {
			pattern: /(^|[^\\])(\/\*[\w\W]*?\*\/|\/\/.*?(\r?\n|$))/g,
			lookbehind: true
		},
		// aturle is just the @***, not the entire rule (to highlight var & stuffs)
		// + add ability to highlight number & unit for media queries
		'atrule': /@[\w-]+(?=\s+(\(|\{|;))/gi,
		// url, compassified
		'url': /([-a-z]+-)*url(?=\()/gi,
		// CSS selector regex is not appropriate for Sass
		// since there can be lot more things (var, @ directive, nesting..)
		// a selector must start at the end of a property or after a brace (end of other rules or nesting)
		// it can contain some caracters that aren't used for defining rules or end of selector, & (parent selector), or interpolated variable
		// the end of a selector is found when there is no rules in it ( {} or {\s}) or if there is a property (because an interpolated var
		// can "pass" as a selector- e.g: proper#{$erty})
		// this one was ard to do, so please be careful if you edit this one :)
		'selector': /([^@;\{\}\(\)]?([^@;\{\}\(\)]|&|\#\{\$[-_\w]+\})+)(?=\s*\{(\}|\s|[^\}]+(:|\{)[^\}]+))/gm
	});
	
	Prism.languages.insertBefore('scss', 'atrule', {
		'keyword': /@(if|else if|else|for|each|while|import|extend|debug|warn|mixin|include|function|return|content)|(?=@for\s+\$[-_\w]+\s)+from/i
	});
	
	Prism.languages.insertBefore('scss', 'property', {
		// var and interpolated vars
		'variable': /((\$[-_\w]+)|(#\{\$[-_\w]+\}))/i
	});
	
	Prism.languages.insertBefore('scss', 'function', {
		'placeholder': /%[-_\w]+/i,
		'statement': /\B!(default|optional)\b/gi,
		'boolean': /\b(true|false)\b/g,
		'null': /\b(null)\b/g,
		'operator': /\s+([-+]{1,2}|={1,2}|!=|\|?\||\?|\*|\/|\%)\s+/g
	});


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	Prism.languages.sql= { 
		'comment': {
			pattern: /(^|[^\\])(\/\*[\w\W]*?\*\/|((--)|(\/\/)|#).*?(\r?\n|$))/g,
			lookbehind: true
		},
		'string' : {
			pattern: /(^|[^@])("|')(\\?[\s\S])*?\2/g,
			lookbehind: true
		},
		'variable': /@[\w.$]+|@("|'|`)(\\?[\s\S])+?\1/g,
		'function': /\b(?:COUNT|SUM|AVG|MIN|MAX|FIRST|LAST|UCASE|LCASE|MID|LEN|ROUND|NOW|FORMAT)(?=\s*\()/ig, // Should we highlight user defined functions too?
		'keyword': /\b(?:ACTION|ADD|AFTER|ALGORITHM|ALTER|ANALYZE|APPLY|AS|ASC|AUTHORIZATION|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADE|CASCADED|CASE|CHAIN|CHAR VARYING|CHARACTER VARYING|CHECK|CHECKPOINT|CLOSE|CLUSTERED|COALESCE|COLUMN|COLUMNS|COMMENT|COMMIT|COMMITTED|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS|CONTAINSTABLE|CONTINUE|CONVERT|CREATE|CROSS|CURRENT|CURRENT_DATE|CURRENT_TIME|CURRENT_TIMESTAMP|CURRENT_USER|CURSOR|DATA|DATABASE|DATABASES|DATETIME|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE|DOUBLE PRECISION|DROP|DUMMY|DUMP|DUMPFILE|DUPLICATE KEY|ELSE|ENABLE|ENCLOSED BY|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPE|ESCAPED BY|EXCEPT|EXEC|EXECUTE|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR|FOR EACH ROW|FORCE|FOREIGN|FREETEXT|FREETEXTTABLE|FROM|FULL|FUNCTION|GEOMETRY|GEOMETRYCOLLECTION|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|IDENTITY|IDENTITY_INSERT|IDENTITYCOL|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTO|INVOKER|ISOLATION LEVEL|JOIN|KEY|KEYS|KILL|LANGUAGE SQL|LAST|LEFT|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONGBLOB|LONGTEXT|MATCH|MATCHED|MEDIUMBLOB|MEDIUMINT|MEDIUMTEXT|MERGE|MIDDLEINT|MODIFIES SQL DATA|MODIFY|MULTILINESTRING|MULTIPOINT|MULTIPOLYGON|NATIONAL|NATIONAL CHAR VARYING|NATIONAL CHARACTER|NATIONAL CHARACTER VARYING|NATIONAL VARCHAR|NATURAL|NCHAR|NCHAR VARCHAR|NEXT|NO|NO SQL|NOCHECK|NOCYCLE|NONCLUSTERED|NULLIF|NUMERIC|OF|OFF|OFFSETS|ON|OPEN|OPENDATASOURCE|OPENQUERY|OPENROWSET|OPTIMIZE|OPTION|OPTIONALLY|ORDER|OUT|OUTER|OUTFILE|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREV|PRIMARY|PRINT|PRIVILEGES|PROC|PROCEDURE|PUBLIC|PURGE|QUICK|RAISERROR|READ|READS SQL DATA|READTEXT|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEATABLE|REPLICATION|REQUIRE|RESTORE|RESTRICT|RETURN|RETURNS|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROWCOUNT|ROWGUIDCOL|ROWS?|RTREE|RULE|SAVE|SAVEPOINT|SCHEMA|SELECT|SERIAL|SERIALIZABLE|SESSION|SESSION_USER|SET|SETUSER|SHARE MODE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|START|STARTING BY|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLE|TABLES|TABLESPACE|TEMP(?:ORARY)?|TEMPTABLE|TERMINATED BY|TEXT|TEXTSIZE|THEN|TIMESTAMP|TINYBLOB|TINYINT|TINYTEXT|TO|TOP|TRAN|TRANSACTION|TRANSACTIONS|TRIGGER|TRUNCATE|TSEQUAL|TYPE|TYPES|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNPIVOT|UPDATE|UPDATETEXT|USAGE|USE|USER|USING|VALUE|VALUES|VARBINARY|VARCHAR|VARCHARACTER|VARYING|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH|WITH ROLLUP|WITHIN|WORK|WRITE|WRITETEXT)\b/gi,
		'boolean': /\b(?:TRUE|FALSE|NULL)\b/gi,
		'number': /\b-?(0x)?\d*\.?[\da-f]+\b/g,
		'operator': /\b(?:ALL|AND|ANY|BETWEEN|EXISTS|IN|LIKE|NOT|OR|IS|UNIQUE|CHARACTER SET|COLLATE|DIV|OFFSET|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b|[-+]{1}|!|[=<>]{1,2}|(&){1,2}|\|?\||\?|\*|\//gi,
		'punctuation': /[;[\]()`,.]/g
	};

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Original by Aaron Harun: http://aahacreative.com/2012/07/31/php-syntax-highlighting-prism/
	 * Modified by Miles Johnson: http://milesj.me
	 *
	 * Supports the following:
	 * 		- Extends clike syntax
	 * 		- Support for PHP 5.3+ (namespaces, traits, generators, etc)
	 * 		- Smarter constant and function matching
	 *
	 * Adds the following new token classes:
	 * 		constant, delimiter, variable, function, package
	 */
	
	Prism.languages.php = Prism.languages.extend('clike', {
		'keyword': /\b(and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|private|protected|parent|throw|null|echo|print|trait|namespace|final|yield|goto|instanceof|finally|try|catch)\b/ig,
		'constant': /\b[A-Z0-9_]{2,}\b/g,
		'comment': {
			pattern: /(^|[^\\])(\/\*[\w\W]*?\*\/|(^|[^:])(\/\/|#).*?(\r?\n|$))/g,
			lookbehind: true
		}
	});
	
	Prism.languages.insertBefore('php', 'keyword', {
		'delimiter': /(\?>|<\?php|<\?)/ig,
		'variable': /(\$\w+)\b/ig,
		'package': {
			pattern: /(\\|namespace\s+|use\s+)[\w\\]+/g,
			lookbehind: true,
			inside: {
				punctuation: /\\/
			}
		}
	});
	
	// Must be defined after the function pattern
	Prism.languages.insertBefore('php', 'operator', {
		'property': {
			pattern: /(->)[\w]+/g,
			lookbehind: true
		}
	});
	
	// Add HTML support of the markup language exists
	if (Prism.languages.markup) {
	
		// Tokenize all inline PHP blocks that are wrapped in <?php ?>
		// This allows for easy PHP + markup highlighting
		Prism.hooks.add('before-highlight', function(env) {
			if (env.language !== 'php') {
				return;
			}
	
			env.tokenStack = [];
	
			env.backupCode = env.code;
			env.code = env.code.replace(/(?:<\?php|<\?)[\w\W]*?(?:\?>)/ig, function(match) {
				env.tokenStack.push(match);
	
				return '{{{PHP' + env.tokenStack.length + '}}}';
			});
		});
	
		// Restore env.code for other plugins (e.g. line-numbers)
		Prism.hooks.add('before-insert', function(env) {
			if (env.language === 'php') {
				env.code = env.backupCode;
				delete env.backupCode;
			}
		});
	
		// Re-insert the tokens after highlighting
		Prism.hooks.add('after-highlight', function(env) {
			if (env.language !== 'php') {
				return;
			}
	
			for (var i = 0, t; t = env.tokenStack[i]; i++) {
				env.highlightedCode = env.highlightedCode.replace('{{{PHP' + (i + 1) + '}}}', Prism.highlight(t, env.grammar, 'php'));
			}
	
			env.element.innerHTML = env.highlightedCode;
		});
	
		// Wrap tokens in classes that are missing them
		Prism.hooks.add('wrap', function(env) {
			if (env.language === 'php' && env.type === 'markup') {
				env.content = env.content.replace(/(\{\{\{PHP[0-9]+\}\}\})/g, "<span class=\"token php\">$1</span>");
			}
		});
	
		// Add the rules before all others
		Prism.languages.insertBefore('php', 'comment', {
			'markup': {
				pattern: /<[^?]\/?(.*?)>/g,
				inside: Prism.languages.markup
			},
			'php': /\{\{\{PHP[0-9]+\}\}\}/g
		});
	}


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	Prism.languages.insertBefore('php', 'variable', {
		'this': /\$this/g,
		'global': /\$_?(GLOBALS|SERVER|GET|POST|FILES|REQUEST|SESSION|ENV|COOKIE|HTTP_RAW_POST_DATA|argc|argv|php_errormsg|http_response_header)/g,
		'scope': {
			pattern: /\b[\w\\]+::/g,
			inside: {
				keyword: /(static|self|parent)/,
				punctuation: /(::|\\)/
			}
		}
	});

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	Prism.languages.python= { 
		'comment': {
			pattern: /(^|[^\\])#.*?(\r?\n|$)/g,
			lookbehind: true
		},
		'string': /"""[\s\S]+?"""|'''[\s\S]+?'''|("|')(\\?.)*?\1/g,
		'keyword' : /\b(as|assert|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|pass|print|raise|return|try|while|with|yield)\b/g,
		'boolean' : /\b(True|False)\b/g,
		'number' : /\b-?(0[box])?(?:[\da-f]+\.?\d*|\.\d+)(?:e[+-]?\d+)?j?\b/gi,
		'operator' : /[-+]{1,2}|=?&lt;|=?&gt;|!|={1,2}|(&){1,2}|(&amp;){1,2}|\|?\||\?|\*|\/|~|\^|%|\b(or|and|not)\b/g,
		'ignore' : /&(lt|gt|amp);/gi,
		'punctuation' : /[{}[\];(),.:]/g
	};
	


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Original by Samuel Flores
	 *
	 * Adds the following new token classes:
	 * 		constant, builtin, variable, symbol, regex
	 */
	Prism.languages.ruby = Prism.languages.extend('clike', {
		'comment': /#[^\r\n]*(\r?\n|$)/g,
		'keyword': /\b(alias|and|BEGIN|begin|break|case|class|def|define_method|defined|do|each|else|elsif|END|end|ensure|false|for|if|in|module|new|next|nil|not|or|raise|redo|require|rescue|retry|return|self|super|then|throw|true|undef|unless|until|when|while|yield)\b/g,
		'builtin': /\b(Array|Bignum|Binding|Class|Continuation|Dir|Exception|FalseClass|File|Stat|File|Fixnum|Fload|Hash|Integer|IO|MatchData|Method|Module|NilClass|Numeric|Object|Proc|Range|Regexp|String|Struct|TMS|Symbol|ThreadGroup|Thread|Time|TrueClass)\b/,
		'constant': /\b[A-Z][a-zA-Z_0-9]*[?!]?\b/g
	});
	
	Prism.languages.insertBefore('ruby', 'keyword', {
		'regex': {
			pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/g,
			lookbehind: true
		},
		'variable': /[@$]+\b[a-zA-Z_][a-zA-Z_0-9]*[?!]?\b/g,
		'symbol': /:\b[a-zA-Z_][a-zA-Z_0-9]*[?!]?\b/g
	});


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	Prism.languages.java = Prism.languages.extend('clike', {
		'keyword': /\b(abstract|continue|for|new|switch|assert|default|goto|package|synchronized|boolean|do|if|private|this|break|double|implements|protected|throw|byte|else|import|public|throws|case|enum|instanceof|return|transient|catch|extends|int|short|try|char|final|interface|static|void|class|finally|long|strictfp|volatile|const|float|native|super|while)\b/g,
		'number': /\b0b[01]+\b|\b0x[\da-f]*\.?[\da-fp\-]+\b|\b\d*\.?\d+[e]?[\d]*[df]\b|\b\d*\.?\d+\b/gi,
		'operator': {
			pattern: /(^|[^\.])(?:\+=|\+\+?|-=|--?|!=?|<{1,2}=?|>{1,3}=?|==?|&=|&&?|\|=|\|\|?|\?|\*=?|\/=?|%=?|\^=?|:|~)/gm,
			lookbehind: true
		}
	});

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	function addLineNumbers(pre) {
	
	  var linesNum = 1 + pre.innerHTML.split("\n").length;
	  var lineNumbersWrapper;
	
	  var lines = new Array(linesNum);
	  lines = lines.join("<span></span>");
	
	  lineNumbersWrapper = document.createElement("span");
	  lineNumbersWrapper.className = "line-numbers-rows";
	  lineNumbersWrapper.innerHTML = lines;
	
	  if (pre.hasAttribute("data-start")) {
	    pre.style.counterReset = "linenumber " + Number(pre.dataset.start) - 1;
	  }
	
	  pre.appendChild(lineNumbersWrapper);
	}
	
	module.exports = addLineNumbers;

/***/ },
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	function isScrolledIntoView(elem) {
	  var coords = elem.getBoundingClientRect();
	
	  var visibleHeight = 0;
	
	  if (coords.top < 0) {
	    visibleHeight = coords.bottom;
	  } else if (coords.bottom > window.innerHeight) {
	    visibleHeight = window.innerHeight - top;
	  } else {
	    return true;
	  }
	
	  return visibleHeight > 10;
	}
	
	module.exports = isScrolledIntoView;

/***/ }
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9oYW5kbGVycy90dXRvcmlhbC9jbGllbnQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3RyYWNrU3RpY2t5LmpzPzgxYjkiLCJ3ZWJwYWNrOi8vLy4vaGFuZGxlcnMvdHV0b3JpYWwvY2xpZW50L3R1dG9yaWFsTWFwTW9kYWwuanMiLCJ3ZWJwYWNrOi8vLy4vaGFuZGxlcnMvdHV0b3JpYWwvY2xpZW50L3R1dG9yaWFsTWFwLmpzIiwid2VicGFjazovLy8uL2NsaWVudC94aHIuanM/Njg1MioiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ByaXNtL2luZGV4LmpzIiwid2VicGFjazovLy8uL2NsaWVudC9nZXRDc3JmQ29va2llLmpzP2QxMmEqIiwid2VicGFjazovLy8uL2NsaWVudC9wcmlzbS9jb2RlQm94LmpzIiwid2VicGFjazovLy8uL2NsaWVudC9wcmlzbS9jb2RlVGFic0JveC5qcyIsIndlYnBhY2s6Ly8vLi9+L3ByaXNtanMvY29tcG9uZW50cy9wcmlzbS1jb3JlLmpzIiwid2VicGFjazovLy8uL34vcHJpc21qcy9jb21wb25lbnRzL3ByaXNtLW1hcmt1cC5qcyIsIndlYnBhY2s6Ly8vLi9+L3ByaXNtanMvY29tcG9uZW50cy9wcmlzbS1jc3MuanMiLCJ3ZWJwYWNrOi8vLy4vfi9wcmlzbWpzL2NvbXBvbmVudHMvcHJpc20tY3NzLWV4dHJhcy5qcyIsIndlYnBhY2s6Ly8vLi9+L3ByaXNtanMvY29tcG9uZW50cy9wcmlzbS1jbGlrZS5qcyIsIndlYnBhY2s6Ly8vLi9+L3ByaXNtanMvY29tcG9uZW50cy9wcmlzbS1qYXZhc2NyaXB0LmpzIiwid2VicGFjazovLy8uL34vcHJpc21qcy9jb21wb25lbnRzL3ByaXNtLWNvZmZlZXNjcmlwdC5qcyIsIndlYnBhY2s6Ly8vLi9+L3ByaXNtanMvY29tcG9uZW50cy9wcmlzbS1odHRwLmpzIiwid2VicGFjazovLy8uL34vcHJpc21qcy9jb21wb25lbnRzL3ByaXNtLXNjc3MuanMiLCJ3ZWJwYWNrOi8vLy4vfi9wcmlzbWpzL2NvbXBvbmVudHMvcHJpc20tc3FsLmpzIiwid2VicGFjazovLy8uL34vcHJpc21qcy9jb21wb25lbnRzL3ByaXNtLXBocC5qcyIsIndlYnBhY2s6Ly8vLi9+L3ByaXNtanMvY29tcG9uZW50cy9wcmlzbS1waHAtZXh0cmFzLmpzIiwid2VicGFjazovLy8uL34vcHJpc21qcy9jb21wb25lbnRzL3ByaXNtLXB5dGhvbi5qcyIsIndlYnBhY2s6Ly8vLi9+L3ByaXNtanMvY29tcG9uZW50cy9wcmlzbS1ydWJ5LmpzIiwid2VicGFjazovLy8uL34vcHJpc21qcy9jb21wb25lbnRzL3ByaXNtLWphdmEuanMiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L3ByaXNtL2FkZExpbmVOdW1iZXJzLmpzIiwid2VicGFjazovLy8uL2NsaWVudC9pc1Njcm9sbGVkSW50b1ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBLEtBQUksUUFBUSxHQUFHLG1CQUFPLENBQUMsRUFBaUIsQ0FBQyxDQUFDO0FBQzFDLEtBQUksS0FBSyxHQUFHLG1CQUFPLENBQUMsRUFBYyxDQUFDLENBQUM7QUFDcEMsS0FBSSxHQUFHLEdBQUcsbUJBQU8sQ0FBQyxFQUFZLENBQUMsQ0FBQztBQUNoQyxLQUFJLGdCQUFnQixHQUFHLG1CQUFPLENBQUMsRUFBb0IsQ0FBQyxDQUFDOztBQUVyRCxRQUFPLENBQUMsSUFBSSxHQUFHLFlBQVc7O0FBR3hCLGtCQUFlLEVBQUUsQ0FBQztBQUNsQixpQkFBYyxFQUFFLENBQUM7O0FBRWpCLHVCQUFvQixFQUFFLENBQUM7O0FBRXZCLFdBQVEsQ0FBQyxRQUFRLEVBQUUsZ0NBQThCLEVBQUUsT0FBTyxFQUFFLFVBQVMsS0FBSyxFQUFFO0FBQzFFLFNBQUksZ0JBQWdCLEVBQUUsQ0FBQztBQUN2QixVQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDeEIsQ0FBQyxDQUFDOztBQUVILFFBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFYixPQUFJ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O0FBQ2xCLGtCQUFhLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUMvQixNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFO0FBQzdDLGtCQUFhLEdBQUcsTUFBTSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7SUFDMUMsTUFBTTtBQUNMLFlBQU8sSUFBSSxDQUFDO0lBQ2I7O0FBRUQsVUFBTyxhQUFhLEdBQUcsRUFBRSxDQUFDO0VBQzNCOztBQUVELE9BQU0sQ0FBQyxPQUFPLEdBQUcsa0JBQWtCLEMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZGVsZWdhdGUgPSByZXF1aXJlKCdjbGllbnQvZGVsZWdhdGUnKTtcbnZhciBwcmlzbSA9IHJlcXVpcmUoJ2NsaWVudC9wcmlzbScpO1xudmFyIHhociA9IHJlcXVpcmUoJ2NsaWVudC94aHInKTtcbnZhciBUdXRvcmlhbE1hcE1vZGFsID0gcmVxdWlyZSgnLi90dXRvcmlhbE1hcE1vZGFsJyk7XG5cbmV4cG9ydHMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXG5cbiAgaW5pdFRhc2tCdXR0b25zKCk7XG4gIGluaXRGb2xkZXJMaXN0KCk7XG5cbiAgaW5pdFNpZGViYXJIaWdobGlnaHQoKTtcblxuICBkZWxlZ2F0ZShkb2N1bWVudCwgJ1tkYXRhLWFjdGlvbj1cInR1dG9yaWFsLW1hcFwiXScsICdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgbmV3IFR1dG9yaWFsTWFwTW9kYWwoKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9KTtcblxuICBwcmlzbS5pbml0KCk7XG5cbiAgaWYgKHdpbmRvdy5pc0Vib29rKSB7XG4gICAgcmVxdWlyZS5lbnN1cmUoJy4vZWJvb2snLCBmdW5jdGlvbigpIHtcbiAgICAgIHJlcXVpcmUoJy4vZWJvb2snKS5pbml0KCk7XG4gICAgfSwgJ2Vib29rJyk7XG4gIH1cbn07XG5cbmV4cG9ydHMuVHV0b3JpYWxNYXAgPSByZXF1aXJlKCcuL3R1dG9yaWFsTWFwJyk7XG5cbmZ1bmN0aW9uIGluaXRTaWRlYmFySGlnaGxpZ2h0KCkge1xuXG4gIGZ1bmN0aW9uIGhpZ2hsaWdodCgpIHtcblxuICAgIHZhciBjdXJyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2lkZWJhcl9fbmF2aWdhdGlvbi1saW5rX2FjdGl2ZScpO1xuICAgIGlmIChjdXJyZW50WzBdKSBjdXJyZW50WzBdLmNsYXNzTGlzdC5yZW1vdmUoJ3NpZGViYXJfX25hdmlnYXRpb24tbGlua19hY3RpdmUnKTtcblxuICAgIHZhciBoMnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaDInKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGgycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGgyID0gaDJzW2ldO1xuICAgICAgLy8gZmlyc3QgaW4tcGFnZSBoZWFkZXJcbiAgICAgIGlmIChoMi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgPiAwKSBicmVhaztcbiAgICB9XG4gICAgaS0tOyAvLyB3ZSBuZWVkIHRoZSBvbmUgYmVmb3JlIGl0IChjdXJyZW50bHkgcmVhZGluZylcblxuICAgIGlmIChpPj0wKSB7XG4gICAgICB2YXIgaHJlZiA9IGgyc1tpXS5maXJzdEVsZW1lbnRDaGlsZCAmJiBoMnNbaV0uZmlyc3RFbGVtZW50Q2hpbGQuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG4gICAgICB2YXIgbGkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2lkZWJhcl9fbmF2aWdhdGlvbi1saW5rIGFbaHJlZj1cIicgKyBocmVmICsgJ1wiXScpO1xuICAgICAgaWYgKGhyZWYgJiYgbGkpIHtcbiAgICAgICAgbGkuY2xhc3NMaXN0LmFkZCgnc2lkZWJhcl9fbmF2aWdhdGlvbi1saW5rX2FjdGl2ZScpO1xuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICAgIGhpZ2hsaWdodCgpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGhpZ2hsaWdodCk7XG4gIH0pO1xuXG5cbn1cblxuXG5mdW5jdGlvbiBpbml0VGFza0J1dHRvbnMoKSB7XG4gIC8vIHNvbHV0aW9uIGJ1dHRvblxuICBkZWxlZ2F0ZShkb2N1bWVudCwgJy50YXNrX19zb2x1dGlvbicsICdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy50YXNrJykuY2xhc3NMaXN0LnRvZ2dsZSgndGFza19fYW5zd2VyX29wZW4nKTtcbiAgfSk7XG5cbiAgLy8gY2xvc2Ugc29sdXRpb24gYnV0dG9uXG4gIGRlbGVnYXRlKGRvY3VtZW50LCAnLnRhc2tfX2Fuc3dlci1jbG9zZScsICdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy50YXNrJykuY2xhc3NMaXN0LnRvZ2dsZSgndGFza19fYW5zd2VyX29wZW4nKTtcbiAgfSk7XG5cbiAgLy8gZXZlcnkgc3RlcCBidXR0b24gKGlmIGFueSBzdGVwcylcbiAgZGVsZWdhdGUoZG9jdW1lbnQsICcudGFza19fc3RlcC1zaG93JywgJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBldmVudC50YXJnZXQuY2xvc2VzdCgnLnRhc2tfX3N0ZXAnKS5jbGFzc0xpc3QudG9nZ2xlKCd0YXNrX19zdGVwX29wZW4nKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGluaXRGb2xkZXJMaXN0KCkge1xuICBkZWxlZ2F0ZShkb2N1bWVudCwgJy5sZXNzb25zLWxpc3RfX2xlc3Nvbl9sZXZlbF8xID4gLmxlc3NvbnMtbGlzdF9fbGluaycsICdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIGxpbmsgPSBldmVudC5kZWxlZ2F0ZVRhcmdldDtcbiAgICB2YXIgb3BlbkZvbGRlciA9IGxpbmsuY2xvc2VzdCgnLmxlc3NvbnMtbGlzdCcpLnF1ZXJ5U2VsZWN0b3IoJy5sZXNzb25zLWxpc3RfX2xlc3Nvbl9vcGVuJyk7XG4gICAgLy8gY2xvc2UgdGhlIHByZXZpb3VzIG9wZW4gZm9sZGVyICh0aHVzIG1ha2luZyBhbiBhY2NvcmRpb24pXG4gICAgaWYgKG9wZW5Gb2xkZXIgJiYgb3BlbkZvbGRlciAhPSBsaW5rLnBhcmVudE5vZGUpIHtcbiAgICAgIG9wZW5Gb2xkZXIuY2xhc3NMaXN0LnJlbW92ZSgnbGVzc29ucy1saXN0X19sZXNzb25fb3BlbicpO1xuICAgIH1cbiAgICBsaW5rLnBhcmVudE5vZGUuY2xhc3NMaXN0LnRvZ2dsZSgnbGVzc29ucy1saXN0X19sZXNzb25fb3BlbicpO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH0pO1xufVxuXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2hhbmRsZXJzL3R1dG9yaWFsL2NsaWVudC9pbmRleC5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gdHJhY2tTdGlja3k7XG5cblxuZnVuY3Rpb24gdHJhY2tTdGlja3koKSB7XG5cbiAgdmFyIHN0aWNreUVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtc3RpY2t5XScpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RpY2t5RWxlbXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgc3RpY2t5RWxlbSA9IHN0aWNreUVsZW1zW2ldO1xuICAgIHZhciBjb250YWluZXIgPSBzdGlja3lFbGVtLmRhdGFzZXQuc3RpY2t5ID9cbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc3RpY2t5RWxlbS5kYXRhc2V0LnN0aWNreSkgOiBkb2N1bWVudC5ib2R5O1xuXG4gICAgaWYgKHN0aWNreUVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIDwgMCkge1xuICAgICAgLy8gYmVjb21lIGZpeGVkXG4gICAgICBpZiAoc3RpY2t5RWxlbS5zdHlsZS5jc3NUZXh0KSB7XG4gICAgICAgIC8vIGFscmVhZHkgZml4ZWRcbiAgICAgICAgLy8gaW5lcnRpYTogaGFwcGVucyB3aGVuIHNjcm9sbGVkIGZhc3QgdG9vIG11Y2ggdG8gYm90dG9tXG4gICAgICAgIC8vIGh0dHA6Ly9pbHlha2FudG9yLnJ1L3NjcmVlbi8yMDE1LTAyLTI0XzE1NTUuc3dmXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHNhdmVkTGVmdCA9IHN0aWNreUVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcbiAgICAgIHZhciBwbGFjZWhvbGRlciA9IGNyZWF0ZVBsYWNlaG9sZGVyKHN0aWNreUVsZW0pO1xuXG4gICAgICBzdGlja3lFbGVtLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHBsYWNlaG9sZGVyLCBzdGlja3lFbGVtKTtcblxuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHN0aWNreUVsZW0pO1xuICAgICAgc3RpY2t5RWxlbS5jbGFzc0xpc3QuYWRkKCdzdGlja3knKTtcbiAgICAgIHN0aWNreUVsZW0uc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnO1xuICAgICAgc3RpY2t5RWxlbS5zdHlsZS50b3AgPSAwO1xuICAgICAgc3RpY2t5RWxlbS5zdHlsZS5sZWZ0ID0gc2F2ZWRMZWZ0ICsgJ3B4JztcbiAgICAgIC8vIHpJbmRleCA8IDEwMDAsIGJlY2F1c2UgaXQgbXVzdCBiZSB1bmRlciBhbiBvdmVybGF5LFxuICAgICAgLy8gZS5nLiBzaXRlbWFwIG11c3Qgc2hvdyBvdmVyIHRoZSBwcm9ncmVzcyBiYXJcbiAgICAgIHN0aWNreUVsZW0uc3R5bGUuekluZGV4ID0gMTAxO1xuICAgICAgc3RpY2t5RWxlbS5zdHlsZS5iYWNrZ3JvdW5kID0gJ3doaXRlJzsgLy8gbm9uLXRyYW5zcGFyZW50IHRvIGNvdmVyIHRoZSB0ZXh0XG4gICAgICBzdGlja3lFbGVtLnN0eWxlLm1hcmdpbiA9IDA7XG4gICAgICBzdGlja3lFbGVtLnN0eWxlLndpZHRoID0gcGxhY2Vob2xkZXIub2Zmc2V0V2lkdGggKyAncHgnOyAvLyBrZWVwIHNhbWUgd2lkdGggYXMgYmVmb3JlXG4gICAgICBzdGlja3lFbGVtLnBsYWNlaG9sZGVyID0gcGxhY2Vob2xkZXI7XG4gICAgfSBlbHNlIGlmIChzdGlja3lFbGVtLnBsYWNlaG9sZGVyICYmIHN0aWNreUVsZW0ucGxhY2Vob2xkZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wID4gMCkge1xuICAgICAgLy8gYmVjb21lIG5vbi1maXhlZFxuICAgICAgc3RpY2t5RWxlbS5zdHlsZS5jc3NUZXh0ID0gJyc7XG4gICAgICBzdGlja3lFbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3N0aWNreScpO1xuICAgICAgc3RpY2t5RWxlbS5wbGFjZWhvbGRlci5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzdGlja3lFbGVtLCBzdGlja3lFbGVtLnBsYWNlaG9sZGVyKTtcbiAgICAgIHN0aWNreUVsZW0ucGxhY2Vob2xkZXIucmVtb3ZlKCk7XG5cbiAgICAgIHN0aWNreUVsZW0ucGxhY2Vob2xkZXIgPSBudWxsO1xuICAgIH1cbiAgfVxuXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHBsYWNlaG9sZGVyIHcvIHNhbWUgc2l6ZSAmIG1hcmdpblxuICogQHBhcmFtIGVsZW1cbiAqIEByZXR1cm5zIHsqfCFIVE1MRWxlbWVudH1cbiAqL1xuZnVuY3Rpb24gY3JlYXRlUGxhY2Vob2xkZXIoZWxlbSkge1xuICB2YXIgcGxhY2Vob2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdmFyIHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtKTtcbiAgcGxhY2Vob2xkZXIuc3R5bGUud2lkdGggPSBlbGVtLm9mZnNldFdpZHRoICsgJ3B4JztcbiAgcGxhY2Vob2xkZXIuc3R5bGUubWFyZ2luTGVmdCA9IHN0eWxlLm1hcmdpbkxlZnQ7XG4gIHBsYWNlaG9sZGVyLnN0eWxlLm1hcmdpblJpZ2h0ID0gc3R5bGUubWFyZ2luUmlnaHQ7XG4gIHBsYWNlaG9sZGVyLnN0eWxlLmhlaWdodCA9IGVsZW0ub2Zmc2V0SGVpZ2h0ICsgJ3B4JztcbiAgcGxhY2Vob2xkZXIuc3R5bGUubWFyZ2luQm90dG9tID0gc3R5bGUubWFyZ2luQm90dG9tO1xuICBwbGFjZWhvbGRlci5zdHlsZS5tYXJnaW5Ub3AgPSBzdHlsZS5tYXJnaW5Ub3A7XG4gIHJldHVybiBwbGFjZWhvbGRlcjtcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2NsaWVudC90cmFja1N0aWNreS5qc1xuICoqLyIsInZhciB4aHIgPSByZXF1aXJlKCdjbGllbnQveGhyJyk7XG5cbnZhciBkZWxlZ2F0ZSA9IHJlcXVpcmUoJ2NsaWVudC9kZWxlZ2F0ZScpO1xudmFyIE1vZGFsID0gcmVxdWlyZSgnY2xpZW50L2hlYWQvbW9kYWwnKTtcbnZhciBTcGlubmVyID0gcmVxdWlyZSgnY2xpZW50L3NwaW5uZXInKTtcbnZhciBUdXRvcmlhbE1hcCA9IHJlcXVpcmUoJy4vdHV0b3JpYWxNYXAnKTtcbnZhciB0cmFja1N0aWNreSA9IHJlcXVpcmUoJ2NsaWVudC90cmFja1N0aWNreScpO1xuXG4vKipcbiAqIE9wdGlvbnM6XG4gKiAgIC0gY2FsbGJhY2s6IGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCBhZnRlciBzdWNjZXNzZnVsIGxvZ2luIChieSBkZWZhdWx0IC0gZ28gdG8gc3VjY2Vzc1JlZGlyZWN0KVxuICogICAtIG1lc3NhZ2U6IGZvcm0gbWVzc2FnZSB0byBiZSBzaG93biB3aGVuIHRoZSBsb2dpbiBmb3JtIGFwcGVhcnMgKFwiTG9nIGluIHRvIGxlYXZlIHRoZSBjb21tZW50XCIpXG4gKiAgIC0gc3VjY2Vzc1JlZGlyZWN0OiB0aGUgcGFnZSB0byByZWRpcmVjdCAoY3VycmVudCBwYWdlIGJ5IGRlZmF1bHQpXG4gKiAgICAgICAtIGFmdGVyIGltbWVkaWF0ZSBsb2dpblxuICogICAgICAgLSBhZnRlciByZWdpc3RyYXRpb24gZm9yIFwiY29uZmlybSBlbWFpbFwiIGxpbmtcbiAqL1xuZnVuY3Rpb24gVHV0b3JpYWxNYXBNb2RhbCgpIHtcbiAgTW9kYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICB2YXIgc3Bpbm5lciA9IG5ldyBTcGlubmVyKCk7XG4gIHRoaXMuc2V0Q29udGVudChzcGlubmVyLmVsZW0pO1xuICBzcGlubmVyLnN0YXJ0KCk7XG5cbiAgdmFyIHJlcXVlc3QgPSB0aGlzLnJlcXVlc3Qoe1xuICAgIHVybDogJy90dXRvcmlhbC9tYXAnXG4gIH0pO1xuXG4gIHZhciBzZWxmID0gdGhpcztcblxuICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3N1Y2Nlc3MnLCBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgd3JhcHBlci5jbGFzc05hbWUgPSAndHV0b3JpYWwtbWFwLW92ZXJsYXknO1xuICAgIHdyYXBwZXIuaW5uZXJIVE1MID0gZXZlbnQucmVzdWx0ICsgJzxidXR0b24gY2xhc3M9XCJjbG9zZS1idXR0b24gdHV0b3JpYWwtbWFwLW92ZXJsYXlfX2Nsb3NlXCI+PC9idXR0b24+JztcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3R1dG9yaWFsLW1hcF9vbicpO1xuICAgIHNlbGYuc2V0Q29udGVudCh3cmFwcGVyKTtcblxuICAgIHdyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdHJhY2tTdGlja3kpO1xuXG4gICAgbmV3IFR1dG9yaWFsTWFwKHNlbGYuY29udGVudEVsZW0uZmlyc3RFbGVtZW50Q2hpbGQpO1xuICB9KTtcblxuICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZhaWwnLCBmdW5jdGlvbigpIHtcbiAgICBzZWxmLnJlbW92ZSgpO1xuICB9KTtcblxufVxuXG5UdXRvcmlhbE1hcE1vZGFsLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoTW9kYWwucHJvdG90eXBlKTtcblxuZGVsZWdhdGUuZGVsZWdhdGVNaXhpbihUdXRvcmlhbE1hcE1vZGFsLnByb3RvdHlwZSk7XG5cblR1dG9yaWFsTWFwTW9kYWwucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuICBNb2RhbC5wcm90b3R5cGUucmVtb3ZlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgndHV0b3JpYWwtbWFwX29uJyk7XG59O1xuXG5UdXRvcmlhbE1hcE1vZGFsLnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICB2YXIgcmVxdWVzdCA9IHhocihvcHRpb25zKTtcblxuICByZXR1cm4gcmVxdWVzdDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVHV0b3JpYWxNYXBNb2RhbDtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vaGFuZGxlcnMvdHV0b3JpYWwvY2xpZW50L3R1dG9yaWFsTWFwTW9kYWwuanNcbiAqKi8iLCJ2YXIgdGhyb3R0bGUgPSByZXF1aXJlKCdsaWIvdGhyb3R0bGUnKTtcbnZhciBkZWxlZ2F0ZSA9IHJlcXVpcmUoJ2NsaWVudC9kZWxlZ2F0ZScpO1xuXG5mdW5jdGlvbiBUdXRvcmlhbE1hcChlbGVtKSB7XG4gIHRoaXMuZWxlbSA9IGVsZW07XG5cbiAgdGhpcy5zaG93VGFza3NDaGVja2JveCA9IGVsZW0ucXVlcnlTZWxlY3RvcignW2RhdGEtdHV0b3JpYWwtbWFwLXNob3ctdGFza3NdJyk7XG4gIHRoaXMuc2hvd1Rhc2tzQ2hlY2tib3guY2hlY2tlZCA9ICtsb2NhbFN0b3JhZ2Uuc2hvd1Rhc2tzQ2hlY2tib3g7XG5cbiAgdGhpcy51cGRhdGVTaG93VGFza3MoKTtcblxuICB0aGlzLnNob3dUYXNrc0NoZWNrYm94Lm9uY2hhbmdlID0gdGhpcy51cGRhdGVTaG93VGFza3MuYmluZCh0aGlzKTtcblxuICB0aGlzLmZpbHRlcklucHV0ID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXR1dG9yaWFsLW1hcC1maWx0ZXJdJyk7XG4gIHRoaXMudGV4dElucHV0QmxvY2sgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignLnR1dG9yaWFsLW1hcF9fZmlsdGVyIC50ZXh0LWlucHV0Jyk7XG5cbiAgdGhpcy5sYXlvdXRTd2l0Y2ggPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignW2RhdGEtdHV0b3JpYWwtbWFwLWxheW91dC1zd2l0Y2hdJyk7XG4gIHZhciBpc01hcFNpbmdsZUNvbHVtbiA9ICtsb2NhbFN0b3JhZ2UuaXNNYXBTaW5nbGVDb2x1bW47XG4gIHRoaXMubGF5b3V0U3dpdGNoLnF1ZXJ5U2VsZWN0b3IoJ1t2YWx1ZT1cIjBcIl0nKS5jaGVja2VkID0gIWlzTWFwU2luZ2xlQ29sdW1uO1xuICB0aGlzLmxheW91dFN3aXRjaC5xdWVyeVNlbGVjdG9yKCdbdmFsdWU9XCIxXCJdJykuY2hlY2tlZCA9IGlzTWFwU2luZ2xlQ29sdW1uO1xuICB0aGlzLnVwZGF0ZUxheW91dCgpO1xuICB0aGlzLmxheW91dFN3aXRjaC5vbmNoYW5nZSA9IHRoaXMub25MYXlvdXRTd2l0Y2hDaGFuZ2UuYmluZCh0aGlzKTtcblxuICB0aGlzLmZpbHRlcklucHV0Lm9uaW5wdXQgPSB0aGlzLm9uRmlsdGVySW5wdXQuYmluZCh0aGlzKTtcbiAgdGhpcy5maWx0ZXJJbnB1dC5vbmtleWRvd24gPSB0aGlzLm9uRmlsdGVyS2V5ZG93bi5iaW5kKHRoaXMpO1xuXG4gIHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCcuY2xvc2UtYnV0dG9uJykub25jbGljayA9ICgpID0+IHtcbiAgICB0aGlzLmZpbHRlcklucHV0LnZhbHVlID0gJyc7XG4gICAgdGhpcy5zaG93Q2xlYXJCdXR0b24oZmFsc2UpO1xuICAgIHRoaXMuZmlsdGVyKCcnKTtcbiAgfTtcblxuICB0aGlzLmNoYXB0ZXJzQ29sbGFwc2VkID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UudHV0b3JpYWxNYXBDaGFwdGVycyB8fCBcInt9XCIpO1xuICB0aGlzLnNob3dDaGFwdGVyc0NvbGxhcHNlZCgpO1xuXG4gIHRoaXMuZGVsZWdhdGUoJy50dXRvcmlhbC1tYXBfX2l0ZW0gPiAudHV0b3JpYWwtbWFwX19saW5rJywgJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBocmVmID0gZXZlbnQuZGVsZWdhdGVUYXJnZXQuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG4gICAgaWYgKHRoaXMuY2hhcHRlcnNDb2xsYXBzZWRbaHJlZl0pIHtcbiAgICAgIGRlbGV0ZSB0aGlzLmNoYXB0ZXJzQ29sbGFwc2VkW2hyZWZdO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNoYXB0ZXJzQ29sbGFwc2VkW2hyZWZdID0gMTtcbiAgICB9XG4gICAgbG9jYWxTdG9yYWdlLnR1dG9yaWFsTWFwQ2hhcHRlcnMgPSBKU09OLnN0cmluZ2lmeSh0aGlzLmNoYXB0ZXJzQ29sbGFwc2VkKTtcbiAgICB0aGlzLnNob3dDaGFwdGVyc0NvbGxhcHNlZCgpO1xuICB9KTtcblxuICB2YXIgYWN0aXZlTGluayA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yKCdbaHJlZj1cIicgKyBsb2NhdGlvbi5wYXRobmFtZSArICdcIl0nKTtcbiAgaWYgKGFjdGl2ZUxpbmspIHtcbiAgICBhY3RpdmVMaW5rLmNsYXNzTGlzdC5hZGQoJ3R1dG9yaWFsLW1hcF9fbGlua19hY3RpdmUnKTtcbiAgfVxuXG4gIHRoaXMuZm9jdXMoKTtcblxufVxuXG5cblR1dG9yaWFsTWFwLnByb3RvdHlwZS5zaG93Q2hhcHRlcnNDb2xsYXBzZWQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGxpbmtzID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3JBbGwoJy50dXRvcmlhbC1tYXBfX2l0ZW0gPiAudHV0b3JpYWwtbWFwX19saW5rJyk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlua3MubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbGluayA9IGxpbmtzW2ldO1xuXG4gICAgaWYgKHRoaXMuY2hhcHRlcnNDb2xsYXBzZWRbbGluay5nZXRBdHRyaWJ1dGUoJ2hyZWYnKV0pIHtcbiAgICAgIGxpbmsucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKCd0dXRvcmlhbC1tYXBfX2l0ZW1fY29sbGFwc2VkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpbmsucGFyZW50Tm9kZS5jbGFzc0xpc3QucmVtb3ZlKCd0dXRvcmlhbC1tYXBfX2l0ZW1fY29sbGFwc2VkJyk7XG4gICAgfVxuICB9XG59O1xuXG5UdXRvcmlhbE1hcC5wcm90b3R5cGUub25MYXlvdXRTd2l0Y2hDaGFuZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICB0aGlzLnVwZGF0ZUxheW91dCgpO1xufTtcblxuXG5UdXRvcmlhbE1hcC5wcm90b3R5cGUudXBkYXRlTGF5b3V0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpc01hcFNpbmdsZUNvbHVtbiA9ICt0aGlzLmVsZW0ucXVlcnlTZWxlY3RvcignW25hbWU9XCJtYXAtbGF5b3V0XCJdOmNoZWNrZWQnKS52YWx1ZTtcbiAgaWYgKGlzTWFwU2luZ2xlQ29sdW1uKSB7XG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ3R1dG9yaWFsLW1hcF9zaW5nbGVjb2wnKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LnJlbW92ZSgndHV0b3JpYWwtbWFwX3NpbmdsZWNvbCcpO1xuICB9XG5cbiAgbG9jYWxTdG9yYWdlLmlzTWFwU2luZ2xlQ29sdW1uID0gaXNNYXBTaW5nbGVDb2x1bW4gPyBcIjFcIiA6IFwiMFwiO1xufTtcblxuVHV0b3JpYWxNYXAucHJvdG90eXBlLnVwZGF0ZVNob3dUYXNrcyA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5zaG93VGFza3NDaGVja2JveC5jaGVja2VkKSB7XG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ3R1dG9yaWFsLW1hcF9zaG93LXRhc2tzJyk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3R1dG9yaWFsLW1hcF9zaG93LXRhc2tzJyk7XG4gIH1cblxuICBsb2NhbFN0b3JhZ2Uuc2hvd1Rhc2tzQ2hlY2tib3ggPSB0aGlzLnNob3dUYXNrc0NoZWNrYm94LmNoZWNrZWQgPyBcIjFcIiA6IFwiMFwiO1xufTtcblxuVHV0b3JpYWxNYXAucHJvdG90eXBlLm9uRmlsdGVySW5wdXQgPSBmdW5jdGlvbihldmVudCkge1xuICB0aGlzLnNob3dDbGVhckJ1dHRvbihldmVudC50YXJnZXQudmFsdWUpO1xuICB0aGlzLnRocm90dGxlRmlsdGVyKGV2ZW50LnRhcmdldC52YWx1ZSk7XG59O1xuXG5UdXRvcmlhbE1hcC5wcm90b3R5cGUub25GaWx0ZXJLZXlkb3duID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgaWYgKGV2ZW50LmtleUNvZGUgPT0gMjcpIHsgLy8gZXNjYXBlXG4gICAgdGhpcy5maWx0ZXJJbnB1dC52YWx1ZSA9ICcnO1xuICAgIHRoaXMuc2hvd0NsZWFyQnV0dG9uKGZhbHNlKTtcbiAgICB0aGlzLmZpbHRlcignJyk7XG4gIH1cbn07XG5cblR1dG9yaWFsTWFwLnByb3RvdHlwZS5zaG93Q2xlYXJCdXR0b24gPSBmdW5jdGlvbihzaG93KSB7XG4gIGlmIChzaG93KSB7XG4gICAgdGhpcy50ZXh0SW5wdXRCbG9jay5jbGFzc0xpc3QuYWRkKCd0ZXh0LWlucHV0X2NsZWFyLWJ1dHRvbicpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMudGV4dElucHV0QmxvY2suY2xhc3NMaXN0LnJlbW92ZSgndGV4dC1pbnB1dF9jbGVhci1idXR0b24nKTtcbiAgfVxufTtcblxuLy8gZm9jdXMgb24gdGhlIG1hcCBpdHNlbGYsIHRvIGFsbG93IGltbWVkaWF0ZSBzY3JvbGxpbmcgd2l0aCBhcnJvdyB1cC9kb3duIGtleXNcblR1dG9yaWFsTWFwLnByb3RvdHlwZS5mb2N1cyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVsZW0udGFiSW5kZXggPSAtMTtcbiAgdGhpcy5lbGVtLmZvY3VzKCk7XG59O1xuXG5UdXRvcmlhbE1hcC5wcm90b3R5cGUuZmlsdGVyID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICB2YXIgc2hvd2luZ1Rhc2tzID0gdGhpcy5zaG93VGFza3NDaGVja2JveC5jaGVja2VkO1xuXG4gIHZhciBsaW5rcyA9IHRoaXMuZWxlbS5xdWVyeVNlbGVjdG9yQWxsKCcudHV0b3JpYWwtbWFwLWxpbmsnKTtcblxuICB2YXIgdG9wSXRlbXMgPSB0aGlzLmVsZW0ucXVlcnlTZWxlY3RvckFsbCgnLnR1dG9yaWFsLW1hcF9faXRlbScpO1xuXG4gIGZ1bmN0aW9uIGNoZWNrTGlNYXRjaChsaSkge1xuICAgIHJldHVybiBpc1N1YlNlcXVlbmNlKGxpLnF1ZXJ5U2VsZWN0b3IoJ2EnKS5pbm5lckhUTUwudG9Mb3dlckNhc2UoKSwgdmFsdWUucmVwbGFjZSgvXFxzL2csICcnKSk7XG4gIH1cblxuICAvLyBhbiBpdGVtIGlzIHNob3duIGlmIGFueSBvZiBpdHMgY2hpbGRyZW4gaXMgc2hvd24gT1IgaXQncyBsaW5rIG1hdGNoZXMgdGhlIGZpbHRlclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRvcEl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGxpID0gdG9wSXRlbXNbaV07XG4gICAgdmFyIHN1Ykl0ZW1zID0gbGkucXVlcnlTZWxlY3RvckFsbCgnLnR1dG9yaWFsLW1hcF9fc3ViLWl0ZW0nKTtcblxuICAgIHZhciBjaGlsZE1hdGNoID0gQXJyYXkucHJvdG90eXBlLnJlZHVjZS5jYWxsKHN1Ykl0ZW1zLCBmdW5jdGlvbihwcmV2VmFsdWUsIHN1Ykl0ZW0pIHtcblxuICAgICAgdmFyIGNoaWxkTWF0Y2ggPSBmYWxzZTtcblxuICAgICAgaWYgKHNob3dpbmdUYXNrcykge1xuICAgICAgICB2YXIgc3ViSXRlbXMgPSBzdWJJdGVtLnF1ZXJ5U2VsZWN0b3JBbGwoJy50dXRvcmlhbC1tYXBfX3N1Yi1zdWItaXRlbScpO1xuICAgICAgICBjaGlsZE1hdGNoID0gQXJyYXkucHJvdG90eXBlLnJlZHVjZS5jYWxsKHN1Ykl0ZW1zLCBmdW5jdGlvbihwcmV2VmFsdWUsIHN1Ykl0ZW0pIHtcbiAgICAgICAgICB2YXIgbWF0Y2ggPSBjaGVja0xpTWF0Y2goc3ViSXRlbSk7XG4gICAgICAgICAgc3ViSXRlbS5oaWRkZW4gPSAhbWF0Y2g7XG4gICAgICAgICAgcmV0dXJuIHByZXZWYWx1ZSB8fCBtYXRjaDtcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgfVxuXG4gICAgICB2YXIgbWF0Y2ggPSBjaGlsZE1hdGNoIHx8IGNoZWNrTGlNYXRjaChzdWJJdGVtKTtcbiAgICAgIC8vY29uc29sZS5sb2coc3ViSXRlbSwgbWF0Y2gpO1xuICAgICAgc3ViSXRlbS5oaWRkZW4gPSAhbWF0Y2g7XG5cbiAgICAgIHJldHVybiBwcmV2VmFsdWUgfHwgbWF0Y2g7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgbGkuaGlkZGVuID0gIShjaGlsZE1hdGNoIHx8IGNoZWNrTGlNYXRjaChsaSkpO1xuXG4gIH1cblxufTtcblxuXG5UdXRvcmlhbE1hcC5wcm90b3R5cGUudGhyb3R0bGVGaWx0ZXIgPSB0aHJvdHRsZShUdXRvcmlhbE1hcC5wcm90b3R5cGUuZmlsdGVyLCAyMDApO1xuZGVsZWdhdGUuZGVsZWdhdGVNaXhpbihUdXRvcmlhbE1hcC5wcm90b3R5cGUpO1xuXG5cbmZ1bmN0aW9uIGlzU3ViU2VxdWVuY2Uoc3RyMSwgc3RyMikge1xuICB2YXIgaSA9IDA7XG4gIHZhciBqID0gMDtcbiAgd2hpbGUgKGkgPCBzdHIxLmxlbmd0aCAmJiBqIDwgc3RyMi5sZW5ndGgpIHtcbiAgICBpZiAoc3RyMVtpXSA9PSBzdHIyW2pdKSB7XG4gICAgICBpKys7XG4gICAgICBqKys7XG4gICAgfSBlbHNlIHtcbiAgICAgIGkrKztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGogPT0gc3RyMi5sZW5ndGg7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBUdXRvcmlhbE1hcDtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vaGFuZGxlcnMvdHV0b3JpYWwvY2xpZW50L3R1dG9yaWFsTWFwLmpzXG4gKiovIiwidmFyIG5vdGlmaWNhdGlvbiA9IHJlcXVpcmUoJ2NsaWVudC9ub3RpZmljYXRpb24nKTtcbnZhciBnZXRDc3JmQ29va2llID0gcmVxdWlyZSgnY2xpZW50L2dldENzcmZDb29raWUnKTtcbi8vIFdyYXBwZXIgYWJvdXQgWEhSXG4vLyAjIEdsb2JhbCBFdmVudHNcbi8vIHRyaWdnZXJzIGRvY3VtZW50LmxvYWRzdGFydC9sb2FkZW5kIG9uIGNvbW11bmljYXRpb24gc3RhcnQvZW5kXG4vLyAgICAtLT4gdW5sZXNzIG9wdGlvbnMubm9HbG9iYWxFdmVudHMgaXMgc2V0XG4vL1xuLy8gIyBFdmVudHNcbi8vIHRyaWdnZXJzIGZhaWwvc3VjY2VzcyBvbiBsb2FkIGVuZDpcbi8vICAgIC0tPiBieSBkZWZhdWx0IHN0YXR1cz0yMDAgaXMgb2ssIHRoZSBvdGhlcnMgYXJlIGZhaWx1cmVzXG4vLyAgICAtLT4gb3B0aW9ucy5ub3JtYWxTdGF0dXNlcyA9IFsyMDEsNDA5XSBhbGxvdyBnaXZlbiBzdGF0dXNlc1xuLy8gICAgLS0+IGZhaWwgZXZlbnQgaGFzIC5yZWFzb24gZmllbGRcbi8vICAgIC0tPiBzdWNjZXNzIGV2ZW50IGhhcyAucmVzdWx0IGZpZWxkXG4vL1xuLy8gIyBKU09OXG4vLyAgICAtLT4gc2VuZChvYmplY3QpIGNhbGxzIEpTT04uc3RyaW5naWZ5XG4vLyAgICAtLT4gYWRkcyBBY2NlcHQ6IGpzb24gKHdlIHdhbnQganNvbikgYnkgZGVmYXVsdCwgdW5sZXNzIG9wdGlvbnMucmF3XG4vLyBpZiBvcHRpb25zLmpzb24gb3Igc2VydmVyIHJldHVybmVkIGpzb24gY29udGVudCB0eXBlXG4vLyAgICAtLT4gYXV0b3BhcnNlIGpzb25cbi8vICAgIC0tPiBmYWlsIGlmIGVycm9yXG4vL1xuLy8gIyBDU1JGXG4vLyAgICAtLT4gcmVxdWVzdHMgc2VuZHMgaGVhZGVyIFgtWFNSRi1UT0tFTiBmcm9tIGNvb2tpZVxuXG5mdW5jdGlvbiB4aHIob3B0aW9ucykge1xuXG4gIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgdmFyIG1ldGhvZCA9IG9wdGlvbnMubWV0aG9kIHx8ICdHRVQnO1xuXG4gIHZhciBib2R5ID0gb3B0aW9ucy5ib2R5O1xuICB2YXIgdXJsID0gb3B0aW9ucy51cmw7XG5cbiAgcmVxdWVzdC5vcGVuKG1ldGhvZCwgdXJsLCBvcHRpb25zLnN5bmMgPyBmYWxzZSA6IHRydWUpO1xuXG4gIHJlcXVlc3QubWV0aG9kID0gbWV0aG9kO1xuXG4gIC8vIHRva2VuL2hlYWRlciBuYW1lcyBzYW1lIGFzIGFuZ3VsYXIgJGh0dHAgZm9yIGVhc2llciBpbnRlcm9wXG4gIHZhciBjc3JmQ29va2llID0gZ2V0Q3NyZkNvb2tpZSgpO1xuICBpZiAoY3NyZkNvb2tpZSAmJiAhb3B0aW9ucy5za2lwQ3NyZikge1xuICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihcIlgtWFNSRi1UT0tFTlwiLCBjc3JmQ29va2llKTtcbiAgfVxuXG4gIGlmICh7fS50b1N0cmluZy5jYWxsKGJvZHkpID09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgLy8gbXVzdCBiZSBPUEVOZWQgdG8gc2V0UmVxdWVzdEhlYWRlclxuICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD1VVEYtOFwiKTtcbiAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkoYm9keSk7XG4gIH1cblxuXG4gIGlmICghb3B0aW9ucy5ub0dsb2JhbEV2ZW50cykge1xuICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcignbG9hZHN0YXJ0JywgZXZlbnQgPT4ge1xuICAgICAgdmFyIGUgPSB3cmFwRXZlbnQoJ3hocnN0YXJ0JywgZXZlbnQpO1xuICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChlKTtcbiAgICB9KTtcbiAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRlbmQnLCBldmVudCA9PiB7XG4gICAgICB2YXIgZSA9IHdyYXBFdmVudCgneGhyZW5kJywgZXZlbnQpO1xuICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChlKTtcbiAgICB9KTtcbiAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3N1Y2Nlc3MnLCBldmVudCA9PiB7XG4gICAgICB2YXIgZSA9IHdyYXBFdmVudCgneGhyc3VjY2VzcycsIGV2ZW50KTtcbiAgICAgIGUucmVzdWx0ID0gZXZlbnQucmVzdWx0O1xuICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChlKTtcbiAgICB9KTtcbiAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZhaWwnLCBldmVudCA9PiB7XG4gICAgICB2YXIgZSA9IHdyYXBFdmVudCgneGhyZmFpbCcsIGV2ZW50KTtcbiAgICAgIGUucmVhc29uID0gZXZlbnQucmVhc29uO1xuICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGlmICghb3B0aW9ucy5yYXcpIHsgLy8gbWVhbnMgd2Ugd2FudCBqc29uXG4gICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKFwiQWNjZXB0XCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgfVxuXG4gIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcignWC1SZXF1ZXN0ZWQtV2l0aCcsIFwiWE1MSHR0cFJlcXVlc3RcIik7XG5cbiAgdmFyIG5vcm1hbFN0YXR1c2VzID0gb3B0aW9ucy5ub3JtYWxTdGF0dXNlcyB8fCBbMjAwXTtcblxuICBmdW5jdGlvbiB3cmFwRXZlbnQobmFtZSwgZSkge1xuICAgIHZhciBldmVudCA9IG5ldyBDdXN0b21FdmVudChuYW1lKTtcbiAgICBldmVudC5vcmlnaW5hbEV2ZW50ID0gZTtcbiAgICByZXR1cm4gZXZlbnQ7XG4gIH1cblxuICBmdW5jdGlvbiBmYWlsKHJlYXNvbiwgb3JpZ2luYWxFdmVudCkge1xuICAgIHZhciBlID0gd3JhcEV2ZW50KFwiZmFpbFwiLCBvcmlnaW5hbEV2ZW50KTtcbiAgICBlLnJlYXNvbiA9IHJlYXNvbjtcbiAgICByZXF1ZXN0LmRpc3BhdGNoRXZlbnQoZSk7XG4gIH1cblxuICBmdW5jdGlvbiBzdWNjZXNzKHJlc3VsdCwgb3JpZ2luYWxFdmVudCkge1xuICAgIHZhciBlID0gd3JhcEV2ZW50KFwic3VjY2Vzc1wiLCBvcmlnaW5hbEV2ZW50KTtcbiAgICBlLnJlc3VsdCA9IHJlc3VsdDtcbiAgICByZXF1ZXN0LmRpc3BhdGNoRXZlbnQoZSk7XG4gIH1cblxuICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCBlID0+IHtcbiAgICBmYWlsKFwi0J7RiNC40LHQutCwINGB0LLRj9C30Lgg0YEg0YHQtdGA0LLQtdGA0L7QvC5cIiwgZSk7XG4gIH0pO1xuXG4gIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcihcInRpbWVvdXRcIiwgZSA9PiB7XG4gICAgZmFpbChcItCf0YDQtdCy0YvRiNC10L3QviDQvNCw0LrRgdC40LzQsNC70YzQvdC+INC00L7Qv9GD0YHRgtC40LzQvtC1INCy0YDQtdC80Y8g0L7QttC40LTQsNC90LjRjyDQvtGC0LLQtdGC0LAg0L7RgiDRgdC10YDQstC10YDQsC5cIiwgZSk7XG4gIH0pO1xuXG4gIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIGUgPT4ge1xuICAgIGZhaWwoXCLQl9Cw0L/RgNC+0YEg0LHRi9C7INC/0YDQtdGA0LLQsNC9LlwiLCBlKTtcbiAgfSk7XG5cbiAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBlID0+IHtcbiAgICBpZiAoIXJlcXVlc3Quc3RhdHVzKSB7IC8vIGRvZXMgdGhhdCBldmVyIGhhcHBlbj9cbiAgICAgIGZhaWwoXCLQndC1INC/0L7Qu9GD0YfQtdC9INC+0YLQstC10YIg0L7RgiDRgdC10YDQstC10YDQsC5cIiwgZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG5vcm1hbFN0YXR1c2VzLmluZGV4T2YocmVxdWVzdC5zdGF0dXMpID09IC0xKSB7XG4gICAgICBmYWlsKFwi0J7RiNC40LHQutCwINC90LAg0YHRgtC+0YDQvtC90LUg0YHQtdGA0LLQtdGA0LAgKNC60L7QtCBcIiArIHJlcXVlc3Quc3RhdHVzICsgXCIpLCDQv9C+0L/Ri9GC0LDQudGC0LXRgdGMINC/0L7Qt9C00L3QtdC1XCIsIGUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciByZXN1bHQgPSByZXF1ZXN0LnJlc3BvbnNlVGV4dDtcbiAgICB2YXIgY29udGVudFR5cGUgPSByZXF1ZXN0LmdldFJlc3BvbnNlSGVhZGVyKFwiQ29udGVudC1UeXBlXCIpO1xuICAgIGlmIChjb250ZW50VHlwZS5tYXRjaCgvXmFwcGxpY2F0aW9uXFwvanNvbi8pIHx8IG9wdGlvbnMuanNvbikgeyAvLyBhdXRvcGFyc2UganNvbiBpZiBXQU5UIG9yIFJFQ0VJVkVEIGpzb25cbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UocmVzdWx0KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZmFpbChcItCd0LXQutC+0YDRgNC10LrRgtC90YvQuSDRhNC+0YDQvNCw0YIg0L7RgtCy0LXRgtCwINC+0YIg0YHQtdGA0LLQtdGA0LBcIiwgZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdWNjZXNzKHJlc3VsdCwgZSk7XG4gIH0pO1xuXG4gIC8vIGRlZmVyIHRvIGxldCBvdGhlciBoYW5kbGVycyBiZSBhc3NpZ25lZFxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgIHZhciB0aW1lU3RhcnQgPSBEYXRlLm5vdygpO1xuXG4gICAgcmVxdWVzdC5zZW5kKGJvZHkpO1xuXG4gICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdsb2FkZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICB3aW5kb3cuZ2EoJ3NlbmQnLCAndGltaW5nJywgJ3hocicsIG1ldGhvZCArICcgJyArIHVybCwgRGF0ZS5ub3coKSAtIHRpbWVTdGFydCk7XG4gICAgfSk7XG4gIH0sIDApO1xuXG5cblxuXG4gIHJldHVybiByZXF1ZXN0O1xuXG59XG5cbmZ1bmN0aW9uIGFkZFVybFBhcmFtKHVybCwgbmFtZSwgdmFsdWUpIHtcbiAgdmFyIHBhcmFtID0gZW5jb2RlVVJJQ29tcG9uZW50KG5hbWUpICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcbiAgaWYgKH51cmwuaW5kZXhPZignPycpKSB7XG4gICAgcmV0dXJuIHVybCArICcmJyArIHBhcmFtO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB1cmwgKyAnPycgKyBwYXJhbTtcbiAgfVxuXG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3hocmZhaWwnLCBmdW5jdGlvbihldmVudCkge1xuICBuZXcgbm90aWZpY2F0aW9uLkVycm9yKGV2ZW50LnJlYXNvbik7XG59KTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IHhocjtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vY2xpZW50L3hoci5qc1xuICoqLyIsInJlcXVpcmUoJ3ByaXNtanMvY29tcG9uZW50cy9wcmlzbS1jb3JlLmpzJyk7XG5yZXF1aXJlKCdwcmlzbWpzL2NvbXBvbmVudHMvcHJpc20tbWFya3VwLmpzJyk7XG5yZXF1aXJlKCdwcmlzbWpzL2NvbXBvbmVudHMvcHJpc20tY3NzLmpzJyk7XG5yZXF1aXJlKCdwcmlzbWpzL2NvbXBvbmVudHMvcHJpc20tY3NzLWV4dHJhcy5qcycpO1xucmVxdWlyZSgncHJpc21qcy9jb21wb25lbnRzL3ByaXNtLWNsaWtlLmpzJyk7XG5yZXF1aXJlKCdwcmlzbWpzL2NvbXBvbmVudHMvcHJpc20tamF2YXNjcmlwdC5qcycpO1xucmVxdWlyZSgncHJpc21qcy9jb21wb25lbnRzL3ByaXNtLWNvZmZlZXNjcmlwdC5qcycpO1xucmVxdWlyZSgncHJpc21qcy9jb21wb25lbnRzL3ByaXNtLWh0dHAuanMnKTtcbnJlcXVpcmUoJ3ByaXNtanMvY29tcG9uZW50cy9wcmlzbS1zY3NzLmpzJyk7XG5yZXF1aXJlKCdwcmlzbWpzL2NvbXBvbmVudHMvcHJpc20tc3FsLmpzJyk7XG5yZXF1aXJlKCdwcmlzbWpzL2NvbXBvbmVudHMvcHJpc20tcGhwLmpzJyk7XG5yZXF1aXJlKCdwcmlzbWpzL2NvbXBvbmVudHMvcHJpc20tcGhwLWV4dHJhcy5qcycpO1xucmVxdWlyZSgncHJpc21qcy9jb21wb25lbnRzL3ByaXNtLXB5dGhvbi5qcycpO1xucmVxdWlyZSgncHJpc21qcy9jb21wb25lbnRzL3ByaXNtLXJ1YnkuanMnKTtcbnJlcXVpcmUoJ3ByaXNtanMvY29tcG9uZW50cy9wcmlzbS1qYXZhLmpzJyk7XG5cblByaXNtLnRva2VuVGFnID0gJ2NvZGUnOyAvLyBmb3IgaUJvb2tzIHRvIHVzZSBtb25vc3BhY2UgZm9udFxuXG52YXIgQ29kZUJveCA9IHJlcXVpcmUoJy4vY29kZUJveCcpO1xudmFyIENvZGVUYWJzQm94ID0gcmVxdWlyZSgnLi9jb2RlVGFic0JveCcpO1xuXG5mdW5jdGlvbiBpbml0Q29kZUJveGVzKGNvbnRhaW5lcikge1xuXG4gIC8vIGhpZ2hsaWdodCBpbmxpbmVcbiAgdmFyIGNvZGVFeGFtcGxlRWxlbXMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLmNvZGUtZXhhbXBsZTpub3QoW2RhdGEtcHJpc20tZG9uZV0pJyk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2RlRXhhbXBsZUVsZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGNvZGVFeGFtcGxlRWxlbSA9IGNvZGVFeGFtcGxlRWxlbXNbaV07XG4gICAgbmV3IENvZGVCb3goY29kZUV4YW1wbGVFbGVtKTtcbiAgICBjb2RlRXhhbXBsZUVsZW0uc2V0QXR0cmlidXRlKCdkYXRhLXByaXNtLWRvbmUnLCAnMScpO1xuICB9XG5cbn1cblxuXG5mdW5jdGlvbiBpbml0Q29kZVRhYnNCb3goY29udGFpbmVyKSB7XG5cbiAgdmFyIGVsZW1zID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ2Rpdi5jb2RlLXRhYnM6bm90KFtkYXRhLXByaXNtLWRvbmVdKScpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbXMubGVuZ3RoOyBpKyspIHtcbiAgICBuZXcgQ29kZVRhYnNCb3goZWxlbXNbaV0pO1xuICAgIGVsZW1zW2ldLnNldEF0dHJpYnV0ZSgnZGF0YS1wcmlzbS1kb25lJywgJzEnKTtcbiAgfVxuXG59XG5cbmV4cG9ydHMuaW5pdCA9IGZ1bmN0aW9uICgpIHtcblxuICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgUHJpc20uaGlnaGxpZ2h0QWxsKTtcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgaGlnaGxpZ2h0KGRvY3VtZW50KTtcbiAgfSk7XG5cbn07XG5cbmZ1bmN0aW9uIGhpZ2hsaWdodChlbGVtKSB7XG4gIGluaXRDb2RlQm94ZXMoZWxlbSk7XG4gIGluaXRDb2RlVGFic0JveChlbGVtKTtcbn1cblxuZXhwb3J0cy5oaWdobGlnaHQgPSBoaWdobGlnaHQ7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9jbGllbnQvcHJpc20vaW5kZXguanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgY3NyZkNvb2tpZSA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaCgvWFNSRi1UT0tFTj0oW1xcdy1dKykvKTtcbiAgcmV0dXJuIGNzcmZDb29raWUgPyBjc3JmQ29va2llWzFdIDogbnVsbDtcbn07XG5cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vY2xpZW50L2dldENzcmZDb29raWUuanNcbiAqKi8iLCJ2YXIgcmVzaXplT25sb2FkID0gcmVxdWlyZSgnY2xpZW50L2hlYWQvcmVzaXplT25sb2FkJyk7XG52YXIgaXNTY3JvbGxlZEludG9WaWV3ID0gcmVxdWlyZSgnY2xpZW50L2lzU2Nyb2xsZWRJbnRvVmlldycpO1xudmFyIGFkZExpbmVOdW1iZXJzID0gcmVxdWlyZSgnLi9hZGRMaW5lTnVtYmVycycpO1xuXG5mdW5jdGlvbiBDb2RlQm94KGVsZW0pIHtcblxuICB2YXIgcHJlRWxlbSA9IGVsZW0ucXVlcnlTZWxlY3RvcigncHJlJyk7XG4gIHZhciBjb2RlRWxlbSA9IHByZUVsZW0ucXVlcnlTZWxlY3RvcignY29kZScpO1xuICB2YXIgY29kZSA9IGNvZGVFbGVtLnRleHRDb250ZW50O1xuXG4gIFByaXNtLmhpZ2hsaWdodEVsZW1lbnQoY29kZUVsZW0pO1xuICBhZGRMaW5lTnVtYmVycyhwcmVFbGVtKTtcblxuICBhZGRCbG9ja0hpZ2hsaWdodChwcmVFbGVtLCBlbGVtLmRhdGFzZXQuaGlnaGxpZ2h0QmxvY2spO1xuICBhZGRJbmxpbmVIaWdobGlnaHQocHJlRWxlbSwgZWxlbS5kYXRhc2V0LmhpZ2hsaWdodElubGluZSk7XG5cbiAgdmFyIGlzSlMgPSBwcmVFbGVtLmNsYXNzTGlzdC5jb250YWlucygnbGFuZ3VhZ2UtamF2YXNjcmlwdCcpO1xuICB2YXIgaXNIVE1MID0gcHJlRWxlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2xhbmd1YWdlLW1hcmt1cCcpO1xuICB2YXIgaXNUcnVzdGVkID0gZWxlbS5kYXRhc2V0LnRydXN0ZWQ7XG4gIHZhciBqc0ZyYW1lO1xuICB2YXIgaHRtbFJlc3VsdDtcbiAgdmFyIGlzRmlyc3RSdW4gPSB0cnVlO1xuXG4gIGlmICghaXNKUyAmJiAhaXNIVE1MKSByZXR1cm47XG5cbiAgdmFyIHJ1bkVsZW0gPSBlbGVtLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWFjdGlvbj1cInJ1blwiXScpO1xuICBpZiAocnVuRWxlbSkge1xuICAgIHJ1bkVsZW0ub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5ibHVyKCk7XG4gICAgICBydW4oKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICB9XG5cbiAgdmFyIGVkaXRFbGVtID0gZWxlbS5xdWVyeVNlbGVjdG9yKCdbZGF0YS1hY3Rpb249XCJlZGl0XCJdJyk7XG4gIGlmIChlZGl0RWxlbSkge1xuICAgIGVkaXRFbGVtLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuYmx1cigpO1xuICAgICAgZWRpdCgpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gIH1cblxuICAvLyBzb21lIGNvZGUgY2FuJ3QgYmUgZXhlY3V0ZWQgYnkgZXB1YiBlbmdpbmVcbiAgaWYgKGVsZW0uZGF0YXNldC5hdXRvcnVuICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZih3aW5kb3cuZWJvb2tGb3JtYXQgPT0gJ2VwdWInICYmIGVsZW0uZGF0YXNldC5hdXRvcnVuID09ICduby1lcHViJykge1xuICAgICAgZWxlbS5xdWVyeVNlbGVjdG9yKCdpZnJhbWUnKS5yZW1vdmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gdGltZW91dCBzaG91bGQgYmUgc21hbGwsIGFyb3VuZCAxMG1zLCBvciByZW1vdmUgaXQgdG8gbWFrZSBjcmF3bGVyIHByb2Nlc3MgdGhlIGF1dG9ydW5cbiAgICAgIHNldFRpbWVvdXQocnVuLCAxMDAwKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwb3N0SlNGcmFtZSgpIHtcbiAgICB2YXIgd2luID0ganNGcmFtZVswXS5jb250ZW50V2luZG93O1xuICAgIGlmICh0eXBlb2Ygd2luLnBvc3RNZXNzYWdlICE9ICdmdW5jdGlvbicpIHtcbiAgICAgIGFsZXJ0KFwi0JjQt9Cy0LjQvdC40YLQtSwg0LfQsNC/0YPRgdC6INC60L7QtNCwINGC0YDQtdCx0YPQtdGCINCx0L7Qu9C10LUg0YHQvtCy0YDQtdC80LXQvdC90YvQuSDQsdGA0LDRg9C30LXRgFwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgd2luLnBvc3RNZXNzYWdlKGNvZGUsICdodHRwOi8vcnUubG9va2F0Y29kZS5jb20vc2hvd2pzJyk7XG4gIH1cblxuICBmdW5jdGlvbiBydW5IVE1MKCkge1xuXG4gICAgdmFyIGZyYW1lO1xuXG4gICAgaWYgKGh0bWxSZXN1bHQgJiYgZWxlbS5kYXRhc2V0LnJlZnJlc2gpIHtcbiAgICAgIGh0bWxSZXN1bHQucmVtb3ZlKCk7XG4gICAgICBodG1sUmVzdWx0ID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoIWh0bWxSZXN1bHQpIHtcbiAgICAgIC8vIHRha2UgZnJvbSBIVE1MIGlmIGV4aXN0cyB0aGVyZSAoaW4gbWFya3VwIHdoZW4gYXV0b3J1biBpcyBzcGVjaWZpZWQpXG4gICAgICBodG1sUmVzdWx0ID0gZWxlbS5xdWVyeVNlbGVjdG9yKCcuY29kZS1yZXN1bHQnKTtcbiAgICB9XG5cbiAgICBpZiAoIWh0bWxSZXN1bHQpIHtcbiAgICAgIC8vIG90aGVyd2lzZSBjcmVhdGUgKG9yIHJlY3JlYXRlIGlmIHJlZnJlc2gpXG4gICAgICBodG1sUmVzdWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBodG1sUmVzdWx0LmNsYXNzTmFtZSA9IFwiY29kZS1yZXN1bHQgY29kZS1leGFtcGxlX19yZXN1bHRcIjtcblxuICAgICAgZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgICAgIGZyYW1lLm5hbWUgPSAnZnJhbWUtJyArIE1hdGgucmFuZG9tKCk7XG4gICAgICBmcmFtZS5jbGFzc05hbWUgPSAnY29kZS1yZXN1bHRfX2lmcmFtZSc7XG5cbiAgICAgIGlmIChlbGVtLmRhdGFzZXQuZGVtb0hlaWdodCA9PT0gXCIwXCIpIHtcbiAgICAgICAgLy8gdGhpcyBodG1sIGhhcyBub3RoaW5nIHRvIHNob3dcbiAgICAgICAgZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIH0gZWxzZSBpZiAoZWxlbS5kYXRhc2V0LmRlbW9IZWlnaHQpIHtcbiAgICAgICAgdmFyIGhlaWdodCA9ICtlbGVtLmRhdGFzZXQuZGVtb0hlaWdodDtcbiAgICAgICAgZnJhbWUuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcbiAgICAgIH1cbiAgICAgIGh0bWxSZXN1bHQuYXBwZW5kQ2hpbGQoZnJhbWUpO1xuXG4gICAgICBlbGVtLmFwcGVuZENoaWxkKGh0bWxSZXN1bHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmcmFtZSA9IGh0bWxSZXN1bHQucXVlcnlTZWxlY3RvcignaWZyYW1lJyk7XG4gICAgfVxuXG4gICAgaWYgKGlzVHJ1c3RlZCkge1xuICAgICAgdmFyIGRvYyA9IGZyYW1lLmNvbnRlbnREb2N1bWVudCB8fCBmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuXG4gICAgICBkb2Mub3BlbigpO1xuICAgICAgZG9jLndyaXRlKG5vcm1hbGl6ZUh0bWwoY29kZSkpO1xuICAgICAgZG9jLmNsb3NlKCk7XG5cbiAgICAgIGlmIChlbGVtLmRhdGFzZXQuZGVtb0hlaWdodCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJlc2l6ZU9ubG9hZC5pZnJhbWUoZnJhbWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIShpc0ZpcnN0UnVuICYmIGVsZW0uZGF0YXNldC5hdXRvcnVuICE9PSB1bmRlZmluZWQpKSB7XG4gICAgICAgIGlmICghaXNTY3JvbGxlZEludG9WaWV3KGh0bWxSZXN1bHQpKSB7XG4gICAgICAgICAgaHRtbFJlc3VsdC5zY3JvbGxJbnRvVmlldyhmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKTtcbiAgICAgIGZvcm0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIGZvcm0ubWV0aG9kID0gJ1BPU1QnO1xuICAgICAgZm9ybS5lbmN0eXBlID0gXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCI7XG4gICAgICBmb3JtLmFjdGlvbiA9IFwiaHR0cDovL3J1Lmxvb2thdGNvZGUuY29tL3Nob3dodG1sXCI7XG4gICAgICBmb3JtLnRhcmdldCA9IGZyYW1lLm5hbWU7XG5cbiAgICAgIHZhciB0ZXh0YXJlYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XG4gICAgICB0ZXh0YXJlYS5uYW1lID0gJ2NvZGUnO1xuICAgICAgdGV4dGFyZWEudmFsdWUgPSBub3JtYWxpemVIdG1sKGNvZGUpO1xuICAgICAgZm9ybS5hcHBlbmRDaGlsZCh0ZXh0YXJlYSk7XG5cbiAgICAgIGZyYW1lLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGZvcm0sIGZyYW1lLm5leHRTaWJsaW5nKTtcbiAgICAgIGZvcm0uc3VibWl0KCk7XG4gICAgICBmb3JtLnJlbW92ZSgpO1xuXG4gICAgICBpZiAoIShpc0ZpcnN0UnVuICYmIGVsZW0uZGF0YXNldC5hdXRvcnVuICE9PSB1bmRlZmluZWQpKSB7XG4gICAgICAgIGZyYW1lLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgaWYgKGVsZW0uZGF0YXNldC5kZW1vSGVpZ2h0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJlc2l6ZU9ubG9hZC5pZnJhbWUoZnJhbWUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghaXNTY3JvbGxlZEludG9WaWV3KGh0bWxSZXN1bHQpKSB7XG4gICAgICAgICAgICBodG1sUmVzdWx0LnNjcm9sbEludG9WaWV3KGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gIH1cblxuICBmdW5jdGlvbiBydW5KUygpIHtcblxuICAgIGlmIChpc1RydXN0ZWQpIHtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgLyoganNoaW50IC1XMDYxICovXG4gICAgICAgIHdpbmRvd1tcImV2YWxcIl0uY2FsbCh3aW5kb3csIGNvZGUpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICBhbGVydChcItCe0YjQuNCx0LrQsDogXCIgKyBlLm1lc3NhZ2UpO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcblxuICAgICAgaWYgKGVsZW0uZGF0YXNldC5yZWZyZXNoICYmIGpzRnJhbWUpIHtcbiAgICAgICAganNGcmFtZS5yZW1vdmUoKTtcbiAgICAgICAganNGcmFtZSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmICghanNGcmFtZSkge1xuICAgICAgICAvLyBjcmVhdGUgaWZyYW1lIGZvciBqc1xuICAgICAgICBqc0ZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XG4gICAgICAgIGpzRnJhbWUuY2xhc3NOYW1lID0gJ2pzLWZyYW1lJztcbiAgICAgICAganNGcmFtZS5zcmMgPSAnaHR0cDovL3J1Lmxvb2thdGNvZGUuY29tL3Nob3dqcyc7XG4gICAgICAgIGpzRnJhbWUuc3R5bGUud2lkdGggPSAwO1xuICAgICAgICBqc0ZyYW1lLnN0eWxlLmhlaWdodCA9IDA7XG4gICAgICAgIGpzRnJhbWUuc3R5bGUuYm9yZGVyID0gJ25vbmUnO1xuICAgICAgICBqc0ZyYW1lLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHBvc3RKU0ZyYW1lKCk7XG4gICAgICAgIH07XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoanNGcmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwb3N0SlNGcmFtZSgpO1xuICAgICAgfVxuXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZWRpdCgpIHtcblxuICAgIHZhciBodG1sO1xuICAgIGlmIChpc0hUTUwpIHtcbiAgICAgIGh0bWwgPSBub3JtYWxpemVIdG1sKGNvZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgY29kZUluZGVudGVkID0gY29kZS5yZXBsYWNlKC9eL2dpbSwgJyAgICAnKTtcbiAgICAgIGh0bWwgPSAnPCFET0NUWVBFIGh0bWw+XFxuPGh0bWw+XFxuXFxuPGJvZHk+XFxuICA8c2NyaXB0PlxcbicgKyBjb2RlSW5kZW50ZWQgKyAnXFxuICA8L3NjcmlwdD5cXG48L2JvZHk+XFxuXFxuPC9odG1sPic7XG4gICAgfVxuXG4gICAgdmFyIGZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XG4gICAgZm9ybS5hY3Rpb24gPSBcImh0dHA6Ly9wbG5rci5jby9lZGl0Lz9wPXByZXZpZXdcIjtcbiAgICBmb3JtLm1ldGhvZCA9IFwiUE9TVFwiO1xuICAgIGZvcm0udGFyZ2V0ID0gXCJfYmxhbmtcIjtcblxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZm9ybSk7XG5cbiAgICB2YXIgdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xuICAgIHRleHRhcmVhLm5hbWUgPSBcImZpbGVzW2luZGV4Lmh0bWxdXCI7XG4gICAgdGV4dGFyZWEudmFsdWUgPSBodG1sO1xuICAgIGZvcm0uYXBwZW5kQ2hpbGQodGV4dGFyZWEpO1xuXG4gICAgdmFyIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBpbnB1dC5uYW1lID0gXCJkZXNjcmlwdGlvblwiO1xuICAgIGlucHV0LnZhbHVlID0gXCJGb3JrIGZyb20gXCIgKyB3aW5kb3cubG9jYXRpb247XG4gICAgZm9ybS5hcHBlbmRDaGlsZChpbnB1dCk7XG5cbiAgICBmb3JtLnN1Ym1pdCgpO1xuICAgIGZvcm0ucmVtb3ZlKCk7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZUh0bWwoKSB7XG4gICAgdmFyIGNvZGVMYyA9IGNvZGUudG9Mb3dlckNhc2UoKTtcbiAgICB2YXIgaGFzQm9keVN0YXJ0ID0gY29kZUxjLm1hdGNoKCc8Ym9keT4nKTtcbiAgICB2YXIgaGFzQm9keUVuZCA9IGNvZGVMYy5tYXRjaCgnPC9ib2R5PicpO1xuICAgIHZhciBoYXNIdG1sU3RhcnQgPSBjb2RlTGMubWF0Y2goJzxodG1sPicpO1xuICAgIHZhciBoYXNIdG1sRW5kID0gY29kZUxjLm1hdGNoKCc8L2h0bWw+Jyk7XG5cbiAgICB2YXIgaGFzRG9jVHlwZSA9IGNvZGVMYy5tYXRjaCgvXlxccyo8IWRvY3R5cGUvKTtcblxuICAgIGlmIChoYXNEb2NUeXBlKSB7XG4gICAgICByZXR1cm4gY29kZTtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0gY29kZTtcblxuICAgIGlmICghaGFzSHRtbFN0YXJ0KSB7XG4gICAgICByZXN1bHQgPSAnPGh0bWw+XFxuJyArIHJlc3VsdDtcbiAgICB9XG5cbiAgICBpZiAoIWhhc0h0bWxFbmQpIHtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdCArICdcXG48L2h0bWw+JztcbiAgICB9XG5cbiAgICBpZiAoIWhhc0JvZHlTdGFydCkge1xuICAgICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoJzxodG1sPicsICc8aHRtbD5cXG48aGVhZD5cXG4gIDxtZXRhIGNoYXJzZXQ9XCJ1dGYtOFwiPlxcbjwvaGVhZD48Ym9keT5cXG4nKTtcbiAgICB9XG5cbiAgICBpZiAoIWhhc0JvZHlFbmQpIHtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKCc8L2h0bWw+JywgJ1xcbjwvYm9keT5cXG48L2h0bWw+Jyk7XG4gICAgfVxuXG4gICAgcmVzdWx0ID0gJzwhRE9DVFlQRSBIVE1MPlxcbicgKyByZXN1bHQ7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cblxuICBmdW5jdGlvbiBydW4oKSB7XG4gICAgaWYgKGlzSlMpIHtcbiAgICAgIHJ1bkpTKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJ1bkhUTUwoKTtcbiAgICB9XG4gICAgaXNGaXJzdFJ1biA9IGZhbHNlO1xuICB9XG5cblxufVxuXG5cbmZ1bmN0aW9uIGFkZEJsb2NrSGlnaGxpZ2h0KHByZSwgbGluZXMpIHtcblxuICBpZiAoIWxpbmVzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHJhbmdlcyA9IGxpbmVzLnJlcGxhY2UoL1xccysvZywgJycpLnNwbGl0KCcsJyk7XG5cbiAgLypqc2hpbnQgLVcwODQgKi9cbiAgZm9yICh2YXIgaSA9IDAsIHJhbmdlOyByYW5nZSA9IHJhbmdlc1tpKytdOykge1xuICAgIHJhbmdlID0gcmFuZ2Uuc3BsaXQoJy0nKTtcblxuICAgIHZhciBzdGFydCA9ICtyYW5nZVswXSxcbiAgICAgICAgZW5kID0gK3JhbmdlWzFdIHx8IHN0YXJ0O1xuXG5cbiAgICB2YXIgbWFzayA9ICc8Y29kZSBjbGFzcz1cImJsb2NrLWhpZ2hsaWdodFwiIGRhdGEtc3RhcnQ9XCInICsgc3RhcnQgKyAnXCIgZGF0YS1lbmQ9XCInICsgZW5kICsgJ1wiPicgK1xuICAgICAgbmV3IEFycmF5KHN0YXJ0ICsgMSkuam9pbignXFxuJykgK1xuICAgICAgJzxjb2RlIGNsYXNzPVwibWFza1wiPicgKyBuZXcgQXJyYXkoZW5kIC0gc3RhcnQgKyAyKS5qb2luKCdcXG4nKSArICc8L2NvZGU+PC9jb2RlPic7XG5cbiAgICBwcmUuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYWZ0ZXJCZWdpblwiLCBtYXNrKTtcbiAgfVxuXG59XG5cblxuZnVuY3Rpb24gYWRkSW5saW5lSGlnaGxpZ2h0KHByZSwgcmFuZ2VzKSB7XG5cbiAgLy8gc2VsZWN0IGNvZGUgd2l0aCB0aGUgbGFuZ3VhZ2UgdGV4dCwgbm90IGJsb2NrLWhpZ2hsaWdodGVyXG4gIHZhciBjb2RlRWxlbSA9IHByZS5xdWVyeVNlbGVjdG9yKCdjb2RlW2NsYXNzKj1cImxhbmd1YWdlLVwiXScpO1xuXG4gIHJhbmdlcyA9IHJhbmdlcyA/IHJhbmdlcy5zcGxpdChcIixcIikgOiBbXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHJhbmdlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBwaWVjZSA9IHJhbmdlc1tpXS5zcGxpdCgnOicpO1xuICAgIHZhciBsaW5lTnVtID0gK3BpZWNlWzBdLCBzdHJSYW5nZSA9IHBpZWNlWzFdLnNwbGl0KCctJyk7XG4gICAgdmFyIHN0YXJ0ID0gK3N0clJhbmdlWzBdLCBlbmQgPSArc3RyUmFuZ2VbMV07XG4gICAgdmFyIG1hc2sgPSAnPGNvZGUgY2xhc3M9XCJpbmxpbmUtaGlnaGxpZ2h0XCI+JyArXG4gICAgICBuZXcgQXJyYXkobGluZU51bSArIDEpLmpvaW4oJ1xcbicpICtcbiAgICAgIG5ldyBBcnJheShzdGFydCArIDEpLmpvaW4oJyAnKSArXG4gICAgICAnPGNvZGUgY2xhc3M9XCJtYXNrXCI+JyArIG5ldyBBcnJheShlbmQgLSBzdGFydCArIDEpLmpvaW4oJyAnKSArICc8L2NvZGU+PC9jb2RlPic7XG5cbiAgICBjb2RlRWxlbS5pbnNlcnRBZGphY2VudEhUTUwoXCJhZnRlckJlZ2luXCIsIG1hc2spO1xuICB9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBDb2RlQm94O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9jbGllbnQvcHJpc20vY29kZUJveC5qc1xuICoqLyIsInZhciBkZWxlZ2F0ZSA9IHJlcXVpcmUoJ2NsaWVudC9kZWxlZ2F0ZScpO1xudmFyIGFkZExpbmVOdW1iZXJzID0gcmVxdWlyZSgnLi9hZGRMaW5lTnVtYmVycycpO1xuXG5mdW5jdGlvbiBDb2RlVGFic0JveChlbGVtKSB7XG4gIGlmICh3aW5kb3cuaXNFYm9vaykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMuZWxlbSA9IGVsZW07XG4gIHRoaXMudHJhbnNsYXRlWCA9IDA7XG5cbiAgdGhpcy5zd2l0Y2hlc0VsZW0gPSBlbGVtLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWNvZGUtdGFicy1zd2l0Y2hlc10nKTtcbiAgdGhpcy5zd2l0Y2hlc0VsZW1JdGVtcyA9IHRoaXMuc3dpdGNoZXNFbGVtLmZpcnN0RWxlbWVudENoaWxkO1xuICB0aGlzLmFycm93TGVmdCA9IGVsZW0ucXVlcnlTZWxlY3RvcignW2RhdGEtY29kZS10YWJzLWxlZnRdJyk7XG4gIHRoaXMuYXJyb3dSaWdodCA9IGVsZW0ucXVlcnlTZWxlY3RvcignW2RhdGEtY29kZS10YWJzLXJpZ2h0XScpO1xuXG5cbiAgdGhpcy5hcnJvd0xlZnQub25jbGljayA9IGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB0aGlzLnRyYW5zbGF0ZVggPSBNYXRoLm1heCgwLCB0aGlzLnRyYW5zbGF0ZVggLSB0aGlzLnN3aXRjaGVzRWxlbS5vZmZzZXRXaWR0aCk7XG4gICAgdGhpcy5yZW5kZXJUcmFuc2xhdGUoKTtcbiAgfS5iaW5kKHRoaXMpO1xuXG5cbiAgdGhpcy5hcnJvd1JpZ2h0Lm9uY2xpY2sgPSBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdGhpcy50cmFuc2xhdGVYID0gTWF0aC5taW4odGhpcy50cmFuc2xhdGVYICt0aGlzLnN3aXRjaGVzRWxlbS5vZmZzZXRXaWR0aCwgdGhpcy5zd2l0Y2hlc0VsZW1JdGVtcy5vZmZzZXRXaWR0aCAtIHRoaXMuc3dpdGNoZXNFbGVtLm9mZnNldFdpZHRoKTtcbiAgICB0aGlzLnJlbmRlclRyYW5zbGF0ZSgpO1xuICB9LmJpbmQodGhpcyk7XG5cbiAgdGhpcy5kZWxlZ2F0ZSgnLmNvZGUtdGFic19fc3dpdGNoJywgJ2NsaWNrJywgdGhpcy5vblN3aXRjaENsaWNrKTtcbn1cblxuQ29kZVRhYnNCb3gucHJvdG90eXBlLm9uU3dpdGNoQ2xpY2sgPSBmdW5jdGlvbihlKSB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcblxuICB2YXIgc2libGluZ3MgPSBlLmRlbGVnYXRlVGFyZ2V0LnBhcmVudE5vZGUuY2hpbGRyZW47XG4gIHZhciB0YWJzID0gdGhpcy5lbGVtLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWNvZGUtdGFicy1jb250ZW50XScpLmNoaWxkcmVuO1xuXG5cbiAgdmFyIHNlbGVjdGVkSW5kZXg7XG4gIGZvcih2YXIgaT0wOyBpPHNpYmxpbmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHN3aXRjaEVsZW0gPSBzaWJsaW5nc1tpXTtcbiAgICB2YXIgdGFiRWxlbSA9IHRhYnNbaV07XG4gICAgaWYgKHN3aXRjaEVsZW0gPT0gZS5kZWxlZ2F0ZVRhcmdldCkge1xuICAgICAgc2VsZWN0ZWRJbmRleCA9IGk7XG4gICAgICB0YWJFbGVtLmNsYXNzTGlzdC5hZGQoJ2NvZGUtdGFic19fc2VjdGlvbl9jdXJyZW50Jyk7XG4gICAgICBzd2l0Y2hFbGVtLmNsYXNzTGlzdC5hZGQoJ2NvZGUtdGFic19fc3dpdGNoX2N1cnJlbnQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFiRWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdjb2RlLXRhYnNfX3NlY3Rpb25fY3VycmVudCcpO1xuICAgICAgc3dpdGNoRWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdjb2RlLXRhYnNfX3N3aXRjaF9jdXJyZW50Jyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHNlbGVjdGVkSW5kZXggPT09IDApIHtcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCgnY29kZS10YWJzX3Jlc3VsdF9vbicpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdjb2RlLXRhYnNfcmVzdWx0X29uJyk7XG5cbiAgICB0aGlzLmhpZ2hsaWdodFRhYih0YWJzW3NlbGVjdGVkSW5kZXhdKTtcbiAgfVxuXG59O1xuXG5cbkNvZGVUYWJzQm94LnByb3RvdHlwZS5oaWdobGlnaHRUYWIgPSBmdW5jdGlvbih0YWIpIHtcbiAgaWYgKHRhYi5oaWdobGlnaHRlZCkgcmV0dXJuO1xuICB2YXIgcHJlRWxlbSA9IHRhYi5xdWVyeVNlbGVjdG9yKCdwcmUnKTtcbiAgdmFyIGNvZGVFbGVtID0gcHJlRWxlbS5xdWVyeVNlbGVjdG9yKCdjb2RlJyk7XG4gIFByaXNtLmhpZ2hsaWdodEVsZW1lbnQoY29kZUVsZW0pO1xuICBhZGRMaW5lTnVtYmVycyhwcmVFbGVtKTtcbiAgdGFiLmhpZ2hsaWdodGVkID0gdHJ1ZTtcbn07XG5cbkNvZGVUYWJzQm94LnByb3RvdHlwZS5yZW5kZXJUcmFuc2xhdGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5zd2l0Y2hlc0VsZW1JdGVtcy5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWCgtJyArIHRoaXMudHJhbnNsYXRlWCArICdweCknO1xuICBpZiAodGhpcy50cmFuc2xhdGVYID09PSAwKSB7XG4gICAgdGhpcy5hcnJvd0xlZnQuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmFycm93TGVmdC5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gIH1cblxuICBpZiAodGhpcy50cmFuc2xhdGVYID09PSB0aGlzLnN3aXRjaGVzRWxlbUl0ZW1zLm9mZnNldFdpZHRoIC0gdGhpcy5zd2l0Y2hlc0VsZW0ub2Zmc2V0V2lkdGgpIHtcbiAgICB0aGlzLmFycm93UmlnaHQuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmFycm93UmlnaHQucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICB9XG5cbn07XG5cblxuZGVsZWdhdGUuZGVsZWdhdGVNaXhpbihDb2RlVGFic0JveC5wcm90b3R5cGUpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29kZVRhYnNCb3g7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2NsaWVudC9wcmlzbS9jb2RlVGFic0JveC5qc1xuICoqLyIsInNlbGYgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpXG5cdD8gd2luZG93ICAgLy8gaWYgaW4gYnJvd3NlclxuXHQ6IChcblx0XHQodHlwZW9mIFdvcmtlckdsb2JhbFNjb3BlICE9PSAndW5kZWZpbmVkJyAmJiBzZWxmIGluc3RhbmNlb2YgV29ya2VyR2xvYmFsU2NvcGUpXG5cdFx0PyBzZWxmIC8vIGlmIGluIHdvcmtlclxuXHRcdDoge30gICAvLyBpZiBpbiBub2RlIGpzXG5cdCk7XG5cbi8qKlxuICogUHJpc206IExpZ2h0d2VpZ2h0LCByb2J1c3QsIGVsZWdhbnQgc3ludGF4IGhpZ2hsaWdodGluZ1xuICogTUlUIGxpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHAvXG4gKiBAYXV0aG9yIExlYSBWZXJvdSBodHRwOi8vbGVhLnZlcm91Lm1lXG4gKi9cblxudmFyIFByaXNtID0gKGZ1bmN0aW9uKCl7XG5cbi8vIFByaXZhdGUgaGVscGVyIHZhcnNcbnZhciBsYW5nID0gL1xcYmxhbmcoPzp1YWdlKT8tKD8hXFwqKShcXHcrKVxcYi9pO1xuXG52YXIgXyA9IHNlbGYuUHJpc20gPSB7XG5cdHV0aWw6IHtcblx0XHRlbmNvZGU6IGZ1bmN0aW9uICh0b2tlbnMpIHtcblx0XHRcdGlmICh0b2tlbnMgaW5zdGFuY2VvZiBUb2tlbikge1xuXHRcdFx0XHRyZXR1cm4gbmV3IFRva2VuKHRva2Vucy50eXBlLCBfLnV0aWwuZW5jb2RlKHRva2Vucy5jb250ZW50KSwgdG9rZW5zLmFsaWFzKTtcblx0XHRcdH0gZWxzZSBpZiAoXy51dGlsLnR5cGUodG9rZW5zKSA9PT0gJ0FycmF5Jykge1xuXHRcdFx0XHRyZXR1cm4gdG9rZW5zLm1hcChfLnV0aWwuZW5jb2RlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiB0b2tlbnMucmVwbGFjZSgvJi9nLCAnJmFtcDsnKS5yZXBsYWNlKC88L2csICcmbHQ7JykucmVwbGFjZSgvXFx1MDBhMC9nLCAnICcpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHR0eXBlOiBmdW5jdGlvbiAobykge1xuXHRcdFx0cmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5tYXRjaCgvXFxbb2JqZWN0IChcXHcrKVxcXS8pWzFdO1xuXHRcdH0sXG5cblx0XHQvLyBEZWVwIGNsb25lIGEgbGFuZ3VhZ2UgZGVmaW5pdGlvbiAoZS5nLiB0byBleHRlbmQgaXQpXG5cdFx0Y2xvbmU6IGZ1bmN0aW9uIChvKSB7XG5cdFx0XHR2YXIgdHlwZSA9IF8udXRpbC50eXBlKG8pO1xuXG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0Y2FzZSAnT2JqZWN0Jzpcblx0XHRcdFx0XHR2YXIgY2xvbmUgPSB7fTtcblxuXHRcdFx0XHRcdGZvciAodmFyIGtleSBpbiBvKSB7XG5cdFx0XHRcdFx0XHRpZiAoby5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG5cdFx0XHRcdFx0XHRcdGNsb25lW2tleV0gPSBfLnV0aWwuY2xvbmUob1trZXldKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gY2xvbmU7XG5cblx0XHRcdFx0Y2FzZSAnQXJyYXknOlxuXHRcdFx0XHRcdHJldHVybiBvLnNsaWNlKCk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBvO1xuXHRcdH1cblx0fSxcblxuXHRsYW5ndWFnZXM6IHtcblx0XHRleHRlbmQ6IGZ1bmN0aW9uIChpZCwgcmVkZWYpIHtcblx0XHRcdHZhciBsYW5nID0gXy51dGlsLmNsb25lKF8ubGFuZ3VhZ2VzW2lkXSk7XG5cblx0XHRcdGZvciAodmFyIGtleSBpbiByZWRlZikge1xuXHRcdFx0XHRsYW5nW2tleV0gPSByZWRlZltrZXldO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbGFuZztcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogSW5zZXJ0IGEgdG9rZW4gYmVmb3JlIGFub3RoZXIgdG9rZW4gaW4gYSBsYW5ndWFnZSBsaXRlcmFsXG5cdFx0ICogQXMgdGhpcyBuZWVkcyB0byByZWNyZWF0ZSB0aGUgb2JqZWN0ICh3ZSBjYW5ub3QgYWN0dWFsbHkgaW5zZXJ0IGJlZm9yZSBrZXlzIGluIG9iamVjdCBsaXRlcmFscyksXG5cdFx0ICogd2UgY2Fubm90IGp1c3QgcHJvdmlkZSBhbiBvYmplY3QsIHdlIG5lZWQgYW5vYmplY3QgYW5kIGEga2V5LlxuXHRcdCAqIEBwYXJhbSBpbnNpZGUgVGhlIGtleSAob3IgbGFuZ3VhZ2UgaWQpIG9mIHRoZSBwYXJlbnRcblx0XHQgKiBAcGFyYW0gYmVmb3JlIFRoZSBrZXkgdG8gaW5zZXJ0IGJlZm9yZS4gSWYgbm90IHByb3ZpZGVkLCB0aGUgZnVuY3Rpb24gYXBwZW5kcyBpbnN0ZWFkLlxuXHRcdCAqIEBwYXJhbSBpbnNlcnQgT2JqZWN0IHdpdGggdGhlIGtleS92YWx1ZSBwYWlycyB0byBpbnNlcnRcblx0XHQgKiBAcGFyYW0gcm9vdCBUaGUgb2JqZWN0IHRoYXQgY29udGFpbnMgYGluc2lkZWAuIElmIGVxdWFsIHRvIFByaXNtLmxhbmd1YWdlcywgaXQgY2FuIGJlIG9taXR0ZWQuXG5cdFx0ICovXG5cdFx0aW5zZXJ0QmVmb3JlOiBmdW5jdGlvbiAoaW5zaWRlLCBiZWZvcmUsIGluc2VydCwgcm9vdCkge1xuXHRcdFx0cm9vdCA9IHJvb3QgfHwgXy5sYW5ndWFnZXM7XG5cdFx0XHR2YXIgZ3JhbW1hciA9IHJvb3RbaW5zaWRlXTtcblx0XHRcdFxuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMikge1xuXHRcdFx0XHRpbnNlcnQgPSBhcmd1bWVudHNbMV07XG5cdFx0XHRcdFxuXHRcdFx0XHRmb3IgKHZhciBuZXdUb2tlbiBpbiBpbnNlcnQpIHtcblx0XHRcdFx0XHRpZiAoaW5zZXJ0Lmhhc093blByb3BlcnR5KG5ld1Rva2VuKSkge1xuXHRcdFx0XHRcdFx0Z3JhbW1hcltuZXdUb2tlbl0gPSBpbnNlcnRbbmV3VG9rZW5dO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0cmV0dXJuIGdyYW1tYXI7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHZhciByZXQgPSB7fTtcblxuXHRcdFx0Zm9yICh2YXIgdG9rZW4gaW4gZ3JhbW1hcikge1xuXG5cdFx0XHRcdGlmIChncmFtbWFyLmhhc093blByb3BlcnR5KHRva2VuKSkge1xuXG5cdFx0XHRcdFx0aWYgKHRva2VuID09IGJlZm9yZSkge1xuXG5cdFx0XHRcdFx0XHRmb3IgKHZhciBuZXdUb2tlbiBpbiBpbnNlcnQpIHtcblxuXHRcdFx0XHRcdFx0XHRpZiAoaW5zZXJ0Lmhhc093blByb3BlcnR5KG5ld1Rva2VuKSkge1xuXHRcdFx0XHRcdFx0XHRcdHJldFtuZXdUb2tlbl0gPSBpbnNlcnRbbmV3VG9rZW5dO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0W3Rva2VuXSA9IGdyYW1tYXJbdG9rZW5dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdC8vIFVwZGF0ZSByZWZlcmVuY2VzIGluIG90aGVyIGxhbmd1YWdlIGRlZmluaXRpb25zXG5cdFx0XHRfLmxhbmd1YWdlcy5ERlMoXy5sYW5ndWFnZXMsIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcblx0XHRcdFx0aWYgKHZhbHVlID09PSByb290W2luc2lkZV0gJiYga2V5ICE9IGluc2lkZSkge1xuXHRcdFx0XHRcdHRoaXNba2V5XSA9IHJldDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiByb290W2luc2lkZV0gPSByZXQ7XG5cdFx0fSxcblxuXHRcdC8vIFRyYXZlcnNlIGEgbGFuZ3VhZ2UgZGVmaW5pdGlvbiB3aXRoIERlcHRoIEZpcnN0IFNlYXJjaFxuXHRcdERGUzogZnVuY3Rpb24obywgY2FsbGJhY2ssIHR5cGUpIHtcblx0XHRcdGZvciAodmFyIGkgaW4gbykge1xuXHRcdFx0XHRpZiAoby5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0XHRcdGNhbGxiYWNrLmNhbGwobywgaSwgb1tpXSwgdHlwZSB8fCBpKTtcblxuXHRcdFx0XHRcdGlmIChfLnV0aWwudHlwZShvW2ldKSA9PT0gJ09iamVjdCcpIHtcblx0XHRcdFx0XHRcdF8ubGFuZ3VhZ2VzLkRGUyhvW2ldLCBjYWxsYmFjayk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgaWYgKF8udXRpbC50eXBlKG9baV0pID09PSAnQXJyYXknKSB7XG5cdFx0XHRcdFx0XHRfLmxhbmd1YWdlcy5ERlMob1tpXSwgY2FsbGJhY2ssIGkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRoaWdobGlnaHRBbGw6IGZ1bmN0aW9uKGFzeW5jLCBjYWxsYmFjaykge1xuXHRcdHZhciBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2NvZGVbY2xhc3MqPVwibGFuZ3VhZ2UtXCJdLCBbY2xhc3MqPVwibGFuZ3VhZ2UtXCJdIGNvZGUsIGNvZGVbY2xhc3MqPVwibGFuZy1cIl0sIFtjbGFzcyo9XCJsYW5nLVwiXSBjb2RlJyk7XG5cblx0XHRmb3IgKHZhciBpPTAsIGVsZW1lbnQ7IGVsZW1lbnQgPSBlbGVtZW50c1tpKytdOykge1xuXHRcdFx0Xy5oaWdobGlnaHRFbGVtZW50KGVsZW1lbnQsIGFzeW5jID09PSB0cnVlLCBjYWxsYmFjayk7XG5cdFx0fVxuXHR9LFxuXG5cdGhpZ2hsaWdodEVsZW1lbnQ6IGZ1bmN0aW9uKGVsZW1lbnQsIGFzeW5jLCBjYWxsYmFjaykge1xuXHRcdC8vIEZpbmQgbGFuZ3VhZ2Vcblx0XHR2YXIgbGFuZ3VhZ2UsIGdyYW1tYXIsIHBhcmVudCA9IGVsZW1lbnQ7XG5cblx0XHR3aGlsZSAocGFyZW50ICYmICFsYW5nLnRlc3QocGFyZW50LmNsYXNzTmFtZSkpIHtcblx0XHRcdHBhcmVudCA9IHBhcmVudC5wYXJlbnROb2RlO1xuXHRcdH1cblxuXHRcdGlmIChwYXJlbnQpIHtcblx0XHRcdGxhbmd1YWdlID0gKHBhcmVudC5jbGFzc05hbWUubWF0Y2gobGFuZykgfHwgWywnJ10pWzFdO1xuXHRcdFx0Z3JhbW1hciA9IF8ubGFuZ3VhZ2VzW2xhbmd1YWdlXTtcblx0XHR9XG5cblx0XHRpZiAoIWdyYW1tYXIpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBTZXQgbGFuZ3VhZ2Ugb24gdGhlIGVsZW1lbnQsIGlmIG5vdCBwcmVzZW50XG5cdFx0ZWxlbWVudC5jbGFzc05hbWUgPSBlbGVtZW50LmNsYXNzTmFtZS5yZXBsYWNlKGxhbmcsICcnKS5yZXBsYWNlKC9cXHMrL2csICcgJykgKyAnIGxhbmd1YWdlLScgKyBsYW5ndWFnZTtcblxuXHRcdC8vIFNldCBsYW5ndWFnZSBvbiB0aGUgcGFyZW50LCBmb3Igc3R5bGluZ1xuXHRcdHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZTtcblxuXHRcdGlmICgvcHJlL2kudGVzdChwYXJlbnQubm9kZU5hbWUpKSB7XG5cdFx0XHRwYXJlbnQuY2xhc3NOYW1lID0gcGFyZW50LmNsYXNzTmFtZS5yZXBsYWNlKGxhbmcsICcnKS5yZXBsYWNlKC9cXHMrL2csICcgJykgKyAnIGxhbmd1YWdlLScgKyBsYW5ndWFnZTtcblx0XHR9XG5cblx0XHR2YXIgY29kZSA9IGVsZW1lbnQudGV4dENvbnRlbnQ7XG5cblx0XHRpZighY29kZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciBlbnYgPSB7XG5cdFx0XHRlbGVtZW50OiBlbGVtZW50LFxuXHRcdFx0bGFuZ3VhZ2U6IGxhbmd1YWdlLFxuXHRcdFx0Z3JhbW1hcjogZ3JhbW1hcixcblx0XHRcdGNvZGU6IGNvZGVcblx0XHR9O1xuXG5cdFx0Xy5ob29rcy5ydW4oJ2JlZm9yZS1oaWdobGlnaHQnLCBlbnYpO1xuXG5cdFx0aWYgKGFzeW5jICYmIHNlbGYuV29ya2VyKSB7XG5cdFx0XHR2YXIgd29ya2VyID0gbmV3IFdvcmtlcihfLmZpbGVuYW1lKTtcblxuXHRcdFx0d29ya2VyLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2dCkge1xuXHRcdFx0XHRlbnYuaGlnaGxpZ2h0ZWRDb2RlID0gVG9rZW4uc3RyaW5naWZ5KEpTT04ucGFyc2UoZXZ0LmRhdGEpLCBsYW5ndWFnZSk7XG5cblx0XHRcdFx0Xy5ob29rcy5ydW4oJ2JlZm9yZS1pbnNlcnQnLCBlbnYpO1xuXG5cdFx0XHRcdGVudi5lbGVtZW50LmlubmVySFRNTCA9IGVudi5oaWdobGlnaHRlZENvZGU7XG5cblx0XHRcdFx0Y2FsbGJhY2sgJiYgY2FsbGJhY2suY2FsbChlbnYuZWxlbWVudCk7XG5cdFx0XHRcdF8uaG9va3MucnVuKCdhZnRlci1oaWdobGlnaHQnLCBlbnYpO1xuXHRcdFx0fTtcblxuXHRcdFx0d29ya2VyLnBvc3RNZXNzYWdlKEpTT04uc3RyaW5naWZ5KHtcblx0XHRcdFx0bGFuZ3VhZ2U6IGVudi5sYW5ndWFnZSxcblx0XHRcdFx0Y29kZTogZW52LmNvZGVcblx0XHRcdH0pKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRlbnYuaGlnaGxpZ2h0ZWRDb2RlID0gXy5oaWdobGlnaHQoZW52LmNvZGUsIGVudi5ncmFtbWFyLCBlbnYubGFuZ3VhZ2UpXG5cblx0XHRcdF8uaG9va3MucnVuKCdiZWZvcmUtaW5zZXJ0JywgZW52KTtcblxuXHRcdFx0ZW52LmVsZW1lbnQuaW5uZXJIVE1MID0gZW52LmhpZ2hsaWdodGVkQ29kZTtcblxuXHRcdFx0Y2FsbGJhY2sgJiYgY2FsbGJhY2suY2FsbChlbGVtZW50KTtcblxuXHRcdFx0Xy5ob29rcy5ydW4oJ2FmdGVyLWhpZ2hsaWdodCcsIGVudik7XG5cdFx0fVxuXHR9LFxuXG5cdGhpZ2hsaWdodDogZnVuY3Rpb24gKHRleHQsIGdyYW1tYXIsIGxhbmd1YWdlKSB7XG5cdFx0dmFyIHRva2VucyA9IF8udG9rZW5pemUodGV4dCwgZ3JhbW1hcik7XG5cdFx0cmV0dXJuIFRva2VuLnN0cmluZ2lmeShfLnV0aWwuZW5jb2RlKHRva2VucyksIGxhbmd1YWdlKTtcblx0fSxcblxuXHR0b2tlbml6ZTogZnVuY3Rpb24odGV4dCwgZ3JhbW1hciwgbGFuZ3VhZ2UpIHtcblx0XHR2YXIgVG9rZW4gPSBfLlRva2VuO1xuXG5cdFx0dmFyIHN0cmFyciA9IFt0ZXh0XTtcblxuXHRcdHZhciByZXN0ID0gZ3JhbW1hci5yZXN0O1xuXG5cdFx0aWYgKHJlc3QpIHtcblx0XHRcdGZvciAodmFyIHRva2VuIGluIHJlc3QpIHtcblx0XHRcdFx0Z3JhbW1hclt0b2tlbl0gPSByZXN0W3Rva2VuXTtcblx0XHRcdH1cblxuXHRcdFx0ZGVsZXRlIGdyYW1tYXIucmVzdDtcblx0XHR9XG5cblx0XHR0b2tlbmxvb3A6IGZvciAodmFyIHRva2VuIGluIGdyYW1tYXIpIHtcblx0XHRcdGlmKCFncmFtbWFyLmhhc093blByb3BlcnR5KHRva2VuKSB8fCAhZ3JhbW1hclt0b2tlbl0pIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBwYXR0ZXJucyA9IGdyYW1tYXJbdG9rZW5dO1xuXHRcdFx0cGF0dGVybnMgPSAoXy51dGlsLnR5cGUocGF0dGVybnMpID09PSBcIkFycmF5XCIpID8gcGF0dGVybnMgOiBbcGF0dGVybnNdO1xuXG5cdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IHBhdHRlcm5zLmxlbmd0aDsgKytqKSB7XG5cdFx0XHRcdHZhciBwYXR0ZXJuID0gcGF0dGVybnNbal0sXG5cdFx0XHRcdFx0aW5zaWRlID0gcGF0dGVybi5pbnNpZGUsXG5cdFx0XHRcdFx0bG9va2JlaGluZCA9ICEhcGF0dGVybi5sb29rYmVoaW5kLFxuXHRcdFx0XHRcdGxvb2tiZWhpbmRMZW5ndGggPSAwLFxuXHRcdFx0XHRcdGFsaWFzID0gcGF0dGVybi5hbGlhcztcblxuXHRcdFx0XHRwYXR0ZXJuID0gcGF0dGVybi5wYXR0ZXJuIHx8IHBhdHRlcm47XG5cblx0XHRcdFx0Zm9yICh2YXIgaT0wOyBpPHN0cmFyci5sZW5ndGg7IGkrKykgeyAvLyBEb27igJl0IGNhY2hlIGxlbmd0aCBhcyBpdCBjaGFuZ2VzIGR1cmluZyB0aGUgbG9vcFxuXG5cdFx0XHRcdFx0dmFyIHN0ciA9IHN0cmFycltpXTtcblxuXHRcdFx0XHRcdGlmIChzdHJhcnIubGVuZ3RoID4gdGV4dC5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdC8vIFNvbWV0aGluZyB3ZW50IHRlcnJpYmx5IHdyb25nLCBBQk9SVCwgQUJPUlQhXG5cdFx0XHRcdFx0XHRicmVhayB0b2tlbmxvb3A7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHN0ciBpbnN0YW5jZW9mIFRva2VuKSB7XG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRwYXR0ZXJuLmxhc3RJbmRleCA9IDA7XG5cblx0XHRcdFx0XHR2YXIgbWF0Y2ggPSBwYXR0ZXJuLmV4ZWMoc3RyKTtcblxuXHRcdFx0XHRcdGlmIChtYXRjaCkge1xuXHRcdFx0XHRcdFx0aWYobG9va2JlaGluZCkge1xuXHRcdFx0XHRcdFx0XHRsb29rYmVoaW5kTGVuZ3RoID0gbWF0Y2hbMV0ubGVuZ3RoO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR2YXIgZnJvbSA9IG1hdGNoLmluZGV4IC0gMSArIGxvb2tiZWhpbmRMZW5ndGgsXG5cdFx0XHRcdFx0XHRcdG1hdGNoID0gbWF0Y2hbMF0uc2xpY2UobG9va2JlaGluZExlbmd0aCksXG5cdFx0XHRcdFx0XHRcdGxlbiA9IG1hdGNoLmxlbmd0aCxcblx0XHRcdFx0XHRcdFx0dG8gPSBmcm9tICsgbGVuLFxuXHRcdFx0XHRcdFx0XHRiZWZvcmUgPSBzdHIuc2xpY2UoMCwgZnJvbSArIDEpLFxuXHRcdFx0XHRcdFx0XHRhZnRlciA9IHN0ci5zbGljZSh0byArIDEpO1xuXG5cdFx0XHRcdFx0XHR2YXIgYXJncyA9IFtpLCAxXTtcblxuXHRcdFx0XHRcdFx0aWYgKGJlZm9yZSkge1xuXHRcdFx0XHRcdFx0XHRhcmdzLnB1c2goYmVmb3JlKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0dmFyIHdyYXBwZWQgPSBuZXcgVG9rZW4odG9rZW4sIGluc2lkZT8gXy50b2tlbml6ZShtYXRjaCwgaW5zaWRlKSA6IG1hdGNoLCBhbGlhcyk7XG5cblx0XHRcdFx0XHRcdGFyZ3MucHVzaCh3cmFwcGVkKTtcblxuXHRcdFx0XHRcdFx0aWYgKGFmdGVyKSB7XG5cdFx0XHRcdFx0XHRcdGFyZ3MucHVzaChhZnRlcik7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdEFycmF5LnByb3RvdHlwZS5zcGxpY2UuYXBwbHkoc3RyYXJyLCBhcmdzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gc3RyYXJyO1xuXHR9LFxuXG5cdGhvb2tzOiB7XG5cdFx0YWxsOiB7fSxcblxuXHRcdGFkZDogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrKSB7XG5cdFx0XHR2YXIgaG9va3MgPSBfLmhvb2tzLmFsbDtcblxuXHRcdFx0aG9va3NbbmFtZV0gPSBob29rc1tuYW1lXSB8fCBbXTtcblxuXHRcdFx0aG9va3NbbmFtZV0ucHVzaChjYWxsYmFjayk7XG5cdFx0fSxcblxuXHRcdHJ1bjogZnVuY3Rpb24gKG5hbWUsIGVudikge1xuXHRcdFx0dmFyIGNhbGxiYWNrcyA9IF8uaG9va3MuYWxsW25hbWVdO1xuXG5cdFx0XHRpZiAoIWNhbGxiYWNrcyB8fCAhY2FsbGJhY2tzLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGZvciAodmFyIGk9MCwgY2FsbGJhY2s7IGNhbGxiYWNrID0gY2FsbGJhY2tzW2krK107KSB7XG5cdFx0XHRcdGNhbGxiYWNrKGVudik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59O1xuXG52YXIgVG9rZW4gPSBfLlRva2VuID0gZnVuY3Rpb24odHlwZSwgY29udGVudCwgYWxpYXMpIHtcblx0dGhpcy50eXBlID0gdHlwZTtcblx0dGhpcy5jb250ZW50ID0gY29udGVudDtcblx0dGhpcy5hbGlhcyA9IGFsaWFzO1xufTtcblxuVG9rZW4uc3RyaW5naWZ5ID0gZnVuY3Rpb24obywgbGFuZ3VhZ2UsIHBhcmVudCkge1xuXHRpZiAodHlwZW9mIG8gPT0gJ3N0cmluZycpIHtcblx0XHRyZXR1cm4gbztcblx0fVxuXG5cdGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykgPT0gJ1tvYmplY3QgQXJyYXldJykge1xuXHRcdHJldHVybiBvLm1hcChmdW5jdGlvbihlbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gVG9rZW4uc3RyaW5naWZ5KGVsZW1lbnQsIGxhbmd1YWdlLCBvKTtcblx0XHR9KS5qb2luKCcnKTtcblx0fVxuXG5cdHZhciBlbnYgPSB7XG5cdFx0dHlwZTogby50eXBlLFxuXHRcdGNvbnRlbnQ6IFRva2VuLnN0cmluZ2lmeShvLmNvbnRlbnQsIGxhbmd1YWdlLCBwYXJlbnQpLFxuXHRcdHRhZzogUHJpc20udG9rZW5UYWcgfHwgJ3NwYW4nLFxuXHRcdGNsYXNzZXM6IFsndG9rZW4nLCBvLnR5cGVdLFxuXHRcdGF0dHJpYnV0ZXM6IHt9LFxuXHRcdGxhbmd1YWdlOiBsYW5ndWFnZSxcblx0XHRwYXJlbnQ6IHBhcmVudFxuXHR9O1xuXG5cdGlmIChlbnYudHlwZSA9PSAnY29tbWVudCcpIHtcblx0XHRlbnYuYXR0cmlidXRlc1snc3BlbGxjaGVjayddID0gJ3RydWUnO1xuXHR9XG5cblx0aWYgKG8uYWxpYXMpIHtcblx0XHR2YXIgYWxpYXNlcyA9IF8udXRpbC50eXBlKG8uYWxpYXMpID09PSAnQXJyYXknID8gby5hbGlhcyA6IFtvLmFsaWFzXTtcblx0XHRBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShlbnYuY2xhc3NlcywgYWxpYXNlcyk7XG5cdH1cblxuXHRfLmhvb2tzLnJ1bignd3JhcCcsIGVudik7XG5cblx0dmFyIGF0dHJpYnV0ZXMgPSAnJztcblxuXHRmb3IgKHZhciBuYW1lIGluIGVudi5hdHRyaWJ1dGVzKSB7XG5cdFx0YXR0cmlidXRlcyArPSBuYW1lICsgJz1cIicgKyAoZW52LmF0dHJpYnV0ZXNbbmFtZV0gfHwgJycpICsgJ1wiJztcblx0fVxuXG5cdHJldHVybiAnPCcgKyBlbnYudGFnICsgJyBjbGFzcz1cIicgKyBlbnYuY2xhc3Nlcy5qb2luKCcgJykgKyAnXCIgJyArIGF0dHJpYnV0ZXMgKyAnPicgKyBlbnYuY29udGVudCArICc8LycgKyBlbnYudGFnICsgJz4nO1xuXG59O1xuXG5pZiAoIXNlbGYuZG9jdW1lbnQpIHtcblx0aWYgKCFzZWxmLmFkZEV2ZW50TGlzdGVuZXIpIHtcblx0XHQvLyBpbiBOb2RlLmpzXG5cdFx0cmV0dXJuIHNlbGYuUHJpc207XG5cdH1cbiBcdC8vIEluIHdvcmtlclxuXHRzZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbihldnQpIHtcblx0XHR2YXIgbWVzc2FnZSA9IEpTT04ucGFyc2UoZXZ0LmRhdGEpLFxuXHRcdCAgICBsYW5nID0gbWVzc2FnZS5sYW5ndWFnZSxcblx0XHQgICAgY29kZSA9IG1lc3NhZ2UuY29kZTtcblxuXHRcdHNlbGYucG9zdE1lc3NhZ2UoSlNPTi5zdHJpbmdpZnkoXy51dGlsLmVuY29kZShfLnRva2VuaXplKGNvZGUsIF8ubGFuZ3VhZ2VzW2xhbmddKSkpKTtcblx0XHRzZWxmLmNsb3NlKCk7XG5cdH0sIGZhbHNlKTtcblxuXHRyZXR1cm4gc2VsZi5QcmlzbTtcbn1cblxuLy8gR2V0IGN1cnJlbnQgc2NyaXB0IGFuZCBoaWdobGlnaHRcbnZhciBzY3JpcHQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0Jyk7XG5cbnNjcmlwdCA9IHNjcmlwdFtzY3JpcHQubGVuZ3RoIC0gMV07XG5cbmlmIChzY3JpcHQpIHtcblx0Xy5maWxlbmFtZSA9IHNjcmlwdC5zcmM7XG5cblx0aWYgKGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgJiYgIXNjcmlwdC5oYXNBdHRyaWJ1dGUoJ2RhdGEtbWFudWFsJykpIHtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgXy5oaWdobGlnaHRBbGwpO1xuXHR9XG59XG5cbnJldHVybiBzZWxmLlByaXNtO1xuXG59KSgpO1xuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0bW9kdWxlLmV4cG9ydHMgPSBQcmlzbTtcbn1cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3ByaXNtanMvY29tcG9uZW50cy9wcmlzbS1jb3JlLmpzXG4gKiogbW9kdWxlIGlkID0gNTZcbiAqKiBtb2R1bGUgY2h1bmtzID0gNiA5XG4gKiovIiwiUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cCA9IHtcblx0J2NvbW1lbnQnOiAvPCEtLVtcXHdcXFddKj8tLT4vZyxcblx0J3Byb2xvZyc6IC88XFw/Lis/XFw/Pi8sXG5cdCdkb2N0eXBlJzogLzwhRE9DVFlQRS4rPz4vLFxuXHQnY2RhdGEnOiAvPCFcXFtDREFUQVxcW1tcXHdcXFddKj9dXT4vaSxcblx0J3RhZyc6IHtcblx0XHRwYXR0ZXJuOiAvPFxcLz9bXFx3Oi1dK1xccyooPzpcXHMrW1xcdzotXSsoPzo9KD86KFwifCcpKFxcXFw/W1xcd1xcV10pKj9cXDF8W15cXHMnXCI+PV0rKSk/XFxzKikqXFwvPz4vZ2ksXG5cdFx0aW5zaWRlOiB7XG5cdFx0XHQndGFnJzoge1xuXHRcdFx0XHRwYXR0ZXJuOiAvXjxcXC8/W1xcdzotXSsvaSxcblx0XHRcdFx0aW5zaWRlOiB7XG5cdFx0XHRcdFx0J3B1bmN0dWF0aW9uJzogL148XFwvPy8sXG5cdFx0XHRcdFx0J25hbWVzcGFjZSc6IC9eW1xcdy1dKz86L1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0J2F0dHItdmFsdWUnOiB7XG5cdFx0XHRcdHBhdHRlcm46IC89KD86KCd8XCIpW1xcd1xcV10qPyhcXDEpfFteXFxzPl0rKS9naSxcblx0XHRcdFx0aW5zaWRlOiB7XG5cdFx0XHRcdFx0J3B1bmN0dWF0aW9uJzogLz18PnxcIi9nXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHQncHVuY3R1YXRpb24nOiAvXFwvPz4vZyxcblx0XHRcdCdhdHRyLW5hbWUnOiB7XG5cdFx0XHRcdHBhdHRlcm46IC9bXFx3Oi1dKy9nLFxuXHRcdFx0XHRpbnNpZGU6IHtcblx0XHRcdFx0XHQnbmFtZXNwYWNlJzogL15bXFx3LV0rPzovXG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdH1cblx0fSxcblx0J2VudGl0eSc6IC9cXCYjP1tcXGRhLXpdezEsOH07L2dpXG59O1xuXG4vLyBQbHVnaW4gdG8gbWFrZSBlbnRpdHkgdGl0bGUgc2hvdyB0aGUgcmVhbCBlbnRpdHksIGlkZWEgYnkgUm9tYW4gS29tYXJvdlxuUHJpc20uaG9va3MuYWRkKCd3cmFwJywgZnVuY3Rpb24oZW52KSB7XG5cblx0aWYgKGVudi50eXBlID09PSAnZW50aXR5Jykge1xuXHRcdGVudi5hdHRyaWJ1dGVzWyd0aXRsZSddID0gZW52LmNvbnRlbnQucmVwbGFjZSgvJmFtcDsvLCAnJicpO1xuXHR9XG59KTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3ByaXNtanMvY29tcG9uZW50cy9wcmlzbS1tYXJrdXAuanNcbiAqKiBtb2R1bGUgaWQgPSA1N1xuICoqIG1vZHVsZSBjaHVua3MgPSA2IDlcbiAqKi8iLCJQcmlzbS5sYW5ndWFnZXMuY3NzID0ge1xuXHQnY29tbWVudCc6IC9cXC9cXCpbXFx3XFxXXSo/XFwqXFwvL2csXG5cdCdhdHJ1bGUnOiB7XG5cdFx0cGF0dGVybjogL0BbXFx3LV0rPy4qPyg7fCg/PVxccyp7KSkvZ2ksXG5cdFx0aW5zaWRlOiB7XG5cdFx0XHQncHVuY3R1YXRpb24nOiAvWzs6XS9nXG5cdFx0fVxuXHR9LFxuXHQndXJsJzogL3VybFxcKChbXCInXT8pLio/XFwxXFwpL2dpLFxuXHQnc2VsZWN0b3InOiAvW15cXHtcXH1cXHNdW15cXHtcXH07XSooPz1cXHMqXFx7KS9nLFxuXHQncHJvcGVydHknOiAvKFxcYnxcXEIpW1xcdy1dKyg/PVxccyo6KS9pZyxcblx0J3N0cmluZyc6IC8oXCJ8JykoXFxcXD8uKSo/XFwxL2csXG5cdCdpbXBvcnRhbnQnOiAvXFxCIWltcG9ydGFudFxcYi9naSxcblx0J3B1bmN0dWF0aW9uJzogL1tcXHtcXH07Ol0vZyxcblx0J2Z1bmN0aW9uJzogL1stYS16MC05XSsoPz1cXCgpL2lnXG59O1xuXG5pZiAoUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cCkge1xuXHRQcmlzbS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCdtYXJrdXAnLCAndGFnJywge1xuXHRcdCdzdHlsZSc6IHtcblx0XHRcdHBhdHRlcm46IC88c3R5bGVbXFx3XFxXXSo/PltcXHdcXFddKj88XFwvc3R5bGU+L2lnLFxuXHRcdFx0aW5zaWRlOiB7XG5cdFx0XHRcdCd0YWcnOiB7XG5cdFx0XHRcdFx0cGF0dGVybjogLzxzdHlsZVtcXHdcXFddKj8+fDxcXC9zdHlsZT4vaWcsXG5cdFx0XHRcdFx0aW5zaWRlOiBQcmlzbS5sYW5ndWFnZXMubWFya3VwLnRhZy5pbnNpZGVcblx0XHRcdFx0fSxcblx0XHRcdFx0cmVzdDogUHJpc20ubGFuZ3VhZ2VzLmNzc1xuXHRcdFx0fSxcblx0XHRcdGFsaWFzOiAnbGFuZ3VhZ2UtY3NzJ1xuXHRcdH1cblx0fSk7XG5cdFxuXHRQcmlzbS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCdpbnNpZGUnLCAnYXR0ci12YWx1ZScsIHtcblx0XHQnc3R5bGUtYXR0cic6IHtcblx0XHRcdHBhdHRlcm46IC9cXHMqc3R5bGU9KFwifCcpLis/XFwxL2lnLFxuXHRcdFx0aW5zaWRlOiB7XG5cdFx0XHRcdCdhdHRyLW5hbWUnOiB7XG5cdFx0XHRcdFx0cGF0dGVybjogL15cXHMqc3R5bGUvaWcsXG5cdFx0XHRcdFx0aW5zaWRlOiBQcmlzbS5sYW5ndWFnZXMubWFya3VwLnRhZy5pbnNpZGVcblx0XHRcdFx0fSxcblx0XHRcdFx0J3B1bmN0dWF0aW9uJzogL15cXHMqPVxccypbJ1wiXXxbJ1wiXVxccyokLyxcblx0XHRcdFx0J2F0dHItdmFsdWUnOiB7XG5cdFx0XHRcdFx0cGF0dGVybjogLy4rL2dpLFxuXHRcdFx0XHRcdGluc2lkZTogUHJpc20ubGFuZ3VhZ2VzLmNzc1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0YWxpYXM6ICdsYW5ndWFnZS1jc3MnXG5cdFx0fVxuXHR9LCBQcmlzbS5sYW5ndWFnZXMubWFya3VwLnRhZyk7XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcHJpc21qcy9jb21wb25lbnRzL3ByaXNtLWNzcy5qc1xuICoqIG1vZHVsZSBpZCA9IDU4XG4gKiogbW9kdWxlIGNodW5rcyA9IDYgOVxuICoqLyIsIlByaXNtLmxhbmd1YWdlcy5jc3Muc2VsZWN0b3IgPSB7XG5cdHBhdHRlcm46IC9bXlxce1xcfVxcc11bXlxce1xcfV0qKD89XFxzKlxceykvZyxcblx0aW5zaWRlOiB7XG5cdFx0J3BzZXVkby1lbGVtZW50JzogLzooPzphZnRlcnxiZWZvcmV8Zmlyc3QtbGV0dGVyfGZpcnN0LWxpbmV8c2VsZWN0aW9uKXw6OlstXFx3XSsvZyxcblx0XHQncHNldWRvLWNsYXNzJzogLzpbLVxcd10rKD86XFwoLipcXCkpPy9nLFxuXHRcdCdjbGFzcyc6IC9cXC5bLTpcXC5cXHddKy9nLFxuXHRcdCdpZCc6IC8jWy06XFwuXFx3XSsvZ1xuXHR9XG59O1xuXG5QcmlzbS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCdjc3MnLCAnZnVuY3Rpb24nLCB7XG5cdCdoZXhjb2RlJzogLyNbXFxkYS1mXXszLDZ9L2dpLFxuXHQnZW50aXR5JzogL1xcXFxbXFxkYS1mXXsxLDh9L2dpLFxuXHQnbnVtYmVyJzogL1tcXGQlXFwuXSsvZ1xufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcHJpc21qcy9jb21wb25lbnRzL3ByaXNtLWNzcy1leHRyYXMuanNcbiAqKiBtb2R1bGUgaWQgPSA1OVxuICoqIG1vZHVsZSBjaHVua3MgPSA2IDlcbiAqKi8iLCJQcmlzbS5sYW5ndWFnZXMuY2xpa2UgPSB7XG5cdCdjb21tZW50JzogW1xuXHRcdHtcblx0XHRcdHBhdHRlcm46IC8oXnxbXlxcXFxdKVxcL1xcKltcXHdcXFddKj9cXCpcXC8vZyxcblx0XHRcdGxvb2tiZWhpbmQ6IHRydWVcblx0XHR9LFxuXHRcdHtcblx0XHRcdHBhdHRlcm46IC8oXnxbXlxcXFw6XSlcXC9cXC8uKj8oXFxyP1xcbnwkKS9nLFxuXHRcdFx0bG9va2JlaGluZDogdHJ1ZVxuXHRcdH1cblx0XSxcblx0J3N0cmluZyc6IC8oXCJ8JykoXFxcXD8uKSo/XFwxL2csXG5cdCdjbGFzcy1uYW1lJzoge1xuXHRcdHBhdHRlcm46IC8oKD86KD86Y2xhc3N8aW50ZXJmYWNlfGV4dGVuZHN8aW1wbGVtZW50c3x0cmFpdHxpbnN0YW5jZW9mfG5ldylcXHMrKXwoPzpjYXRjaFxccytcXCgpKVthLXowLTlfXFwuXFxcXF0rL2lnLFxuXHRcdGxvb2tiZWhpbmQ6IHRydWUsXG5cdFx0aW5zaWRlOiB7XG5cdFx0XHRwdW5jdHVhdGlvbjogLyhcXC58XFxcXCkvXG5cdFx0fVxuXHR9LFxuXHQna2V5d29yZCc6IC9cXGIoaWZ8ZWxzZXx3aGlsZXxkb3xmb3J8cmV0dXJufGlufGluc3RhbmNlb2Z8ZnVuY3Rpb258bmV3fHRyeXx0aHJvd3xjYXRjaHxmaW5hbGx5fG51bGx8YnJlYWt8Y29udGludWUpXFxiL2csXG5cdCdib29sZWFuJzogL1xcYih0cnVlfGZhbHNlKVxcYi9nLFxuXHQnZnVuY3Rpb24nOiB7XG5cdFx0cGF0dGVybjogL1thLXowLTlfXStcXCgvaWcsXG5cdFx0aW5zaWRlOiB7XG5cdFx0XHRwdW5jdHVhdGlvbjogL1xcKC9cblx0XHR9XG5cdH0sXG5cdCdudW1iZXInOiAvXFxiLT8oMHhbXFxkQS1GYS1mXSt8XFxkKlxcLj9cXGQrKFtFZV0tP1xcZCspPylcXGIvZyxcblx0J29wZXJhdG9yJzogL1stK117MSwyfXwhfDw9P3w+PT98PXsxLDN9fCZ7MSwyfXxcXHw/XFx8fFxcP3xcXCp8XFwvfFxcfnxcXF58XFwlL2csXG5cdCdpZ25vcmUnOiAvJihsdHxndHxhbXApOy9naSxcblx0J3B1bmN0dWF0aW9uJzogL1t7fVtcXF07KCksLjpdL2dcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9wcmlzbWpzL2NvbXBvbmVudHMvcHJpc20tY2xpa2UuanNcbiAqKiBtb2R1bGUgaWQgPSA2MFxuICoqIG1vZHVsZSBjaHVua3MgPSA2IDlcbiAqKi8iLCJQcmlzbS5sYW5ndWFnZXMuamF2YXNjcmlwdCA9IFByaXNtLmxhbmd1YWdlcy5leHRlbmQoJ2NsaWtlJywge1xuXHQna2V5d29yZCc6IC9cXGIoYnJlYWt8Y2FzZXxjYXRjaHxjbGFzc3xjb25zdHxjb250aW51ZXxkZWJ1Z2dlcnxkZWZhdWx0fGRlbGV0ZXxkb3xlbHNlfGVudW18ZXhwb3J0fGV4dGVuZHN8ZmFsc2V8ZmluYWxseXxmb3J8ZnVuY3Rpb258Z2V0fGlmfGltcGxlbWVudHN8aW1wb3J0fGlufGluc3RhbmNlb2Z8aW50ZXJmYWNlfGxldHxuZXd8bnVsbHxwYWNrYWdlfHByaXZhdGV8cHJvdGVjdGVkfHB1YmxpY3xyZXR1cm58c2V0fHN0YXRpY3xzdXBlcnxzd2l0Y2h8dGhpc3x0aHJvd3x0cnVlfHRyeXx0eXBlb2Z8dmFyfHZvaWR8d2hpbGV8d2l0aHx5aWVsZClcXGIvZyxcblx0J251bWJlcic6IC9cXGItPygweFtcXGRBLUZhLWZdK3xcXGQqXFwuP1xcZCsoW0VlXVsrLV0/XFxkKyk/fE5hTnwtP0luZmluaXR5KVxcYi9nLFxuXHQnZnVuY3Rpb24nOiAvKD8hXFxkKVthLXowLTlfJF0rKD89XFwoKS9pZ1xufSk7XG5cblByaXNtLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoJ2phdmFzY3JpcHQnLCAna2V5d29yZCcsIHtcblx0J3JlZ2V4Jzoge1xuXHRcdHBhdHRlcm46IC8oXnxbXi9dKVxcLyg/IVxcLykoXFxbLis/XXxcXFxcLnxbXi9cXHJcXG5dKStcXC9bZ2ltXXswLDN9KD89XFxzKigkfFtcXHJcXG4sLjt9KV0pKS9nLFxuXHRcdGxvb2tiZWhpbmQ6IHRydWVcblx0fVxufSk7XG5cbmlmIChQcmlzbS5sYW5ndWFnZXMubWFya3VwKSB7XG5cdFByaXNtLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoJ21hcmt1cCcsICd0YWcnLCB7XG5cdFx0J3NjcmlwdCc6IHtcblx0XHRcdHBhdHRlcm46IC88c2NyaXB0W1xcd1xcV10qPz5bXFx3XFxXXSo/PFxcL3NjcmlwdD4vaWcsXG5cdFx0XHRpbnNpZGU6IHtcblx0XHRcdFx0J3RhZyc6IHtcblx0XHRcdFx0XHRwYXR0ZXJuOiAvPHNjcmlwdFtcXHdcXFddKj8+fDxcXC9zY3JpcHQ+L2lnLFxuXHRcdFx0XHRcdGluc2lkZTogUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cC50YWcuaW5zaWRlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHJlc3Q6IFByaXNtLmxhbmd1YWdlcy5qYXZhc2NyaXB0XG5cdFx0XHR9LFxuXHRcdFx0YWxpYXM6ICdsYW5ndWFnZS1qYXZhc2NyaXB0J1xuXHRcdH1cblx0fSk7XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9wcmlzbWpzL2NvbXBvbmVudHMvcHJpc20tamF2YXNjcmlwdC5qc1xuICoqIG1vZHVsZSBpZCA9IDYxXG4gKiogbW9kdWxlIGNodW5rcyA9IDYgOVxuICoqLyIsIihmdW5jdGlvbihQcmlzbSkge1xuXG4vLyBJZ25vcmUgY29tbWVudHMgc3RhcnRpbmcgd2l0aCB7IHRvIHByaXZpbGVnZSBzdHJpbmcgaW50ZXJwb2xhdGlvbiBoaWdobGlnaHRpbmdcbnZhciBjb21tZW50ID0gLyMoPyFcXHspLisvZyxcbiAgICBpbnRlcnBvbGF0aW9uID0ge1xuICAgIFx0cGF0dGVybjogLyNcXHtbXn1dK1xcfS9nLFxuICAgIFx0YWxpYXM6ICd2YXJpYWJsZSdcbiAgICB9O1xuXG5QcmlzbS5sYW5ndWFnZXMuY29mZmVlc2NyaXB0ID0gUHJpc20ubGFuZ3VhZ2VzLmV4dGVuZCgnamF2YXNjcmlwdCcsIHtcblx0J2NvbW1lbnQnOiBjb21tZW50LFxuXHQnc3RyaW5nJzogW1xuXG5cdFx0Ly8gU3RyaW5ncyBhcmUgbXVsdGlsaW5lXG5cdFx0LycoPzpcXFxcP1tcXHNcXFNdKSo/Jy9nLFxuXG5cdFx0e1xuXHRcdFx0Ly8gU3RyaW5ncyBhcmUgbXVsdGlsaW5lXG5cdFx0XHRwYXR0ZXJuOiAvXCIoPzpcXFxcP1tcXHNcXFNdKSo/XCIvZyxcblx0XHRcdGluc2lkZToge1xuXHRcdFx0XHQnaW50ZXJwb2xhdGlvbic6IGludGVycG9sYXRpb25cblx0XHRcdH1cblx0XHR9XG5cdF0sXG5cdCdrZXl3b3JkJzogL1xcYihhbmR8YnJlYWt8Ynl8Y2F0Y2h8Y2xhc3N8Y29udGludWV8ZGVidWdnZXJ8ZGVsZXRlfGRvfGVhY2h8ZWxzZXxleHRlbmR8ZXh0ZW5kc3xmYWxzZXxmaW5hbGx5fGZvcnxpZnxpbnxpbnN0YW5jZW9mfGlzfGlzbnR8bGV0fGxvb3B8bmFtZXNwYWNlfG5ld3xub3xub3R8bnVsbHxvZnxvZmZ8b258b3J8b3dufHJldHVybnxzdXBlcnxzd2l0Y2h8dGhlbnx0aGlzfHRocm93fHRydWV8dHJ5fHR5cGVvZnx1bmRlZmluZWR8dW5sZXNzfHVudGlsfHdoZW58d2hpbGV8d2luZG93fHdpdGh8eWVzfHlpZWxkKVxcYi9nLFxuXHQnY2xhc3MtbWVtYmVyJzoge1xuXHRcdHBhdHRlcm46IC9AKD8hXFxkKVxcdysvLFxuXHRcdGFsaWFzOiAndmFyaWFibGUnXG5cdH1cbn0pO1xuXG5QcmlzbS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCdjb2ZmZWVzY3JpcHQnLCAnY29tbWVudCcsIHtcblx0J211bHRpbGluZS1jb21tZW50Jzoge1xuXHRcdHBhdHRlcm46IC8jIyNbXFxzXFxTXSs/IyMjL2csXG5cdFx0YWxpYXM6ICdjb21tZW50J1xuXHR9LFxuXG5cdC8vIEJsb2NrIHJlZ2V4cCBjYW4gY29udGFpbiBjb21tZW50cyBhbmQgaW50ZXJwb2xhdGlvblxuXHQnYmxvY2stcmVnZXgnOiB7XG5cdFx0cGF0dGVybjogL1xcL3szfVtcXHNcXFNdKj9cXC97M30vLFxuXHRcdGFsaWFzOiAncmVnZXgnLFxuXHRcdGluc2lkZToge1xuXHRcdFx0J2NvbW1lbnQnOiBjb21tZW50LFxuXHRcdFx0J2ludGVycG9sYXRpb24nOiBpbnRlcnBvbGF0aW9uXG5cdFx0fVxuXHR9XG59KTtcblxuUHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZSgnY29mZmVlc2NyaXB0JywgJ3N0cmluZycsIHtcblx0J2lubGluZS1qYXZhc2NyaXB0Jzoge1xuXHRcdHBhdHRlcm46IC9gKD86XFxcXD9bXFxzXFxTXSkqP2AvZyxcblx0XHRpbnNpZGU6IHtcblx0XHRcdCdkZWxpbWl0ZXInOiB7XG5cdFx0XHRcdHBhdHRlcm46IC9eYHxgJC9nLFxuXHRcdFx0XHRhbGlhczogJ3B1bmN0dWF0aW9uJ1xuXHRcdFx0fSxcblx0XHRcdHJlc3Q6IFByaXNtLmxhbmd1YWdlcy5qYXZhc2NyaXB0XG5cdFx0fVxuXHR9LFxuXG5cdC8vIEJsb2NrIHN0cmluZ3Ncblx0J211bHRpbGluZS1zdHJpbmcnOiBbXG5cdFx0e1xuXHRcdFx0cGF0dGVybjogLycnJ1tcXHNcXFNdKj8nJycvLFxuXHRcdFx0YWxpYXM6ICdzdHJpbmcnXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRwYXR0ZXJuOiAvXCJcIlwiW1xcc1xcU10qP1wiXCJcIi8sXG5cdFx0XHRhbGlhczogJ3N0cmluZycsXG5cdFx0XHRpbnNpZGU6IHtcblx0XHRcdFx0aW50ZXJwb2xhdGlvbjogaW50ZXJwb2xhdGlvblxuXHRcdFx0fVxuXHRcdH1cblx0XVxuXG59KTtcblxuUHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZSgnY29mZmVlc2NyaXB0JywgJ2tleXdvcmQnLCB7XG5cdC8vIE9iamVjdCBwcm9wZXJ0eVxuXHQncHJvcGVydHknOiAvKD8hXFxkKVxcdysoPz1cXHMqOig/ITopKS9nXG59KTtcblxufShQcmlzbSkpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3ByaXNtanMvY29tcG9uZW50cy9wcmlzbS1jb2ZmZWVzY3JpcHQuanNcbiAqKiBtb2R1bGUgaWQgPSA2MlxuICoqIG1vZHVsZSBjaHVua3MgPSA2IDlcbiAqKi8iLCJQcmlzbS5sYW5ndWFnZXMuaHR0cCA9IHtcbiAgICAncmVxdWVzdC1saW5lJzoge1xuICAgICAgICBwYXR0ZXJuOiAvXihQT1NUfEdFVHxQVVR8REVMRVRFfE9QVElPTlN8UEFUQ0h8VFJBQ0V8Q09OTkVDVClcXGJcXHNodHRwcz86XFwvXFwvXFxTK1xcc0hUVFBcXC9bMC05Ll0rL2csXG4gICAgICAgIGluc2lkZToge1xuICAgICAgICAgICAgLy8gSFRUUCBWZXJiXG4gICAgICAgICAgICBwcm9wZXJ0eTogL15cXGIoUE9TVHxHRVR8UFVUfERFTEVURXxPUFRJT05TfFBBVENIfFRSQUNFfENPTk5FQ1QpXFxiL2csXG4gICAgICAgICAgICAvLyBQYXRoIG9yIHF1ZXJ5IGFyZ3VtZW50XG4gICAgICAgICAgICAnYXR0ci1uYW1lJzogLzpcXHcrL2dcbiAgICAgICAgfVxuICAgIH0sXG4gICAgJ3Jlc3BvbnNlLXN0YXR1cyc6IHtcbiAgICAgICAgcGF0dGVybjogL15IVFRQXFwvMS5bMDFdIFswLTldKy4qL2csXG4gICAgICAgIGluc2lkZToge1xuICAgICAgICAgICAgLy8gU3RhdHVzLCBlLmcuIDIwMCBPS1xuICAgICAgICAgICAgcHJvcGVydHk6IC9bMC05XStbQS1aXFxzLV0rJC9pZ1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvLyBIVFRQIGhlYWRlciBuYW1lXG4gICAga2V5d29yZDogL15bXFx3LV0rOig/PS4rKS9nbVxufTtcblxuLy8gQ3JlYXRlIGEgbWFwcGluZyBvZiBDb250ZW50LVR5cGUgaGVhZGVycyB0byBsYW5ndWFnZSBkZWZpbml0aW9uc1xudmFyIGh0dHBMYW5ndWFnZXMgPSB7XG4gICAgJ2FwcGxpY2F0aW9uL2pzb24nOiBQcmlzbS5sYW5ndWFnZXMuamF2YXNjcmlwdCxcbiAgICAnYXBwbGljYXRpb24veG1sJzogUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cCxcbiAgICAndGV4dC94bWwnOiBQcmlzbS5sYW5ndWFnZXMubWFya3VwLFxuICAgICd0ZXh0L2h0bWwnOiBQcmlzbS5sYW5ndWFnZXMubWFya3VwXG59O1xuXG4vLyBJbnNlcnQgZWFjaCBjb250ZW50IHR5cGUgcGFyc2VyIHRoYXQgaGFzIGl0cyBhc3NvY2lhdGVkIGxhbmd1YWdlXG4vLyBjdXJyZW50bHkgbG9hZGVkLlxuZm9yICh2YXIgY29udGVudFR5cGUgaW4gaHR0cExhbmd1YWdlcykge1xuICAgIGlmIChodHRwTGFuZ3VhZ2VzW2NvbnRlbnRUeXBlXSkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgICAgICBvcHRpb25zW2NvbnRlbnRUeXBlXSA9IHtcbiAgICAgICAgICAgIHBhdHRlcm46IG5ldyBSZWdFeHAoJyhjb250ZW50LXR5cGU6XFxcXHMqJyArIGNvbnRlbnRUeXBlICsgJ1tcXFxcd1xcXFxXXSo/KVxcXFxuXFxcXG5bXFxcXHdcXFxcV10qJywgJ2dpJyksXG4gICAgICAgICAgICBsb29rYmVoaW5kOiB0cnVlLFxuICAgICAgICAgICAgaW5zaWRlOiB7XG4gICAgICAgICAgICAgICAgcmVzdDogaHR0cExhbmd1YWdlc1tjb250ZW50VHlwZV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgUHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZSgnaHR0cCcsICdrZXl3b3JkJywgb3B0aW9ucyk7XG4gICAgfVxufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcHJpc21qcy9jb21wb25lbnRzL3ByaXNtLWh0dHAuanNcbiAqKiBtb2R1bGUgaWQgPSA2M1xuICoqIG1vZHVsZSBjaHVua3MgPSA2IDlcbiAqKi8iLCJQcmlzbS5sYW5ndWFnZXMuc2NzcyA9IFByaXNtLmxhbmd1YWdlcy5leHRlbmQoJ2NzcycsIHtcblx0J2NvbW1lbnQnOiB7XG5cdFx0cGF0dGVybjogLyhefFteXFxcXF0pKFxcL1xcKltcXHdcXFddKj9cXCpcXC98XFwvXFwvLio/KFxccj9cXG58JCkpL2csXG5cdFx0bG9va2JlaGluZDogdHJ1ZVxuXHR9LFxuXHQvLyBhdHVybGUgaXMganVzdCB0aGUgQCoqKiwgbm90IHRoZSBlbnRpcmUgcnVsZSAodG8gaGlnaGxpZ2h0IHZhciAmIHN0dWZmcylcblx0Ly8gKyBhZGQgYWJpbGl0eSB0byBoaWdobGlnaHQgbnVtYmVyICYgdW5pdCBmb3IgbWVkaWEgcXVlcmllc1xuXHQnYXRydWxlJzogL0BbXFx3LV0rKD89XFxzKyhcXCh8XFx7fDspKS9naSxcblx0Ly8gdXJsLCBjb21wYXNzaWZpZWRcblx0J3VybCc6IC8oWy1hLXpdKy0pKnVybCg/PVxcKCkvZ2ksXG5cdC8vIENTUyBzZWxlY3RvciByZWdleCBpcyBub3QgYXBwcm9wcmlhdGUgZm9yIFNhc3Ncblx0Ly8gc2luY2UgdGhlcmUgY2FuIGJlIGxvdCBtb3JlIHRoaW5ncyAodmFyLCBAIGRpcmVjdGl2ZSwgbmVzdGluZy4uKVxuXHQvLyBhIHNlbGVjdG9yIG11c3Qgc3RhcnQgYXQgdGhlIGVuZCBvZiBhIHByb3BlcnR5IG9yIGFmdGVyIGEgYnJhY2UgKGVuZCBvZiBvdGhlciBydWxlcyBvciBuZXN0aW5nKVxuXHQvLyBpdCBjYW4gY29udGFpbiBzb21lIGNhcmFjdGVycyB0aGF0IGFyZW4ndCB1c2VkIGZvciBkZWZpbmluZyBydWxlcyBvciBlbmQgb2Ygc2VsZWN0b3IsICYgKHBhcmVudCBzZWxlY3RvciksIG9yIGludGVycG9sYXRlZCB2YXJpYWJsZVxuXHQvLyB0aGUgZW5kIG9mIGEgc2VsZWN0b3IgaXMgZm91bmQgd2hlbiB0aGVyZSBpcyBubyBydWxlcyBpbiBpdCAoIHt9IG9yIHtcXHN9KSBvciBpZiB0aGVyZSBpcyBhIHByb3BlcnR5IChiZWNhdXNlIGFuIGludGVycG9sYXRlZCB2YXJcblx0Ly8gY2FuIFwicGFzc1wiIGFzIGEgc2VsZWN0b3ItIGUuZzogcHJvcGVyI3skZXJ0eX0pXG5cdC8vIHRoaXMgb25lIHdhcyBhcmQgdG8gZG8sIHNvIHBsZWFzZSBiZSBjYXJlZnVsIGlmIHlvdSBlZGl0IHRoaXMgb25lIDopXG5cdCdzZWxlY3Rvcic6IC8oW15AO1xce1xcfVxcKFxcKV0/KFteQDtcXHtcXH1cXChcXCldfCZ8XFwjXFx7XFwkWy1fXFx3XStcXH0pKykoPz1cXHMqXFx7KFxcfXxcXHN8W15cXH1dKyg6fFxceylbXlxcfV0rKSkvZ21cbn0pO1xuXG5QcmlzbS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCdzY3NzJywgJ2F0cnVsZScsIHtcblx0J2tleXdvcmQnOiAvQChpZnxlbHNlIGlmfGVsc2V8Zm9yfGVhY2h8d2hpbGV8aW1wb3J0fGV4dGVuZHxkZWJ1Z3x3YXJufG1peGlufGluY2x1ZGV8ZnVuY3Rpb258cmV0dXJufGNvbnRlbnQpfCg/PUBmb3JcXHMrXFwkWy1fXFx3XStcXHMpK2Zyb20vaVxufSk7XG5cblByaXNtLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoJ3Njc3MnLCAncHJvcGVydHknLCB7XG5cdC8vIHZhciBhbmQgaW50ZXJwb2xhdGVkIHZhcnNcblx0J3ZhcmlhYmxlJzogLygoXFwkWy1fXFx3XSspfCgjXFx7XFwkWy1fXFx3XStcXH0pKS9pXG59KTtcblxuUHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZSgnc2NzcycsICdmdW5jdGlvbicsIHtcblx0J3BsYWNlaG9sZGVyJzogLyVbLV9cXHddKy9pLFxuXHQnc3RhdGVtZW50JzogL1xcQiEoZGVmYXVsdHxvcHRpb25hbClcXGIvZ2ksXG5cdCdib29sZWFuJzogL1xcYih0cnVlfGZhbHNlKVxcYi9nLFxuXHQnbnVsbCc6IC9cXGIobnVsbClcXGIvZyxcblx0J29wZXJhdG9yJzogL1xccysoWy0rXXsxLDJ9fD17MSwyfXwhPXxcXHw/XFx8fFxcP3xcXCp8XFwvfFxcJSlcXHMrL2dcbn0pO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcHJpc21qcy9jb21wb25lbnRzL3ByaXNtLXNjc3MuanNcbiAqKiBtb2R1bGUgaWQgPSA2NFxuICoqIG1vZHVsZSBjaHVua3MgPSA2IDlcbiAqKi8iLCJQcmlzbS5sYW5ndWFnZXMuc3FsPSB7IFxuXHQnY29tbWVudCc6IHtcblx0XHRwYXR0ZXJuOiAvKF58W15cXFxcXSkoXFwvXFwqW1xcd1xcV10qP1xcKlxcL3woKC0tKXwoXFwvXFwvKXwjKS4qPyhcXHI/XFxufCQpKS9nLFxuXHRcdGxvb2tiZWhpbmQ6IHRydWVcblx0fSxcblx0J3N0cmluZycgOiB7XG5cdFx0cGF0dGVybjogLyhefFteQF0pKFwifCcpKFxcXFw/W1xcc1xcU10pKj9cXDIvZyxcblx0XHRsb29rYmVoaW5kOiB0cnVlXG5cdH0sXG5cdCd2YXJpYWJsZSc6IC9AW1xcdy4kXSt8QChcInwnfGApKFxcXFw/W1xcc1xcU10pKz9cXDEvZyxcblx0J2Z1bmN0aW9uJzogL1xcYig/OkNPVU5UfFNVTXxBVkd8TUlOfE1BWHxGSVJTVHxMQVNUfFVDQVNFfExDQVNFfE1JRHxMRU58Uk9VTkR8Tk9XfEZPUk1BVCkoPz1cXHMqXFwoKS9pZywgLy8gU2hvdWxkIHdlIGhpZ2hsaWdodCB1c2VyIGRlZmluZWQgZnVuY3Rpb25zIHRvbz9cblx0J2tleXdvcmQnOiAvXFxiKD86QUNUSU9OfEFERHxBRlRFUnxBTEdPUklUSE18QUxURVJ8QU5BTFlaRXxBUFBMWXxBU3xBU0N8QVVUSE9SSVpBVElPTnxCQUNLVVB8QkRCfEJFR0lOfEJFUktFTEVZREJ8QklHSU5UfEJJTkFSWXxCSVR8QkxPQnxCT09MfEJPT0xFQU58QlJFQUt8QlJPV1NFfEJUUkVFfEJVTEt8Qll8Q0FMTHxDQVNDQURFfENBU0NBREVEfENBU0V8Q0hBSU58Q0hBUiBWQVJZSU5HfENIQVJBQ1RFUiBWQVJZSU5HfENIRUNLfENIRUNLUE9JTlR8Q0xPU0V8Q0xVU1RFUkVEfENPQUxFU0NFfENPTFVNTnxDT0xVTU5TfENPTU1FTlR8Q09NTUlUfENPTU1JVFRFRHxDT01QVVRFfENPTk5FQ1R8Q09OU0lTVEVOVHxDT05TVFJBSU5UfENPTlRBSU5TfENPTlRBSU5TVEFCTEV8Q09OVElOVUV8Q09OVkVSVHxDUkVBVEV8Q1JPU1N8Q1VSUkVOVHxDVVJSRU5UX0RBVEV8Q1VSUkVOVF9USU1FfENVUlJFTlRfVElNRVNUQU1QfENVUlJFTlRfVVNFUnxDVVJTT1J8REFUQXxEQVRBQkFTRXxEQVRBQkFTRVN8REFURVRJTUV8REJDQ3xERUFMTE9DQVRFfERFQ3xERUNJTUFMfERFQ0xBUkV8REVGQVVMVHxERUZJTkVSfERFTEFZRUR8REVMRVRFfERFTll8REVTQ3xERVNDUklCRXxERVRFUk1JTklTVElDfERJU0FCTEV8RElTQ0FSRHxESVNLfERJU1RJTkNUfERJU1RJTkNUUk9XfERJU1RSSUJVVEVEfERPfERPVUJMRXxET1VCTEUgUFJFQ0lTSU9OfERST1B8RFVNTVl8RFVNUHxEVU1QRklMRXxEVVBMSUNBVEUgS0VZfEVMU0V8RU5BQkxFfEVOQ0xPU0VEIEJZfEVORHxFTkdJTkV8RU5VTXxFUlJMVkx8RVJST1JTfEVTQ0FQRXxFU0NBUEVEIEJZfEVYQ0VQVHxFWEVDfEVYRUNVVEV8RVhJVHxFWFBMQUlOfEVYVEVOREVEfEZFVENIfEZJRUxEU3xGSUxFfEZJTExGQUNUT1J8RklSU1R8RklYRUR8RkxPQVR8Rk9MTE9XSU5HfEZPUnxGT1IgRUFDSCBST1d8Rk9SQ0V8Rk9SRUlHTnxGUkVFVEVYVHxGUkVFVEVYVFRBQkxFfEZST018RlVMTHxGVU5DVElPTnxHRU9NRVRSWXxHRU9NRVRSWUNPTExFQ1RJT058R0xPQkFMfEdPVE98R1JBTlR8R1JPVVB8SEFORExFUnxIQVNIfEhBVklOR3xIT0xETE9DS3xJREVOVElUWXxJREVOVElUWV9JTlNFUlR8SURFTlRJVFlDT0x8SUZ8SUdOT1JFfElNUE9SVHxJTkRFWHxJTkZJTEV8SU5ORVJ8SU5OT0RCfElOT1VUfElOU0VSVHxJTlR8SU5URUdFUnxJTlRFUlNFQ1R8SU5UT3xJTlZPS0VSfElTT0xBVElPTiBMRVZFTHxKT0lOfEtFWXxLRVlTfEtJTEx8TEFOR1VBR0UgU1FMfExBU1R8TEVGVHxMSU1JVHxMSU5FTk98TElORVN8TElORVNUUklOR3xMT0FEfExPQ0FMfExPQ0t8TE9OR0JMT0J8TE9OR1RFWFR8TUFUQ0h8TUFUQ0hFRHxNRURJVU1CTE9CfE1FRElVTUlOVHxNRURJVU1URVhUfE1FUkdFfE1JRERMRUlOVHxNT0RJRklFUyBTUUwgREFUQXxNT0RJRll8TVVMVElMSU5FU1RSSU5HfE1VTFRJUE9JTlR8TVVMVElQT0xZR09OfE5BVElPTkFMfE5BVElPTkFMIENIQVIgVkFSWUlOR3xOQVRJT05BTCBDSEFSQUNURVJ8TkFUSU9OQUwgQ0hBUkFDVEVSIFZBUllJTkd8TkFUSU9OQUwgVkFSQ0hBUnxOQVRVUkFMfE5DSEFSfE5DSEFSIFZBUkNIQVJ8TkVYVHxOT3xOTyBTUUx8Tk9DSEVDS3xOT0NZQ0xFfE5PTkNMVVNURVJFRHxOVUxMSUZ8TlVNRVJJQ3xPRnxPRkZ8T0ZGU0VUU3xPTnxPUEVOfE9QRU5EQVRBU09VUkNFfE9QRU5RVUVSWXxPUEVOUk9XU0VUfE9QVElNSVpFfE9QVElPTnxPUFRJT05BTExZfE9SREVSfE9VVHxPVVRFUnxPVVRGSUxFfE9WRVJ8UEFSVElBTHxQQVJUSVRJT058UEVSQ0VOVHxQSVZPVHxQTEFOfFBPSU5UfFBPTFlHT058UFJFQ0VESU5HfFBSRUNJU0lPTnxQUkVWfFBSSU1BUll8UFJJTlR8UFJJVklMRUdFU3xQUk9DfFBST0NFRFVSRXxQVUJMSUN8UFVSR0V8UVVJQ0t8UkFJU0VSUk9SfFJFQUR8UkVBRFMgU1FMIERBVEF8UkVBRFRFWFR8UkVBTHxSRUNPTkZJR1VSRXxSRUZFUkVOQ0VTfFJFTEVBU0V8UkVOQU1FfFJFUEVBVEFCTEV8UkVQTElDQVRJT058UkVRVUlSRXxSRVNUT1JFfFJFU1RSSUNUfFJFVFVSTnxSRVRVUk5TfFJFVk9LRXxSSUdIVHxST0xMQkFDS3xST1VUSU5FfFJPV0NPVU5UfFJPV0dVSURDT0x8Uk9XUz98UlRSRUV8UlVMRXxTQVZFfFNBVkVQT0lOVHxTQ0hFTUF8U0VMRUNUfFNFUklBTHxTRVJJQUxJWkFCTEV8U0VTU0lPTnxTRVNTSU9OX1VTRVJ8U0VUfFNFVFVTRVJ8U0hBUkUgTU9ERXxTSE9XfFNIVVRET1dOfFNJTVBMRXxTTUFMTElOVHxTTkFQU0hPVHxTT01FfFNPTkFNRXxTVEFSVHxTVEFSVElORyBCWXxTVEFUSVNUSUNTfFNUQVRVU3xTVFJJUEVEfFNZU1RFTV9VU0VSfFRBQkxFfFRBQkxFU3xUQUJMRVNQQUNFfFRFTVAoPzpPUkFSWSk/fFRFTVBUQUJMRXxURVJNSU5BVEVEIEJZfFRFWFR8VEVYVFNJWkV8VEhFTnxUSU1FU1RBTVB8VElOWUJMT0J8VElOWUlOVHxUSU5ZVEVYVHxUT3xUT1B8VFJBTnxUUkFOU0FDVElPTnxUUkFOU0FDVElPTlN8VFJJR0dFUnxUUlVOQ0FURXxUU0VRVUFMfFRZUEV8VFlQRVN8VU5CT1VOREVEfFVOQ09NTUlUVEVEfFVOREVGSU5FRHxVTklPTnxVTlBJVk9UfFVQREFURXxVUERBVEVURVhUfFVTQUdFfFVTRXxVU0VSfFVTSU5HfFZBTFVFfFZBTFVFU3xWQVJCSU5BUll8VkFSQ0hBUnxWQVJDSEFSQUNURVJ8VkFSWUlOR3xWSUVXfFdBSVRGT1J8V0FSTklOR1N8V0hFTnxXSEVSRXxXSElMRXxXSVRIfFdJVEggUk9MTFVQfFdJVEhJTnxXT1JLfFdSSVRFfFdSSVRFVEVYVClcXGIvZ2ksXG5cdCdib29sZWFuJzogL1xcYig/OlRSVUV8RkFMU0V8TlVMTClcXGIvZ2ksXG5cdCdudW1iZXInOiAvXFxiLT8oMHgpP1xcZCpcXC4/W1xcZGEtZl0rXFxiL2csXG5cdCdvcGVyYXRvcic6IC9cXGIoPzpBTEx8QU5EfEFOWXxCRVRXRUVOfEVYSVNUU3xJTnxMSUtFfE5PVHxPUnxJU3xVTklRVUV8Q0hBUkFDVEVSIFNFVHxDT0xMQVRFfERJVnxPRkZTRVR8UkVHRVhQfFJMSUtFfFNPVU5EUyBMSUtFfFhPUilcXGJ8Wy0rXXsxfXwhfFs9PD5dezEsMn18KCYpezEsMn18XFx8P1xcfHxcXD98XFwqfFxcLy9naSxcblx0J3B1bmN0dWF0aW9uJzogL1s7W1xcXSgpYCwuXS9nXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3ByaXNtanMvY29tcG9uZW50cy9wcmlzbS1zcWwuanNcbiAqKiBtb2R1bGUgaWQgPSA2NVxuICoqIG1vZHVsZSBjaHVua3MgPSA2IDlcbiAqKi8iLCIvKipcbiAqIE9yaWdpbmFsIGJ5IEFhcm9uIEhhcnVuOiBodHRwOi8vYWFoYWNyZWF0aXZlLmNvbS8yMDEyLzA3LzMxL3BocC1zeW50YXgtaGlnaGxpZ2h0aW5nLXByaXNtL1xuICogTW9kaWZpZWQgYnkgTWlsZXMgSm9obnNvbjogaHR0cDovL21pbGVzai5tZVxuICpcbiAqIFN1cHBvcnRzIHRoZSBmb2xsb3dpbmc6XG4gKiBcdFx0LSBFeHRlbmRzIGNsaWtlIHN5bnRheFxuICogXHRcdC0gU3VwcG9ydCBmb3IgUEhQIDUuMysgKG5hbWVzcGFjZXMsIHRyYWl0cywgZ2VuZXJhdG9ycywgZXRjKVxuICogXHRcdC0gU21hcnRlciBjb25zdGFudCBhbmQgZnVuY3Rpb24gbWF0Y2hpbmdcbiAqXG4gKiBBZGRzIHRoZSBmb2xsb3dpbmcgbmV3IHRva2VuIGNsYXNzZXM6XG4gKiBcdFx0Y29uc3RhbnQsIGRlbGltaXRlciwgdmFyaWFibGUsIGZ1bmN0aW9uLCBwYWNrYWdlXG4gKi9cblxuUHJpc20ubGFuZ3VhZ2VzLnBocCA9IFByaXNtLmxhbmd1YWdlcy5leHRlbmQoJ2NsaWtlJywge1xuXHQna2V5d29yZCc6IC9cXGIoYW5kfG9yfHhvcnxhcnJheXxhc3xicmVha3xjYXNlfGNmdW5jdGlvbnxjbGFzc3xjb25zdHxjb250aW51ZXxkZWNsYXJlfGRlZmF1bHR8ZGllfGRvfGVsc2V8ZWxzZWlmfGVuZGRlY2xhcmV8ZW5kZm9yfGVuZGZvcmVhY2h8ZW5kaWZ8ZW5kc3dpdGNofGVuZHdoaWxlfGV4dGVuZHN8Zm9yfGZvcmVhY2h8ZnVuY3Rpb258aW5jbHVkZXxpbmNsdWRlX29uY2V8Z2xvYmFsfGlmfG5ld3xyZXR1cm58c3RhdGljfHN3aXRjaHx1c2V8cmVxdWlyZXxyZXF1aXJlX29uY2V8dmFyfHdoaWxlfGFic3RyYWN0fGludGVyZmFjZXxwdWJsaWN8aW1wbGVtZW50c3xwcml2YXRlfHByb3RlY3RlZHxwYXJlbnR8dGhyb3d8bnVsbHxlY2hvfHByaW50fHRyYWl0fG5hbWVzcGFjZXxmaW5hbHx5aWVsZHxnb3RvfGluc3RhbmNlb2Z8ZmluYWxseXx0cnl8Y2F0Y2gpXFxiL2lnLFxuXHQnY29uc3RhbnQnOiAvXFxiW0EtWjAtOV9dezIsfVxcYi9nLFxuXHQnY29tbWVudCc6IHtcblx0XHRwYXR0ZXJuOiAvKF58W15cXFxcXSkoXFwvXFwqW1xcd1xcV10qP1xcKlxcL3woXnxbXjpdKShcXC9cXC98IykuKj8oXFxyP1xcbnwkKSkvZyxcblx0XHRsb29rYmVoaW5kOiB0cnVlXG5cdH1cbn0pO1xuXG5QcmlzbS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCdwaHAnLCAna2V5d29yZCcsIHtcblx0J2RlbGltaXRlcic6IC8oXFw/Pnw8XFw/cGhwfDxcXD8pL2lnLFxuXHQndmFyaWFibGUnOiAvKFxcJFxcdyspXFxiL2lnLFxuXHQncGFja2FnZSc6IHtcblx0XHRwYXR0ZXJuOiAvKFxcXFx8bmFtZXNwYWNlXFxzK3x1c2VcXHMrKVtcXHdcXFxcXSsvZyxcblx0XHRsb29rYmVoaW5kOiB0cnVlLFxuXHRcdGluc2lkZToge1xuXHRcdFx0cHVuY3R1YXRpb246IC9cXFxcL1xuXHRcdH1cblx0fVxufSk7XG5cbi8vIE11c3QgYmUgZGVmaW5lZCBhZnRlciB0aGUgZnVuY3Rpb24gcGF0dGVyblxuUHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZSgncGhwJywgJ29wZXJhdG9yJywge1xuXHQncHJvcGVydHknOiB7XG5cdFx0cGF0dGVybjogLygtPilbXFx3XSsvZyxcblx0XHRsb29rYmVoaW5kOiB0cnVlXG5cdH1cbn0pO1xuXG4vLyBBZGQgSFRNTCBzdXBwb3J0IG9mIHRoZSBtYXJrdXAgbGFuZ3VhZ2UgZXhpc3RzXG5pZiAoUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cCkge1xuXG5cdC8vIFRva2VuaXplIGFsbCBpbmxpbmUgUEhQIGJsb2NrcyB0aGF0IGFyZSB3cmFwcGVkIGluIDw/cGhwID8+XG5cdC8vIFRoaXMgYWxsb3dzIGZvciBlYXN5IFBIUCArIG1hcmt1cCBoaWdobGlnaHRpbmdcblx0UHJpc20uaG9va3MuYWRkKCdiZWZvcmUtaGlnaGxpZ2h0JywgZnVuY3Rpb24oZW52KSB7XG5cdFx0aWYgKGVudi5sYW5ndWFnZSAhPT0gJ3BocCcpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRlbnYudG9rZW5TdGFjayA9IFtdO1xuXG5cdFx0ZW52LmJhY2t1cENvZGUgPSBlbnYuY29kZTtcblx0XHRlbnYuY29kZSA9IGVudi5jb2RlLnJlcGxhY2UoLyg/OjxcXD9waHB8PFxcPylbXFx3XFxXXSo/KD86XFw/PikvaWcsIGZ1bmN0aW9uKG1hdGNoKSB7XG5cdFx0XHRlbnYudG9rZW5TdGFjay5wdXNoKG1hdGNoKTtcblxuXHRcdFx0cmV0dXJuICd7e3tQSFAnICsgZW52LnRva2VuU3RhY2subGVuZ3RoICsgJ319fSc7XG5cdFx0fSk7XG5cdH0pO1xuXG5cdC8vIFJlc3RvcmUgZW52LmNvZGUgZm9yIG90aGVyIHBsdWdpbnMgKGUuZy4gbGluZS1udW1iZXJzKVxuXHRQcmlzbS5ob29rcy5hZGQoJ2JlZm9yZS1pbnNlcnQnLCBmdW5jdGlvbihlbnYpIHtcblx0XHRpZiAoZW52Lmxhbmd1YWdlID09PSAncGhwJykge1xuXHRcdFx0ZW52LmNvZGUgPSBlbnYuYmFja3VwQ29kZTtcblx0XHRcdGRlbGV0ZSBlbnYuYmFja3VwQ29kZTtcblx0XHR9XG5cdH0pO1xuXG5cdC8vIFJlLWluc2VydCB0aGUgdG9rZW5zIGFmdGVyIGhpZ2hsaWdodGluZ1xuXHRQcmlzbS5ob29rcy5hZGQoJ2FmdGVyLWhpZ2hsaWdodCcsIGZ1bmN0aW9uKGVudikge1xuXHRcdGlmIChlbnYubGFuZ3VhZ2UgIT09ICdwaHAnKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Zm9yICh2YXIgaSA9IDAsIHQ7IHQgPSBlbnYudG9rZW5TdGFja1tpXTsgaSsrKSB7XG5cdFx0XHRlbnYuaGlnaGxpZ2h0ZWRDb2RlID0gZW52LmhpZ2hsaWdodGVkQ29kZS5yZXBsYWNlKCd7e3tQSFAnICsgKGkgKyAxKSArICd9fX0nLCBQcmlzbS5oaWdobGlnaHQodCwgZW52LmdyYW1tYXIsICdwaHAnKSk7XG5cdFx0fVxuXG5cdFx0ZW52LmVsZW1lbnQuaW5uZXJIVE1MID0gZW52LmhpZ2hsaWdodGVkQ29kZTtcblx0fSk7XG5cblx0Ly8gV3JhcCB0b2tlbnMgaW4gY2xhc3NlcyB0aGF0IGFyZSBtaXNzaW5nIHRoZW1cblx0UHJpc20uaG9va3MuYWRkKCd3cmFwJywgZnVuY3Rpb24oZW52KSB7XG5cdFx0aWYgKGVudi5sYW5ndWFnZSA9PT0gJ3BocCcgJiYgZW52LnR5cGUgPT09ICdtYXJrdXAnKSB7XG5cdFx0XHRlbnYuY29udGVudCA9IGVudi5jb250ZW50LnJlcGxhY2UoLyhcXHtcXHtcXHtQSFBbMC05XStcXH1cXH1cXH0pL2csIFwiPHNwYW4gY2xhc3M9XFxcInRva2VuIHBocFxcXCI+JDE8L3NwYW4+XCIpO1xuXHRcdH1cblx0fSk7XG5cblx0Ly8gQWRkIHRoZSBydWxlcyBiZWZvcmUgYWxsIG90aGVyc1xuXHRQcmlzbS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCdwaHAnLCAnY29tbWVudCcsIHtcblx0XHQnbWFya3VwJzoge1xuXHRcdFx0cGF0dGVybjogLzxbXj9dXFwvPyguKj8pPi9nLFxuXHRcdFx0aW5zaWRlOiBQcmlzbS5sYW5ndWFnZXMubWFya3VwXG5cdFx0fSxcblx0XHQncGhwJzogL1xce1xce1xce1BIUFswLTldK1xcfVxcfVxcfS9nXG5cdH0pO1xufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcHJpc21qcy9jb21wb25lbnRzL3ByaXNtLXBocC5qc1xuICoqIG1vZHVsZSBpZCA9IDY2XG4gKiogbW9kdWxlIGNodW5rcyA9IDYgOVxuICoqLyIsIlByaXNtLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoJ3BocCcsICd2YXJpYWJsZScsIHtcblx0J3RoaXMnOiAvXFwkdGhpcy9nLFxuXHQnZ2xvYmFsJzogL1xcJF8/KEdMT0JBTFN8U0VSVkVSfEdFVHxQT1NUfEZJTEVTfFJFUVVFU1R8U0VTU0lPTnxFTlZ8Q09PS0lFfEhUVFBfUkFXX1BPU1RfREFUQXxhcmdjfGFyZ3Z8cGhwX2Vycm9ybXNnfGh0dHBfcmVzcG9uc2VfaGVhZGVyKS9nLFxuXHQnc2NvcGUnOiB7XG5cdFx0cGF0dGVybjogL1xcYltcXHdcXFxcXSs6Oi9nLFxuXHRcdGluc2lkZToge1xuXHRcdFx0a2V5d29yZDogLyhzdGF0aWN8c2VsZnxwYXJlbnQpLyxcblx0XHRcdHB1bmN0dWF0aW9uOiAvKDo6fFxcXFwpL1xuXHRcdH1cblx0fVxufSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcHJpc21qcy9jb21wb25lbnRzL3ByaXNtLXBocC1leHRyYXMuanNcbiAqKiBtb2R1bGUgaWQgPSA2N1xuICoqIG1vZHVsZSBjaHVua3MgPSA2IDlcbiAqKi8iLCJQcmlzbS5sYW5ndWFnZXMucHl0aG9uPSB7IFxuXHQnY29tbWVudCc6IHtcblx0XHRwYXR0ZXJuOiAvKF58W15cXFxcXSkjLio/KFxccj9cXG58JCkvZyxcblx0XHRsb29rYmVoaW5kOiB0cnVlXG5cdH0sXG5cdCdzdHJpbmcnOiAvXCJcIlwiW1xcc1xcU10rP1wiXCJcInwnJydbXFxzXFxTXSs/JycnfChcInwnKShcXFxcPy4pKj9cXDEvZyxcblx0J2tleXdvcmQnIDogL1xcYihhc3xhc3NlcnR8YnJlYWt8Y2xhc3N8Y29udGludWV8ZGVmfGRlbHxlbGlmfGVsc2V8ZXhjZXB0fGV4ZWN8ZmluYWxseXxmb3J8ZnJvbXxnbG9iYWx8aWZ8aW1wb3J0fGlufGlzfGxhbWJkYXxwYXNzfHByaW50fHJhaXNlfHJldHVybnx0cnl8d2hpbGV8d2l0aHx5aWVsZClcXGIvZyxcblx0J2Jvb2xlYW4nIDogL1xcYihUcnVlfEZhbHNlKVxcYi9nLFxuXHQnbnVtYmVyJyA6IC9cXGItPygwW2JveF0pPyg/OltcXGRhLWZdK1xcLj9cXGQqfFxcLlxcZCspKD86ZVsrLV0/XFxkKyk/aj9cXGIvZ2ksXG5cdCdvcGVyYXRvcicgOiAvWy0rXXsxLDJ9fD0/Jmx0O3w9PyZndDt8IXw9ezEsMn18KCYpezEsMn18KCZhbXA7KXsxLDJ9fFxcfD9cXHx8XFw/fFxcKnxcXC98fnxcXF58JXxcXGIob3J8YW5kfG5vdClcXGIvZyxcblx0J2lnbm9yZScgOiAvJihsdHxndHxhbXApOy9naSxcblx0J3B1bmN0dWF0aW9uJyA6IC9be31bXFxdOygpLC46XS9nXG59O1xuXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9wcmlzbWpzL2NvbXBvbmVudHMvcHJpc20tcHl0aG9uLmpzXG4gKiogbW9kdWxlIGlkID0gNjhcbiAqKiBtb2R1bGUgY2h1bmtzID0gNiA5XG4gKiovIiwiLyoqXG4gKiBPcmlnaW5hbCBieSBTYW11ZWwgRmxvcmVzXG4gKlxuICogQWRkcyB0aGUgZm9sbG93aW5nIG5ldyB0b2tlbiBjbGFzc2VzOlxuICogXHRcdGNvbnN0YW50LCBidWlsdGluLCB2YXJpYWJsZSwgc3ltYm9sLCByZWdleFxuICovXG5QcmlzbS5sYW5ndWFnZXMucnVieSA9IFByaXNtLmxhbmd1YWdlcy5leHRlbmQoJ2NsaWtlJywge1xuXHQnY29tbWVudCc6IC8jW15cXHJcXG5dKihcXHI/XFxufCQpL2csXG5cdCdrZXl3b3JkJzogL1xcYihhbGlhc3xhbmR8QkVHSU58YmVnaW58YnJlYWt8Y2FzZXxjbGFzc3xkZWZ8ZGVmaW5lX21ldGhvZHxkZWZpbmVkfGRvfGVhY2h8ZWxzZXxlbHNpZnxFTkR8ZW5kfGVuc3VyZXxmYWxzZXxmb3J8aWZ8aW58bW9kdWxlfG5ld3xuZXh0fG5pbHxub3R8b3J8cmFpc2V8cmVkb3xyZXF1aXJlfHJlc2N1ZXxyZXRyeXxyZXR1cm58c2VsZnxzdXBlcnx0aGVufHRocm93fHRydWV8dW5kZWZ8dW5sZXNzfHVudGlsfHdoZW58d2hpbGV8eWllbGQpXFxiL2csXG5cdCdidWlsdGluJzogL1xcYihBcnJheXxCaWdudW18QmluZGluZ3xDbGFzc3xDb250aW51YXRpb258RGlyfEV4Y2VwdGlvbnxGYWxzZUNsYXNzfEZpbGV8U3RhdHxGaWxlfEZpeG51bXxGbG9hZHxIYXNofEludGVnZXJ8SU98TWF0Y2hEYXRhfE1ldGhvZHxNb2R1bGV8TmlsQ2xhc3N8TnVtZXJpY3xPYmplY3R8UHJvY3xSYW5nZXxSZWdleHB8U3RyaW5nfFN0cnVjdHxUTVN8U3ltYm9sfFRocmVhZEdyb3VwfFRocmVhZHxUaW1lfFRydWVDbGFzcylcXGIvLFxuXHQnY29uc3RhbnQnOiAvXFxiW0EtWl1bYS16QS1aXzAtOV0qWz8hXT9cXGIvZ1xufSk7XG5cblByaXNtLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoJ3J1YnknLCAna2V5d29yZCcsIHtcblx0J3JlZ2V4Jzoge1xuXHRcdHBhdHRlcm46IC8oXnxbXi9dKVxcLyg/IVxcLykoXFxbLis/XXxcXFxcLnxbXi9cXHJcXG5dKStcXC9bZ2ltXXswLDN9KD89XFxzKigkfFtcXHJcXG4sLjt9KV0pKS9nLFxuXHRcdGxvb2tiZWhpbmQ6IHRydWVcblx0fSxcblx0J3ZhcmlhYmxlJzogL1tAJF0rXFxiW2EtekEtWl9dW2EtekEtWl8wLTldKls/IV0/XFxiL2csXG5cdCdzeW1ib2wnOiAvOlxcYlthLXpBLVpfXVthLXpBLVpfMC05XSpbPyFdP1xcYi9nXG59KTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3ByaXNtanMvY29tcG9uZW50cy9wcmlzbS1ydWJ5LmpzXG4gKiogbW9kdWxlIGlkID0gNjlcbiAqKiBtb2R1bGUgY2h1bmtzID0gNiA5XG4gKiovIiwiUHJpc20ubGFuZ3VhZ2VzLmphdmEgPSBQcmlzbS5sYW5ndWFnZXMuZXh0ZW5kKCdjbGlrZScsIHtcblx0J2tleXdvcmQnOiAvXFxiKGFic3RyYWN0fGNvbnRpbnVlfGZvcnxuZXd8c3dpdGNofGFzc2VydHxkZWZhdWx0fGdvdG98cGFja2FnZXxzeW5jaHJvbml6ZWR8Ym9vbGVhbnxkb3xpZnxwcml2YXRlfHRoaXN8YnJlYWt8ZG91YmxlfGltcGxlbWVudHN8cHJvdGVjdGVkfHRocm93fGJ5dGV8ZWxzZXxpbXBvcnR8cHVibGljfHRocm93c3xjYXNlfGVudW18aW5zdGFuY2VvZnxyZXR1cm58dHJhbnNpZW50fGNhdGNofGV4dGVuZHN8aW50fHNob3J0fHRyeXxjaGFyfGZpbmFsfGludGVyZmFjZXxzdGF0aWN8dm9pZHxjbGFzc3xmaW5hbGx5fGxvbmd8c3RyaWN0ZnB8dm9sYXRpbGV8Y29uc3R8ZmxvYXR8bmF0aXZlfHN1cGVyfHdoaWxlKVxcYi9nLFxuXHQnbnVtYmVyJzogL1xcYjBiWzAxXStcXGJ8XFxiMHhbXFxkYS1mXSpcXC4/W1xcZGEtZnBcXC1dK1xcYnxcXGJcXGQqXFwuP1xcZCtbZV0/W1xcZF0qW2RmXVxcYnxcXGJcXGQqXFwuP1xcZCtcXGIvZ2ksXG5cdCdvcGVyYXRvcic6IHtcblx0XHRwYXR0ZXJuOiAvKF58W15cXC5dKSg/OlxcKz18XFwrXFwrP3wtPXwtLT98IT0/fDx7MSwyfT0/fD57MSwzfT0/fD09P3wmPXwmJj98XFx8PXxcXHxcXHw/fFxcP3xcXCo9P3xcXC89P3wlPT98XFxePT98Onx+KS9nbSxcblx0XHRsb29rYmVoaW5kOiB0cnVlXG5cdH1cbn0pO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3ByaXNtanMvY29tcG9uZW50cy9wcmlzbS1qYXZhLmpzXG4gKiogbW9kdWxlIGlkID0gNzBcbiAqKiBtb2R1bGUgY2h1bmtzID0gNiA5XG4gKiovIiwiXG5mdW5jdGlvbiBhZGRMaW5lTnVtYmVycyhwcmUpIHtcblxuICB2YXIgbGluZXNOdW0gPSAoMSArIHByZS5pbm5lckhUTUwuc3BsaXQoJ1xcbicpLmxlbmd0aCk7XG4gIHZhciBsaW5lTnVtYmVyc1dyYXBwZXI7XG5cbiAgdmFyIGxpbmVzID0gbmV3IEFycmF5KGxpbmVzTnVtKTtcbiAgbGluZXMgPSBsaW5lcy5qb2luKCc8c3Bhbj48L3NwYW4+Jyk7XG5cbiAgbGluZU51bWJlcnNXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICBsaW5lTnVtYmVyc1dyYXBwZXIuY2xhc3NOYW1lID0gJ2xpbmUtbnVtYmVycy1yb3dzJztcbiAgbGluZU51bWJlcnNXcmFwcGVyLmlubmVySFRNTCA9IGxpbmVzO1xuXG4gIGlmIChwcmUuaGFzQXR0cmlidXRlKCdkYXRhLXN0YXJ0JykpIHtcbiAgICBwcmUuc3R5bGUuY291bnRlclJlc2V0ID0gJ2xpbmVudW1iZXIgJyArIE51bWJlcihwcmUuZGF0YXNldC5zdGFydCkgLSAxO1xuICB9XG5cbiAgcHJlLmFwcGVuZENoaWxkKGxpbmVOdW1iZXJzV3JhcHBlcik7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBhZGRMaW5lTnVtYmVycztcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vY2xpZW50L3ByaXNtL2FkZExpbmVOdW1iZXJzLmpzXG4gKiovIiwiXG5mdW5jdGlvbiBpc1Njcm9sbGVkSW50b1ZpZXcoZWxlbSkge1xuICB2YXIgY29vcmRzID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICB2YXIgdmlzaWJsZUhlaWdodCA9IDA7XG5cbiAgaWYgKGNvb3Jkcy50b3AgPCAwKSB7XG4gICAgdmlzaWJsZUhlaWdodCA9IGNvb3Jkcy5ib3R0b207XG4gIH0gZWxzZSBpZiAoY29vcmRzLmJvdHRvbSA+IHdpbmRvdy5pbm5lckhlaWdodCkge1xuICAgIHZpc2libGVIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSB0b3A7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gdmlzaWJsZUhlaWdodCA+IDEwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU2Nyb2xsZWRJbnRvVmlldztcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vY2xpZW50L2lzU2Nyb2xsZWRJbnRvVmlldy5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIiwiZmlsZSI6InR1dG9yaWFsLjdjNWVlZDI5NGU4NjE0ZWVlYjExLmpzIn0=