import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const loginStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleSection: {
    marginTop: SCREEN_HEIGHT * 0.103,
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontFamily: 'VITRO CORE TTF',
    color: '#000',
  },
  subtitle: {
    marginTop: SCREEN_HEIGHT * 0.013,
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
  },
  loginTypeSection: {
    alignItems: 'center',
  },
  loginHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  line: {
    width: SCREEN_WIDTH * 0.278,
    height: 2,
    backgroundColor: '#ccc',
  },
  loginHeaderText: {
    marginHorizontal: 8,
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#494949',
  },
  loginButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  loginCard: {
    width: SCREEN_WIDTH * 0.403,
    height: SCREEN_HEIGHT * 0.167,
    backgroundColor: '#eee',
    borderRadius: 30,
    elevation: 0.1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCard: {
    width: SCREEN_WIDTH * 0.403,
    height: SCREEN_HEIGHT * 0.167,
    backgroundColor: '#fff',
    borderRadius: 30,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#000',
  },
  halfCircleContainer: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    position: 'relative',
    bottom: 0,
  },
  halfCircle: {
    width: SCREEN_WIDTH * 1.25,
    height: SCREEN_WIDTH * 0.7,
    backgroundColor: '#2563EB',
    borderTopLeftRadius: SCREEN_WIDTH * 0.5,
    borderTopRightRadius: SCREEN_WIDTH * 0.5,
    position: 'absolute',
    bottom: 0,
    zIndex: 0,
  },
  socialButtonContainer: {
    paddingTop: SCREEN_HEIGHT * 0.064,
    paddingBottom: SCREEN_HEIGHT * 0.064,
    gap: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: SCREEN_HEIGHT * 0.062,
    borderRadius: 5,
    width: SCREEN_WIDTH * 0.886,
  },
  socialIcon: {
    width: SCREEN_WIDTH * 0.067,
    height: SCREEN_WIDTH * 0.067,
    marginRight: 12,
  },
  socialText: {
    textAlign: 'center',
    flex: 1,
    fontSize: 17,
    fontFamily: 'Pretendard-SemiBold',
  },
});
