interface ICommon {
    deployedObjects: IDeployedObjects;
    isIOS(): boolean;
    jsonToHtml(obj: IJsonToHtml): HTMLElement;
    injectStyle(css: string, innerOptions?: IInjectStyleOptions): void;
    getFormattedDim(value: string): IFormattedDim;
    extend(src: any, dest: any): void;
    injectIconsFont(urls: Array<string>, callback: Function): void;
    getFixedFont(name: string): void;
    getFixedPseudoFont(name: string): void;
    isFontLoaded(fontFamily?: string, callback?: Function): void;
    warn(msg: string): void;
    createScreenshot(url: string): Promise<string>;
    getFileExtension(filename: string): string;
}
interface IJsonToHtml {
    type: string;
    attrs?: any;
    children?: Array<IJsonToHtml>;
    text?: string;
}
interface IInjectStyleOptions {
    className?: string;
}
interface IFormattedDim {
    size: string | number;
    suffix: string;
}
interface IUnitsDim {
    size: string | number;
    units: string;
}
interface IDeployedObjects {
    get(key: string): boolean;
    contains(key: string): boolean;
    set(key: string, val: boolean): void;
    remove(key: string): void;
    getAll(): Map<string, boolean>;
}

declare class Common implements ICommon {
    static DEFAULT_PIXEL: string;
    private body;
    private deployedMap;
    private _isIOS;
    private _canvas;
    constructor();
    isIOS(): boolean;
    jsonToHtml(obj: IJsonToHtml): HTMLElement;
    injectStyle(css: string, innerOptions?: IInjectStyleOptions): HTMLStyleElement;
    getFormattedDim(value: string): IFormattedDim;
    extend(src: any, dest: any): any;
    injectIconsFont(urls: Array<string>, callback: Function): void;
    getFixedFont(name: string): any;
    getFixedPseudoFont(name: string): any;
    isFontLoaded(fontFamily?: string, callback?: Function): void;
    warn(msg: string): void;
    get deployedObjects(): IDeployedObjects;
    createScreenshot(url: string): Promise<string>;
    getFileExtension(filename: string): string;
}

