// Loader
$(window).on('load', function() {
  $('.loader-wrap').delay(300).fadeOut('slow');
});

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

$(function () {
  // WOW js init
  new WOW().init();

  // Hover effect
  $(' .work ').hoverdir();

  // Filling modal window content from work
  $('.work').click(function(e){
    e.preventDefault();

    var title = $(this).find('.work-cover-name').text(),        
          img = $(this).find('.work-img'),
  
        imgSrc = img.attr('src'),
        imgSrc2 = img.attr('data-img-src2'),
        imgSrc3 = img.attr('data-img-src3'),
        imgSrc4 = img.attr('data-img-src4'),
        description = $(this).attr('data-description'),
        link = $(this).attr('href');
  
      $('.modal-title').text(title);
      $('#project-img-1').attr('src', imgSrc);
      $('#project-img-2').attr('src', imgSrc2);
      $('#project-img-3').attr('src', imgSrc3);
      $('#project-img-4').attr('src', imgSrc4);
  
      $('#project-description').text(description);
      $('#project-link').text(link).attr('href', link);
      
    // Modal    
    $('#myModal').modal('show');
    
    // Slider on projects section     
    new Swiper('#project-imgs', {
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      }
    });
  });

  // Close navbarmenu on click to items
  let navMain = $("#navbarContent");
  navMain.on("click", "a", null, function () {
      navMain.collapse('hide');
  });


  // Header background on scroll
  setTimeout(() => {
    if (window.scrollY > 100) {
      $('body').addClass('scrolled');
    }

    $(window).on('scroll', function() {
      if (window.scrollY > 100) {
        $('body').addClass('scrolled');
      } else {
        $('body').removeClass('scrolled');
      } 
    });
  }, 100)
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
