# Cashback API — DataSystem — Documentação pública

Guia, fluxo e referência da integração de cashback da Telos com o ERP **DataSystem**
(PIN por SMS no caixa, voucher controlado pelo ERP, cashback processado D+1).

Publicada no GitHub Pages via workflow (`deploy.yml`, build VitePress a cada push na `main`).

## Arquitetura

| Caminho | O quê |
|---|---|
| `index.md`, `guia/`, `fluxos/` | Conteúdo do site (VitePress, markdown) |
| `reference.md` | Página da referência interativa (Scalar) |
| `public/openapi.json` | **A spec da API — sincronizada automaticamente do repo privado `telos-crm` pelo workflow `api-docs.yml` (GitHub App). Não editar manualmente.** |
| `public/CNAME` | Domínio próprio (`docs-datasystem.telosdigital.app.br`) |
| `.vitepress/theme/` | Tema custom (marca Telos) + integração Scalar + mermaid sob demanda |

O fonte da spec são as annotations `@OA\*` nos controllers DataSystem da API
(repo `telos-crm`); o JSON é gerado por CI e publicado aqui pelo sync.

## Desenvolvimento

```bash
npm ci
npm run dev        # http://localhost:3301
npm run build      # .vitepress/dist
```

## Notas de deploy

- `cleanUrls: false`: GitHub Pages não faz rewrite de `/caminho` → `/caminho.html`.
- `base`: o domínio `docs-datasystem.telosdigital.app.br` é a raiz (`/`).
  Se um dia o site voltar ao subcaminho do github.io, ajustar `DOCS_BASE`.
