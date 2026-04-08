// 🔹 SKILLS
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

// FECHAR MODAL
closeBtn.onclick = () => modal.style.display="none";
window.onclick = (e)=>{if(e.target===modal) modal.style.display="none";};

// ENTER PARA PESQUISAR
input.addEventListener("keypress", (e)=>{if(e.key==="Enter") button.click();});

// PESQUISAR JOGOS
button.addEventListener("click", async ()=>{
  resultados.innerHTML="Carregando...";
  resultados.classList.add("grid");

  try{
    const query = input.value;
    const res = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&search=${query}&page_size=10`);
    const data = await res.json();
    resultados.innerHTML="";

    if(!data.results || data.results.length===0){resultados.innerHTML="Sem resultados"; return;}

    data.results.forEach(game=>{
      const div = document.createElement("div");
      div.classList.add("card");

      const dataFormatada = game.released ? new Date(game.released).toLocaleDateString("pt-PT") : "Data desconhecida";

      div.innerHTML=`
        <img src="${game.background_image || 'https://via.placeholder.com/300x160'}">
        <div class="card-content">
          <h3>${game.name}</h3>
          <p class="rating">⭐ ${game.rating}</p>
          <p class="date">📅 ${dataFormatada}</p>
        </div>
      `;

      // CLICK CARD → ABRIR MODAL COM DETALHES COMPLETOS
div.addEventListener("click", async ()=>{
  modal.style.display="flex";
  modalBody.innerHTML="Carregando detalhes...";

  try{
    const res2 = await fetch(`https://api.rawg.io/api/games/${game.id}?key=${API_KEY}`);
    const details = await res2.json();

    const screenshots = details.short_screenshots?.map(s=>`<img src="${s.image}" style="width:100%; margin-bottom:8px;">`).join("") || "";

    modalBody.innerHTML = `
      <div class="modal-image">
        <img src="${details.background_image || 'https://via.placeholder.com/300x160'}">
        ${screenshots}
      </div>
      <div class="modal-text">
        <h2>${details.name}</h2>
        <p>⭐ Rating: ${details.rating}</p>
        <p>📅 Lançamento: ${details.released || 'Desconhecida'}</p>
        <p><strong>🎮 Plataformas:</strong> ${details.platforms?.map(p=>p.platform.name).join(", ") || 'N/A'}</p>
        <p><strong>🎭 Géneros:</strong> ${details.genres?.map(g=>g.name).join(", ") || 'N/A'}</p>
        <p style="margin-top:10px;">${details.description_raw || 'Sem descrição'}</p>
      </div>
    `;
  } catch(err){
    modalBody.innerHTML="Erro ao carregar detalhes";
  }
});

      resultados.appendChild(div);
    });

  }catch(err){
    resultados.innerHTML="Erro ao buscar jogos";
    console.error(err);
  }
});