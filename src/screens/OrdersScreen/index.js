import { useRef, useMemo, useEffect, useState } from 'react';
import { Text, View, useWindowDimensions, ActivityIndicator } from 'react-native'
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import OrderItem from '../../components/OrderItem';
import MapView from 'react-native-maps';
import { DataStore } from 'aws-amplify';
import CustomMarker from '../../components/CustomMarker';
import * as Location from "expo-location";
import { Order } from '../../models'


const OrdersScreen = () => {
    const [orders, setOrders] = useState([]);
    const [driverLocation, setDriverLocation] = useState(null);
    const bottomSheetRef = useRef(null);
    const { width, height } = useWindowDimensions();

    const snapPoints = useMemo(() => ["12%", "95%"], []);

    const fetchOrders = () => {
        DataStore.query(Order, order => order.status('eq', "READY_FOR_PICKUP")).then(setOrders);
    }
    
    useEffect(() => {
        fetchOrders();

        const subscription = DataStore.observe(Order).subscribe(msg => {
            if (msg.opType === 'UPDATE') {
                fetchOrders();
            }
        })

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (!status === "granted") {
            console.log("Nonono");
            return;
          }
    
          let location = await Location.getCurrentPositionAsync();
          setDriverLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
    
          const foregroundSubscription = Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              distanceInterval: 500,
            },
            (updatedLocation) => {
              setDriverLocation({
                latitude: updatedLocation.coords.latitude,
                longitude: updatedLocation.coords.longitude,
              });
            }
          );
          return foregroundSubscription;
        })();
      }, []);

      if (!driverLocation) {
        return <ActivityIndicator size={"large"} color="gray" />;
      }

    return (
        <GestureHandlerRootView style={{ backgroundColor: "lightblue", flex: 1 }}>
            <MapView 
                style={{ height, width }} 
                showUserLocation 
                followUserLocation 
                initialRegion={{
                    latitude: driverLocation.latitude,
                    longitude: driverLocation.longitude,
                    latitudeDelta: 0.07,
                    longitudeDelta: 0.07,
                  }}
            >
                {orders.map((order, index) => (
                    <CustomMarker
                        data={order.Restaurant}
                        type="RESTAUNRANT"
                        key={index}
                    />
                ))}
            </MapView>
            <BottomSheet index={1} ref={bottomSheetRef} snapPoints={snapPoints}>
                <View style={{ marginBottom: 30, alignItems: "center" }}>
                    <Text style={{ fontSize: 20, fontWeight: '600', letterSpacing: 0.5, paddingBottom: 5 }}>You're Online</Text>
                    <Text style={{ letterSpacing: 0.5, color: 'gray' }}>Available Orders: {orders.length}</Text>
                </View>
                <BottomSheetFlatList
                    data={orders}
                    renderItem={({ item }) => <OrderItem order={item} />}
                />
            </BottomSheet>
        </GestureHandlerRootView>

    )
}

export default OrdersScreen