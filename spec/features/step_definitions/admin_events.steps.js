import { defineFeature, loadFeature } from "jest-cucumber";
import { Builder, By, Capabilities, until } from "selenium-webdriver";
import axios  from "axios";

const feature = loadFeature("spec/features/AdminEvents.feature");

// driver setup
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

    const eventsInDatabase = (given, and) => {
        given('you are logged in with the following credentials:', async (data) => {
            await driver.get('http://127.0.0.1:3000/home');
            // set email in the loginEmail input field
            await driver.findElement(By.name('loginEmail')).sendKeys(data[0]['Email']);
            // set password in the loginPassword input field
            await driver.findElement(By.name('loginPassword')).sendKeys(data[0]['Password']);
            // click the login button
            await driver.findElement(By.id('login')).click();

            // wait for the page to load
            await driver.wait(until.elementLocated(By.id('events')), 10000);
        });

        and('the following events exist:', async (data) => { 
            axios.post("/admin/events", {
                form_id: "form001",
                title: data[0]['Event title'],
                description: data[0]['Event description'],
                location: data[0]['Location'],
                statename: data[0]['State'],
                eventdate: data[0]['Date'],
                category: data[0]['Category'], 
                is_paid_event: data[0]['Paid']
            }).then((response) => {
                console.log(response);
            }).catch((error) => {
                console.log(error);
            });
        });
    }

    test('Event information displayed', ({ given, when, then, and }) => {
        eventsInDatabase(given, and);

        given('the user navigates to the Admin Homepage', async () => {
            await driver.get('http://127.0.0.1:3000/admin');
        });

        when(/^the user presses the event "(.*)"$/, async (eventName) => {
            await driver.findElement(By.linkText(eventName)).click();
        });

        then(/^the user should see "(.*)"$/, async (text) => {
            expect(await driver.getPageSource()).toContain(text);
        });

        and(/^the user should see "(.*)"$/, async (text) => {
            expect(await driver.getPageSource()).toContain(text);
        });

        and(/^the user should see "(.*)"$/, async (text) => {
            expect(await driver.getPageSource()).toContain(text);
        });

        and(/^the user should see "(.*)"$/, async (text) => {
            expect(await driver.getPageSource()).toContain(text);
        });

    });

    test('Change event status', ({ given, when, then, and }) => {
        eventsInDatabase(given, and);

        given(/^the user is on the homepage for "(.*)"$/, async (eventName) => {
            await driver.findElement(By.linkText(eventName)).click();
        });

        when(/^the user presses "(.*)"$/, async (buttonName) => {
            // await driver.findElement(By.linkText(buttonName)).click();
            await driver.findElement(By.xpath(`//button[text()='${buttonName}']`)).click();
        });

        // then(/^the user should see the popup "(.*)"$/, async (text) => {
        //     let alert = await driver.switchTo().alert();
        //     expect(await alert.getText()).toContain(text);
        // });
    });
});
