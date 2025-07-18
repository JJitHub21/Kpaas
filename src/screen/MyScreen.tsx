import React from 'react';
import {
  ScrollView,
  View,
  Alert,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from '@react-native-cookies/cookies';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Header from '../content/Header';
import UserInfo from '../content/UserInfo';
import FeatureCard from '../content/FeatureCard';
import BottomNavigation from '../content/BottomNavigation';
import { RootStackParamList } from '../navigation/navigationType';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type MyScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function MyScreen() {
  const navigation = useNavigation<MyScreenNavigationProp>();

  const handleLogout = async () => {
    try {
      // 1. AsyncStorage에 저장된 토큰 및 사용자 정보 삭제
      await AsyncStorage.multiRemove(['jwt', 'refreshToken', 'nickname']);
      console.log('[Logout] AsyncStorage cleared');

      // 2. WebView 쿠키 삭제 (Kakao/Naver 세션 제거)
      await CookieManager.clearAll(true);
      console.log('[Logout] CookieManager cleared');

      // 3. 로그인 화면으로 이동
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
      Alert.alert('오류', '로그아웃에 실패했습니다.');
    }
  };

  const handleLogoutPress = () => {
    Alert.alert(
      '로그아웃 확인',
      '정말 로그아웃 하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '로그아웃', onPress: handleLogout, style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="마이" />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <UserInfo />
        <FeatureCard label="대피소 찾기" height={SCREEN_HEIGHT * 0.1} />
        <FeatureCard label="재난 상황별 행동요령" height={SCREEN_HEIGHT * 0.07} />
        <FeatureCard label="공지사항" height={SCREEN_HEIGHT * 0.07} />
        <FeatureCard
          label="계정 로그아웃"
          height={SCREEN_HEIGHT * 0.07}
          onPress={handleLogoutPress}
        />
      </ScrollView>
      <BottomNavigation active="my" />
    </View>
  );
}
