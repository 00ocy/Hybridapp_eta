// HTML 문서가 로드될 때 실행
document.addEventListener('DOMContentLoaded', function() {
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
