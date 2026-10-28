import { test, expect } from "@playwright/test";

test("Saucedemo Checkout Flow with Dynamic Calculation", async ({ page }) => {
  // ---------------------------------------------------------
  // 1. Login
  // ---------------------------------------------------------
  await page.goto("https://www.saucedemo.com/");
  await page.locator('[data-test="username"]').fill("standard_user");
  await page.locator('[data-test="password"]').fill("secret_sauce");
  await page.locator('[data-test="login-button"]').click();

  // ---------------------------------------------------------
  // 2. Sorting Test & Dynamic Inspection
  // ---------------------------------------------------------
  // เลือกจัดเรียงจากแพงไปถูก
  await page
    .locator('[data-test="product-sort-container"]')
    .selectOption("hilo");

  // ดึงข้อความราคาของทุกสินค้ามาแปลงเป็นตัวเลข
  const priceElements = page.locator(".inventory_item_price");
  const priceTexts = await priceElements.allTextContents();
  const prices = priceTexts.map((text) => parseFloat(text.replace("$", "")));

  // ตรวจสอบว่าสินค้าชิ้นแรก >= สินค้าชิ้นที่สองจริง (hilo)
  expect(prices[0]).toBeGreaterThanOrEqual(prices[1]);

  // ---------------------------------------------------------
  // 3. Multi-Item Selection
  // ---------------------------------------------------------
  const addToCartButtons = page.locator(".btn_inventory");

  // เนื่องจากเรียงแพงไปถูก ชิ้นแรกคือแพงสุด ชิ้นสุดท้ายคือถูกสุด
  await addToCartButtons.first().click();
  await addToCartButtons.last().click();

  // ตรวจสอบ Badge ตะกร้าว่ามี 2 ชิ้น
  await expect(page.locator(".shopping_cart_badge")).toHaveText("2");

  // ---------------------------------------------------------
  // 4. Cart Navigation & Validation
  // ---------------------------------------------------------
  await page.locator(".shopping_cart_link").click();

  // ตรวจสอบว่าในหน้า Cart มีสินค้า 2 รายการ
  const cartItems = page.locator(".cart_item");
  await expect(cartItems).toHaveCount(2);

  // ---------------------------------------------------------
  // 5. Checkout & Calculation Verification
  // ---------------------------------------------------------
  await page.locator('[data-test="checkout"]').click();

  // กรอกข้อมูลผู้ซื้อ
  await page.locator('[data-test="firstName"]').fill("Test");
  await page.locator('[data-test="lastName"]').fill("User");
  await page.locator('[data-test="postalCode"]').fill("10220");
  await page.locator('[data-test="continue"]').click();

  // 💡 จุดที่แก้ไข: รอให้ราคาสินค้าชิ้นแรกปรากฏขึ้นมาก่อน (Auto-wait)
  await expect(page.locator(".inventory_item_price").first()).toBeVisible();

  // ดึงราคาสินค้าแต่ละชิ้นในหน้า Overview มาบวกกัน
  const overviewPrices = await page
    .locator(".inventory_item_price")
    .allTextContents();
  const calculatedSum = overviewPrices.reduce(
    (sum, text) => sum + parseFloat(text.replace("$", "")),
    0,
  );

  // ดึง Item Total ที่ระบบแสดงมาเปรียบเทียบ
  const itemTotalText = await page
    .locator(".summary_subtotal_label")
    .textContent();
  const displayedItemTotal = parseFloat(
    itemTotalText!.replace("Item total: $", ""),
  );
  expect(calculatedSum).toBeCloseTo(displayedItemTotal, 2);

  // คำนวณภาษี (Tax 8%) และตรวจสอบ
  const expectedTax = calculatedSum * 0.08;
  const taxText = await page.locator(".summary_tax_label").textContent();
  const displayedTax = parseFloat(taxText!.replace("Tax: $", ""));
  expect(displayedTax).toBeCloseTo(expectedTax, 2);

  // ตรวจสอบ Total รวม (Item Total + Tax)
  const totalText = await page.locator(".summary_total_label").textContent();
  const displayedTotal = parseFloat(totalText!.replace("Total: $", ""));
  expect(displayedTotal).toBeCloseTo(displayedItemTotal + displayedTax, 2);
});
