import { useEffect } from "react";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Geolocation from "react-native-geolocation-service";

const BACKEND_URL = "http://3.37.99.32:8080/api/location"; // 실제 서버 주소

export default function LocationUploader() {
  useEffect(() => {
    let locationInterval: ReturnType<typeof setInterval> | null = null;

    const requestPermission = async () => {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // iOS는 Info.plist 설정 필요
    };

    const startLocationTracking = async () => {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        Alert.alert("위치 권한이 필요합니다.");
        return;
      }

      const kakaoId = await AsyncStorage.getItem("kakaoId");
      if (!kakaoId) {
        console.warn("kakaoId 없음. 로그인 먼저 필요합니다.");
        return;
      }

      locationInterval = setInterval(() => {
        Geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude, accuracy } = pos.coords;

            try {
              await axios.post(BACKEND_URL, {
                userId: kakaoId,
                latitude,
                longitude,
                accuracy,
                provider: "gps",
                recordedAt: new Date().toISOString(),
              });
              console.log(
                "[LocationUploader] 위치 전송 성공:",
                latitude,
                longitude
              );
            } catch (err) {
              console.error("[LocationUploader] 위치 전송 실패:", err);
            }
          },
          (error) => {
            console.error("[LocationUploader] 위치 가져오기 실패:", error);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }, 10000);
    };

    startLocationTracking();

    return () => {
      if (locationInterval) {
        clearInterval(locationInterval);
      }
    };
  }, []);

  return null;
}