
import React, { useEffect, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/navigation/navigationType';

import StartScreen from './src/screen/StartScreen';
import LoginScreen from './src/screen/LoginScreen';
import MainScreen from './src/screen/MainScreen';
import KakaoLoginWebView from './src/screen/KakaoLoginWebView';
import NaverLoginWebView from './src/screen/NaverLoginWebView';
import MyScreen from './src/screen/MyScreen';
import MapScreen from './src/screen/MapScreen'; // 구글 맵

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking, Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  // 여기에서 NavigationContainerRef 타입 명시
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  useEffect(() => {
  const handleDeepLink = async (event: { url: string }) => {
    const url = event.url;
    console.log('[App.tsx] 딥링크 수신:', url);

    if (url && url.startsWith('guard://login-callback')) {
      const parsed = new URL(url);
      const accessToken = parsed.searchParams.get('accessToken');
      const refreshToken = parsed.searchParams.get('refreshToken');
      const nickname = parsed.searchParams.get('nickname');

      console.log('[App.tsx] accessToken:', accessToken);
      if (accessToken) {
        await AsyncStorage.setItem('jwt', accessToken);
        if (refreshToken) await AsyncStorage.setItem('refreshToken', refreshToken);
        if (nickname) await AsyncStorage.setItem('nickname', nickname);

        Alert.alert('자동 로그인 성공', `${nickname ?? '사용자'}님 환영합니다!`);

        navigationRef.current?.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          })
        );
      }
    }
  };

  const getInitial = async () => {
    console.log('[App.tsx] handleInitialLink 시작');
    const url = await Linking.getInitialURL();
    console.log('[App.tsx] getInitialURL:', url);
    if (url) handleDeepLink({ url });
  };

  // 최초 딥링크 확인
  getInitial();

  // 앱이 켜져 있을 때 들어오는 딥링크 대응
  const subscription = Linking.addEventListener('url', handleDeepLink);

  return () => {
    subscription.remove(); // 메모리 누수 방지
  };
}, []);


  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Start" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="KakaoLoginWebView" component={KakaoLoginWebView} />
        <Stack.Screen name="NaverLoginWebView" component={NaverLoginWebView} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="My" component={MyScreen} />
        <Stack.Screen name="MapScreen" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
