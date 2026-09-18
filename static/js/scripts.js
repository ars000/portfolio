import * as bootstrap from 'bootstrap';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Swiper from 'swiper/bundle';
import DirectionReveal from './direction-reveal.js';
import { worksData } from './works-data.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'swiper/css/bundle';
import '../scss/styles.scss';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const worksById = new Map(worksData.map((work) => [work.id, work]));

function onReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true });
  } else {
    callback();
  }
}

/**
 * Скрывает прелоадер после готовности DOM и шрифтов,
 * не дожидаясь загрузки всех скриншотов работ.
 */
function initLoader() {
  const loader = document.querySelector('.loader-wrap');
  if (!loader) return;

  let hidden = false;

  const hideLoader = () => {
    if (hidden) return;
    hidden = true;
    loader.setAttribute('aria-hidden', 'true');

    if (prefersReducedMotion) {
      loader.style.opacity = '0';
      loader.style.zIndex = '-1';
      loader.style.pointerEvents = 'none';
      return;
    }

    gsap.to(loader, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        loader.style.zIndex = '-1';
        loader.style.pointerEvents = 'none';
      },
    });
  };

  onReady(() => {
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    Promise.race([
      fontsReady,
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ]).then(hideLoader);
  });

  setTimeout(hideLoader, 1500);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/\n/g, ' ');
}

/**
 * Показывает элементы с классом .wow при появлении во вьюпорте.
 */
function initReveal() {
  const nodes = document.querySelectorAll('.wow');
  if (!nodes.length) return;

  if (prefersReducedMotion) {
    nodes.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const delay = entry.target.dataset.wowDelay;
        if (delay) entry.target.style.animationDelay = delay;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
  );

  nodes.forEach((el) => observer.observe(el));
}

function renderWorks() {
  const worksWrap = document.querySelector('#works-wrap');
  if (!worksWrap) return;

  worksWrap.innerHTML = worksData
    .map(({ id, title, href = '', images }) => {
      const cover = images[0] || '';
      return `
        <div class="col-sm-6 col-lg-4 wow zoomIn">
          <a class="work direction-reveal__card" href="${escapeAttr(href || '#')}"
            data-work-id="${escapeAttr(id)}">
            <img class="work__img direction-reveal__img" src="${escapeAttr(cover)}" alt="${escapeAttr(title)}" loading="lazy" decoding="async">
            <div class="work__cover direction-reveal__overlay direction-reveal__anim--enter">
              <h4 class="work__cover-name direction-reveal__title">${escapeHtml(title)}</h4>
            </div>
          </a>
        </div>`;
    })
    .join('');
}

/**
 * Один экземпляр модалки и слайдера: слайды обновляются при каждом открытии.
 */
function initWorksModal() {
  const worksWrap = document.querySelector('#works-wrap');
  const projectImgs = document.querySelector('#project-imgs');
  const modalTitle = document.querySelector('#modalLabel');
  const projectDesc = document.querySelector('#project-description');
  const projectLink = document.querySelector('#project-link');
  const modalEl = document.querySelector('#myModal');

  if (!worksWrap || !projectImgs || !modalEl) return;

  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  const swiper = new Swiper(projectImgs, {
    observer: true,
    observeParents: true,
    navigation: {
      nextEl: '#project-imgs .swiper-button-next',
      prevEl: '#project-imgs .swiper-button-prev',
    },
  });

  modalEl.addEventListener('shown.bs.modal', () => {
    swiper.update();
  });

  worksWrap.addEventListener('click', (e) => {
    const item = e.target.closest('.work');
    if (!item) return;
    e.preventDefault();

    const work = worksById.get(item.dataset.workId);
    if (!work) return;

    const images = (work.images || []).filter(Boolean);
    swiper.removeAllSlides();
    swiper.appendSlide(
      images.map(
        (src) =>
          `<div class="swiper-slide"><img src="${escapeAttr(src)}" alt="${escapeAttr(work.title)}" loading="lazy" decoding="async"></div>`,
      ),
    );
    swiper.slideTo(0, 0);
    swiper.update();

    if (projectDesc) projectDesc.textContent = work.description || '';
    if (modalTitle) modalTitle.textContent = work.title;

    if (projectLink) {
      if (work.href) {
        projectLink.hidden = false;
        projectLink.textContent = work.href;
        projectLink.setAttribute('href', work.href);
        projectLink.setAttribute('target', '_blank');
        projectLink.setAttribute('rel', 'noopener noreferrer');
      } else {
        projectLink.hidden = true;
        projectLink.textContent = '';
        projectLink.removeAttribute('href');
      }
    }

    modal.show();
  });
}

function initToolsSwiper() {
  const toolsEl = document.querySelector('#tools');
  if (!toolsEl) return;

  new Swiper(toolsEl, {
    slidesPerView: 1,
    loop: true,
    speed: 1000,
    autoplay: prefersReducedMotion ? false : { delay: 3000, disableOnInteraction: false },
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
}

function initOffcanvasNav() {
  const offcanvas = document.querySelector('#offcanvas');
  if (!offcanvas) return;

  const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvas);

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (offcanvas.classList.contains('show')) bsOffcanvas.hide();
    });
  });
}

