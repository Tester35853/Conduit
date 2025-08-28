import { expect, test } from '@playwright/test';

test.beforeEach('Link Conduit', async ({page}) =>{
    await page.goto('https://conduit.bondaracademy.com/') 
});

test('Elements on the page', async ({page}) => {
        await expect(page.locator('.navbar-brand')).toHaveText('conduit');
        const navLinks = page.locator('.nav-link');
        await expect(navLinks.nth(0)).toHaveText('Home');
        await expect(navLinks.nth(1)).toHaveText('Sign in');
        await expect(navLinks.nth(2)).toHaveText('Sign up');
        await expect(page.locator('.banner h1')).toHaveText('conduit');
        await expect(page.locator('.banner p').first()).toHaveText('A place to learn and practice test automation.');
        await expect(page.locator('.banner p a')).toHaveText('www.bondaracademy.com');

        const allArticles = page.locator('app-article-list app-article-preview');
        await expect(allArticles).toHaveCount(10); // Проверяем, что на странице ровно 10 статей

        // Локатор для всех кнопок-счетчиков лайков
        const allLikeButtons = page.locator('app-article-preview button.btn-outline-primary');

        // Проверяем, что количество кнопок-счетчиков равно количеству статей
        await expect(allLikeButtons).toHaveCount(await allArticles.count());

        // Проверяем, что все счетчики видимы
        const likeButtonCount = await allLikeButtons.count();
        for (let i = 0; i < likeButtonCount; i++) {
            await expect(allLikeButtons.nth(i)).toBeVisible();
        }

        await expect(page.locator('.col-md-3')).toBeVisible();
        await expect(page.locator('.pagination')).toBeVisible();
    });

test('Expect likes', async ({page}) =>{
    const allArticles = page.locator('app-article-list app-article-preview');
    await expect(allArticles).toHaveCount(10); // Проверяем, что на странице ровно 10 статей

    const allLikeButtons = page.locator('app-article-preview', {hasText: 'The value'}).locator('button.btn-outline-primary');
    const likeButtonCount = await allLikeButtons.count();
        for (let i = 0; i < likeButtonCount; i++) {
        const text = await allLikeButtons.nth(i).textContent();
        // Например, сравнить с ожидаемым значением:
    expect(text?.trim()).toBe('262'); // или другое ожидаемое число
    }
})