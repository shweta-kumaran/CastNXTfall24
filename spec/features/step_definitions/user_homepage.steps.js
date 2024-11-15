import { defineFeature, loadFeature } from "jest-cucumber";
import { Builder, By, Capabilities, until } from "selenium-webdriver";

const feature = loadFeature("spec/features/UserHomepage.feature");

const capabilities = Capabilities.chrome();
capabilities.set('chromeOptions', { "w3c": false });
const driver = new Builder().withCapabilities(capabilities).build();

defineFeature(feature, (test) => {

    afterAll(async () => {
        await driver.quit();
    });

    afterEach(async () => {
        await driver.findElement(By.id('logoutBtn')).click();
    });

    test('User can see list of events', ({ given, when, then }) => {
        given(/^a user with email \"(.+)\" and password \"(\w+)\" is logged in as an \"user\"$/, async (email, password) => {
            // Write code here that turns the phrase above into concrete actions
            await driver.get('http://127.0.0.1:3000/home');
            // set email in the loginEmail input field
            await driver.findElement(By.name('loginEmail')).sendKeys(email);
            // set password in the loginPassword input field
            await driver.findElement(By.name('loginPassword')).sendKeys(password);
            // click the login button
            await driver.findElement(By.id('login')).click();

            // wait for the page to load
            await driver.wait(until.elementLocated(By.id('events')));
        });

        when('the user navigates to the User Homepage', async () => {
            // Write code here that turns the phrase above into concrete actions
            await driver.get('http://127.0.0.1:3000/user');
        });

        then('the user should see a list of events', async () => {
            // Write code here that turns the phrase above into concrete actions
            expect(await driver.getPageSource()).toContain("Events");
            expect(await driver.getPageSource()).toContain("Miu Miu");
        });

    }, 150000);
});