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
        // ✅ AsyncStorage에서 피보호자 ID 가져오기
        const linkedUserId = await AsyncStorage.getItem('linkedUserId');
        console.log('[MapScreen] linkedUserId:', linkedUserId);

        if (!linkedUserId) {
          console.warn('[MapScreen] linkedUserId 없음: GuardianRegisterScreen에서 등록 필요');
          return;
        }

        const url = `http://3.37.99.32:8080/api/location/${linkedUserId.trim()}`;
        console.log('[MapScreen] 요청 URL:', url);

        const res = await axios.get(url);
        console.log('[MapScreen] 서버 응답:', res.data);

        const { latitude, longitude } = res.data;
        setLocation({ latitude, longitude });
        setLoading(false);
      } catch (err) {
        console.error('[MapScreen] 피보호자 위치 불러오기 실패:', err);
      }
    };

    fetchLocation();

    // 5초마다 위치 갱신
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
