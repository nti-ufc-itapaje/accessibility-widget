# ufc-itapaje-accessibility

Widget de acessibilidade customizável para web. Suporta ajuste de texto, fonte para dislexia, inverter cores, guia de leitura, texto para fala e muito mais.

[![npm](https://img.shields.io/npm/v/ufc-itapaje-accessibility)](https://www.npmjs.com/package/ufc-itapaje-accessibility)
[![license](https://img.shields.io/npm/l/ufc-itapaje-accessibility)](./LICENSE)

---

## Instalação

### npm / yarn

```bash
npm install ufc-itapaje-accessibility
```

```bash
yarn add ufc-itapaje-accessibility
```

### CDN (sem bundler)

```html
<script src="https://cdn.jsdelivr.net/npm/ufc-itapaje-accessibility/dist/index.global.js"></script>
```

---

## Uso básico

### Via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/ufc-itapaje-accessibility/dist/index.global.js"></script>
<script>
  new Accessibility.Accessibility();
</script>
```

### Via npm (ES Modules)

```js
import { Accessibility } from 'ufc-itapaje-accessibility';

new Accessibility();
```

### Via npm (CommonJS)

```js
const { Accessibility } = require('ufc-itapaje-accessibility');

new Accessibility();
```

---

## Configuração

Todas as opções são opcionais. O widget funciona com valores padrão sem nenhuma configuração.

```js
new Accessibility.Accessibility({
  // Rótulos exibidos no menu
  labels: {
    menuTitle:   'Acessibilidade',
    resetTitle:  'Redefinir',
    closeTitle:  'Fechar',
    dyslexicFont: 'Fonte para dislexia',
    hideImages:   'Ocultar imagens',
    // ... demais rótulos
  },

  // Módulos visíveis (true = visível, false = oculto)
  modules: {
    increaseText:        true,
    increaseTextSpacing: true,
    increaseLineHeight:  true,
    invertColors:        true,
    grayHues:            true,
    bigCursor:           true,
    readingGuide:        true,
    underlineLinks:      true,
    textToSpeech:        true,
    disableAnimations:   true,
    dyslexicFont:        true,
    hideImages:          true,
  },

  // Salva preferências do usuário entre visitas
  session: { persistent: true },

  // Logo exibido no rodapé do menu
  logoImage: 'https://exemplo.com/logo.png',

  // Idioma para texto-para-fala
  language: {
    textToSpeechLang: 'pt-BR',
  },
});
```

---

## Módulos disponíveis

| Módulo | Descrição |
|---|---|
| `increaseText` | Aumenta o tamanho da fonte em 3 níveis, voltando ao tamanho original ao final do ciclo |
| `increaseTextSpacing` | Aumenta o espaçamento entre palavras e letras em 3 níveis, com o mesmo ciclo |
| `increaseLineHeight` | Aumenta a altura de linha em 3 níveis, com o mesmo ciclo |
| `invertColors` | Alto contraste invertendo as cores |
| `grayHues` | Remove todas as cores (tons de cinza) |
| `bigCursor` | Cursor do mouse maior |
| `readingGuide` | Barra horizontal que segue o mouse |
| `underlineLinks` | Sublinha todos os links da página |
| `textToSpeech` | Lê o conteúdo clicado em voz alta. Cada clique alterna o estado: liga (normal) → rápido → lento → desliga |
| `disableAnimations` | Remove animações e transições CSS |
| `dyslexicFont` | Aplica fonte Lexend na página |
| `hideImages` | Oculta todas as imagens da página |

---

## Atalhos de teclado

Os atalhos vêm desativados por padrão. Para habilitar:

```js
new Accessibility.Accessibility({
  hotkeys: { enabled: true },
});
```

| Ação | Atalho padrão |
|---|---|
| Abrir/fechar menu | `Ctrl+Alt+A` |
| `increaseText` | `Ctrl+Alt+F` |
| `increaseTextSpacing` | `Ctrl+Alt+S` |
| `increaseLineHeight` | `Ctrl+Alt+L` |
| `invertColors` | `Ctrl+Alt+I` |
| `grayHues` | `Ctrl+Alt+G` |
| `underlineLinks` | `Ctrl+Alt+U` |
| `bigCursor` | `Ctrl+Alt+C` |
| `readingGuide` | `Ctrl+Alt+R` |
| `textToSpeech` | `Ctrl+Alt+T` |
| `disableAnimations` | `Ctrl+Alt+Q` |
| `dyslexicFont` | `Ctrl+Alt+D` |
| `hideImages` | `Ctrl+Alt+H` |

Os botões de ciclo (`increaseText`, `increaseTextSpacing`, `increaseLineHeight` — 3 níveis — e `textToSpeech` — normal/rápido/lento/desliga) funcionam do mesmo jeito pelo atalho: cada pressionada avança um passo no ciclo, exatamente como um clique no botão.

Quando `hotkeys.enabled` está ligado, um botão de ajuda aparece no rodapé do menu (aberto), logo abaixo do botão "Redefinir". Clicar nele (ou dar Enter com foco nele) abre uma lista com a ação e o atalho de cada módulo ativo.

Para trocar as teclas, sobrescreva `hotkeys.keys`:

```js
new Accessibility.Accessibility({
  hotkeys: {
    enabled: true,
    keys: {
      textToSpeech: ['ctrlKey', 'altKey', 84], // 84 = tecla "T"
    },
  },
});
```

---

## Evento de mudança do texto-para-fala

A cada clique no botão `textToSpeech`, o widget dispara um `CustomEvent` chamado `access:textToSpeech` no `document`, com o estado atual em `event.detail.state`. Valores possíveis: `'normal'`, `'fast'`, `'slow'`, `'off'`.

```js
document.addEventListener('access:textToSpeech', (event) => {
  console.log('Texto para fala:', event.detail.state);
});
```

---

## Temas (CSS Custom Properties)

O widget pode ser estilizado via variáveis CSS:

```css
:root {
  --_access-icon-bg:               #4054b2;
  --_access-icon-color:            #fff;
  --_access-menu-background-color: #F3F4F6;
  --_access-menu-width:            20vw;
  --_access-menu-min-width:        300px;
}
```

---

## Preset em português

```js
import { Accessibility, ptBRLabels } from 'ufc-itapaje-accessibility';

new Accessibility({ labels: ptBRLabels });
```

---

## WordPress

Um plugin WordPress oficial está disponível na pasta [`wordpress-plugin/`](./wordpress-plugin/).  
Consulte o [README do plugin](./wordpress-plugin/ufc-itapaje-accessibility/README.md) para instruções de instalação.

---

## Créditos

Este projeto é baseado no pacote open source [`accessibility`](https://github.com/ranbuch/accessibility) ([npm](https://www.npmjs.com/package/accessibility)), criado por Ran Buchnik e licenciado sob MIT. A partir dele, o NTI UFC Itapajé reescreveu e estendeu boa parte do widget: módulos, atalhos de teclado, temas via CSS custom properties, presets de idioma e a integração com WordPress.

---

## Licença

Este projeto é livre e de código aberto, distribuído sob a licença **[GPL-3.0](./LICENSE)** — [NTI UFC Itapajé](https://github.com/nti-ufc-itapaje/accessibility-widget).

O pacote original do qual este projeto deriva, [`accessibility`](https://github.com/ranbuch/accessibility) (Ran Buchnik), é licenciado sob **MIT** — o aviso de copyright original está reproduzido no fim do arquivo [`LICENSE`](./LICENSE).
