import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { loginStyle as styles } from '../style/loginStyle';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigationType';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 네비게이션 타입 정의
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const [selected, setSelected] = useState<'user' | 'guardian'>('user');
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // ✅ 딥링크 수신 처리
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = new URL(event.url);
      const token = url.searchParams.get('token');

      if (token) {
        AsyncStorage.setItem('jwt', token)
          .then(() => {
            Alert.alert('로그인 성공', '환영합니다!');
            navigation.navigate('Main');
          })
          .catch(() => {
            Alert.alert('에러', '토큰 저장에 실패했어요.');
          });
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    // 앱이 꺼져 있다가 링크로 켜졌을 경우
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      subscription.remove();
    };
  }, [navigation]);

  // 로그인 버튼 핸들러
  const handleLogin = (type: string) => {
    if (type === 'kakao') {
      Linking.openURL('https://your-backend.com/oauth2/authorization/kakao');
    } else {
      console.log(`${type} 로그인 시도`);
      navigation.navigate('Main');
    }
  };

  const socialLogins = [
    {
      id: 'kakao',
      label: '카카오톡 계정으로 로그인',
      bgColor: '#fee500',
      textColor: '#000000',
      icon: require('../image/kakao-icon.png'),
    },
    {
      id: 'naver',
      label: '네이버 계정으로 로그인',
      bgColor: '#00c73c',
      textColor: '#fff',
      icon: require('../image/naver-icon.png'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* 제목 */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>경호원</Text>
        <Text style={styles.subtitle}>로그인</Text>
      </View>

      {/* 로그인 유형 */}
      <View style={styles.loginTypeSection}>
        <View style={styles.loginHeader}>
          <View style={styles.line} />
          <Text style={styles.loginHeaderText}>로그인 유형</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.loginButtons}>
          {['user', 'guardian'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[type === selected ? styles.selectedCard : styles.loginCard]}
              onPress={() => setSelected(type as 'user' | 'guardian')}
            >
              <Text style={styles.cardText}>
                {type === 'user' ? '이용자 로그인' : '보호자 로그인'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 파란색 반원 + 소셜 로그인 버튼 */}
      <View style={styles.halfCircleContainer}>
        <View style={styles.halfCircle} />
        <View style={styles.socialButtonContainer}>
          {socialLogins.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.socialButton, { backgroundColor: item.bgColor }]}
              onPress={() => handleLogin(item.id)}
            >
              <Image source={item.icon} style={styles.socialIcon} />
              <Text style={[styles.socialText, { color: item.textColor }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
