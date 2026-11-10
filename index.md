---
layout: home

hero:
  name: Cashback API
  text: Integração DataSystem — validação de PIN por SMS
  tagline: "O voucher é seu, o cashback é nosso: valide o cliente no caixa por PIN e deixe o acúmulo por nossa conta, processado D+1."
  actions:
    - theme: brand
      text: Primeiros passos
      link: /guia/primeiros-passos
    - theme: alt
      text: Como funciona
      link: /fluxos/
    - theme: alt
      text: Referência da API
      link: /reference

features:
  - title: Fluxo de PIN passo a passo
    details: "Envio do SMS, validação dos 4 dígitos e reenvio — com as regras de validade, tentativas e os retornos exatos de cada rota."
    link: /fluxos/pin
  - title: Modelo D+1 sem chamadas de saldo
    details: "O voucher é controlado dentro do DataSystem: sem /bonus na integração — a Telos processa o acúmulo e o débito em rotina noturna."
    link: /guia/introducao
  - title: Contrato do HTTP 400
    details: "O DataSystem compara status e texto das respostas: o 400 do /pin/validate está documentado com as mensagens exatas, campo a campo."
    link: /guia/erros
---
