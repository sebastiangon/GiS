import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
      paddingTop: 20,
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'column'
    },
    activeTabContainer: {
      flex:1
    },
    activeTab: {
      height: 200,
      backgroundColor: '#cee4e5',
      marginBottom: 40,
      zIndex: 100
    }
  });