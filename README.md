# 📖 Silk Reader — Blog CRUD Demo

ระบบจัดการบล็อกแบบ Full-Stack ที่ใช้ **MongoDB**, **Express.js**, **React + Vite** และ **Tailwind CSS**  
สร้างขึ้นเพื่อทดสอบการทำงาน CRUD และระบบ Authorization บน NoSQL Database

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Database | MongoDB (รันผ่าน Docker) |
| Database UI | Mongo Express |
| Backend | Node.js + Express.js + Mongoose + bcrypt |
| Frontend | React 18 + Vite + Tailwind CSS |

---

## 📁 โครงสร้างโปรเจค

```
DatabaseProject/
├── docker-compose.yml        ← Config สำหรับรัน MongoDB + Mongo Express
├── backend/
│   ├── index.js              ← Express server, Mongoose models, CRUD routes, Auth
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.jsx           ← Router + Protected Routes
    │   ├── main.jsx
    │   ├── index.css         ← Neomorphic design system
    │   ├── components/
    │   │   └── NavItem.jsx   ← Shared sidebar component
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Feed.jsx      ← หน้าแสดงบล็อกทั้งหมด
    │   │   ├── BlogPost.jsx  ← หน้าอ่านบล็อก
    │   │   └── CreateBlog.jsx ← หน้าสร้าง/แก้ไขบล็อก
    │   └── utils/
    │       └── auth.js       ← Helper จัดการ localStorage session
    ├── index.html
    └── package.json
```

---

## 🗄️ โครงสร้าง Database (MongoDB Collections)

### Collection: `users`

| Field | Type | หมายเหตุ |
|-------|------|---------|
| `_id` | ObjectId | Auto-generated |
| `name` | String | ชื่อผู้ใช้ (required) |
| `email` | String | unique, lowercase (required) |
| `password` | String | bcrypt hash (required) |
| `createdAt` | Date | Auto |
| `updatedAt` | Date | Auto |

### Collection: `blogs`

| Field | Type | หมายเหตุ |
|-------|------|---------|
| `_id` | ObjectId | Auto-generated |
| `title` | String | ชื่อบล็อก (required) |
| `author` | String | ชื่อผู้เขียน (required) |
| `authorId` | ObjectId | อ้างอิงไปยัง `users._id` |
| `category` | String | หมวดหมู่ (required) |
| `content` | String | เนื้อหาบล็อก (required) |
| `excerpt` | String | บทสรุปย่อ (required) |
| `coverImage` | String | URL รูปปก (optional) |
| `status` | String | `"published"` หรือ `"draft"` |
| `likedBy` | [ObjectId] | รายการ user ที่กด Like (ref → users) |
| `createdAt` | Date | Auto |
| `updatedAt` | Date | Auto |

---

## ✅ สิ่งที่ต้องติดตั้งก่อน

| โปรแกรม | เวอร์ชัน | ลิงก์ |
|--------|---------|-------|
| Docker Desktop | ล่าสุด | https://www.docker.com/products/docker-desktop |
| Node.js | v18 ขึ้นไป | https://nodejs.org |

---

## 🚀 วิธีติดตั้งและรันโปรเจค

> ต้องเปิด **3 Terminal** พร้อมกัน

---

### Terminal 1 — เริ่ม Database (MongoDB)

> เปิด Docker Desktop ก่อน แล้วรัน:

```bash
cd DatabaseProject
docker-compose up -d
```

Docker จะสร้าง container 2 ตัว:
- **MongoDB** → `localhost:27017`
- **Mongo Express** (UI ดู Database) → http://localhost:8081

หยุด Database (อันนี้ทำตอนเลิกใช้นะ):
```bash
docker-compose down
```

---

### Terminal 2 — เริ่ม Backend

```bash
cd DatabaseProject/backend
npm install        # ครั้งแรกเท่านั้น
npm run dev
```

รอจนเห็น:
```
✅ Connected to MongoDB successfully!
🚀 Server is running on http://localhost:3000
```

---

### Terminal 3 — เริ่ม Frontend

```bash
cd DatabaseProject/frontend
npm install        # ครั้งแรกเท่านั้น
npm run dev
```

