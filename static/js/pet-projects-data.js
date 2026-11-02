/** Пет-проекты — правьте массив, чтобы обновить карточки на сайте */
export const petProjectsData = [
  {
    id: 'pass',
    title: 'Генератор паролей',
    description:
      'Настраиваемый генератор надёжных паролей: длина, наборы символов и индикатор сложности. Генерация выполняется только в браузере.',
    image: './img/pet-projects/pass.webp',
    href: 'https://pass.ars000.ru/',
    repo: 'https://github.com/ars000/password-generator',
    technologies: ['React', 'TypeScript', 'Vite', 'Sass'],
  },
  {
    id: 'prompts',
    title: 'AI Prompt Studio',
    description:
      'Библиотека промптов с переменными, версиями и шаблонами. Поиск, коллекции, импорт и экспорт, оптимизатор текстов.',
    image: './img/pet-projects/prompts.webp',
    href: 'https://prompts.ars000.ru/',
    repo: 'https://github.com/ars000/AI-Prompt-Studio',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Vite'],
  },
  {
    id: 'recipe',
    title: 'Recipe AI',
    description:
      'Менеджер рецептов с каталогом, фильтрами и удобным просмотром блюд. Fullstack-приложение с отдельным API и общими типами.',
    image: './img/pet-projects/recipe.webp',
    href: 'https://recipe.ars000.ru/',
    repo: 'https://github.com/ars000/Recipe-AI',
    technologies: ['Angular', 'NestJS', 'Prisma', 'TypeScript'],
  },
];
