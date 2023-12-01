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
          window.location.href = '/home.html';
        } else {
          // 세션이 없으면 비로그인 상태
          console.log('비로그인 상태입니다.');
          setTimeout(() => {
            window.location.href = 'welcome_screen.html'; // 웰컴 스크린 파일 경로로 수정하세요
          }, 3000);
        }
      })
      .catch(error => {
        console.error('세션 확인 중 오류:', error);
      });
  });
