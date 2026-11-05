import { expect, test } from "@playwright/test";
import path from "node:path";
import { readSheet } from "read-excel-file/node";

interface CheckoutTestCase {
  testCaseName: string;
  username: string;
  password: string;
  itemsToAdd: string[];
  firstName: string;
  lastName: string;
  postalCode: string;
  expectedResult: string;
}

const workbookPath = path.resolve(
  __dirname,
  "../test-data/saucedemo-test-cases.xlsx",
);

function normalizeHeader(header: string): string {
  return header
    .trim()
    .toLowerCase()
    .replace(/[{}]/g, "")
    .replace(/_/g, " ");
}

async function loadTestCases(): Promise<CheckoutTestCase[]> {
  const rows = await readSheet(workbookPath, "TestCases");

  const columns = new Map<string, number>();
  const headerRow = rows[0] ?? [];
  headerRow.forEach((cell, columnIndex) => {
    const header = normalizeHeader(cell == null ? "" : String(cell));
    if (header && columns.has(header)) {
      throw new Error(`Duplicate Excel column header: "${header}".`);
    }
    if (header) {
      columns.set(header, columnIndex);
    }
  });

  const requiredHeaders = [
    "testcase name",
    "username",
    "password",
    "items to add",
    "first name",
    "last name",
    "postal code",
    "expected result",
  ];
  const missingHeaders = requiredHeaders.filter(
    (header) => !columns.has(header),
  );
  if (missingHeaders.length > 0) {
    throw new Error(
      `Missing required Excel column(s): ${missingHeaders.join(", ")}.`,
    );
  }

  const cases: CheckoutTestCase[] = [];
  rows.slice(1).forEach((row, index) => {
    const rowNumber = index + 2;
    const value = (header: string): string => {
      const columnIndex = columns.get(header);
      if (columnIndex === undefined) {
        throw new Error(`Missing required Excel column: "${header}".`);
      }
      const cell = row[columnIndex];
      return cell == null ? "" : String(cell).trim();
    };
    const testCaseName = value("testcase name");
    if (!testCaseName) {
      return;
    }

    const itemsToAdd = value("items to add")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const testCase: CheckoutTestCase = {
      testCaseName,
      username: value("username"),
      password: value("password"),
      itemsToAdd,
      firstName: value("first name"),
      lastName: value("last name"),
      postalCode: value("postal code"),
      expectedResult: value("expected result"),
    };

    const missingValues = [
      ["username", testCase.username],
      ["password", testCase.password],
      ["items_to_add", testCase.itemsToAdd.join(", ")],
      ["first_name", testCase.firstName],
      ["last_name", testCase.lastName],
      ["postal_code", testCase.postalCode],
      ["expected_result", testCase.expectedResult],
    ]
      .filter(([, fieldValue]) => !fieldValue)
      .map(([header]) => header);
    if (missingValues.length > 0) {
      throw new Error(
        `Excel row ${rowNumber} (${testCaseName}) is missing: ${missingValues.join(", ")}.`,
      );
    }

    cases.push(testCase);
  });

  if (cases.length === 0) {
    throw new Error("The TestCases worksheet does not contain any test cases.");
  }

  return cases;
}

test("Saucedemo checkout cases from Excel", async ({ browser }) => {
  const testCases = await loadTestCases();

  for (const testCase of testCases) {
    await test.step(testCase.testCaseName, async () => {
      const context = await browser.newContext();
      try {
        const page = await context.newPage();
        await page.goto("https://www.saucedemo.com/");
        await page.locator('[data-test="username"]').fill(testCase.username);
        await page.locator('[data-test="password"]').fill(testCase.password);
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL(/inventory\.html/);

        for (const itemName of testCase.itemsToAdd) {
          const item = page
            .locator(".inventory_item")
            .filter({ has: page.getByText(itemName, { exact: true }) });
          await expect(item).toHaveCount(1);
          await item.getByRole("button", { name: "Add to cart" }).click();
        }

        await page.locator('[data-test="shopping-cart-link"]').click();
        await expect(page.locator(".cart_item")).toHaveCount(
          testCase.itemsToAdd.length,
        );
        await page.locator('[data-test="checkout"]').click();
        await page.locator('[data-test="firstName"]').fill(testCase.firstName);
        await page.locator('[data-test="lastName"]').fill(testCase.lastName);
        await page.locator('[data-test="postalCode"]').fill(testCase.postalCode);
        await page.locator('[data-test="continue"]').click();
        await page.locator('[data-test="finish"]').click();

        await expect(page).toHaveURL(/checkout-complete\.html/);
        await expect(page.locator('[data-test="complete-header"]')).toHaveText(
          testCase.expectedResult,
        );
      } finally {
        await context.close();
      }
    });
  }
});