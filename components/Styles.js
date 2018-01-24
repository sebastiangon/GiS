import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
      marginTop: 35,
      justifyContent: 'center',
      alignItems: 'stretch'
    },
    title: {
      flexDirection: 'row',
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'center',
      paddingRight: 5,
      paddingLeft: 5,
      backgroundColor: '#FBB554',
    },
    titleText: {
      fontSize: 20,
      color: '#eee',
      fontWeight: 'bold'
    },
    header: {
      flexDirection: 'row',
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'center',
      paddingRight: 5,
      paddingLeft: 5,
      borderBottomWidth: 1,
      borderRadius: 3,
      borderBottomColor: '#ddd',
      borderBottomWidth: 0,
      shadowColor: '#ffcf8e',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
    },
    contingency: {
      margin: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    body: {
      alignSelf: 'stretch'
    }
  });