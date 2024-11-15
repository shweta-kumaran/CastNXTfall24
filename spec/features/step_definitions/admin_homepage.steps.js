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

    afterEach(async () => {
        await driver.findElement(By.id('logoutBtn')).click();
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

    });

    // test('Successfully create new event', ({ given, when, then, and }) => {
    //     given('the user navigates to the Admin Homepage', async () => {
    //         let email = 'admin@example.com';
    //         let password = '123456qt';
    //         await driver.get('http://127.0.0.1:3000/home');
    //         await driver.findElement(By.name('loginEmail')).sendKeys(email);
    //         await driver.findElement(By.name('loginPassword')).sendKeys(password);
    //         await driver.findElement(By.id('login')).click();
    //         await driver.wait(until.elementLocated(By.id('events')), 10000);
    //         await driver.get('http://127.0.0.1:3000/admin');
    //     });

    //     when('the user presses "Create New Event"', async () => {
    //         await driver.findElement(By.id('createEvent')).click();
    //     });

    //     then('the user should be on the "Create New Event" page', async () => {
    //         expect(await driver.getCurrentUrl()).toContain('/admin/events/new');
    //     });

    //     when('the user fills in the form with valid information', async (data) => {            
    //         data.forEach(async (row) => {
    //             if (row['Field'] === 'Event title') {
    //                 await driver.findElement(By.name('title')).sendKeys(row['Value']);
    //             }
    //             if (row['Field'] === 'Event description') {
    //                 await driver.findElement(By.name('description')).sendKeys(row['Value']);
    //             }
    //             // if (row['Field'] === 'Date') {
    //             //     await driver.findElement(By.id('eventdate')).sendKeys(row['Value']);
    //             // }
    //             if (row['Field'] === 'State') {
    //                 let values = await driver.findElement(By.name('statename'))
    //                 values.sendKeys(row['Value']);
    //             }
    //             if (row['Field'] === 'Location') {
    //                 await driver.findElement(By.name('location')).sendKeys(row['Value']);
    //             }
    //             if (row['Field'] === 'Category') {
    //                 await driver.findElement(By.id('category-select')).sendKeys(row['Value']);
    //             }
    //             if (row['Field'] === 'Paid') {
    //                 await driver.findElement(By.name('is_paid_event')).sendKeys(row['Value']);
    //             }
    //         });
    //     });
        
    //     and('the user clicks on the "Create Event" button', async () => {
    //         await driver.findElement(By.id('createEvent')).click();
    //     });

        // then('the user should redirect to the Admin Homepage', async () => {
        //     expect(await driver.getCurrentUrl()).toContain('/admin');
        // });

        // and('the user should see "Miu Miu Event" in the list of events', async () => {
        //     expect(await driver.findElement(By.id('events')).getText()).toContain('Miu Miu Event');
        // });

        // and('the user should see "Status" as "ACCEPTING"', async () => {
        //     expect(await driver.findElement(By.id('events')).getText()).toContain('ACCEPTING');
        // });

        // and('the user should see "Category" as "Fashion"', async () => {         
        //     expect(await driver.findElement(By.id('events')).getText()).toContain('Fashion');
        // });
    // });

    test('Create new event with missing information', ({ given, when, then, and }) => {
        given('the user navigates to the Admin Homepage', async () => {
            let email = 'admin@example.com';
            let password = '123456qt';
            await driver.get('http://127.0.0.1:3000/home');
            await driver.findElement(By.name('loginEmail')).sendKeys(email);
            await driver.findElement(By.name('loginPassword')).sendKeys(password);
            await driver.findElement(By.id('login')).click();
            await driver.wait(until.elementLocated(By.id('events')), 10000);
            await driver.get('http://127.0.0.1:3000/admin');
        });

        when('the user presses "Create New Event"', async () => {
            await driver.findElement(By.id('createEvent')).click();
        });

        then('the user should be on the "Create New Event" page', async () => {
            expect(await driver.getCurrentUrl()).toContain('/admin/events/new');
        });

        when('the user fills in the form with missing information', async (data) => {            
            data.forEach(async (row) => {
                if (row['Field'] === 'Event title') {
                    await driver.findElement(By.name('title')).sendKeys(row['Value']);
                }
                if (row['Field'] === 'Event description') {
                    await driver.findElement(By.name('description')).sendKeys(row['Value']);
                }
            });
        });
        
        and('the user clicks on the "Create Event" button', async () => {
            await driver.findElement(By.id('createEvent')).click();
        });

        then(/^the user should see the alert "(.*)"$/, async (alert) => {
            expect(await driver.findElement(By.className('MuiAlert-message')).getText()).toContain(alert);
        });
    });
});
