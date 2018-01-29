import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1
    },
    title: {
        fontSize: 30,
        margin: 10,
        fontWeight: '600',
    },
    separator: {
        width: '95%',
        borderColor: '#aaa',
        borderWidth: StyleSheet.hairlineWidth,
        alignSelf: 'center'
    },
    listItem: {
        margin: 10,
    },
    listItemTitle: {
        fontWeight: '600'
    },
    listItemDetail: {
        fontWeight: '200'
    },
    touchableOpacityStyle:{
        position: 'absolute',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
    },
    floatingButtonStyle: {
        backgroundColor: '#2e6dea',
        borderRadius: 70,
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    floatingButtonText: {
        color: '#eee',
        fontSize: 60,
        fontWeight: '200',
        alignSelf: 'center',
        marginBottom: 7
    }
});