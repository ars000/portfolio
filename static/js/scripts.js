import DirectionReveal from './direction-reveal.js';
import { worksData } from './works-data.js';

// Прелоадер: скрываем после полной загрузки страницы
window.addEventListener('load', () => {
  gsap.to('.loader-wrap', { opacity: 0, zIndex: '-1', duration: 0.5 });
});

// Слайдер инструментов в секции навыков
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
  },
});

/**
 * Экранирует спецсимволы HTML (&, <, ", ').
 * Нужна, чтобы текст из данных безопасно вставлять в разметку
 * и не ломать HTML / не допустить XSS.
 */
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Экранирует значение для HTML-атрибутов (href, data-*, alt и т.д.).
 * Делает то же, что escapeHtml, плюс убирает переносы строк,
 * чтобы атрибут оставался в одну строку.
 */
function escapeAttr(value) {
  return escapeHtml(value).replace(/\n/g, ' ');
}

/**
 * Рендерит карточки работ в #works-wrap по данным из works-data.js.
 * Собирает HTML каждой карточки (обложка, название, описание, галерея)
 * и вставляет их в секцию «Мои работы».
 */
function renderWorks() {
  const worksWrap = document.querySelector('#works-wrap');
  if (!worksWrap) return;

  worksWrap.innerHTML = worksData
    .map(({ title, href = '', description, images }) => {
      const cover = images[0] || '';
      const imgSrc = images.join(',');
      return `
        <div class="col-sm-6 col-lg-4 wow zoomIn">
          <a class="work direction-reveal__card" href="${escapeAttr(href)}"
            data-description="${escapeAttr(description)}"
            data-img-src="${escapeAttr(imgSrc)}">
            <img class="work__img direction-reveal__img" src="${escapeAttr(cover)}" alt="${escapeAttr(title)}">
            <div class="work__cover direction-reveal__overlay direction-reveal__anim--enter">
              <h4 class="work__cover-name direction-reveal__title">${escapeHtml(title)}</h4>
            </div>
          </a>
        </div>`;
    })
    .join('');
}

renderWorks();

// Инициализация WOW после появления карточек работ в DOM
new WOW().init();

// Заполнение модального окна при клике на работу
const works = document.querySelectorAll('.work');
const projectImgs = document.querySelector('#project-imgs');
const modalTitle = document.querySelector('#modalLabel');
const modalSwiper = document.querySelector('#project-imgs .swiper-wrapper');
const projectDesc = document.querySelector('#project-description');
const projectLink = document.querySelector('#project-link');

works.forEach(function (item) {
  item.addEventListener('click', function (e) {
    e.preventDefault();
    if (item.dataset.imgSrc) {
      const srcAll = item.dataset.imgSrc.split(',').map((src) => src.trim()).filter(Boolean);
      modalSwiper.innerHTML = srcAll
        .map((src) => `<div class="swiper-slide"><img src="${src}" alt=""></div>`)
        .join('');
    }

    projectDesc.textContent = item.dataset.description || '';
    const href = item.getAttribute('href') || '';
    projectLink.textContent = href;
    projectLink.setAttribute('href', href);

    modalTitle.textContent = item.querySelector('.work__cover-name').textContent;

    const myModal = new bootstrap.Modal('#myModal');
    myModal.show();

    new Swiper(projectImgs, {
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  });
});

// Закрытие меню при клике по пунктам навигации
const navLinks = document.querySelectorAll('.nav-link');
const offcanvas = document.querySelector('#offcanvas');
const bsOffcanvas = new bootstrap.Offcanvas(offcanvas);

/**
 * Закрывает мобильное меню (offcanvas), если оно сейчас открыто.
 * Вызывается при клике по пункту навигации, чтобы меню не оставалось поверх страницы.
 */
function checkOpen() {
  const menuOpen = offcanvas.classList.contains('show');
  if (menuOpen) {
    bsOffcanvas.hide();
  }
}

navLinks.forEach((l) => {
  l.addEventListener('click', function () {
    checkOpen();
  });
});

window.addEventListener('scroll', () => {
  const body = document.querySelector('body');
  body.classList.toggle('scrolled', window.scrollY > 100);
});

// Эффект наведения на карточки работ (после рендера в DOM)
DirectionReveal({
  selector: '.direction-reveal--demo-slide',
  animationName: 'slide',
});


/**
 * Загружает SVG-иллюстрацию из внешнего файла, вставляет её в DOM
 * и запускает GSAP-анимации блока «Обо мне» (ноутбук, кнопки, идея и т.д.).
 * SVG нужен именно в DOM, чтобы анимировать внутренние элементы по id/классам.
 */
async function initCodingAnimation() {
  const container = document.querySelector('.coding-anim[data-svg-src]');
  if (!container) return;

  try {
    const response = await fetch(container.dataset.svgSrc);
    if (!response.ok) throw new Error(`SVG load failed: ${response.status}`);
    container.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
    return;
  }

  // Появление «строк кода» на экране ноутбука по кругу
  const appContentTl = gsap.timeline({
    repeat: -1,
  });

  appContentTl.to('#app__content__top, #app__content__mid, #app__content__bot', {x: 0, opacity: 0});
  appContentTl.fromTo('#app__content__top', {x: -10, opacity: 0, duration: 1}, {x: 0, opacity: 1});
  appContentTl.fromTo('#app__content__mid', {x: -10, opacity: 0, duration: 1}, {x: 0, opacity: 1}, '<0.5');
  appContentTl.fromTo('#app__content__bot', {x: -10, opacity: 0, duration: 1}, {x: 0, opacity: 1}, '<0.75');
  appContentTl.to('#app__content__top, #app__content__mid, #app__content__bot', {x: 0, opacity: 0, duration: 0.5,}, '<7');

  // Лёгкое покачивание кнопок HTML/CSS/JS
  const buttonsTl = gsap.timeline({
    repeat: -1,
    yoyo: true,
    delay: 7
  });
  buttonsTl.fromTo('.coding-anim__button', {y: 0, duration: 2.5},  {y: -10, duration: 2.5});

  // Появление и скрытие иконки «идея» (лампочка)
  const ideaTl = gsap.timeline({
    repeat: -1,
  });
  ideaTl.to('#idea', {opacity: 0, duration: 0.5});
  ideaTl.fromTo('#idea', {scale: 0, opacity: 0, transformOrigin: '50% 50%'}, {scale: 1, opacity: 1, transformOrigin: '50% 50%', ease: "back.out(1.7)"}, '+=5');
  ideaTl.to('#idea', {opacity: 0, duration: 1}, '+=15');

  /**
   * Перезапускает цикличные анимации контента, кнопок и «идеи».
   * Вызывается при обновлении/завершении основной timeline (mainTl),
   * чтобы петли синхронизировались с появлением всей сцены.
   */
  function restart() {
    appContentTl.restart(true, false);
    buttonsTl.restart(true, false);
    ideaTl.restart(true, false);
  }

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
}

initCodingAnimation();
