import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  // Login to the application  
  await page.goto("https://www.saucedemo.com/");
  await page.locator('[data-test="username"]').click();
  await page.locator('[data-test="username"]').fill("standard_user");
  await page.locator('[data-test="password"]').click();
  await page.locator('[data-test="password"]').fill("secret_sauce");
  await page.locator('[data-test="login-button"]').click();

  // Sorting Test & Dynamic Inspection
  await page
    .locator('[data-test="product-sort-container"]')
    .selectOption("hilo");

  await page.getByText("$49.99").click();
  await page.getByText("$7.99").click();
  await page
    .locator('[data-test="inventory-item-description"]')
    .first()
    .click();
  await page.locator('[data-test="inventory-item-description"]').nth(1).click();
  
  await page
    .locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]')
    .click();
  await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.getByText("1Sauce Labs OnesieRib snap").click();
  await page.getByText("1Sauce Labs OnesieRib snap").click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').click();
  await page.locator('[data-test="firstName"]').fill("Test");
  await page.locator('[data-test="lastName"]').click();
  await page.locator('[data-test="lastName"]').fill("User");
  await page.locator('[data-test="postalCode"]').click();
  await page.locator('[data-test="postalCode"]').fill("10220");
  await page.locator('[data-test="continue"]').click();
  await page.locator('[data-test="title"]').click();
  await page
    .locator("div")
    .filter({ hasText: /^\$49\.99$/ })
    .first()
    .click();
  await page
    .locator("div")
    .filter({ hasText: /^\$7\.99$/ })
    .first()
    .click();
  await page.locator('[data-test="total-label"]').click();
  await page.locator('[data-test="finish"]').click();
  await page.locator('[data-test="title"]').click();
  await page.locator('[data-test="complete-header"]').click();
});
