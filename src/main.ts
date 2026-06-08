'use strict';
import { Common } from './common';
import {
  AccessibilityModulesType,
  IAccessibility,
  IAccessibilityModuleOrder,
  IAccessibilityOptions,
  ICustomFunction,
  IIframeModal,
  ISessionState,
  IStateValues,
} from './interfaces/accessibility.interface';
import { IFormattedDim, IJsonToHtml } from './interfaces/common.interface';
import { IMenuInterface } from './interfaces/menu.interface';
import { MenuInterface } from './menu-interface';
import { Storage } from './storage';

export class Accessibility implements IAccessibility {
  static CSS_CLASS_NAME = '_access-main-css';
  static MENU_WIDTH = '20vw';

  private _isReading: boolean = false;
  private _common: Common;
  private _storage: Storage;
  private _options: IAccessibilityOptions;
  private _sessionState: ISessionState;
  private _htmlInitFS!: IFormattedDim;
  private _body!: HTMLBodyElement;
  private _html!: HTMLElement;
  private _icon!: HTMLElement;
  private _menu!: HTMLElement;
  private _htmlOrgFontSize!: string;
  private _stateValues!: IStateValues;
  private _recognition: any;
  private _speechToTextTarget!: HTMLElement;
  private _onKeyDownBind: any;
  private _fixedDefaultFont: string;

  public menuInterface!: IMenuInterface;
  public options: IAccessibilityOptions;

  constructor(options = {} as IAccessibilityOptions) {
    this._common = new Common();
    this._storage = new Storage();
    this._fixedDefaultFont = this._common.getFixedFont('Material Icons');
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
      readingGuide: false,
    };

    if (this.options.icon?.useEmojis) {
      this.fontFallback();
      this.build();
    } else {
      this._common.injectIconsFont(this.options.icon?.fontFaceSrc ?? [], (hasError: boolean) => {
        this.build();
        if (this.options.icon?.fontFamilyValidation) {
          setTimeout(() => {
            this._common.isFontLoaded(this.options.icon!.fontFamilyValidation, (isLoaded: boolean) => {
              if (!isLoaded || hasError) {
                this._common.warn(`${this.options.icon!.fontFamilyValidation} font not loaded, using emojis`);
                this.fontFallback();
                this.destroy();
                this.build();
              }
            });
          });
        }
      });
    }

