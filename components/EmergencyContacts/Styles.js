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
    }
});