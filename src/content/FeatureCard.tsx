// content/FeatureCard.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FeatureCardProps {
  label: string;
  height?: number; // optional height (기본값 제공)
  onPress?: () => void;
}

export default function FeatureCard({ label, height = SCREEN_HEIGHT * 0.09, onPress }: FeatureCardProps) {
  return (
    <TouchableOpacity style={[styles.card, { height }]} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH * 0.96,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    justifyContent: 'center',
    paddingLeft: 20,
    marginBottom: 10,
  },
  label: {
    fontSize: 17,
    fontFamily: 'NotoSansKR-Medium',
    color: '#000',
  },
});
