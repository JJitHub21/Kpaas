import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const scale = width / 360;

const styles = StyleSheet.create({
  container: {
    width,
    height: scale * 88,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 2,
    borderColor: '#00000026',
    paddingHorizontal: scale * 20,
    backgroundColor: '#fff',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: scale * 100,
  },
  label: {
    fontSize: scale * 14,
    color: '#000c49',
    fontFamily: 'NPS_font-Regular',
    marginTop: scale * 4,
  },
  labelInactive: {
    fontSize: scale * 14,
    color: '#b6b6b6',
    fontFamily: 'NPS_font-Regular',
    marginTop: scale * 4,
  },
  centerButton: {
    width: scale * 85,
    height: scale * 85,
    borderRadius: scale * 90,
    borderWidth: 3,
    borderColor: '#4b9fc280',
    backgroundColor: '#14b8a6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale * 25,
  },
  iconSize: {
    width: scale * 32,
  },
});

export default styles;
