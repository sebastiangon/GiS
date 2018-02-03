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
        marginBottom: 15
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
        marginBottom: 15,
    },
    inputLabel: {
        marginTop: 10,
        marginLeft: 15,
        paddingBottom: 5,
        alignSelf: 'flex-start',
    },
    garageButton: {
        margin: 5,
        backgroundColor: '#147bcd',
        borderRadius: 6,
        width: '90%',
        alignSelf: 'center',
        alignItems: 'center',
        padding: 10,
    },
    green: {
        backgroundColor: 'green'
    },
    garageButtonText: {
        color: '#fff',
        fontSize: 20,
    },
    garageNotSet: {
        alignItems: 'center',
    },
    garageNotSetText: {
        color: 'red',
    },
    inputError: {
        borderBottomColor: '#f00',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    loading: {
        position: 'absolute',
        right: 20,
        bottom: 20
    },
    coordinates: {
        color: '#bbb',
        alignSelf: 'center'
    }
});