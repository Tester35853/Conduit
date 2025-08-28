import { expect, test } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { SignUpAndSignIn } from '../page-objects/signUp';

test.beforeEach('Link Conduit', async ({page}) =>{
    await page.goto('https://conduit.bondaracademy.com/') 
});

test('Sign up and Log Out', async({page}) => {
    const signUp = new SignUpAndSignIn(page);
    const username = await signUp.signUp(); // Получаем имя пользователя после регистрации

    await page.getByRole('link', { name: (username) }).click();
    await page.getByText('Edit Profile Settings').click();
    await page.getByRole('button', {name: 'Or click here to logout.'}).click();

    await expect(page.locator('.navbar-brand')).toHaveText('conduit');
})

test('Sign in', async({page}) => {
    const signUp = new SignUpAndSignIn(page);
    await signUp.signUp(); // Регистрируем пользователя
    await signUp.logOut(); // Выходим из профиля
    

    await expect(page.locator('.navbar-brand')).toHaveText('conduit');

    await page.getByRole('link', { name: 'Sign in' }).click();
    await page.getByPlaceholder('Email').fill(signUp.email);
    await page.getByPlaceholder('Password').fill(signUp.password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    
});

