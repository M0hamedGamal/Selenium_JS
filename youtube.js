const { By, Builder, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const chromedriver = require("chromedriver");

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

async function example() {
  const searchString = "We don't talk about brouno";
  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(
      new chrome.Options()
        .detachDriver(true) // Keep the browser openning after the code is end.
        .excludeSwitches(["enable-logging"]) // Avoid some errors.
    )
    .build();

  driver.manage().window().maximize();

  await driver.get("https://youtube.com/");

  await driver.sleep(2000);

  await driver
    .findElement(By.xpath('//input[@id="search"]'))
    .sendKeys(searchString);

  await driver.sleep(2000);

  await driver.findElement(By.xpath('//form[@id="search-form"]')).submit();

  await driver.sleep(2000);

  await driver
    .findElement(By.xpath('//*[@id="dismissible"]/ytd-thumbnail'))
    .click();

  await driver.sleep(2000);

  await driver
    .findElement(By.className("ytp-fullscreen-button ytp-button"))
    .click();

  try {
    await driver.sleep(3000);
    const skipAdsYoutubeBtn = await driver.findElement(
      By.className("ytp-ad-skip-button ytp-button")
    );
    await driver.wait(until.elementIsVisible(skipAdsYoutubeBtn), 14000);
    await driver.wait(until.elementIsEnabled(skipAdsYoutubeBtn), 14000);
    await skipAdsYoutubeBtn.click();
  } catch (error) {
    // Try to skip ads again.
    const skipAdsYoutubeBtn = await driver.findElement(
      By.className("ytp-ad-skip-button ytp-button")
    );
    await driver.wait(until.elementIsVisible(skipAdsYoutubeBtn), 14000);
    await driver.wait(until.elementIsEnabled(skipAdsYoutubeBtn), 14000);
    await skipAdsYoutubeBtn.click();
  }
}

example();
