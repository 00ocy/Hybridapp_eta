document.querySelector('.button-large-register-iNu').addEventListener('click', function(event) {
  // 기본 폼 제출 막기
  event.preventDefault();

  // 사용자 입력 값 가져오기
  var lastName = document.querySelector('.last-name-32Z').value;
  var firstName = document.querySelector('.first-name-Zf7').value;
  var password = document.querySelector('.password-mYD').value;
  var email = document.querySelector('.email-U9o').value;
  
  // 이메일 형식 검증을 위한 정규 표현식
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert('유효한 이메일 주소를 입력해주세요.');
    return; // 유효하지 않으면 여기서 함수 실행을 중단
  }

  // 서버에 회원가입 요청
  fetch('/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ lastName: lastName, firstName: firstName, email: email, password: password }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      // 회원가입 성공 시 서버로부터 받은 URL로 페이지 이동
      window.location.href = data.redirectUrl;
    } else {
      // 에러 메시지 표시
      alert(data.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('회원가입 중 오류가 발생했습니다.');
  });
});

document.getElementById('login-nJD').addEventListener('click', function() {
  window.location.href = 'login.html';
});
