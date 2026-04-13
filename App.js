import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Header from './components/Header';
import Footer from './components/Footer';
import Catalogue from './components/Catalogue';
import Details from './components/Details';
import ARVisualizer from './components/ARVisualizer';


const Stack = createNativeStackNavigator();

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
        <View style={{ flex: 1 }}>
          <Stack.Navigator
            initialRouteName="Catalogue"
            screenOptions={{
              headerShown: true,
              header: (props) => <Header {...props}/>
            }}
          >
            <Stack.Screen name="Catalogue" component={Catalogue} />
            <Stack.Screen 
              name="Details" 
              component={Details} 
              initialParams={{ onTryOn: () => setShowAR(true) }}
            />
          </Stack.Navigator>
        </View>
        <Footer />
        <StatusBar style="auto" />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});