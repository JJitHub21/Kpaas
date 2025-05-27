import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from '../style/AiChatbotSectionStyle';

const AiChatbotSection = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>아 맞다! AI 챗봇</Text>
      <View style={styles.separator} />
      <View style={styles.contentWrapper}>
        <View style={styles.chatBubble}>
          <Text style={styles.chatText}>
            ___님 좋은 하루에요!{'\n'}오늘 잊은 거 없으신가요?{'\n'}{'\n'}터치하여 저와 대화해요.
          </Text>
        </View>
        <Image source={require('../image/ChatAvatar.png')} style={styles.avatar} />
      </View>
    </View>
  );
};

export default AiChatbotSection;
