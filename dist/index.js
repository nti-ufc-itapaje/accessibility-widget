"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/accessibility.ts
var accessibility_exports = {};
__export(accessibility_exports, {
  Accessibility: () => main_default,
  AccessibilityModulesType: () => AccessibilityModulesType,
  applyTheme: () => applyTheme,
  createModule: () => createModule,
  createModules: () => createModules,
  createThemeCss: () => createThemeCss,
  default: () => accessibility_default,
  ptBRLabels: () => ptBRLabels,
  removeTheme: () => removeTheme
});
module.exports = __toCommonJS(accessibility_exports);

// src/common.ts
var _Common = class _Common {
  constructor() {
    this.body = document.body || document.querySelector("body");
    this.deployedMap = /* @__PURE__ */ new Map();
  }
  isIOS() {
    if (typeof this._isIOS === "boolean") return this._isIOS;
    const devices = ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"];
    this._isIOS = !!navigator.platform && devices.some((d) => navigator.platform === d);
    return this._isIOS;
  }
  jsonToHtml(obj) {
    var _a, _b, _c;
    let elm = document.createElement(obj.type);
    for (let i in obj.attrs) {
      elm.setAttribute(i, obj.attrs[i]);
    }
    for (const child of (_a = obj.children) != null ? _a : []) {
      let newElem = null;
      if (child.type === "#text") {
        newElem = document.createTextNode((_b = child.text) != null ? _b : "");
      } else {
        newElem = this.jsonToHtml(child);
      }
      if (((_c = newElem == null ? void 0 : newElem.tagName) == null ? void 0 : _c.toLowerCase()) !== "undefined" || newElem.nodeType === 3)
        elm.appendChild(newElem);
    }
    return elm;
  }
  injectStyle(css, innerOptions = {}) {
    let sheet = document.createElement("style");
    sheet.appendChild(document.createTextNode(css));
    if (innerOptions.className) sheet.classList.add(innerOptions.className);
    this.body.appendChild(sheet);
    return sheet;
  }
  getFormattedDim(value) {
    if (!value) return null;
    value = String(value);
    const by = (val, suffix) => ({
      size: val.substring(0, val.indexOf(suffix)),
      suffix
    });
    if (value.includes("%")) return by(value, "%");
    if (value.includes("rem")) return by(value, "rem");
    if (value.includes("px")) return by(value, "px");
    if (value.includes("em")) return by(value, "em");
    if (value.includes("pt")) return by(value, "pt");
    if (value === "auto") return by(value, "");
    return null;
  }
  extend(src, dest) {
    for (let i in src) {
      if (typeof src[i] === "object") {
        if (dest && dest[i]) {
          if (dest[i] instanceof Array) src[i] = dest[i];
          else src[i] = this.extend(src[i], dest[i]);
        }
      } else if (typeof dest === "object" && typeof dest[i] !== "undefined") {
        src[i] = dest[i];
      }
    }
    return src;
  }
  injectIconsFont(urls, callback) {
    if (!(urls == null ? void 0 : urls.length)) return;
    let head = document.getElementsByTagName("head")[0];
    let counter = 0;
    let hasErrors = false;
    let onload = (e) => {
      if (typeof e === "string" || e.type === "error") hasErrors = true;
      if (!--counter) callback(hasErrors);
    };
    urls.forEach((url) => {
      let link = document.createElement("link");
      link.type = "text/css";
      link.rel = "stylesheet";
      link.href = url;
      link.className = `_access-font-icon-${counter++}`;
      link.onload = onload;
      link.onerror = onload;
      this.deployedObjects.set("." + link.className, true);
      head.appendChild(link);
    });
  }
  getFixedFont(name) {
    if (this.isIOS()) return name.replaceAll(" ", "+");
    return name;
  }
  getFixedPseudoFont(name) {
    if (this.isIOS()) return name.replaceAll("+", " ");
    return name;
  }
  isFontLoaded(fontFamily, callback) {
    try {
      const onReady = () => callback(document.fonts.check(`1em ${fontFamily.replaceAll("+", " ")}`));
      document.fonts.ready.then(onReady, onReady);
    } catch (e) {
      callback(true);
    }
  }
  warn(msg) {
    const prefix = "AccessibilityWidget: ";
    (console.warn || console.log)(prefix + msg);
  }
  get deployedObjects() {
    return {
      get: (key) => this.deployedMap.get(key),
      contains: (key) => this.deployedMap.has(key),
      set: (key, val) => {
        this.deployedMap.set(key, val);
      },
      remove: (key) => {
        this.deployedMap.delete(key);
      },
      getAll: () => this.deployedMap
    };
  }
  createScreenshot(url) {
    return new Promise((resolve) => {
      if (!this._canvas) this._canvas = document.createElement("canvas");
      const img = new Image();
      this._canvas.style.cssText = "position:fixed;top:0;left:0;opacity:0.05;transform:scale(0.05)";
      img.crossOrigin = "anonymous";
      img.onload = () => {
        document.body.appendChild(this._canvas);
        const ctx = this._canvas.getContext("2d");
        this._canvas.width = img.naturalWidth;
        this._canvas.height = img.naturalHeight;
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        ctx.drawImage(img, 0, 0);
        let res = _Common.DEFAULT_PIXEL;
        try {
          res = this._canvas.toDataURL("image/png");
        } catch (e) {
        }
        resolve(res);
        this._canvas.remove();
      };
      img.onerror = () => resolve(_Common.DEFAULT_PIXEL);
      img.src = url;
    });
  }
  getFileExtension(filename) {
    return filename.substring(filename.lastIndexOf(".") + 1) || filename;
  }
};
_Common.DEFAULT_PIXEL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/QVDRcoAAAAASUVORK5CYII=";
var Common = _Common;

// src/interfaces/accessibility.interface.ts
var AccessibilityModulesType = /* @__PURE__ */ ((AccessibilityModulesType2) => {
  AccessibilityModulesType2[AccessibilityModulesType2["increaseText"] = 1] = "increaseText";
  AccessibilityModulesType2[AccessibilityModulesType2["increaseTextSpacing"] = 3] = "increaseTextSpacing";
  AccessibilityModulesType2[AccessibilityModulesType2["increaseLineHeight"] = 5] = "increaseLineHeight";
  AccessibilityModulesType2[AccessibilityModulesType2["invertColors"] = 7] = "invertColors";
  AccessibilityModulesType2[AccessibilityModulesType2["grayHues"] = 8] = "grayHues";
  AccessibilityModulesType2[AccessibilityModulesType2["bigCursor"] = 9] = "bigCursor";
  AccessibilityModulesType2[AccessibilityModulesType2["readingGuide"] = 10] = "readingGuide";
  AccessibilityModulesType2[AccessibilityModulesType2["underlineLinks"] = 11] = "underlineLinks";
  AccessibilityModulesType2[AccessibilityModulesType2["textToSpeech"] = 12] = "textToSpeech";
  AccessibilityModulesType2[AccessibilityModulesType2["disableAnimations"] = 14] = "disableAnimations";
  AccessibilityModulesType2[AccessibilityModulesType2["iframeModals"] = 15] = "iframeModals";
  AccessibilityModulesType2[AccessibilityModulesType2["customFunctions"] = 16] = "customFunctions";
  AccessibilityModulesType2[AccessibilityModulesType2["dyslexicFont"] = 17] = "dyslexicFont";
  AccessibilityModulesType2[AccessibilityModulesType2["hideImages"] = 18] = "hideImages";
  return AccessibilityModulesType2;
})(AccessibilityModulesType || {});

