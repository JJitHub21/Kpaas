// src/native/GeofencingBridge.ts

import { NativeModules, PermissionsAndroid, Platform } from 'react-native';

// Android Studio에서 작성한 네이티브 모듈을 가져옵니다.
// 'GeofencingModule'은 GeofencingModule.kt에서 `override fun getName() = "GeofencingModule"` 이 부분의 이름과 일치해야 합니다.
const { GeofencingModule } = NativeModules;

/**
 * 안드로이드 위치 정보 권한을 요청하고, 네이티브 지오펜스를 설정합니다.
 * @param id 지오펜스의 고유 ID (예: 'HOME_ZONE')
 * @param latitude 위도
 * @param longitude 경도
 * @param radius 반경 (미터)
 */
export const setupGeofence = async (
  id: string,
  latitude: number,
  longitude: number,
  radius: number
): Promise<string> => {
  // iOS인 경우엔 아무 작업도 하지 않음 (현재는 Android 전용)
  if (Platform.OS !== 'android') {
    return Promise.reject('Geofencing is only available on Android.');
  }

  try {
    // 1. 포그라운드 위치 권한 요청
    const fineLocationGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    if (fineLocationGranted !== PermissionsAndroid.RESULTS.GRANTED) {
      return Promise.reject('Location permission denied.');
    }

    // 2. 백그라운드 위치 권한 요청 (Android 10 이상)
    if (Platform.Version >= 29) {
      const backgroundGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
      );
      if (backgroundGranted !== PermissionsAndroid.RESULTS.GRANTED) {
        return Promise.reject('Background location permission denied.');
      }
    }

    // 3. 네이티브 모듈의 addGeofence 함수 호출
    const result = await GeofencingModule.addGeofence(id, latitude, longitude, radius);
    return result; // 성공 메시지 반환

  } catch (error) {
    console.error('[GeofencingBridge] Failed to set up geofence:', error);
    return Promise.reject(error);
  }
};