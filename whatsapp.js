const { By, Builder, until, Key } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const chromedriver = require("chromedriver");

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

async function example() {
  const arrMsg = [
    "First Message!",
    "Second Message!",
    "Third Message!",
    "Fourth Message!",
  ];

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

  await driver
    .wait(
      until.elementLocated(By.xpath('//span[@title="Name of your friend"]')),
      3000
    )
    .then((el) => {
      el.click();
    });

  await driver
    .wait(
      until.elementLocated(By.xpath('//div[@title="Type a message"]')),
      2000
    )
    .then((el) => {
      el.sendKeys(arrMsg[0]);
      el.sendKeys(Key.RETURN);
    });

  await driver.sleep(3000);

  let lastMsg;
  let newMsg;
  let done = false;
  let index = 0;

  while (!done) {
    try {
      lastMsg = await driver
        .findElement(
          By.xpath(
            "//*[@id='main']/div[3]/div/div[2]/div[3]/div[last()]/div/div/div/div[1]/div/span[1]/span"
          )
        )
        .getText();

      console.log("OUT ", lastMsg);

      if (lastMsg !== arrMsg[index] && index < 3) {
        index++;
        console.log("IN ", lastMsg);

        await driver
          .findElement(By.xpath('//div[@title="Type a message"]'))
          .then((el) => {
            el.sendKeys(arrMsg[index]);
            el.sendKeys(Key.RETURN);
          });
      } else if (index === 3) {
        done = true;
      }
    } catch (error) {
      console.log("There is an error!");
    }

    await driver.sleep(3000);
  }
}

example();
