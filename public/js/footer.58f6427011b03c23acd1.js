var footer=webpackJsonp_name_([2],{0:function(e,t,n){"use strict";var i=n(18),o=n(19),r=n(20);t.init=function(){i(),window.devicePixelRatio>1&&o(),r()}},18:function(e,t,n){"use strict";var i=n(45);e.exports=function(){function e(e){var t=e.clientX+r;t+o.offsetWidth>document.documentElement.clientWidth&&(t=Math.max(0,e.clientX-r-o.offsetWidth)),o.style.left=t+"px";var n=e.clientY+s;n+o.offsetHeight>document.documentElement.clientHeight&&(n=Math.max(0,e.clientY-s-o.offsetHeight)),o.style.top=n+"px"}function t(t){var n=t.target.closest("a");n&&(n.closest(".toolbar")||(o=document.createElement("span"),o.className="link__type",n.getAttribute("data-tooltip")?o.setAttribute("data-tooltip",n.getAttribute("data-tooltip")):o.setAttribute("data-url",n.getAttribute("href")),document.body.appendChild(o),e(t),document.addEventListener("mousemove",e)))}function n(){o&&(document.removeEventListener("mousemove",e),o.remove(),o=null)}var o=null,r=8,s=10,a=i(t,n);document.addEventListener("mouseover",function(e){e.target.closest("a")&&a.call(this,e)}),document.addEventListener("mouseout",a)}},19:function(e){"use strict";e.exports=function(){for(var e=document.querySelectorAll('figure img[src$=".png"]'),t=0;t<e.length;t++)!function(){var n=e[t];n.onload=function(){if(delete this.onload,!this.src.match(/@2x.png$/)){var e=new Image;e.onload=function(){this.width&&this.height&&(n.src=this.src)},e.src=this.src.replace(".png","@2x.png")}},n.complete&&n.onload()}()}},20:function(e){"use strict";function t(){for(var e=document.querySelectorAll("[data-sticky]"),t=0;t<e.length;t++){var i=e[t];if(i.getBoundingClientRect().top<0){if(i.style.cssText)throw Error("data-sticky element may not have style");var o=n(i);i.parentNode.insertBefore(o,i),i.style.position="fixed",i.style.top=0,i.style.zIndex=1,i.style.background="white",i.style.margin=0,i.style.width=o.offsetWidth+"px",i.placeholder=o}else i.placeholder&&i.placeholder.getBoundingClientRect().top>0&&(i.style.cssText="",i.placeholder.remove(),i.placeholder=null)}}function n(e){var t=document.createElement("div"),n=getComputedStyle(e);return t.style.width=e.offsetWidth+"px",t.style.marginLeft=n.marginLeft,t.style.marginRight=n.marginRight,t.style.height=e.offsetHeight+"px",t.style.marginBottom=n.marginBottom,t.style.marginTop=n.marginTop,t}e.exports=function(){window.addEventListener("scroll",t),t()}},45:function(e){"use strict";function t(e,t){function n(e){o=e.pageX,r=e.pageY}function i(e,t){return t.hoverIntentTimer=clearTimeout(t.hoverIntentTimer),Math.sqrt((s-o)*(s-o)+(a-r)*(a-r))<c.sensitivity?(t.removeEventListener("mousemove",n),t.hoverIntentState=!0,void c.over.call(t,e)):(s=o,a=r,void(t.hoverIntentTimer=setTimeout(function(){i(e,t)},c.interval)))}var o,r,s,a,c={interval:150,sensitivity:8,timeout:0,over:e,out:t};return function(e){this.hoverIntentTimer&&(clearTimeout(this.hoverIntentTimer),delete this.hoverIntentTimer),"mouseover"===e.type?(s=e.pageX,a=e.pageY,this.addEventListener("mousemove",n),this.hoverIntentState||(this.hoverIntentTimer=setTimeout(function(){i(e,this)}.bind(this),c.interval))):(this.removeEventListener("mousemove",n),this.hoverIntentState&&(this.hoverIntentTimer=setTimeout(function(){this.hoverIntentState=!1,c.out.call(this,e)}.bind(this),c.timeout)))}}e.exports=void 0===document.ontouchstart?t:function(){return function(){}}}});