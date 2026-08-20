import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const API_URL = 'https://scaling-space-broccoli-x5v7j54xxgj6f4g4-5000.app.github.dev/api/students';

  // Lấy danh sách sinh viên
  const loadStudents = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setStudents(data));
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Thêm sinh viên
  const handleSubmit = (e) => {
    e.preventDefault();
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
  };

  // Xóa sinh viên
  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => loadStudents());
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Quản Lý Sinh Viên</h2>

      {/* Form thêm sinh viên */}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="MSSV"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
        <input
          placeholder="Họ tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Thêm</button>
      </form>

      {/* Danh sách sinh viên */}
      <table border="1" style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>MSSV</th>
            <th>Họ Tên</th>
            <th>Email</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((sv) => (
            <tr key={sv._id}>
              <td>{sv.studentId}</td>
              <td>{sv.name}</td>
              <td>{sv.email}</td>
              <td>
                <button onClick={() => handleDelete(sv._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;