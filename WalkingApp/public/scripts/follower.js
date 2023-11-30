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

document.addEventListener('DOMContentLoaded', function() {

document.getElementById('followingBTN').addEventListener('click', function() {
  
    window.location.href = 'following.html';
  });
  document.getElementById('homeBTN').addEventListener('click', function() {
    window.location.href = 'home.html';
  });

  document.getElementById('searchBTN').addEventListener('click', search);



  // 서버에서 친구 목록 가져오기
  fetch('/friendlistfollower')
  
    .then(response => response.json())
    .then(friends => {
      friends.forEach(friend => {
        addFriend(friend.Name, friend.Name2);
      });
    });

 // 서버에서 현재 팔로잉 중인 친구의 수를 가져오기
 fetch('/followingcount')
 .then(response => response.json())
 .then(data => {
 // 가져온 친구 수로 'FI' 엘리먼트를 업데이트
 var FollowingCountElement = document.getElementById('followingBTN');
 FollowingCountElement.textContent = `팔로잉 ${data.followingCount}명`;
 })
 .catch(error => {
 console.error('Error fetching following count:', error);
 });

  // 서버에서 현재 팔로워 수를 가져오기
  fetch('/followercount')
  .then(response => response.json())
  .then(data => {
      document.getElementById('followerBTN').textContent = `팔로워 ${data.count}명`;
  })
  .catch(error => {
      console.error('Error fetching follower count:', error);
  });

  // 친구 목록을 나타내는 함수
  function addFriend(name, username) {
  // 새로운 친구 요소 생성
  var newFriend = document.createElement("div");
  newFriend.className = "friend";

  // 새로운 친구의 내용 설정
  newFriend.innerHTML = `
    <div class="item--F4D"></div>
    <div class="auto-group-zmsk-BTf">
      <div class="auto-group-fpmy-hwo">
        <p class="item--es3">${name}</p>
        <p class="item--Bc5">${username}</p>
      </div>
      <div id="${username}" class="item--uHB">삭제</div>
    </div>
  `;

  // 팔로잉 & 언팔로잉
  document.getElementById("friendlist").appendChild(newFriend);
  document.getElementById(username).addEventListener('click', function() {
    if (document.getElementById(username).textContent == "삭제") {
        // 클릭 시 삭제면 추가로 변경
        document.getElementById(username).textContent = "추가";
        document.getElementById(username).style.color = '#ffffff';
        document.getElementById(username).style.backgroundImage = 'url("../assets/-xos.png")';
      } else {
        // 클릭 시 추가면 삭제로 변경
        document.getElementById(username).textContent = "삭제";
        document.getElementById(username).style.color = '#000000';
        document.getElementById(username).style.backgroundImage = 'url("../assets/-uwX.png")';
        
    }
    fetch(`/friendupdatefollower/${username}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
  })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          console.log('Friend updated successfully:', data);
          // 업데이트 후에는 필요한 작업 수행
      })
      .catch(error => {
          console.error('Error updating friend:', error);
      });
});
}

function search() {
  // 입력 상자에서 검색어 가져오기
  const searchTerm = document.getElementById('searchInput').value;

  // 서버에 POST 요청 보내기
  fetch('/search/follower', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      searchTerm: searchTerm,
    }),
  })
  .then(response => response.json())
  .then(data => {
    // 결과를 표시할 엘리먼트 가져오기
    const friendlistElement = document.getElementById('friendlist');
    
    // friendlist의 내용을 지우기
    friendlistElement.innerHTML = '';

    // 결과를 화면에 출력
    if (data.results.length > 0) {
      data.results.forEach(result => {
        addFriend(result.Name, result.Name2); // addFriend 함수로 결과를 friendlist에 추가
      });
    } else {
      // 검색 결과가 없는 경우 처리
      friendlistElement.textContent = '';
    }
  })
  .catch(error => {
    console.error('Error searching:', error);
    // 에러 처리 로직 추가
  });
}


});