import { IAccessibility } from './interfaces/accessibility.interface';
import { IMenuInterface } from './interfaces/menu.interface';

export class MenuInterface implements IMenuInterface {
  private _acc: IAccessibility;
  private readBind: any;
  private _dialog!: HTMLDialogElement;

  constructor(accessibility: IAccessibility) {
    this._acc = accessibility;
    this.readBind = this._acc.read.bind(this._acc);
  }

  private updateCycleButton(btn: HTMLElement, level: number, max: number) {
    if (level > 0) btn.classList.add('active'); else btn.classList.remove('active');
    let indicator = btn.querySelector('._access-cycle-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = '_access-cycle-indicator';
      for (let i = 0; i < max; i++) indicator.appendChild(document.createElement('span'));
      btn.appendChild(indicator);
    }
    indicator.querySelectorAll('span').forEach((span, i) => span.classList.toggle('filled', i < level));
  }

  refreshCycleButtons() {
    const find = (action: string) => this._acc.menu?.querySelector<HTMLElement>(`[data-access-action="${action}"]`);
    const t = find('increaseText'); if (t) this.updateCycleButton(t, this._acc.sessionState.textSize, 3);
    const s = find('increaseTextSpacing'); if (s) this.updateCycleButton(s, this._acc.sessionState.textSpace, 3);
    const l = find('increaseLineHeight'); if (l) this.updateCycleButton(l, this._acc.sessionState.lineHeight, 3);
  }

  increaseText(_destroy?: boolean, btn?: HTMLElement) {
    if (this._acc.sessionState.textSize >= 3) {
      this._acc.resetTextSize();
    } else {
      this._acc.alterTextSize(true);
    }
    if (btn) this.updateCycleButton(btn, this._acc.sessionState.textSize, 3);
  }
  increaseTextSpacing(_destroy?: boolean, btn?: HTMLElement) {
    if (this._acc.sessionState.textSpace >= 3) {
      this._acc.resetTextSpace();
    } else {
      this._acc.alterTextSpace(true);
    }
    if (btn) this.updateCycleButton(btn, this._acc.sessionState.textSpace, 3);
  }
  increaseLineHeight(_destroy?: boolean, btn?: HTMLElement) {
    if (this._acc.sessionState.lineHeight >= 3) {
      this._acc.resetLineHeight();
    } else {
      this._acc.alterLineHeight(true);
    }
    if (btn) this.updateCycleButton(btn, this._acc.sessionState.lineHeight, 3);
  }

  invertColors(destroy?: boolean) {
    const counterClass = '_access-invert-counter';
    const removeCounter = () => document.querySelector('.' + counterClass)?.remove();

    if (typeof this._acc.stateValues.html.backgroundColor === 'undefined')
      this._acc.stateValues.html.backgroundColor = getComputedStyle(this._acc.html).backgroundColor;
    if (typeof this._acc.stateValues.html.color === 'undefined')
      this._acc.stateValues.html.color = getComputedStyle(this._acc.html).color;

    if (destroy) {
      this._acc.resetIfDefined(this._acc.stateValues.html.backgroundColor, this._acc.html.style, 'backgroundColor');
      this._acc.resetIfDefined(this._acc.stateValues.html.color, this._acc.html.style, 'color');
      if (!this._acc.options.suppressDomInjection)
        this._acc.menu.querySelector('[data-access-action="invertColors"]')?.classList.remove('active');
      this._acc.stateValues.invertColors = false;
      this._acc.sessionState.invertColors = false;
      this._acc.onChange(true);
      this._acc.html.style.filter = '';
      removeCounter();
      return;
    }

    if (!this._acc.options.suppressDomInjection)
      this._acc.menu.querySelector('[data-access-action="invertColors"]')?.classList.toggle('active');
    this._acc.stateValues.invertColors = !this._acc.stateValues.invertColors;
    this._acc.sessionState.invertColors = this._acc.stateValues.invertColors!;
    this._acc.onChange(true);

    if (this._acc.stateValues.invertColors) {
      if (this._acc.stateValues.grayHues) this._acc.menuInterface.grayHues(true);
      this._acc.html.style.filter = 'invert(1)';
      this._acc.common.injectStyle('._access { filter: invert(1) !important; }', { className: counterClass });
      this._acc.common.deployedObjects.set('.' + counterClass, false);
      if (this._acc.stateValues.textToSpeech) this._acc.textToSpeech('Colors Inverted');
    } else {
      this._acc.html.style.filter = '';
      removeCounter();
      if (this._acc.stateValues.textToSpeech) this._acc.textToSpeech('Colors Set To Normal');
    }
  }

