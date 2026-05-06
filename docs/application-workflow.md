# คำอธิบายการทำงานของแอปพลิเคชัน Silk Reader

## ภาพรวมของระบบ

Silk Reader เป็นระบบจัดการบล็อก (Blog Management System) แบบ Full-Stack ที่ออกแบบมาเพื่อทดสอบการทำงาน CRUD (Create, Read, Update, Delete) บนฐานข้อมูล NoSQL (MongoDB) ระบบประกอบด้วย 3 ส่วนหลัก ดังนี้

| ส่วนประกอบ | เทคโนโลยี | หน้าที่ |
|-----------|-----------|--------|
| Frontend | React + Vite + Tailwind CSS | แสดงผลหน้าเว็บและรับข้อมูลจากผู้ใช้ |
| Backend | Node.js + Express.js + Mongoose | จัดการ API และ Business Logic |
| Database | MongoDB (ผ่าน Docker) | จัดเก็บข้อมูลผู้ใช้และบล็อก |

### แผนภาพสถาปัตยกรรม (Architecture Diagram)

```
┌─────────────────┐     HTTP Request      ┌─────────────────┐     Mongoose      ┌─────────────────┐
│                 │    (REST API)         │                 │    (ODM)          │                 │
│    Frontend     │ ──────────────────►   │    Backend      │ ──────────────►   │    MongoDB      │
│    React App    │                       │    Express.js   │                   │    Database     │
│    port:5173    │ ◄──────────────────   │    port:3000    │ ◄──────────────   │    port:27017   │
│                 │     JSON Response     │                 │    Documents      │                 │
└─────────────────┘                       └─────────────────┘                   └─────────────────┘
```

---

## 1. ระบบ Authentication (การยืนยันตัวตน)

### 1.1 การสมัครสมาชิก (Register)

**หน้าที่:** สร้างบัญชีผู้ใช้ใหม่ในระบบ

**ขั้นตอนการทำงาน:**
1. ผู้ใช้กรอกข้อมูล: ชื่อ (Name), อีเมล (Email), รหัสผ่าน (Password)
2. Frontend ส่ง HTTP POST request ไปที่ `/api/auth/register`
3. Backend ตรวจสอบว่าอีเมลนี้มีอยู่ในระบบหรือยัง
   - ถ้ามีอยู่แล้ว → ส่ง Error 409 (Conflict) กลับไป
   - ถ้ายังไม่มี → ดำเนินการต่อ
4. Backend ใช้ `bcrypt` ทำการ hash รหัสผ่านด้วย salt rounds = 10
5. บันทึกข้อมูลผู้ใช้ลงใน Collection `users` ของ MongoDB
6. ส่งข้อมูลผู้ใช้ (ไม่รวม password) กลับไปยัง Frontend
7. Frontend เก็บข้อมูลผู้ใช้ไว้ใน localStorage และนำทางไปยังหน้า Feed

**ข้อมูลที่ถูกบันทึกลง MongoDB:**
```json
{
  "_id": "ObjectId (auto-generated)",
  "name": "ชื่อผู้ใช้",
  "email": "email@example.com",
  "password": "$2b$10$... (bcrypt hash)",
  "createdAt": "2025-05-06T...",
  "updatedAt": "2025-05-06T..."
}
```

### 1.2 การเข้าสู่ระบบ (Login)

**หน้าที่:** ยืนยันตัวตนของผู้ใช้ที่มีบัญชีอยู่แล้ว

**ขั้นตอนการทำงาน:**
1. ผู้ใช้กรอก Email และ Password
2. Frontend ส่ง HTTP POST request ไปที่ `/api/auth/login`
3. Backend ค้นหาผู้ใช้จาก Email ใน Collection `users`
   - ไม่พบ → ส่ง Error 404 (Not Found)
4. Backend ใช้ `bcrypt.compare()` เปรียบเทียบ password ที่กรอกมากับ hash ที่เก็บไว้
   - ไม่ตรง → ส่ง Error 401 (Unauthorized)
   - ตรง → ส่งข้อมูลผู้ใช้กลับไป
5. Frontend เก็บข้อมูลผู้ใช้ไว้ใน localStorage และนำทางไปยังหน้า Feed

### 1.3 การรีเซ็ตรหัสผ่าน (Forgot Password)

**หน้าที่:** ให้ผู้ใช้ตั้งรหัสผ่านใหม่เมื่อลืมรหัสผ่านเดิม

**ขั้นตอนการทำงาน:**
1. ผู้ใช้กดลิงก์ "Forgot password?" ในหน้า Login
2. ผู้ใช้กรอก Email และ รหัสผ่านใหม่
3. Frontend ส่ง HTTP POST request ไปที่ `/api/auth/reset-password`
4. Backend ค้นหาผู้ใช้จาก Email และ hash รหัสผ่านใหม่ด้วย bcrypt
5. อัพเดตรหัสผ่านใหม่ลงใน MongoDB
6. Frontend แสดงข้อความสำเร็จ และนำทางกลับไปยังหน้า Login

