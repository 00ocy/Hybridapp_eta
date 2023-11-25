document.getElementById("homeBtn").addEventListener("click", function () {
  window.location.href = "home.html";
});
document.getElementById("rankingBtn").addEventListener("click", function () {
  window.location.href = "ranking.html";
});
document.getElementById("mapBtn").addEventListener("click", function () {
  window.location.href = "map.html";
});
document.getElementById("peopleSearchBtn").addEventListener("click", function () {
    window.location.href = "map_search.html";
  });

// 마커를 클릭하면 장소명을 표출할 인포윈도우
var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

var mapContainer = document.getElementById("map"), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
    level: 3, // 지도의 확대 레벨
  };

// 지도를 생성합
var map = new kakao.maps.Map(mapContainer, mapOption);

// 장소 검색 객체를 생성
var ps = new kakao.maps.services.Places();
ps.keywordSearch("유한대학교", placesSearchCB);


// SearchStart를 클릭하면 실행될 함수를 정의
// 마커를 저장할 배열을 초기화
var markers = [];

// 검색 버튼에 이벤트 리스너를 추가
document.getElementById('SearchStart').addEventListener('click', function() {
    // 입력 필드에서 키워드를 가져
    var keyword = document.getElementById('placeSearchInput').value;
    // 이전 마커들을 지도에서 제거
    removeMarkers();
    // 새 키워드로 장소를 검색
    ps.keywordSearch(keyword, placesSearchCB);
});

// 모든 마커를 지도에서 제거하는 함수
function removeMarkers() {
    // 배열에 저장된 모든 마커에 대해 반복
    for (var i = 0; i < markers.length; i++) {
        // 각 마커를 지도에서 제거
        markers[i].setMap(null);
    }
    // 마커 배열을 비움
    markers = [];
}

// 검색 결과에 대한 콜백 함수
function placesSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
        // 검색 결과를 포함할 영역을 정의
        var bounds = new kakao.maps.LatLngBounds();
        for (var i = 0; i < data.length; i++) {
            // 각 장소에 대한 마커를 생성
            displayMarker(data[i]);    
            // 지도 영역을 장소의 위치에 맞춤
            bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }
        // 지도의 범위를 검색 결과에 맞춤
        map.setBounds(bounds);
    }
}

// 장소에 마커를 표시하는 함수
function displayMarker(place) {
    // 마커 객체를 생성
    var marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x)
    });

    // 마커에 클릭 이벤트 리스너를 추가
    kakao.maps.event.addListener(marker, 'click', function() {
        // 클릭 시 정보 창을 표시
        infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
        infowindow.open(map, marker);
    });

    // 생성된 마커를 배열에 추가
    markers.push(marker);
}
