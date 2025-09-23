import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';
import styles from '../style/NewsSectionStyle';

if (Platform.OS === 'android') {
  Sound.setCategory('Playback');
}

interface DisasterInfo {
  urgency: '주의' | '경보' | '안전';
  summary: string;
}

// ------------------- 서비스 키 입력 -------------------
const SAFETY_DATA_API_KEY = '7753WFM75S171420';
// --------------------------------------------------------

const NewsSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [disasterInfo, setDisasterInfo] = useState<DisasterInfo | null>(null);

  useEffect(() => {
    const fetchAndProcessDisasterInfo = async () => {
      setIsLoading(true);
      try {
        const serviceKey = encodeURIComponent(SAFETY_DATA_API_KEY);
        const url = `https://www.safetydata.go.kr/V2/api/DSSP-IF-00247?serviceKey=${serviceKey}&pageNo=1&numOfRows=1&returnType=json`;

        const response = await fetch(url);
        const data = await response.json();
        
        // json 응답 구조
        const rawMessage = data?.body?.[0]?.MSG_CN; 
        
        if (!rawMessage) {
          setDisasterInfo({
            summary: '현재 새로운 재난 정보가 없습니다.',
            urgency: '안전',
          });
          setIsLoading(false);
          return;
        }

        // const formData = new FormData();
        // formData.append('text', rawMessage);
        
        // const summaryResponse = await fetch('http://127.0.0.1:8000/summarize', {
        //   method: 'POST',
        //   body: formData,
        // });
        // const summaryData = await summaryResponse.json();
        // const summaryText = summaryData.summary;

        setDisasterInfo({
          summary: rawMessage,
          urgency: rawMessage.includes('경보') ? '경보' : (rawMessage.includes('주의') ? '주의' : '안전'),
        });

      } catch (error) {
        console.error("재난 정보 처리 오류:", error);
        setDisasterInfo({
          summary: '현재 새로운 재난 정보가 없거나, 정보를 불러오는 데 실패했습니다.',
          urgency: '안전',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessDisasterInfo();
  }, []);

  const handlePressTTS = async () => {
    if (isTtsLoading || isPlaying || !disasterInfo?.summary) return;

    setIsTtsLoading(true);
    const path = `${RNFS.CachesDirectoryPath}/temp_audio.mp3`;

    try {
      const formData = new FormData();
      formData.append('text', disasterInfo.summary);

      const ttsResponse = await fetch('http://192.168.219.110:8000/tts', {
        method: 'POST',
        body: formData,
      });

      if (!ttsResponse.ok) throw new Error(`TTS Server error: ${ttsResponse.status}`);
      
      const audioBlob = await ttsResponse.blob();
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        const base64data = (reader.result as string).split(',')[1];
        RNFS.writeFile(path, base64data, 'base64').then(() => {
          const sound = new Sound(path, '', (error) => {
            setIsTtsLoading(false);
            if (error) return console.log('음성 파일 로드 실패', error);
            
            setIsPlaying(true);
            sound.play(() => {
              setIsPlaying(false);
              sound.release();
              RNFS.unlink(path).catch(err => console.log("임시 파일 삭제 실패", err));
            });
          });
        }).catch(err => {
          console.log('파일 쓰기 오류', err);
          setIsTtsLoading(false);
        });
      };
    } catch (error) {
      console.error('TTS 요청 오류:', error);
      setIsTtsLoading(false);
    }
  };

  const getUrgencyStyle = (urgency: '주의' | '경보' | '안전') => {
    switch (urgency) {
      case '경보': return styles.urgencyWarning;
      case '주의': return styles.urgencyCaution;
      default: return styles.urgencySafe;
    }
  };

  // 화면 렌더링 부분 (수정 필요 없음)
  return (
    <View style={styles.section}>
      <Text style={styles.title}>AI 안전 정보</Text>
      <View style={styles.card}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          disasterInfo && (
          <>
            <View style={styles.header}>
              <View style={[styles.urgencyBadge, getUrgencyStyle(disasterInfo.urgency)]}>
                <Text style={styles.urgencyText}>{disasterInfo.urgency}</Text>
              </View>
            </View>
            <Text style={styles.summaryText}>{disasterInfo.summary}</Text>
            <TouchableOpacity
              style={styles.ttsButton}
              onPress={handlePressTTS}
              disabled={isTtsLoading || isPlaying}
              activeOpacity={0.7}
            >
              {isTtsLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.ttsButtonText}>
                  {isPlaying ? '재생 중...' : '음성으로 듣기 �'}
                </Text>
              )}
            </TouchableOpacity>
          </>
          )
        )}
      </View>
    </View>
  );
};

export default NewsSection;