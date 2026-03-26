function showSkill(skill){

let images = document.querySelectorAll(".skill-display img");
let buttons = document.querySelectorAll(".skills button");

images.forEach(img=>{
img.classList.remove("active");
});

buttons.forEach(btn=>{
btn.classList.remove("active");
});

document.getElementById(skill).classList.add("active");

target.classList.add("active");
}

/*API PARA PESQUISAR OS JOGUITOS*/ 

const API_KEY = "4773797357194adeb2b447f6587733ba";

document.getElementById("btn").addEventListener("click", async () => {
  console.log("clicou");

 document.getElementById("searchInput")
  .addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      document.getElementById("btn").click();
    }
  });

  const resultados = document.getElementById("resultados");
  resultados.innerHTML = "Carregando...";

  try {
   const query = document.getElementById("searchInput").value;

const response = await fetch(
  `https://api.rawg.io/api/games?key=${API_KEY}&search=${query}&page_size=10`
);
    
    console.log("status:", response.status);

    const data = await response.json();

    console.log("dados:", data);

    resultados.innerHTML = "";

    if (!data.results) {
      resultados.innerHTML = "Sem resultados";
      return;
    }

   data.results.forEach(game => {
  const div = document.createElement("div");

  div.style.border = "1px solid #ccc";
  div.style.margin = "10px";
  div.style.padding = "10px";
  div.style.width = "200px";

div.classList.add("card");

div.innerHTML = `
  <img src="${game.background_image || 'https://via.placeholder.com/300x160'}">
  <div class="card-content">
    <h3>${game.name}</h3>
    <p class="rating">⭐ ${game.rating}</p>
  </div>
`;

  resultados.appendChild(div);
});

  } catch (err) {
    console.error("ERRO:", err);
    resultados.innerHTML = "Erro ao buscar jogos";
  }
});