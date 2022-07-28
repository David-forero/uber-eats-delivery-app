import { useWindowDimensions, Text, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FontAwesome, Fontisto, FontAwesome5 } from '@expo/vector-icons';
import orders from '../../../assets/data/orders.json';
import styles from './styles';
import MapView, { Marker } from 'react-native-maps';
import { Entypo } from '@expo/vector-icons';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const order = orders[0];

const OrderDelivery = () => {
    const [driverLocation, setDriverLocation] = useState(null);
    const [totalMinutes, setTotalMinutes] = useState(null);
    const [totalKm, setTotalKm] = useState(null);

    const bottomSheetRef = useRef(null);
    const { width, height } = useWindowDimensions();

    const snapPoints = useMemo(() => ['12%', '95%'], []);

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

            const foregroundSubscription = Location.watchPositionAsync({
                accuracy: Location.Accuracy.High,
                distanceInterval: 100,
            }, (updatedLocation) => {
                setDriverLocation({
                    latitude: updatedLocation.coords.latitude,
                    longitude: updatedLocation.coords.longitude
                })
            });
    
            return foregroundSubscription;
        })();
    }, [])

    if (!driverLocation) {
        return <ActivityIndicator size={"large"} />
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <MapView
                style={{ height, width }}
                showUserLocation
                followUserLocation
                initialRegion={{
                    latitude: driverLocation.latitude,
                    longitude: driverLocation.longitude,
                    latitudeDelta: 0.07,
                    longitudeDelta: 0.07
                }}
            >

                <MapViewDirections
                    origin={driverLocation}
                    destination={{
                        latitude: order.User.lat,
                        longitude: order.User.lng,
                    }}
                    waypoints={[{ latitude: order.Restaurant.lat, longitude: order.Restaurant.lng }]}
                    strokeWidth={10}
                    strokeColor="#3FC060"
                    apikey="AIzaSyDhJdslXOk17LVzGww5z1iNOGOEpmf2xFM"
                    onReady={(results) => {
                        setTotalMinutes(results.duration);
                        setTotalKm(results.distance);
                    }}
                />
                <Marker
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

                <Marker
                    title={order.User.name}
                    description={order.User.address}
                    coordinate={{
                        latitude: order.User.lat,
                        longitude: order.User.lng
                    }}
                >
                    <View style={{ backgroundColor: 'green', padding: 5, borderRadius: 20 }}>
                        <MaterialCommunityIcons name="food-outline" size={24} color="white" />
                    </View>
                </Marker>
            </MapView>
            <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} handleIndicatorStyle={styles.handlerIndicator}>
                <View style={styles.handlerIndicatorContainer}>
                    <Text style={styles.routeDetailsText}>{totalMinutes ? totalMinutes.toFixed(1) : 'Loading...'} min</Text>
                    <FontAwesome
                        name="shopping-bag"
                        size={30}
                        color="#3FC060"
                        style={{ marginHorizontal: 10 }}
                    />
                    <Text style={styles.routeDetailsText}>{totalKm ? totalKm.toFixed(3) : 0} km</Text>
                </View>

                <View style={styles.deliveryDetailsContainer}>
                    <Text style={styles.restaurantName}>{order.Restaurant.name}</Text>
                    <View style={styles.addressContainer}>
                        <Fontisto name="shopping-store" size={22} color="grey" />

                        <Text style={styles.addressText}>{order.Restaurant.address}</Text>
                    </View>

                    <View style={styles.addressContainer}>
                        <FontAwesome5 name="map-marker-alt" size={30} color="grey" />
                        <Text style={styles.addressText}>{order.User.address}</Text>
                    </View>

                    <View style={styles.orderDetailsContainer}>
                        <Text style={styles.orderItemText}>Onion Rings x1</Text>
                        <Text style={styles.orderItemText}>Big Mac x3</Text>
                        <Text style={styles.orderItemText}>Big Tasty x2</Text>
                        <Text style={styles.orderItemText}>Coca-cola x1</Text>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Accept Order</Text>
                </View>
            </BottomSheet>
        </GestureHandlerRootView >
    )
}

export default OrderDelivery