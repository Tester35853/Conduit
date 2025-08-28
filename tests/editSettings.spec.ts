import { expect, test } from '@playwright/test';
import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';

test.beforeEach('Link Conduit', async ({page}) =>{
    await page.goto('https://conduit.bondaracademy.com/') 
});

test('Edit user settings', async ({ page }) => {
    const editPath = path.resolve(__dirname, '../.auth/editUser.json');
    const validPath = path.resolve(__dirname, '../.auth/validUser.json');
    const userFile = fs.existsSync(editPath) ? editPath : validPath;
    const userData = JSON.parse(fs.readFileSync(userFile, 'utf-8'));
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

    await expect(page.locator('.nav-link', { hasText: userData.username })).toBeVisible({ timeout: 20000 });
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
    await expect(page.locator('.nav-link', { hasText: editUsername })).toBeVisible();
});