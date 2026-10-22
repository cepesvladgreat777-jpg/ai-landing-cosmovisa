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

## GitHub Pages

Публикация вручную через пакет `gh-pages`:

```sh
npm run deploy
```

Команда автоматически запускает `predeploy` → `npm run build`, затем отправляет содержимое `dist/` в ветку `gh-pages` вашего `origin`. Нужна обычная авторизация Git для push в репозиторий.

После первой публикации откройте **Settings → Pages → Build and deployment**:

1. **Source:** Deploy from a branch.
2. **Branch:** gh-pages.
3. **Folder:** / (root).
4. Нажмите **Save**.

Адрес после успешной публикации: https://cepesvladgreat777-jpg.github.io/ai-landing-cosmovisa/.

В `vite.config.ts` задан `base: '/ai-landing-cosmovisa/'`. Поэтому локальный сайт теперь открывается по адресу http://127.0.0.1:5173/ai-landing-cosmovisa/. Пути к медиа в JSX проходят через `publicAsset()`, чтобы видео и картинки корректно загружались из каталога репозитория.

При следующих обновлениях снова запускайте `npm run deploy`. Отдельный workflow для деплоя не требуется. `dist/` и `node_modules/` исключены из Git.
