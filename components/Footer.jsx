import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { ShoppingBag, Heart, User, ScanEye, LayoutGrid } from 'lucide-react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { apiFetch } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotification } from '../context/NotificationContext';

const { width } = Dimensions.get('window');

const getToken = async () => {
  const tokenData = await AsyncStorage.getItem('token');
  if (!tokenData) return null;
  try {
    const parsed = JSON.parse(tokenData);
    const now = new Date().getTime();
    if (parsed.expiry && now > parsed.expiry) return null;
    return parsed.token;
  } catch (e) {
    return tokenData;
  }
};

const Footer = ({ isGuest = false, onARPress }) => {
  const navigation = useNavigation();
  const { show } = useNotification();
  const [adding, setAdding] = useState(false);
  
  const currentRouteName = useNavigationState((state) => {
    if (!state) return null;
    const route = state.routes[state.index];
    if (route.state) {
      return route.state.routes[route.state.index].name;
    }
    return route.name;
  });

  const isDetails = currentRouteName === 'Details';
  const activeColor = "#D4AF37";
  const inactiveColor = "#94a3b8";

  const isActive = (name) => currentRouteName === name;

  const handleAddToBag = async () => {
    const token = await getToken();
    if (!token) {
      show("Please log in to add to bag", "login");
      return;
    }

    const catalogueState = navigation.getState()?.routes?.find(r => r.name === 'Catalogue')?.state;
    const product = catalogueState?.routes?.find(r => r.name === 'Details')?.params?.product;
    
    if (!product?._id) {
      show("Unable to add product", "cart");
      return;
    }

    setAdding(true);
    try {
      const res = await apiFetch('/cart/add', 'POST', { productId: product._id, quantity: 1 }, token);
      if (res?.data || res?.message?.includes('added')) {
        show(`${product.name} added to bag`, "cart");
        navigation.navigate('Shop');
      } else {
        show(res?.message || "Could not add to bag", "cart");
      }
    } catch (e) {
      show("Could not add to bag", "cart");
    }
    setAdding(false);
  };

  return (
    <View style={styles.footerWrapper}>
      
      {isDetails && (
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={[styles.buyButton, adding && { opacity: 0.6 }]}
            onPress={handleAddToBag}
            disabled={adding}
            activeOpacity={0.8}
          >
            <ShoppingBag size={20} color="#fff" strokeWidth={2} />
            <Text style={styles.buyButtonText}>{adding ? 'Adding...' : 'Add to Bag'}</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.navBar}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate('Catalogue')}
        >
          <LayoutGrid 
            size={22} 
            color={isActive('Catalogue') || isActive('Details')? activeColor : inactiveColor} 
            strokeWidth={isActive('Catalogue') || isActive('Details') ? 2.5 : 1.5} 
          />
          <Text style={[styles.navLabel, { color: isActive('Catalogue') ? activeColor : inactiveColor }]}>
            Atelier
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate("Shop")}
        >
          <ShoppingBag 
            size={22} 
            color={isActive('Shop') ? activeColor : inactiveColor} 
            strokeWidth={isActive('Shop') ? 2.5 : 1.5} 
          />
          <Text style={[styles.navLabel, { color: isActive('Shop') ? activeColor : inactiveColor }]}>
            Shop
          </Text>
        </TouchableOpacity>

        <View style={styles.centerContainer}>
          <TouchableOpacity 
            style={styles.arCircle} 
            onPress={() => onARPress ? onARPress() : navigation.navigate("Auth")}
          >
            <ScanEye size={24} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.arLabelText}>Try-On</Text>
        </View>

        {isGuest ? (
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => {navigation.navigate("Auth")}}
          >
            <Heart 
              size={22} 
              color={inactiveColor} 
              strokeWidth={1.5} 
            />
            <Text style={[styles.navLabel, { color: inactiveColor }]}>
              Wishlist
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => navigation.navigate("Wishlist")}
          >
            <Heart 
              size={22} 
              color={isActive('Wishlist') ? activeColor : inactiveColor} 
              strokeWidth={isActive('Wishlist') ? 2.5 : 1.5} 
            />
            <Text style={[styles.navLabel, { color: isActive('Wishlist') ? activeColor : inactiveColor }]}>
              Wishlist
            </Text>
          </TouchableOpacity>
        )}

        {isGuest ? (
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => {}}
          >
            <User 
              size={22} 
              color={inactiveColor} 
              strokeWidth={1.5} 
            />
            <Text style={[styles.navLabel, { color: inactiveColor }]}>
              Profile
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => navigation.navigate("Profile")}
          >
            <User 
              size={22} 
              color={isActive('Profile') ? activeColor : inactiveColor} 
              strokeWidth={isActive('Profile') ? 2.5 : 1.5} 
            />
            <Text style={[styles.navLabel, { color: isActive('Profile') ? activeColor : inactiveColor }]}>
              Profile
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerWrapper: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    position: 'absolute',
    bottom: 0,
    width: width,
    // Add shadow to the whole footer
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 20,
  },
  actionSection: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 5,
  },
  buyButton: {
    backgroundColor: '#C5A059',
    height: 55,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    // Luxury shadow for the button
    shadowColor: '#C5A059',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10, 
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    gap: 4,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  centerContainer: {
    alignItems: 'center',
    marginTop: -30, // Pull up the AR button
  },
  arCircle: {
    backgroundColor: '#1a1a1a',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  arLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 4,
  }
});

export default Footer;