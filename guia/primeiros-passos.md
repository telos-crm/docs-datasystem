# Primeiros passos

## Credenciais

A Telos fornece, para cada loja que vai operar:

| Campo | Onde usar | Exemplo |
| --- | --- | --- |
| `client_id` | Campo `username` do `/auth` | CNPJ da loja **sem máscara** → `12345678000190` |
| `client_secret` | Campo `password` do `/auth` | API Key da loja → `as214d1237155b6b31f1690c1b59132132` |

::: important Guarde o segredo em cofre
O `client_secret` identifica e autoriza a loja. Quem tiver ele opera a loja:
guarde em cofre de segredos ou variáveis de ambiente, nunca no código.
:::

## Autenticação

```bash
curl -X POST https://giftback.teloscrm.com.br/api/v1/datasystem/auth \
  -H "Content-Type: application/json" \
  -d '{"username": "12345678000190", "password": "SUA_API_KEY"}'
```

```json
{
    "access_token": "eyJ0eXAiOiJKV1Qi...",
    "access_token_expires_in": 3600,
    "refresh_token": "eyJ0eXAiOiJKV1Qi...",
    "refresh_token_expires_in": 604800
}
```

::: note O /auth não usa o envelope
O `/auth` é o único endpoint que responde **sem** o envelope
`{"status": ..., "message": ..., "data": ...}` — o corpo é o próprio payload
de tokens. Erros seguem o envelope padrão (ver [Erros](./erros)).
:::

Todas as demais rotas exigem o header `Authorization: Bearer {access_token}`.

## Ciclo de vida do token

- **Access token**: válido por **1 hora**.
- **Refresh token**: válido por **7 dias** e é **single-use** — cada `/refresh`
  emite um novo par e invalida o refresh anterior.

Estratégia recomendada:

1. Autentique no início da sessão/jornada do operador.
2. Renove preventivamente quando faltarem ~60s para o access token expirar.
3. Recebeu **401** em qualquer rota? Tente `/refresh` **uma vez** e repita a
   chamada. Falhou o refresh? Refaça o `/auth`.

```bash
curl -X POST https://giftback.teloscrm.com.br/api/v1/datasystem/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "eyJ0eXAiOiJKV1Qi..."}'
```

::: warning Não agende reautenticação compartilhada
Refresh token é single-use: dois processos disputando o mesmo refresh podem
invalidar o token um do outro. Renove sob demanda, na hora do 401 ou da
expiração próxima.
:::

## Convenções da API

- **Tudo é `POST`**, corpo e resposta em JSON, `Content-Type: application/json`.
- **Envelope padrão:** `{"status": true, "message": "Success", "data": { ... }}`;
  em erro, `"status": false` com `"message"` (ver [Erros](./erros)).
- **IDs são opacos e criptografados** (`user_id`): recebeu, guardou, ecoou —
  nunca monte ou valide formato.
- **CPF e telefone:** apenas números, sem máscara (`"12345678901"`,
  `"11999998888"`).
- **O PIN vai sempre como string**, com aspas — inclusive quando começa com
  zero (`"0427"`). Ver o detalhe completo em [Erros](./erros).
- **Valores monetários:** números com ponto decimal, sem separador de milhar.

## Checklist

- [ ] Credenciais da loja em mãos (homologação e produção separadas)
- [ ] `/auth` testado na homologação
- [ ] Onde o ERP guarda `access_token`, `refresh_token` e o `user_id` da venda definido
- [ ] Regra interna de "quando a venda requer PIN" acordada com o time Telos
