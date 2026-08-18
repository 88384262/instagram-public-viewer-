const form = document.querySelector("#searchForm");
const input = document.querySelector("#username");
const result = document.querySelector("#result");
const loading = document.querySelector("#loading");
const errorBox = document.querySelector("#error");
const card = document.querySelector("#profileCard");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  searchProfile(input.value);
});

document.querySelectorAll(".example").forEach(btn => {
  btn.addEventListener("click", () => {
    input.value = btn.dataset.user;
    searchProfile(btn.dataset.user);
  });
});

async function searchProfile(value) {
  const username = value.trim().replace(/^@/, "");
  if (!username) {
    showError("Digite um nome de usuário.");
    return;
  }

  result.classList.remove("hidden");
  loading.classList.remove("hidden");
  errorBox.classList.add("hidden");
  card.classList.add("hidden");

  try {
    const response = await fetch(`/api/profile?username=${encodeURIComponent(username)}`);
    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Não foi possível consultar o perfil.");
    render(data);
  } catch (err) {
    showError(err.message);
  } finally {
    loading.classList.add("hidden");
  }
}

function render(data) {
  const p = data.profile || {};
  document.querySelector("#avatar").src = p.profilePicture || "";
  document.querySelector("#profileUsername").textContent = `@${p.username || ""}`;
  document.querySelector("#profileName").textContent = p.name || "";
  document.querySelector("#bio").textContent = p.biography || "";
  document.querySelector("#posts").textContent = formatNumber(p.posts);
  document.querySelector("#followers").textContent = formatNumber(p.followers);
  document.querySelector("#following").textContent = formatNumber(p.following);

  document.querySelector("#privateBadge").classList.toggle("hidden", !p.isPrivate);
  document.querySelector("#demoNotice").classList.toggle("hidden", !data.demo);

  renderStories(data.stories || []);
  renderPosts(data.posts || []);

  card.classList.remove("hidden");
}

function renderStories(stories) {
  const box = document.querySelector("#stories");
  document.querySelector("#storyCount").textContent = stories.length ? `${stories.length} disponíveis` : "";
  box.innerHTML = "";

  if (!stories.length) {
    box.innerHTML = `<div class="empty">Nenhum story público disponível.</div>`;
    return;
  }

  stories.forEach((story, i) => {
    const item = document.createElement("div");
    item.className = "story";
    item.innerHTML = `
      <img src="${escapeAttr(story.thumbnail || story.url)}" alt="Story ${i + 1}">
      <span>Story ${i + 1}</span>`;
    box.appendChild(item);
  });
}

function renderPosts(posts) {
  const grid = document.querySelector("#postsGrid");
  document.querySelector("#postCount").textContent = posts.length ? `${posts.length} carregadas` : "";
  grid.innerHTML = "";

  if (!posts.length) {
    grid.innerHTML = `<div class="empty" style="grid-column:1/-1">Nenhuma publicação disponível para exibir.</div>`;
    return;
  }

  posts.forEach(post => {
    const item = document.createElement("div");
    item.className = "post";
    item.innerHTML = `<img src="${escapeAttr(post.thumbnail || post.url)}" alt="Publicação pública">`;
    grid.appendChild(item);
  });
}

function formatNumber(value) {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function escapeAttr(value) {
  return String(value || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function showError(message) {
  result.classList.remove("hidden");
  loading.classList.add("hidden");
  card.classList.add("hidden");
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
}