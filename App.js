import 'react-native-gesture-handler';
import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

LogBox.ignoreLogs(['Non-serializable values']);

const TOKEN_EXPIRY_DAYS = 3;

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

import Header from './components/Header';
import Footer from './components/Footer';
import Catalogue from './components/Catalogue';
import Details from './components/Details';
import ARVisualizer from './components/ARVisualizer';
import Auth from './Pages/Auth';
import Profile from './Pages/Profile';
import Wishlist from './Pages/Wishlist';
import Shop from './Pages/Shop';

function AtelierStack({ onTryOn }) {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <Header {...props} />,
      }}
    >
      <Stack.Screen name="Catalogue" component={Catalogue} />
      <Stack.Screen name="Details">
        {(props) => <Details {...props} onTryOn={onTryOn} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function MainTabs({ onARPress }) {
  return (
    <Tab.Navigator
      tabBar={(props) => <Footer {...props} onARPress={onARPress} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Catalogue">
        {() => <AtelierStack onTryOn={onARPress} />}
      </Tab.Screen>
      <Tab.Screen
        name="Wishlist"
        component={Wishlist}
        options={{ headerShown: true, header: (props) => <Header {...props} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: true, header: (props) => <Header {...props} /> }}
      />
      <Tab.Screen
        name="Shop"
        component={Shop}
        options={{ headerShown: true, header: (props) => <Header {...props} /> }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [showAR, setShowAR] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigationRef = useRef(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const tokenData = await AsyncStorage.getItem('token');
      const guestMode = await AsyncStorage.getItem('guestMode');

      if (guestMode === 'true') {
        setIsGuest(true);
        setIsLoggedIn(false);
        setCheckingAuth(false);
        return;
      }

      if (!tokenData) {
        setIsLoggedIn(false);
        setIsGuest(false);
        setCheckingAuth(false);
        return;
      }

      const { token, expiry } = JSON.parse(tokenData);
      const now = new Date().getTime();

      if (!expiry || now > expiry) {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        setIsLoggedIn(false);
        setIsGuest(false);
      } else {
        setIsLoggedIn(true);
      }
    } catch (e) {
      console.log("Auth check error:", e);
      setIsLoggedIn(false);
      setIsGuest(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLogin = async (token, user) => {
    const expiryDate = new Date().getTime() + (TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    await AsyncStorage.setItem('token', JSON.stringify({ token, expiry: expiryDate }));
    await AsyncStorage.setItem('user', JSON.stringify(user));
    await AsyncStorage.removeItem('guestMode');
    setIsGuest(false);
    setIsLoggedIn(true);
  };

  const handleGuest = async () => {
    await AsyncStorage.setItem('guestMode', 'true');
    setIsGuest(true);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('guestMode');
    setIsLoggedIn(false);
    setIsGuest(false);
  };

  if (checkingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="auto" />
      </View>
    );
  }

  if (showAR) {
    return (
      <View style={styles.container}>
        <ARVisualizer onExit={() => setShowAR(false)} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <View style={styles.container}>
        {!isLoggedIn && !isGuest ? (
          <Auth onLogin={handleLogin} onGuest={handleGuest} />
        ) : (
          <MainTabs onARPress={() => setShowAR(true)} isGuest={isGuest} onLogout={handleLogout} />
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});