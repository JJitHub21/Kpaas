
import React from 'react';
import { View} from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigationType';
import CookieManager from '@react-native-cookies/cookies'; // 쿠키 충돌 관리 라이브러리

const REST_API_KEY = '2fc2526baed473bcdab5a49151d8c70c';
const REDIRECT_URI = 'http://3.37.99.32:8080/api/auth/login/kakao';
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

export default function KakaoLoginWebView() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleOpenAppLink = async (url: string) => {
    console.log('[KakaoLoginWebView.tsx] 딥링크 URL 감지됨:', url);

    try {
      const queryString = url.split('?')[1];
      if (!queryString) return;

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

      if (accessToken) {
        await AsyncStorage.setItem('jwt', accessToken);
        if (refreshToken) await AsyncStorage.setItem('refreshToken', refreshToken);
        if (nickname) await AsyncStorage.setItem('nickname', nickname);

        console.log('[KakaoLoginWebView.tsx] AsyncStorage 저장 완료');

        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
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
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        onShouldStartLoadWithRequest={(request) => {
          const url = request.url;
          console.log('[WebView] onShouldStartLoadWithRequest URL:', url);
          if (url.startsWith('guard://')) {
            handleOpenAppLink(url);
            return false;
          }
          return true;
        }}
        onNavigationStateChange={(navState) => {
          const url = navState.url;
          if (url.startsWith('guard://')) {
            handleOpenAppLink(url);
          }
        }}
        onLoadEnd={() => {
          CookieManager.flush().then(() => {
            console.log('🍪 쿠키 flush 완료 (onLoadEnd)');
          });
        }}
      />
    </View>
  );
}
