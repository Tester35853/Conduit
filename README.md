Playwright End-to-End Tests for Conduit
Этот репозиторий содержит автоматизированные end-to-end тесты, написанные на Playwright и TypeScript, для веб-приложения Conduit. 
Тесты включают в себя сценарии регистрации, входа в систему (Регистрация с валидными и невалидными данными), публикации статей и ех редактирование. А так же взаимодействия с комментариями.
Так же тесты включают сценарии изменения профиля пользователя

[![Playwright Tests](https://github.com/Tester35853/Conduit/actions/workflows/playwright.yml/badge.svg?branch=master)](https://github.com/Tester35853/Conduit/actions/workflows/playwright.yml)

### Установка

1.  Клонируйте репозиторий:
    `git clone https://github.com/Tester35853/Conduit.git`
2.  Перейдите в директорию проекта:
    `cd название-проекта`
3.  Установите все зависимости:
    `npm install --force`
4.  Установите браузеры, необходимые для Playwright:
    `npx playwright install --force`
5.  Установите библиотеку faker
    `npm i @faker-js/faker --save-dev --force`

### Запуск тестов

- Запустить все тесты:
  `npx playwright test`
- Запустить тесты в режиме отладки:
  `npx playwright test --debug`

### Структура проекта

- `tests/`: Содержит все файлы с тестами.
- `page-objects/`: Содержит классы Page Object Model для взаимодействия с элементами страницы.
- `playwright.config.ts`: Файл конфигурации Playwright.
- `.github/workflows/playwright.yml`: Конфигурация для GitHub Actions.

### Контакты

Если у вас есть вопросы или предложения, свяжитесь со мной:
- Email: ### Контакты

Если у вас есть вопросы или предложения, свяжитесь со мной:
- Email: crm.35853@gmail.com
- Telegram: @Evgeniy_id949
