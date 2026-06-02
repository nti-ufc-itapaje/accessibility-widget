import { ICustomFunction } from '../interfaces/accessibility.interface';

export interface CreateModuleConfig {
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

export function createModule(config: CreateModuleConfig): ICustomFunction {
  return {
    id: config.id,
    buttonText: config.label,
    icon: config.icon,
    emoji: config.emoji,
    toggle: config.toggle ?? true,
    method: (_cf: ICustomFunction, active: boolean) => {
      if (active) config.onActivate();
      else config.onDeactivate?.();
    },
  };
}

export interface CreateModuleGroupConfig {
  modules: CreateModuleConfig[];
}

export function createModules(configs: CreateModuleConfig[]): ICustomFunction[] {
  return configs.map(createModule);
}
