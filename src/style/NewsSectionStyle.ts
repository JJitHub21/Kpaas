import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
// 화면 너비 360을 기준으로 스케일 값을 계산합니다.
const scale = width / 360;

const styles = StyleSheet.create({
  section: {
    width: '100%',
    paddingHorizontal: scale * 10,
    marginTop: scale * 10,
    marginBottom: scale * 10,
  },
  title: {
    fontSize: scale * 18,
    fontFamily: 'VITRO_PRIDE_TTF-Regular',
    marginBottom: scale * 8,
    marginLeft: scale * 5,
    color: '#333',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale * 12,
    padding: scale * 16,
    // 그림자 효과 (iOS & Android)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    minHeight: scale * 170, // 기존 이미지 높이와 유사하게 최소 높이 설정
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale * 12,
  },
  urgencyBadge: {
    paddingVertical: scale * 4,
    paddingHorizontal: scale * 10,
    borderRadius: scale * 20,
  },
  // 긴급도 '경보' 스타일
  urgencyWarning: {
    backgroundColor: '#FFDCDC', // 연한 빨강
  },
  // 긴급도 '주의' 스타일
  urgencyCaution: {
    backgroundColor: '#FFF5CC', // 연한 노랑
  },
  // 긴급도 '안전' 스타일
  urgencySafe: {
    backgroundColor: '#E6F4EA', // 연한 초록
  },
  urgencyText: {
    fontSize: scale * 13,
    fontFamily: 'Pretendard-Bold',
    color: '#222',
  },
  summaryText: {
    fontSize: scale * 15,
    fontFamily: 'Pretendard-Medium',
    color: '#444',
    lineHeight: scale * 22, // 줄 간격 설정으로 가독성 향상
    flex: 1, // 남은 공간을 모두 차지하도록 설정
  },
  ttsButton: {
    backgroundColor: '#007AFF', // 시선을 끄는 파란색 계열
    borderRadius: scale * 8,
    paddingVertical: scale * 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: scale * 16,
    flexDirection: 'row',
  },
  ttsButtonText: {
    fontSize: scale * 15,
    fontFamily: 'Pretendard-SemiBold',
    color: '#FFFFFF',
  },
});

export default styles;
