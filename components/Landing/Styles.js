import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
    },
    landingBtn: {
        margin: 5,
        backgroundColor: '#147bcd',
        borderRadius: 6,
        width: '90%',
        alignSelf: 'center',
        alignItems: 'center',
        padding: 10,
    },
    image: {
        width: 100,
        height: 100,
        marginLeft: 5,
    },
    connectionIndicators: {
        margin: 20,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageFrame: {
        width: 100,
        margin: 20,
    },
    loading: {
        position: 'absolute',
        top: 37,
        left: 37
    }
});