  grayHues(destroy?: boolean) {
    const overlayClass = '_access-gray-overlay';
    const removeOverlay = () => {
      document.querySelector('.' + overlayClass)?.remove();
    };

    if (destroy) {
      if (!this._acc.options.suppressDomInjection)
        this._acc.menu.querySelector('[data-access-action="grayHues"]')?.classList.remove('active');
      this._acc.stateValues.grayHues = false;
      this._acc.sessionState.grayHues = false;
      this._acc.onChange(true);
      removeOverlay();
      return;
    }

    if (!this._acc.options.suppressDomInjection)
      this._acc.menu.querySelector('[data-access-action="grayHues"]')?.classList.toggle('active');
    this._acc.stateValues.grayHues = !this._acc.stateValues.grayHues;
    this._acc.sessionState.grayHues = this._acc.stateValues.grayHues!;
    this._acc.onChange(true);

    if (this._acc.stateValues.grayHues) {
      if (this._acc.stateValues.invertColors) this.invertColors(true);
      const overlay = document.createElement('div');
      overlay.className = overlayClass;
      overlay.style.cssText = 'position:fixed;inset:0;z-index:9998;backdrop-filter:grayscale(1);-webkit-backdrop-filter:grayscale(1);pointer-events:none;';
      document.body.appendChild(overlay);
      this._acc.common.deployedObjects.set('.' + overlayClass, false);
      if (this._acc.stateValues.textToSpeech) this._acc.textToSpeech('Gray Hues Enabled.');
    } else {
      removeOverlay();
      if (this._acc.stateValues.textToSpeech) this._acc.textToSpeech('Gray Hues Disabled.');
    }
  }

  underlineLinks(destroy?: boolean) {
    const className = '_access-underline';
    const remove = () => {
      const style = document.querySelector('.' + className);
      if (style) {
        style.parentElement!.removeChild(style);
        this._acc.common.deployedObjects.remove('.' + className);
      }
    };

    if (destroy) {
      this._acc.stateValues.underlineLinks = false;
      this._acc.sessionState.underlineLinks = false;
      this._acc.onChange(true);
      if (!this._acc.options.suppressDomInjection)
        this._acc.menu.querySelector('[data-access-action="underlineLinks"]')?.classList.remove('active');
      return remove();
    }

    if (!this._acc.options.suppressDomInjection)
      this._acc.menu.querySelector('[data-access-action="underlineLinks"]')?.classList.toggle('active');
    this._acc.stateValues.underlineLinks = !this._acc.stateValues.underlineLinks;
    this._acc.sessionState.underlineLinks = this._acc.stateValues.underlineLinks;
    this._acc.onChange(true);

    if (this._acc.stateValues.underlineLinks) {
      const parts = (this._acc.options.linkSelector ?? 'a').split(',').map(s => s.trim());
      const rules = parts.flatMap(s => [`body ${s}`, `body ${s} *`]).join(', ');
      this._acc.common.injectStyle(`${rules} { text-decoration: underline !important; }`, { className });
      this._acc.common.deployedObjects.set('.' + className, true);
      if (this._acc.stateValues.textToSpeech) this._acc.textToSpeech('Links UnderLined');
    } else {
      if (this._acc.stateValues.textToSpeech) this._acc.textToSpeech('Links UnderLine Removed');
      remove();
    }
  }

