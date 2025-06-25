
import React from 'react';
import { View} from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigationType';

const REST_API_KEY = '---------';
const REDIRECT_URI = 'http://43.201.66.251:8080/api/auth/login/kakao';
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

export default function KakaoLoginWebView() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleOpenAppLink = async (url: string) => {
    console.log('[KakaoLoginWebView.tsx] 딥링크 URL 감지됨:', url);

    try {
      const queryString = url.split('?')[1];
      if (!queryString) {
        console.warn('[KakaoLoginWebView.tsx] URL에 쿼리 없음');
        return;
      }

      const queryParts = queryString.split('&');
      const params: Record<string, string> = {};

      queryParts.forEach((part) => {
        const [key, value] = part.split('=');
        if (key && value) {
          params[key] = decodeURIComponent(value);
        }
      });

      const accessToken = params['accessToken'];
      const refreshToken = params['refreshToken'];
      const nickname = params['nickname'];

      console.log('[KakaoLoginWebView.tsx] accessToken:', accessToken);
      console.log('[KakaoLoginWebView.tsx] refreshToken:', refreshToken);
      console.log('[KakaoLoginWebView.tsx] nickname:', nickname);

      if (accessToken) {
        await AsyncStorage.setItem('jwt', accessToken);
        if (refreshToken) await AsyncStorage.setItem('refreshToken', refreshToken);
        if (nickname) await AsyncStorage.setItem('nickname', nickname);
        console.log('[KakaoLoginWebView.tsx] AsyncStorage 저장 완료');

        navigation.reset({
          index: 0,
          routes: [{ name: 'Main', params: undefined }],
        });
        console.log('[KakaoLoginWebView.tsx] navigation.reset 실행됨');
      } else {
        console.warn('[KakaoLoginWebView.tsx] accessToken 없음');
      }
    } catch (error) {
      console.error('[KakaoLoginWebView.tsx] 딥링크 처리 중 오류 발생:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: KAKAO_AUTH_URL }}
        javaScriptEnabled
        originWhitelist={['*']}
        onShouldStartLoadWithRequest={(request) => {
          const url = request.url;
          console.log('[WebView] onShouldStartLoadWithRequest URL:', url);
          if (url.startsWith('guard://')) {
            console.log('[WebView] guard:// URL 감지됨 (onShouldStartLoadWithRequest)');
            handleOpenAppLink(url);
            return false;
          }
          return true;
        }}
        onNavigationStateChange={(navState) => {
          const url = navState.url;
          console.log('[WebView] onNavigationStateChange URL:', url);
          if (url.startsWith('guard://')) {
            console.log('[WebView] guard:// URL 감지됨 (onNavigationStateChange)');
            handleOpenAppLink(url);
          }
        }}
      />
    </View>
  );
}
