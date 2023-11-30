window.addEventListener('DOMContentLoaded', () => {
  // 서버로 세션 확인 요청 보내기
  fetch('/check-session')
    .then(response => response.json())
    .then(data => {
      // 서버 응답으로부터 로그인 상태 확인
      const isLoggedIn = data.isLoggedIn;

      if (isLoggedIn) {
        // 세션이 있으면 로그인 상태
        console.log('로그인 상태입니다.');
      } else {
        // 세션이 없으면 비로그인 상태
        console.log('비로그인 상태입니다.');
        // 여기서 로그인 페이지로 이동하거나 다른 작업 수행
        window.location.href = '/register.html';
      }
    })
    .catch(error => {
      console.error('세션 확인 중 오류:', error);
    });
});

document.getElementById('homeBtn').addEventListener('click', function() {
    window.location.href = 'home.html';
  });
  document.getElementById('rankingBtn').addEventListener('click', function() {
    window.location.href = 'ranking.html';
  });
  document.getElementById('mapBtn').addEventListener('click', function() {
    window.location.href = 'map.html';
  });