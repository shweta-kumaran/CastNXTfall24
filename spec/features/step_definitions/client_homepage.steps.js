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

    // afterEach(async () => {
    //     await driver.findElement(By.id('logoutBtn')).click();
    // });

    test('the client should see a table of events and corresponding status', ({ given, when, then }) => {
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
            await driver.wait(until.elementLocated(By.id('events'))); // Increased timeout
        });

        when('the client navigates to the Client Homepage', async () => {
            // Navigate to the client homepage
            await driver.get('http://127.0.0.1:3000/client');
        });

        then('the client should see a list of events', async () => {
            // Wait for the events table to be located
            const eventsTable = await driver.wait(until.elementLocated(By.css('table'))); // Locate the table
            const rows = await eventsTable.findElements(By.css('tr'));

            // Check if the table has the expected number of rows (including header)
            expect(rows.length).toBeGreaterThan(1);

            // Check the content of the first data row
            const firstRow = await rows[1].findElements(By.css('td'));
            const eventName = await firstRow[0].getText();
            const eventStatus = await firstRow[1].getText();

            expect(eventName).toBe("Miu Miu");
            expect(eventStatus).toBe("ACCEPTING");
        });

    });  // Set a specific timeout for this test
});