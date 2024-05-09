var menuButton = document.querySelector("#menu-bar");
var navBar = document.querySelector(".navbar");

menuButton.onclick = () => {
  menuButton.classList.toggle("fa-times");
  navBar.classList.toggle("active");
};

window.onscroll = () => {
  menuButton.classList.remove("fa-times");
  navBar.classList.remove("active");
  themeToggle.classList.remove("active");
};

var themeToggle = document.querySelector(".theme-toggler");
var themeButton = document.querySelector(".toggle-btn");

themeButton.onclick = () => {
  themeToggle.classList.toggle("active");
};

document.querySelectorAll(".theme-toggler .theme-btn").forEach((button) => {
  button.onclick = () => {
    let color = button.style.background;
    document.querySelector(":root").style.setProperty("--theme-color", color);
  };
});

var swiper = new Swiper(".home-slider", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "auto",
  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 100,
    modifier: 2,
    slideShadows: true,
  },
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
});

var swiper = new Swiper(".review-slider", {
  spaceBetween: 10,
  grabCursor: true,
  slidesPerView: 1,
  loop: true,
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    700: {
      slidesPerView: 2
    },
    1050: {
      slidesPerView: 3,
    },
  },
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
});

