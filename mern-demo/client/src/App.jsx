import { useState, useEffect } from 'react';
import './App.css';


function App() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState(null);

  const API_URL = 'http://localhost:5000/api/students';

  // Lấy danh sách sinh viên
  const loadStudents = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setStudents(data));
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Bắt đầu sửa thông tin
  const handleEdit = (sv) => {
    setEditingId(sv._id);
    setStudentId(sv.studentId);
    setName(sv.name);
    setEmail(sv.email);
  };

  // Hủy sửa
  const handleCancelEdit = () => {
    setEditingId(null);
    setStudentId('');
    setName('');
    setEmail('');
  };

  // Thêm hoặc Cập nhật sinh viên
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      // Cập nhật sinh viên
      fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, name, email })
      }).then(() => {
        handleCancelEdit();
        loadStudents();
      });
    } else {
      // Thêm mới sinh viên
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, name, email })
      }).then(() => {
        setStudentId('');
        setName('');
        setEmail('');
        loadStudents();
      });
    }
  };

  // Xóa sinh viên
  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => {
        if (editingId === id) {
          handleCancelEdit();
        }
        loadStudents();
      });
  };

  return (
    <div className="container">
      <h2 className="title">Quản Lý Sinh Viên</h2>

      {/* Form thêm/sửa sinh viên */}
      <form className="form-container" onSubmit={handleSubmit}>
        <input
          className="input-field"
          placeholder="MSSV"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
        <input
          className="input-field"
          placeholder="Họ tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="input-field"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="btn-submit" type="submit">
          {editingId ? 'Cập Nhật' : 'Thêm Mới'}
        </button>
        {editingId && (
          <button className="btn-cancel" type="button" onClick={handleCancelEdit}>
            Hủy
          </button>
        )}
      </form>

      {/* Danh sách sinh viên */}
      <div className="table-container">
        <table className="student-table">
          <thead>
            <tr>
              <th>MSSV</th>
              <th>Họ Tên</th>
              <th>Email</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((sv) => (
                <tr key={sv._id}>
                  <td>{sv.studentId}</td>
                  <td>{sv.name}</td>
                  <td>{sv.email}</td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn-edit" onClick={() => handleEdit(sv)}>Sửa</button>
                      <button className="btn-delete" onClick={() => handleDelete(sv._id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                  Chưa có dữ liệu sinh viên
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;