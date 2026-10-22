# Cosmovisa landing

Интерактивный лендинг на React, TypeScript и Vite. Оформление: Tailwind CSS, Framer Motion и Lenis.

## Запуск

Нужен Node.js 22 или новее.

```sh
npm ci
npm run dev -- --host 127.0.0.1
```

Адрес разработки: http://127.0.0.1:5173/.

## Проверки

```sh
npm run typecheck
npm test
npm run build
npm run format:check
```

`npm run check` запускает проверку типов, тесты и production-сборку. `npm run format` форматирует исходники и документацию.

## Где что менять

| Задача                              | Файл или папка                               |
| ----------------------------------- | -------------------------------------------- |
| Порядок блоков на странице          | `src/pages/landing/LandingPage.tsx`          |
| Тексты, цены и изображения сервисов | `src/shared/content/services.ts`             |
| Контакты и заглушки                 | `src/shared/content/contacts.ts`, `legal.ts` |
| Цвета                               | `src/shared/styles/tokens.css`               |
| Видеофайлы, позы и плавность        | `src/features/hero/config.ts`                |
| Задержки блокировки и подсказка     | `src/features/screensaver/config.ts`         |
| Порядок стрелок и пункты меню       | `src/shared/config/sections.ts`              |
| Появление, рассеивание, орбита      | `src/shared/ui/wordmark/`                    |

Подробная схема, правила зависимостей и сценарии расширения — в [ARCHITECTURE.md](ARCHITECTURE.md).
