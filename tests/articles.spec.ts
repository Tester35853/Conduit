import { expect, test } from '@playwright/test';
import { SignUpAndSignIn } from '../page-objects/signUp';
import { Faker, ru } from '@faker-js/faker';

const faker = new Faker({ locale: [ru] });

let username = '';

test.beforeEach('Link Conduit', async ({ page }) => {
    await page.goto('https://conduit.bondaracademy.com/');
    const signIn = new SignUpAndSignIn(page);
    await signIn.signUp(); // Регистрируем пользователя
    await signIn.logOut(); // Выходим из профиля
    await signIn.logIn(); // Залогиниваемся
    username = signIn.username;

});

test('Create and delete article', async ({ page }) => {
    await page.getByRole('link', {name: ' New Article '}).click();
    expect(page.getByPlaceholder('Article Title')).toBeVisible();

    const title = faker.lorem.words(3);
    const description = faker.lorem.sentence();
    const body = faker.lorem.paragraph();
    const tags = faker.string.alpha({ length: 8 });

    const homeLink = page.getByRole('link', {name: 'Home'});

    await page.getByPlaceholder('Article Title').fill(title);
    await page.getByPlaceholder("What's this article about?").fill(description);
    await page.getByPlaceholder('Write your article (in markdown)').fill(body);
    await page.getByPlaceholder('Enter tags').fill(tags);
    await page.getByRole('button', { name: 'Publish Article' }).click();
    await expect(page.locator('h1')).toHaveText(title);

    await homeLink.click();
    await expect(page.locator('app-article-preview a.author', { hasText: username })).toBeVisible();
    await page.waitForTimeout(1000);
    await expect(page.locator('.tag-list .tag-default.tag-pill', { hasText: tags })).toBeVisible();

    await page.getByRole('link', {name: ' New Article '}).click();

    const title2 = faker.lorem.words(3);
    const description2 = faker.lorem.sentence();
    const body2 = faker.lorem.paragraph();
    await page.getByPlaceholder('Article Title').fill(title2);
    await page.getByPlaceholder("What's this article about?").fill(description2);
    await page.getByPlaceholder('Write your article (in markdown)').fill(body2);
    await page.getByPlaceholder('Enter tags').fill(tags);
    await page.getByRole('button', { name: 'Publish Article' }).click();
    await expect(page.locator('h1')).toHaveText(title2);
    await homeLink.click();
    await page.waitForTimeout(1000);
    await expect(page.locator('.col-md-3 .tag-list .tag-default.tag-pill', { hasText: tags })).toBeVisible();

    //Проверяем лайки
    await page.locator('app-article-preview', {hasText: title}).locator('app-favorite-button').click();
    await expect(page.locator('app-article-preview', {hasText: title}).locator('app-favorite-button')).toHaveText(/1/);
    await page.locator('app-article-preview', {hasText: title2}).locator('app-favorite-button').click();
    await expect(page.locator('app-article-preview', {hasText: title2}).locator('app-favorite-button')).toHaveText(/1/);

    //Удаляем статьи
    await page.locator('app-article-preview', {hasText: title}).click();
    await page.getByRole('button', { name: 'Delete Article' }).first().click();
    await expect(page.locator('app-article-preview', {hasText: title})).toHaveCount(0);
    await page.locator('app-article-preview', {hasText: title2}).click();
    await page.getByRole('button', { name: 'Delete Article' }).first().click();
    await expect(page.locator('app-article-preview', {hasText: title2})).toHaveCount(0);
});

test('Edit article', async ({ page }) => {
    const createArticle = new SignUpAndSignIn(page);
    const title = faker.lorem.words(3);
    const comment = faker.lorem.sentence();
    const comment2 = faker.lorem.sentence();

    await createArticle.createArticle();
    await page.locator('.container .btn-outline-secondary').nth(1).click();
    await page.getByPlaceholder('Article Title').fill('');
    await page.getByPlaceholder('Article Title').fill(title);
    await page.getByRole('button', { name: 'Publish Article' }).click();
    await expect(page.locator('h1')).toHaveText(title);
    await page.getByPlaceholder('Write a comment...').fill(comment);
    await page.getByRole('button', { name: 'Post Comment' }).click();
    await expect(page.locator('.card-text')).toHaveText(comment);
    await page.getByPlaceholder('Write a comment...').fill(comment2);
    await page.getByRole('button', { name: 'Post Comment' }).click();
    await expect(page.locator('.card-text', { hasText: comment2 })).toBeVisible();
    await page.locator('.card', { hasText: comment }).locator('.ion-trash-a').click();
})

test('Cursor on the comment', async ({ page }) => {
    const createArticle = new SignUpAndSignIn(page);
    await createArticle.createArticle();

    const longText = faker.lorem.paragraphs(5); //пишем длинный текст

    await page.getByPlaceholder('Write a comment...').fill(longText);

    const commentField = page.getByPlaceholder('Write a comment...');
    const boundingBox = await commentField.boundingBox();
    if (boundingBox) {  
    // Вычисляем координаты нижнего правого угла
    const resizeHandleX = boundingBox.x + boundingBox.width - 5; // -5 для небольшой отступа от края
    const resizeHandleY = boundingBox.y + boundingBox.height - 5;

    // Имитировать нажатие и перетаскивание мыши
    await page.mouse.move(resizeHandleX, resizeHandleY); // Перемещаем курсор к углу
    await page.mouse.down(); // Нажимаем кнопку мыши
    await page.mouse.move(resizeHandleX, resizeHandleY + 240); // Перетаскиваем курсор вниз на 240px
    await page.mouse.up(); // Отпускаем кнопку мыши
    }
    await page.getByRole('button', { name: 'Post Comment' }).click();
})


