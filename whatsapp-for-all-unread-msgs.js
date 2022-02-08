const { By, Builder, until, Key } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const chromedriver = require("chromedriver");

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

async function example() {
  const arrMsg = ["You deleted this message"];

  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(
      new chrome.Options()
        .detachDriver(true) // Keep the browser openning after the code is end.
        .excludeSwitches(["enable-logging"]) // Avoid some errors.
        .addArguments("--user-data-dir=chrome-data") // Auto save session after scanning whatsapp qr code [In this case you need to scan qr code once & then he'll remember you.]
    )
    .build();

  driver.manage().window().maximize();

  await driver.get("https://web.whatsapp.com/");

  await driver.sleep(5000);

  let isDone = false;

  while (!isDone) {
    await driver
      .findElements(By.xpath("//span[contains(@aria-label, 'unread message')]"))
      .then(async (elms) => {
        if (elms.length > 0) {
          elms[0].click();

          await driver
            .wait(
              until.elementLocated(By.xpath('//div[@title="Type a message"]')),
              3000
            )
            .then((el) => {
              el.sendKeys(arrMsg[0]);
              el.sendKeys(Key.RETURN);
            });

          await driver.sleep(2000);
        } else {
          isDone = true;
        }
      });
  }
}

example();
