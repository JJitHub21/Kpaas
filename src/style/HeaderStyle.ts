import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const scale = width / 360;

const styles = StyleSheet.create({
  header: {
    width,
    height: scale * 62,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale * 12,
    borderTopWidth: 2,
    borderColor: '#00000026',
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    elevation: 5,
  },
  logo: {
    marginLeft: scale * 5,
    width: scale * 42,
    height: scale * 44,
    resizeMode: 'contain',
  },
  headerTitle: {
    textAlign: 'left',
    marginLeft: scale * 15,
    fontSize: scale * 25,
    color: '#000',
    fontFamily: 'NPS_font-Regular',
  },
  headerIcons: {
    position: 'absolute',
    right: scale * 17,
    top: 0,                      // 상단부터 시작
    height: scale * 62,          // 헤더 높이만큼 세팅
    flexDirection: 'row',
    alignItems: 'center',        // 세로 중앙 정렬
    gap: scale * 16,
  },
});

export const iconSize = scale * 32;
export default styles;
