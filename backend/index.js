const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware สำหรับจัดการ JSON และ CORS
app.use(cors());
app.use(express.json());

// เชื่อมต่อ MongoDB (อ้างอิงจาก username/password ใน docker-compose)
const MONGO_URI = 'mongodb://admin:password123@localhost:27017/myproject?authSource=admin';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// --- 1. สร้าง Schema & Model (สมมติเป็นระบบจัดการ "นักเรียน") ---
const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true }, // รหัสนักศึกษา
  name: { type: String, required: true }, // ชื่อ
  major: { type: String, required: true }, // สาขาวิชา
  gpa: { type: Number, required: true }, // เกรดเฉลี่ย
}, { timestamps: true }); // เพิ่ม createdAt, updatedAt ให้อัตโนมัติ

const Student = mongoose.model('Student', studentSchema);

// --- 2. สร้าง CRUD Routes ---

// Route ทดสอบ
app.get('/', (req, res) => {
  res.send('Backend API is running!');
});

// [C]REATE: เพิ่มข้อมูลนักเรียน
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// [R]EAD: ดึงข้อมูลนักเรียนทั้งหมด
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// [U]PDATE: แก้ไขข้อมูลนักเรียนตาม ID
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } // ให้ส่งคืนข้อมูลที่อัปเดตแล้ว
    );
    res.status(200).json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// [D]ELETE: ลบข้อมูลนักเรียน
app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