// src/menu-interface.ts
var MenuInterface = class {
  constructor(accessibility) {
    this._acc = accessibility;
    this.readBind = this._acc.read.bind(this._acc);
  }
  updateCycleButton(btn, level, max) {
    if (level > 0) btn.classList.add("active");
    else btn.classList.remove("active");
    let indicator = btn.querySelector("._access-cycle-indicator");
    if (!indicator) {
      indicator = document.createElement("div");
      indicator.className = "_access-cycle-indicator";
      for (let i = 0; i < max; i++) indicator.appendChild(document.createElement("span"));
      btn.appendChild(indicator);
    }
    indicator.querySelectorAll("span").forEach((span, i) => span.classList.toggle("filled", i < level));
  }
  refreshCycleButtons() {
    const find = (action) => {
      var _a;
      return (_a = this._acc.menu) == null ? void 0 : _a.querySelector(`[data-access-action="${action}"]`);
    };
    const t = find("increaseText");
    if (t) this.updateCycleButton(t, this._acc.sessionState.textSize, 3);
    const s = find("increaseTextSpacing");
    if (s) this.updateCycleButton(s, this._acc.sessionState.textSpace, 3);
    const l = find("increaseLineHeight");
    if (l) this.updateCycleButton(l, this._acc.sessionState.lineHeight, 3);
  }
  increaseText(_destroy, btn) {
    if (this._acc.sessionState.textSize >= 3) {
      this._acc.resetTextSize();
    } else {
      this._acc.alterTextSize(true);
    }
    if (btn) this.updateCycleButton(btn, this._acc.sessionState.textSize, 3);
  }
  increaseTextSpacing(_destroy, btn) {
    if (this._acc.sessionState.textSpace >= 3) {
      this._acc.resetTextSpace();
    } else {
      this._acc.alterTextSpace(true);
    }
    if (btn) this.updateCycleButton(btn, this._acc.sessionState.textSpace, 3);
  }
  increaseLineHeight(_destroy, btn) {
    if (this._acc.sessionState.lineHeight >= 3) {
      this._acc.resetLineHeight();
    } else {
      this._acc.alterLineHeight(true);
    }
    if (btn) this.updateCycleButton(btn, this._acc.sessionState.lineHeight, 3);
  }
  invertColors(destroy) {
    var _a, _b;
    const counterClass = "_access-invert-counter";
    const removeCounter = () => {
      var _a2;
      return (_a2 = document.querySelector("." + counterClass)) == null ? void 0 : _a2.remove();
    };
    if (typeof this._acc.stateValues.html.backgroundColor === "undefined")
      this._acc.stateValues.html.backgroundColor = getComputedStyle(this._acc.html).backgroundColor;
    if (typeof this._acc.stateValues.html.color === "undefined")
      this._acc.stateValues.html.color = getComputedStyle(this._acc.html).color;
    if (destroy) {
      this._acc.resetIfDefined(this._acc.stateValues.html.backgroundColor, this._acc.html.style, "backgroundColor");
      this._acc.resetIfDefined(this._acc.stateValues.html.color, this._acc.html.style, "color");
      if (!this._acc.options.suppressDomInjection)
        (_a = this._acc.menu.querySelector('[data-access-action="invertColors"]')) == null ? void 0 : _a.classList.remove("active");
      this._acc.stateValues.invertColors = false;
      this._acc.sessionState.invertColors = false;
      this._acc.onChange(true);
      this._acc.html.style.filter = "";
      removeCounter();
      return;
    }
    if (!this._acc.options.suppressDomInjection)
      (_b = this._acc.menu.querySelector('[data-access-action="invertColors"]')) == null ? void 0 : _b.classList.toggle("active");
    this._acc.stateValues.invertColors = !this._acc.stateValues.invertColors;
    this._acc.sessionState.invertColors = this._acc.stateValues.invertColors;
    this._acc.onChange(true);
    if (this._acc.stateValues.invertColors) {
      if (this._acc.stateValues.grayHues) this._acc.menuInterface.grayHues(true);
      this._acc.html.style.filter = "invert(1)";
      this._acc.common.injectStyle("._access { filter: invert(1) !important; }", { className: counterClass });
      this._acc.common.deployedObjects.set("." + counterClass, false);
      if (this._acc.stateValues.textToSpeech) this._acc.textToSpeech("Colors Inverted");
    } else {
      this._acc.html.style.filter = "";
      removeCounter();
      if (this._acc.stateValues.textToSpeech) this._acc.textToSpeech("Colors Set To Normal");
    }
  }
  grayHues(destroy) {
    var _a, _b;
    const overlayClass = "_access-gray-overlay";
    const removeOverlay = () => {
      var _a2;
      (_a2 = document.querySelector("." + overlayClass)) == null ? void 0 : _a2.remove();
    };
    if (destroy) {
      if (!this._acc.options.suppressDomInjection)
        (_a = this._acc.menu.querySelector('[data-access-action="grayHues"]')) == null ? void 0 : _a.classList.remove("active");
      this._acc.stateValues.grayHues = false;
      this._acc.sessionState.grayHues = false;
      this._acc.onChange(true);
      removeOverlay();
      return;
    }
    if (!this._acc.options.suppressDomInjection)
      (_b = this._acc.menu.querySelector('[data-access-action="grayHues"]')) == null ? void 0 : _b.classList.toggle("active");
    this._acc.stateValues.grayHues = !this._acc.stateValues.grayHues;
    this._acc.sessionState.grayHues = this._acc.stateValues.grayHues;
    this._acc.onChange(true);
    if (this._acc.stateValues.grayHues) {
      if (this._acc.stateValues.invertColors) this.invertColors(true);
      const overlay = document.createElement("div");
      overlay.className = overlayClass;
      overlay.style.cssText = "position:fixed;inset:0;z-index:9998;backdrop-filter:grayscale(1);-webkit-backdrop-filter:grayscale(1);pointer-events:none;";
      document.body.appendChild(overlay);
      this._acc.common.deployedObjects.set("." + overlayClass, false);
      if (this._acc.stateValues.textToSpeech) this._acc.textToSpeech("Gray Hues Enabled.");
    } else {
      removeOverlay();
      if (this._acc.stateValues.textToSpeech) this._acc.textToSpeech("Gray Hues Disabled.");
    }
  }
  underlineLinks(destroy) {
    var _a, _b, _c;
    const className = "_access-underline";
    const remove = () => {
      const style = document.querySelector("." + className);
      if (style) {
        style.parentElement.removeChild(style);
        this._acc.common.deployedObjects.remove("." + className);
      }
    };
    if (destroy) {
      this._acc.stateValues.underlineLinks = false;
      this._acc.sessionState.underlineLinks = false;
      this._acc.onChange(true);
      if (!this._acc.options.suppressDomInjection)
        (_a = this._acc.menu.querySelector('[data-access-action="underlineLinks"]')) == null ? void 0 : _a.classList.remove("active");
      return remove();
    }
    if (!this._acc.options.suppressDomInjection)
      (_b = this._acc.menu.querySelector('[data-access-action="underlineLinks"]')) == null ? void 0 : _b.classList.toggle("active");
    this._acc.stateValues.underlineLinks = !this._acc.stateValues.underlineLinks;
    this._acc.sessionState.underlineLinks = this._acc.stateValues.underlineLinks;
    this._acc.onChange(true);
    if (this._acc.stateValues.underlineLinks) {
      const parts = ((_c = this._acc.options.linkSelector) != null ? _c : "a").split(",").map((s) => s.trim());
      const rules = parts.flatMap((s) => [`body ${s}`, `body ${s} *`]).join(", ");
      this._acc.common.injectStyle(`${rules} { text-decoration: underline !important; }`, { className });
      this._acc.common.deployedObjects.set("." + className, true);
      if (this._acc.stateValues.textToSpeech) this._acc.textToSpeech("Links UnderLined");
    } else {
      if (this._acc.stateValues.textToSpeech) this._acc.textToSpeech("Links UnderLine Removed");
      remove();
    }
  }
  bigCursor(destroy) {
    var _a, _b;
    if (destroy) {
      this._acc.html.classList.remove("_access_cursor");
      if (!this._acc.options.suppressDomInjection)
        (_a = this._acc.menu.querySelector('[data-access-action="bigCursor"]')) == null ? void 0 : _a.classList.remove("active");
      this._acc.stateValues.bigCursor = false;
      this._acc.sessionState.bigCursor = false;
      this._acc.onChange(true);
      return;
    }
    if (!this._acc.options.suppressDomInjection)
      (_b = this._acc.menu.querySelector('[data-access-action="bigCursor"]')) == null ? void 0 : _b.classList.toggle("active");
    this._acc.stateValues.bigCursor = !this._acc.stateValues.bigCursor;
    this._acc.sessionState.bigCursor = this._acc.stateValues.bigCursor;
    this._acc.onChange(true);
    this._acc.html.classList.toggle("_access_cursor");
    if (this._acc.stateValues.textToSpeech)
      this._acc.textToSpeech(this._acc.stateValues.bigCursor ? "Big Cursor Enabled" : "Big Cursor Disabled");
  }
  readingGuide(destroy) {
    var _a, _b, _c, _d;
    if (destroy) {
      (_a = document.getElementById("access_read_guide_bar")) == null ? void 0 : _a.remove();
      if (!this._acc.options.suppressDomInjection)
        (_b = this._acc.menu.querySelector('[data-access-action="readingGuide"]')) == null ? void 0 : _b.classList.remove("active");
      this._acc.stateValues.readingGuide = false;
      this._acc.sessionState.readingGuide = false;
      this._acc.onChange(true);
      document.body.removeEventListener("touchmove", this._acc.updateReadGuide, false);
      document.body.removeEventListener("mousemove", this._acc.updateReadGuide, false);
      return;
    }
    if (!this._acc.options.suppressDomInjection)
      (_c = this._acc.menu.querySelector('[data-access-action="readingGuide"]')) == null ? void 0 : _c.classList.toggle("active");
    this._acc.stateValues.readingGuide = !this._acc.stateValues.readingGuide;
    this._acc.sessionState.readingGuide = this._acc.stateValues.readingGuide;
    this._acc.onChange(true);
    if (this._acc.stateValues.readingGuide) {
      const read = document.createElement("div");
      read.id = "access_read_guide_bar";
      read.classList.add("access_read_guide_bar");
      document.body.append(read);
      document.body.addEventListener("touchmove", this._acc.updateReadGuide, false);
      document.body.addEventListener("mousemove", this._acc.updateReadGuide, false);
    } else {
      (_d = document.getElementById("access_read_guide_bar")) == null ? void 0 : _d.remove();
      document.body.removeEventListener("touchmove", this._acc.updateReadGuide, false);
      document.body.removeEventListener("mousemove", this._acc.updateReadGuide, false);
      if (this._acc.stateValues.textToSpeech) this._acc.textToSpeech("Reading Guide Disabled");
    }
  }
  dispatchTextToSpeechState(state) {
    document.dispatchEvent(new CustomEvent("access:textToSpeech", { detail: { state } }));
  }
  textToSpeech(destroy) {
    var _a;
    const tSpeechList = this._acc.menu.querySelector('[data-access-action="textToSpeech"]');
    if (!tSpeechList) return;
    this._acc.onChange(false);
    const className = "_access-text-to-speech";
    const remove = () => {
      var _a2;
      const style = document.querySelector("." + className);
      if (style) {
        style.parentElement.removeChild(style);
        document.removeEventListener("click", this.readBind, false);
        document.removeEventListener("keyup", this.readBind, false);
        this._acc.common.deployedObjects.remove("." + className);
      }
      (_a2 = window.speechSynthesis) == null ? void 0 : _a2.cancel();
      this._acc.isReading = false;
    };
    if (destroy) {
      this.updateCycleButton(tSpeechList, 0, 3);
      this._acc.stateValues.textToSpeech = false;
      (_a = window.speechSynthesis) == null ? void 0 : _a.cancel();
      tSpeechList.removeAttribute("data-speech-rate");
      this.dispatchTextToSpeechState("off");
      return remove();
    }
    if (this._acc.stateValues.speechRate === 1 && !tSpeechList.classList.contains("active")) {
      this._acc.stateValues.textToSpeech = true;
      this._acc.textToSpeech("Screen Reader enabled. Reading Pace - Normal");
      this.updateCycleButton(tSpeechList, 1, 3);
      tSpeechList.setAttribute("data-speech-rate", "normal");
      this.dispatchTextToSpeechState("normal");
    } else if (this._acc.stateValues.speechRate === 1 && tSpeechList.classList.contains("active")) {
      this._acc.stateValues.speechRate = 1.5;
      this._acc.textToSpeech("Reading Pace - Fast");
      this.updateCycleButton(tSpeechList, 2, 3);
      tSpeechList.setAttribute("data-speech-rate", "fast");
      this.dispatchTextToSpeechState("fast");
    } else if (this._acc.stateValues.speechRate === 1.5 && tSpeechList.classList.contains("active")) {
      this._acc.stateValues.speechRate = 0.7;
      this._acc.textToSpeech("Reading Pace - Slow");
      this.updateCycleButton(tSpeechList, 3, 3);
      tSpeechList.setAttribute("data-speech-rate", "slow");
      this.dispatchTextToSpeechState("slow");
    } else {
      this._acc.stateValues.speechRate = 1;
      this._acc.textToSpeech("Screen Reader - Disabled");
      this.updateCycleButton(tSpeechList, 0, 3);
      tSpeechList.removeAttribute("data-speech-rate");
      this.dispatchTextToSpeechState("off");
      const timeout = setInterval(() => {
        if (this._acc.isReading) return;
        this._acc.stateValues.textToSpeech = false;
        remove();
        clearTimeout(timeout);
      }, 500);
      return;
    }
    if (tSpeechList.classList.contains("active") && this._acc.stateValues.speechRate === 1) {
      this._acc.common.injectStyle("*:hover { box-shadow: 2px 2px 2px rgba(180,180,180,0.7); }", { className });
      this._acc.common.deployedObjects.set("." + className, true);
      document.addEventListener("click", this.readBind, false);
      document.addEventListener("keyup", this.readBind, false);
    }
  }
  disableAnimations(destroy) {
    var _a;
    const className = "_access-disable-animations";
    const autoplayStopped = "data-autoplay-stopped";
    const remove = () => {
      var _a2, _b, _c;
      if (!this._acc.options.suppressDomInjection)
        (_a2 = this._acc.menu.querySelector('[data-access-action="disableAnimations"]')) == null ? void 0 : _a2.classList.remove("active");
      this._acc.stateValues.disableAnimations = false;
      (_c = (_b = document.querySelector("." + className)) == null ? void 0 : _b.parentElement) == null ? void 0 : _c.removeChild(document.querySelector("." + className));
      this._acc.common.deployedObjects.remove("." + className);
      document.querySelectorAll("[data-org-src]").forEach((img) => {
        const screenshot = img.src;
        img.setAttribute("src", img.getAttribute("data-org-src"));
        img.setAttribute("data-org-src", screenshot);
      });
      document.querySelectorAll(`video[${autoplayStopped}]`).forEach((v) => {
        v.setAttribute("autoplay", "");
        v.removeAttribute(autoplayStopped);
        v.play();
      });
    };
    if (destroy) {
      remove();
      return;
    }
    this._acc.stateValues.disableAnimations = !this._acc.stateValues.disableAnimations;
    if (!this._acc.stateValues.disableAnimations) {
      remove();
      return;
    }
    if (!this._acc.options.suppressDomInjection)
      (_a = this._acc.menu.querySelector('[data-access-action="disableAnimations"]')) == null ? void 0 : _a.classList.add("active");
    this._acc.common.injectStyle(
      "body * { animation-duration: 0.0ms !important; transition-duration: 0.0ms !important; }",
      { className }
    );
    this._acc.common.deployedObjects.set("." + className, true);
    document.querySelectorAll("img").forEach(async (img) => {
      const ext = this._acc.common.getFileExtension(img.src);
      if ((ext == null ? void 0 : ext.toLowerCase()) === "gif") {
        let screenshot = img.getAttribute("data-org-src");
        if (!screenshot) screenshot = await this._acc.common.createScreenshot(img.src);
        img.setAttribute("data-org-src", img.src);
        img.src = screenshot;
      }
    });
    document.querySelectorAll("video[autoplay]").forEach((v) => {
      v.setAttribute(autoplayStopped, "");
      v.removeAttribute("autoplay");
      v.pause();
    });
  }
  iframeModals(destroy, button) {
    if (!button) destroy = true;
    const close = () => {
      if (this._dialog) {
        this._dialog.classList.add("closing");
        setTimeout(() => {
          this._dialog.classList.remove("closing");
          this._dialog.close();
          this._dialog.remove();
          detach();
        }, 350);
      }
      button == null ? void 0 : button.classList.remove("active");
    };
    const onClose = () => close();
    const detach = () => {
      var _a, _b, _c;
      (_b = (_a = this._dialog) == null ? void 0 : _a.querySelector("button")) == null ? void 0 : _b.removeEventListener("click", onClose, false);
      (_c = this._dialog) == null ? void 0 : _c.removeEventListener("close", onClose);
    };
    if (destroy) {
      close();
      return;
    }
    button.classList.add("active");
    if (!this._dialog) this._dialog = document.createElement("dialog");
    this._dialog.classList.add("_access");
    this._dialog.innerHTML = "";
    this._dialog.appendChild(this._acc.common.jsonToHtml({
      type: "div",
      children: [
        {
          type: "div",
          children: [{
            type: "button",
            attrs: {
              role: "button",
              style: "position:absolute;top:15px;right:5px;cursor:pointer;font-size:16px!important;font-weight:bold;background:#f3f4f6;border:none;color:#d63c3c;padding:0;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;"
            },
            children: [{ type: "#text", text: "X" }]
          }]
        },
        {
          type: "div",
          children: [{
            type: "iframe",
            attrs: { src: button.getAttribute("data-access-url"), style: "width:50vw;height:50vh;padding:30px;" }
          }]
        }
      ]
    }));
    document.body.appendChild(this._dialog);
    this._dialog.querySelector("button").addEventListener("click", onClose, false);
    this._dialog.addEventListener("close", onClose);
    this._dialog.showModal();
  }
  formatHotkey(keys) {
    const names = { ctrlKey: "Ctrl", altKey: "Alt", shiftKey: "Shift", metaKey: "Meta" };
    return keys.map((val) => {
      var _a;
      return Number.isInteger(val) ? String.fromCharCode(val).toUpperCase() : (_a = names[val]) != null ? _a : val;
    }).join(" + ");
  }
  hotkeysHelp() {
    var _a, _b;
    if (!((_a = this._acc.options.hotkeys) == null ? void 0 : _a.enabled)) return;
    const close = () => {
      if (this._dialog) {
        this._dialog.classList.add("closing");
        setTimeout(() => {
          this._dialog.classList.remove("closing");
          this._dialog.close();
          this._dialog.remove();
          detach();
        }, 350);
      }
    };
    const onClose = () => close();
    const detach = () => {
      var _a2, _b2, _c;
      (_b2 = (_a2 = this._dialog) == null ? void 0 : _a2.querySelector("button")) == null ? void 0 : _b2.removeEventListener("click", onClose, false);
      (_c = this._dialog) == null ? void 0 : _c.removeEventListener("close", onClose);
    };
    const keys = this._acc.options.hotkeys.keys;
    const labels = this._acc.options.labels;
    const mods = (_b = this._acc.options.modules) != null ? _b : {};
    const rows = Object.keys(keys).filter((name) => name === "toggleMenu" || mods[name] !== false).map((name) => ({
      type: "li",
      children: [
        { type: "span", children: [{ type: "#text", text: name === "toggleMenu" ? labels.menuTitle : labels[name] }] },
        { type: "span", attrs: { class: "_access-hotkeys-help-combo" }, children: [{ type: "#text", text: this.formatHotkey(keys[name]) }] }
      ]
    }));
    if (!this._dialog) this._dialog = document.createElement("dialog");
    this._dialog.classList.add("_access");
    this._dialog.innerHTML = "";
    this._dialog.appendChild(this._acc.common.jsonToHtml({
      type: "div",
      children: [
        {
          type: "div",
          children: [{
            type: "button",
            attrs: {
              role: "button",
              style: "position:absolute;top:15px;right:5px;cursor:pointer;font-size:16px!important;font-weight:bold;background:#f3f4f6;border:none;color:#d63c3c;padding:0;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;"
            },
            children: [{ type: "#text", text: "X" }]
          }]
        },
        {
          type: "div",
          attrs: { style: "padding:30px; max-width:70vw;" },
          children: [
            { type: "h2", children: [{ type: "#text", text: labels.hotkeysHelpTitle }] },
            { type: "ul", attrs: { class: "_access-hotkeys-help-list" }, children: rows }
          ]
        }
      ]
    }));
    document.body.appendChild(this._dialog);
    this._dialog.querySelector("button").addEventListener("click", onClose, false);
    this._dialog.addEventListener("close", onClose);
    this._dialog.showModal();
  }
  customFunctions(destroy, button) {
    if (!button) return;
    const cf = this._acc.options.customFunctions[parseInt(button.getAttribute("data-access-custom-index"))];
    if (cf.toggle && button.classList.contains("active")) destroy = true;
    if (destroy) {
      if (cf.toggle) button.classList.remove("active");
      cf.method(cf, false);
    } else {
      if (cf.toggle) button.classList.add("active");
      cf.method(cf, true);
    }
  }
  dyslexicFont(destroy) {
    const className = "_access-dyslexic-font";
    const linkClassName = "_access-dyslexic-font-link";
    const btn = this._acc.menu.querySelector('[data-access-action="dyslexicFont"]');
    const remove = () => {
      var _a, _b;
      (_a = document.querySelector("." + className)) == null ? void 0 : _a.remove();
      (_b = document.querySelector("." + linkClassName)) == null ? void 0 : _b.remove();
      this._acc.common.deployedObjects.remove("." + linkClassName);
    };
    if (destroy) {
      this._acc.stateValues.dyslexicFont = false;
      btn == null ? void 0 : btn.classList.remove("active");
      remove();
      return;
    }
    this._acc.stateValues.dyslexicFont = !this._acc.stateValues.dyslexicFont;
    btn == null ? void 0 : btn.classList.toggle("active");
    if (this._acc.stateValues.dyslexicFont) {
      if (!document.querySelector("." + linkClassName)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css2?family=Lexend&display=swap";
        link.className = linkClassName;
        document.head.appendChild(link);
        this._acc.common.deployedObjects.set("." + linkClassName, true);
      }
      this._acc.common.injectStyle(
        `body *:not(._access):not(._access *) { font-family: 'Lexend', Arial, sans-serif !important; }`,
        { className }
      );
      this._acc.common.deployedObjects.set("." + className, false);
    } else {
      remove();
    }
  }
  hideImages(destroy) {
    var _a, _b;
    const className = "_access-hide-images";
    const btn = this._acc.menu.querySelector('[data-access-action="hideImages"]');
    if (destroy) {
      this._acc.stateValues.hideImages = false;
      btn == null ? void 0 : btn.classList.remove("active");
      (_a = document.querySelector("." + className)) == null ? void 0 : _a.remove();
      return;
    }
    this._acc.stateValues.hideImages = !this._acc.stateValues.hideImages;
    btn == null ? void 0 : btn.classList.toggle("active");
    if (this._acc.stateValues.hideImages) {
      this._acc.common.injectStyle(
        "img, picture, svg:not(._access svg) { visibility: hidden !important; } *:not(._access):not(._access *) { background-image: none !important; }",
        { className }
      );
      this._acc.common.deployedObjects.set("." + className, false);
    } else {
      (_b = document.querySelector("." + className)) == null ? void 0 : _b.remove();
    }
  }
};

