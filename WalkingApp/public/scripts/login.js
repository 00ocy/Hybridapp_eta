document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.button-large-register-46M').addEventListener('click', function(event) {
      event.preventDefault();
  
      var email = document.querySelector('.email-U9o').value;
      var password = document.querySelector('.password-mYD').value;
  
      fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          // 로그인 성공 시 홈 화면으로 리다이렉션
          window.location.href = 'home.html';
        } else {
          // 로그인 실패 시 에러 메시지 표시
          alert(data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('로그인 중 오류가 발생했습니다.');
      });
    });
  });
  