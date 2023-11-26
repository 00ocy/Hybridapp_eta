document.addEventListener('DOMContentLoaded', function() {

document.getElementById('followingBTN').addEventListener('click', function() {
    window.location.href = 'following.html';
  });
  document.getElementById('homeBTN').addEventListener('click', function() {
    window.location.href = 'home.html';
  });


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


});