import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from '../content/Header';
import NewsSection from '../content/NewsSection';
import FeatureCards from '../content/FeatureCards';
import AiChatbotSection from '../content/AiChatbotSection';
import RecentActivityBox from '../content/RecentActivityBox'; // 보호자 전용
import BottomNavigation from '../content/BottomNavigation';
import UserGeofenceManager from '../components/UserGeofenceManager';
import LocationUploader from '../native/LocationUploader';

const MainScreen = () => {
  const [userType, setUserType] = useState<'user' | 'guardian' | null>(null);

  useEffect(() => {
    console.log('[MainScreen.tsx] MainScreen 진입함');

    const getUserType = async () => {
      const type = await AsyncStorage.getItem('userType');
      if (type === 'user' || type === 'guardian') {
        setUserType(type);
        console.log('[MainScreen.tsx] userType:', type);
      }
    };

    getUserType();
  }, []);

  if (!userType) return null; // 또는 로딩 화면을 추가해도 됨

  return (
    <SafeAreaView style={styles.screen}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
      <NewsSection />
      {userType === 'user' ? 
      <>
      <FeatureCards />
      {/* 피보호자(user)일 때만 지오펜스 관리 컴포넌트 렌더링 */}
      <UserGeofenceManager/>
      </>
       : <RecentActivityBox />}
      <AiChatbotSection />
      </ScrollView>
      <BottomNavigation active="home" userType={userType} />
      {userType === 'user' && <LocationUploader />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
  },
});

export default MainScreen;
