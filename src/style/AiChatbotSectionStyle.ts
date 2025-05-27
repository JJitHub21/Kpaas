import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const scale = width / 360;

const styles = StyleSheet.create({
  card: {
    width: scale * 335,
    height: scale * 155,
    marginTop: scale * 10,
    marginBottom: scale * 13,
    marginHorizontal: scale * 12,
    borderRadius: scale * 15,
    paddingTop: scale * 8,
    backgroundColor: '#f9d9ec', // 단순화: 그라데이션 대신 단일 색상
    elevation: 5,
  },
  title: {
    color: '#ffffff',
    fontSize: scale * 15,
    fontWeight: 'bold',
    fontFamily: 'NPS_font-Bold',
    marginLeft: scale * 10,
    marginBottom: scale * 6,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: scale * 5,
  },
  contentWrapper: {
    flexDirection: 'row',
    marginTop: scale * 10,
  },
  chatBubble: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: scale * 20,
    width: scale * 264,
    height: scale * 105,
    padding: scale * 10,
    justifyContent: 'center',
    elevation: 3,
    left: scale * 8,
  },
  chatText: {
    fontSize: scale * 17,
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Noto_Sans_KR-Regular',
  },
  avatar: {
    width: scale * 60,
    height: scale * 60,
    resizeMode: 'contain',
    marginLeft: 'auto',
  },
});

export default styles;
