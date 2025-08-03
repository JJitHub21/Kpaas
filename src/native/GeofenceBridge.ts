// src/native/GeofenceBridge.ts

import { NativeModules, PermissionsAndroid, Platform } from 'react-native';

const { GeofencingModule } = NativeModules;

export const setupGeofence = async (
  id: string,
  latitude: number,
  longitude: number,
  radius: number
): Promise<string> => {
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

    // ✅ 3. 알림 권한 요청 (Android 13 이상)
    if (Platform.Version >= 33) {
      const notificationGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (notificationGranted !== PermissionsAndroid.RESULTS.GRANTED) {
        return Promise.reject('Notification permission denied.');
      }
    }

    // 4. 네이티브 모듈의 addGeofence 함수 호출
    const result = await GeofencingModule.addGeofence(id, latitude, longitude, radius);
    return result;

  } catch (error) {
    console.error('[GeofencingBridge] Failed to set up geofence:', error);
    return Promise.reject(error);
  }
};