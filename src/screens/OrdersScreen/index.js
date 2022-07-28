import { useRef, useMemo, useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, useWindowDimensions, ActivityIndicator } from 'react-native'
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import orders from '../../../assets/data/orders.json';
import OrderItem from '../../components/OrderItem';
import MapView, { Marker } from 'react-native-maps';
import { Entypo } from '@expo/vector-icons';
import * as Location from 'expo-location';

const order = orders[0];

const OrdersScreen = () => {
    const [driverLocation, setDriverLocation] = useState(null);

    const bottomSheetRef = useRef(null);
    const { width, height } = useWindowDimensions();

    const snapPoints = useMemo(() => ["12%", "95%"], []);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (!status === 'granted') {
                console.log('nel');
                return;
            }

            let location = await Location.getCurrentPositionAsync();
            setDriverLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });
        })();
    }, []);

    if (!driverLocation) {
        return <ActivityIndicator size={"large"} />
    }

    return (
        <GestureHandlerRootView style={{ backgroundColor: "lightblue", flex: 1 }}>
            <MapView 
                style={{ height, width }} 
                showUserLocation 
                followUserLocation 
               
            >
                {orders.map((order, index) => (
                    <Marker
                        key={index}
                        title={order.Restaurant.name}
                        description={order.Restaurant.address}
                        coordinate={{
                            latitude: order.Restaurant.lat,
                            longitude: order.Restaurant.lng
                        }}
                    >
                        <View style={{ backgroundColor: 'green', padding: 5, borderRadius: 20 }}>
                            <Entypo name="shop" size={24} color="white" />
                        </View>
                    </Marker>
                ))}
            </MapView>
            <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
                <View style={{ marginBottom: 30, alignItems: "center" }}>
                    <Text style={{ fontSize: 20, fontWeight: '600', letterSpacing: 0.5, paddingBottom: 5 }}>You're Online</Text>
                    <Text style={{ letterSpacing: 0.5, color: 'gray' }}>Available Orders:</Text>
                </View>
                <FlatList
                    data={orders}
                    renderItem={({ item }) => <OrderItem order={item} />}
                />
            </BottomSheet>
        </GestureHandlerRootView>

    )
}

export default OrdersScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: 'grey',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
});