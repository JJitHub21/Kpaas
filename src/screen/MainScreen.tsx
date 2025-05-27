import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import Header from '../content/Header';
import NewsSection from '../content/NewsSection';
import FeatureCards from '../content/FeatureCards';
import AiChatbotSection from '../content/AiChatbotSection';
import BottomNavigation from '../content/BottomNavigation';

const MainScreen = () => {
  return (
    <SafeAreaView style={styles.screen}>
      {/* 헤더 컴포넌트 상단 고정 */}
      <Header />
        <NewsSection />
        <FeatureCards />
        <AiChatbotSection />
      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 100,
  },
});

export default MainScreen;
