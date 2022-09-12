import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/navigation';
import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import { withAuthenticator } from 'aws-amplify-react-native';
import AuthContextProvider from './src/context/AuthContext'
import OrderContextProvider from './src/context/OrderContext'

Amplify.configure({ ...awsconfig, Analytics: { disabled: true } })

import {LogBox} from 'react-native';
LogBox.ignoreLogs(['Setting a timer'])

function App() {
  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <AuthContextProvider>
          <OrderContextProvider>
            <Navigation />
          </OrderContextProvider>
        </AuthContextProvider>
        <StatusBar style="auto" />
      </View>
    </NavigationContainer>
  );
}

export default withAuthenticator(App)