interface IMenuInterface {
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

interface IAccessibility {
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
interface IAccessibilityOptions {
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
interface ICustomFunction {
    method: (cf: ICustomFunction, active: boolean) => void;
    buttonText: string;
    id: any;
    toggle?: boolean;
    icon?: string;
    emoji?: string;
}
interface IIframeModal {
    iframeUrl: string;
    buttonText: string;
    icon?: string;
    emoji?: string;
}
interface IAccessibilityIconOptions {
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
interface IAccessibilityIconPositionOptions {
    top?: IUnitsDim;
    bottom?: IUnitsDim;
    left?: IUnitsDim;
    right?: IUnitsDim;
    type?: string;
}
interface IAccessibilityIconDimensionsOptions {
    width: IUnitsDim;
    height: IUnitsDim;
}
interface IAccessibilityHotkeysOptions {
    enabled?: boolean;
    helpTitles?: boolean;
    keys: IAccessibilityHotkeysKeysOptions;
}
interface IAccessibilityHotkeysKeysOptions {
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
interface IAccessibilityGuideOptions {
    cBorder: string;
    cBackground: string;
    height: string;
}
interface IAccessibilityMenuDimensionsOptions {
    width: IUnitsDim;
    height: IUnitsDim;
}
interface IAccessibilityMenuLabelsOptions {
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
interface IAccessibilityModulesOptions {
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
interface IAccessibilityAnimationsOptions {
    buttons?: boolean;
}
declare enum AccessibilityModulesType {
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
    hideImages = 18
}
interface IAccessibilityModuleOrder {
    order: number;
    type: AccessibilityModulesType;
}
interface IAccessibilitySessionOptions {
    persistent?: boolean;
}
interface IAccessibilityUrlOptions {
    url: string;
}
interface IAccessibilityLanguageOptions {
    textToSpeechLang: string;
}
interface ISessionState {
    textSize: number;
    textSpace: number;
    lineHeight: number;
    invertColors?: boolean;
    grayHues?: boolean;
    underlineLinks?: boolean;
    bigCursor?: boolean;
    readingGuide?: boolean;
}
interface IStateValues {
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

declare class Accessibility implements IAccessibility {
    static CSS_CLASS_NAME: string;
    static MENU_WIDTH: string;
    private _isReading;
    private _common;
    private _storage;
    private _options;
    private _sessionState;
    private _htmlInitFS;
    private _body;
    private _html;
    private _icon;
    private _menu;
    private _htmlOrgFontSize;
    private _stateValues;
    private _onKeyDownBind;
    private _fixedDefaultFont;
    menuInterface: IMenuInterface;
    options: IAccessibilityOptions;
    constructor(options?: IAccessibilityOptions);
    get stateValues(): IStateValues;
    set stateValues(value: IStateValues);
    get html(): HTMLElement;
    get body(): HTMLBodyElement;
    get menu(): HTMLElement;
    get sessionState(): ISessionState;
    set sessionState(value: ISessionState);
    get common(): Common;
    get isReading(): boolean;
    set isReading(value: boolean);
    get fixedDefaultFont(): string;
    private get defaultOptions();
    initFontSize(): void;
    fontFallback(): void;
    addDefaultOptions(options: IAccessibilityOptions): void;
    addModuleOrderIfNotDefined(): void;
    disabledUnsupportedFeatures(): void;
    injectCss(injectFull: boolean): void;
    removeCSS(): void;
    injectIcon(): HTMLElement;
    parseKeys(arr: Array<any>): string;
    injectMenu(): HTMLElement;
    getVoices(): Promise<SpeechSynthesisVoice[]>;
    injectTts(): Promise<void>;
    addListeners(): void;
    sortModuleTypes(): void;
    disableUnsupportedModulesAndSort(): void;
    resetAll(): void;
    resetTextSize(): void;
    resetLineHeight(): void;
    resetTextSpace(): void;
    alterTextSize(isIncrease: boolean): void;
    alterLineHeight(isIncrease: boolean): void;
    alterTextSpace(isIncrease: boolean): void;
    pickVoice(voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | undefined;
    textToSpeech(text: string): void;
    createScreenShot(url: string): Promise<string>;
    read(e: Event): void;
    runHotkey(name: string): void;
    toggleMenu(): void;
    invoke(action: string, button: HTMLElement): void;
    onKeyDown(e: KeyboardEvent): void;
    build(): void;
    updateReadGuide(e: Event | TouchEvent | any): void;
    resetIfDefined(src: string, dest: any, prop: string): void;
    onChange(updateSession: boolean): void;
    saveSession(): void;
    setSessionFromCache(): void;
    destroy(): void;
}

interface AccessibilityTheme {
    /** Cor principal do ícone e botões ativos */
    primaryColor?: string;
    /** Cor de fundo do menu */
    menuBackground?: string;
    /** Cor do texto no menu */
    menuColor?: string;
    /** Cor de fundo do ícone flutuante */
    iconBackground?: string;
    /** Cor do ícone flutuante */
    iconColor?: string;
    /** Largura do menu (ex: '300px', '25vw') */
    menuWidth?: string;
    /** Border radius do menu e ícone */
    borderRadius?: string;
    /** Família de fonte do menu */
    fontFamily?: string;
    /** Cor do texto dos itens do menu */
    itemColor?: string;
    /** Cor de fundo dos botões do menu */
    itemButtonBackground?: string;
    /** Cor ao passar o mouse nos botões */
    itemButtonHoverBackground?: string;
    /** Cor dos ícones dos itens */
    itemIconColor?: string;
    /** Sombra do ícone flutuante */
    iconBoxShadow?: string;
    /** Altura do menu */
    menuHeight?: string;
    /** Altura máxima do menu */
    menuMaxHeight?: string;
    /** Posição top do menu */
    menuTop?: string;
}
declare function createThemeCss(theme: AccessibilityTheme): string;
declare function applyTheme(theme: AccessibilityTheme): void;
declare function removeTheme(): void;

declare const ptBRLabels: IAccessibilityMenuLabelsOptions;

interface CreateModuleConfig {
    /** ID único do módulo */
    id: string;
    /** Texto exibido no botão */
    label: string;
    /** Ícone Material Icons (quando não usa emojis) */
    icon?: string;
    /** Emoji (quando usa emojis) */
    emoji?: string;
    /** Se true, o botão alterna entre ativo/inativo */
    toggle?: boolean;
    /** Chamado quando o módulo é ativado */
    onActivate: () => void;
    /** Chamado quando o módulo é desativado (apenas se toggle = true) */
    onDeactivate?: () => void;
}
declare function createModule(config: CreateModuleConfig): ICustomFunction;
declare function createModules(configs: CreateModuleConfig[]): ICustomFunction[];

export { Accessibility, AccessibilityModulesType, type AccessibilityTheme, type CreateModuleConfig, type IAccessibility, type IAccessibilityAnimationsOptions, type IAccessibilityGuideOptions, type IAccessibilityHotkeysKeysOptions, type IAccessibilityHotkeysOptions, type IAccessibilityIconDimensionsOptions, type IAccessibilityIconOptions, type IAccessibilityIconPositionOptions, type IAccessibilityMenuDimensionsOptions, type IAccessibilityMenuLabelsOptions, type IAccessibilityModulesOptions, type IAccessibilityOptions, type IAccessibilitySessionOptions, type ICustomFunction, type IIframeModal, type IMenuInterface, type ISessionState, type IStateValues, applyTheme, createModule, createModules, createThemeCss, Accessibility as default, ptBRLabels, removeTheme };
