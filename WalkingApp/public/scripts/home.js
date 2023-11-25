let lastAccel = { x: 0, y: 0, z: 0 };
let stepsDetected = 0;
const stepThreshold = 2;

window.addEventListener('devicemotion', (event) => {
  const { x, y, z } = event.accelerationIncludingGravity;

  let accelChange = Math.abs(x - lastAccel.x) + Math.abs(y - lastAccel.y) + Math.abs(z - lastAccel.z);

  if (accelChange > stepThreshold) {
    stepsDetected++;
    updateGauge(stepsDetected, 10000);
  }

  lastAccel = { x, y, z };
});

document.getElementById('homeBtn').addEventListener('click', function () {
  window.location.href = 'home.html';
});
document.getElementById('rankingBtn').addEventListener('click', function () {
  window.location.href = 'ranking.html';
});
document.getElementById('mapBtn').addEventListener('click', function () {
  window.location.href = 'map.html';
});
document.getElementById('follower').addEventListener('click', function () {
  window.location.href = 'follower.html';
});

function updateGauge(steps, maxSteps) {
  const gaugeFill = document.querySelector('.gauge__fill');
  const fillPercentage = steps / maxSteps;
  // 5000걸음일 때 게이지가 90도만큼 채워지도록 설정합니다.
  // fillDegree는 0에서 10000걸음에 이르는 동안 -90도에서 시작해서 90도로 변경되어야 합니다.
  const fillDegree = (fillPercentage * 180) - 90;
  gaugeFill.style.transform = `rotate(${fillDegree}deg)`;
}
document.addEventListener("DOMContentLoaded", function() {
  var gaugeFill = document.querySelector('.gauge__fill');

  // 'animationend' 이벤트 리스너를 추가하여 애니메이션이 끝나는 것을 감지합니다.
  gaugeFill.addEventListener('animationend', function() {
    showMessageCompletion();
  });
});

function showMessageCompletion() {
  var message = document.querySelector('.message-completion');
  message.style.display = 'block'; // 메시지를 보이게 합니다.
  setTimeout(function() {
    message.style.opacity = 1; // 메시지를 천천히 페이드인 시킵니다.
  }, 300);
}

// 예시: 10000걸음 중 5000걸음 걸었을 때 게이지 업데이트
updateGauge(10000, 10000);