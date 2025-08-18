import { useEffect } from 'react';
import { NativeModules, DeviceEventEmitter } from 'react-native';
import { setupGeofence } from '../native/GeofenceBridge';

const { GeofencingModule } = NativeModules;

const UserGeofenceManager = () => {
  useEffect(() => {
    console.log('[UserGeofenceManager] Setting up geofence...');
    
    // 실제 앱에서는 사용자 정보(ID, 집 주소 등)를 받아와서 설정해야 합니다.
    setupGeofence('HOME', 37.5665, 126.9780, 200) // 예시: 서울 시청, 반경 200m
      .then(result => {
        console.log(result);
        if (GeofencingModule) {
          GeofencingModule.startLocationUpdates();
        }
      })
      .catch(error => {
        console.error(error);
      });

    // --- ✅ 네이티브에서 오는 지오펜스 이벤트를 수신합니다. ---
    const geofenceEventListener = DeviceEventEmitter.addListener(
      'onGeofenceEvent', // ⬅️ GeofenceBroadcastReceiver에서 보내기로 한 이벤트 이름
      (event) => {
        console.log('네이티브로부터 지오펜스 이벤트 수신:', event);
        // event 객체 예시: { identifier: 'HOME', action: 'EXIT' }
        
        // 'HOME' 지오펜스를 '나갔을(EXIT)' 때 새로운 기능을 실행합니다.
        if (event.identifier === "HOME" && event.action === "EXIT") {
          handleUserExit();
        }
      }
    );
    // --------------------------------------------------------------------

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 반드시 정리해줍니다.
    return () => {
      geofenceEventListener.remove();
    };

  }, []);

  // 사용자가 집을 나갔을 때 실행될 함수
  const handleUserExit = async () => {
    console.log("사용자가 집을 떠났습니다. 가전기기 상태 확인을 시작합니다.");

    try {
      // TODO: 여기에 백엔드 서버로 API 요청을 보내는 코드를 작성합니다.
      // const response = await fetch('https://your-backend-server.com/check-devices', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId: 'user123' }) // 사용자 식별 정보
      // });
      // const result = await response.json();
      // console.log("서버 응답:", result); 

    } catch (error) {
      console.error("가전기기 상태 확인 요청 실패:", error);
    }
  };

  return null;
};

export default UserGeofenceManager;
