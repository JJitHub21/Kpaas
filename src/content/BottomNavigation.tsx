import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Home, MessageCircle, User } from 'lucide-react-native';
import styles from '../style/BottomNavigationStyle';

const BottomNavigation = () => {
  return (
    <View style={styles.container}>
      <View style={styles.navItem}>
        <Home color="#000c49" size={styles.iconSize.width} />
        <Text style={styles.label}>홈</Text>
      </View>

      <TouchableOpacity style={styles.centerButton}>
        <MessageCircle color="#fff" size={styles.iconSize.width} />
      </TouchableOpacity>

      <View style={styles.navItem}>
        <User color="#b6b6b6" size={styles.iconSize.width} />
        <Text style={styles.labelInactive}>마이</Text>
      </View>
    </View>
  );
};

export default BottomNavigation;
