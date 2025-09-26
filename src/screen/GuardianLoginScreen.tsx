import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigationType';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'GuardianLogin'>;

const BASE_URL = "http://3.37.99.32:8080";

export default function GuardianLoginScreen() {
  const navigation = useNavigation<NavProp>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!phoneNumber.trim() || !password.trim()) {
      Alert.alert('오류', '휴대폰 번호와 비밀번호를 모두 입력하세요.');
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        phoneNumber,
        password,
      });

      const { guardianId, accessToken, refreshToken } = res.data;

      await AsyncStorage.multiSet([
        ['userType', 'guardian'],
        ['guardianId', String(guardianId)],
        ['accessToken', accessToken],
        ['refreshToken', refreshToken],
      ]);

      // linkedUserId 확인 → 연결 없으면 GuardianLink, 있으면 Main
      const linkedUserId = await AsyncStorage.getItem('linkedUserId');
      if (linkedUserId) {
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'GuardianLink' }] });
      }
    } catch (err: any) {
      console.error('[GuardianLogin] 로그인 실패:', err);

      if (err.response?.status === 404) {
        Alert.alert(
          '계정 없음',
          '가입되지 않은 번호입니다. 회원가입을 진행하시겠습니까?',
          [
            { text: '취소', style: 'cancel' },
            { text: '회원가입', onPress: () => navigation.navigate('GuardianRegister') },
          ]
        );
      } else {
        Alert.alert('오류', '로그인에 실패했습니다. 아이디/비밀번호를 확인하세요.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>경호원</Text>
      <Text style={styles.title}>보호자 로그인</Text>

      <TextInput
        placeholder="휴대폰 번호"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.input}
        keyboardType="phone-pad"
      />

      <TextInput
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>

      {/* 회원가입 버튼 */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#888', marginTop: 10 }]}
        onPress={() => navigation.navigate('GuardianRegister')}
      >
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20, backgroundColor: '#b6b6b6' },
  appTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginTop: 16, alignSelf: 'flex-start' },
  title: { fontSize: 28, fontWeight: 'bold', marginVertical: 40, color: '#fff' },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 30,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
