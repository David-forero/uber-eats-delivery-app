import { createStackNavigator } from '@react-navigation/stack';
//Screens
import OrdersScreen from '../screens/OrdersScreen';
import OrderDeliveryScreen from '../screens/OrderDelivery';

const Stack = createStackNavigator();

const Navigation = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name='OrdersScreen' component={OrdersScreen} />
            <Stack.Screen name='OrdersDeliveryScreen' component={OrderDeliveryScreen} />
        </Stack.Navigator>
    )
}

export default Navigation