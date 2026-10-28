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

## Публикация

Push в ветку **`master`** запускает [GitHub Actions](.github/workflows/deploy-pages.yml): сборка и GitHub Pages.

Старый способ `npm run deploy` (ветка `gh-pages`) можно не использовать, если Pages настроен на Actions.
