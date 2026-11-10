# Erros e novas tentativas

## Envelope de erro padrão

Toda resposta de erro segue o mesmo formato (o `/auth` no sucesso é a única
exceção — corpo sem envelope):

```json
{
    "status": false,
    "message": "Dados inválidos: O campo pin deve ser 4 caracteres.",
    "data": null
}
```

::: tip Código é contrato, mensagem é texto — mas aqui o texto também é contrato
O DataSystem **compara status e texto** das respostas. As mensagens desta
documentação são as mensagens exatas da API: qualquer mudança nelas passa por
revisão com a DataSystem antes de entrar em produção.
:::

## Tabela global

| HTTP | Quando acontece | O que o ERP deve fazer |
| --- | --- | --- |
| **400** | Payload inválido (`Dados inválidos: …`) | **Não repetir**: é bug do integrador. Corrigir o payload |
| **401** | Token ausente, expirado ou inválido (`Invalid Token`) | Rodar `/refresh`; se falhar, refazer `/auth` e repetir a chamada **uma vez** |
| **404** | Recurso não existe (`Usuário não encontrado`) | `user_id` inválido/outra sessão — refazer o `/pin/send`. **Não dar retry cego** |
| **429** | Rate limit (600/min por credencial) ou janela de 60s do PIN/resend | Aguardar a janela (PIN) ou backoff exponencial (rate limit). Nunca loop apertado |
| **500** | Erro interno | Retry com backoff (2 tentativas). Persistindo, resolver com o suporte |

## O HTTP 400 do `/pin/validate` em detalhe

O body é validado **antes** de qualquer consulta ao cliente. Falhou? A resposta
é **400** com o envelope de erro e a mensagem
`Dados inválidos: <primeiro erro de validação>` — **apenas o primeiro erro**, na
ordem `user_id` e depois `pin`.

| Body enviado | Resposta HTTP 400 |
| --- | --- |
| `{ "pin": "3885" }` (sem `user_id`) | `Dados inválidos: O campo user id é obrigatório.` |
| `{ "user_id": "0zXt…" }` (sem `pin`) | `Dados inválidos: O campo pin é obrigatório.` |
| `{ "user_id": "…", "pin": "388" }` (3 caracteres) | `Dados inválidos: O campo pin deve ser 4 caracteres.` |
| `{ "user_id": "…", "pin": 3885 }` (número, sem aspas) | `Dados inválidos: O campo pin deve ser uma string.` |
| `{ "user_id": "", "pin": "3885" }` (vazio) | `Dados inválidos: O campo user id é obrigatório.` |

::: warning O PIN vai sempre como string JSON
Enviado como número, `"0427"` vira `0427` — JSON inválido — e `427` falha na
regra dos 4 caracteres. **Sempre com aspas:** `"pin": "0427"`.
:::

::: note Como distinguir 400 de "PIN não aceito"
- **400** = o **body** estava malformado (falta campo, tamanho errado, tipo errado). Corrigir o payload.
- **200 com `valid_pin: false`** = o body estava correto, mas o PIN **não é válido** (errado, expirado ou esgotou as tentativas). Pedir novo PIN ao cliente ou reenviar.
- Um **não** substitui o outro: 400 nunca significa "PIN errado".
:::

## Política de retry

| Situação | Retry? | Como |
| --- | --- | --- |
| 429 rate limit | Sim | Backoff exponencial (1s, 2s, 4s…), máx. 3 |
| 429 PIN/resend (janela de 60s) | Sim, após a janela | Desabilitar o botão 60s na UI |
| 500 | Sim (máx. 2) | Backoff |
| 401 | Sim (1x) | `/refresh` → repetir chamada; falhou → `/auth` |
| 400/404 | **Não** | Erro de integração/payload — corrigir antes |

## Erros por rota

### `/auth`

| HTTP | Mensagem | Causa |
| --- | --- | --- |
| 400 | `Dados inválidos` | Faltou `username` ou `password` |
| 401 | `Invalid credentials` | CNPJ/API Key errados ou credencial desativada |

### `/pin/send`

| HTTP | Mensagem | Causa |
| --- | --- | --- |
| 400 | `Dados inválidos: <primeiro erro>` | `customer` ausente/incompleto (CPF 11 dígitos, nome, telefone 10–11) |
| 401 | `Invalid Token` | Access token expirado |
| 429 | `Aguarde 60 segundos antes de solicitar um novo PIN.` | Janela de 60s com telefone diferente ou PIN já validado |

::: note O clique repetido no /pin/send não é erro
Repetição em menos de 60s (mesmo telefone, PIN ainda ativo) responde **200** com
o **mesmo PIN** — nenhum SMS novo é disparado. Se o SMS anterior **falhou**, a
janela já foi liberada e o novo envio dispara de verdade.
:::

### `/pin/validate`

| HTTP | Mensagem | Causa |
| --- | --- | --- |
| 400 | `Dados inválidos: <primeiro erro>` | Body malformado (ver tabela detalhada acima) |
| 404 | `Usuário não encontrado` | `user_id` inválido/outra sessão |

### `/pin/resend`

| HTTP | Mensagem | Causa |
| --- | --- | --- |
| 400 | `Dados inválidos` | `user_id` ausente |
| 404 | `Usuário não encontrado` | `user_id` inválido |
| 429 | `Aguarde 60 segundos antes de reenviar o PIN.` | Janela de 60s do último disparo |