// src/storage.ts
var Storage = class {
  has(key) {
    return Object.prototype.hasOwnProperty.call(window.localStorage, key);
  }
  set(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
  get(key) {
    const item = window.localStorage.getItem(key);
    try {
      return JSON.parse(item);
    } catch (e) {
      return item;
    }
  }
  clear() {
    window.localStorage.clear();
  }
  remove(key) {
    window.localStorage.removeItem(key);
  }
  isSupported() {
    const test = "_test";
    try {
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
};

// src/main.ts
var _Accessibility = class _Accessibility {
  constructor(options = {}) {
    this._isReading = false;
    var _a, _b, _c, _d;
    this._common = new Common();
    this._storage = new Storage();
    this._fixedDefaultFont = this._common.getFixedFont("Material Icons");
    this._options = this.defaultOptions;
    this.options = this._common.extend(this._options, options);
    this.addModuleOrderIfNotDefined();
    this.addDefaultOptions(options);
    this.disabledUnsupportedFeatures();
    this._onKeyDownBind = this.onKeyDown.bind(this);
    this._sessionState = {
      textSize: 0,
      textSpace: 0,
      lineHeight: 0,
      invertColors: false,
      grayHues: false,
      underlineLinks: false,
      bigCursor: false,
      readingGuide: false
    };
    if ((_a = this.options.icon) == null ? void 0 : _a.useEmojis) {
      this.fontFallback();
      this.build();
    } else {
      this._common.injectIconsFont((_c = (_b = this.options.icon) == null ? void 0 : _b.fontFaceSrc) != null ? _c : [], (hasError) => {
        var _a2;
        this.build();
        if ((_a2 = this.options.icon) == null ? void 0 : _a2.fontFamilyValidation) {
          setTimeout(() => {
            this._common.isFontLoaded(this.options.icon.fontFamilyValidation, (isLoaded) => {
              if (!isLoaded || hasError) {
                this._common.warn(`${this.options.icon.fontFamilyValidation} font not loaded, using emojis`);
                this.fontFallback();
                this.destroy();
                this.build();
              }
            });
          });
        }
      });
    }
    if ((_d = this.options.modules) == null ? void 0 : _d.textToSpeech) {
      window.addEventListener("beforeunload", () => {
        if (this._isReading) {
          window.speechSynthesis.cancel();
          this._isReading = false;
        }
      });
    }
  }
  get stateValues() {
    return this._stateValues;
  }
  set stateValues(value) {
    this._stateValues = value;
  }
  get html() {
    return this._html;
  }
  get body() {
    return this._body;
  }
  get menu() {
    return this._menu;
  }
  get sessionState() {
    return this._sessionState;
  }
  set sessionState(value) {
    this._sessionState = value;
  }
  get common() {
    return this._common;
  }
  get isReading() {
    return this._isReading;
  }
  set isReading(value) {
    this._isReading = value;
  }
  get fixedDefaultFont() {
    return this._fixedDefaultFont;
  }
  get defaultOptions() {
    const res = {
      icon: {
        img: "accessibility",
        fontFaceSrc: ["https://fonts.googleapis.com/icon?family=Material+Icons"],
        fontClass: "material-icons",
        useEmojis: false,
        closeIcon: "close",
        resetIcon: "refresh"
      },
      hotkeys: {
        enabled: false,
        helpTitles: true,
        keys: {
          toggleMenu: ["ctrlKey", "altKey", 65],
          increaseText: ["ctrlKey", "altKey", 70],
          increaseTextSpacing: ["ctrlKey", "altKey", 83],
          increaseLineHeight: ["ctrlKey", "altKey", 76],
          invertColors: ["ctrlKey", "altKey", 73],
          grayHues: ["ctrlKey", "altKey", 71],
          underlineLinks: ["ctrlKey", "altKey", 85],
          bigCursor: ["ctrlKey", "altKey", 67],
          readingGuide: ["ctrlKey", "altKey", 82],
          textToSpeech: ["ctrlKey", "altKey", 84],
          disableAnimations: ["ctrlKey", "altKey", 81],
          dyslexicFont: ["ctrlKey", "altKey", 68],
          hideImages: ["ctrlKey", "altKey", 72]
        }
      },
      guide: { cBorder: "#20ff69", cBackground: "#000000", height: "12px" },
      suppressCssInjection: false,
      suppressDomInjection: false,
      labels: {
        resetTitle: "Reset",
        closeTitle: "Close",
        menuTitle: "Accessibility Options",
        increaseText: "increase text size",
        increaseTextSpacing: "increase text spacing",
        invertColors: "invert colors",
        grayHues: "gray hues",
        bigCursor: "big cursor",
        readingGuide: "reading guide",
        underlineLinks: "underline links",
        textToSpeech: "text to speech",
        disableAnimations: "disable animations",
        increaseLineHeight: "increase line height",
        hotkeyPrefix: "Hotkey: ",
        hotkeysHelpTitle: "Keyboard shortcuts",
        dyslexicFont: "Dyslexic font",
        hideImages: "Hide images"
      },
      textPixelMode: false,
      textEmlMode: true,
      textSizeFactor: 12.5,
      animations: { buttons: true },
      modules: {
        increaseText: true,
        increaseTextSpacing: true,
        increaseLineHeight: true,
        invertColors: true,
        grayHues: true,
        bigCursor: true,
        readingGuide: true,
        underlineLinks: true,
        textToSpeech: true,
        disableAnimations: true,
        dyslexicFont: true,
        hideImages: true
      },
      modulesOrder: [],
      session: { persistent: true },
      iframeModals: [],
      customFunctions: [],
      statement: { url: "" },
      feedback: { url: "" },
      linkSelector: "a",
      logoImage: "https://cdn.jsdelivr.net/npm/ufc-itapaje-accessibility/dist/logo-ufc.png",
      language: { textToSpeechLang: "" }
    };
    Object.keys(AccessibilityModulesType).filter((k) => !isNaN(parseInt(k))).forEach((k) => {
      const n = parseInt(k);
      res.modulesOrder.push({ type: n, order: n });
    });
    return res;
  }
  initFontSize() {
    if (!this._htmlInitFS) {
      const htmlInitFS = this._common.getFormattedDim(getComputedStyle(this._html).fontSize);
      const bodyInitFS = this._common.getFormattedDim(getComputedStyle(this._body).fontSize);
      this._html.style.fontSize = htmlInitFS.size / 16 * 100 + "%";
      this._htmlOrgFontSize = this._html.style.fontSize;
      this._body.style.fontSize = bodyInitFS.size / htmlInitFS.size + "em";
    }
  }
  fontFallback() {
    this.options.icon.useEmojis = true;
    this.options.icon.img = "\u267F";
    this.options.icon.fontClass = "";
  }
  addDefaultOptions(options) {
    var _a, _b, _c, _d, _e;
    if ((_a = options.icon) == null ? void 0 : _a.closeIconElem) this.options.icon.closeIconElem = options.icon.closeIconElem;
    if ((_b = options.icon) == null ? void 0 : _b.resetIconElem) this.options.icon.resetIconElem = options.icon.resetIconElem;
    if ((_c = options.icon) == null ? void 0 : _c.imgElem) this.options.icon.imgElem = options.icon.imgElem;
    if (!this.options.icon.closeIconElem)
      this.options.icon.closeIconElem = { type: "#text", text: !this.options.icon.useEmojis ? (_d = this.options.icon.closeIcon) != null ? _d : "close" : "X" };
    if (!this.options.icon.resetIconElem)
      this.options.icon.resetIconElem = { type: "#text", text: !this.options.icon.useEmojis ? (_e = this.options.icon.resetIcon) != null ? _e : "refresh" : "\u2672" };
    if (!this.options.icon.imgElem)
      this.options.icon.imgElem = { type: "#text", text: this.options.icon.img };
  }
  addModuleOrderIfNotDefined() {
    this.defaultOptions.modulesOrder.forEach((mo) => {
      if (!this.options.modulesOrder.find((imo) => imo.type === mo.type))
        this.options.modulesOrder.push(mo);
    });
  }
  disabledUnsupportedFeatures() {
    const w = window;
    if (!w.SpeechSynthesisUtterance || !w.speechSynthesis) {
      this._common.warn("text to speech is not supported in this browser");
      this.options.modules.textToSpeech = false;
    }
  }
  injectCss(injectFull) {
    var _a;
    const iconTop = "7px", iconLeft = "5px";
    const useEmojis = (_a = this.options.icon) == null ? void 0 : _a.useEmojis;
    const mandatory = `
      html._access_cursor * {
        cursor: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSIyOS4xODhweCIgaGVpZ2h0PSI0My42MjVweCIgdmlld0JveD0iMCAwIDI5LjE4OCA0My42MjUiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI5LjE4OCA0My42MjUiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxwb2x5Z29uIGZpbGw9IiNGRkZGRkYiIHN0cm9rZT0iI0Q5REFEOSIgc3Ryb2tlLXdpZHRoPSIxLjE0MDYiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgcG9pbnRzPSIyLjgsNC41NDkgMjYuODQ3LDE5LjkwMiAxNi45NjQsMjIuNzAxIDI0LjIzOSwzNy43NDkgMTguMjc4LDQyLjAxNyA5Ljc0MSwzMC43MjQgMS4xMzgsMzUuODA5ICIvPjxnPjxnPjxnPjxwYXRoIGZpbGw9IiMyMTI2MjciIGQ9Ik0yOS4xNzUsMjEuMTU1YzAuMDcxLTAuNjEzLTAuMTY1LTEuMjUzLTAuNjM1LTEuNTczTDIuMTY1LDAuMjU4Yy0wLjQyNC0wLjMyLTAuOTg4LTAuMzQ2LTEuNDM1LTAuMDUzQzAuMjgyLDAuNDk3LDAsMS4wMywwLDEuNjE3djM0LjE3MWMwLDAuNjEzLDAuMzA2LDEuMTQ2LDAuNzc2LDEuNDM5YzAuNDcxLDAuMjY3LDEuMDU5LDAuMjEzLDEuNDgyLTAuMTZsNy40ODItNi4zNDRsNi44NDcsMTIuMTU1YzAuMjU5LDAuNDgsMC43MjksMC43NDYsMS4yLDAuNzQ2YzAuMjM1LDAsMC40OTQtMC4wOCwwLjcwNi0wLjIxM2w2Ljk4OC00LjU4NWMwLjMyOS0wLjIxMywwLjU2NS0wLjU4NiwwLjY1OS0xLjAxM2MwLjA5NC0wLjQyNiwwLjAyNC0wLjg4LTAuMTg4LTEuMjI2bC02LjM3Ni0xMS4zODJsOC42MTEtMi43NDVDMjguNzA1LDIyLjI3NCwyOS4xMDUsMjEuNzY4LDI5LjE3NSwyMS4xNTV6IE0xNi45NjQsMjIuNzAxYy0wLjQyNCwwLjEzMy0wLjc3NiwwLjUwNi0wLjk0MSwwLjk2Yy0wLjE2NSwwLjQ4LTAuMTE4LDEuMDEzLDAuMTE4LDEuNDM5bDYuNTg4LDExLjc4MWwtNC41NDEsMi45ODVsLTYuODk0LTEyLjMxNWMtMC4yMTItMC4zNzMtMC41NDEtMC42NC0wLjk0MS0wLjcyYy0wLjA5NC0wLjAyNy0wLjE2NS0wLjAyNy0wLjI1OS0wLjAyN2MtMC4zMDYsMC0wLjU4OCwwLjEwNy0wLjg0NywwLjMyTDIuOCwzMi41OVY0LjU0OWwyMS41OTksMTUuODA2TDE2Ljk2NCwyMi43MDF6Ii8+PC9nPjwvZz48L2c+PC9nPjwvc3ZnPg==),auto!important;
      }
      @keyframes _access-dialog-backdrop {
        0%   { background: var(--_access-menu-dialog-backdrop-background-start, rgba(0,0,0,0.1)); }
        100% { background: var(--_access-menu-dialog-backdrop-background-end,   rgba(0,0,0,0.5)); }
      }
      dialog._access::backdrop, dialog._access {
        transition-duration: var(--_access-menu-dialog-backdrop-transition-duration, 0.35s);
        transition-timing-function: var(--_access-menu-dialog-backdrop-transition-timing-function, ease-in-out);
      }
      dialog._access:modal { border-color: transparent; border-radius: 10px; border-width: 0; padding: 0; }
      dialog._access[open]::backdrop {
        background: var(--_access-menu-dialog-backdrop-background-end, rgba(0,0,0,0.5));
        animation: _access-dialog-backdrop var(--_access-menu-dialog-backdrop-transition-duration, 0.35s) ease-in-out;
      }
      dialog._access.closing[open]::backdrop { background: var(--_access-menu-dialog-backdrop-background-start, rgba(0,0,0,0.1)); }
      dialog._access.closing[open] { opacity: 0; }
      .screen-reader-wrapper { margin: 0; position: absolute; bottom: -4px; width: calc(100% - 2px); right: 1px; height: 4px; z-index: 1; }
      .screen-reader-wrapper-step-1, .screen-reader-wrapper-step-2, .screen-reader-wrapper-step-3 {
        float: left; background: var(--_access-menu-step-inactive-background, rgba(0,0,0,0.15));
        width: 33.33%; height: 4px; border-radius: 10px;
      }
      .screen-reader-wrapper-step-1.active, .screen-reader-wrapper-step-2.active, .screen-reader-wrapper-step-3.active {
        background: var(--_access-menu-step-active-background, var(--_access-menu-item-button-active-border-color, #0048FF));
      }
      .access_read_guide_bar {
        box-sizing: border-box;
        background: var(--_access-menu-read-guide-bg, ${this.options.guide.cBackground});
        width: 100%!important; min-width: 100%!important; position: fixed!important;
        height: var(--_access-menu-read-guide-height, ${this.options.guide.height}) !important;
        border: var(--_access-menu-read-guide-border, solid 3px ${this.options.guide.cBorder});
        border-radius: 5px; top: 15px; z-index: 2147483647;
      }`;
    let css = mandatory;
    if (injectFull) {
      css = `
        ._access-menu, ._access-menu * {
          box-sizing: border-box !important;
        }
        ._access-menu {
          font-size: 16px !important;
        }
        ._access-menu button {
          border: none !important;
          outline: none !important;
          font-size: inherit !important;
          line-height: 1.2 !important;
        }
        ._access-menu ul, ._access-menu li {
          border: none !important;
          outline: none !important;
        }
        ._access-scrollbar::-webkit-scrollbar-track { -webkit-box-shadow: var(--_access-scrollbar-track-box-shadow, inset 0 0 6px rgba(0,0,0,0.3)); background-color: var(--_access-scrollbar-track-background-color, #F5F5F5); }
        ._access-scrollbar::-webkit-scrollbar { width: var(--_access-scrollbar-width, 6px); background-color: var(--_access-scrollbar-background-color, #F5F5F5); }
        ._access-scrollbar::-webkit-scrollbar-thumb { background-color: var(--_access-scrollbar-thumb-background-color, #999999); }
        ._access-icon {
          position: var(--_access-icon-position, fixed);
          width: var(--_access-icon-width, 50px); height: var(--_access-icon-height, 50px);
          bottom: var(--_access-icon-bottom, 80px); top: var(--_access-icon-top, unset);
          left: var(--_access-icon-left, unset); right: var(--_access-icon-right, 10px);
          z-index: var(--_access-icon-z-index, 9999);
          font: var(--_access-icon-font, 40px / 45px "Material Icons");
          background: var(--_access-icon-bg, #4054b2); color: var(--_access-icon-color, #fff);
          background-repeat: no-repeat; background-size: contain;
          cursor: pointer; opacity: 0; transition-duration: .35s;
          user-select: none;
          ${!useEmojis ? "box-shadow: 1px 1px 5px rgba(0,0,0,.5);" : ""}
          transform: ${!useEmojis ? "scale(1)" : "skewX(14deg)"};
          border-radius: 50%;
          border: 3px solid #FFFFFF;
          text-align: var(--_access-icon-text-align, center);
          display: flex; align-items: center; justify-content: center;
        }
        .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
            min-height: 0;
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
            padding: 30px 0px 20px;
            background: #F3F4F6;
            overflow-y: auto;
        }
        ._access-icon:hover { transform: var(--_access-icon-transform-hover, scale(1.1)); }
        ._access-menu ._menu-hotkeys-help-btn {
            position: relative;
            width: 90%;
            min-height: 40px !important;
            height: auto !important;
            padding: 8px 15px !important;
            margin: 0 auto 10px !important;
            background: transparent;
            color: var(--_access-menu-item-color, rgba(0,0,0,.8));
            border: 1px solid rgba(0,0,0,.2) !important;
            border-radius: 10px;
            cursor: pointer;
            font-style: normal !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 6px;
            outline: none;
            box-sizing: border-box !important;
            font-size: 14px !important;
            line-height: 1 !important;
            text-decoration: none !important;
            -webkit-appearance: none;
            appearance: none;
          }
        ._access-menu ._menu-hotkeys-help-btn:hover { scale: 1.03; }
        ._access-hotkeys-help-list { list-style: none; margin: 16px 0 0; padding: 0; max-height: 50vh; overflow-y: auto; }
        ._access-hotkeys-help-list li { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,.1); }
        ._access-hotkeys-help-combo { font-family: monospace; background: rgba(0,0,0,.06); padding: 2px 8px; border-radius: 4px; white-space: nowrap; }
        ._access-menu {
          user-select: none; position: fixed;
          width: var(--_access-menu-width, ${_Accessibility.MENU_WIDTH});
          height: var(--_access-menu-height, auto);
          padding: 0px;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition-duration: var(--_access-menu-transition-duration, .35s);
          z-index: var(--_access-menu-z-index, 99991); opacity: 1;
          background-color: var(--_access-menu-background-color, #F3F4F6);
          color: var(--_access-menu-color, #000);
          border-radius: var(--_access-menu-border-radius, 3px);
          font-family: var(--_access-menu-font-family, RobotoDraft, Roboto, sans-serif, Arial);
          min-width: var(--_access-menu-min-width, 300px);
          box-shadow: var(--_access-menu-box-shadow, -2px -2px 12px rgba(0, 0, 0, 0.2));
          height: 100%;
          ${getComputedStyle(this._body).direction === "rtl" ? "text-indent: -5px" : ""}
          top: var(--_access-menu-top, unset); left: var(--_access-menu-left, unset);
          bottom: var(--_access-menu-bottom, 0); right: var(--_access-menu-right, 0);
          padding-bottom: 20px;
          word-spacing: normal; letter-spacing: normal; line-height: normal;
          overflow-y: auto;
        }
          @media (max-width: 600px) {
          ._access-menu {
            height: 100vh !important;       /* For\xE7a ocupar toda a altura */
            height: 100dvh !important;      /* Corre\xE7\xE3o para navegadores mobile (Safari/Chrome) */
            max-height: 100dvh !important;
            overflow-y: auto;               /* Permite rolar os bot\xF5es caso sumam da tela */
          }
        }
        ._access-menu.close {
          z-index: -1; width: 0; opacity: 0; background-color: transparent;
          right: calc(-1 * var(--_access-menu-width, ${_Accessibility.MENU_WIDTH}));
        }
        ._access-menu ._text-center {
          font-size: var(--_access-menu-header-font-size, 22px);
          font-weight: var(--_access-menu-header-font-weight, bold);
          margin: var(--_access-menu-header-margin, 0px 0 -15px);
          padding: 40px 30px !important;
          color: var(--_access-menu-header-color, #FFFFFF);
          text-align: var(--_access-menu-header-text-align, left);
          background: #0048FF;
          width: 100%;
          box-sizing: border-box !important;
          display: flex;
          flex-direction: row-reverse;
          align-items: center;
          justify-content: space-between;
          gap: 8px;

        }


        ._access-menu ._menu-close-btn {

            padding: 10px;
            color: #FFFFFF;
            border-radius: 50% !important;
            transition: .3s ease;
            transform: rotate(0deg);
            -style: normal !important;
            background: #0d2f8a;
            blur: 1.2;
            cursor: pointer;
            font-size: 24px !important;
            font-weight: bold;
            align-self: flex-end;
            justify-self: flex-end;
          }

          @media (max-width: 765px) {
          ._access-menu ._text-center {
            font-size: 18px;
            padding: 40px 20px;
          }

          ._access-menu ._menu-close-btn {
            font-size: 18px;
            padding: 5px;
          }
        }
        ._access-menu ._menu-reset-btn {
            position: relative;
            width: 90%;
            min-height: 52px !important;
            height: auto !important;
            padding: 12px 15px !important;
            margin: 10px auto !important;
            background: #0048FF;
            color: #FFFFFF;
            border-radius: 10px;
            box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
            cursor: pointer;
            font-style: normal !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 6px;
            border: none !important;
            outline: none;
            box-sizing: border-box !important;
            font-size: 16px !important;
            line-height: 1 !important;
            text-decoration: none !important;
            -webkit-appearance: none;
            appearance: none;
          }
        ._access-menu ._menu-reset-btn span {
            display: inline-flex !important;
            align-items: center !important;
            width: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            line-height: 1 !important;
            font-size: 16px !important;
          }
        ._access-menu ._menu-close-btn:hover { scale: 1.05; }
        ._access-menu ._menu-reset-btn:hover { scale: 1.03; }

        ._access-menu ul {
          width: 90%;
          padding: 0 0 5px;
          position: relative;
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          font-size: var(--_access-menu-font-size, 18px);
          margin: 0;
          max-height: 100hv;
          background: #F3F4F6;
        }
        ${mandatory}
        ._access-menu ul li {
          width: 45%;
          min-height: 100px;
          position: relative;
          list-style-type: none;
          user-select: none;
          margin: 2px auto;
          font-size: var(--_access-menu-item-font-size, 18px) !important;
          line-height: var(--_access-menu-item-line-height, 18px) !important;
          color: var(--_access-menu-item-color, rgba(0,0,0,.8));
        }
        ._access-menu ul li button {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--_access-menu-item-button-background, #FFFFFF);
          padding: 10px;
          gap: 8px;
          width: 100%;
          height: 100%;
          text-align: center;
          position: relative;
          transition-duration: var(--_access-menu-item-button-transition-duration, .35s);
          box-shadow: 4px 2px 1px rgba(0, 0, 0, 0.1);
          border-radius: var(--_access-menu-item-button-border-radius, 8px);
          cursor: pointer;
          text-decoration: none !important;
          border: none !important;
          outline: none;
          box-sizing: border-box;
          font-family: inherit;
          -webkit-appearance: none;
          appearance: none;
          position: relative !important;
          padding-bottom: 20px !important;
        }
        ._access-menu ul li.position { display: inline-block; width: auto; }
        ._access-menu ul.before-collapse li button { opacity: var(--_access-menu-item-button-before-collapse-opacity, 0.05); }
        ._access-menu ul li button.active, ._access-menu ul li button.active:hover {
          border: 2px solid var(--_access-menu-item-button-active-border-color, #0048FF) !important;
        }
        ._access-menu div.active { color: var(--_access-menu-div-active-color, #0048FF); }
        ._access-menu ul li button.active, ._access-menu ul li button.active:hover, ._access-menu ul li button.active:before, ._access-menu ul li button.active:hover:before { color: var(--_access-menu-item-button-active-color, #0048FF); }
        ._access-menu ul li button:hover {
          color: var(--_access-menu-item-button-hover-color, #003366);
          background-color: var(--_access-menu-item-button-hover-background-color, #FFFFFF);
          scale: 1.03;
          }
        ._access-menu ul li.not-supported { display: none; }
        ._access-menu ul li button:before {
          content: ' ';
          font-family: var(--_access-menu-button-font-family-before, ${this._fixedDefaultFont});
          text-rendering: optimizeLegibility;
          font-feature-settings: "liga" 1;
          font-style: normal;
          text-transform: none;
          line-height: ${!useEmojis ? "1" : "1.1"};
          font-size: ${!useEmojis ? "24px" : "20px"} !important;

          /* Alinhamento corrigido */
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;

          -webkit-font-smoothing: antialiased;
          color: var(--_access-menu-item-icon-color, rgba(0,0,0,.6));
          direction: ltr;
          text-indent: 0;
          transition-duration: .35s;

        }
        ._access-menu ul li button svg path { fill: var(--_access-menu-item-icon-color, rgba(0,0,0,.8)); transition-duration: .35s; }
        ._access-menu ul li button:hover svg path { fill: var(--_access-menu-item-hover-icon-color, #003366); }
        ._access-menu ul li button.active svg path { fill: var(--_access-menu-item-active-icon-color, #0048FF); }
        ._access-menu ul li:hover button:before { color: var(--_access-menu-item-hover-icon-color, #003366); }
        ._access-menu ul li button[data-access-action="increaseText"]:before { content: var(--_access-menu-item-icon-increase-text, ${!useEmojis ? '"zoom_in"' : '"\u{1F53C}"'}); top: var(--_access-menu-item-icon-increase-text-top, ${iconTop}); left: var(--_access-menu-item-icon-increase-text-left, ${iconLeft}); }
        ._access-menu ul li button[data-access-action="increaseTextSpacing"]:before { content: var(--_access-menu-item-icon-increase-text-spacing, ${!useEmojis ? '"unfold_more"' : '"\u{1F53C}"'}); transform: var(--_access-menu-item-icon-increase-text-spacing-transform, rotate(90deg) translate(-7px, 2px)); top: 14px; left: 0; }
        ._access-menu ul li button[data-access-action="invertColors"]:before { content: var(--_access-menu-item-icon-invert-colors, ${!useEmojis ? '"invert_colors"' : '"\u{1F386}"'}); top: ${iconTop}; left: ${iconLeft}; }
        ._access-menu ul li button[data-access-action="grayHues"]:before { content: var(--_access-menu-item-icon-gray-hues, ${!useEmojis ? '"format_color_reset"' : '"\u{1F32B}\uFE0F"'}); top: ${iconTop}; left: ${iconLeft}; }
        ._access-menu ul li button[data-access-action="underlineLinks"]:before { content: var(--_access-menu-item-icon-underline-links, ${!useEmojis ? '"format_underlined"' : '"\u{1F517}"'}); top: ${iconTop}; left: ${iconLeft}; }
        ._access-menu ul li button[data-access-action="bigCursor"]:before { content: var(--_access-menu-item-icon-big-cursor, inherit); top: ${iconTop}; left: ${iconLeft}; }
        ._access-menu ul li button[data-access-action="readingGuide"]:before { content: var(--_access-menu-item-icon-reading-guide, ${!useEmojis ? '"border_horizontal"' : '"\u2194\uFE0F"'}); top: ${iconTop}; left: ${iconLeft}; }
        ._access-menu ul li button[data-access-action="textToSpeech"]:before { content: var(--_access-menu-item-icon-text-to-speech-off, ${!useEmojis ? '"voice_over_off"' : '"\u{1F507}"'}); top: ${iconTop}; left: ${iconLeft}; }
        ._access-menu ul li button[data-access-action="textToSpeech"][data-speech-rate="normal"]:before { content: var(--_access-menu-item-icon-text-to-speech-normal, ${!useEmojis ? '"play_circle"' : '"\u25B6\uFE0F"'}); }
        ._access-menu ul li button[data-access-action="textToSpeech"][data-speech-rate="fast"]:before { content: var(--_access-menu-item-icon-text-to-speech-fast, ${!useEmojis ? '"fast_forward"' : '"\u23E9"'}); }
        ._access-menu ul li button[data-access-action="textToSpeech"][data-speech-rate="slow"]:before { content: var(--_access-menu-item-icon-text-to-speech-slow, ${!useEmojis ? '"slow_motion_video"' : '"\u{1F422}"'}); }
        ._access-menu ul li button[data-access-action="disableAnimations"]:before { content: var(--_access-menu-item-icon-disable-animations, ${!useEmojis ? '"animation"' : '"\u{1F3C3}\u200D\u2642\uFE0F"'}); top: ${iconTop}; left: ${iconLeft}; }
        ._access-menu ul li button[data-access-action="iframeModals"]:before { content: var(--_access-menu-item-icon-iframe-modals, ${!useEmojis ? '"policy"' : '"\u2696\uFE0F"'}); top: ${iconTop}; left: ${iconLeft}; }
        ._access-menu ul li button[data-access-action="customFunctions"]:before { content: var(--_access-menu-item-icon-custom-functions, ${!useEmojis ? '"psychology_alt"' : '"\u2753"'}); top: ${iconTop}; left: ${iconLeft}; }
        ._access-menu ul li button[data-access-action="increaseLineHeight"]:before { content: var(--_access-menu-item-icon-increase-line-height, ${!useEmojis ? '"unfold_more"' : '"\u{1F53C}"'}); top: ${iconTop}; left: ${iconLeft}; }
        ._access-menu ul li button[data-access-action="dyslexicFont"]:before { content: var(--_access-menu-item-icon-dyslexic-font, ${!useEmojis ? '"font_download"' : '"\u{1F524}"'}); top: ${iconTop}; left: ${iconLeft}; }
        ._access-menu ul li button[data-access-action="hideImages"]:before { content: var(--_access-menu-item-icon-hide-images, ${!useEmojis ? '"hide_image"' : '"\u{1F6AB}"'}); top: ${iconTop}; left: ${iconLeft}; }
        ._access-menu-logo {
            display: block;
            max-width: 40%;
            margin: 8px auto 4px;
            object-fit: contain;
          }
        ._access-cycle-indicator { position: absolute !important; bottom: 6px !important; left: 50% !important; transform: translateX(-50%) !important; display: flex !important; gap: 4px !important; }
        ._access-cycle-indicator span { width: 16px !important; height: 3px !important; border-radius: 2px !important; background: #ccc !important; transition: background 0.2s !important; text-decoration: none !important; }
        ._access-cycle-indicator span.filled { background: #0048FF !important; }
      `;
    }
    this._common.injectStyle(css, { className: _Accessibility.CSS_CLASS_NAME });
    this._common.deployedObjects.set(`.${_Accessibility.CSS_CLASS_NAME}`, false);
  }
  removeCSS() {
    var _a;
    (_a = document.querySelector(`.${_Accessibility.CSS_CLASS_NAME}`)) == null ? void 0 : _a.remove();
  }
  injectIcon() {
    const className = `_access-icon ${this.options.icon.fontClass} _access`;
    const iconElem = this._common.jsonToHtml({
      type: "i",
      attrs: {
        class: className,
        title: this.options.hotkeys.enabled ? this.parseKeys(this.options.hotkeys.keys.toggleMenu) : this.options.labels.menuTitle,
        tabIndex: "0"
      },
      children: [this.options.icon.imgElem]
    });
    this._body.appendChild(iconElem);
    this._common.deployedObjects.set("._access-icon", false);
    return iconElem;
  }
  parseKeys(arr) {
    if (!this.options.hotkeys.enabled) return "";
    if (!this.options.hotkeys.helpTitles) return "";
    return this.options.labels.hotkeyPrefix + arr.map((val) => Number.isInteger(val) ? String.fromCharCode(val).toLowerCase() : val.replace("Key", "")).join("+");
  }
  injectMenu() {
    var _a, _b;
    const labels = this.options.labels;
    const hotkeys = this.options.hotkeys;
    const mods = (_a = this.options.modules) != null ? _a : {};
    const menuItems = [
      { action: "increaseText", label: labels.increaseText, hotkey: hotkeys.keys.increaseText },
      { action: "increaseTextSpacing", label: labels.increaseTextSpacing, hotkey: hotkeys.keys.increaseTextSpacing },
      { action: "increaseLineHeight", label: labels.increaseLineHeight, hotkey: hotkeys.keys.increaseLineHeight },
      { action: "invertColors", label: labels.invertColors, hotkey: hotkeys.keys.invertColors },
      { action: "grayHues", label: labels.grayHues, hotkey: hotkeys.keys.grayHues },
      { action: "underlineLinks", label: labels.underlineLinks, hotkey: hotkeys.keys.underlineLinks },
      { action: "bigCursor", label: labels.bigCursor, hotkey: hotkeys.keys.bigCursor },
      { action: "readingGuide", label: labels.readingGuide, hotkey: hotkeys.keys.readingGuide },
      { action: "disableAnimations", label: labels.disableAnimations, hotkey: hotkeys.keys.disableAnimations },
      { action: "dyslexicFont", label: labels.dyslexicFont, hotkey: hotkeys.keys.dyslexicFont },
      { action: "hideImages", label: labels.hideImages, hotkey: hotkeys.keys.hideImages }
    ].filter(({ action }) => mods[action] !== false).map(({ action, label, hotkey }) => ({
      type: "li",
      children: [{
        type: "button",
        attrs: { "data-access-action": action, ...hotkey ? { title: this.parseKeys(hotkey) } : {} },
        children: [
          ...action === "bigCursor" ? [{ type: "div", attrs: { id: "iconBigCursor" } }] : [],
          { type: "#text", text: label }
        ]
      }]
    }));
    const json = {
      type: "div",
      attrs: { class: "_access-menu close _access" },
      children: [
        {
          type: "div",
          attrs: { class: "_text-center", role: "presentation" },
          children: [
            {
              type: "button",
              attrs: { class: `_menu-close-btn _menu-btn ${this.options.icon.fontClass}`, style: `font-family: var(--_access-menu-close-btn-font-family, ${this._fixedDefaultFont})`, title: hotkeys.enabled ? this.parseKeys(hotkeys.keys.toggleMenu) : labels.closeTitle },
              children: [this.options.icon.closeIconElem]
            },
            { type: "#text", text: labels.menuTitle }
          ]
        },
        {
          type: "div",
          attrs: { class: "content" },
          children: [
            { type: "ul", attrs: { class: "before-collapse _access-scrollbar" }, children: menuItems },
            {
              type: "button",
              attrs: { class: "_menu-reset-btn", title: labels.resetTitle },
              children: [
                { type: "span", attrs: { class: this.options.icon.fontClass, style: `font-family: var(--_access-menu-reset-btn-font-family, ${this._fixedDefaultFont}); font-size: 18px; line-height: 1;` }, children: [this.options.icon.resetIconElem] },
                { type: "span", children: [{ type: "#text", text: labels.resetTitle }] }
              ]
            },
            ...hotkeys.enabled ? [{
              type: "button",
              attrs: { class: "_menu-hotkeys-help-btn", title: labels.hotkeysHelpTitle },
              children: [
                { type: "span", attrs: { class: this.options.icon.fontClass, style: `font-family: var(--_access-menu-hotkeys-help-btn-font-family, ${this._fixedDefaultFont}); font-size: 16px; line-height: 1;` }, children: [{ type: "#text", text: !((_b = this.options.icon) == null ? void 0 : _b.useEmojis) ? "help" : "\u2753" }] },
                { type: "span", children: [{ type: "#text", text: labels.hotkeysHelpTitle }] }
              ]
            }] : []
          ]
        },
        ...this.options.logoImage ? [{
          type: "img",
          attrs: { src: this.options.logoImage, alt: "", class: "_access-menu-logo" }
        }] : []
      ]
    };
    if (this.options.iframeModals) {
      this.options.iframeModals.forEach((im, i) => {
        var _a2, _b2;
        const btn = {
          type: "li",
          children: [{
            type: "button",
            attrs: { "data-access-action": "iframeModals", "data-access-url": im.iframeUrl },
            children: [{ type: "#text", text: im.buttonText }]
          }]
        };
        const icon = im.icon && !((_a2 = this.options.icon) == null ? void 0 : _a2.useEmojis) ? im.icon : im.emoji && ((_b2 = this.options.icon) == null ? void 0 : _b2.useEmojis) ? im.emoji : null;
        if (icon) {
          btn.children[0].attrs["data-access-iframe-index"] = String(i);
          const className = "_data-access-iframe-index-" + i;
          this._common.injectStyle(`._access-menu ul li button[data-access-action="iframeModals"][data-access-iframe-index="${i}"]:before { content: "${icon}"; }`, { className });
          this._common.deployedObjects.set("." + className, false);
        }
        const ul = json.children[1].children[0];
        if (this.options.modules.textToSpeech) ul.children.splice(ul.children.length - 2, 0, btn);
        else ul.children.push(btn);
      });
    }
    if (this.options.customFunctions) {
      this.options.customFunctions.forEach((cf, i) => {
        var _a2, _b2;
        const btn = {
          type: "li",
          children: [{
            type: "button",
            attrs: { "data-access-action": "customFunctions", "data-access-custom-id": cf.id, "data-access-custom-index": String(i) },
            children: [{ type: "#text", text: cf.buttonText }]
          }]
        };
        const icon = cf.icon && !((_a2 = this.options.icon) == null ? void 0 : _a2.useEmojis) ? cf.icon : cf.emoji && ((_b2 = this.options.icon) == null ? void 0 : _b2.useEmojis) ? cf.emoji : null;
        if (icon) {
          const className = "_data-access-custom-id-" + cf.id;
          this._common.injectStyle(`._access-menu ul li button[data-access-action="customFunctions"][data-access-custom-id="${cf.id}"]:before { content: "${icon}"; }`, { className });
          this._common.deployedObjects.set("." + className, false);
        }
        const ul = json.children[1].children[0];
        if (this.options.modules.textToSpeech) ul.children.splice(ul.children.length - 2, 0, btn);
        else ul.children.push(btn);
      });
    }
    const menuElem = this._common.jsonToHtml(json);
    this._body.appendChild(menuElem);
    setTimeout(() => {
      var _a2;
      const ic = document.getElementById("iconBigCursor");
      if (ic) {
        ic.outerHTML += '<svg version="1.1" id="iconBigCursorSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="position:absolute;width:19px;height:19px;top:9px;left:9px" xml:space="preserve"><path d="M 423.547 323.115 l -320 -320 c -3.051 -3.051 -7.637 -3.947 -11.627 -2.304 s -6.592 5.547 -6.592 9.856 V 480 c 0 4.501 2.837 8.533 7.083 10.048 c 4.224 1.536 8.981 0.192 11.84 -3.285 l 85.205 -104.128 l 56.853 123.179 c 1.792 3.883 5.653 6.187 9.685 6.187 c 1.408 0 2.837 -0.277 4.203 -0.875 l 74.667 -32 c 2.645 -1.131 4.736 -3.285 5.76 -5.973 c 1.024 -2.688 0.939 -5.675 -0.277 -8.299 l -57.024 -123.52 h 132.672 c 4.309 0 8.213 -2.603 9.856 -6.592 C 427.515 330.752 426.598 326.187 423.547 323.115 Z"/></svg>';
        (_a2 = document.getElementById("iconBigCursor")) == null ? void 0 : _a2.remove();
      }
    }, 1);
    this._common.deployedObjects.set("._access-menu", false);
    const addToggleListener = (el, handler) => {
      el == null ? void 0 : el.addEventListener("click", () => handler(), false);
      el == null ? void 0 : el.addEventListener("keyup", (e) => {
        if (e.key === "Enter") handler();
      }, false);
    };
    addToggleListener(menuElem.querySelector("._menu-close-btn"), () => this.toggleMenu());
    addToggleListener(menuElem.querySelector("._menu-reset-btn"), () => this.resetAll());
    addToggleListener(menuElem.querySelector("._menu-hotkeys-help-btn"), () => this.menuInterface.hotkeysHelp());
    return menuElem;
  }
  getVoices() {
    return new Promise((resolve) => {
      const synth = window.speechSynthesis;
      const id = setInterval(() => {
        if (synth.getVoices().length !== 0) {
          resolve(synth.getVoices());
          clearInterval(id);
        }
      }, 10);
    });
  }
  async injectTts() {
    const voices = await this.getVoices();
    const targetLang = this.options.language.textToSpeechLang;
    const isLngSupported = !targetLang || !!this.pickVoice(voices, targetLang);
    if (!isLngSupported) {
      this._common.warn(`text to speech: no voice found for language "${targetLang}", hiding the textToSpeech button.`);
      return;
    }
    const tts = this.common.jsonToHtml({
      type: "li",
      children: [{
        type: "button",
        attrs: { "data-access-action": "textToSpeech", title: this.parseKeys(this.options.hotkeys.keys.textToSpeech) },
        children: [
          { type: "#text", text: this.options.labels.textToSpeech }
        ]
      }]
    });
    const ul = this._menu.querySelector("ul");
    ul.appendChild(tts);
  }
  addListeners() {
    this._menu.querySelectorAll("ul li").forEach((li) => {
      ["click", "keyup"].forEach(
        (evt) => li.addEventListener(evt, (e) => {
          const ev = e || window.event;
          if (ev.detail === 0 && ev.key !== "Enter") return;
          const actionEl = ev.target.closest("[data-access-action]");
          if (!actionEl) return;
          this.invoke(actionEl.getAttribute("data-access-action"), actionEl);
        })
      );
    });
  }
  sortModuleTypes() {
    this.options.modulesOrder.sort((a, b) => a.order - b.order);
  }
  disableUnsupportedModulesAndSort() {
    this.sortModuleTypes();
    const ul = this._menu.querySelector("ul");
    this.options.modulesOrder.forEach((item) => {
      const module2 = AccessibilityModulesType[item.type];
      const enabled = this.options.modules[module2];
      const btn = this._menu.querySelector(`button[data-access-action="${module2}"]`);
      if (btn) {
        btn.parentElement.remove();
        ul.appendChild(btn.parentElement);
        if (!enabled) btn.parentElement.classList.add("not-supported");
      }
    });
  }
  resetAll() {
    this.menuInterface.textToSpeech(true);
    this.menuInterface.disableAnimations(true);
    this.menuInterface.underlineLinks(true);
    this.menuInterface.grayHues(true);
    this.menuInterface.invertColors(true);
    this.menuInterface.bigCursor(true);
    this.menuInterface.readingGuide(true);
    this.menuInterface.dyslexicFont(true);
    this.menuInterface.hideImages(true);
    this.resetTextSize();
    this.resetTextSpace();
    this.resetLineHeight();
    this.menuInterface.refreshCycleButtons();
  }
  resetTextSize() {
    this.resetIfDefined(this._stateValues.body.fontSize, this._body.style, "fontSize");
    if (typeof this._htmlOrgFontSize !== "undefined") this._html.style.fontSize = this._htmlOrgFontSize;
    document.querySelectorAll("[data-init-font-size]").forEach((el) => {
      el.style.fontSize = el.getAttribute("data-init-font-size");
      el.removeAttribute("data-init-font-size");
    });
    this._sessionState.textSize = 0;
    this.onChange(true);
  }
  resetLineHeight() {
    this.resetIfDefined(this._stateValues.body.lineHeight, this.body.style, "lineHeight");
    document.querySelectorAll("[data-init-line-height]").forEach((el) => {
      el.style.lineHeight = el.getAttribute("data-init-line-height");
      el.removeAttribute("data-init-line-height");
    });
    this.sessionState.lineHeight = 0;
    this.onChange(true);
  }
  resetTextSpace() {
    this.resetIfDefined(this._stateValues.body.wordSpacing, this._body.style, "wordSpacing");
    this.resetIfDefined(this._stateValues.body.letterSpacing, this._body.style, "letterSpacing");
    document.querySelectorAll("[data-init-word-spacing]").forEach((el) => {
      el.style.wordSpacing = el.getAttribute("data-init-word-spacing");
      el.removeAttribute("data-init-word-spacing");
    });
    document.querySelectorAll("[data-init-letter-spacing]").forEach((el) => {
      el.style.letterSpacing = el.getAttribute("data-init-letter-spacing");
      el.removeAttribute("data-init-letter-spacing");
    });
    this._sessionState.textSpace = 0;
    this.onChange(true);
  }
  alterTextSize(isIncrease) {
    this._sessionState.textSize += isIncrease ? 1 : -1;
    this.onChange(true);
    let factor = this.options.textSizeFactor * (isIncrease ? 1 : -1);
    if (this.options.textPixelMode) {
      const excludeSize = Array.from(document.querySelectorAll("._access *"));
      document.querySelectorAll("*:not(._access)").forEach((el) => {
        if (excludeSize.includes(el)) return;
        const fSize = getComputedStyle(el).fontSize;
        if (fSize == null ? void 0 : fSize.includes("px")) {
          if (!el.getAttribute("data-init-font-size")) el.setAttribute("data-init-font-size", fSize);
          el.style.fontSize = parseInt(fSize) + factor + "px";
        }
      });
      const bodyFs = getComputedStyle(this._body).fontSize;
      if (bodyFs == null ? void 0 : bodyFs.includes("px")) {
        if (!this._body.getAttribute("data-init-font-size")) this._body.setAttribute("data-init-font-size", bodyFs);
        this._body.style.fontSize = parseInt(bodyFs) + factor + "px";
      }
    } else if (this.options.textEmlMode) {
      const fp = this._html.style.fontSize;
      if (fp.includes("%")) {
        this._html.style.fontSize = parseInt(fp) + factor + "%";
        const menuEl = this._menu;
        if (menuEl) menuEl.style.fontSize = "16px";
      } else this._common.warn("textEmlMode: html element font-size is not in %.");
    } else {
      const fSize = this._common.getFormattedDim(getComputedStyle(this._body).fontSize);
      if (typeof this._stateValues.body.fontSize === "undefined")
        this._stateValues.body.fontSize = fSize.size + fSize.suffix;
      if (fSize == null ? void 0 : fSize.suffix) this._body.style.fontSize = fSize.size + factor + fSize.suffix;
    }
    if (this._stateValues.textToSpeech) this.textToSpeech(`Text Size ${isIncrease ? "Increased" : "Decreased"}`);
  }
  alterLineHeight(isIncrease) {
    this.sessionState.lineHeight += isIncrease ? 1 : -1;
    this.onChange(true);
    let factor = (isIncrease ? 1 : -1) * (this.options.textEmlMode ? 20 : 2);
    const exclude = Array.from(document.querySelectorAll("._access *"));
    document.querySelectorAll("*:not(._access)").forEach((el) => {
      if (exclude.includes(el)) return;
      if (this.options.textPixelMode) {
        const lh = getComputedStyle(el).lineHeight;
        if (lh == null ? void 0 : lh.includes("px")) {
          if (!el.getAttribute("data-init-line-height")) el.setAttribute("data-init-line-height", lh);
          el.style.lineHeight = parseInt(lh) + factor + "px";
        }
      } else if (this.options.textEmlMode) {
        let lh = getComputedStyle(el).lineHeight;
        const fs = getComputedStyle(el).fontSize;
        if (lh === "normal") lh = parseInt(fs) * 1.2 + "px";
        if (lh == null ? void 0 : lh.includes("px")) {
          const pct = parseInt(lh) * 100 / parseInt(fs);
          if (!el.getAttribute("data-init-line-height")) el.setAttribute("data-init-line-height", pct + "%");
          el.style.lineHeight = pct + factor + "%";
        }
        if (typeof this._stateValues.body.lineHeight === "undefined") this._stateValues.body.lineHeight = "";
      }
    });
    if (this._stateValues.textToSpeech) this.textToSpeech(`Line Height ${isIncrease ? "Increased" : "Decreased"}`);
  }
  alterTextSpace(isIncrease) {
    this._sessionState.textSpace += isIncrease ? 1 : -1;
    this.onChange(true);
    const factor = isIncrease ? 2 : -2;
    if (this.options.textPixelMode) {
      const exclude = Array.from(document.querySelectorAll("._access *"));
      document.querySelectorAll("*:not(._access)").forEach((el) => {
        if (exclude.includes(el)) return;
        const ws = el.style.wordSpacing;
        if (!el.getAttribute("data-init-word-spacing")) el.setAttribute("data-init-word-spacing", ws);
        el.style.wordSpacing = (ws == null ? void 0 : ws.includes("px")) ? parseInt(ws) + factor + "px" : factor + "px";
        const ls = el.style.letterSpacing;
        if (!el.getAttribute("data-init-letter-spacing")) el.setAttribute("data-init-letter-spacing", ls);
        el.style.letterSpacing = (ls == null ? void 0 : ls.includes("px")) ? parseInt(ls) + factor + "px" : factor + "px";
      });
    } else {
      const ws = this._common.getFormattedDim(getComputedStyle(this._body).wordSpacing);
      if (typeof this._stateValues.body.wordSpacing === "undefined") this._stateValues.body.wordSpacing = "";
      if (ws == null ? void 0 : ws.suffix) this._body.style.wordSpacing = ws.size * 1 + factor + ws.suffix;
      const ls = this._common.getFormattedDim(getComputedStyle(this._body).letterSpacing);
      if (typeof this._stateValues.body.letterSpacing === "undefined") this._stateValues.body.letterSpacing = "";
      if (ls == null ? void 0 : ls.suffix) this._body.style.letterSpacing = ls.size * 1 + factor + ls.suffix;
    }
    if (this._stateValues.textToSpeech) this.textToSpeech(`Text Spacing ${isIncrease ? "Increased" : "Decreased"}`);
  }
  pickVoice(voices, lang) {
    var _a;
    if (!lang) return void 0;
    const target = lang.toLowerCase();
    const base = target.split("-")[0];
    const candidates = voices.filter((v) => v.lang.toLowerCase() === target || v.lang.toLowerCase().startsWith(base));
    if (!candidates.length) return void 0;
    const exact = candidates.filter((v) => v.lang.toLowerCase() === target);
    const pool = exact.length ? exact : candidates;
    return (_a = pool.find((v) => !v.localService)) != null ? _a : pool[0];
  }
  textToSpeech(text) {
    const w = window;
    if (!w.SpeechSynthesisUtterance || !w.speechSynthesis) return;
    const msg = new w.SpeechSynthesisUtterance(text);
    msg.lang = this.options.language.textToSpeechLang;
    msg.rate = this._stateValues.speechRate;
    msg.onend = () => {
      this._isReading = false;
    };
    const voices = w.speechSynthesis.getVoices();
    const voice = this.pickVoice(voices, msg.lang);
    if (voice) {
      msg.voice = voice;
      msg.lang = voice.lang;
    } else this._common.warn("text to speech language not supported!");
    if (window.speechSynthesis.pending || window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
    this._isReading = true;
  }
  createScreenShot(url) {
    return this._common.createScreenshot(url);
  }
  read(e) {
    var _a, _b, _c, _d;
    try {
      e = window.event || e;
      (_a = e == null ? void 0 : e.preventDefault) == null ? void 0 : _a.call(e);
      (_b = e == null ? void 0 : e.stopPropagation) == null ? void 0 : _b.call(e);
    } catch (e2) {
    }
    const menuEls = Array.from(document.querySelectorAll("._access-menu *"));
    if (menuEls.includes(e == null ? void 0 : e.target) && e instanceof MouseEvent) return;
    if (e instanceof KeyboardEvent && (e.shiftKey && e.key === "Tab" || e.key === "Tab")) {
      this.textToSpeech((_c = e == null ? void 0 : e.target) == null ? void 0 : _c.innerText);
      return;
    }
    if (this._isReading) {
      window.speechSynthesis.cancel();
      this._isReading = false;
    } else this.textToSpeech((_d = e == null ? void 0 : e.target) == null ? void 0 : _d.innerText);
  }
  runHotkey(name) {
    var _a;
    if (name === "toggleMenu") {
      this.toggleMenu();
      return;
    }
    if (typeof this.menuInterface[name] === "function" && this._options.modules[name]) {
      const btn = (_a = this._menu.querySelector(`[data-access-action="${name}"]`)) != null ? _a : void 0;
      this.menuInterface[name](void 0, btn);
    }
  }
  toggleMenu() {
    const shouldClose = this._menu.classList.contains("close");
    setTimeout(() => this._menu.querySelector("ul").classList.toggle("before-collapse"), shouldClose ? 10 : 500);
    this._menu.classList.toggle("close");
    this.options.icon.tabIndex = shouldClose ? 0 : -1;
    this._menu.childNodes.forEach((child) => {
      if (child.hasChildNodes() && child.nodeType === Node.ELEMENT_NODE && child.tagName === "P")
        child.tabIndex = -1;
    });
  }
  invoke(action, button) {
    if (typeof this.menuInterface[action] === "function")
      this.menuInterface[action](void 0, button);
  }
  onKeyDown(e) {
    const act = Object.entries(this.options.hotkeys.keys).find(
      ([, keys]) => keys.every((k) => Number.isInteger(k) ? e.keyCode === k : e[k] === true)
    );
    if (act) this.runHotkey(act[0]);
  }
  build() {
    this._stateValues = { underlineLinks: false, textToSpeech: false, bigCursor: false, readingGuide: false, speechRate: 1, body: {}, html: {} };
    this._body = document.body;
    this._html = document.documentElement;
    if (this.options.textEmlMode) this.initFontSize();
    this.injectCss(!this.options.suppressCssInjection && !this.options.suppressDomInjection);
    if (!this.options.suppressDomInjection) {
      this._icon = this.injectIcon();
      this._menu = this.injectMenu();
      this.injectTts();
      setTimeout(() => {
        this.addListeners();
        this.disableUnsupportedModulesAndSort();
      }, 10);
      if (this.options.hotkeys.enabled) document.addEventListener("keydown", this._onKeyDownBind, false);
      this._icon.addEventListener("click", () => this.toggleMenu(), false);
      this._icon.addEventListener("keyup", (e) => {
        if (e.key === "Enter") this.toggleMenu();
      }, false);
      setTimeout(() => {
        this._icon.style.opacity = "1";
      }, 10);
      document.addEventListener("keydown", (e) => {
        if (document.querySelector("dialog._access[open]")) return;
        if (e.key === "Escape" && !this._menu.classList.contains("close")) this.toggleMenu();
      }, false);
      document.addEventListener("click", (e) => {
        var _a, _b;
        if (this._menu.classList.contains("close")) return;
        if (this._menu.contains(e.target) || this._icon.contains(e.target)) return;
        if ((_b = (_a = e.target) == null ? void 0 : _a.closest) == null ? void 0 : _b.call(_a, "dialog._access")) return;
        this.toggleMenu();
      }, false);
    }
    this.updateReadGuide = (e) => {
      const newPos = e.type === "touchmove" ? e.changedTouches[0].clientY : e.y;
      const bar = document.getElementById("access_read_guide_bar");
      if (bar) bar.style.top = newPos - (parseInt(this.options.guide.height) + 5) + "px";
    };
    this.menuInterface = new MenuInterface(this);
    if (this.options.session.persistent) this.setSessionFromCache();
  }
  updateReadGuide(e) {
    const newPos = e.type === "touchmove" ? e.changedTouches[0].clientY : e.y;
    const bar = document.getElementById("access_read_guide_bar");
    if (bar) bar.style.top = newPos - (parseInt(this.options.guide.height) + 5) + "px";
  }
  resetIfDefined(src, dest, prop) {
    if (typeof src !== "undefined") dest[prop] = src;
  }
  onChange(updateSession) {
    if (updateSession && this.options.session.persistent) this.saveSession();
  }
  saveSession() {
    this._storage.set("_accessState", this.sessionState);
  }
  setSessionFromCache() {
    const s = this._storage.get("_accessState");
    if (!s) return;
    if (s.textSize) {
      let n = s.textSize;
      if (n > 0) while (n--) this.alterTextSize(true);
      else while (n++) this.alterTextSize(false);
    }
    if (s.textSpace) {
      let n = s.textSpace;
      if (n > 0) while (n--) this.alterTextSpace(true);
      else while (n++) this.alterTextSpace(false);
    }
    if (s.lineHeight) {
      let n = s.lineHeight;
      if (n > 0) while (n--) this.alterLineHeight(true);
      else while (n++) this.alterLineHeight(false);
    }
    if (s.invertColors) this.menuInterface.invertColors();
    if (s.grayHues) this.menuInterface.grayHues();
    if (s.underlineLinks) this.menuInterface.underlineLinks();
    if (s.bigCursor) this.menuInterface.bigCursor();
    if (s.readingGuide) this.menuInterface.readingGuide();
    this.sessionState = s;
  }
  destroy() {
    this._common.deployedObjects.getAll().forEach((_, key) => {
      var _a, _b;
      (_b = (_a = document.querySelector(key)) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.removeChild(document.querySelector(key));
    });
    document.removeEventListener("keydown", this._onKeyDownBind, false);
  }
};
_Accessibility.CSS_CLASS_NAME = "_access-main-css";
_Accessibility.MENU_WIDTH = "20vw";
var Accessibility = _Accessibility;
var main_default = Accessibility;

// src/theme.ts
var VAR_MAP = {
  primaryColor: ["--_access-icon-bg", "--_access-menu-item-button-active-background-color"],
  menuBackground: "--_access-menu-background-color",
  menuColor: "--_access-menu-color",
  iconBackground: "--_access-icon-bg",
  iconColor: "--_access-icon-color",
  menuWidth: "--_access-menu-width",
  borderRadius: ["--_access-menu-border-radius", "--_access-icon-border-radius", "--_access-menu-item-button-border-radius"],
  fontFamily: "--_access-menu-font-family",
  itemColor: "--_access-menu-item-color",
  itemButtonBackground: "--_access-menu-item-button-background",
  itemButtonHoverBackground: "--_access-menu-item-button-hover-background-color",
  itemIconColor: "--_access-menu-item-icon-color",
  iconBoxShadow: "--_access-icon-box-shadow",
  menuHeight: "--_access-menu-height",
  menuMaxHeight: "--_access-menu-max-height",
  menuTop: "--_access-menu-top"
};
function createThemeCss(theme) {
  const declarations = [];
  for (const [key, value] of Object.entries(theme)) {
    if (!value) continue;
    const vars = VAR_MAP[key];
    if (!vars) continue;
    const varList = Array.isArray(vars) ? vars : [vars];
    varList.forEach((v) => declarations.push(`  ${v}: ${value};`));
  }
  return `:root {
${declarations.join("\n")}
}`;
}
function applyTheme(theme) {
  const css = createThemeCss(theme);
  const id = "accessibility-widget-theme";
  const existing = document.getElementById(id);
  if (existing) {
    existing.textContent = css;
    return;
  }
  const style = document.createElement("style");
  style.id = id;
  style.textContent = css;
  document.head.appendChild(style);
}
function removeTheme() {
  var _a;
  (_a = document.getElementById("accessibility-widget-theme")) == null ? void 0 : _a.remove();
}

// src/presets/pt-br.ts
var ptBRLabels = {
  resetTitle: "Resetar",
  closeTitle: "Fechar",
  menuTitle: "Menu de Acessibilidade",
  increaseText: "Aumentar texto",
  increaseTextSpacing: "Aumentar espa\xE7amento",
  invertColors: "Inverter cores",
  grayHues: "Tons de cinza",
  bigCursor: "Cursor grande",
  readingGuide: "Guia de leitura",
  underlineLinks: "Sublinhar links",
  textToSpeech: "Texto para fala",
  disableAnimations: "Desativar anima\xE7\xF5es",
  increaseLineHeight: "Aumentar altura de linha",
  hotkeyPrefix: "Atalho: ",
  hotkeysHelpTitle: "Atalhos de teclado",
  dyslexicFont: "Fonte para dislexia",
  hideImages: "Ocultar imagens"
};

// src/presets/modules.ts
function createModule(config) {
  var _a;
  return {
    id: config.id,
    buttonText: config.label,
    icon: config.icon,
    emoji: config.emoji,
    toggle: (_a = config.toggle) != null ? _a : true,
    method: (_cf, active) => {
      var _a2;
      if (active) config.onActivate();
      else (_a2 = config.onDeactivate) == null ? void 0 : _a2.call(config);
    }
  };
}
function createModules(configs) {
  return configs.map(createModule);
}

// src/accessibility.ts
if (typeof window !== "undefined") {
  window.Accessibility = main_default;
}
var accessibility_default = main_default;
//# sourceMappingURL=index.js.map