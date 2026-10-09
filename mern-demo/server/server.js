// const dns = require('dns');
// dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Student = require('./models/Student');

const app = express();
const PORT = process.env.PORT || 5000;

// ========================================
// CORS - Cho phép Frontend gọi Backend
// ========================================

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Cho phép request không có origin
    // (ví dụ Postman, curl)
    if (!origin) {
      return callback(null, true);
    }

    // Cho phép các origin nằm trong danh sách
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Từ chối origin không được phép
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());

// ========================================
// Kết nối MongoDB Atlas
// ========================================

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Đã kết nối MongoDB Atlas thành công'))
  .catch((err) => console.error('Lỗi kết nối MongoDB:', err));

// ========================================
// Test API - Câu 22
// ========================================

app.get('/api/hello', (req, res) => {
  res.json({
    message: 'Backend đang hoạt động!'
  });
});

// ========================================
// GET /api/students - Câu 36
// Lấy danh sách tất cả sinh viên
// ========================================

app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// ========================================
// POST /api/students - Câu 37
// Thêm sinh viên mới
// ========================================

app.post('/api/students', async (req, res) => {
  try {
    const { studentId, name, email } = req.body;

    const newStudent = await Student.create({
      studentId,
      name,
      email
    });

    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

// ========================================
// PUT /api/students/:id - Câu 38
// Cập nhật sinh viên
// ========================================

app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        message: 'Không tìm thấy sinh viên'
      });
    }

    res.status(200).json(updatedStudent);

  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

// ========================================
// DELETE /api/students/:id - Câu 39
// Xóa sinh viên
// ========================================

app.delete('/api/students/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(
      req.params.id
    );

    if (!deletedStudent) {
      return res.status(404).json({
        message: 'Không tìm thấy sinh viên'
      });
    }

    res.status(200).json({
      message: 'Đã xóa sinh viên thành công'
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});


// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date(),
        uptime: process.uptime()
    });
});
// ========================================
// Khởi động Server
// ========================================
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend phiên bản 1.2 - Auto Deploy thành công - Port ${PORT}`);
});