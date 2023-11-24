// 필요한 모듈들을 불러옵니다.
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();

// 정적 파일을 위한 경로 설정
app.use(express.static(path.join(__dirname, '..', 'public')));

// JSON 형태의 요청을 처리할 수 있도록 설정
app.use(express.json());

// SQLite 데이터베이스 연결
const db = new sqlite3.Database('userDatabase.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// 회원가입 처리
app.post('/signup', (req, res) => {
  // 요청에서 사용자 정보 추출
  const { lastName, firstName, email, password } = req.body;

  // 중복 이메일 검사
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
    if (err) {
      // 데이터베이스 오류 처리
      res.json({ status: 'error', message: err.message });
      return;
    }
    
    if (row) {
      // 중복 이메일 존재 시 에러 메시지 전송
      res.json({ status: 'error', message: '이미 존재하는 이메일입니다.' });
    } else {
      // 새 사용자 데이터 저장
      db.run("INSERT INTO users (lastName, firstName, email, password) VALUES (?, ?, ?, ?)", [lastName, firstName, email, password], function(err) {
        if (err) {
          // 데이터베이스 저장 오류 처리
          res.json({ status: 'error', message: err.message });
        } else {
          // 회원가입 성공 응답
          res.json({ status: 'success', message: '회원가입 성공!', redirectUrl: '/register_welcome.html' });
        }
      });
    }
  });
});

// 로그인 처리
app.post('/login', (req, res) => {
  // 요청에서 이메일과 비밀번호 추출
  const { email, password } = req.body;
  
  // 데이터베이스에서 사용자 검색
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
    if (err) {
      // 데이터베이스 오류 처리
      res.json({ status: 'error', message: '로그인 중 오류가 발생했습니다.' });
    } else if (row && row.password === password) {
      // 로그인 성공 응답
      res.json({ status: 'success', message: '로그인 성공!' });
    } else {
      // 로그인 실패 응답
      res.json({ status: 'error', message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }
  });
});

// 서버 시작 및 포트 설정
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
