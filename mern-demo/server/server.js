const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Student = require('./models/Student');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log(' Đã kết nối MongoDB Atlas thành công'))
  .catch((err) => console.error('Lỗi kết nối MongoDB:', err));

// Test API (Câu 22)
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Backend đang hoạt động!' });
});

// Câu 36: GET /api/students - Lấy danh sách tất cả sinh viên
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Câu 37: POST /api/students - Thêm sinh viên mới
app.post('/api/students', async (req, res) => {
  try {
    const { studentId, name, email } = req.body;
    const newStudent = await Student.create({ studentId, name, email });
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Câu 38: PUT /api/students/:id - Cập nhật thông tin sinh viên theo _id
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
    }
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Câu 39: DELETE /api/students/:id - Xóa sinh viên theo _id
app.delete('/api/students/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
    }
    res.status(200).json({ message: 'Đã xóa sinh viên thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Khởi động Server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});