  bigCursor(destroy?: boolean) {
    if (destroy) {
      this._acc.html.classList.remove('_access_cursor');
      if (!this._acc.options.suppressDomInjection)
        this._acc.menu.querySelector('[data-access-action="bigCursor"]')?.classList.remove('active');
      this._acc.stateValues.bigCursor = false;
      this._acc.sessionState.bigCursor = false;
      this._acc.onChange(true);
      return;
    }

    if (!this._acc.options.suppressDomInjection)
      this._acc.menu.querySelector('[data-access-action="bigCursor"]')?.classList.toggle('active');
    this._acc.stateValues.bigCursor = !this._acc.stateValues.bigCursor;
    this._acc.sessionState.bigCursor = this._acc.stateValues.bigCursor;
    this._acc.onChange(true);
    this._acc.html.classList.toggle('_access_cursor');
    if (this._acc.stateValues.textToSpeech)
      this._acc.textToSpeech(this._acc.stateValues.bigCursor ? 'Big Cursor Enabled' : 'Big Cursor Disabled');
  }

  readingGuide(destroy?: boolean) {
    if (destroy) {
      document.getElementById('access_read_guide_bar')?.remove();
      if (!this._acc.options.suppressDomInjection)
        this._acc.menu.querySelector('[data-access-action="readingGuide"]')?.classList.remove('active');
      this._acc.stateValues.readingGuide = false;
      this._acc.sessionState.readingGuide = false;
      this._acc.onChange(true);
      document.body.removeEventListener('touchmove', this._acc.updateReadGuide, false);
      document.body.removeEventListener('mousemove', this._acc.updateReadGuide, false);
      return;
    }

    if (!this._acc.options.suppressDomInjection)
      this._acc.menu.querySelector('[data-access-action="readingGuide"]')?.classList.toggle('active');
    this._acc.stateValues.readingGuide = !this._acc.stateValues.readingGuide;
    this._acc.sessionState.readingGuide = this._acc.stateValues.readingGuide;
    this._acc.onChange(true);

    if (this._acc.stateValues.readingGuide) {
      const read = document.createElement('div');
      read.id = 'access_read_guide_bar';
      read.classList.add('access_read_guide_bar');
      document.body.append(read);
      document.body.addEventListener('touchmove', this._acc.updateReadGuide, false);
      document.body.addEventListener('mousemove', this._acc.updateReadGuide, false);
    } else {
      document.getElementById('access_read_guide_bar')?.remove();
      document.body.removeEventListener('touchmove', this._acc.updateReadGuide, false);
      document.body.removeEventListener('mousemove', this._acc.updateReadGuide, false);
      if (this._acc.stateValues.textToSpeech) this._acc.textToSpeech('Reading Guide Disabled');
    }
  }

  private dispatchTextToSpeechState(state: 'normal' | 'fast' | 'slow' | 'off') {
    document.dispatchEvent(new CustomEvent('access:textToSpeech', { detail: { state } }));
  }