### 1.4 การออกจากระบบ (Logout)

**หน้าที่:** ล้างข้อมูล session ของผู้ใช้

**ขั้นตอนการทำงาน:**
1. ผู้ใช้กดปุ่ม Logout ที่ Sidebar หรือ Navigation Bar
2. Frontend ลบข้อมูลผู้ใช้ออกจาก localStorage
3. นำทางกลับไปยังหน้า Login

### 1.5 การป้องกันเส้นทาง (Protected Routes)

**หน้าที่:** ป้องกันไม่ให้ผู้ที่ไม่ได้ล็อกอินเข้าถึงหน้าต่าง ๆ ของระบบ

**การทำงาน:**
- ทุกครั้งที่ผู้ใช้พยายามเข้าถึงหน้า Feed, BlogPost, CreateBlog หรือ EditBlog ระบบจะตรวจสอบ localStorage
- ถ้าไม่พบข้อมูลผู้ใช้ → redirect ไปยังหน้า Login โดยอัตโนมัติ
- ถ้าพบข้อมูลผู้ใช้ → อนุญาตให้เข้าถึงหน้าที่ร้องขอ

---

## 2. ระบบจัดการบล็อก (Blog CRUD Operations)

### 2.1 การสร้างบล็อกใหม่ (Create)

**หน้าที่:** ให้ผู้ใช้สร้างบล็อกโพสต์ใหม่

**ขั้นตอนการทำงาน:**
1. ผู้ใช้กดปุ่ม "New Post" ที่หน้า Feed หรือกดเมนู "Write Blog" ที่ Sidebar
2. ระบบแสดงฟอร์มสำหรับกรอกข้อมูล ประกอบด้วย:
   - Title (ชื่อบล็อก) — required
   - Author (ชื่อผู้เขียน) — pre-filled จากชื่อผู้ใช้ที่ล็อกอิน
   - Category (หมวดหมู่) — เลือกจากรายการ: Tech, Lifestyle, Design, Architecture, Food, Travel, Other
   - Status (สถานะ) — Published หรือ Draft
   - Excerpt (บทสรุปย่อ) — required
   - Content (เนื้อหา) — required
   - Cover Image URL (รูปปก) — optional
3. ผู้ใช้กดปุ่ม "Publish Post"
4. Frontend ส่ง HTTP POST request ไปที่ `/api/blogs` พร้อม Header `X-User-Id`
5. Backend ตรวจสอบว่ามี `X-User-Id` header หรือไม่
   - ไม่มี → ส่ง Error 401 (Unauthorized)
6. Backend สร้าง Document ใหม่ใน Collection `blogs` พร้อมผูก `authorId` กับ User ที่ล็อกอิน
7. ส่งข้อมูลบล็อกที่สร้างสำเร็จกลับไป
8. Frontend นำทางไปยังหน้าแสดงบล็อกที่เพิ่งสร้าง

**ข้อมูลที่ถูกบันทึกลง MongoDB:**
```json
{
  "_id": "ObjectId (auto-generated)",
  "title": "ชื่อบล็อก",
  "author": "ชื่อผู้เขียน",
  "authorId": "ObjectId (อ้างอิงไปยัง users._id)",
  "category": "Tech",
  "content": "เนื้อหาบล็อก...",
  "excerpt": "บทสรุปสั้น ๆ",
  "coverImage": "https://...",
  "status": "published",
  "likedBy": [],
  "createdAt": "2025-05-06T...",
  "updatedAt": "2025-05-06T..."
}
```

### 2.2 การอ่านบล็อก (Read)

**หน้าที่:** แสดงรายการบล็อกทั้งหมดและรายละเอียดของบล็อกแต่ละรายการ

#### การแสดงรายการบล็อกทั้งหมด (Feed)
1. Frontend ส่ง HTTP GET request ไปที่ `/api/blogs`
2. Backend ดึงข้อมูลบล็อกทั้งหมดจาก MongoDB เรียงตาม `createdAt` จากใหม่ไปเก่า
3. Frontend แสดงผลเป็น Card Grid แบ่งเป็น 2 กลุ่ม:
   - **Published** — บล็อกที่เผยแพร่แล้ว
   - **Drafts** — บล็อกฉบับร่าง
4. ผู้ใช้สามารถกรองตามหมวดหมู่ (Category Filter) ได้

#### การแสดงรายละเอียดบล็อก (BlogPost)
1. ผู้ใช้กดที่ Card ของบล็อกที่ต้องการ
2. Frontend ส่ง HTTP GET request ไปที่ `/api/blogs/:id`
3. Backend ดึงข้อมูลบล็อกจาก MongoDB ตาม `_id`
   - ไม่พบ → ส่ง Error 404
