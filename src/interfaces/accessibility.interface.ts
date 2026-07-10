import { ICommon, IJsonToHtml, IUnitsDim } from './common.interface';
import { IMenuInterface } from './menu.interface';

export interface IAccessibility {
  menuInterface: IMenuInterface;
  options: IAccessibilityOptions;
  sessionState: ISessionState;
  common: ICommon;
  stateValues: IStateValues;
  isReading?: boolean;
  readonly html: HTMLElement;
  readonly body: HTMLBodyElement;
  readonly menu: HTMLElement;
  readonly fixedDefaultFont: string;
  alterTextSize(isIncrease: boolean): void;
  alterTextSpace(isIncrease: boolean): void;
  alterLineHeight(isIncrease: boolean): void;
  resetTextSize(): void;
  resetTextSpace(): void;
  resetLineHeight(): void;
  textToSpeech(text: string): void;
  read(e?: Event): void;
  runHotkey(name: string): void;
  toggleMenu(): void;
  invoke(action: string, button: HTMLElement): void;
  build(): void;
  updateReadGuide(e: Event | TouchEvent | any): void;
  resetIfDefined(src: string, dest: any, prop: string): void;
  onChange(updateSession: boolean): void;
  createScreenShot(url: string): Promise<string>;
  injectCss(injectFull: boolean): void;
  removeCSS(): void;
}

export interface IAccessibilityOptions {
  icon?: IAccessibilityIconOptions;
  hotkeys?: IAccessibilityHotkeysOptions;
  guide?: IAccessibilityGuideOptions;
  labels?: IAccessibilityMenuLabelsOptions;
  textToSpeechLang?: string;
  textPixelMode?: boolean;
  textEmlMode?: boolean;
  textSizeFactor?: number;
  modules?: IAccessibilityModulesOptions;
  modulesOrder?: Array<IAccessibilityModuleOrder>;
  session?: IAccessibilitySessionOptions;
  iframeModals?: Array<IIframeModal>;
  customFunctions?: Array<ICustomFunction>;
  statement?: IAccessibilityUrlOptions;
  feedback?: IAccessibilityUrlOptions;
  language?: IAccessibilityLanguageOptions;
  linkSelector?: string;
  logoImage?: string;
  suppressCssInjection?: boolean;
  suppressDomInjection?: boolean;
  animations?: IAccessibilityAnimationsOptions;
}

export interface ICustomFunction {
  method: (cf: ICustomFunction, active: boolean) => void;
  buttonText: string;
  id: any;
  toggle?: boolean;
  icon?: string;
  emoji?: string;
}

export interface IIframeModal {
  iframeUrl: string;
  buttonText: string;
  icon?: string;
  emoji?: string;
}

export interface IAccessibilityIconOptions {
  img?: string;
  imgElem?: IJsonToHtml;
  fontFaceSrc?: Array<string>;
  fontClass?: string;
  useEmojis?: boolean;
  fontFamilyValidation?: string;
  tabIndex?: number;
  closeIcon?: string;
  resetIcon?: string;
  closeIconElem?: IJsonToHtml;
  resetIconElem?: IJsonToHtml;
}

export interface IAccessibilityIconPositionOptions {
  top?: IUnitsDim;
  bottom?: IUnitsDim;
  left?: IUnitsDim;
  right?: IUnitsDim;
  type?: string;
}

export interface IAccessibilityIconDimensionsOptions {
  width: IUnitsDim;
  height: IUnitsDim;
}

export interface IAccessibilityHotkeysOptions {
  enabled?: boolean;
  helpTitles?: boolean;
  keys: IAccessibilityHotkeysKeysOptions;
}

export interface IAccessibilityHotkeysKeysOptions {
  toggleMenu: Array<any>;
  increaseText: Array<any>;
  increaseTextSpacing: Array<any>;
  increaseLineHeight: Array<any>;
  invertColors: Array<any>;
  grayHues: Array<any>;
  underlineLinks: Array<any>;
  bigCursor: Array<any>;
  readingGuide: Array<any>;
  textToSpeech: Array<any>;
  disableAnimations: Array<any>;
  dyslexicFont: Array<any>;
  hideImages: Array<any>;
}

export interface IAccessibilityGuideOptions {
  cBorder: string;
  cBackground: string;
  height: string;
}

export interface IAccessibilityMenuDimensionsOptions {
  width: IUnitsDim;
  height: IUnitsDim;
}

export interface IAccessibilityMenuLabelsOptions {
  resetTitle: string;
  closeTitle: string;
  menuTitle: string;
  increaseText: string;
  increaseTextSpacing: string;
  invertColors: string;
  grayHues: string;
  bigCursor: string;
  readingGuide: string;
  underlineLinks: string;
  textToSpeech: string;
  disableAnimations: string;
  increaseLineHeight: string;
  hotkeyPrefix: string;
  hotkeysHelpTitle: string;
  dyslexicFont: string;
  hideImages: string;
}

export interface IAccessibilityModulesOptions {
  increaseText?: boolean;
  increaseTextSpacing?: boolean;
  increaseLineHeight?: boolean;
  invertColors?: boolean;
  grayHues?: boolean;
  bigCursor?: boolean;
  readingGuide?: boolean;
  underlineLinks?: boolean;
  textToSpeech?: boolean;
  disableAnimations?: boolean;
  dyslexicFont?: boolean;
  hideImages?: boolean;
}

export interface IAccessibilityAnimationsOptions {
  buttons?: boolean;
}

export enum AccessibilityModulesType {
  increaseText = 1,
  increaseTextSpacing = 3,
  increaseLineHeight = 5,
  invertColors = 7,
  grayHues = 8,
  bigCursor = 9,
  readingGuide = 10,
  underlineLinks = 11,
  textToSpeech = 12,
  disableAnimations = 14,
  iframeModals = 15,
  customFunctions = 16,
  dyslexicFont = 17,
  hideImages = 18,
}

export interface IAccessibilityModuleOrder {
  order: number;
  type: AccessibilityModulesType;
}

export interface IAccessibilitySessionOptions {
  persistent?: boolean;
}

export interface IAccessibilityUrlOptions {
  url: string;
}

export interface IAccessibilityLanguageOptions {
  textToSpeechLang: string;
}

export interface ISessionState {
  textSize: number;
  textSpace: number;
  lineHeight: number;
  invertColors?: boolean;
  grayHues?: boolean;
  underlineLinks?: boolean;
  bigCursor?: boolean;
  readingGuide?: boolean;
}

export interface IStateValues {
  underlineLinks?: boolean;
  textToSpeech?: boolean;
  bigCursor?: boolean;
  readingGuide?: boolean;
  invertColors?: boolean;
  grayHues?: boolean;
  disableAnimations?: boolean;
  dyslexicFont?: boolean;
  hideImages?: boolean;
  speechRate?: number;
  body: any;
  html: any;
}
