import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigationType';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'LoginType'>;

const BASE_URL = "http://3.37.99.32:8080";

export default function LoginTypeScreen() {
  const navigation = useNavigation<NavProp>();

  // 이용자 로그인 (deviceId 등록)
  const handleUserLogin = async () => {
    try {
      const deviceId = await DeviceInfo.getUniqueId();

       // --- 👇 여기 로그를 추가해서 실제 deviceId 값을 확인해보세요! ---
      console.log("!!!!!!!!!! 기기에서 생성된 실제 Device ID:", deviceId);
      // -------------------------------------------------------
      const res = await axios.post(`${BASE_URL}/api/protected/register`, { deviceId });

      const { protectedUserId, linkingCode, accessToken, refreshToken } = res.data;

      await AsyncStorage.multiSet([
        ['userType', 'user'],
        ['protectedUserId', String(protectedUserId)],
        ['linkingCode', linkingCode],
        ['accessToken', accessToken],
        ['refreshToken', refreshToken],
      ]);

      Alert.alert('로그인 성공', '이용자로 로그인되었습니다.');
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (err) {
      console.error('[LoginType] User login 실패:', err);
      Alert.alert('오류', '이용자 로그인에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인 유형 선택</Text>

      <TouchableOpacity style={styles.button} onPress={handleUserLogin}>
        <Text style={styles.buttonText}>이용자로 로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#FFA94D' }]}
        onPress={() => navigation.navigate('GuardianLogin')}
      >
        <Text style={styles.buttonText}>보호자로 로그인</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#b6b6b6' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 40, color: '#fff' },
  button: {
    width: '70%',
    backgroundColor: '#2563eb',
    paddingVertical: 15,
    borderRadius: 30,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
