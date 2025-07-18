import React from 'react';
import { View, Text } from 'react-native';
import { User } from 'lucide-react-native';
import styles from '../style/UserInfoStyle';

export default function UserInfo() {
  return (
    <View style={styles.container}>
      {/* 아바타 대용 아이콘 */}
      <View style={[styles.avatar, styles.fallback]}>
        <User size={36} color="#fff" style={{ alignSelf: 'center', marginTop: 7 }} />
      </View>

      {/* 텍스트 박스 */}
      <View style={styles.textBox}>
        <Text style={styles.name}>김진우</Text>
        <Text style={styles.sub}>로그인된 사용자</Text>
      </View>
    </View>
  );
}
