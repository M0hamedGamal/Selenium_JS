const { By, Builder, until, Key } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const chromedriver = require("chromedriver");

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

async function example() {
  const arrMsg = [
    "Message 1",
    "Message 2",
    "Message 3",
    "Message 4",
    "Message 5",
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
      until.elementLocated(
        By.xpath('//*[@id="side"]/div[1]/div/label/div/div[2]')
      ),
      10000
    )
    .then(async (el) => {
      el.sendKeys("Youssef");

      await driver
        .wait(until.elementLocated(By.xpath('//span[@title="Youssef"]')), 10000)
        .then((el) => {
          el.click();
        });
    });

  await driver
    .wait(
      until.elementLocated(By.xpath('//div[@title="Type a message"]')),
      10000
    )
    .then((el) => {
      el.sendKeys(arrMsg[0]);
      el.sendKeys(Key.RETURN);
    });

  await driver.sleep(3000);

  let lastMsg;
  let done = false;
  let index = 0;

  while (!done) {
    try {
      lastMsg = await driver
        .wait(
          until.elementLocated(
            By.xpath(
              "//div[@id='main']/div[3]/div/div[2]/div[@class='y8WcF']/div[last()]/div/div/div/div[1]/div/span[1]/span"
            )
          ),
          3000
        )
        .getText();
    } catch (e) {
      lastMsg = await driver
        .wait(
          until.elementLocated(
            By.xpath(
              "//div[@id='main']/div[3]/div/div[2]/div[@class='y8WcF']/div[last()]/div/div/div/div[1]/div[1]/div/div[1]/button"
            )
          ),
          3000
        )
        .click();
      arrMsg[index + 1] = "I'll reply your record when I get a free time.";
    }

    console.log("OUT ", lastMsg);

    if (lastMsg !== arrMsg[index] && index < arrMsg.length - 1) {
      index++;
      console.log("IN ", lastMsg);

      await driver
        .findElement(By.xpath('//div[@title="Type a message"]'))
        .then((el) => {
          el.sendKeys(arrMsg[index]);
          el.sendKeys(Key.RETURN);
        });
    } else if (index === arrMsg.length - 1) {
      done = true;
    }

    await driver.sleep(3000);
  }
}

example();
