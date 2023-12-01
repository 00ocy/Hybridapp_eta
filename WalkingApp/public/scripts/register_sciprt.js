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
          alert(data.message);
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
  // Google 로그인 초기화
  google.accounts.id.initialize({
    client_id:
      "510376110238-t3luckgljkbol5r017bsmgff84r4i5rk.apps.googleusercontent.com",
    callback: handleCredentialResponse,
    auto_select: true, // 자동 선택 활성화
  });

  // 이미지에 클릭 이벤트 리스너 추가
  document.getElementById("googleLogin").addEventListener("click", function () {
    // Google 로그인 프롬프트를 표시
    google.accounts.id.prompt();
  });
};

// 서버로 토큰 전송
function sendTokenToServer(token) {
  fetch("/google-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: token }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        // 로그인 성공 처리
        alert(data.message);
        window.location.href = "/home.html"; // 예시: 홈페이지로 리디렉션
      } else {
        // 로그인 실패 처리
        alert(data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
