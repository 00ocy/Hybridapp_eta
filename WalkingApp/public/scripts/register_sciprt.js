// "회원가입" 버튼에 클릭 이벤트 리스너 추가
document
  .querySelector(".button-large-register-iNu")
  .addEventListener("click", function (event) {
    // 기본 폼 제출 동작 방지
    event.preventDefault();

    // 입력된 사용자 정보 가져오기
    var lastName = document.querySelector(".last-name-32Z").value;
    var firstName = document.querySelector(".first-name-Zf7").value;
    var password = document.querySelector(".password-mYD").value;
    var email = document.querySelector(".email-U9o").value;

    // 이메일 유효성 검사를 위한 정규 표현식
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("유효한 이메일 주소를 입력해주세요.");
      return; // 유효하지 않은 이메일인 경우 함수 종료
    }

    // 서버에 회원가입 요청 보내기
    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lastName: lastName,
        firstName: firstName,
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          // 회원가입 성공 시 서버에서 받은 URL로 리다이렉트
          window.location.href = data.redirectUrl;
        } else {
          // 에러 발생 시 메시지 표시
          alert(data.message);
        }
      })
      .catch((error) => {
        // 네트워크 오류 등의 이유로 요청 실패 시 처리
        console.error("Error:", error);
        alert("회원가입 중 오류가 발생했습니다.");
      });
  });


/* ------------------------------------------------------------------------------------------------------------ */

// "로그인" 버튼에 클릭 이벤트 리스너 추가
document.getElementById("login-nJD").addEventListener("click", function () {
  // 로그인 페이지로 이동
  window.location.href = "login.html";
});

/* ------------------------------------------------------------------------------------------------------------ */

// 구글 로그인
// Google 로그인 버튼 초기화 및 이벤트 핸들러 설정
function handleCredentialResponse(response) {
  // 서버로 ID 토큰 전송
  sendTokenToServer(response.credential);
}

window.onload = function () {
  google.accounts.id.initialize({
    client_id: '510376110238-t3luckgljkbol5r017bsmgff84r4i5rk.apps.googleusercontent.com',
    callback: handleCredentialResponse
  });

  google.accounts.id.renderButton(
    document.getElementById('googleLogin'),
    { theme: 'outline', size: 'large' }  // 버튼 스타일 설정
  );

  google.accounts.id.prompt(); // 사용자가 로그인하도록 유도
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