รอจนเห็น:
```
  Local:   http://localhost:5173/
```

---

### 🌐 URL ทั้งหมด

| Service | URL |
|---------|-----|
| Frontend (React App) | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| Mongo Express (ดู DB) | http://localhost:8081 |

---

## 🔌 API Endpoints

### Auth

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | `{ name, email, password }` | สมัครสมาชิก (hash password ด้วย bcrypt) |
| `POST` | `/api/auth/login` | `{ email, password }` | เข้าสู่ระบบ |

### Users (CRUD)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | ดึง user ทั้งหมด |
| `GET` | `/api/users/:id` | ดึง user รายคน |
| `PUT` | `/api/users/:id` | แก้ไขข้อมูล user |
| `DELETE` | `/api/users/:id` | ลบ user |

### Blogs (CRUD)

| Method | Endpoint | Header ที่ต้องใช้ | Description |
|--------|----------|-----------------|-------------|
| `GET` | `/api/blogs` | — | ดึงบล็อกทั้งหมด |
| `GET` | `/api/blogs/:id` | — | ดึงบล็อกรายการเดียว |
| `POST` | `/api/blogs` | `X-User-Id` | สร้างบล็อกใหม่ |
| `PUT` | `/api/blogs/:id` | `X-User-Id` (เจ้าของเท่านั้น) | แก้ไขบล็อก |
| `DELETE` | `/api/blogs/:id` | `X-User-Id` (เจ้าของเท่านั้น) | ลบบล็อก |
| `PATCH` | `/api/blogs/:id/like` | `X-User-Id` | Toggle Like (กด Like / Unlike) |

### ตัวอย่าง Request Body — สร้างบล็อก

```json
{
  "title": "ชื่อบล็อก",
  "author": "ชื่อผู้เขียน",
  "category": "Tech",
  "content": "เนื้อหาบล็อก...",
  "excerpt": "บทสรุปสั้นๆ",
  "coverImage": "https://...",
  "status": "published"
}
```

> `authorId` และ `likedBy` จะถูก backend ใส่ให้อัตโนมัติ ไม่ต้องส่งมาใน body

---

## 🔐 ระบบ Authorization

- ผู้ใช้ที่ **เป็นเจ้าของบล็อก** เท่านั้นที่สามารถ **แก้ไข / ลบ** บล็อกของตัวเองได้
- Backend ตรวจสอบ `X-User-Id` header กับ `blog.authorId` — ถ้าไม่ตรงจะได้รับ **403 Forbidden**
- Frontend ซ่อนปุ่ม Edit/Delete สำหรับบล็อกที่ไม่ใช่ของตัวเอง

### ทดสอบ Authorization

1. สมัครสมาชิกเป็น **User A** → สร้างบล็อก
2. Logout → สมัครสมาชิกเป็น **User B**
3. เข้าไปดูบล็อกของ User A → จะเห็นปุ่ม **"Read only"** แทน Edit/Delete
4. ลองเรียก API โดยตรงโดยไม่มี `X-User-Id` → ได้รับ **403 Forbidden**

---

## 🗄️ Database Credentials (จาก docker-compose)

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `password123` |
| Connection URI | `mongodb://admin:password123@localhost:27017/` |
| Database Name | `silkreader` |

> ⚠️ สำหรับโปรเจคทดสอบเท่านั้น — ห้ามใช้ credentials นี้ใน Production

---

## 🔑 Credentials สำหรับ Mongo Express

เข้าได้เลยที่ http://localhost:8081 (ไม่ต้อง Login เพราะปิด Basic Auth ไว้)

---

## 💡 หมายเหตุ

- `npm install` รันแค่ **ครั้งแรก** หรือเมื่อมีการเพิ่ม dependency ใหม่
- รหัสผ่านของผู้ใช้จะถูก **hash ด้วย bcrypt** ก่อนเก็บลง MongoDB เสมอ
- Session ผู้ใช้เก็บใน **localStorage** (ไม่มี JWT — เหมาะสำหรับการทดสอบ CRUD เท่านั้น)
- ถ้าต้องการ reset database ทั้งหมด ให้รัน `docker-compose down -v` แล้วเริ่มใหม่
