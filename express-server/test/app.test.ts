import { Page, chromium } from "playwright";
import "../app";

describe.skip("Login", () => {
  let page: Page;

  beforeAll(async () => {
    const browser = await chromium.launch();
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
        (usersEmail as HTMLInputElement).value = "Julia";
        (password as HTMLInputElement).value = "Julia";
      }

      const submit = document.querySelector("[type=submit]");

      if (submit) {
        (submit as HTMLInputElement).click();
      }
    });
  });

});
