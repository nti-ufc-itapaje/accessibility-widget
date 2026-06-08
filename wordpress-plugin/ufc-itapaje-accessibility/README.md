# UFC Itapajé Accessibility — WordPress Plugin

Widget de acessibilidade para WordPress com painel de configurações integrado. Carregado via CDN, sem impacto no build do tema.

---

## Requisitos

- WordPress 5.5 ou superior
- PHP 7.4 ou superior
- Conexão com internet (o script é carregado do CDN)

---

## Instalação

### Via painel (recomendado)

1. Baixe o arquivo `ufc-itapaje-accessibility.zip`
2. No painel WordPress acesse **Plugins → Adicionar novo → Fazer upload de plugin**
3. Selecione o `.zip` e clique em **Instalar agora**
4. Clique em **Ativar plugin**

### Via FTP / cPanel

1. Extraia o `.zip`
2. Envie a pasta `ufc-itapaje-accessibility/` para `/wp-content/plugins/`
3. No painel WordPress acesse **Plugins** e ative **UFC Itapajé Accessibility**

---

## Configuração

Após ativar, acesse **Configurações → Accessibility Widget** no painel WordPress.

### Opções disponíveis

| Opção | Descrição |
|---|---|
| **Ativar widget** | Liga ou desliga o widget em todo o site |
| **Título do menu** | Texto exibido no cabeçalho do painel de acessibilidade |
| **Botão redefinir** | Rótulo do botão que restaura todas as configurações |
| **Botão fechar** | Rótulo do botão de fechar o menu |
| **URL do logo** | Imagem opcional exibida no rodapé do menu (ex: logo da instituição) |
| **Módulos visíveis** | Escolha quais funcionalidades aparecem no widget |

### Módulos disponíveis

| Módulo | Descrição |
|---|---|
| Aumentar / Diminuir texto | Ajusta o tamanho da fonte da página |
| Aumentar / Diminuir espaçamento | Espaço entre palavras e letras |
| Aumentar / Diminuir altura de linha | Espaçamento entre linhas |
| Inverter cores | Modo de alto contraste |
| Tons de cinza | Remove as cores da página |
| Cursor grande | Aumenta o cursor do mouse |
| Guia de leitura | Barra horizontal que acompanha o mouse |
| Sublinhar links | Destaca todos os links da página |
| Texto para fala | Lê o conteúdo clicado em voz alta |
| Fala para texto | Permite ditar em campos de formulário |
| Desativar animações | Remove transições e animações CSS |
| Fonte para dislexia | Aplica fonte OpenDyslexic na página |
| Ocultar imagens | Esconde todas as imagens da página |

---

## Como funciona

O plugin injeta o script via CDN do [jsDelivr](https://www.jsdelivr.com/):

```
https://cdn.jsdelivr.net/npm/ufc-itapaje-accessibility@1.0.0/dist/index.global.js
```

O script é carregado no rodapé (`wp_footer`) para não bloquear a renderização da página. As preferências do usuário são salvas automaticamente no `localStorage` do navegador entre as visitas.

---

## Atualização de versão

Para atualizar o widget para uma nova versão do pacote npm:

1. Edite o arquivo `ufc-itapaje-accessibility.php`
2. Altere a constante `UITA_VERSION` para a nova versão:
   ```php
   define( 'UITA_VERSION', '1.1.0' );
   ```
3. Salve o arquivo — o CDN passará a carregar a nova versão automaticamente

---

## Desinstalação

1. Acesse **Plugins** no painel WordPress
2. Desative o plugin
3. Clique em **Excluir**

Todas as configurações salvas no banco de dados serão removidas automaticamente.

---

## Informações do pacote npm

- **Pacote:** [`ufc-itapaje-accessibility`](https://www.npmjs.com/package/ufc-itapaje-accessibility)
- **CDN jsDelivr:** `https://cdn.jsdelivr.net/npm/ufc-itapaje-accessibility/dist/index.global.js`
- **CDN unpkg:** `https://unpkg.com/ufc-itapaje-accessibility/dist/index.global.js`

---

## Licença

GPL-3.0 — [NTI UFC Itapajé](https://github.com/nti-ufc-itapaje)
