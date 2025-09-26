import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/navigation/navigationType';

import StartScreen from './src/screen/StartScreen';
import LoginTypeScreen from './src/screen/LoginTypeScreen';
import MainScreen from './src/screen/MainScreen';
import MyScreen from './src/screen/MyScreen';
import MapScreen from './src/screen/MapScreen';
import GuardianRegisterScreen from './src/screen/GuardianRegisterScreen';
import GuardianLoginScreen from './src/screen/GuardianLoginScreen';
import GuardianLinkScreen from './src/screen/GuardianLinkScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Stack = createNativeStackNavigator<RootStackParamList>();
const BASE_URL = "http://3.37.99.32:8080";

export default function App() {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const userType = await AsyncStorage.getItem('userType');

        if (refreshToken && userType === 'guardian') {
          // 보호자 자동 로그인 (토큰 갱신)
          const res = await axios.post(`${BASE_URL}/api/auth/refresh`, { refreshToken });
          const { accessToken } = res.data;
          await AsyncStorage.setItem('accessToken', accessToken);

          const linkedUserId = await AsyncStorage.getItem('linkedUserId');
          if (linkedUserId) {
            setInitialRoute('Main');          // 연결 완료 → Main
          } else {
            setInitialRoute('GuardianLink');  // 연결 안 됨 → 코드 입력 화면
          }
        } else if (userType === 'user') {
          // 이용자 자동 로그인 (refreshToken 불필요)
          const protectedUserId = await AsyncStorage.getItem('protectedUserId');
          if (protectedUserId) {
            setInitialRoute('Main');
          } else {
            setInitialRoute('LoginType');
          }
        } else {
          setInitialRoute('LoginType');
        }
      } catch (err) {
        console.error('[App] 자동 로그인 실패:', err);
        setInitialRoute('LoginType');
      }
    };
    checkLogin();
  }, []);

  if (!initialRoute) return null; // 초기 로딩 중

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="LoginType" component={LoginTypeScreen} />
        <Stack.Screen name="GuardianLogin" component={GuardianLoginScreen} />
        <Stack.Screen name="GuardianRegister" component={GuardianRegisterScreen} />
        <Stack.Screen name="GuardianLink" component={GuardianLinkScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="My" component={MyScreen} />
        <Stack.Screen name="MapScreen" component={MapScreen} />
        <Stack.Screen name="CameraScreen" component={require('./src/screen/CameraScreen').default} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
