import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
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
        alignSelf: 'center',
        marginBottom: 10
    },
    input: {
        marginLeft: 15,
        marginRight: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#777',
        width: '90%',
        marginBottom: 20,
    },
    inputLabel: {
        marginLeft: 15,
        paddingBottom: 10,
        alignSelf: 'flex-start',
    }
});