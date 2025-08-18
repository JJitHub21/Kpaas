// 사용자가 집을 나갔을 때 백그라운드에서 실행될 함수
const handleUserExit = async () => {
  console.log("✅ [HeadlessJS] 사용자가 집을 떠났습니다. 가전기기 상태 확인을 시작합니다.");

  try {
    // 여기에 백엔드 서버로 API 요청을 보내는 코드를 작성합니다.
    // const response = await fetch('https://your-backend-server.com/check-devices', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId: 'user123' }) // 사용자 식별 정보
    // });
    // const result = await response.json();
    // console.log("[HeadlessJS] 서버 응답:", result);

  } catch (error) {
    console.error("[HeadlessJS] 가전기기 상태 확인 요청 실패:", error);
  }
};


// 네이티브로부터 지오펜스 이벤트를 수신하는 부분
const GeofenceHeadlessTask = async (event) => {
  console.log('[HeadlessJS] 지오펜스 이벤트 수신:', event);
  
  // 'HOME' 지오펜스를 '나갔을(EXIT)' 때만 처리합니다.
  if (event.identifier === "HOME" && event.action === "EXIT") {
    await handleUserExit();
  }
};

// 이 태스크를 등록합니다.
module.exports = GeofenceHeadlessTask;
