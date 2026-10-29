# Портфолио

Одностраничный сайт: исходники в `static/`, продакшен — `dist/` (Vite, `base: './'`).

Сайт: [https://ars000.ru](https://ars000.ru)

## Локально

Node.js 20+, npm:

```bash
npm install
npm run dev      # http://localhost:4173
npm run build    # dist/
npm run preview  # проверка dist/
```

Правки — только в `static/` (`index.html`, `scss/`, `js/`, `img/`). Список работ в `static/js/works-data.js`. `dist/` и `node_modules/` в git не коммитятся.

## Git и публикация

- Работа в **feature-ветках**; на [ars000.ru](https://ars000.ru) попадает только код из **`master`**.
- **Push в `master`** → [GitHub Actions](.github/workflows/deploy-pages.yml) (Pages: **Source → GitHub Actions**).
- WIP локально: `npm run dev` / `npm run preview`.
