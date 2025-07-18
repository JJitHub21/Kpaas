import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    width: 335,
    height: 162,
    backgroundColor: '#fdf3d5',
    borderColor: '#000',
    borderWidth: 0.5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    alignSelf: 'center',
    marginVertical: 12,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#444',
  },
});
