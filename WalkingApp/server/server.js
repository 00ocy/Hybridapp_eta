/* -------------------------------------------------------------------------------------------- */
// 필요한 모듈들을 불러옵니다.
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const bodyParser = require('body-parser'); //걸음수 확인
/* -------------------------------------------------------------------------------------------- */

// 정적 파일을 위한 경로 설정
app.use(express.static(path.join(__dirname, '..', 'public')));
// JSON 형태의 요청을 처리할 수 있도록 설정
app.use(express.json());
/* -------------------------------------------------------------------------------------------- */

// SQLite 데이터베이스 연결
const db = new sqlite3.Database('userDatabase.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});
/* -------------------------------------------------------------------------------------------- */
// 구글 로그인 관련
const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis'); 

// Google OAuth2 클라이언트 생성
const CLIENT_ID = '510376110238-t3luckgljkbol5r017bsmgff84r4i5rk.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

// Google Identity Services(GIS) 라이브러리 초기화
const googleAuth = new google.auth.GoogleAuth({
  clientId: CLIENT_ID,
  scopes: ['openid', 'email', 'profile'], // 필요한 스코프 설정
});

/* -------------------------------------------------------------------------------------------- */
// 회원가입 처리
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
      // 일반 회원가입
      db.run("INSERT INTO users (lastName, firstName, email, password, loginType) VALUES (?, ?, ?, ?, 'email')", [lastName, firstName, email, password], function(err) {
        if (err) {
          res.json({ status: 'error', message: err.message });
        } else {
          res.json({ status: 'success', message: '회원가입 성공!', redirectUrl: '/register_welcome.html' });
        }
      });
    }
  });
});
/* -------------------------------------------------------------------------------------------- */

// 구글 로그인 처리
app.post('/google-login', async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const googleId = payload['sub'];
    const email = payload['email'];
    const name = payload['name']; // 성과 이름을 분리하거나, 하나의 이름 필드로 사용

    // 데이터베이스에서 사용자 검색
    db.get("SELECT * FROM users WHERE googleId = ?", [googleId], (err, row) => {
      if (err) {
        res.json({ status: 'error', message: '데이터베이스 오류' });
      } else if (row) {
        // 사용자가 이미 존재하는 경우
        res.json({ status: 'success', message: '로그인 성공!', user: row });
      } else {
        // 새 사용자 추가
        db.run("INSERT INTO users (email, name, googleId, loginType) VALUES (?, ?, ?, 'google')", [email, name, googleId], function(err) {
          if (err) {
            res.json({ status: 'error', message: '데이터베이스 저장 오류' });
          } else {
            // 새 사용자 추가 성공
            res.json({ status: 'success', message: '새 사용자 등록 및 로그인 성공!' });
          }
        });
      }
    });
  } catch (error) {
    res.json({ status: 'error', message: '로그인 중 오류가 발생했습니다.' });
  }
});

/* -------------------------------------------------------------------------------------------- */

// 서버 시작 및 포트 설정
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});














































































































































































//home 화면 만보기 만들기
// 사용자의 걸음 수 데이터를 저장하는 객체
let userSteps = {};

// 걸음 수 데이터를 저장하는 라우트
app.post('/steps', (req, res) => {
  const { userId, steps } = req.body;

  // 사용자 ID를 기반으로 데이터 저장
  if(userId && steps) {
      userSteps[userId] = (userSteps[userId] || 0) + steps;
      res.status(200).send({ message: 'Steps updated successfully' });
  } else {
      res.status(400).send({ message: 'Invalid data' });
  }
});

// 특정 사용자의 걸음 수 데이터를 조회하는 라우트
app.get('/steps/:userId', (req, res) => {
  const userId = req.params.userId;

  if(userSteps[userId] !== undefined) {
      res.status(200).send({ userId: userId, steps: userSteps[userId] });
  } else {
      res.status(404).send({ message: 'User not found' });
  }
});