  textToSpeech(destroy?: boolean) {
    const tSpeechList = this._acc.menu.querySelector<HTMLElement>('[data-access-action="textToSpeech"]');
    if (!tSpeechList) return;

    this._acc.onChange(false);

    const className = '_access-text-to-speech';
    const remove = () => {
      const style = document.querySelector('.' + className);
      if (style) {
        style.parentElement!.removeChild(style);
        document.removeEventListener('click', this.readBind, false);
        document.removeEventListener('keyup', this.readBind, false);
        this._acc.common.deployedObjects.remove('.' + className);
      }
      window.speechSynthesis?.cancel();
      this._acc.isReading = false;
    };

    if (destroy) {
      this.updateCycleButton(tSpeechList, 0, 3);
      this._acc.stateValues.textToSpeech = false;
      window.speechSynthesis?.cancel();
      tSpeechList.removeAttribute('data-speech-rate');
      this.dispatchTextToSpeechState('off');
      return remove();
    }

    if (this._acc.stateValues.speechRate === 1 && !tSpeechList.classList.contains('active')) {
      this._acc.stateValues.textToSpeech = true;
      this._acc.textToSpeech('Screen Reader enabled. Reading Pace - Normal');
      this.updateCycleButton(tSpeechList, 1, 3);
      tSpeechList.setAttribute('data-speech-rate', 'normal');
      this.dispatchTextToSpeechState('normal');
    } else if (this._acc.stateValues.speechRate === 1 && tSpeechList.classList.contains('active')) {
      this._acc.stateValues.speechRate = 1.5;
      this._acc.textToSpeech('Reading Pace - Fast');
      this.updateCycleButton(tSpeechList, 2, 3);
      tSpeechList.setAttribute('data-speech-rate', 'fast');
      this.dispatchTextToSpeechState('fast');
    } else if (this._acc.stateValues.speechRate === 1.5 && tSpeechList.classList.contains('active')) {
      this._acc.stateValues.speechRate = 0.7;
      this._acc.textToSpeech('Reading Pace - Slow');
      this.updateCycleButton(tSpeechList, 3, 3);
      tSpeechList.setAttribute('data-speech-rate', 'slow');
      this.dispatchTextToSpeechState('slow');
    } else {
      this._acc.stateValues.speechRate = 1;
      this._acc.textToSpeech('Screen Reader - Disabled');
      this.updateCycleButton(tSpeechList, 0, 3);
      tSpeechList.removeAttribute('data-speech-rate');
      this.dispatchTextToSpeechState('off');
      const timeout = setInterval(() => {
        if (this._acc.isReading) return;
        this._acc.stateValues.textToSpeech = false;
        remove();
        clearTimeout(timeout);
      }, 500);
      return;
    }

    if (tSpeechList.classList.contains('active') && this._acc.stateValues.speechRate === 1) {
      this._acc.common.injectStyle('*:hover { box-shadow: 2px 2px 2px rgba(180,180,180,0.7); }', { className });
      this._acc.common.deployedObjects.set('.' + className, true);
      document.addEventListener('click', this.readBind, false);
      document.addEventListener('keyup', this.readBind, false);
    }
  }

  disableAnimations(destroy?: boolean) {
    const className = '_access-disable-animations';
    const autoplayStopped = 'data-autoplay-stopped';

    const remove = () => {
      if (!this._acc.options.suppressDomInjection)
        this._acc.menu.querySelector('[data-access-action="disableAnimations"]')?.classList.remove('active');
      this._acc.stateValues.disableAnimations = false;
      document.querySelector('.' + className)?.parentElement?.removeChild(document.querySelector('.' + className)!);
      this._acc.common.deployedObjects.remove('.' + className);
      (document.querySelectorAll('[data-org-src]') as NodeListOf<HTMLImageElement>).forEach(img => {
        const screenshot = img.src;
        img.setAttribute('src', img.getAttribute('data-org-src')!);
        img.setAttribute('data-org-src', screenshot);
      });
      (document.querySelectorAll(`video[${autoplayStopped}]`) as NodeListOf<HTMLVideoElement>).forEach(v => {
        v.setAttribute('autoplay', '');
        v.removeAttribute(autoplayStopped);
        v.play();
      });
    };

    if (destroy) { remove(); return; }

    this._acc.stateValues.disableAnimations = !this._acc.stateValues.disableAnimations;
    if (!this._acc.stateValues.disableAnimations) { remove(); return; }

    if (!this._acc.options.suppressDomInjection)
      this._acc.menu.querySelector('[data-access-action="disableAnimations"]')?.classList.add('active');

    this._acc.common.injectStyle(
      'body * { animation-duration: 0.0ms !important; transition-duration: 0.0ms !important; }',
      { className }
    );
    this._acc.common.deployedObjects.set('.' + className, true);

    (document.querySelectorAll('img') as NodeListOf<HTMLImageElement>).forEach(async img => {
      const ext = this._acc.common.getFileExtension(img.src);
      if (ext?.toLowerCase() === 'gif') {
        let screenshot = img.getAttribute('data-org-src');
        if (!screenshot) screenshot = await this._acc.common.createScreenshot(img.src);
        img.setAttribute('data-org-src', img.src);
        img.src = screenshot!;
      }
    });

    (document.querySelectorAll('video[autoplay]') as NodeListOf<HTMLVideoElement>).forEach(v => {
      v.setAttribute(autoplayStopped, '');
      v.removeAttribute('autoplay');
      v.pause();
    });
  }

