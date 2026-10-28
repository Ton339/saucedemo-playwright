# Playwright Cheat Sheet (คู่มือคำสั่งใช้บ่อย)

คู่มือรวบรวมคำสั่งสำคัญสำหรับการทดสอบด้วย **Playwright (TypeScript / JavaScript)** ครอบคลุมทั้งคำสั่งบรรทัดคำสั่ง (CLI) และ API คำสั่งหลักในการเขียนสคริปต์

---

## 1. คำสั่ง CLI (Command Line Interface)

### 📦 การติดตั้งและการจัดการ Browser
```bash
# ติดตั้ง Playwright และสร้างโปรเจกต์ใหม่
npm init playwright@latest

# ติดตั้ง เบราว์เซอร์ ทั้งหมด (Chromium, Firefox, WebKit)
npx playwright install

# ติดตั้งเฉพาะ Chromium (ประหยัดพื้นที่ดิสก์)
npx playwright install chromium

# ตรวจสอบเวอร์ชันของ Playwright
npx playwright --version
```

### 🧪 การรันคำสั่งทดสอบ (Run Tests)
```bash
# รันไฟล์เทสต์ทั้งหมดแบบ Headless (ทำงานเบื้องหลัง)
npx playwright test

# รันแบบเปิดหน้าต่างเบราว์เซอร์จริง (Headed Mode)
npx playwright test --headed

# รันเฉพาะไฟล์ที่ต้องการ
npx playwright test tests/saucedemo.spec.ts

# รันเฉพาะ Test Case ที่มีชื่อตรงกับข้อความที่ระบุ
npx playwright test -g "Login"

# รันเฉพาะใน Browser Chromium
npx playwright test --project=chromium

# รันผ่าน UI Mode (Interactive Runner & Inspector)
npx playwright test --ui

# รันแบบ Debug ทีละบรรทัด
npx playwright test --debug
```

### 🛠️ เครื่องมือช่วยเขียนโค้ดและดูรายงานผล (Tools & Reports)
```bash
# บันทึกสคริปต์การทำงานอัตโนมัติ (CodeGen)
npx playwright codegen https://www.saucedemo.com

# บันทึก สคริปต์ ลงไฟล์โดยตรงเมื่อกดปิดเบราว์เซอร์
npx playwright codegen https://www.saucedemo.com -o tests/my-test.spec.ts

# เปิดดูรายงานผลการทดสอบ HTML Report
npx playwright show-report

# เปิดดู Trace Viewer จากไฟล์ Trace
npx playwright show-trace test-results/trace.zip
```

---

## 2. คำสั่งสคริปต์ Playwright (API Cheat Sheet)

### 🌐 การนำทางหน้าเว็บ (Navigation)
```typescript
// เปิดไปยัง URL ที่ต้องการ
await page.goto('https://example.com');

// รีโหลดหน้าปัจจุบัน
await page.reload();

// การย้อนกลับ / ถัดไป
await page.goBack();
await page.goForward();
```

### 🎯 การเลือกตำแหน่ง Element (Locators)
```typescript
// ค้นหาด้วย CSS Selector หรือ ID
page.locator('.class-name');
page.locator('#element-id');

// ค้นหาด้วย Role (แนะนำตามมาตรฐาน Playwright Best Practices)
page.getByRole('button', { name: 'Submit' });
page.getByRole('link', { name: 'Login' });

// ค้นหาจาก ข้อความ บนหน้าจอ
page.getByText('Welcome Back');

// ค้นหาจาก Placeholder / TestID
page.getByPlaceholder('Enter your username');
page.getByTestId('submit-button');

// การเลือกจากลำดับรายการ (Index)
locator.first();        // เลือกตัวแรก
locator.last();         // เลือกตัวสุดท้าย
locator.nth(2);         // เลือกตัวที่ 3 (Index เริ่มจาก 0)
```

### 🖱️ การปฏิสัมพันธ์กับ Element (Actions)
```typescript
// การคลิก
await locator.click();
await locator.dblclick(); // ดับเบิลคลิก

// การพิมพ์ข้อความ
await locator.fill('ข้อความที่ต้องการพิมพ์');
await locator.clear();  // ล้างค่าข้อความเดิม

// การกดปุ่มคีย์บอร์ด
await locator.press('Enter');
await locator.press('Control+A');

// การจัดการ Checkbox / Radio
await locator.check();
await locator.uncheck();

// การเลือก Dropdown (<select>)
await locator.selectOption('option_value');

// การเลื่อนเมาส์ไปวาง (Hover)
await locator.hover();
```

### 📊 การดึงข้อมูลจาก Element (Data Extraction)
```typescript
// ดึงข้อความเดี่ยว
const text = await locator.textContent();

// ดึงข้อความจากหลาย Element เป็น Array (string[])
const allTexts = await locator.allTextContents();

// ดึงค่า Attribute เช่น href หรือ src
const linkUrl = await locator.getAttribute('href');

// ดึงค่าปัจจุบันจากช่อง Input
const inputVal = await locator.inputValue();

// นับจำนวน Element ที่พบ
const count = await locator.count();
```

### ✅ การตรวจสอบผลลัพธ์ (Assertions)
```typescript
// ตรวจสอบ URL หน้าเว็บปัจจุบัน
await expect(page).toHaveURL('https://example.com/dashboard');

// ตรวจสอบการแสดงผล Element
await expect(locator).toBeVisible();
await expect(locator).toBeHidden();

// ตรวจสอบ ข้อความ
await expect(locator).toHaveText('ข้อความที่ถูกต้อง');
await expect(locator).toContainText('ข้อความบางส่วน');

// ตรวจสอบ จำนวนรายการ
await expect(locator).toHaveCount(5);

// ตรวจสอบ ตัวเลขทศนิยม (Dynamic Calculation)
expect(actualNumber).toBeCloseTo(expectedNumber, 2);
```

### ⏳ การรอการทำงาน (Waiting)
```typescript
// รอจนกว่า Element จะปรากฏ
await locator.waitFor({ state: 'visible' });

// รอจนกว่า URL จะเปลี่ยนไปตามทิศทางที่กำหนด
await page.waitForURL('**/checkout-complete.html');

// รอให้เครือข่ายหยุดนิ่ง (Network Idle)
await page.waitForLoadState('networkidle');
```