/* -------------------------------------------------------------------------------------------- */
// 필요한 모듈들을 불러옵니다.
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const sqlite3_friend = require('sqlite3').verbose();
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
  console.log('Connected to the SQLite userdatabase.');
});
const db2 = new sqlite3.Database('friendDatabase.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite frienddatabase.');
});

/* -------------------------------------------------------------------------------------------- */
// 구글 로그인 관련
const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis'); 

// Google OAuth2 클라이언트 생성
const CLIENT_ID = '510376110238-t3luckgljkbol5r017bsmgff84r4i5rk.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

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

// 일반 로그인 처리
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

// 데이터베이스 팔로잉에서 친구목록 받아오기
app.get('/friendlistfollowing', (req, res) => {
  // 데이터베이스에서 팔로잉이 true인 친구 검색
  db2.all('SELECT Name, Name2 FROM friend WHERE following = 1 ORDER BY Name', [], (err, rows) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    // 결과를 클라이언트에 응답
    res.json(rows);
  });
});

// 데이터베이스 팔로워에서 친구목록 받아오기
app.get('/friendlistfollower', (req, res) => {
  // 데이터베이스에서 팔로잉이 true인 친구 검색
  db2.all('SELECT Name, Name2 FROM friend WHERE follower = 1 ORDER BY Name', [], (err, rows) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    // 결과를 클라이언트에 응답
    res.json(rows);
  });
});

/* -------------------------------------------------------------------------------------------- */

// 언팔로잉 / 팔로잉
app.put(`/friendupdatefollowing/:username`, (req, res) => {
  const friendNameToUpdate = req.params.username;

  // SQLite3 데이터베이스에서 해당 친구의 Following 값을 false로 업데이트
  db2.run('UPDATE friend SET Following = 1 - Following WHERE Name2 = ?', [friendNameToUpdate], function (err) {
    if (err) {
        console.error('Error updating friend in database:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    } else {
        console.log('Friend updated in database successfully');
        // 클라이언트에게 성공 응답 전송
        res.json({ success: true });
    }
});
});

// 추가 / 삭제
app.put(`/friendupdatefollower/:username`, (req, res) => {
  const friendNameToUpdate = req.params.username;

  // SQLite3 데이터베이스에서 해당 친구의 Following 값을 false로 업데이트
  db2.run('UPDATE friend SET Follower = 1 - Follower WHERE Name2 = ?', [friendNameToUpdate], function (err) {
    if (err) {
        console.error('Error updating friend in database:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    } else {
        console.log('Friend updated in database successfully');
        // 클라이언트에게 성공 응답 전송
        res.json({ success: true });
    }
});
});

/* -------------------------------------------------------------------------------------------- */

// 팔로잉 하는 사람 수 가져오기
app.get('/followingcount', (req, res) => {
  // friend 데이터베이스에서 following이 1인 행의 개수를 세는 쿼리
  const query = 'SELECT COUNT(*) as followingCount FROM friend WHERE following = 1';

  // 쿼리 실행
  db2.get(query, (err, row) => {
    if (err) {
      console.error('Error counting following:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // 클라이언트에게 수를 반환
      res.json({ followingCount: row.followingCount });
    }
  });
});

// 팔로워 사람 수 가져오기
app.get('/followercount', (req, res) => {
  const query = 'SELECT COUNT(*) as count FROM friend WHERE follower = 1';
  db2.get(query, (err, row) => {
    if (err) {
      console.error('Error counting followers:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ count: row.count });
    }
  });
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
