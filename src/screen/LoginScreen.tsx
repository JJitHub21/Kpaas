
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { loginStyle as styles } from '../style/loginStyle';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigationType';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const [selected, setSelected] = useState<'user' | 'guardian'>('user');
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = (type: string) => {
  console.log('[LoginScreen.tsx] handleLogin 진입');
  if (type === 'kakao') {
    console.log('[LoginScreen.tsx] 카카오 로그인 버튼 클릭됨');
    navigation.navigate('KakaoLoginWebView');
  } else if (type === 'naver') {
    console.log('[LoginScreen.tsx] 네이버 로그인 버튼 클릭됨');
    navigation.navigate('NaverLoginWebView');
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
      <View style={styles.titleSection}>
        <Text style={styles.title}>경호원</Text>
        <Text style={styles.subtitle}>로그인</Text>
      </View>
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
