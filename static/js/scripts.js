
// Slider init
let mySwiper = new Swiper('#tools', {
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

let projectSwiper = new Swiper('#project-imgs', {
  hashNavigation: {
    watchState: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
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
      $('#myModal').modal('show');      
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

