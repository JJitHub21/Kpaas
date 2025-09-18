import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GuardianRegisterScreen({ navigation }) {
  const [protegeeId, setProtegeeId] = useState('');

  const handleRegister = async () => {
    if (!protegeeId.trim()) {
      Alert.alert('오류', '피보호자 ID를 입력하세요.');
      return;
    }
    await AsyncStorage.setItem('linkedUserId', protegeeId);
    Alert.alert('성공', '피보호자 등록 완료');
    navigation.goBack(); // 메인으로 돌아감
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
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20 },
});
