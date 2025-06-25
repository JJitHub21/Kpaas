
import React, { useEffect, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/navigation/navigationType';

import StartScreen from './src/screen/StartScreen';
import LoginScreen from './src/screen/LoginScreen';
import MainScreen from './src/screen/MainScreen';
import KakaoLoginWebView from './src/screen/KakaoLoginWebView';
import NaverLoginWebView from './src/screen/NaverLoginWebView';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking, Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  // ✅ 여기에서 NavigationContainerRef 타입 명시
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  useEffect(() => {
    const handleInitialLink = async () => {
    console.log('[App.tsx] handleInitialLink 시작');
      const url = await Linking.getInitialURL();
    console.log('[App.tsx] getInitialURL:', url);
      if (url && url.startsWith('guard://login-callback')) {
        const parsed = new URL(url);
        const accessToken = parsed.searchParams.get('accessToken');
        const refreshToken = parsed.searchParams.get('refreshToken');
        const nickname = parsed.searchParams.get('nickname');

        console.log('[App.tsx] accessToken 감지:', accessToken);
        console.log('[App.tsx] nickname:', nickname);
        if (accessToken) {
          await AsyncStorage.setItem('jwt', accessToken);
          if (refreshToken) await AsyncStorage.setItem('refreshToken', refreshToken);
          if (nickname) await AsyncStorage.setItem('nickname', nickname);

          Alert.alert('자동 로그인 성공', `${nickname ?? '사용자'}님 환영합니다!`);

          // ✅ 타입 명시가 있어야 이 줄에서 오류 안 남
          navigationRef.current?.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            })
          );
        }
      }
    };

    handleInitialLink();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Start" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="KakaoLoginWebView" component={KakaoLoginWebView} />
        <Stack.Screen name="NaverLoginWebView" component={NaverLoginWebView} />
        <Stack.Screen name="Main" component={MainScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
