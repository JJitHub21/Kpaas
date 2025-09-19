import React, { useRef } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigationType';
import CookieManager from '@react-native-cookies/cookies';
import Config from 'react-native-config';

// URL/URLSearchParams 폴리필 (안드로이드 Hermes 대응)
import 'react-native-url-polyfill/auto';

const REST_API_KEY = Config.REST_API_KEY;
const REDIRECT_URI = Config.REDIRECT_URI;
const KAKAO_AUTH_URL =
  `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

export default function KakaoLoginWebView() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const handledRef = useRef(false);      // 딥링크 중복 처리 방지
  const hookCountRef = useRef({ shouldStart: 0, stateChange: 0 });

  // ---------- 유틸: 안전 파서 (URL 실패 시 수동 파싱 폴백) ----------
  const parseDeepLinkParams = (url: string) => {
    try {
      const u = new URL(url);
      const q = u.searchParams;
      return {
        accessToken:  q.get('accessToken')  ?? '',
        refreshToken: q.get('refreshToken') ?? '',
        nickname:     q.get('nickname')     ?? '',
        kakaoId:      q.get('kakaoId')      ?? '',
      };
    } catch (e) {
      console.warn('[KakaoLoginWebView] URL 파싱 실패 → 수동 파싱 폴백 사용:', e);
      const [, qs] = url.split('?');
      const out: Record<string, string> = {};
      if (qs) {
        qs.split('&').forEach((kv) => {
          const [k, v = ''] = kv.split('=');
          if (k) out[k] = decodeURIComponent(v);
        });
      }
      return {
        accessToken:  out['accessToken']  ?? '',
        refreshToken: out['refreshToken'] ?? '',
        nickname:     out['nickname']     ?? '',
        kakaoId:      out['kakaoId']      ?? '',
      };
    }
  };

  // ---------- 핵심: 딥링크 핸들러 ----------
  const handleOpenAppLink = async (url: string, from: 'shouldStart' | 'stateChange') => {
    if (handledRef.current) {
      console.log('[KakaoLoginWebView] 이미 처리됨(handledRef=true). 호출 출처:', from);
      return;
    }
    console.log('[KakaoLoginWebView] 딥링크 감지 from=', from, ' url=', url);

    try {
      const { accessToken, refreshToken, nickname, kakaoId } = parseDeepLinkParams(url);

      // 로그(민감정보 10자만)
      const trunc = (s: string) => (s ? s.slice(0, 10) + '...' : '');
      console.log('[KakaoLoginWebView] 파싱 결과',
        '\n  accessToken:', trunc(accessToken),
        '\n  refreshToken:', trunc(refreshToken),
        '\n  nickname:', nickname || '(없음)',
        '\n  kakaoId:', kakaoId || '(없음)'
      );

      if (!accessToken) {
        console.warn('[KakaoLoginWebView] accessToken 없음 → 처리 중단');
        return;
      }

      console.log('[KakaoLoginWebView] AsyncStorage 저장 시작');
      await AsyncStorage.setItem('jwt', accessToken);
      if (refreshToken) await AsyncStorage.setItem('refreshToken', refreshToken);
      if (nickname)     await AsyncStorage.setItem('nickname', nickname);
      if (kakaoId)      await AsyncStorage.setItem('kakaoId', kakaoId);

      // 저장 검증용 읽기 (kakaoId만 확인)
      const savedKakaoId = await AsyncStorage.getItem('kakaoId');
      console.log('[KakaoLoginWebView] kakaoId 저장 확인:', savedKakaoId || '(없음)');

      const userType = (await AsyncStorage.getItem('userType')) as 'user' | 'guardian' | null;
      console.log('[KakaoLoginWebView] userType:', userType);

      handledRef.current = true;
      const nextRoute = userType === 'guardian' ? 'GuardianRegister' : 'Main';
      console.log('[KakaoLoginWebView] 네비게이션 reset →', nextRoute);

      navigation.reset({
        index: 0,
        routes: [{ name: nextRoute as keyof RootStackParamList }],
      });
    } catch (e) {
      console.error('[KakaoLoginWebView] 딥링크 처리 오류:', e);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: KAKAO_AUTH_URL }}
        javaScriptEnabled
        originWhitelist={['*']}
        sharedCookiesEnabled
        thirdPartyCookiesEnabled

        // guard://로 시작하면 네이티브 처리 → WebView 로드는 막음
        onShouldStartLoadWithRequest={(req) => {
          hookCountRef.current.shouldStart += 1;
          const url = req?.url ?? '';
          console.log(
            '[WebView] onShouldStartLoadWithRequest 호출 #',
            hookCountRef.current.shouldStart,
            '\n  URL:', url
          );
          if (url.startsWith('guard://')) {
            handleOpenAppLink(url, 'shouldStart');
            return false;
          }
          return true;
        }}

        // 보조 훅: 일부 기기/상황에서만 트리거. handledRef로 재진입 방지.
        onNavigationStateChange={(state) => {
          hookCountRef.current.stateChange += 1;
          const url = state?.url ?? '';
          console.log(
            '[WebView] onNavigationStateChange 호출 #',
            hookCountRef.current.stateChange,
            '\n  URL:', url
          );
          if (url.startsWith('guard://')) {
            handleOpenAppLink(url, 'stateChange');
          }
        }}

        onLoadEnd={() => {
          CookieManager.flush().then(() => console.log('[WebView] 쿠키 flush 완료'));
        }}
      />
    </View>
  );
}
