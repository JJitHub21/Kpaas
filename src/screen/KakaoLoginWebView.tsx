
import React from 'react';
import { View} from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigationType';
import CookieManager from '@react-native-cookies/cookies'; // 쿠키 충돌 관리 라이브러리
import Config from 'react-native-config';

const REST_API_KEY = Config.REST_API_KEY;
const REDIRECT_URI = Config.REDIRECT_URI;

// 카카오 OAuth 인가 엔드포인트 (권한코드 발급 단계)
// 현재는 이후 백엔드가 토큰 교환 후 guard:// 스킴으로 앱을 리다이렉트
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

export default function KakaoLoginWebView() {
  // 로그인 성공 시 메인 화면으로 네비게이션 리셋
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  /**
   * 커스텀 스킴(guard://...) 딥링크를 처리
   * - URL 쿼리에서 accessToken / refreshToken / nickname을 파싱
   * - 토큰/닉네임을 AsyncStorage에 저장
   * - 메인 스택으로 reset
   */
  const handleOpenAppLink = async (url: string) => {
    console.log('[KakaoLoginWebView.tsx] 딥링크 URL 감지됨:', url);

    try {
      // guard://scheme?accessToken=...&refreshToken=...&nickname=...
      const queryString = url.split('?')[1];
      if (!queryString) return;

      // 쿼리 파싱
      const queryParts = queryString.split('&');
      const params: Record<string, string> = {};
      queryParts.forEach((part) => {
        const [key, value] = part.split('=');
        if (key && value) {
          params[key] = decodeURIComponent(value);
        }
      });

      // 백엔드가 전달한 정보
      const accessToken = params['accessToken'];
      const refreshToken = params['refreshToken'];
      const nickname = params['nickname'];
      const kakaoId = params['kakaoId'];

      console.log('[KakaoLoginWebView.tsx] accessToken:', accessToken);

      if (accessToken) {
        // 현재 구현: AsyncStorage에 토큰 저장
        await AsyncStorage.setItem('jwt', accessToken);
        if (refreshToken) await AsyncStorage.setItem('refreshToken', refreshToken);
        if (nickname) await AsyncStorage.setItem('nickname', nickname);
        if (kakaoId) await AsyncStorage.setItem('kakaoId', kakaoId);

        console.log('[KakaoLoginWebView.tsx] AsyncStorage 저장 완료');

        // 메인 화면으로 스택 초기화
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
        // 카카오 인가 페이지 로드
        source={{ uri: KAKAO_AUTH_URL }}
        javaScriptEnabled
        originWhitelist={['*']}

        // WebView와 네이티브 사이의 쿠키/세션 공유 설정
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}

        // 네비게이션 직전 URL 검사 훅
        // guard://로 시작하면 WebView 로드를 막고 네이티브 핸들러로 위임
        onShouldStartLoadWithRequest={(request) => {
          const url = request.url;
          console.log('[WebView] onShouldStartLoadWithRequest URL:', url);
          if (url.startsWith('guard://')) {
            handleOpenAppLink(url);
            return false;
          }
          return true;
        }}

        // 네비 상태가 변할 때도 URL을 감지
        onNavigationStateChange={(navState) => {
          const url = navState.url;
          if (url.startsWith('guard://')) {
            handleOpenAppLink(url);
          }
        }}

        // 페이지 로드 종료 시 쿠키 플러시
        onLoadEnd={() => {
          CookieManager.flush().then(() => {
            console.log('쿠키 flush 완료 (onLoadEnd)');
          });
        }}
      />
    </View>
  );
}
