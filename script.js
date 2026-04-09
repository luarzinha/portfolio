// SKILLS
function showSkill(skill, element){
  let images = document.querySelectorAll(".skill-display img");
  let buttons = document.querySelectorAll(".skills button");

  images.forEach(img => img.classList.remove("active"));
  buttons.forEach(btn => btn.classList.remove("active"));

  document.getElementById(skill).classList.add("active");
  element.classList.add("active");
}

// API JOGOS
const API_KEY = "4773797357194adeb2b447f6587733ba";
const input = document.getElementById("searchInput");
const button = document.getElementById("btn");
const resultados = document.getElementById("resultados");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeBtn = document.getElementById("close");

//criar a rodinha
const spinner = document.createElement("div");
spinner.id = "spinner";
spinner.className = "spinner";
spinner.style.display = "none";
document.body.appendChild(spinner);

function showSpinner() { spinner.style.display = "block"; }
function hideSpinner() { spinner.style.display = "none"; }

// fechar a janela
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

// enter
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") button.click();
});

// Pesquisar os joguitos
button.addEventListener("click", async () => {
  resultados.innerHTML = "";
  resultados.classList.add("grid");
  showSpinner();

  try {
    const query = input.value;
    const res = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&search=${query}&page_size=10`);
    const data = await res.json();
    hideSpinner();

    if (!data.results || data.results.length === 0) {
      resultados.innerHTML = "<p style='text-align:center;color:red;'>No results found.</p>";
      return;
    }

    data.results.forEach(game => {
      const div = document.createElement("div");
      div.classList.add("card");

      const formattedDate = game.released
        ? new Date(game.released).toLocaleDateString("en-US")
        : "Unknown date";

      div.innerHTML = `
        <img src="${game.background_image || 'https://via.placeholder.com/300x160'}">
        <div class="card-content">
          <h3>${game.name}</h3>
          <p class="rating">⭐ ${game.rating}</p>
          <p class="date">📅 ${formattedDate}</p>
        </div>
      `;

 div.addEventListener("click", async () => {
   modal.style.display = "flex";
   modalBody.innerHTML = "";
   showSpinner();

   try {
   const res2 = await fetch(`https://api.rawg.io/api/games/${game.id}?key=${API_KEY}`);
    const details = await res2.json();
     hideSpinner();

     modalBody.innerHTML = `
      <div class="modal-image">
      <img src="${details.background_image || 'https://via.placeholder.com/300x160'}">
       <div class="gradient-overlay"></div>
</div>
    <div class="modal-text">
    <h2>${details.name}</h2>
     <div class="game-meta">
      <span>⭐ ${details.rating}</span>
      <span>📅 ${details.released || 'Unknown'}</span>
      <span>🎭 ${details.genres?.map(g => g.name).join(", ") || 'N/A'}</span>
 </div>
     <p class="short-desc collapsed" id="desc">
      ${details.description_raw || 'No description available.'}</p>
     <button class="toggle-desc" id="toggleDesc">Read more</button>
  </div>
`;

// Ler mais e ler menos
  const btn = document.getElementById("toggleDesc");
  const desc = document.getElementById("desc");
  const gradient = document.querySelector(".modal-image .gradient-overlay");

   if (btn && desc) {
   btn.addEventListener("click", () => {
    desc.classList.toggle("open");
    desc.classList.toggle("collapsed");
   btn.textContent = desc.classList.contains("open") ? "Read less" : "Read more";
     if(desc.classList.contains("open")) {
    gradient.classList.add("active");
  } else {
    gradient.classList.remove("active");
  }
});
}
 } catch(err) {
 hideSpinner();
 modalBody.innerHTML = "<p style='color:red;text-align:center;'>Failed to load game details.</p>";
   console.error(err);
}
});

 resultados.appendChild(div);
});

  } catch (err) {
    hideSpinner();
    resultados.innerHTML = "<p style='color:red;text-align:center;'>Failed to load games. Please try again.</p>";
    console.error(err);
  }
});