import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
    },
    box: {
        marginTop: 70,
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        margin: 10,
        fontWeight: '600',
    },
    save: {
        margin: 10,
        backgroundColor: '#147bcd',
        borderRadius: 6,
        width: 100,
        alignSelf: 'center',
        alignItems: 'center',
        padding: 10,
    },
    saveText: {
        color: '#fff',
        fontSize: 20,
    },
    inputLabel: {
        marginLeft: 20,
        alignSelf: 'flex-start'
    },
    input: {
        fontSize: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#777',
        width: 120,
        marginTop: 10,
        marginBottom: 20,
        textAlign: 'center'
    },
    inputError: {
        borderBottomColor: '#f00',
    }
});