import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const scale = width / 360;

const styles = StyleSheet.create({
  section: {
    width: '100%',
    marginTop: scale * 10,
    alignItems: 'center',
  },
  title: {
    fontSize: scale * 18,
    textAlign: 'left',
    marginLeft: scale * 10,
    fontFamily: 'VITRO_PRIDE_TTF-Regular',
    marginBottom: scale * 6,
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#00000026',
    shadowColor: '#000',          // 그림자 색
    shadowOffset: { width: 0, height: 6 },  // 수직 방향만 그림자
    shadowOpacity: 0.9,           // 그림자의 투명도 (0~1)
    shadowRadius: 6,              // 번짐 정도 (blur)
    elevation: 5,
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: scale * 170,
    resizeMode: 'cover',
  },
  newsText: {
    position: 'absolute',
    top: scale * 150,
    width: '100%',
    fontSize: scale * 15,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Pretendard-SemiBold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: scale * 5,
  },
  dot: {
    marginHorizontal: scale * 4,
    borderRadius: scale * 4,
  },
  activeDot: {
    width: scale * 20,
    height: scale * 9,
    backgroundColor: '#707070',
  },
  inactiveDot: {
    width: scale * 9,
    height: scale * 9,
    backgroundColor: '#d9d9d9',
  },
  moreButton: {
    width: width - scale * 20,
    height: scale * 25,
    borderRadius: scale * 20,
    borderWidth: 2,
    borderColor: '#d9d9d9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: scale * 3,
  },
  moreButtonText: {
    fontSize: scale * 15,
    color: '#000',
    fontFamily: 'Pretendard-Medium',
  },
});

export default styles;