function initHeaderScroll() {
  const body = document.body;
  const onScroll = () => {
    body.classList.toggle('scrolled', window.scrollY > 100);
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/**
 * Lordicon крутятся по loop+delay, пока карточка в зоне видимости.
 * Вне вьюпорта — пауза. Hover не используется.
 */
function initLordicons() {
  const icons = document.querySelectorAll('lord-icon');
  if (!icons.length) return;

  const getPlayer = (icon) => icon.playerInstance || icon.player;

  const setPlaying = (icon, playing) => {
    if (prefersReducedMotion || !playing) {
      getPlayer(icon)?.pause?.();
      icon.setAttribute('trigger', 'in');
      return;
    }

    icon.setAttribute('trigger', 'loop');
    getPlayer(icon)?.playFromBeginning?.() ?? getPlayer(icon)?.play?.();
  };

  if (prefersReducedMotion) {
    icons.forEach((icon) => setPlaying(icon, false));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => setPlaying(entry.target, entry.isIntersecting));
    },
    { threshold: 0.2 },
  );

  icons.forEach((icon) => {
    setPlaying(icon, false);
    observer.observe(icon);
  });
}

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

  if (prefersReducedMotion) {
    gsap.set(
      '#app__content__top, #app__content__mid, #app__content__bot, #idea, #hand-coding, #app, #desk__shadow, #laptop, #laptop__shadow, #notebook, #notebook__shadow, .coding-anim__button, #coffee, #coffee__shadow, #man, #armchair, #app__content__left, #app__content__right',
      { clearProps: 'all', opacity: 1, x: 0, y: 0, scale: 1 },
    );
    return;
  }

  const appContentTl = gsap.timeline({
    repeat: -1,
    paused: true,
  });

  appContentTl.to('#app__content__top, #app__content__mid, #app__content__bot', { x: 0, opacity: 0 });
  appContentTl.fromTo('#app__content__top', { x: -10, opacity: 0, duration: 1 }, { x: 0, opacity: 1 });
  appContentTl.fromTo('#app__content__mid', { x: -10, opacity: 0, duration: 1 }, { x: 0, opacity: 1 }, '<0.5');
  appContentTl.fromTo('#app__content__bot', { x: -10, opacity: 0, duration: 1 }, { x: 0, opacity: 1 }, '<0.75');
  appContentTl.to('#app__content__top, #app__content__mid, #app__content__bot', { x: 0, opacity: 0, duration: 0.5 }, '<7');

  const buttonsTl = gsap.timeline({
    repeat: -1,
    yoyo: true,
    delay: 7,
    paused: true,
  });
  buttonsTl.fromTo('.coding-anim__button', { y: 0, duration: 2.5 }, { y: -10, duration: 2.5 });

  const ideaTl = gsap.timeline({
    repeat: -1,
    paused: true,
  });
  ideaTl.to('#idea', { opacity: 0, duration: 0.5 });
  ideaTl.fromTo('#idea', { scale: 0, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, transformOrigin: '50% 50%', ease: 'back.out(1.7)' }, '+=5');
  ideaTl.to('#idea', { opacity: 0, duration: 1 }, '+=15');

  function restartLoops() {
    appContentTl.restart(true, false);
    buttonsTl.restart(true, false);
    ideaTl.restart(true, false);
  }

  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#about',
      start: '20% 75%',
      toggleActions: 'play none none none',
      once: true,
    },
    onComplete: restartLoops,
  });
  mainTl.to('#app__content__top, #app__content__mid, #app__content__bot', { x: 0, opacity: 0 });
  mainTl.to('#idea', { opacity: 0 });
  mainTl.from('#hand-coding', { y: -100, opacity: 0, duration: 1.2 });
  mainTl.to('#app', { x: -13, y: -54, opacity: 0, duration: 0 }, '<-1.2');
  mainTl.from('#desk__shadow', { scale: 1.2, opacity: 0, transformOrigin: '50% 50%', duration: 0.6 }, '-=0.5');
  mainTl.from('#laptop', { y: -50, duration: 1.2 }, '-=1.2');
  mainTl.from('#laptop__shadow', { scale: 1.1, opacity: 0, transformOrigin: '50% 50%', duration: 1 }, '<0.6');
  mainTl.from('#notebook', { y: -50, opacity: 0, duration: 1 }, '<-=1');
  mainTl.from('#notebook__shadow', { scale: 1.2, opacity: 0, transformOrigin: '50% 50%', duration: 1 }, '>-=0.6');
  mainTl.fromTo('#app', { x: -13, y: -54, opacity: 0, duration: 1.2 }, { x: -10, y: -4, opacity: 1, duration: 1.2 }, '<');
  mainTl.fromTo('#app', { x: -10, y: -4, duration: 1.2 }, { x: 0, y: 0, duration: 1.2 }, '<1.2');
  mainTl.from('.coding-anim__button', { y: -70, opacity: 0, duration: 1.2, stagger: -0.1 }, '<-=1.5');
  mainTl.from('#coffee', { y: -70, opacity: 0, duration: 1.2 }, '<1');
  mainTl.from('#coffee__shadow', { scale: 1.2, opacity: 0, transformOrigin: '50% 50%', duration: 0.6 }, '<0.8');
  mainTl.from('#man, #armchair', { x: 40, opacity: 0, duration: 1 }, '<-0.8');
  mainTl.from('#app__content__left, #app__content__right', { x: -10, opacity: 0, duration: 1 }, '+=0.3');
}

initLoader();
renderWorks();
initReveal();
initHeaderScroll();
initWorksModal();
initToolsSwiper();
initOffcanvasNav();
initCodingAnimation();

if (!prefersReducedMotion) {
  DirectionReveal({
    selector: '.direction-reveal--demo-slide',
    animationName: 'slide',
  });
}

onReady(() => {
  let started = false;
  const startLordicons = () => {
    if (started) return;
    started = true;
    initLordicons();
  };
  if (customElements.get('lord-icon')) {
    startLordicons();
    return;
  }
  const timeout = setTimeout(startLordicons, 2000);
  customElements.whenDefined('lord-icon').then(() => {
    clearTimeout(timeout);
    startLordicons();
  });
});
