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
    decreaseText:        true,
    increaseTextSpacing: true,
    decreaseTextSpacing: true,
    increaseLineHeight:  true,
    decreaseLineHeight:  true,
    invertColors:        true,
    grayHues:            true,
    bigCursor:           true,
    readingGuide:        true,
    underlineLinks:      true,
    textToSpeech:        true,
    speechToText:        true,
    disableAnimations:   true,
    dyslexicFont:        true,
    hideImages:          true,
  },

  // Salva preferências do usuário entre visitas
  session: { persistent: true },

  // Logo exibido no rodapé do menu
  logoImage: 'https://exemplo.com/logo.png',

  // Idioma para texto-para-fala e fala-para-texto
  language: {
    textToSpeechLang: 'pt-BR',
    speechToTextLang: 'pt-BR',
  },
});
```

---

## Módulos disponíveis

| Módulo | Descrição |
|---|---|
| `increaseText` / `decreaseText` | Aumenta ou diminui o tamanho da fonte |
| `increaseTextSpacing` / `decreaseTextSpacing` | Ajusta espaçamento entre palavras e letras |
| `increaseLineHeight` / `decreaseLineHeight` | Ajusta a altura de linha |
| `invertColors` | Alto contraste invertendo as cores |
| `grayHues` | Remove todas as cores (tons de cinza) |
| `bigCursor` | Cursor do mouse maior |
| `readingGuide` | Barra horizontal que segue o mouse |
| `underlineLinks` | Sublinha todos os links da página |
| `textToSpeech` | Lê o conteúdo clicado em voz alta |
| `speechToText` | Dita em campos de formulário via microfone |
| `disableAnimations` | Remove animações e transições CSS |
| `dyslexicFont` | Aplica fonte OpenDyslexic na página |
| `hideImages` | Oculta todas as imagens da página |

> `speechToText` requer HTTPS e navegador com suporte a `webkitSpeechRecognition`.

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

## Licença

MIT — [João Bruno Sousa](https://github.com/JBrunoS)
