import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';
import chrome from 'selenium-webdriver/chrome.js';

import fs from 'fs';
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import page_login from '../pages/page_login.js';



describe('Saucedemo Test', function () {
    let driver;

    beforeEach(async function () {
        let options = new chrome.Options();
        options.addArguments("--headless");

        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        await driver.get('https://www.saucedemo.com/');
    });

    afterEach(async function () {
        await driver.quit();
    });

    it('Sukses Login', async function(){

        //Locator, bisa ambil dari POM 
        let inputUsernamePOM = await driver.findElement(page_login.inputUsername)
        let inputPassword = await driver.findElement(page_login.inputPassword)
        let buttonLogin = await driver.findElement(By.className('submit-button btn_action'))
        

        //Action atau logic
        await inputUsernamePOM.sendKeys('standard_user')
        await inputPassword.sendKeys('secret_sauce')
        await buttonLogin.click()

        //screenshot
        let ss_full = await driver.takeScreenshot()
        fs.writeFileSync("images/img-1.png", Buffer.from(ss_full, "base64"))

        //Assert atau validasi
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

    it('Cek Visual Halaman Login', async function(){

        //screenshot current
        let images = await driver.takeScreenshot();
        let imgBuffer = Buffer.from(images, "base64");
        fs.writeFileSync("current.png", imgBuffer);

        //ambil baseline untuk komparasi, jadikan baseline jika belum ada
        if (!fs.existsSync("baseline.png")){
            fs.copyFileSync("current.png", "baseline.png");
            console.log("Baseline image saved");
        }

        //compare baseline dengan current
        let img1 = PNG.sync.read(fs.readFileSync("baseline.png"))
        let img2 = PNG.sync.read(fs.readFileSync("current.png"))
        let { width, height } = img1;
        let diff = new PNG({width, height});

        let numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });

        fs.writeFileSync("diff.png", PNG.sync.write(diff))

        if (numDiffPixels > 0) {
            console.log('Ada beda gambar, beda pixel: ${numDiffPixels}')
        } else {
            console.log("Gambar sesuai")
        }

    });

});