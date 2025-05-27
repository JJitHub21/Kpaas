import React from 'react';
import { View, Text } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import styles from '../style/FeatureCardsStyle';

const FeatureCards = () => {
  return (
    <View style={styles.container}>
      {/* 공공 알림 카드 */}
      <View style={styles.publicCard}>
        <View style={styles.publicTextContainer}>
          <Text style={styles.publicText}>
            공공 알림{'\n'}재난 정보{'\n'}읽어드려요
          </Text>
        </View>
        <View style={styles.publicIconContainer}>
          <AlertTriangle color="white" size={styles.iconSize.width} />
        </View>
      </View>

      {/* SOS 카드 */}
      <View style={styles.sosWrapper}>
        <View style={styles.sosBellTop}>
          <View style={styles.bell1} />
          <View style={styles.bell2} />
          <View style={styles.bell3} />
        </View>
        <View style={styles.sosCardTop}>
          <Text style={styles.sosText}>3초 누르고 SOS</Text>
        </View>
        <View style={styles.sosCardBottom} />
      </View>
    </View>
  );
};

export default FeatureCards;
