import { Page, chromium, Browser } from "playwright";
// import "../app";

describe("Login", () => {
  let page: Page;
  let browser: Browser;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  it('should display "Login" text ', async () => {
    await page.goto("http://34.233.164.139");
    const title = await page.getByText("Login");
    expect(title).not.toBeNull();
  });

  it("should successfully login", async () => {
    await page.goto("http://34.233.164.139");
    await page.evaluate(() => {
      const usersEmail = document.querySelector("[name=usersEmail]");
      const password = document.querySelector("[name=password]");
      if (usersEmail && password) {
        (usersEmail as HTMLInputElement).value = "beyourdetective@gmail.com";
        (password as HTMLInputElement).value = "123abc";
      }

      const submit = document.querySelector("[type=submit]");

      if (submit) {
        (submit as HTMLInputElement).click();
      }
    });
  });

  afterAll(async () => {
    await browser.close();
    console.log("test ended")
  });

});
