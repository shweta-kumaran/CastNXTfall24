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
        try {
            const logoutButton = await driver.findElement(By.id('logoutBtn'));
            await logoutButton.click();
        } catch (error) {
            console.warn('Logout button not found, skipping logout.');
        }
    });

    test('Client can see list of events', ({ given, when, then }) => {
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
            await driver.wait(until.elementLocated(By.id('events')), 10000); // Increased timeout
        });

        when('the client navigates to the Client Homepage', async () => {
            // Navigate to the client homepage
            await driver.get('http://127.0.0.1:3000/client');
        });

        then('the client should see a list of events', async () => {
            // Verify that the page contains event information
            const eventsTable = await driver.findElement(By.id('events'));
            const eventsText = await eventsTable.getText();

            expect(eventsText).toContain("Miu Miu Event");

            // Verify the statuses
            expect(eventsText).toContain("REVIEWING");
        });

    }, 15000); // Set a specific timeout for this test
});