    if (this.options.modules?.speechToText) {
      window.addEventListener('beforeunload', () => {
        if (this._isReading) {
          window.speechSynthesis.cancel();
          this._isReading = false;
        }
      });
    }
  }

  get stateValues() { return this._stateValues; }
  set stateValues(value: IStateValues) { this._stateValues = value; }
  get html() { return this._html; }
  get body() { return this._body; }
  get menu() { return this._menu; }
  get sessionState() { return this._sessionState; }
  set sessionState(value: ISessionState) { this._sessionState = value; }
  get common() { return this._common; }
  get recognition() { return this._recognition; }
  get isReading() { return this._isReading; }
  set isReading(value: boolean) { this._isReading = value; }
  get fixedDefaultFont() { return this._fixedDefaultFont; }

  private get defaultOptions(): IAccessibilityOptions {
    const res: IAccessibilityOptions = {
      icon: {
        img: 'accessibility',
        fontFaceSrc: ['https://fonts.googleapis.com/icon?family=Material+Icons'],
        fontClass: 'material-icons',
        useEmojis: false,
        closeIcon: 'close',
        resetIcon: 'refresh',
      },
      hotkeys: {
        enabled: false,
        helpTitles: true,
        keys: {
          toggleMenu: ['ctrlKey', 'altKey', 65],
          invertColors: ['ctrlKey', 'altKey', 73],
          grayHues: ['ctrlKey', 'altKey', 71],
          underlineLinks: ['ctrlKey', 'altKey', 85],
          bigCursor: ['ctrlKey', 'altKey', 67],
          readingGuide: ['ctrlKey', 'altKey', 82],
          textToSpeech: ['ctrlKey', 'altKey', 84],
          speechToText: ['ctrlKey', 'altKey', 83],
          disableAnimations: ['ctrlKey', 'altKey', 81],
        },
      },
      guide: { cBorder: '#20ff69', cBackground: '#000000', height: '12px' },
      suppressCssInjection: false,
      suppressDomInjection: false,
      labels: {
        resetTitle: 'Reset', closeTitle: 'Close', menuTitle: 'Accessibility Options',
        increaseText: 'increase text size', decreaseText: 'decrease text size',
        increaseTextSpacing: 'increase text spacing', decreaseTextSpacing: 'decrease text spacing',
        invertColors: 'invert colors', grayHues: 'gray hues', bigCursor: 'big cursor',
        readingGuide: 'reading guide', underlineLinks: 'underline links',
        textToSpeech: 'text to speech', speechToText: 'speech to text',
        disableAnimations: 'disable animations', increaseLineHeight: 'increase line height',
        decreaseLineHeight: 'decrease line height', hotkeyPrefix: 'Hotkey: ',
        dyslexicFont: 'Dyslexic font', hideImages: 'Hide images',
      },
      textPixelMode: false,
      textEmlMode: true,
      textSizeFactor: 12.5,
      animations: { buttons: true },
      modules: {
        increaseText: true, decreaseText: true, increaseTextSpacing: true,
        decreaseTextSpacing: true, increaseLineHeight: true, decreaseLineHeight: true,
        invertColors: true, grayHues: true, bigCursor: true, readingGuide: true,
        underlineLinks: true, textToSpeech: true, speechToText: true, disableAnimations: true,
        dyslexicFont: true, hideImages: true,
      },
      modulesOrder: [] as Array<IAccessibilityModuleOrder>,
      session: { persistent: true },
      iframeModals: [] as Array<IIframeModal>,
      customFunctions: [] as Array<ICustomFunction>,
      statement: { url: '' },
      feedback: { url: '' },
      linkSelector: 'a',
      logoImage: 'https://cdn.jsdelivr.net/npm/ufc-itapaje-accessibility/dist/logo-ufc.png',
      language: { textToSpeechLang: '', speechToTextLang: '' },
    };

    Object.keys(AccessibilityModulesType)
      .filter(k => !isNaN(parseInt(k)))
      .forEach(k => {
        const n = parseInt(k);
        res.modulesOrder!.push({ type: n, order: n });
      });

    return res;
  }

  initFontSize() {
    if (!this._htmlInitFS) {
      const htmlInitFS = this._common.getFormattedDim(getComputedStyle(this._html).fontSize);
      const bodyInitFS = this._common.getFormattedDim(getComputedStyle(this._body).fontSize);
      this._html.style.fontSize = ((htmlInitFS.size as number) / 16 * 100) + '%';
      this._htmlOrgFontSize = this._html.style.fontSize;
      this._body.style.fontSize = ((bodyInitFS.size as number) / (htmlInitFS.size as number)) + 'em';
    }
  }

  fontFallback() {
    this.options.icon!.useEmojis = true;
    this.options.icon!.img = '♿';
    this.options.icon!.fontClass = '';
  }

  addDefaultOptions(options: IAccessibilityOptions) {
    if (options.icon?.closeIconElem) this.options.icon!.closeIconElem = options.icon.closeIconElem;
    if (options.icon?.resetIconElem) this.options.icon!.resetIconElem = options.icon.resetIconElem;
    if (options.icon?.imgElem) this.options.icon!.imgElem = options.icon.imgElem;
    if (!this.options.icon!.closeIconElem)
      this.options.icon!.closeIconElem = { type: '#text', text: !this.options.icon!.useEmojis ? (this.options.icon!.closeIcon ?? 'close') : 'X' };
    if (!this.options.icon!.resetIconElem)
      this.options.icon!.resetIconElem = { type: '#text', text: !this.options.icon!.useEmojis ? (this.options.icon!.resetIcon ?? 'refresh') : '♲' };
    if (!this.options.icon!.imgElem)
      this.options.icon!.imgElem = { type: '#text', text: this.options.icon!.img! };
  }

  addModuleOrderIfNotDefined() {
    this.defaultOptions.modulesOrder!.forEach(mo => {
      if (!this.options.modulesOrder!.find(imo => imo.type === mo.type))
        this.options.modulesOrder!.push(mo);
    });
  }

  disabledUnsupportedFeatures() {
    if (!('webkitSpeechRecognition' in window) || location.protocol !== 'https:') {
      this._common.warn('speech to text requires a browser with webkitSpeechRecognition and https');
      this.options.modules!.speechToText = false;
    }
    const w = window as any;
    if (!w.SpeechSynthesisUtterance || !w.speechSynthesis) {
      this._common.warn('text to speech is not supported in this browser');
      this.options.modules!.textToSpeech = false;
    }
  }

  public injectCss(injectFull: boolean) {
    const iconTop = '7px', iconLeft = '5px';
    const useEmojis = this.options.icon?.useEmojis;
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
      dialog._access:modal { border-color: transparent; border-width: 0; padding: 0; }
      dialog._access[open]::backdrop {
        background: var(--_access-menu-dialog-backdrop-background-end, rgba(0,0,0,0.5));
        animation: _access-dialog-backdrop var(--_access-menu-dialog-backdrop-transition-duration, 0.35s) ease-in-out;
      }
      dialog._access.closing[open]::backdrop { background: var(--_access-menu-dialog-backdrop-background-start, rgba(0,0,0,0.1)); }
      dialog._access.closing[open] { opacity: 0; }
      .screen-reader-wrapper { margin: 0; position: absolute; bottom: -4px; width: calc(100% - 2px); left: 1px; }
      .screen-reader-wrapper-step-1, .screen-reader-wrapper-step-2, .screen-reader-wrapper-step-3 {
        float: left; background: var(--_access-menu-background-color, #fff);
        width: 33.33%; height: 3px; border-radius: 10px;
      }
      .screen-reader-wrapper-step-1.active, .screen-reader-wrapper-step-2.active, .screen-reader-wrapper-step-3.active {
        background: var(--_access-menu-item-button-background, #f9f9f9);
      }
      .access_read_guide_bar {
        box-sizing: border-box;
        background: var(--_access-menu-read-guide-bg, ${this.options.guide!.cBackground});
        width: 100%!important; min-width: 100%!important; position: fixed!important;
        height: var(--_access-menu-read-guide-height, ${this.options.guide!.height}) !important;
        border: var(--_access-menu-read-guide-border, solid 3px ${this.options.guide!.cBorder});
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
          ${!useEmojis ? 'box-shadow: 1px 1px 5px rgba(0,0,0,.5);' : ''}
          transform: ${!useEmojis ? 'scale(1)' : 'skewX(14deg)'};
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
        ._access-menu {
          user-select: none; position: fixed;
          width: var(--_access-menu-width, ${Accessibility.MENU_WIDTH});
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
          ${getComputedStyle(this._body).direction === 'rtl' ? 'text-indent: -5px' : ''}
          top: var(--_access-menu-top, unset); left: var(--_access-menu-left, unset);
          bottom: var(--_access-menu-bottom, 0); right: var(--_access-menu-right, 0);
          padding-bottom: 20px;
          word-spacing: normal; letter-spacing: normal; line-height: normal;
          overflow-y: auto;
        }
          @media (max-width: 600px) {
          ._access-menu {
            height: 100vh !important;       /* Força ocupar toda a altura */
            height: 100dvh !important;      /* Correção para navegadores mobile (Safari/Chrome) */
            max-height: 100dvh !important;
            overflow-y: auto;               /* Permite rolar os botões caso sumam da tela */
          }
        }
        ._access-menu.close {
          z-index: -1; width: 0; opacity: 0; background-color: transparent;
          right: calc(-1 * var(--_access-menu-width, ${Accessibility.MENU_WIDTH}));
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
            border-radius: 50%;
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
            height: 52px !important;
            padding: 0 15px !important;
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
          line-height: ${!useEmojis ? '1' : '1.1'};
          font-size: ${!useEmojis ? '24px' : '20px'} !important;

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
        ._access-menu ul li button[data-access-action="increaseText"]:before { content: var(--_access-menu-item-icon-increase-text, ${!useEmojis ? '"zoom_in"' : '"🔼"'}); top: var(--_access-menu-item-icon-increase-text-top, ${iconTop}); left: var(--_access-menu-item-icon-increase-text-left, ${iconLeft}); }
        ._access-menu ul li button[data-access-action="decreaseText"]:before { content: var(--_access-menu-item-icon-decrease-text, ${!useEmojis ? '"zoom_out"' : '"🔽"'}); top: ${iconTop}; left: ${iconLeft}; }
        ._access-menu ul li button[data-access-action="increaseTextSpacing"]:before { content: var(--_access-menu-item-icon-increase-text-spacing, ${!useEmojis ? '"unfold_more"' : '"🔼"'}); transform: var(--_access-menu-item-icon-increase-text-spacing-transform, rotate(90deg) translate(-7px, 2px)); top: 14px; left: 0; }
        ._access-menu ul li button[data-access-action="decreaseTextSpacing"]:before { content: var(--_access-menu-item-icon-decrease-text-spacing, ${!useEmojis ? '"unfold_less"' : '"🔽"'}); transform: var(--_access-menu-item-icon-decrease-text-spacing-transform, rotate(90deg) translate(-7px, 2px)); top: 14px; left: 0; }
        ._access-menu ul li button[data-access-action="invertColors"]:before { content: var(--_access-menu-item-icon-invert-colors, ${!useEmojis ? '"invert_colors"' : '"🎆"'}); top: ${iconTop}; left: ${iconLeft}; }
        ._access-menu ul li button[data-access-action="grayHues"]:before { content: var(--_access-menu-item-icon-gray-hues, ${!useEmojis ? '"format_color_reset"' : '"🌫️"'}); top: ${iconTop}; left: ${iconLeft}; }
        ._access-menu ul li button[data-access-action="underlineLinks"]:before { content: var(--_access-menu-item-icon-underline-links, ${!useEmojis ? '"format_underlined"' : '"🔗"'}); top: ${iconTop}; left: ${iconLeft}; }
        ._access-menu ul li button[data-access-action="bigCursor"]:before { content: var(--_access-menu-item-icon-big-cursor, inherit); top: ${iconTop}; left: ${iconLeft}; }
        ._access-menu ul li button[data-access-action="readingGuide"]:before { content: var(--_access-menu-item-icon-reading-guide, ${!useEmojis ? '"border_horizontal"' : '"↔️"'}); top: ${iconTop}; left: ${iconLeft}; }
        ._access-menu ul li button[data-access-action="textToSpeech"]:before { content: var(--_access-menu-item-icon-text-to-speech, ${!useEmojis ? '"record_voice_over"' : '"⏺️"'}); top: ${iconTop}; left: ${iconLeft}; }
        ._access-menu ul li button[data-access-action="speechToText"]:before { content: var(--_access-menu-item-icon-speech-to-text, ${!useEmojis ? '"mic"' : '"🎤"'}); top: ${iconTop}; left: ${iconLeft}; }
        ._access-menu ul li button[data-access-action="disableAnimations"]:before { content: var(--_access-menu-item-icon-disable-animations, ${!useEmojis ? '"animation"' : '"🏃‍♂️"'}); top: ${iconTop}; left: ${iconLeft}; }
        ._access-menu ul li button[data-access-action="iframeModals"]:before { content: var(--_access-menu-item-icon-iframe-modals, ${!useEmojis ? '"policy"' : '"⚖️"'}); top: ${iconTop}; left: ${iconLeft}; }
        ._access-menu ul li button[data-access-action="customFunctions"]:before { content: var(--_access-menu-item-icon-custom-functions, ${!useEmojis ? '"psychology_alt"' : '"❓"'}); top: ${iconTop}; left: ${iconLeft}; }
        ._access-menu ul li button[data-access-action="increaseLineHeight"]:before { content: var(--_access-menu-item-icon-increase-line-height, ${!useEmojis ? '"unfold_more"' : '"🔼"'}); top: ${iconTop}; left: ${iconLeft}; }
        ._access-menu ul li button[data-access-action="decreaseLineHeight"]:before { content: var(--_access-menu-item-icon-decrease-line-height, ${!useEmojis ? '"unfold_less"' : '"🔽"'}); top: ${iconTop}; left: ${iconLeft}; }
        ._access-menu ul li button[data-access-action="dyslexicFont"]:before { content: var(--_access-menu-item-icon-dyslexic-font, ${!useEmojis ? '"font_download"' : '"🔤"'}); top: ${iconTop}; left: ${iconLeft}; }
        ._access-menu ul li button[data-access-action="hideImages"]:before { content: var(--_access-menu-item-icon-hide-images, ${!useEmojis ? '"hide_image"' : '"🚫"'}); top: ${iconTop}; left: ${iconLeft}; }
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

    this._common.injectStyle(css, { className: Accessibility.CSS_CLASS_NAME });
    this._common.deployedObjects.set(`.${Accessibility.CSS_CLASS_NAME}`, false);
  }

  public removeCSS() {
    document.querySelector(`.${Accessibility.CSS_CLASS_NAME}`)?.remove();
  }

  injectIcon(): HTMLElement {
    const className = `_access-icon ${this.options.icon!.fontClass} _access`;
    const iconElem = this._common.jsonToHtml({
      type: 'i',
      attrs: {
        class: className,
        title: this.options.hotkeys!.enabled ? this.parseKeys(this.options.hotkeys!.keys.toggleMenu) : this.options.labels!.menuTitle,
        tabIndex: '0',
      },
      children: [this.options.icon!.imgElem!],
    });
    this._body.appendChild(iconElem);
    this._common.deployedObjects.set('._access-icon', false);
    return iconElem;
  }

  parseKeys(arr: Array<any>) {
    if (!this.options.hotkeys!.enabled) return '';
    if (!this.options.hotkeys!.helpTitles) return '';
    return this.options.labels!.hotkeyPrefix + arr
      .map(val => Number.isInteger(val) ? String.fromCharCode(val).toLowerCase() : val.replace('Key', ''))
      .join('+');
  }

  injectMenu(): HTMLElement {
    const labels = this.options.labels!;
    const hotkeys = this.options.hotkeys!;
    const mods = this.options.modules ?? {};
    const menuItems: IJsonToHtml[] = [
      { action: 'increaseText', label: labels.increaseText },
      { action: 'decreaseText', label: labels.decreaseText },
      { action: 'increaseTextSpacing', label: labels.increaseTextSpacing },
      { action: 'decreaseTextSpacing', label: labels.decreaseTextSpacing },
      { action: 'increaseLineHeight', label: labels.increaseLineHeight },
      { action: 'decreaseLineHeight', label: labels.decreaseLineHeight },
      { action: 'invertColors', label: labels.invertColors, hotkey: hotkeys.keys.invertColors },
      { action: 'grayHues', label: labels.grayHues, hotkey: hotkeys.keys.grayHues },
      { action: 'underlineLinks', label: labels.underlineLinks, hotkey: hotkeys.keys.underlineLinks },
      { action: 'bigCursor', label: labels.bigCursor, hotkey: hotkeys.keys.bigCursor },
      { action: 'readingGuide', label: labels.readingGuide, hotkey: hotkeys.keys.readingGuide },
      { action: 'disableAnimations', label: labels.disableAnimations, hotkey: hotkeys.keys.disableAnimations },
      { action: 'dyslexicFont', label: labels.dyslexicFont },
      { action: 'hideImages', label: labels.hideImages },
    ].filter(({ action }) => (mods as any)[action] !== false)
      .map(({ action, label, hotkey }: any) => ({
        type: 'li',
        children: [{
          type: 'button',
          attrs: { 'data-access-action': action, ...(hotkey ? { title: this.parseKeys(hotkey) } : {}) },
          children: [
            ...(action === 'bigCursor' ? [{ type: 'div', attrs: { id: 'iconBigCursor' } }] : []),
            { type: '#text', text: label },
          ],
        }],
      }));

    const json: IJsonToHtml = {
      type: 'div',
      attrs: { class: '_access-menu close _access' },
      children: [
        {
          type: 'div',
          attrs: { class: '_text-center', role: 'presentation' },
          children: [
            {
              type: 'button',
              attrs: { class: `_menu-close-btn _menu-btn ${this.options.icon!.fontClass}`, style: `font-family: var(--_access-menu-close-btn-font-family, ${this._fixedDefaultFont})`, title: hotkeys.enabled ? this.parseKeys(hotkeys.keys.toggleMenu) : labels.closeTitle },
              children: [this.options.icon!.closeIconElem!],
            },
            { type: '#text', text: labels.menuTitle },

          ],
        },
        {
          type: 'div',
          attrs: { class: 'content' },
          children: [
            { type: 'ul', attrs: { class: 'before-collapse _access-scrollbar' }, children: menuItems },
            {
              type: 'button',
              attrs: { class: '_menu-reset-btn', title: labels.resetTitle },
              children: [
                { type: 'span', attrs: { class: this.options.icon!.fontClass, style: `font-family: var(--_access-menu-reset-btn-font-family, ${this._fixedDefaultFont}); font-size: 18px; line-height: 1;` }, children: [this.options.icon!.resetIconElem!] },
                { type: 'span', children: [{ type: '#text', text: labels.resetTitle }] },
              ],
            },
          ],
        },

        ...(this.options.logoImage ? [{
          type: 'img',
          attrs: { src: this.options.logoImage, alt: '', class: '_access-menu-logo' },
        }] : []),
      ],
    };

    if (this.options.iframeModals) {
      this.options.iframeModals.forEach((im, i) => {
        const btn: IJsonToHtml = {
          type: 'li',
          children: [{
            type: 'button',
            attrs: { 'data-access-action': 'iframeModals', 'data-access-url': im.iframeUrl },
            children: [{ type: '#text', text: im.buttonText }],
          }],
        };
        const icon = im.icon && !this.options.icon?.useEmojis ? im.icon : (im.emoji && this.options.icon?.useEmojis ? im.emoji : null);
        if (icon) {
          btn.children![0].attrs!['data-access-iframe-index'] = String(i);
          const className = '_data-access-iframe-index-' + i;
          this._common.injectStyle(`._access-menu ul li button[data-access-action="iframeModals"][data-access-iframe-index="${i}"]:before { content: "${icon}"; }`, { className });
          this._common.deployedObjects.set('.' + className, false);
        }
        const ul = json.children![1].children![0];
        if (this.options.modules!.textToSpeech) ul.children!.splice(ul.children!.length - 2, 0, btn);
        else ul.children!.push(btn);
      });
    }

    if (this.options.customFunctions) {
      this.options.customFunctions.forEach((cf, i) => {
        const btn: IJsonToHtml = {
          type: 'li',
          children: [{
            type: 'button',
            attrs: { 'data-access-action': 'customFunctions', 'data-access-custom-id': cf.id, 'data-access-custom-index': String(i) },
            children: [{ type: '#text', text: cf.buttonText }],
          }],
        };
        const icon = cf.icon && !this.options.icon?.useEmojis ? cf.icon : (cf.emoji && this.options.icon?.useEmojis ? cf.emoji : null);
        if (icon) {
          const className = '_data-access-custom-id-' + cf.id;
          this._common.injectStyle(`._access-menu ul li button[data-access-action="customFunctions"][data-access-custom-id="${cf.id}"]:before { content: "${icon}"; }`, { className });
          this._common.deployedObjects.set('.' + className, false);
        }
        const ul = json.children![1].children![0];
        if (this.options.modules!.textToSpeech) ul.children!.splice(ul.children!.length - 2, 0, btn);
        else ul.children!.push(btn);
      });
    }

    const menuElem = this._common.jsonToHtml(json);
    this._body.appendChild(menuElem);

    setTimeout(() => {
      const ic = document.getElementById('iconBigCursor');
      if (ic) {
        ic.outerHTML += '<svg version="1.1" id="iconBigCursorSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="position:absolute;width:19px;height:19px;top:9px;left:9px" xml:space="preserve"><path d="M 423.547 323.115 l -320 -320 c -3.051 -3.051 -7.637 -3.947 -11.627 -2.304 s -6.592 5.547 -6.592 9.856 V 480 c 0 4.501 2.837 8.533 7.083 10.048 c 4.224 1.536 8.981 0.192 11.84 -3.285 l 85.205 -104.128 l 56.853 123.179 c 1.792 3.883 5.653 6.187 9.685 6.187 c 1.408 0 2.837 -0.277 4.203 -0.875 l 74.667 -32 c 2.645 -1.131 4.736 -3.285 5.76 -5.973 c 1.024 -2.688 0.939 -5.675 -0.277 -8.299 l -57.024 -123.52 h 132.672 c 4.309 0 8.213 -2.603 9.856 -6.592 C 427.515 330.752 426.598 326.187 423.547 323.115 Z"/></svg>';
        document.getElementById('iconBigCursor')?.remove();
      }
    }, 1);

    this._common.deployedObjects.set('._access-menu', false);

    const addToggleListener = (el: Element | null, handler: () => void) => {
      el?.addEventListener('click', () => handler(), false);
      el?.addEventListener('keyup', (e: Event) => {
        if ((e as KeyboardEvent).key === 'Enter') handler();
      }, false);
    };

    addToggleListener(menuElem.querySelector('._menu-close-btn'), () => this.toggleMenu());
    addToggleListener(menuElem.querySelector('._menu-reset-btn'), () => this.resetAll());

    return menuElem;
  }

  getVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise(resolve => {
      const synth = window.speechSynthesis;
      const id = setInterval(() => {
        if (synth.getVoices().length !== 0) { resolve(synth.getVoices()); clearInterval(id); }
      }, 10);
    });
  }

  async injectTts(): Promise<void> {
    const voices = await this.getVoices();
    const targetLang = this.options.language!.textToSpeechLang.toLowerCase();
    const isLngSupported = !targetLang || voices.some(v =>
      v.lang.toLowerCase() === targetLang ||
      v.lang.toLowerCase().startsWith(targetLang.split('-')[0])
    );
    if (!isLngSupported) return;

    const tts = this.common.jsonToHtml({
      type: 'li',
      children: [{
        type: 'button',
        attrs: { 'data-access-action': 'textToSpeech', title: this.parseKeys(this.options.hotkeys!.keys.textToSpeech) },
        children: [
          { type: '#text', text: this.options.labels!.textToSpeech },
          {
            type: 'div', attrs: { class: 'screen-reader-wrapper' }, children: [
              { type: 'div', attrs: { class: 'screen-reader-wrapper-step-1', tabIndex: '-1' } },
              { type: 'div', attrs: { class: 'screen-reader-wrapper-step-2', tabIndex: '-1' } },
              { type: 'div', attrs: { class: 'screen-reader-wrapper-step-3', tabIndex: '-1' } },
            ]
          },
        ],
      }],
    });
    const sts = this.common.jsonToHtml({
      type: 'li',
      children: [{
        type: 'button',
        attrs: { 'data-access-action': 'speechToText', title: this.parseKeys(this.options.hotkeys!.keys.speechToText) },
        children: [{ type: '#text', text: this.options.labels!.speechToText }],
      }],
    });

    const ul = this._menu.querySelector('ul')!;
    ul.appendChild(sts);
    ul.appendChild(tts);
  }

  addListeners() {
    this._menu.querySelectorAll('ul li').forEach(li => {
      ['click', 'keyup'].forEach(evt =>
        li.addEventListener(evt, (e: Event) => {
          const ev = e || window.event;
          if ((ev as KeyboardEvent).detail === 0 && (ev as KeyboardEvent).key !== 'Enter') return;
          const actionEl = (ev.target as HTMLElement).closest<HTMLElement>('[data-access-action]');
          if (!actionEl) return;
          this.invoke(actionEl.getAttribute('data-access-action')!, actionEl);
        })
      );
    });

    [...Array.from(this._menu.getElementsByClassName('screen-reader-wrapper-step-1')),
    ...Array.from(this._menu.getElementsByClassName('screen-reader-wrapper-step-2')),
    ...Array.from(this._menu.getElementsByClassName('screen-reader-wrapper-step-3'))
    ].forEach(el =>
      el.addEventListener('click', (e: Event) => {
        const action = (e.target as HTMLElement).parentElement!.parentElement!.getAttribute('data-access-action')!;
        this.invoke(action, e.target as HTMLElement);
      }, false)
    );
  }

  sortModuleTypes() {
    this.options.modulesOrder!.sort((a, b) => a.order - b.order);
  }

  disableUnsupportedModulesAndSort() {
    this.sortModuleTypes();
    const ul = this._menu.querySelector('ul')!;
    this.options.modulesOrder!.forEach(item => {
      const module = AccessibilityModulesType[item.type] as string;
      const enabled = (this.options.modules as any)[module];
      const btn = this._menu.querySelector<HTMLElement>(`button[data-access-action="${module}"]`);
      if (btn) {
        btn.parentElement!.remove();
        ul.appendChild(btn.parentElement!);
        if (!enabled) btn.parentElement!.classList.add('not-supported');
      }
    });
  }

  resetAll() {
    this.menuInterface.textToSpeech(true);
    this.menuInterface.speechToText(true);
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
    this.resetIfDefined(this._stateValues.body.fontSize, this._body.style, 'fontSize');
    if (typeof this._htmlOrgFontSize !== 'undefined') this._html.style.fontSize = this._htmlOrgFontSize;
    document.querySelectorAll('[data-init-font-size]').forEach(el => {
      (el as HTMLElement).style.fontSize = el.getAttribute('data-init-font-size')!;
      el.removeAttribute('data-init-font-size');
    });
    this._sessionState.textSize = 0;
    this.onChange(true);
  }

  resetLineHeight() {
    this.resetIfDefined(this._stateValues.body.lineHeight, this.body.style, 'lineHeight');
    document.querySelectorAll('[data-init-line-height]').forEach(el => {
      (el as HTMLElement).style.lineHeight = el.getAttribute('data-init-line-height')!;
      el.removeAttribute('data-init-line-height');
    });
    this.sessionState.lineHeight = 0;
    this.onChange(true);
  }

  resetTextSpace() {
    this.resetIfDefined(this._stateValues.body.wordSpacing, this._body.style, 'wordSpacing');
    this.resetIfDefined(this._stateValues.body.letterSpacing, this._body.style, 'letterSpacing');
    document.querySelectorAll('[data-init-word-spacing]').forEach(el => {
      (el as HTMLElement).style.wordSpacing = el.getAttribute('data-init-word-spacing')!;
      el.removeAttribute('data-init-word-spacing');
    });
    document.querySelectorAll('[data-init-letter-spacing]').forEach(el => {
      (el as HTMLElement).style.letterSpacing = el.getAttribute('data-init-letter-spacing')!;
      el.removeAttribute('data-init-letter-spacing');
    });
    this._sessionState.textSpace = 0;
    this.onChange(true);
  }

  alterTextSize(isIncrease: boolean) {
    this._sessionState.textSize += isIncrease ? 1 : -1;
    this.onChange(true);
    let factor = this.options.textSizeFactor! * (isIncrease ? 1 : -1);

    if (this.options.textPixelMode) {
      const excludeSize = Array.from(document.querySelectorAll('._access *'));
      document.querySelectorAll('*:not(._access)').forEach(el => {
        if (excludeSize.includes(el)) return;
        const fSize = getComputedStyle(el).fontSize;
        if (fSize?.includes('px')) {
          if (!el.getAttribute('data-init-font-size')) el.setAttribute('data-init-font-size', fSize);
          (el as HTMLElement).style.fontSize = (parseInt(fSize) + factor) + 'px';
        }
      });
      const bodyFs = getComputedStyle(this._body).fontSize;
      if (bodyFs?.includes('px')) {
        if (!this._body.getAttribute('data-init-font-size')) this._body.setAttribute('data-init-font-size', bodyFs);
        this._body.style.fontSize = (parseInt(bodyFs) + factor) + 'px';
      }
    } else if (this.options.textEmlMode) {
      const fp = this._html.style.fontSize;
      if (fp.includes('%')) {
        this._html.style.fontSize = (parseInt(fp) + factor) + '%';
        const menuEl = this._menu as HTMLElement;
        if (menuEl) menuEl.style.fontSize = '16px';
      }
      else this._common.warn('textEmlMode: html element font-size is not in %.');
    } else {
      const fSize = this._common.getFormattedDim(getComputedStyle(this._body).fontSize);
      if (typeof this._stateValues.body.fontSize === 'undefined')
        this._stateValues.body.fontSize = fSize.size + fSize.suffix;
      if (fSize?.suffix) this._body.style.fontSize = ((fSize.size as number) + factor) + fSize.suffix;
    }
    if (this._stateValues.textToSpeech) this.textToSpeech(`Text Size ${isIncrease ? 'Increased' : 'Decreased'}`);
  }

  alterLineHeight(isIncrease: boolean) {
    this.sessionState.lineHeight += isIncrease ? 1 : -1;
    this.onChange(true);
    let factor = (isIncrease ? 1 : -1) * (this.options.textEmlMode ? 20 : 2);
    const exclude = Array.from(document.querySelectorAll('._access *'));

    document.querySelectorAll('*:not(._access)').forEach(el => {
      if (exclude.includes(el)) return;
      if (this.options.textPixelMode) {
        const lh = getComputedStyle(el).lineHeight;
        if (lh?.includes('px')) {
          if (!el.getAttribute('data-init-line-height')) el.setAttribute('data-init-line-height', lh);
          (el as HTMLElement).style.lineHeight = (parseInt(lh) + factor) + 'px';
        }
      } else if (this.options.textEmlMode) {
        let lh = getComputedStyle(el).lineHeight;
        const fs = getComputedStyle(el).fontSize;
        if (lh === 'normal') lh = (parseInt(fs) * 1.2) + 'px';
        if (lh?.includes('px')) {
          const pct = (parseInt(lh) * 100) / parseInt(fs);
          if (!el.getAttribute('data-init-line-height')) el.setAttribute('data-init-line-height', pct + '%');
          (el as HTMLElement).style.lineHeight = (pct + factor) + '%';
        }
        if (typeof this._stateValues.body.lineHeight === 'undefined') this._stateValues.body.lineHeight = '';
      }
    });
    if (this._stateValues.textToSpeech) this.textToSpeech(`Line Height ${isIncrease ? 'Increased' : 'Decreased'}`);
  }

  alterTextSpace(isIncrease: boolean) {
    this._sessionState.textSpace += isIncrease ? 1 : -1;
    this.onChange(true);
    const factor = isIncrease ? 2 : -2;

    if (this.options.textPixelMode) {
      const exclude = Array.from(document.querySelectorAll('._access *'));
      document.querySelectorAll('*:not(._access)').forEach(el => {
        if (exclude.includes(el)) return;
        const ws = (el as HTMLElement).style.wordSpacing;
        if (!el.getAttribute('data-init-word-spacing')) el.setAttribute('data-init-word-spacing', ws);
        (el as HTMLElement).style.wordSpacing = ws?.includes('px') ? (parseInt(ws) + factor) + 'px' : factor + 'px';
        const ls = (el as HTMLElement).style.letterSpacing;
        if (!el.getAttribute('data-init-letter-spacing')) el.setAttribute('data-init-letter-spacing', ls);
        (el as HTMLElement).style.letterSpacing = ls?.includes('px') ? (parseInt(ls) + factor) + 'px' : factor + 'px';
      });
    } else {
      const ws = this._common.getFormattedDim(getComputedStyle(this._body).wordSpacing) as any;
      if (typeof this._stateValues.body.wordSpacing === 'undefined') this._stateValues.body.wordSpacing = '';
      if (ws?.suffix) this._body.style.wordSpacing = ((ws.size * 1) + factor) + ws.suffix;
      const ls = this._common.getFormattedDim(getComputedStyle(this._body).letterSpacing) as any;
      if (typeof this._stateValues.body.letterSpacing === 'undefined') this._stateValues.body.letterSpacing = '';
      if (ls?.suffix) this._body.style.letterSpacing = ((ls.size * 1) + factor) + ls.suffix;
    }
    if (this._stateValues.textToSpeech) this.textToSpeech(`Text Spacing ${isIncrease ? 'Increased' : 'Decreased'}`);
  }

  speechToText() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    this._recognition = new SR();
    this._recognition.continuous = true;
    this._recognition.interimResults = true;
    this._recognition.onstart = () => this._body.classList.add('_access-listening');
    this._recognition.onend = () => this._body.classList.remove('_access-listening');
    this._recognition.onresult = (event: any) => {
      if (typeof event.results === 'undefined') return;
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i)
        if (event.results[i].isFinal) final += event.results[i][0].transcript;
      if (final && this._speechToTextTarget) {
        this._speechToTextTarget.parentElement!.classList.remove('_access-listening');
        const tag = this._speechToTextTarget.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea')
          (this._speechToTextTarget as HTMLInputElement).value = final;
        else if (this._speechToTextTarget.getAttribute('contenteditable') !== null)
          this._speechToTextTarget.innerText = final;
      }
    };
    this._recognition.lang = this.options.language!.speechToTextLang;
    this._recognition.start();
  }

  textToSpeech(text: string) {
    const w = window as any;
    if (!w.SpeechSynthesisUtterance || !w.speechSynthesis) return;
    const msg = new w.SpeechSynthesisUtterance(text);
    msg.lang = this.options.language!.textToSpeechLang;
    msg.rate = this._stateValues.speechRate;
    msg.onend = () => { this._isReading = false; };
    const voices = w.speechSynthesis.getVoices();
    const voice = voices.find((v: SpeechSynthesisVoice) => v.lang === msg.lang);
    if (voice) msg.voice = voice;
    else this._common.warn('text to speech language not supported!');
    if (window.speechSynthesis.pending || window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
    this._isReading = true;
  }

  createScreenShot(url: string): Promise<string> {
    return this._common.createScreenshot(url);
  }

  listen() {
    this._recognition?.stop?.();
    this._speechToTextTarget = (window as any).event?.target as HTMLElement;
    this.speechToText();
  }

  read(e: Event) {
    try {
      e = (window as any).event || e;
      e?.preventDefault?.();
      e?.stopPropagation?.();
    } catch { }

    const menuEls = Array.from(document.querySelectorAll('._access-menu *'));
    if (menuEls.includes((window as any).event?.target as Element) && e instanceof MouseEvent) return;

    if (e instanceof KeyboardEvent && (e.shiftKey && e.key === 'Tab' || e.key === 'Tab')) {
      this.textToSpeech(((window as any).event?.target as HTMLElement)?.innerText);
      return;
    }

    if (this._isReading) { window.speechSynthesis.cancel(); this._isReading = false; }
    else this.textToSpeech(((window as any).event?.target as HTMLElement)?.innerText);
  }

  runHotkey(name: string) {
    if (name === 'toggleMenu') { this.toggleMenu(); return; }
    if (typeof (this.menuInterface as any)[name] === 'function' && (this._options.modules as any)[name])
      (this.menuInterface as any)[name](false);
  }

  toggleMenu() {
    const shouldClose = this._menu.classList.contains('close');
    setTimeout(() => this._menu.querySelector('ul')!.classList.toggle('before-collapse'), shouldClose ? 10 : 500);
    this._menu.classList.toggle('close');
    this.options.icon!.tabIndex = shouldClose ? 0 : -1;
    this._menu.childNodes.forEach(child => {
      if (child.hasChildNodes() && child.nodeType === Node.ELEMENT_NODE && (child as HTMLElement).tagName === 'P')
        (child as HTMLElement).tabIndex = -1;
    });
  }

  invoke(action: string, button: HTMLElement) {
    if (typeof (this.menuInterface as any)[action] === 'function')
      (this.menuInterface as any)[action](undefined, button);
  }

  onKeyDown(e: KeyboardEvent) {
    const act = Object.entries(this.options.hotkeys!.keys).find(([, keys]) =>
      keys.every((k: string | number) => Number.isInteger(k) ? e.keyCode === k : (e as any)[k] === true)
    );
    if (act) this.runHotkey(act[0]);
  }

  build() {
    this._stateValues = { underlineLinks: false, textToSpeech: false, bigCursor: false, readingGuide: false, speechRate: 1, body: {}, html: {} };
    this._body = document.body as HTMLBodyElement;
    this._html = document.documentElement;
    if (this.options.textEmlMode) this.initFontSize();
    this.injectCss(!this.options.suppressCssInjection && !this.options.suppressDomInjection);
    if (!this.options.suppressDomInjection) {
      this._icon = this.injectIcon();
      this._menu = this.injectMenu();
      this.injectTts();
      setTimeout(() => { this.addListeners(); this.disableUnsupportedModulesAndSort(); }, 10);
      if (this.options.hotkeys!.enabled) document.addEventListener('keydown', this._onKeyDownBind, false);
      this._icon.addEventListener('click', () => this.toggleMenu(), false);
      this._icon.addEventListener('keyup', (e) => { if (e.key === 'Enter') this.toggleMenu(); }, false);
      setTimeout(() => { this._icon.style.opacity = '1'; }, 10);

      document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !this._menu.classList.contains('close')) this.toggleMenu();
      }, false);

      document.addEventListener('click', (e: MouseEvent) => {
        if (this._menu.classList.contains('close')) return;
        if (this._menu.contains(e.target as Node) || this._icon.contains(e.target as Node)) return;
        this.toggleMenu();
      }, false);
    }

    this.updateReadGuide = (e: Event | TouchEvent | any) => {
      const newPos = e.type === 'touchmove' ? e.changedTouches[0].clientY : e.y;
      const bar = document.getElementById('access_read_guide_bar');
      if (bar) bar.style.top = (newPos - (parseInt(this.options.guide!.height) + 5)) + 'px';
    };

    this.menuInterface = new MenuInterface(this);
    if (this.options.session!.persistent) this.setSessionFromCache();
  }

  updateReadGuide(e: Event | TouchEvent | any) {
    const newPos = e.type === 'touchmove' ? e.changedTouches[0].clientY : e.y;
    const bar = document.getElementById('access_read_guide_bar');
    if (bar) bar.style.top = (newPos - (parseInt(this.options.guide!.height) + 5)) + 'px';
  }

  resetIfDefined(src: string, dest: any, prop: string) {
    if (typeof src !== 'undefined') dest[prop] = src;
  }

  onChange(updateSession: boolean) {
    if (updateSession && this.options.session!.persistent) this.saveSession();
  }

  saveSession() { this._storage.set('_accessState', this.sessionState); }

  setSessionFromCache() {
    const s = this._storage.get('_accessState');
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
      document.querySelector(key)?.parentElement?.removeChild(document.querySelector(key)!);
    });
    document.removeEventListener('keydown', this._onKeyDownBind, false);
  }
}

export default Accessibility;
