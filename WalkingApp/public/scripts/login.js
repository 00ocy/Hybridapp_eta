// HTML 문서가 로드될 때 실행
document.addEventListener('DOMContentLoaded', function() {
  // 서버로 세션 확인 요청 보내기
  fetch('/check-session')
  .then(response => response.json())
  .then(data => {
    // 서버 응답으로부터 로그인 상태 확인
    const isLoggedIn = data.isLoggedIn;

    if (isLoggedIn) {
      // 세션이 있으면 로그인 상태
      console.log('로그인 상태입니다.');
      window.location.href = '/home.html';
    } else {
      // 세션이 없으면 비로그인 상태
      console.log('비로그인 상태입니다.');
    }
  })
  .catch(error => {
    console.error('세션 확인 중 오류:', error);
  });
  // "로그인" 버튼 클릭 시 실행
  document.querySelector('.button-large-register-46M').addEventListener('click', function(event) {
    // 기본 동작 중단 (페이지 새로고침 등)
    event.preventDefault();

    // 이메일과 비밀번호 입력값 가져오기
    var email = document.querySelector('.email-U9o').value;
    var password = document.querySelector('.password-mYD').value;

    // 서버에 로그인 요청 보내기
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, password: password }),
    })
    .then(response => response.json())
    .then(data => {
      // 로그인 성공 시 홈 화면으로 리다이렉션
      if (data.status === 'success') {
        window.location.href = 'home.html';
      } else {
        // 로그인 실패 시 에러 메시지 표시
        alert(data.message);
      }
    })
    .catch(error => {
      // 오류 처리
      console.error('Error:', error);
      alert('로그인 중 오류가 발생했습니다.');
    });
  });
});
/* -------------------------------------------------------------------------------------- */
// 구글 로그인
// Google 로그인 버튼 초기화 및 이벤트 핸들러 설정
function handleCredentialResponse(response) {
  // 서버로 ID 토큰 전송
  sendTokenToServer(response.credential);
}

window.onload = function () {
  // Google 로그인 초기화
  google.accounts.id.initialize({
    client_id: '510376110238-t3luckgljkbol5r017bsmgff84r4i5rk.apps.googleusercontent.com',
    callback: handleCredentialResponse,
    auto_select: true  // 자동 선택 활성화    
  });

  // 이미지에 클릭 이벤트 리스너 추가
  document.getElementById('googleLogin').addEventListener('click', function() {
    // Google 로그인 프롬프트를 표시
    google.accounts.id.prompt();
  });
}

// 서버로 토큰 전송
function sendTokenToServer(token) {
  fetch('/google-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token: token })
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      // 로그인 성공 처리
      alert('로그인 성공: ' + data.message);
      window.location.href = '/home.html'; // 예시: 홈페이지로 리디렉션
    } else {
      // 로그인 실패 처리
      alert('로그인 실패: ' + data.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

