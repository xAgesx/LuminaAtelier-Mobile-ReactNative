import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Heart, ShoppingBag, LogIn, LogOut } from 'lucide-react-native';

const NotificationContext = createContext(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};

const COLORS = {
  cart: { bg: '#1a1a1a', iconBg: '#ef4444', icon: '#fff', text: '#fff' },
  wishlist: { bg: '#1a1a1a', iconBg: '#ef4444', icon: '#fff', text: '#fff' },
  login: { bg: '#1a1a1a', iconBg: '#ef4444', icon: '#fff', text: '#fff' },
  logout: { bg: '#1a1a1a', iconBg: '#ef4444', icon: '#fff', text: '#fff' },
};

function NotificationItem({ notif, onDismiss }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const colors = COLORS[notif.type] || COLORS.cart;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -100, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => onDismiss(notif.id));
    }, 2700);

    return () => clearTimeout(timer);
  }, [notif.id, onDismiss, slideAnim, fadeAnim]);

  const IconComp = notif.type === 'cart' ? ShoppingBag : notif.type === 'wishlist' ? Heart : notif.type === 'login' ? LogIn : LogOut;

  return (
    <Animated.View style={[styles.banner, { backgroundColor: colors.bg, transform: [{ translateY: slideAnim }], opacity: fadeAnim }]}>
      <View style={[styles.iconBox, { backgroundColor: colors.iconBg }]}>
        <IconComp size={18} color={colors.icon} />
      </View>
      <Text style={[styles.text, { color: colors.text }]}>{notif.message}</Text>
    </Animated.View>
  );
}

export function NotificationProvider({ children }) {
  const [items, setItems] = useState([]);
  const nextId = useRef(0);

  const show = useCallback((message, type = 'cart') => {
    const id = ++nextId.current;
    setItems(prev => [...prev, { id, message, type }]);
    setTimeout(() => setItems(prev => prev.filter(i => i.id !== id)), 3000);
  }, []);

  return (
    <NotificationContext.Provider value={{ show }}>
      {children}
      <View style={styles.container} pointerEvents="none">
        {items.map(item => (
          <NotificationItem key={item.id} notif={item} onDismiss={id => setItems(prev => prev.filter(i => i.id !== id))} />
        ))}
      </View>
    </NotificationContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 60, left: 20, right: 20, zIndex: 9999 },
  banner: {
    borderRadius: 16, paddingVertical: 16, paddingHorizontal: 18,
    flexDirection: 'row', alignItems: 'center', marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 10,
  },
  iconBox: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  text: { flex: 1, fontSize: 15, fontWeight: '600' },
});

export default NotificationContext;