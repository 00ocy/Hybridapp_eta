const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

// SQLite 데이터베이스 연결
const db = new sqlite3.Database('userDatabase.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

app.post('/signup', (req, res) => {
  const { lastName, firstName, email, password } = req.body;

  // 중복 이메일 검사
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
    if (err) {
      res.json({ status: 'error', message: err.message });
      return;
    }
    
    if (row) {
      res.json({ status: 'error', message: '이미 존재하는 이메일입니다.' });
    } else {
      // 사용자 데이터 저장
      db.run("INSERT INTO users (lastName, firstName, email, password) VALUES (?, ?, ?, ?)", [lastName, firstName, email, password], function(err) {
        if (err) {
          res.json({ status: 'error', message: err.message });
        } else {
          // 회원가입 성공시 리다이렉션 URL 포함하여 응답
          res.json({ status: 'success', message: '회원가입 성공!', redirectUrl: '/register_welcome.html' });
        }
      });
    }
  });
});

// 로그인 요청 처리
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // 데이터베이스에서 사용자 검색
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
    if (err) {
      res.json({ status: 'error', message: '로그인 중 오류가 발생했습니다.' });
    } else if (row && row.password === password) {
      // 비밀번호 일치 시 로그인 성공
      res.json({ status: 'success', message: '로그인 성공!' });
    } else {
      // 이메일 또는 비밀번호 불일치 시 로그인 실패
      res.json({ status: 'error', message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
