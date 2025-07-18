// src/components/UserGeofenceManager.tsx

import { useEffect } from 'react';
import { setupGeofence } from '../native/GeofenceBridge';

const UserGeofenceManager = () => {
  useEffect(() => {
    console.log('[UserGeofenceManager] Setting up geofence...');

    // 네이티브 모듈을 호출하여 'HOME'이라는 ID로 지오펜스를 설정합니다.
    // 🔁 실제 앱에서는 이 위경도 및 반경 값을 사용자가 설정하거나 서버에서 받아와야 합니다.
    setupGeofence('HOME', 37.5665, 126.9780, 200) // 예: 서울 시청 반경 200m
      .then(result => {
        console.log(result); // 성공 시: "Geofence added successfully."
      })
      .catch(error => {
        console.error(error); // 실패 시: 권한 거부 또는 네이티브 에러
      });

  }, []); // 컴포넌트가 처음 마운트될 때 한 번만 실행

  // 이 컴포넌트는 UI를 렌더링하지 않습니다.
  return null;
};

export default UserGeofenceManager;