  iframeModals(destroy?: boolean, button?: HTMLElement) {
    if (!button) destroy = true;
    const close = () => {
      if (this._dialog) {
        this._dialog.classList.add('closing');
        setTimeout(() => {
          this._dialog.classList.remove('closing');
          this._dialog.close();
          this._dialog.remove();
          detach();
        }, 350);
      }
      button?.classList.remove('active');
    };
    const onClose = () => close();
    const detach = () => {
      this._dialog?.querySelector('button')?.removeEventListener('click', onClose, false);
      this._dialog?.removeEventListener('close', onClose);
    };

    if (destroy) { close(); return; }

    button!.classList.add('active');
    if (!this._dialog) this._dialog = document.createElement('dialog');
    this._dialog.classList.add('_access');
    this._dialog.innerHTML = '';
    this._dialog.appendChild(this._acc.common.jsonToHtml({
      type: 'div',
      children: [
        {
          type: 'div',
          children: [{
            type: 'button',
            attrs: {
              role: 'button',
              style: 'position:absolute;top:15px;right:5px;cursor:pointer;font-size:16px!important;font-weight:bold;background:#f3f4f6;border:none;color:#d63c3c;padding:0;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;',
            },
            children: [{ type: '#text', text: 'X' }],
          }],
        },
        {
          type: 'div',
          children: [{
            type: 'iframe',
            attrs: { src: button!.getAttribute('data-access-url'), style: 'width:50vw;height:50vh;padding:30px;' },
          }],
        },
      ],
    }));
    document.body.appendChild(this._dialog);
    this._dialog.querySelector('button')!.addEventListener('click', onClose, false);
    this._dialog.addEventListener('close', onClose);
    this._dialog.showModal();
  }

  private formatHotkey(keys: Array<any>): string {
    const names: Record<string, string> = { ctrlKey: 'Ctrl', altKey: 'Alt', shiftKey: 'Shift', metaKey: 'Meta' };
    return keys
      .map(val => Number.isInteger(val) ? String.fromCharCode(val).toUpperCase() : (names[val] ?? val))
      .join(' + ');
  }

