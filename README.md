# Saucedemo Playwright E2E Testing Project

โปรเจกต์นี้เป็นการทดสอบระบบแบบ End-to-End (E2E) บนเว็บไซต์ [Saucedemo](https://www.saucedemo.com) ด้วย **Playwright** ร่วมกับ **TypeScript** โดยครอบคลุมกระบวนการตั้งแต่ Login, การเรียงลำดับสินค้า (Sorting Inspection), การเลือกสินค้า (Multi-Item Selection), การตรวจสอบตะกร้าสินค้า (Cart Validation), การคำนวณราคาสินค้าและภาษีอัตโนมัติ (Dynamic Calculation Verification) ตลอดจนการยืนยันคำสั่งซื้อสำเร็จ

---

## 🛠️ ความต้องการเริ่มต้น (Prerequisites)

- **Node.js**: เวอร์ชัน 18 ขึ้นไป
- **npm**: ติดตั้งพร้อมกับ Node.js

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
saucedemo-playwright/
├── tests/
│   ├── saucedemo.spec.ts   # ไฟล์สคริปต์ทดสอบหลัก
│   └── saucedemo-excel.spec.ts # เทสต์ Checkout ที่อ่านข้อมูลจาก Excel
├── test-data/
│   └── saucedemo-test-cases.xlsx # ข้อมูลทดสอบสำหรับ checkout
├── playwright.config.ts    # ไฟล์ตั้งค่าหลักของ Playwright
├── package.json            # ไฟล์จัดการ Dependencies และ Scripts
└── README.md               # เอกสารคู่มือโปรเจกต์
```

---

## 🚀 ขั้นตอนการติดตั้ง (Installation)

1. คลอนหรือดาวน์โหลดโปรเจกต์นี้ลงเครื่องของคุณ
2. ติดตั้ง Dependencies ของ Node.js:
   ```bash
   npm install
   ```
3. ติดตั้ง Browser สำหรับ Playwright:
   ```bash
   npx playwright install
   ```
   *(หมายเหตุ: หากต้องการติดตั้งเฉพาะ Chromium เพื่อประหยัดพื้นที่ดิสก์ สามารถใช้คำสั่ง `npx playwright install chromium`)*

---

## 🧪 การรันคำสั่งทดสอบ (Running Tests)

### 1. รันการทดสอบทั้งหมด (Headless Mode)
รันการทดสอบเบื้องหลังแบบไม่เปิดหน้าต่างเบราว์เซอร์:
```bash
npx playwright test
```

### 2. รันแบบเปิดหน้าต่างเบราว์เซอร์ (Headed Mode)
```bash
npx playwright test --headed
```

### 3. รันเฉพาะไฟล์สคริปต์ที่กำหนด
```bash
npx playwright test tests/saucedemo.spec.ts --headed
```

### 4. เปิดดูรายงานผลการทดสอบ (HTML Report)
เมื่อรันเทสต์เสร็จแล้ว สามารถเปิดดูผลลัพธ์ฉบับสมบูรณ์ได้ด้วยคำสั่ง:
```bash
npx playwright show-report
```

### 5. เขียนและรันทดสอบ Checkout จาก Excel

เทสต์นี้อ่านข้อมูลจากไฟล์
`test-data/saucedemo-test-cases.xlsx` โดยแต่ละแถวข้อมูลใช้ทดสอบการเข้าสู่ระบบ
เลือกสินค้า และทำ Checkout หนึ่งรอบ ไฟล์ตัวอย่างมีข้อมูลผู้ใช้สาธิตของ SauceDemo
ให้แล้ว สามารถแก้ไขแถวตัวอย่างหรือเพิ่มแถวใหม่ได้

#### 5.1 เปิดและบันทึกไฟล์

1. เปิด `test-data/saucedemo-test-cases.xlsx` ด้วย Microsoft Excel หรือโปรแกรมที่แก้ไขไฟล์ `.xlsx` ได้
2. ใช้ worksheet ชื่อ `TestCases` (อย่าเปลี่ยนชื่อหรือลบชีตนี้)
3. เก็บแถวแรกไว้เป็นหัวคอลัมน์ และกรอกข้อมูลทดสอบตั้งแต่แถวที่ 2 เป็นต้นไป
4. เพิ่มหนึ่งแถวต่อหนึ่งกรณีทดสอบ และบันทึกไฟล์เป็น `.xlsx` ที่ตำแหน่งเดิม
   อย่าบันทึกทับเป็น `.csv` หรือเปลี่ยนชื่อไฟล์ เพราะเทสต์จะอ่านไฟล์ตามตำแหน่งนี้

#### 5.2 กำหนดหัวคอลัมน์

ใช้หัวคอลัมน์ทั้ง 8 ช่องต่อไปนี้:

| ลำดับ | หัวคอลัมน์ | ข้อมูลที่ต้องกรอก |
|---|---|---|
| A | `testcase name` | ชื่อกรณีทดสอบ ใช้แสดงเป็นขั้นตอนในรายงาน Playwright |
| B | `username` | ชื่อผู้ใช้ SauceDemo |
| C | `password` | รหัสผ่าน SauceDemo |
| D | `items_to_add` | ชื่อสินค้าอย่างน้อย 1 รายการ คั่นหลายรายการด้วย comma (`,`) |
| E | `first_name` | ชื่อผู้ซื้อ |
| F | `last_name` | นามสกุลผู้ซื้อ |
| G | `postal_code` | รหัสไปรษณีย์ |
| H | `expected_result` | ข้อความยืนยันที่คาดว่าจะเห็นหลังสั่งซื้อสำเร็จ |

หัวคอลัมน์ไม่แยกตัวพิมพ์เล็ก/ใหญ่ และยอมรับ `_` แทนช่องว่าง รวมถึงมี `{}` ครอบชื่อได้
ตัวอย่างเช่น `items_to_add`, `{items_to_add}` และ `items to add` ใช้ได้เหมือนกัน
แต่ต้องมีหัวคอลัมน์ครบทุกช่อง และห้ามมีหัวคอลัมน์ซ้ำ

#### 5.3 ตัวอย่างข้อมูลใน Excel

| testcase name | username | password | items_to_add | first_name | last_name | postal_code | expected_result |
|---|---|---|---|---|---|---|---|
| Checkout with two products | standard_user | secret_sauce | Sauce Labs Backpack, Sauce Labs Onesie | Test | User | 10220 | Thank you for your order! |

ข้อควรทราบเมื่อกรอกข้อมูล:

- ชื่อสินค้าใน `items_to_add` ต้องตรงกับชื่อที่แสดงบนหน้า SauceDemo รวมถึงตัวพิมพ์ใหญ่/เล็ก
  ตัวอย่างเช่น `Sauce Labs Backpack` หรือ `Sauce Labs Onesie`
- หากเลือกสินค้าหลายชิ้น ให้คั่นด้วย comma เช่น
  `Sauce Labs Backpack, Sauce Labs Bike Light` อย่าใส่ comma ต่อท้ายรายการสุดท้าย
- `expected_result` ในเทสต์นี้คือข้อความบนหน้าสั่งซื้อสำเร็จ โดยตัวอย่างที่ถูกต้องคือ
  `Thank you for your order!`
- ทุกช่องข้อมูลของแถวทดสอบต้องมีค่า หากไม่มี `testcase name` แถวนั้นจะถูกข้าม
  แต่หากมีชื่อเคสแล้วช่องอื่นว่าง เทสต์จะแจ้งหมายเลขแถวที่ต้องแก้ไข
- ถ้ารหัสไปรษณีย์มีเลขศูนย์นำหน้า ให้ตั้งรูปแบบเซลล์เป็น **Text** ก่อนกรอก
  เพื่อป้องกัน Excel ตัดเลขศูนย์ทิ้ง

#### 5.4 รันเทสต์จากไฟล์ Excel

เปิด Terminal ที่โฟลเดอร์โปรเจกต์ แล้วรัน:

```bash
npx playwright test tests/saucedemo-excel.spec.ts
```

รันเฉพาะ Chromium ได้ด้วย:

```bash
npx playwright test tests/saucedemo-excel.spec.ts --project=chromium
```

ผลรายงานจะแสดงชื่อ `testcase name` ของแต่ละแถวเป็นขั้นตอนย่อยภายในเทสต์
`Saucedemo checkout cases from Excel` หากมีแถวใดล้มเหลว ให้ดูชื่อขั้นตอนและข้อความ error
ในรายงานเพื่อระบุกรณีทดสอบนั้น

#### 5.5 ปัญหาที่พบบ่อย

- **หา worksheet ไม่พบ:** ตรวจว่าชื่อชีตเป็น `TestCases` ตรงตามนี้
- **แจ้งว่าหัวคอลัมน์ขาด:** ตรวจข้อความในแถวแรกว่ามีหัวคอลัมน์ครบทั้ง 8 ช่อง
- **แจ้งข้อมูลในแถวไม่ครบ:** เติมค่าทุกช่องของแถวนั้น โดยเฉพาะ `items_to_add` และ `expected_result`
- **หา item ไม่พบ:** ตรวจชื่อสินค้าและการสะกดให้ตรงกับชื่อสินค้าบนหน้า SauceDemo
- **เข้าสู่ระบบไม่สำเร็จ:** ใช้บัญชีทดสอบที่เข้าใช้งานได้ เช่น `standard_user` / `secret_sauce`
- **ไฟล์ Excel เปิดไม่ได้:** ตรวจว่ายังเป็นไฟล์ `.xlsx` และใช้ชื่อ
  `saucedemo-test-cases.xlsx` อยู่ในโฟลเดอร์ `test-data`

---

## 💡 คำสั่งสำคัญสำหรับการพัฒนา (Useful Commands)

### การบันทึกสคริปต์อัตโนมัติด้วย CodeGen
เปิดเครื่องมือ Record & Playback เพื่อสร้างโค้ดอัตโนมัติและบันทึกลงไฟล์โดยตรง:
```bash
npx playwright codegen https://www.saucedemo.com -o tests/my-test.spec.ts
```

### การแก้ปัญหาและการ Debugging
- **เปิดโหมด Debug (Inspector):**
  ```bash
  npx playwright test --debug
  ```
- **เปิดดู Playwright Trace Viewer เมื่อเกิดข้อผิดพลาด:**
  ```bash
  npx playwright show-trace test-results/<folder-name>/trace.zip
  ```

---

## 📋 รายละเอียดเคสการทดสอบ (Test Scenarios Covered)

1. **Authentication:**
   - เข้าสู่ระบบด้วย `standard_user`
2. **Dynamic Sorting & Inspection:**
   - เปลี่ยนการเรียงลำดับสินค้าเป็น "Price (high to low)"
   - ตรวจสอบว่าราคาสินค้าชิ้นแรกสุดมีค่ามากกว่าหรือเท่ากับสินค้าชิ้นถัดมา ($Price_1 \ge Price_2$)
3. **Multi-Item Selection:**
   - เลือกเพิ่มสินค้าที่มีราคา **แพงที่สุด** และ **ถูกที่สุด** ลงในตะกร้า
   - ตรวจสอบสัญลักษณ์ Badge บนตะกร้าสินค้าว่าแสดงจำนวนเป็น `2`
4. **Cart Navigation & Validation:**
   - เข้าสู่หน้า Cart และตรวจสอบว่ามีสินค้า 2 ชิ้นตามที่เลือกไว้
5. **Dynamic Calculation Verification:**
   - กรอกข้อมูลผู้ซื้อในขั้นตอน Checkout
   - ดึงราคา Item Total จากหน้า Overview มาคำนวณเปรียบเทียบกับผลรวมจริง
   - คำนวณภาษี ($Tax = Subtotal \times 0.08$)
   - ตรวจสอบสมการราคาสินค้าและภาษีว่าตรงตามสูตร ($Subtotal + Tax = Total$)
6. **Order Completion & URL Verification:**
   - กด Finish แล้วยืนยัน URL หน้าจบรายการ (`https://www.saucedemo.com/checkout-complete.html`)
   - ตรวจสอบข้อความแจ้งเตือนสำเร็จ `Thank you for your order!`