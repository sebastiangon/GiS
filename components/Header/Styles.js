import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    index: {
        zIndex: 1000
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset:{  width: 1,  height: 5,  },
        shadowColor: 'black',
        shadowOpacity: .3,
        elevation: 5
    },
    contingency: {
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
});