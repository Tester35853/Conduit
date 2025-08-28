import { Page, expect} from "@playwright/test";
import { faker } from '@faker-js/faker';

export class SignUpAndSignIn {

    readonly page: Page;
    username: string = ""; // Добавляем свойство для хранения username
    email: string = ""; // Добавляем свойство для хранения email
    password: string = ""; // Добавляем свойство для хранения password

    constructor(page: Page) {
        this.page = page;
    };

    async signUp(){
        await this.page.getByText('Sign up').click();
        await expect(this.page.locator('.text-xs-center').first()).toHaveText('Sign up');
        this.username = faker.string.alpha({ length: 10 }); // username длиной 10 символов
        this.email = faker.internet.email();
        this.password = faker.internet.password();
        await this.page.getByPlaceholder('Username').fill(this.username);
        await this.page.getByPlaceholder('Email').fill(this.email);
        await this.page.getByPlaceholder('Password').fill(this.password);
        await this.page.getByRole('button', { name: 'Sign up' }).click();
        
        await expect(this.page.locator('.nav-link', { hasText: this.username })).toBeVisible();
        await this.page.waitForTimeout(1000);

        return this.username; // Возвращаем имя пользователя для дальнейшего использования
    };

    async logOut(){
        await this.page.getByRole('link', { name: (this.username) }).click();
        await this.page.getByText('Edit Profile Settings').click();
        await this.page.getByRole('button', {name: 'Or click here to logout.'}).click();
    };

    async logIn(){
        await this.page.getByRole('link', { name: 'Sign in' }).click();
        await this.page.getByPlaceholder('Email').fill(this.email);
        await this.page.getByPlaceholder('Password').fill(this.password);
        await this.page.getByRole('button', { name: 'Sign in' }).click();
        
        await expect(this.page.locator('.nav-link', { hasText: this.username })).toBeVisible();
    };

    async createArticle(){
        await this.page.getByRole('link', {name: ' New Article '}).click();
        const title = faker.lorem.words(3);
        const description = faker.lorem.sentence();
        const body = faker.lorem.paragraph();
        const tags = faker.string.alpha({ length: 8 });

        await this.page.getByPlaceholder('Article Title').fill(title);
        await this.page.getByPlaceholder("What's this article about?").fill(description);
        await this.page.getByPlaceholder('Write your article (in markdown)').fill(body);
        await this.page.getByPlaceholder('Enter tags').fill(tags);
        await this.page.getByRole('button', { name: 'Publish Article' }).click();
        await expect(this.page.locator('h1')).toHaveText(title);
    }
};