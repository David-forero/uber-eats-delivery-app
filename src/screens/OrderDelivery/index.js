import { useWindowDimensions, Text, View, ActivityIndicator, Pressable } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FontAwesome, Fontisto, FontAwesome5 } from '@expo/vector-icons';
import orders from '../../../assets/data/orders.json';
import styles from './styles';
import MapView, { Marker } from 'react-native-maps';
import { Entypo, Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const order = orders[0];

const restaurantLocation = { latitude: order.Restaurant.lat, longitude: order.Restaurant.lng }
const deliveryLocation = { latitude: order.User.lat, longitude: order.User.lng }

const ORDER_STATUSES = {
    READY_FOR_PICKUP: "READY_FOR_PICKUP",
    ACCEPTED: "ACCEPTED",
    PICKED_UP: "PICKED_UP"
}

const OrderDelivery = () => {
    const [driverLocation, setDriverLocation] = useState(null);
    const [totalMinutes, setTotalMinutes] = useState(0);
    const [totalKm, setTotalKm] = useState(0);
    const [deliveryStatus, setDeliveryStatus] = useState(ORDER_STATUSES.READY_FOR_PICKUP);
    const [isDriverClose, setIsDriverClose] = useState(false);

    const bottomSheetRef = useRef(null);
    const mapRef = useRef(null);
    const navigation = useNavigation();
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

    const onButtonpressed = () => {
        if (deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP) {
            bottomSheetRef.current?.collapse();
            mapRef.current.animateToRegion({
                latitude: driverLocation.latitude,
                longitude: driverLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            });
            setDeliveryStatus(ORDER_STATUSES.ACCEPTED);
        }

        if (deliveryStatus === ORDER_STATUSES.ACCEPTED) {
            setDeliveryStatus(ORDER_STATUSES.PICKED_UP)
        }

        if (deliveryStatus === ORDER_STATUSES.PICKED_UP) {
            bottomSheet.current?.collapse();
            navigation.goBack()
        }
    }

    const renderButtonTitle = () => {
        if (deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP) return "Accept Order"
        if (deliveryStatus === ORDER_STATUSES.ACCEPTED) return "Pick-Up Order"
        if (deliveryStatus === ORDER_STATUSES.PICKED_UP) return "Complete Delivery"
    }

    const isButtonDisabled = () => {
        if (deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP) return false
        if (deliveryStatus === ORDER_STATUSES.ACCEPTED && isDriverClose) return false
        if (deliveryStatus === ORDER_STATUSES.PICKED_UP && isDriverClose) return false
        return true
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <MapView
                ref={mapRef}
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
                    destination={deliveryStatus === ORDER_STATUSES.ACCEPTED ? restaurantLocation : deliveryLocation}
                    waypoints={deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP ? [restaurantLocation] : []}
                    strokeWidth={10}
                    strokeColor="#3FC060"
                    apikey="AIzaSyDhJdslXOk17LVzGww5z1iNOGOEpmf2xFM"
                    onReady={(results) => {
                        setIsDriverClose(results.distance < 0.1);
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
            {
                deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP && (
                    <Ionicons
                        onPress={() => navigation.goBack()}
                        name="arrow-back-circle"
                        size={45}
                        color="black"
                        styles={{ top: 40, left: 15, position: 'absolute' }}
                    />
                )
            }
            <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} handleIndicatorStyle={styles.handlerIndicator}>
                <View style={styles.handlerIndicatorContainer}>
                    <Text style={styles.routeDetailsText}>{totalMinutes.toFixed(1)} min</Text>
                    <FontAwesome
                        name="shopping-bag"
                        size={30}
                        color="#3FC060"
                        style={{ marginHorizontal: 10 }}
                    />
                    <Text style={styles.routeDetailsText}>{totalKm.toFixed(3)} km</Text>
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

                <Pressable style={{ ...styles.buttonContainer, backgroundColor: isButtonDisabled() ? 'grey' : '#3FC060' }} onPress={onButtonpressed} disabled={isButtonDisabled()}>
                    <Text style={styles.buttonText}>{renderButtonTitle()}</Text>
                </Pressable>
            </BottomSheet>
        </GestureHandlerRootView >
    )
}

export default OrderDelivery