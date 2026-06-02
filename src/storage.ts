'use strict';

export class Storage {
  has(key: string): boolean {
    return Object.prototype.hasOwnProperty.call(window.localStorage, key);
  }

  set(key: string, value: any): void {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  get(key: string): any {
    const item = window.localStorage.getItem(key);
    try { return JSON.parse(item!); } catch { return item; }
  }

  clear(): void {
    window.localStorage.clear();
  }

  remove(key: string): void {
    window.localStorage.removeItem(key);
  }

  isSupported(): boolean {
    const test = '_test';
    try {
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
}
