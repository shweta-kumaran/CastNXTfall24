import { defineFeature, loadFeature } from "jest-cucumber";
import { Builder, By, Capabilities, until } from "selenium-webdriver";

const feature = loadFeature("spec/features/AdminHomepage.feature");

// driver setup
const capabilities = Capabilities.chrome();
capabilities.set('chromeOptions', { "w3c": false });
const driver = new Builder().withCapabilities(capabilities).build();

defineFeature(feature, (test) => {

    afterAll(async () => {
        await driver.quit();
    });

    test('Admin can see list of their events and can create new events', ({ given, when, then, and }) => {
        given(/^a user with email \"(.+)\" and password \"(\w+)\" is logged in as an \"admin\"$/, async (email, password) => {
            // Write code here that turns the phrase above into concrete actions
            await driver.get('http://127.0.0.1:3000/home');
            // set email in the loginEmail input field
            await driver.findElement(By.name('loginEmail')).sendKeys(email);
            // set password in the loginPassword input field
            await driver.findElement(By.name('loginPassword')).sendKeys(password);
            // click the login button
            await driver.findElement(By.id('login')).click();

            // wait for the page to load
            await driver.wait(until.elementLocated(By.id('events')), 10000);
        });

        when('the user navigates to the Admin Homepage', async () => {
            // Write code here that turns the phrase above into concrete actions
            await driver.get('http://127.0.0.1:3000/admin');
        });

        then('the user should see a list of their events', async () => {
            // Write code here that turns the phrase above into concrete actions
            expect(driver.findElement(By.id('events'))).toBeTruthy();
        });

        and('the user should see a button to create a new event', () => {
            // Write code here that turns the phrase above into concrete actions
            expect(driver.findElement(By.id('createEvent'))).toBeTruthy();
        });

    }, 30000);
});
