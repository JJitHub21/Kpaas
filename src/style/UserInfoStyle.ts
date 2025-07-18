import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  fallback: {
    backgroundColor: '#b6b6b6',
  },
  textBox: {
    flexDirection: 'column',
  },
  name: {
    fontSize: 20,
    fontFamily: 'Noto_Sans_KR-Bold',
    color: '#000',
  },
  sub: {
    fontSize: 15,
    fontFamily: 'Noto_Sans_KR-DemiLight',
    color: '#00000080',
  },
});
