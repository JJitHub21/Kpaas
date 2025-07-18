import React from 'react';
import { View, Text, Image } from 'react-native';
import { InfoIcon, Speaker } from 'lucide-react-native';
import styles, { iconSize } from '../style/HeaderStyle';

type HeaderProps = {
  title?: string;
};

const Header = ({ title = '홈' }: HeaderProps) => {
  return (
    <View style={styles.header}>
      <Image source={require('../image/Logo.png')} style={styles.logo} />
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerIcons}>
        <InfoIcon color="#e7a900" size={iconSize} />
        <Speaker color="#1e40af" size={iconSize} />
      </View>
    </View>
  );
};

export default Header;
