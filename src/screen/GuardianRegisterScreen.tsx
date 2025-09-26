import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigationType';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'GuardianRegister'>;

const BASE_URL = "http://3.37.99.32:8080";

export default function GuardianRegisterScreen() {
  const navigation = useNavigation<NavProp>();
  const [step, setStep] = useState<'phone' | 'verify' | 'password'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');

  const sendCode = async () => {
    try {
      await axios.post(`${BASE_URL}/api/auth/signup/send-code`, { phoneNumber });
      Alert.alert('성공', '인증코드가 발송되었습니다.');
      setStep('verify');
    } catch (err) {
      console.error('[GuardianRegister] sendCode 실패:', err);
      Alert.alert('오류', '인증코드 발송에 실패했습니다.');
    }
  };

  const verifyCode = async () => {
    try {
      await axios.post(`${BASE_URL}/api/auth/signup/verify-code`, { phoneNumber, code });
      Alert.alert('성공', '인증되었습니다. 비밀번호를 설정하세요.');
      setStep('password');
    } catch (err) {
      console.error('[GuardianRegister] verifyCode 실패:', err);
      Alert.alert('오류', '인증번호가 올바르지 않습니다.');
    }
  };

  const registerGuardian = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/signup`, {
        phoneNumber,
        password,
        name: '보호자',
      });

      const { guardianId, accessToken, refreshToken } = res.data;

      await AsyncStorage.multiSet([
        ['userType', 'guardian'],
        ['guardianId', String(guardianId)],
        ['accessToken', accessToken],
        ['refreshToken', refreshToken],
      ]);

      Alert.alert('성공', '회원가입이 완료되었습니다.');
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (err) {
      console.error('[GuardianRegister] 회원가입 실패:', err);
      Alert.alert('오류', '회원가입에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>경호원</Text>
      <Text style={styles.title}>보호자 회원가입</Text>

      {step === 'phone' && (
        <>
          <TextInput
            placeholder="휴대폰 번호 입력"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.input}
            keyboardType="phone-pad"
          />
          <TouchableOpacity style={styles.button} onPress={sendCode}>
            <Text style={styles.buttonText}>인증코드 받기</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 'verify' && (
        <>
          <TextInput
            placeholder="인증번호 입력"
            value={code}
            onChangeText={setCode}
            style={styles.input}
            keyboardType="number-pad"
          />
          <TouchableOpacity style={styles.button} onPress={verifyCode}>
            <Text style={styles.buttonText}>인증하기</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 'password' && (
        <>
          <TextInput
            placeholder="비밀번호 설정"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={registerGuardian}>
            <Text style={styles.buttonText}>회원가입 완료</Text>
          </TouchableOpacity>
        </>
      )}
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
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
