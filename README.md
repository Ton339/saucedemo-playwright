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
│   └── saucedemo.spec.ts   # ไฟล์สคริปต์ทดสอบหลัก
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