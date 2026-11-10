import { defineConfig } from 'vitepress';

// Documentação pública da integração DataSystem (modelo do site da Cashback API).
// Mermaid sob demanda (ver .vitepress/theme/index.ts) — sem withMermaid.
//
// BASE configurável: no GitHub Pages o site vive em /docs-datasystem/ (default).
// No corte para o domínio raiz (docs-datasystem.telosdigital.app.br), setar
// DOCS_BASE=/ no workflow — hoje o domínio já é o oficial e o base é o raiz.
const BASE = process.env.DOCS_BASE ?? '/';

export default defineConfig({
  base: BASE,
  lang: 'pt-BR',
  title: 'Cashback API — DataSystem',
  description: 'Guia, fluxos e referência da integração de cashback da Telos com o ERP DataSystem.',
  // GitHub Pages não faz rewrite de /caminho → /caminho.html. Ao servir por
  // Worker/nginx (como o telos-link), vale religar o cleanUrls.
  cleanUrls: false,
  lastUpdated: false,
  head: [
    ['meta', { name: 'theme-color', content: '#1a1a2e' }],
    ['link', { rel: 'icon', href: 'https://teloscrm.com.br/favicon.ico' }],
  ],

  themeConfig: {
    nav: [
      { text: 'Guia', link: '/guia/introducao', activeMatch: '/guia/' },
      { text: 'Fluxo', link: '/fluxos/', activeMatch: '/fluxos/' },
      { text: 'Referência da API', link: '/reference', activeMatch: '/reference' },
    ],

    sidebar: [
      {
        text: 'Guia',
        items: [
          { text: 'Introdução e conceitos', link: '/guia/introducao' },
          { text: 'Primeiros passos', link: '/guia/primeiros-passos' },
          { text: 'Erros e novas tentativas', link: '/guia/erros' },
        ],
      },
      {
        text: 'Fluxo',
        items: [
          { text: 'Como funciona a integração', link: '/fluxos/' },
          { text: 'Validação de PIN', link: '/fluxos/pin' },
        ],
      },
      {
        text: 'Referência',
        items: [{ text: 'Todos os endpoints', link: '/reference' }],
      },
    ],

    outline: { level: [2, 3], label: 'Nesta página' },
    docFooter: { prev: 'Anterior', next: 'Próxima' },
    darkModeSwitchLabel: 'Tema',
    lightModeSwitchTitle: 'Tema claro',
    darkModeSwitchTitle: 'Tema escuro',
    sidebarMenuLabel: 'Menu',
    returnToTopLabel: 'Voltar ao topo',
    notFound: {
      title: 'Página não encontrada',
      quote: 'Confira o endereço ou volte para o início da documentação.',
      linkText: 'Ir para o início',
    },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: 'Buscar', buttonAriaLabel: 'Buscar' },
          modal: {
            noResultsText: 'Nenhum resultado para',
            resetButtonTitle: 'Limpar busca',
            footer: { selectText: 'abrir', navigateText: 'navegar', closeText: 'fechar' },
          },
        },
      },
    },
  },
});
