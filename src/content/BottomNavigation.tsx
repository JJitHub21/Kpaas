import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Home, MessageCircle, User, LocateIcon } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles from '../style/BottomNavigationStyle';
import { RootStackParamList } from '../navigation/navigationType';

type BottomNavigationProps = {
  active: 'home' | 'my';
  userType: 'user' | 'guardian';
};

const BottomNavigation = ({ active, userType }: BottomNavigationProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      {/* 홈 아이콘 */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => {
          if (active !== 'home') navigation.navigate('Main');
        }}
      >
        <Home
          color={active === 'home' ? '#000c49' : '#b6b6b6'}
          size={styles.iconSize.width}
        />
        <Text
          style={active === 'home' ? styles.label : styles.labelInactive}
        >
          홈
        </Text>
      </TouchableOpacity>

      {/* 중앙 버튼 */}
      <TouchableOpacity
  style={[
    styles.centerButton,
    userType === 'guardian' && { backgroundColor: '#FFA94D' },
  ]}
  onPress={() => {
    if(userType === 'guardian') {
      navigation.navigate('MapScreen');
    }
    // TODO: user 타입일 때 동작 구현
  }}
>
  {userType === 'guardian' ? (
    <LocateIcon color="#fff" size={styles.iconSize.width} />
  ) : (
    <MessageCircle color="#fff" size={styles.iconSize.width} />
  )}
</TouchableOpacity>

      {/* 마이 아이콘 */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => {
          if (active !== 'my') navigation.navigate('My');
        }}
      >
        <User
          color={active === 'my' ? '#000c49' : '#b6b6b6'}
          size={styles.iconSize.width}
        />
        <Text
          style={active === 'my' ? styles.label : styles.labelInactive}
        >
          마이
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavigation;