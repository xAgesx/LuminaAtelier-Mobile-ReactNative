
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Component Imports
import Header from './components/Header';
import Footer from './components/Footer';
import Catalogue from './components/Catalogue';
import Details from './components/Details';

const Stack = createNativeStackNavigator();

export default function App() {
  
  return (
    <NavigationContainer >
      <View style={styles.container}>
        

        <View style={{ flex: 1 }}>
          <Stack.Navigator
            initialRouteName="Catalogue"
            screenOptions={{
              headerShown: true,
              header: (props) => <Header {...props}/>
            }}
          >
            <Stack.Screen
              name="Catalogue"
              component={Catalogue}
            />

            <Stack.Screen
              name="Details"
              component={Details}
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});