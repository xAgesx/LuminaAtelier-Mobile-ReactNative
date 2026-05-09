import 'react-native-gesture-handler';
import React, { useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';

LogBox.ignoreLogs(['Non-serializable values']);

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
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

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

function MainTabs({ isGuest, onLogout, onAuthPress, onARPress }) {
  return (
    <Tab.Navigator
      tabBar={(props) => <Footer {...props} isGuest={isGuest} onAuthPress={onAuthPress} onARPress={onARPress} />}
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
      <Tab.Screen name="Profile">
        {() => <Profile onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen
        name="Shop"
        component={Shop}
        options={{ headerShown: true, header: (props) => <Header {...props} /> }}
      />
    </Tab.Navigator>
  );
}

function AppContent() {
  const [showAR, setShowAR] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [authKey, setAuthKey] = useState(0);
  const { token, login, logout, isLoading } = useAuth();
  const [isGuest, setIsGuest] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const navigationRef = useRef(null);

  const handleGuest = async () => {
    setIsGuest(true);
  };

  const handleLogout = async () => {
    await logout();
    setIsGuest(false);
    setAuthKey(prev => prev + 1);
  };

  const handleShowAuth = () => {
    setShowAuth(true);
  };

  const handleARPress = (product) => {
    setSelectedProduct(product);
    setShowAR(true);
  };

  const handleARExit = () => {
    setShowAR(false);
    setSelectedProduct(null);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="auto" />
      </View>
    );
  }

  if (showAR) {
    return (
      <View style={styles.container}>
        <ARVisualizer 
          onExit={handleARExit} 
          product={selectedProduct}
        />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <View style={styles.container} key={token ? 'loggedIn' : 'loggedOut'}>
        {showAuth && !token ? (
          <Auth key={`auth-${authKey}`} onLogin={login} onGuest={() => { setShowAuth(false); handleGuest(); }} onClose={() => setShowAuth(false)} />
        ) : !token && !isGuest ? (
          <Auth key={`auth-${authKey}`} onLogin={login} onGuest={handleGuest} />
        ) : (
          <MainTabs 
            onARPress={handleARPress}
            isGuest={isGuest} 
            onLogout={handleLogout} 
            onAuthPress={handleShowAuth} 
          />
        )}
        <StatusBar style="auto" />
      </View>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
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