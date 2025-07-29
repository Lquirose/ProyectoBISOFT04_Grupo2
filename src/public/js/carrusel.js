let slideIndex = 1;

function currentSlide(n) {
  showSlide(slideIndex = n);
}

function showSlide(n) {
  let slides = document.getElementsByClassName("hero-slide");
  let dots = document.getElementsByClassName("dot");
  
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  
  // Ocultar todos los slides
  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove("active");
  }
  
  // Desactivar todos los indicadores
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove("active");
  }
  
  // Mostrar slide actual y activar indicador
  slides[slideIndex-1].classList.add("active");
  dots[slideIndex-1].classList.add("active");
}

// Auto-cambio cada 5 segundos
setInterval(() => {
  slideIndex++;
  showSlide(slideIndex);
}, 15000);