import { defineFeature, loadFeature } from "jest-cucumber";
import { Builder, By, Capabilities, until } from "selenium-webdriver";

const feature = loadFeature("spec/features/ClientHomepage.feature");

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

    test('Client can see list of projects', ({ given, when, then }) => {
        given(/^a client with email \"(.+)\" and password \"(\w+)\" is logged in as a \"client\"$/, async (email, password) => {
            // Navigate to the login page
            await driver.get('http://127.0.0.1:3000/home');
            // Enter email in the loginEmail input field
            await driver.findElement(By.name('loginEmail')).sendKeys(email);
            // Enter password in the loginPassword input field
            await driver.findElement(By.name('loginPassword')).sendKeys(password);
            // Click the login button
            await driver.findElement(By.id('login')).click();

            // Wait for the page to load
            await driver.wait(until.elementLocated(By.id('projects')));
        });

        when('the client navigates to the Client Homepage', async () => {
            // Navigate to the client homepage
            await driver.get('http://127.0.0.1:3000/client');
        });

        then('the client should see a list of projects', async () => {
            // Verify that the page contains project information
            expect(await driver.getPageSource()).toContain("Project");
            expect(await driver.getPageSource()).toContain("Project Alpha");
        });

    });
});