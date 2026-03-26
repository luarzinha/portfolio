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
