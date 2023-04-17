import DirectionReveal from './direction-reveal.js';

// Loader
window.addEventListener('load', ()=> {
  gsap.to('.loader-wrap', {opacity: 0, zIndex: '-1', duration: 0.5})
})



// Slider init
new Swiper('#tools', {
  slidesPerView: 1,
  loop: true,
  speed: 1000,
  autoplay: true,
  breakpoints: {
    320: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    1070: {
      slidesPerView: 4,
      spaceBetween: 60,
    },
  }
});


// WOW js init
new WOW().init();


// Filling modal window content from work
const works = document.querySelectorAll('.work');
const projectImgs = document.querySelector('#project-imgs');
const modalTitle = document.querySelector('#modalLabel');
const modalSwiper = document.querySelector('#project-imgs .swiper-wrapper');
const projectDesc = document.querySelector('#project-description');
const projectLink = document.querySelector('#project-link');

works.forEach(function(item) {
  
  item.addEventListener('click', function(e) {
    e.preventDefault();
    if(item.dataset.imgSrc) {
      const srcAll = item.dataset.imgSrc.trim().split(',');
      modalSwiper.innerHTML = ''
      for(let i=0; i<srcAll.length; i++) {
        modalSwiper.innerHTML += `<div class="swiper-slide">
                    <img src="${srcAll[i]}" alt="" >
                  </div>`
      }
    }

    projectDesc.innerHTML = item.dataset.description;
    projectLink.innerHTML = item.getAttribute('href');
    projectLink.setAttribute('href', item.getAttribute('href'));
    modalTitle.innerHTML = item.querySelector('.work__cover-name').textContent;

    // Modal
    const myModal = new bootstrap.Modal('#myModal');
    myModal.show()
    
    // Slider on projects section
    new Swiper(projectImgs, {
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      }
    });
  })
})


// Close navbarmenu on click to items
const navLinks = document.querySelectorAll('.nav-link');
const offcanvas = document.querySelector('#offcanvas');
const bsOffcanvas = new bootstrap.Offcanvas(offcanvas);

function checkOpen() {
  let menuOpen = offcanvas.classList.contains('show');
  if (menuOpen) {
    bsOffcanvas.hide();
  }    
}

navLinks.forEach((l) => {
  l.addEventListener('click', function() {
    checkOpen();      
  })
});
  

// Header background on scroll
let scrollpos = window.scrollY;
const body = document.querySelector('body');
window.addEventListener('scroll', () => {
  scrollpos = window.scrollY;
  (scrollpos >= 100) ? body.classList.add('scrolled') : body.classList.remove('scrolled');
})


// Hover effect on works section
const directionRevealSlide = DirectionReveal({
  selector: '.direction-reveal--demo-slide',
  animationName: 'slide'
});


// Coding animation
const appContentTl = gsap.timeline({
  repeat: -1,
});

appContentTl.to('#app__content__top, #app__content__mid, #app__content__bot', {x: 0, opacity: 0});
appContentTl.fromTo('#app__content__top', {x: -10, opacity: 0, duration: 1}, {x: 0, opacity: 1});
appContentTl.fromTo('#app__content__mid', {x: -10, opacity: 0, duration: 1}, {x: 0, opacity: 1}, '<0.5');
appContentTl.fromTo('#app__content__bot', {x: -10, opacity: 0, duration: 1}, {x: 0, opacity: 1}, '<0.75');
appContentTl.to('#app__content__top, #app__content__mid, #app__content__bot', {x: 0, opacity: 0, duration: 0.5,}, '<7');


const buttonsTl = gsap.timeline({
  repeat: -1,
  yoyo: true,
  delay: 7
});
buttonsTl.fromTo('.coding-anim__button', {y: 0, duration: 2.5},  {y: -10, duration: 2.5});

const ideaTl = gsap.timeline({
  repeat: -1,
});
ideaTl.to('#idea', {opacity: 0, duration: 0.5});
ideaTl.fromTo('#idea', {scale: 0, opacity: 0, transformOrigin: '50% 50%'}, {scale: 1, opacity: 1, transformOrigin: '50% 50%', ease: "back.out(1.7)"}, '+=5');
ideaTl.to('#idea', {opacity: 0, duration: 1}, '+=15');

const mainTl = gsap.timeline({
  scrollTrigger: {
    trigger: '#about',
    start: '20% 75%',
    toggleActions: 'restart none play none'
  },
  
  onUpdate: restart,
  onComplete: restart
});
mainTl.to('#app__content__top, #app__content__mid, #app__content__bot', {x: 0, opacity: 0});
mainTl.to('#idea', {opacity: 0});
mainTl.from('#hand-coding', {y: -100, opacity: 0, duration: 1.2});
mainTl.to('#app', {x: -13, y: -54, opacity: 0, duration: 0}, '<-1.2');
mainTl.from('#desk__shadow', {scale: 1.2, opacity: 0, transformOrigin: '50% 50%', duration: .6},'-=0.5');
mainTl.from('#laptop', {y: -50, duration: 1.2},'-=1.2');
mainTl.from('#laptop__shadow', {scale: 1.1, opacity: 0, transformOrigin: '50% 50%', duration: 1},'<0.6');
mainTl.from('#notebook', {y: -50, opacity: 0, duration: 1},'<-=1');
mainTl.from('#notebook__shadow', {scale: 1.2, opacity: 0, transformOrigin: '50% 50%', duration: 1},'>-=0.6');
mainTl.fromTo('#app', {x: -13, y: -54, opacity: 0, duration: 1.2, }, {x: -10, y: -4, opacity: 1, duration: 1.2}, '<');
mainTl.fromTo('#app', {x: -10, y: -4, duration: 1.2, }, {x: 0, y: 0, duration: 1.2}, '<1.2');
mainTl.from('.coding-anim__button', {y: -70, opacity: 0, duration: 1.2, stagger: -0.1}, '<-=1.5');
mainTl.from('#coffee', {y: -70, opacity: 0, duration: 1.2}, '<1');
mainTl.from('#coffee__shadow', {scale: 1.2, opacity: 0, transformOrigin: '50% 50%', duration: .6}, '<0.8');
mainTl.from('#man, #armchair', {x: 40, opacity: 0, duration: 1}, '<-0.8');
mainTl.from('#app__content__left, #app__content__right', {x: -10, opacity: 0, duration: 1}, '+=0.3');

function restart() {
  appContentTl.restart(true, false);
  buttonsTl.restart(true, false);
  ideaTl.restart(true, false);
}
