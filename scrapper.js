import { launch } from 'puppeteer';
import { getRandom } from 'random-useragent';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const usernameGrowatt = String(process.env.USERNAME_GROWATT || 'default_username');
const passwordGrowatt = String(process.env.PASSWORD_GROWATT || 'default_password');

(async () => {
    let browser;
    try {
        // Open Browser
        browser = await launch({ headless: false });
        const page = await browser.newPage();

        // Setup browser
        await page.setDefaultTimeout(30000); // Increase default timeout to 30 seconds
        await page.setViewport({ width: 1200, height: 800 });
        await page.setUserAgent(getRandom());

        // Navigate to the Growatt URL
        await page.goto("https://server.growatt.com/login", { waitUntil: 'networkidle2', timeout: 30000 });
        console.log('Page loaded');

        // Ensure login elements are loaded
        await page.waitForSelector('#val_loginAccount', { timeout: 10000 });
        console.log('Login account input loaded');
        await page.waitForSelector('#val_loginPwd', { timeout: 10000 });
        console.log('Login password input loaded');
        await page.waitForSelector('.loginB', { timeout: 10000 });
        console.log('Login button loaded');

        // Log the values to ensure they are correctly set
        console.log(`Username: ${usernameGrowatt}`);
        console.log(`Password: ${passwordGrowatt}`);

        // Fill in login credentials
        await page.type('#val_loginAccount', usernameGrowatt);
        await page.type('#val_loginPwd', passwordGrowatt);

        // Click on the login button
        await page.click('.loginB');

        // Wait for navigation to complete
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
        console.log('Navigation after login complete');

        // Get the innerHTML of the element
        const innerHTML = await page.evaluate(() => {
            const element = document.querySelector('i.tips.w');
            return element ? element.innerHTML : null;
        });

        console.log('Inner HTML:', innerHTML);


        // Perform actions on the logged-in page (e.g., extract data)
        // Replace with the actual selector that appears after login
        // await page.waitForSelector('#some_dashboard_element', { timeout: 10000 });

        console.log('Login successful and data extracted.');

    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        // Close Browser
        if (browser) {
            await browser.close();
        }
    }
})().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
