import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigationType';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'GuardianLink'>;

const BASE_URL = "http://3.37.99.32:8080";

export default function GuardianLinkScreen() {
  const navigation = useNavigation<NavProp>();
  const [uniqueCode, setUniqueCode] = useState('');

  // 이미 연결된 경우 자동으로 Main으로 이동
  useEffect(() => {
    const checkLinked = async () => {
      const linkedUserId = await AsyncStorage.getItem('linkedUserId');
      if (linkedUserId) {
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      }
    };
    checkLinked();
  }, [navigation]);

  const handleRegister = async () => {
    if (!uniqueCode.trim()) {
      Alert.alert('오류', '이용자 코드를 입력하세요.');
      return;
    }

    try {
      const guardianId = await AsyncStorage.getItem('guardianId');
      if (!guardianId) {
        Alert.alert('오류', '로그인 정보가 없습니다.');
        return;
      }

      const res = await axios.post(`${BASE_URL}/relationship/register`, {
        guardianId,
        uniqueCode,
      });

      const { protectedUserId } = res.data;

      await AsyncStorage.setItem('linkedUserId', String(protectedUserId));

      Alert.alert('성공', '피보호자 등록 완료');
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (err) {
      console.error('[GuardianLink] 등록 실패:', err);
      Alert.alert('오류', '피보호자 등록에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>경호원</Text>
      <Text style={styles.title}>이용자 코드 연결</Text>

      <TextInput
        placeholder="이용자 코드 입력"
        value={uniqueCode}
        onChangeText={setUniqueCode}
        style={styles.input}
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>등록하기</Text>
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