  hotkeysHelp() {
    if (!this._acc.options.hotkeys?.enabled) return;

    const close = () => {
      if (this._dialog) {
        this._dialog.classList.add('closing');
        setTimeout(() => {
          this._dialog.classList.remove('closing');
          this._dialog.close();
          this._dialog.remove();
          detach();
        }, 350);
      }
    };
    const onClose = () => close();
    const detach = () => {
      this._dialog?.querySelector('button')?.removeEventListener('click', onClose, false);
      this._dialog?.removeEventListener('close', onClose);
    };

    const keys = this._acc.options.hotkeys!.keys as any;
    const labels = this._acc.options.labels!;
    const mods = this._acc.options.modules ?? {};
    const rows = Object.keys(keys)
      .filter(name => name === 'toggleMenu' || (mods as any)[name] !== false)
      .map(name => ({
        type: 'li',
        children: [
          { type: 'span', children: [{ type: '#text', text: name === 'toggleMenu' ? labels.menuTitle : (labels as any)[name] }] },
          { type: 'span', attrs: { class: '_access-hotkeys-help-combo' }, children: [{ type: '#text', text: this.formatHotkey(keys[name]) }] },
        ],
      }));

    if (!this._dialog) this._dialog = document.createElement('dialog');
    this._dialog.classList.add('_access');
    this._dialog.innerHTML = '';
    this._dialog.appendChild(this._acc.common.jsonToHtml({
      type: 'div',
      children: [
        {
          type: 'div',
          children: [{
            type: 'button',
            attrs: {
              role: 'button',
              style: 'position:absolute;top:15px;right:5px;cursor:pointer;font-size:16px!important;font-weight:bold;background:#f3f4f6;border:none;color:#d63c3c;padding:0;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;',
            },
            children: [{ type: '#text', text: 'X' }],
          }],
        },
        {
          type: 'div',
          attrs: { style: 'padding:30px; max-width:70vw;' },
          children: [
            { type: 'h2', children: [{ type: '#text', text: labels.hotkeysHelpTitle }] },
            { type: 'ul', attrs: { class: '_access-hotkeys-help-list' }, children: rows as any },
          ],
        },
      ],
    }));
    document.body.appendChild(this._dialog);
    this._dialog.querySelector('button')!.addEventListener('click', onClose, false);
    this._dialog.addEventListener('close', onClose);
    this._dialog.showModal();
  }

  customFunctions(destroy?: boolean, button?: HTMLElement) {
    if (!button) return;
    const cf = this._acc.options.customFunctions![parseInt(button.getAttribute('data-access-custom-index')!)];
    if (cf.toggle && button.classList.contains('active')) destroy = true;
    if (destroy) {
      if (cf.toggle) button.classList.remove('active');
      cf.method(cf, false);
    } else {
      if (cf.toggle) button.classList.add('active');
      cf.method(cf, true);
    }
  }

  dyslexicFont(destroy?: boolean) {
    const className = '_access-dyslexic-font';
    const linkClassName = '_access-dyslexic-font-link';
    const btn = this._acc.menu.querySelector('[data-access-action="dyslexicFont"]');
    const remove = () => {
      document.querySelector('.' + className)?.remove();
      document.querySelector('.' + linkClassName)?.remove();
      this._acc.common.deployedObjects.remove('.' + linkClassName);
    };

    if (destroy) {
      this._acc.stateValues.dyslexicFont = false;
      btn?.classList.remove('active');
      remove();
      return;
    }

    this._acc.stateValues.dyslexicFont = !this._acc.stateValues.dyslexicFont;
    btn?.classList.toggle('active');

    if (this._acc.stateValues.dyslexicFont) {
      if (!document.querySelector('.' + linkClassName)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Lexend&display=swap';
        link.className = linkClassName;
        document.head.appendChild(link);
        this._acc.common.deployedObjects.set('.' + linkClassName, true);
      }
      this._acc.common.injectStyle(
        `body *:not(._access):not(._access *) { font-family: 'Lexend', Arial, sans-serif !important; }`,
        { className }
      );
      this._acc.common.deployedObjects.set('.' + className, false);
    } else {
      remove();
    }
  }

  hideImages(destroy?: boolean) {
    const className = '_access-hide-images';
    const btn = this._acc.menu.querySelector('[data-access-action="hideImages"]');

    if (destroy) {
      this._acc.stateValues.hideImages = false;
      btn?.classList.remove('active');
      document.querySelector('.' + className)?.remove();
      return;
    }

    this._acc.stateValues.hideImages = !this._acc.stateValues.hideImages;
    btn?.classList.toggle('active');

    if (this._acc.stateValues.hideImages) {
      this._acc.common.injectStyle(
        'img, picture, svg:not(._access svg) { visibility: hidden !important; } *:not(._access):not(._access *) { background-image: none !important; }',
        { className }
      );
      this._acc.common.deployedObjects.set('.' + className, false);
    } else {
      document.querySelector('.' + className)?.remove();
    }
  }
}
