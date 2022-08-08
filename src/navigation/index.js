import { createStackNavigator } from '@react-navigation/stack';
//Screens
import OrdersScreen from '../screens/OrdersScreen';
import OrderDeliveryScreen from '../screens/OrderDelivery';
import { useAuthContext } from '../context/AuthContext';

const Stack = createStackNavigator();

const Navigation = () => {
    const {dbCourier} = useAuthContext();


    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {
            dbCourier ? (
                <>
                      <Stack.Screen name='OrdersScreen' component={OrdersScreen} />
            <Stack.Screen name='OrdersDeliveryScreen' component={OrderDeliveryScreen} />
                </>
            ): (
                <Stack.Screen name="Profile" component={ProfileScreen} />
            )
          }
        </Stack.Navigator>
    )
}

export default Navigation