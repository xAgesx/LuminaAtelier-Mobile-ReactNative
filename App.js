import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Header from './components/Header';
import Footer from './components/Footer';
import Catalogue from './components/Catalogue';
import Details from './components/Details';
import ARVisualizer from './components/ARVisualizer';
import Auth from './Pages/Auth';
import Profile from './Pages/Profile';
import Wishlist from './Pages/Wishlist';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AtelierStack({ onTryOn }) {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <Header {...props} />,
      }}
    >
      <Stack.Screen 
        name="Catalogue" 
        component={Catalogue} 
      />
      <Stack.Screen name="Details">
        {(props) => <Details {...props} onTryOn={onTryOn} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function App() {
  const [showAR, setShowAR] = useState(false);
  if (showAR) {
    return (
      <View style={styles.container}>
        <ARVisualizer onExit={() => setShowAR(false)} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Tab.Navigator
          tabBar={(props) => <Footer {...props} onARPress={() => setShowAR(true)} />}
          screenOptions={{
            headerShown: false, 
          }}
        >
          <Tab.Screen name="Catalogue">
            {() => <AtelierStack onTryOn={() => setShowAR(true)} />}
          </Tab.Screen>
          
          <Tab.Screen 
            name="Auth" 
            component={Auth} 
          />
          
          <Tab.Screen 
            name="Wishlist" 
            component={Wishlist} 
            options={{ 
              headerShown: true,
              header: (props) => <Header {...props} /> 
            }}
          />
          
          <Tab.Screen 
            name="Profile" 
            component={Profile}
            options={{ 
              headerShown: true,
              header: (props) => <Header {...props} /> 
            }}
          />
        </Tab.Navigator>
        
        <StatusBar style="auto" />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});