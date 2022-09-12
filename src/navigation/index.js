import { createStackNavigator } from '@react-navigation/stack';
//Screens
import OrdersScreen from '../screens/OrdersScreen';
import OrderDeliveryScreen from '../screens/OrderDelivery';
import ProfileScreen from '../screens/ProfileScreen';
import { useAuthContext } from '../context/AuthContext';
import { ActivityIndicator } from 'react-native';

const Stack = createStackNavigator();

const Navigation = () => {
    const { dbCourier, loading } = useAuthContext();

    if (loading) {
        return <ActivityIndicator size={"large"} color="gray" />;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {
                dbCourier ? (
                    <>
                        <Stack.Screen name='OrdersScreen' component={OrdersScreen} />
                        <Stack.Screen name='OrdersDeliveryScreen' component={OrderDeliveryScreen} />
                    </>
                ) : (
                    <Stack.Screen name="Profile" component={ProfileScreen} />
                )
            }
        </Stack.Navigator>
    )
}

export default Navigation