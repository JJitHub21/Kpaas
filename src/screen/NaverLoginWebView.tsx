import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigationType';
import CookieManager from '@react-native-cookies/cookies'; // 쿠키 충돌 관리 라이브러리

const CLIENT_ID = '-------'; // 네이버 개발자센터에서 발급
const STATE = 'RANDOM_STRING_1234'; // CSRF 방지용 문자열 (임의값 가능)
const REDIRECT_URI = 'http://3.37.99.32:8080/api/auth/login/naver'; // 딥링크와 백엔드 모두 동일하게 설정
const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${STATE}`;

export default function NaverLoginWebView() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleOpenAppLink = async (url: string) => {
    console.log('[NaverLoginWebView.tsx] 딥링크 URL 감지됨:', url);

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

      console.log('[NaverLoginWebView.tsx] accessToken:', accessToken);
      console.log('[NaverLoginWebView.tsx] refreshToken:', refreshToken);
      console.log('[NaverLoginWebView.tsx] nickname:', nickname);

      if (accessToken) {
        await AsyncStorage.setItem('jwt', accessToken);
        if (refreshToken) await AsyncStorage.setItem('refreshToken', refreshToken);
        if (nickname) await AsyncStorage.setItem('nickname', nickname);

        console.log('[NaverLoginWebView.tsx] AsyncStorage 저장 완료');

        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else {
        console.warn('[NaverLoginWebView.tsx] accessToken 없음');
      }
    } catch (error) {
      console.error('[NaverLoginWebView.tsx] 딥링크 처리 중 오류 발생:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: NAVER_AUTH_URL }}
        javaScriptEnabled
        originWhitelist={['*']}
        sharedCookiesEnabled={true} // ✅ 필수
        thirdPartyCookiesEnabled={true} // ✅ 필수
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
          if (url.startsWith('guard://')) {
            console.log('[WebView] guard:// URL 감지됨 (onNavigationStateChange)');
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
