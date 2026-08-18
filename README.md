# InstaView — Visualizador de perfis públicos

Projeto inicial para consulta e apresentação de informações de perfis públicos do Instagram.

## Rodar localmente

```bash
npm install
npm start
```

Abra `http://localhost:3000`.

## Deploy na Vercel

1. Suba o projeto para um repositório GitHub.
2. Importe o repositório na Vercel.
3. Configure as variáveis de ambiente:
   - `API_BASE_URL`
   - `API_KEY`
4. Faça o deploy.

## Importante sobre a API

O projeto **não tenta burlar login, privacidade ou controles do Instagram**. A rota `/api/profile` foi deixada preparada para um provedor de dados/API autorizado.

A API oficial do Instagram/Meta possui limitações e não funciona como uma busca pública irrestrita por qualquer username. Portanto, para dados reais de perfis públicos, é necessário escolher um provedor compatível e adaptar o pequeno trecho indicado em `server.js` ao formato da resposta desse provedor.

Perfis privados devem permanecer privados.

## Estrutura

- `public/index.html` — interface
- `public/style.css` — visual
- `public/script.js` — pesquisa e renderização
- `server.js` — backend/API
- `vercel.json` — configuração de deploy
