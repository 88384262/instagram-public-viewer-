import express from "express";

const app = express();

app.use(express.json());

// Rota principal da API
app.get("/api/profile", async (req, res) => {
  try {
    const username = String(req.query.username || "")
      .trim()
      .replace(/^@/, "")
      .toLowerCase();

    if (!/^[a-z0-9._]{1,30}$/i.test(username)) {
      return res.status(400).json({ error: "Digite um @usuário válido." });
    }

    // Modo de demonstração (quando sem API externa configurada)
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
    console.error("Erro interno no servidor:", error);
    return res.status(500).json({ error: "Erro interno no processamento da requisição." });
  }
});

// Suporte para rodar localmente com npm start
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando localmente em http://localhost:${PORT}`);
  });
}

export default app;
