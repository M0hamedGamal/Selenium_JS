const {By, Builder, until} = require("selenium-webdriver");

async function example() {
    const searchString = "اسلام صبحي";
    let driver = await new Builder().forBrowser("chrome").build();

    driver.manage().window().maximize();

    await driver.get("https://youtube.com/");

    await driver.sleep(2000)

    await driver.findElement(By.xpath('//input[@id="search"]')).sendKeys(searchString);

    await driver.sleep(2000)

    await driver.findElement(By.xpath('//form[@id="search-form"]')).submit()

    await driver.sleep(2000)

    await driver.findElement(By.xpath('//*[@id="dismissible"]/ytd-thumbnail')).click();

    await driver.sleep(2000)

    await driver.findElement(By.className('ytp-fullscreen-button ytp-button')).click();

    const skipAdsYoutubeBtn = await driver.findElement(By.className('ytp-ad-skip-button ytp-button'));
    await driver.wait(until.elementIsVisible(skipAdsYoutubeBtn), 14000);
    await driver.wait(until.elementIsEnabled(skipAdsYoutubeBtn), 14000);
    await skipAdsYoutubeBtn.click();
}

example();
