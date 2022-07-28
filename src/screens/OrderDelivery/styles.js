import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        backgroundColor: 'lightblue', 
        flex: 1
    },
    handlerIndicator: {
        backgroundColor: 'grey', 
        width: 100
    },
    handlerIndicatorContainer: {
        flexDirection: 'row', 
        alignItems: "center", 
        justifyContent: "center", 
        marginTop: 10, 
        marginBottom: 20
    },
    routeDetailsText: {
        fontSize: 25, letterSpacing: 1
    },
    deliveryDetailsContainer: {
        paddingHorizontal: 20
    },
    restaurantName: {
        fontSize: 25, 
        letterSpacing: 1, 
        paddingVertical: 20
    },
    addressContainer: {
        flexDirection: 'row', 
        marginBottom: 20, 
        alignItems: "center"
    },
    addressText: {
        fontSize: 20, 
        color: "grey",
        fontWeight: '500', 
        letterSpacing: 0.5, 
        marginLeft: 15
    },
    orderDetailsContainer: {
        borderTopWidth: 1, 
        borderColor: 'lightgrey', 
        paddingTop: 20
    },
    orderItemText: {
        fontSize: 18, 
        color: 'grey', 
        fontWeight: '500', 
        letterSpacing: 0.5, 
        marginBottom: 5
    },
    buttonContainer: {
        backgroundColor: "#3FC060", 
        marginTop: 'auto', 
        marginBottom: 30, 
        marginHorizontal: 10, 
        marginVertical: 10, 
        borderRadius: 10
    },
    buttonText: {
        color: 'white', 
        paddingVertical: 15, 
        fontSize: 25, 
        fontWeight: '500', 
        textAlign: 'center', 
        letterSpacing: 0.5
    }
})