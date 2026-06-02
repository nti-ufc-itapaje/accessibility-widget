'use strict';

import { ICommon, IDeployedObjects, IFormattedDim, IInjectStyleOptions, IJsonToHtml } from './interfaces/common.interface';

export class Common implements ICommon {
  static DEFAULT_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/QVDRcoAAAAASUVORK5CYII=';
  private body!: HTMLBodyElement;
  private deployedMap!: Map<string, boolean>;
  private _isIOS!: boolean;
  private _canvas!: HTMLCanvasElement;

  constructor() {
    this.body = (document.body || document.querySelector('body')) as HTMLBodyElement;
    this.deployedMap = new Map<string, boolean>();
  }

  isIOS() {
    if (typeof this._isIOS === 'boolean') return this._isIOS;
    const devices = ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'];
    this._isIOS = !!navigator.platform && devices.some(d => navigator.platform === d);
    return this._isIOS;
  }

  jsonToHtml(obj: IJsonToHtml): HTMLElement {
    let elm = document.createElement(obj.type);
    for (let i in obj.attrs) {
      elm.setAttribute(i, obj.attrs[i]);
    }
    for (const child of (obj.children ?? [])) {
      let newElem: any = null;
      if (child.type === '#text') {
        newElem = document.createTextNode(child.text ?? '');
      } else {
        newElem = this.jsonToHtml(child);
      }
      if ((newElem?.tagName?.toLowerCase() !== 'undefined') || newElem.nodeType === 3)
        elm.appendChild(newElem);
    }
    return elm;
  }

  injectStyle(css: string, innerOptions = {} as IInjectStyleOptions) {
    let sheet = document.createElement('style');
    sheet.appendChild(document.createTextNode(css));
    if (innerOptions.className) sheet.classList.add(innerOptions.className);
    this.body.appendChild(sheet);
    return sheet;
  }

  getFormattedDim(value: string): IFormattedDim {
    if (!value) return null as any;
    value = String(value);
    const by = (val: string, suffix: string): IFormattedDim => ({
      size: val.substring(0, val.indexOf(suffix)),
      suffix,
    });
    if (value.includes('%')) return by(value, '%');
    if (value.includes('rem')) return by(value, 'rem');
    if (value.includes('px')) return by(value, 'px');
    if (value.includes('em')) return by(value, 'em');
    if (value.includes('pt')) return by(value, 'pt');
    if (value === 'auto') return by(value, '');
    return null as any;
  }

  extend(src: any, dest: any) {
    for (let i in src) {
      if (typeof src[i] === 'object') {
        if (dest && dest[i]) {
          if (dest[i] instanceof Array) src[i] = dest[i];
          else src[i] = this.extend(src[i], dest[i]);
        }
      } else if (typeof dest === 'object' && typeof dest[i] !== 'undefined') {
        src[i] = dest[i];
      }
    }
    return src;
  }

  injectIconsFont(urls: Array<string>, callback: Function) {
    if (!urls?.length) return;
    let head = document.getElementsByTagName('head')[0];
    let counter = 0;
    let hasErrors = false;
    let onload = (e: Event | string) => {
      if (typeof e === 'string' || e.type === 'error') hasErrors = true;
      if (!--counter) callback(hasErrors);
    };
    urls.forEach(url => {
      let link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = url;
      link.className = `_access-font-icon-${counter++}`;
      link.onload = onload;
      link.onerror = onload;
      this.deployedObjects.set('.' + link.className, true);
      head.appendChild(link);
    });
  }

  getFixedFont(name: string) {
    if (this.isIOS()) return (name as any).replaceAll(' ', '+');
    return name;
  }

  getFixedPseudoFont(name: string) {
    if (this.isIOS()) return (name as any).replaceAll('+', ' ');
    return name;
  }

  isFontLoaded(fontFamily?: string, callback?: Function) {
    try {
      const onReady = () => callback!((document as any).fonts.check(`1em ${(fontFamily as any).replaceAll('+', ' ')}`));
      (document as any).fonts.ready.then(onReady, onReady);
    } catch {
      callback!(true);
    }
  }

  warn(msg: string) {
    const prefix = 'AccessibilityWidget: ';
    (console.warn || console.log)(prefix + msg);
  }

  get deployedObjects(): IDeployedObjects {
    return {
      get: (key: string) => this.deployedMap.get(key)!,
      contains: (key: string) => this.deployedMap.has(key),
      set: (key: string, val: boolean) => { this.deployedMap.set(key, val); },
      remove: (key: string) => { this.deployedMap.delete(key); },
      getAll: () => this.deployedMap,
    };
  }

  createScreenshot(url: string): Promise<string> {
    return new Promise((resolve) => {
      if (!this._canvas) this._canvas = document.createElement('canvas');
      const img = new Image();
      this._canvas.style.cssText = 'position:fixed;top:0;left:0;opacity:0.05;transform:scale(0.05)';
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        document.body.appendChild(this._canvas);
        const ctx = this._canvas.getContext('2d')!;
        this._canvas.width = img.naturalWidth;
        this._canvas.height = img.naturalHeight;
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        ctx.drawImage(img, 0, 0);
        let res = Common.DEFAULT_PIXEL;
        try { res = this._canvas.toDataURL('image/png'); } catch {}
        resolve(res);
        this._canvas.remove();
      };
      img.onerror = () => resolve(Common.DEFAULT_PIXEL);
      img.src = url;
    });
  }

  getFileExtension(filename: string): string {
    return filename.substring(filename.lastIndexOf('.') + 1) || filename;
  }
}
