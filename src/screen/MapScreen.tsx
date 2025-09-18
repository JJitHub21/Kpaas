import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function MapScreen() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    const fetchLocation = async () => {
      try {
         // AsyncStorage에서 kakaoId 가져오기
        const kakaoId = await AsyncStorage.getItem('kakaoId');
        if (!kakaoId) {
          console.warn('kakaoId 없음: 로그인 시 저장 확인 필요');
          return;
        }

        const res = await axios.get(`http://3.37.99.32:8080/api/location/${kakaoId}`); // 🔁 실제 서버 주소
        const { latitude, longitude } = res.data;
        setLocation({ latitude, longitude });
        setLoading(false);
      } catch (err) {
        console.error('피보호자 위치 불러오기 실패:', err);
      }
    };

    fetchLocation();

    //  5초마다 위치 갱신 (실시간 업데이트 느낌)
    const interval = setInterval(fetchLocation, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !location) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#000c49" />;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          ...location,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={location} title="피보호자 현재 위치" />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