4. Frontend แสดงรายละเอียดบล็อก ประกอบด้วย: ชื่อบล็อก, หมวดหมู่, ชื่อผู้เขียน, วันที่สร้าง, รูปปก, เนื้อหา, จำนวน Like

### 2.3 การแก้ไขบล็อก (Update)

**หน้าที่:** ให้เจ้าของบล็อกแก้ไขเนื้อหาที่เผยแพร่แล้ว

**ขั้นตอนการทำงาน:**
1. ผู้ใช้กดปุ่ม "Edit" (แสดงเฉพาะเจ้าของบล็อกเท่านั้น)
2. ระบบโหลดข้อมูลบล็อกเดิมจาก API มาแสดงในฟอร์ม
3. ผู้ใช้แก้ไขข้อมูลที่ต้องการ
4. กดปุ่ม "Save Changes"
5. Frontend ส่ง HTTP PUT request ไปที่ `/api/blogs/:id` พร้อม Header `X-User-Id`
6. Backend ตรวจสอบ Authorization:
   - เปรียบเทียบ `X-User-Id` กับ `blog.authorId`
   - ไม่ตรง → ส่ง Error 403 (Forbidden)
   - ตรง → อัพเดตข้อมูลใน MongoDB
7. ส่งข้อมูลบล็อกที่อัพเดตแล้วกลับไป

### 2.4 การลบบล็อก (Delete)

**หน้าที่:** ให้เจ้าของบล็อกลบโพสต์ของตัวเอง

**ขั้นตอนการทำงาน:**
1. ผู้ใช้กดปุ่ม "Delete" (แสดงเฉพาะเจ้าของบล็อกเท่านั้น)
2. ระบบแสดง Confirmation Dialog ถามยืนยัน
3. ผู้ใช้กดยืนยัน
4. Frontend ส่ง HTTP DELETE request ไปที่ `/api/blogs/:id` พร้อม Header `X-User-Id`
5. Backend ตรวจสอบ Authorization เช่นเดียวกับการแก้ไข
   - ไม่ใช่เจ้าของ → ส่ง Error 403 (Forbidden)
   - เป็นเจ้าของ → ลบ Document ออกจาก MongoDB
6. Frontend นำทางกลับไปยังหน้า Feed

---

## 3. ระบบ Like / Unlike

**หน้าที่:** ให้ผู้ใช้แสดงความชื่นชอบต่อบล็อกโพสต์ โดยจำกัด 1 Like ต่อ 1 ผู้ใช้ต่อ 1 บล็อก

**การออกแบบฐานข้อมูล:**
- ใช้ field `likedBy` เป็น Array ของ ObjectId ที่อ้างอิงไปยัง Collection `users`
- ทำให้สามารถตรวจสอบได้ว่าผู้ใช้คนไหนเคย Like บล็อกนี้แล้วบ้าง

**ขั้นตอนการทำงาน:**
1. ผู้ใช้กดปุ่ม ❤️ Like ในหน้า BlogPost
2. Frontend ส่ง HTTP PATCH request ไปที่ `/api/blogs/:id/like` พร้อม Header `X-User-Id`
3. Backend ตรวจสอบว่า User ID อยู่ใน array `likedBy` หรือไม่:
   - **ยังไม่เคย Like** → เพิ่ม User ID เข้าไปใน array `likedBy` (Like)
   - **เคย Like แล้ว** → ลบ User ID ออกจาก array `likedBy` (Unlike)
4. บันทึกการเปลี่ยนแปลงลง MongoDB
5. ส่งข้อมูลบล็อกที่อัพเดตแล้วกลับไป
6. Frontend อัพเดต UI:
   - ปุ่ม Like เป็นสี ❤️ แดง ถ้าผู้ใช้ปัจจุบัน Like อยู่
   - ปุ่ม Like เป็นสีปกติ ถ้ายังไม่ได้ Like
   - จำนวน Like อัพเดตตามจำนวนสมาชิกใน array `likedBy`

---

## 4. ระบบ Authorization (การควบคุมสิทธิ์)

**หน้าที่:** ควบคุมไม่ให้ผู้ใช้ที่ไม่ใช่เจ้าของบล็อกทำการแก้ไขหรือลบโพสต์ของผู้อื่น

### การทำงานฝั่ง Backend
- ทุก request ที่เป็น PUT (แก้ไข) หรือ DELETE (ลบ) บล็อก จะต้องส่ง `X-User-Id` header มาด้วย
- Backend จะเปรียบเทียบ `X-User-Id` กับ `blog.authorId` ที่เก็บไว้ใน MongoDB
- ถ้าไม่ตรงกัน → ส่ง HTTP 403 (Forbidden) พร้อมข้อความ "Forbidden: you do not own this post"

