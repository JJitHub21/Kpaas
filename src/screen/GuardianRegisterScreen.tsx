import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigationType';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type GuardianRegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'GuardianRegister'
>;

export default function GuardianRegisterScreen() {
  const navigation = useNavigation<GuardianRegisterScreenNavigationProp>();
  const [protegeeId, setProtegeeId] = useState('');

  const handleRegister = async () => {
    if (!protegeeId.trim()) {
      Alert.alert('오류', '피보호자 ID를 입력하세요.');
      return;
    }

    try {
      // TODO: 서버 API 호출 추가 (피보호자 등록 API)
      await AsyncStorage.setItem('linkedUserId', protegeeId);

      Alert.alert('성공', '피보호자 등록 완료');

      // ✅ Main 화면으로 reset
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (err) {
      console.error('[GuardianRegisterScreen] 등록 실패:', err);
      Alert.alert('오류', '피보호자 등록에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="피보호자 ID 입력"
        value={protegeeId}
        onChangeText={setProtegeeId}
        style={styles.input}
      />
      <Button title="등록" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 4,
  },
});
