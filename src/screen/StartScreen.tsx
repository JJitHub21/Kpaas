import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Start: undefined;
  Login: undefined;
};

const StartScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <View style={styles.textBox}>
          <Text style={styles.subTitle}>나만의 든든한</Text>
          <Text style={styles.title}>경호원</Text>
        </View>
        <Image
          source={require('../image/Logo.png')}
          style={styles.logo}
          resizeMode="cover"
          accessibilityLabel="Security guard logo"
        />
      </View>
    </View>
  );
};
export default StartScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 360,
    height: 780,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBox: {
    alignItems: 'center',
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 35,
    color: '#000',
    fontFamily: 'VITRO PRIDE TTF',
    textAlign: 'center',
  },
  title: {
    fontSize: 65,
    color: '#2563eb',
    fontFamily: 'VITRO CORE TTF',
    textAlign: 'center',
  },
  logo: {
    width: 126,
    height: 175,
  },
});
