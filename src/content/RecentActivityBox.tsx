import React from 'react';
import { View, Text } from 'react-native';
import styles from '../style/RecentActivityBoxStyle';

const RecentActivityBox = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>최근 활동 내역</Text>
      <Text style={styles.description}>위험지역 접근 1회, 이동 경로 이탈 0회</Text>
    </View>
  );
};

export default RecentActivityBox;
