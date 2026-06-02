export interface AccessibilityTheme {
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

const VAR_MAP: Record<keyof AccessibilityTheme, string | string[]> = {
  primaryColor: ['--_access-icon-bg', '--_access-menu-item-button-active-background-color'],
  menuBackground: '--_access-menu-background-color',
  menuColor: '--_access-menu-color',
  iconBackground: '--_access-icon-bg',
  iconColor: '--_access-icon-color',
  menuWidth: '--_access-menu-width',
  borderRadius: ['--_access-menu-border-radius', '--_access-icon-border-radius', '--_access-menu-item-button-border-radius'],
  fontFamily: '--_access-menu-font-family',
  itemColor: '--_access-menu-item-color',
  itemButtonBackground: '--_access-menu-item-button-background',
  itemButtonHoverBackground: '--_access-menu-item-button-hover-background-color',
  itemIconColor: '--_access-menu-item-icon-color',
  iconBoxShadow: '--_access-icon-box-shadow',
  menuHeight: '--_access-menu-height',
  menuMaxHeight: '--_access-menu-max-height',
  menuTop: '--_access-menu-top',
};

export function createThemeCss(theme: AccessibilityTheme): string {
  const declarations: string[] = [];
  for (const [key, value] of Object.entries(theme) as [keyof AccessibilityTheme, string][]) {
    if (!value) continue;
    const vars = VAR_MAP[key];
    if (!vars) continue;
    const varList = Array.isArray(vars) ? vars : [vars];
    varList.forEach(v => declarations.push(`  ${v}: ${value};`));
  }
  return `:root {\n${declarations.join('\n')}\n}`;
}

export function applyTheme(theme: AccessibilityTheme): void {
  const css = createThemeCss(theme);
  const id = 'accessibility-widget-theme';
  const existing = document.getElementById(id);
  if (existing) { existing.textContent = css; return; }
  const style = document.createElement('style');
  style.id = id;
  style.textContent = css;
  document.head.appendChild(style);
}

export function removeTheme(): void {
  document.getElementById('accessibility-widget-theme')?.remove();
}
