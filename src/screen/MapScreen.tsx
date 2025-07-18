import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios';

export default function MapScreen() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

 useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await axios.get('https://687936e663f24f1fdca15237.mockapi.io/location/2'); // 🔁 실제 서버 주소
        const { latitude, longitude } = res.data;
        setLocation({ latitude, longitude });
      } catch (err) {
        console.error('피보호자 위치 불러오기 실패:', err);
      }
    };

    fetchLocation();
  }, []);

  if (!location) {
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
