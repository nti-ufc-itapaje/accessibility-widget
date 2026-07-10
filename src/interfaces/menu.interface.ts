export interface IMenuInterface {
  increaseText(destroy?: boolean, btn?: HTMLElement): void;
  increaseTextSpacing(destroy?: boolean, btn?: HTMLElement): void;
  invertColors(destroy?: boolean): void;
  grayHues(destroy?: boolean): void;
  underlineLinks(destroy?: boolean): void;
  bigCursor(destroy?: boolean): void;
  readingGuide(destroy?: boolean): void;
  textToSpeech(destroy?: boolean): void;
  disableAnimations(destroy?: boolean): void;
  iframeModals(destroy?: boolean, button?: HTMLElement): void;
  customFunctions(destroy?: boolean, button?: HTMLElement): void;
  increaseLineHeight(destroy?: boolean, btn?: HTMLElement): void;
  dyslexicFont(destroy?: boolean): void;
  hideImages(destroy?: boolean): void;
  refreshCycleButtons(): void;
  hotkeysHelp(): void;
}
