import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { ShoppingBag, Heart, User, ScanEye, LayoutGrid } from 'lucide-react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const Footer = () => {
  const navigation = useNavigation();
  
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

  return (
    <View style={styles.footerWrapper}>
      
      {isDetails && (
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={styles.buyButton}
            onPress={() => navigation.navigate('Shop')}
            activeOpacity={0.8}
          >
            <ShoppingBag size={20} color="#fff" strokeWidth={2} />
            <Text style={styles.buyButtonText}>Add to Bag</Text>
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
            color={isActive('Catalogue') ? activeColor : inactiveColor} 
            strokeWidth={isActive('Catalogue') ? 2.5 : 1.5} 
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
            onPress={() => navigation.navigate("Auth")}
          >
            <ScanEye size={24} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.arLabelText}>Try-On</Text>
        </View>

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