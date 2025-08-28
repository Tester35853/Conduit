import { expect, test } from '@playwright/test';
import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';

test.beforeEach('Link Conduit', async ({page}) =>{
    await page.goto('https://conduit.bondaracademy.com/') 
});



test('Edit user settings', async ({ page }) => {
    // Сначала читаем валидные данные
    const filePath = path.resolve(__dirname, '../.auth/validUser.json');
    const editPath = path.resolve(__dirname, '../.auth/editUser.json');
    const userData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let userData2: any = undefined;
    const image = 'https://s1.iconbird.com/ico/1012/QettoIcons/w256h2561350658940jpg.png'
    const editUsername = faker.internet.username();
    const bio = faker.lorem.sentence();
    const editEmail = faker.internet.email();
    const editPassword = faker.internet.password();
    //Логинимся
    await page.getByRole('link', { name: 'Sign in' }).click();
    await page.getByPlaceholder('Email').fill(userData.email);
    await page.getByPlaceholder('Password').fill(userData.password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForTimeout(1000);

    // Проверяем, открыт ли профиль с юзернеймом
    if (await page.locator('.nav-link', { hasText: userData.username }).first().isVisible()) {
        // Переходим в настройки
        await page.getByRole('link', { name: 'Settings' }).click();
    } else if (await page.locator('.error-messages').isVisible()) {
        // Если есть сообщение об ошибке, пробуем другие данные
        const userData2 = JSON.parse(fs.readFileSync(editPath, 'utf-8'));
        await page.getByPlaceholder('Email').fill(userData2.email);
        await page.getByPlaceholder('Password').fill(userData2.password);
        await page.getByRole('button', { name: 'Sign in' }).click();
        // Проверяем, что теперь профиль открыт
        await expect(page.locator('.nav-link', { hasText: userData2.username }).first()).toBeVisible();
        await page.getByRole('link', { name: 'Settings' }).click();
    }
    
    //Заходим в Settings
    await page.getByRole('link', { name: 'Settings' }).click();
    await expect(page.locator('.text-xs-center', { hasText: 'Your Settings' })).toBeVisible();
    await page.getByPlaceholder('URL of profile picture').fill(image);
    await page.getByPlaceholder('Username').fill(editUsername);
    await page.getByPlaceholder('Short bio about you').fill(bio);
    await page.getByPlaceholder('Email').fill(editEmail);
    await page.getByPlaceholder('New Password').fill(editPassword);
    await page.getByRole('button', { name: 'Update Settings' }).click();
    await expect(page.locator('.user-info .user-img')).toBeVisible();
    await expect(page.locator('.user-info h4', { hasText: editUsername })).toBeVisible();

    fs.writeFileSync('.auth/editUser.json', JSON.stringify({
    username: editUsername,
    email: editEmail,
    password: editPassword,
    image,
    bio
    }, null, 2), 'utf-8');
    //Выходим из профиля
    await page.getByText('Edit Profile Settings').click();
    await page.getByRole('button', { name: 'Or click here to logout.' }).click();
    //Повторно логинимся с новыми данными
    await page.getByRole('link', { name: 'Sign in' }).click();
    await page.getByPlaceholder('Email').fill(editEmail);
    await page.getByPlaceholder('Password').fill(editPassword);
    await page.getByRole('button', { name: 'Sign in' }).click();
    // Проверяем, что имя пользователя обновилось и отображается в навигации
    await expect(page.locator('.nav-link').filter({ hasText: editUsername })).toBeVisible();
});