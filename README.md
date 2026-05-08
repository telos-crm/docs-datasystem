# Telos Giftback API - Documentação DataSystem

Documentação da API Giftback para integração com ERP DataSystem.

## 🔗 Acesso

- **Documentação**: https://docs-datasystem.telosdigital.app.br
- **API Base URL**: https://giftback.teloscrm.com.br/api/v1/datasystem

## 📋 Endpoints Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth` | Autenticação - obtém access_token e refresh_token |
| POST | `/refresh` | Renovação de token |
| POST | `/pin/send` | Envio de PIN por SMS |
| POST | `/pin/validate` | Validação do PIN |
| POST | `/pin/resend` | Reenvio do PIN |

## 🔐 Autenticação

A API usa JWT Bearer Token. Obtenha o token via `/auth`:

```bash
curl -X POST https://giftback.teloscrm.com.br/api/v1/datasystem/auth \
  -H "Content-Type: application/json" \
  -d '{"username": "SEU_CLIENT_ID", "password": "SEU_CLIENT_SECRET"}'
```

Use o `access_token` retornado no header `Authorization: Bearer {token}`.

## 📞 Suporte

- Email: diego.dias@telosdigital.app.br
- Site: https://telosdigital.app.br

## 🔄 Atualização

Para atualizar a documentação, copie o novo `openapi.json` do servidor e faça commit.
