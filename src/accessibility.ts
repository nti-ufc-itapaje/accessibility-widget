import Accessibility from './main';
import {
  IAccessibility,
  IAccessibilityOptions,
  IAccessibilityIconOptions,
  IAccessibilityIconPositionOptions,
  IAccessibilityIconDimensionsOptions,
  IAccessibilityHotkeysOptions,
  IAccessibilityHotkeysKeysOptions,
  IAccessibilityGuideOptions,
  IAccessibilityMenuDimensionsOptions,
  IAccessibilityMenuLabelsOptions,
  IAccessibilityModulesOptions,
  IAccessibilityAnimationsOptions,
  IAccessibilitySessionOptions,
  ISessionState,
  IStateValues,
  ICustomFunction,
  IIframeModal,
  AccessibilityModulesType,
} from './interfaces/accessibility.interface';
import { IMenuInterface } from './interfaces/menu.interface';
import { AccessibilityTheme, applyTheme, createThemeCss, removeTheme } from './theme';
import { ptBRLabels } from './presets/pt-br';
import { createModule, createModules, CreateModuleConfig } from './presets/modules';

if (typeof window !== 'undefined') {
  (window as any).Accessibility = Accessibility;
}

export {
  Accessibility,
  // interfaces
  IAccessibility,
  IAccessibilityOptions,
  IAccessibilityIconOptions,
  IAccessibilityIconPositionOptions,
  IAccessibilityIconDimensionsOptions,
  IAccessibilityHotkeysOptions,
  IAccessibilityHotkeysKeysOptions,
  IAccessibilityGuideOptions,
  IAccessibilityMenuDimensionsOptions,
  IAccessibilityMenuLabelsOptions,
  IAccessibilityModulesOptions,
  IAccessibilityAnimationsOptions,
  IAccessibilitySessionOptions,
  ISessionState,
  IStateValues,
  ICustomFunction,
  IIframeModal,
  IMenuInterface,
  AccessibilityModulesType,
  // theming
  AccessibilityTheme,
  applyTheme,
  createThemeCss,
  removeTheme,
  // presets
  ptBRLabels,
  createModule,
  createModules,
  CreateModuleConfig,
};

export default Accessibility;