### การทำงานฝั่ง Frontend
- เมื่อโหลดข้อมูลบล็อก ระบบจะเปรียบเทียบ `blog.authorId` กับ `currentUser._id` ที่เก็บใน localStorage
- **เป็นเจ้าของ:**
  - แสดงปุ่ม Edit และ Delete
  - แสดงป้าย "You" ที่ Blog Card ในหน้า Feed
  - แสดงป้าย "Your post" ในหน้า BlogPost
- **ไม่ใช่เจ้าของ:**
  - ซ่อนปุ่ม Edit และ Delete
  - แสดงป้าย "Read only" แทน
  - แสดงข้อความ "only the author can edit or delete this post"

---

## 5. ระบบ Session Management

**หน้าที่:** จัดการสถานะการล็อกอินของผู้ใช้

**การทำงาน:**
- ใช้ `localStorage` ของ Browser เก็บข้อมูลผู้ใช้ที่ล็อกอิน (ไม่รวม password)
- ข้อมูลที่เก็บ: `_id`, `name`, `email`, `createdAt`, `updatedAt`
- Key ที่ใช้เก็บ: `silkreader_user`
- Helper functions ใน `utils/auth.js`:

| Function | หน้าที่ |
|----------|--------|
| `getUser()` | ดึงข้อมูลผู้ใช้จาก localStorage |
| `setUser(user)` | บันทึกข้อมูลผู้ใช้ลง localStorage |
| `clearUser()` | ลบข้อมูลผู้ใช้ออกจาก localStorage |
| `isLoggedIn()` | ตรวจสอบว่ามีผู้ใช้ล็อกอินอยู่หรือไม่ |
| `authHeaders()` | สร้าง Headers object พร้อม `X-User-Id` สำหรับ API request |

---

## 6. ผังการทำงานรวม (Overall User Flow)

```
                    ┌──────────────┐
                    │   เริ่มต้น    │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
              ┌─────│  มีบัญชีแล้ว?  │─────┐
              │ ไม่  └──────────────┘  ใช่ │
              │                            │
       ┌──────▼───────┐            ┌──────▼───────┐
       │   Register    │            │    Login      │
       │ กรอก name,    │            │ กรอก email,   │
       │ email, password│           │ password      │
       └──────┬───────┘            └──────┬───────┘
              │                            │
              └────────────┬───────────────┘
                           │
                    ┌──────▼───────┐
                    │   Feed Page   │
                    │ แสดงบล็อกทั้งหมด │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──────┐ ┌──▼─────────┐ ┌▼────────────┐
       │  สร้างบล็อก  │ │  ดูบล็อก   │ │  กรองหมวดหมู่ │
       │  (Create)   │ │  (Read)    │ │  (Filter)    │
       └──────┬──────┘ └──┬─────────┘ └─────────────┘
              │           │
              │    ┌──────▼───────┐
              │    │  เจ้าของบล็อก? │
              │    └──────┬───────┘
              │     ใช่ ──┤── ไม่
              │    ┌──────▼──────┐ ┌────────────┐
              │    │ แก้ไข / ลบ  │ │  อ่านอย่างเดียว│
              │    │ (Update /   │ │  + Like     │
              │    │  Delete)    │ └────────────┘
              │    └─────────────┘
              │
       ┌──────▼───────┐
       │   Like /      │
       │   Unlike      │
       └──────────────┘
```

---

## 7. สรุป API ที่ใช้ในการทำงาน

| ฟีเจอร์ | HTTP Method | Endpoint | Header ที่จำเป็น |
|--------|-------------|----------|-----------------|
| สมัครสมาชิก | POST | `/api/auth/register` | — |
| เข้าสู่ระบบ | POST | `/api/auth/login` | — |
| รีเซ็ตรหัสผ่าน | POST | `/api/auth/reset-password` | — |
| ดึงบล็อกทั้งหมด | GET | `/api/blogs` | — |
| ดึงบล็อกรายการเดียว | GET | `/api/blogs/:id` | — |
| สร้างบล็อกใหม่ | POST | `/api/blogs` | `X-User-Id` |
| แก้ไขบล็อก | PUT | `/api/blogs/:id` | `X-User-Id` (เจ้าของเท่านั้น) |
| ลบบล็อก | DELETE | `/api/blogs/:id` | `X-User-Id` (เจ้าของเท่านั้น) |
| Like / Unlike | PATCH | `/api/blogs/:id/like` | `X-User-Id` |
| ดึงผู้ใช้ทั้งหมด | GET | `/api/users` | — |
| ดึงผู้ใช้รายคน | GET | `/api/users/:id` | — |
| แก้ไขผู้ใช้ | PUT | `/api/users/:id` | — |
| ลบผู้ใช้ | DELETE | `/api/users/:id` | — |
