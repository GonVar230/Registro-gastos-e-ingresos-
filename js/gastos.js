const layout = document.querySelector(".layout");

layout.style.display = "grid";

// Haciendo un sidebar para el dashboard
const logo = document.querySelector(".cont__imagen--logo");
const spans = document.querySelectorAll(".span__sidebar");
const sidebar = document.querySelector(".sidebar");

// Cuando se hace hover se expande
sidebar.addEventListener("mouseenter", () => {
    logo.style.opacity = "1";
    logo.style.transform = "translateY(0)";

    layout.classList.add("expandido");

    spans.forEach( span => {
        span.classList.add("span__visible");
    });
});

// Hover out y se contrae 
sidebar.addEventListener("mouseleave", () => {
    logo.style.opacity = "0";
    logo.style.transform = "translateY(-10px)";

    layout.classList.remove("expandido");
    layout.style.transition = "all 0.2s ease-in-out"

    spans.forEach( span => {
        span.classList.remove("span__visible");
    });
});

