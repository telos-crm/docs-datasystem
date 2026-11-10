# Introdução e conceitos

Esta é a API **específica para o ERP DataSystem** na integração de cashback com a
Telos. Ela é diferente do fluxo padrão da Cashback API porque o **DataSystem tem
controle interno de vouchers** — o equivalente, no ERP, aos bônus de cashback.

## Como as peças se relacionam

| Conceito | O que é |
| --- | --- |
| **Loja (credencial)** | A unidade de integração. Cada loja tem a própria `client_id` + `client_secret`; o token JWT emitido já carrega a loja/empresa. |
| **Voucher** | O crédito de cashback **no DataSystem**. Disponibilidade, valor mínimo e uso são controlados 100% pelo ERP. |
| **PIN** | Código de 4 dígitos enviado por SMS ao cliente para autorizar a venda. |
| **PIN master** | PIN operacional usado quando o cliente não tem celular/SMS. |
| **`user_id`** | Identificador **criptografado e opaco** do cliente. O ERP nunca interpreta: recebeu, guardou, ecoou. |
| **D+1** | Rotina noturna da Telos que processa as vendas do dia anterior: acúmulo, débito de voucher utilizado e cancelamentos. |

## O modelo da integração

A divisão de responsabilidades é o mais importante desta integração:

::: important O que cada lado faz
- **DataSystem (você)**: decide se a venda requer PIN; controla vouchers
  internamente (disponibilidade, valor mínimo, uso); registra as vendas.
- **Telos**: envia e valida o PIN por SMS quando solicitado; na **rotina noturna
  D+1** busca as vendas do dia anterior e processa o cashback — acúmulo,
  débito do voucher utilizado e cancelamentos.
:::

Consequências práticas para o ERP:

- **Não existe** consulta de saldo, campanhas ou submissão de bônus nesta API —
  o voucher é do DataSystem. Essas rotas pertencem ao fluxo padrão da
  [Cashback API](https://docs-cashback.telosdigital.app.br), não usadas aqui.
- **A venda não precisa de nenhuma chamada** quando o ERP decide que ela não
  requer PIN: o acúmulo sai da venda registrada no ERP e é processado no D+1.
- **Quando a venda requer PIN**, o fluxo é: `/pin/send` → `/pin/validate`
  (→ `/pin/resend` se o cliente pedir). Ver [Validação de PIN](../fluxos/pin).

## Ambientes

| | Homologação | Produção |
| --- | --- | --- |
| Uso | Desenvolver e testar a integração | Operação real no caixa |
| Base URL | `https://giftback.hom.teloscrm.com.br/api/v1/datasystem` | `https://giftback.teloscrm.com.br/api/v1/datasystem` |

## Limites

| O quê | Limite |
| --- | --- |
| Validade do PIN | **5 minutos** |
| Tentativas de validação por PIN | **3** |
| `/pin/send` e `/pin/resend` (novo disparo de SMS) | 1 a cada 60s |
| Requisições por credencial | 600/min |
| Access token | 1 hora |
| Refresh token | 7 dias |

## Suporte

- **E-mail:** [diego.dias@teloscrm.com.br](mailto:diego.dias@teloscrm.com.br)
- **Referência técnica completa:** [Swagger/OpenAPI](/reference)
