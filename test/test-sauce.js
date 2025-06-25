const {Builder, By, until} = require('selenium-webdriver')
const assert = require('assert');
const { title } = require('process');
const chrome = require('selenium-webdriver/chrome')

describe('Saucedemo Test', function () {
    let driver;

    beforeEach(async function () {
        options = new chrome.Options();
        options.addArguments("--headless");

        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        await driver.get('https://www.saucedemo.com/');
    });

    afterEach(async function () {
        await driver.quit();
    });

    it('Sukses Login', async function(){
        let inputUsername = await driver.findElement(By.css('[data-test="username"]'))
        let inputPassword = await driver.findElement(By.xpath('//*[@data-test="password"]'))
        let buttonLogin = await driver.findElement(By.className('submit-button btn_action'))
        await inputUsername.sendKeys('standard_user')
        await inputPassword.sendKeys('secret_sauce')
        await buttonLogin.click()

        let buttonChart = await driver.findElement(By.xpath('//*[@id="shopping_cart_container"]'))
        await buttonChart.isDisplayed();

    });

    it('Descending Sort', async function(){
        let inputUsername = await driver.findElement(By.css('[data-test="username"]'))
        let inputPassword = await driver.findElement(By.xpath('//*[@data-test="password"]'))
        let buttonLogin = await driver.findElement(By.className('submit-button btn_action'))
        await inputUsername.sendKeys('standard_user')
        await inputPassword.sendKeys('secret_sauce')
        await buttonLogin.click()

        let fiturSort = await driver.findElement(By.css('[data-test="product-sort-container"'))
        await fiturSort.click()

        let sortDescending = await driver.findElement(By.xpath('//*[@id="header_container"]/div[2]/div/span/select/option[2]'))
        await sortDescending.click()

        let activeOption = await driver.findElement(By.css('[data-test="active-option"'))
        let activeText = await activeOption.getText()
        assert.strictEqual(activeText, 'Name (Z to A)')

    });

});