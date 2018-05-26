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
        padding: 15,
    },
    landingBtnDis: {
        margin: 5,
        backgroundColor: 'gray',
        borderRadius: 6,
        width: '90%',
        alignSelf: 'center',
        alignItems: 'center',
        padding: 15,
    },
    landingBtnText: {
        color: 'white',
    },
    image: {
        width: 100,
        height: 100,
        marginLeft: 5,
    },
    dot8: {
        opacity: .8
    },
    connectionIndicators: {
        margin: 20,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageFrame: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 150,
        height: 150,
        margin: 20,
        backgroundColor: 'rgba(255, 255, 255, .4)',
        borderRadius: 15,
    },
    loading: {
        position: 'absolute',
        top: 60,
        left: 60
    }
});