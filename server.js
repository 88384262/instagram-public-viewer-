import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/profile", async (req, res) => {
  const username = String(req.query.username || "")
    .trim()
    .replace(/^@/, "")
    .toLowerCase();

  if (!/^[a-z0-9._]{1,30}$/i.test(username)) {
    return res.status(400).json({ error: "Digite um @usuário válido." });
  }

  /*
    IMPORTANTE:
    O Instagram não oferece uma API oficial para consultar arbitrariamente
    qualquer perfil público e seus stories por username.

    Por isso esta rota fica preparada para receber um provedor/API autorizado.
    Configure API_BASE_URL e API_KEY no ambiente da Vercel e adapte a função
    abaixo ao provedor escolhido.

    Sem uma API configurada, o site retorna modo de demonstração.
  */

  if (!process.env.API_BASE_URL) {
    return res.json({
      demo: true,
      profile: {
        username,
        name: "Perfil público",
        biography: "Configure uma API de dados do Instagram para carregar os dados reais.",
        profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=111827&color=fff&size=256`,
        followers: null,
        following: null,
        posts: null,
        isPrivate: false
      },
      posts: [],
      stories: []
    });
  }

  try {
    const url = new URL(process.env.API_BASE_URL);
    url.searchParams.set("username", username);

    const response = await fetch(url, {
      headers: process.env.API_KEY
        ? { Authorization: `Bearer ${process.env.API_KEY}` }
        : {}
    });

    if (!response.ok) {
      return res.status(502).json({ error: "O provedor de dados não respondeu corretamente." });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(502).json({ error: "Não foi possível consultar o provedor de dados." });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado em http://localhost:${PORT}`);
});