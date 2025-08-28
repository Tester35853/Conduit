import { expect, test } from '@playwright/test';
import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';


test.beforeEach('Link Conduit', async ({page}) =>{
    await page.goto('https://conduit.bondaracademy.com/') 
});

test('Invalid sign up', async ({ page }) => {
    let username = faker.string.alpha({ length: 1 }); // username длиной 1 символ
    let email = faker.string.alpha({ length: 8 }); // email без @
    let password = faker.string.alpha({ length: 1 }); // password длиной 1 символ
    await page.getByRole('link', { name: 'Sign up' }).click();
    await page.getByPlaceholder('Username').fill(username);
    await page.getByPlaceholder('Email').fill(email);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.locator('.error-messages').waitFor({ state: 'visible', timeout: 5000 });

    // Проверяем сообщение об ошибке и добавляем символы, пока не исчезнет
    let attempts = 0;
    const maxAttempts = 10;

while (attempts < maxAttempts) {
    let errorText = await page.locator('.error-messages').textContent();

    if (errorText?.includes('username is too short')) {
        username += faker.string.alpha({ length: 1 });
        await page.getByPlaceholder('Username').fill(username);
    }
    if (errorText?.includes('email is invalid')) {
        email += '@test.com';
        await page.getByPlaceholder('Email').fill(email);
    }
    if (errorText?.includes('password is too short')) {
        password += faker.string.alpha({ length: 1 });
        await page.getByPlaceholder('Password').fill(password);
    }

    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.waitForTimeout(500);

    // Проверяем, исчезла ли ошибка
    if (!(await page.locator('.error-messages').isVisible())) {
        break;
    }
    attempts++;
    }

    await expect(page.locator('.nav-link', { hasText: username })).toBeVisible();

    const userData = {
        username,
        email,
        password
    };
    const filePath = path.resolve(__dirname, '../.auth/validUser.json');
    fs.writeFileSync(filePath, JSON.stringify(userData, null, 2), 'utf-8');
}); 

test('Invalid sign in', async ({ page }) => {
    const userData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../.auth/validUser.json'), 'utf-8'));

    await page.getByRole('link', { name: 'Sign in' }).click();
    await page.getByPlaceholder('Email').fill('123@test.com');
    await page.getByPlaceholder('Password').fill('123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.locator('.error-messages').waitFor({ state: 'visible', timeout: 5000 });

    // Проверяем сообщение об ошибке и добавляем символы, пока не исчезнет
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
        let errorText = await page.locator('.error-messages').textContent();

        if (errorText?.includes('email or password is invalid')) {
            await page.getByPlaceholder('Email').fill(userData.email);
        }
        if (errorText?.includes('email or password is invalid')) {
            await page.getByPlaceholder('Password').fill(userData.password);
        }

        await page.getByRole('button', { name: 'Sign in' }).click();
        await page.waitForTimeout(500);

        // Проверяем, исчезла ли ошибка
        if (!(await page.locator('.error-messages').isVisible())) {
            break;
        }
        attempts++;
    }
    await expect(page.locator('.nav-link', { hasText: userData.username })).toBeVisible();
})