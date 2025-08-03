// src/components/UserGeofenceManager.tsx

import { useEffect } from 'react';
import { NativeModules } from 'react-native'; // ✅ NativeModules import 추가
import { setupGeofence } from '../native/GeofenceBridge';

const { GeofencingModule } = NativeModules; // ✅ GeofencingModule 가져오기

const UserGeofenceManager = () => {
  useEffect(() => {
    console.log('[UserGeofenceManager] Setting up geofence...');
    
    setupGeofence('HOME', 37.5665, 126.9780, 200)
      .then(result => {
        console.log(result);
        // ✅ 지오펜스 설정 성공 후, 위치 업데이트 시작
        if (GeofencingModule) {
          GeofencingModule.startLocationUpdates();
        }
      })
      .catch(error => {
        console.error(error);
      });

  }, []);

  return null;
};

export default UserGeofenceManager;