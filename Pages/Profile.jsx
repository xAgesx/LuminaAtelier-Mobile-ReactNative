import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Switch,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import {
  User,
  Package,
  Heart,
  CreditCard,
  Settings,
  ChevronRight,
  LogOut,
  ShieldCheck,
  Bell,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  Lock,
  Mail,
  X
} from 'lucide-react-native';
import { apiFetch } from '../api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const { width } = Dimensions.get('window');

const ProfileOption = ({ icon: Icon, title, subtitle, onPress, isLast }) => (
  <TouchableOpacity
    style={[styles.optionRow, isLast && { borderBottomWidth: 0 }]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.optionIconContainer}>
      <Icon size={20} color="#1a1a1a" strokeWidth={1.5} />
    </View>
    <View style={styles.optionTextContainer}>
      <Text style={styles.optionTitle}>{title}</Text>
      {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
    </View>
    <ChevronRight size={18} color="#cbd5e1" />
  </TouchableOpacity>
);

const OrderCard = ({ order }) => (
  <View style={styles.orderCard}>
    <View style={styles.orderHeader}>
      <View>
        <Text style={styles.orderDate}>{order.date}</Text>
        <Text style={styles.orderId}>ORDER ID: {order.id}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: order.statusColor + '15' }]}>
        <Text style={[styles.statusText, { color: order.statusColor }]}>{order.status}</Text>
      </View>
    </View>

    <View style={styles.orderItems}>
      {order.items.map((item, index) => (
        <View key={index} style={styles.orderItemRow}>
          <Image source={{ uri: item.image }} style={styles.orderItemImage} />
          <View style={styles.orderItemInfo}>
            <Text style={styles.orderItemName}>{item.name}</Text>
            <Text style={styles.orderItemDetail}>{item.material} • Qty {item.qty}</Text>
          </View>
          <Text style={styles.orderItemPrice}>{item.price}</Text>
        </View>
      ))}
    </View>

    <View style={styles.orderFooter}>
      <Text style={styles.totalLabel}>Total Amount</Text>
      <Text style={styles.totalAmount}>{order.total}</Text>
    </View>
  </View>
);

export default function Profile({ navigation, onLogout }) {
  const { token, user, logout } = useAuth();
  const { show } = useNotification();
  const [view, setView] = useState('profile');
  const [isFaceID, setIsFaceID] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');

  const fetchStats = useCallback(async () => {
    if (!token) return;
    try {
      const [orderRes, wishlistRes] = await Promise.all([
        apiFetch('/orders', 'GET', null, token),
        apiFetch('/wishlist', 'GET', null, token)
      ]);
      
      const orderData = orderRes?.data?.orders || orderRes?.orders || [];
      setOrderCount(orderData.length);
      
      const wishlistData = wishlistRes?.data?.products || wishlistRes?.products || [];
      setWishlistCount(wishlistData.length);
    } catch (e) {
      console.log("Stats fetch error:", e);
    }
  }, [token]);

  const fetchFavorites = useCallback(async () => {
    if (!token) return;
    try {
      const res = await apiFetch('/wishlist', 'GET', null, token);
      const items = res?.data?.products || res?.products || [];
      setFavorites(items.map(item => ({
        id: item._id,
        name: item.name,
        price: item.price,
        image: item.image
      })));
    } catch (e) {
      console.log("Favorites fetch error:", e);
    }
  }, [token]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchStats(), fetchFavorites()]);
    setRefreshing(false);
  }, [fetchStats, fetchFavorites]);

  useEffect(() => {
    if (user) {
      setLoading(false);
      fetchStats();
      fetchFavorites();
    } else if (!token) {
      navigation.replace('Auth');
    }
  }, [user, token, fetchStats, fetchFavorites]);

  useEffect(() => {
    if (view === 'orders' && user?._id) {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          const data = await apiFetch('/orders/user/' + user._id, 'GET', null, token);
          if (data?.data?.orders) {
            setOrders(data.data.orders.map(o => ({
              id: o._id.slice(-6).toUpperCase(),
              date: new Date(o.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
              status: o.status,
              statusColor: o.status === 'Delivered' ? '#10b981' : '#C5A059',
              total: `$${o.total.toLocaleString()}.00`,
              items: o.items.map(i => ({ name: i.name, material: i.material, qty: i.qty, price: `$${i.price}`, image: i.image }))
            })));
          }
        } catch (e) {
          console.error("Error fetching orders", e);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [view, user, token]);

const handleLogout = async () => {
    try {
      show("Logged out from Lumina Atelier", "logout");
      if (onLogout) {
        onLogout();
      }
    } catch (e) {
      console.log("👤 Profile: Logout error", e);
    }
  };

  const renderSubHeader = (title) => (
    <View style={styles.screenHeader}>
      <Text style={styles.screenTitle}>{title}</Text>
      <TouchableOpacity onPress={() => setView('profile')}>
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
    </View>
  );

  // loading first time
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#C5A059" />
      </View>
    );
  }

  if (!user) return null;

  if (view === 'orders') {
    return (
      <View style={styles.container}>
        {renderSubHeader('Order Vault')}
        <ScrollView contentContainerStyle={styles.orderList} showsVerticalScrollIndicator={false}>
          <View style={styles.historyInfo}>
            <Clock size={16} color="#94a3b8" />
            <Text style={styles.historyInfoText}>Showing orders from the last 12 months</Text>
          </View>
          {loadingOrders ? (
            <ActivityIndicator color="#C5A059" style={{ marginTop: 40 }} />
          ) : orders.length > 0 ? (
            orders.map((order) => <OrderCard key={order.id} order={order} />)
          ) : (
            <Text style={{ textAlign: 'center', color: '#94a3b8', marginTop: 40 }}>No orders found.</Text>
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    );
  }

  if (view === 'favorites') {
    return (
      <View style={styles.container}>
        {renderSubHeader('My Favorites')}
        <ScrollView contentContainerStyle={styles.orderList}>
          {favorites.length > 0 ? (
            <View style={styles.favoritesGrid}>
              {favorites.map((item) => (
                <View key={item.id} style={styles.favItem}>
                  <Image source={{ uri: item.image }} style={styles.favImage} />
                  <Text style={styles.favName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.favPrice}>${item.price?.toLocaleString()}</Text>
                  <TouchableOpacity 
                    style={styles.favRemove}
                    onPress={async () => {
                      try {
                        await apiFetch('/wishlist/remove', 'POST', { productId: item.id }, token);
                        setFavorites(prev => prev.filter(f => f.id !== item.id));
                        setWishlistCount(prev => prev - 1);
                        show("Removed from wishlist", "wishlist");
                      } catch (e) {
                        show("Could not remove item", "wishlist");
                      }
                    }}
                  >
                    <Trash2 size={14} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View style={{ alignItems: 'center', paddingTop: 40 }}>
              <Heart size={40} color="#e2e8f0" />
              <Text style={{ color: '#94a3b8', marginTop: 10 }}>No favorites yet</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  if (view === 'payments') {
    return (
      <View style={styles.container}>
        {renderSubHeader('Payment Methods')}
        <View style={styles.orderList}>
          <View style={styles.cardItem}>
            <View style={styles.cardBrand}>
              <Text style={styles.cardBrandText}>VISA</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardNum}>•••• •••• •••• 4242</Text>
              <Text style={styles.cardExp}>Expires 12/26</Text>
            </View>
            <CheckCircle2 size={20} color="#10b981" />
          </View>
          <TouchableOpacity style={styles.addCardBtn}>
            <Plus size={20} color="#64748b" />
            <Text style={styles.addCardText}>Add New Card</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (view === 'notifications') {
    return (
      <View style={styles.container}>
        {renderSubHeader('Notifications')}
        <ScrollView contentContainerStyle={styles.orderList}>
          {[
            { t: 'New Collection', d: 'The Spring Solstice line has arrived.', time: '2h ago' },
            { t: 'Order Shipped', d: 'Your LUM-82910 is on its way.', time: '1d ago' },
          ].map((n, i) => (
            <View key={i} style={styles.notifItem}>
              <View style={styles.notifDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.notifTitle}>{n.t}</Text>
                <Text style={styles.notifDesc}>{n.d}</Text>
                <Text style={styles.notifTime}>{n.time}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  if (view === 'settings') {
    return (
      <View style={styles.container}>
        {renderSubHeader('Account Settings')}
        <ScrollView contentContainerStyle={styles.orderList}>
          <Text style={styles.settingsGroupTitle}>Personal Information</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <User size={18} color="#94a3b8" />
              <TextInput style={styles.settingsInput} defaultValue={user?.name} />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Mail size={18} color="#94a3b8" />
              <TextInput style={styles.settingsInput} defaultValue={user?.email} />
            </View>
          </View>

          <Text style={[styles.settingsGroupTitle, { marginTop: 20 }]}>Security</Text>
          <View style={styles.settingToggleRow}>
            <View style={styles.toggleTextCol}>
              <Text style={styles.toggleTitle}>Face ID / Biometrics</Text>
              <Text style={styles.toggleSubtitle}>Secure your vault access</Text>
            </View>
            <Switch
              value={isFaceID}
              onValueChange={setIsFaceID}
              trackColor={{ false: '#e2e8f0', true: '#1a1a1a' }}
            />
          </View>

          <TouchableOpacity style={styles.settingActionRow}>
            <Lock size={18} color="#1a1a1a" />
            <Text style={styles.settingActionText}>Change Password</Text>
            <ChevronRight size={16} color="#cbd5e1" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveSettingsBtn}>
            <Text style={styles.saveSettingsBtnText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteAccountBtn}>
            <Text style={styles.deleteAccountText}>Request Data Deletion</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#C5A059"
          colors={['#C5A059']}
        />
      }
    >
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: user?.avatar || 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
          <TouchableOpacity 
            style={styles.editBadge}
            onPress={() => { setNameInput(user?.name || ''); setEditingName(true); }}
          >
            <Settings size={12} color="#fff" />
          </TouchableOpacity>
        </View>
        {editingName ? (
          <View style={styles.nameEditContainer}>
            <TextInput
              style={styles.nameEditInput}
              value={nameInput}
              onChangeText={setNameInput}
              autoFocus
              onBlur={async () => {
                if (nameInput.trim() && nameInput !== user?.name) {
                  try {
                    await apiFetch('/users/profile', 'PUT', { name: nameInput.trim() }, token);
                    show("Name updated", "cart");
                  } catch (e) {
                    show("Could not update name", "cart");
                  }
                }
                setEditingName(false);
              }}
              onSubmitEditing={async () => {
                if (nameInput.trim() && nameInput !== user?.name) {
                  try {
                    await apiFetch('/users/profile', 'PUT', { name: nameInput.trim() }, token);
                    show("Name updated", "cart");
                  } catch (e) {
                    show("Could not update name", "cart");
                  }
                }
                setEditingName(false);
              }}
            />
          </View>
        ) : (
          <Text style={styles.userName}>{user?.name || 'Valued Member'}</Text>
        )}
        <Text style={styles.userEmail}>{user?.email}</Text>

        <View style={styles.tierBadge}>
          <ShieldCheck size={14} color="#C5A059" />
          <Text style={styles.tierText}>{(user?.tier || 'Atelier Member').toUpperCase()}</Text>
        </View>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{orderCount || 0}</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{wishlistCount || 0}</Text>
          <Text style={styles.statLabel}>Wishlist</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>In Repair</Text>
        </View>
      </View>

      {/* Menu Sections */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Shopping Activity</Text>
        <View style={styles.menuCard}>
          <ProfileOption
            icon={Package}
            title="Order History"
            subtitle={`${orderCount || 0} orders placed`}
            onPress={() => setView('orders')}
          />
          <ProfileOption
            icon={Heart}
            title="My Favorites"
            subtitle={`${wishlistCount || 0} items saved for later`}
            onPress={() => setView('favorites')}
          />
          <ProfileOption
            icon={CreditCard}
            title="Payment Methods"
            subtitle="Visa •••• 4242"
            onPress={() => setView('payments')}
            isLast
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Preferences</Text>
        <View style={styles.menuCard}>
          <ProfileOption
            icon={Bell}
            title="Notifications"
            subtitle="Alerts on new collections"
            onPress={() => setView('notifications')}
          />
          <ProfileOption
            icon={Settings}
            title="Account Settings"
            subtitle="Privacy and data management"
            onPress={() => setView('settings')}
            isLast
          />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={18} color="#ef4444" />
        <Text style={styles.logoutText}>Logout from Atelier</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>LUMINA APP v2.4.0 — Established 1992</Text>
      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { alignItems: 'center', paddingTop: 20, paddingBottom: 30 },
  avatarWrapper: { position: 'relative', marginBottom: 15 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#f1f5f9' },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff'
  },
  userName: { fontSize: 24, fontWeight: '300', color: '#1a1a1a', letterSpacing: 1 },
  nameEditContainer: { alignItems: 'center' },
  nameEditInput: { 
    fontSize: 24, 
    fontWeight: '300', 
    color: '#1a1a1a', 
    letterSpacing: 1,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#C5A059',
    paddingVertical: 5,
    minWidth: 150
  },
  userEmail: { fontSize: 13, color: '#94a3b8', marginTop: 4, fontWeight: '400' },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fefce8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 15,
    gap: 6,
    borderWidth: 1,
    borderColor: '#fef08a'
  },
  tierText: { fontSize: 10, color: '#854d0e', fontWeight: '800', letterSpacing: 1 },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 20,
    marginBottom: 30
  },
  statBox: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  statLabel: { fontSize: 11, color: '#64748b', marginTop: 2, textTransform: 'uppercase', letterSpacing: 1 },
  statDivider: { width: 1, height: '100%', backgroundColor: '#e2e8f0' },
  section: { paddingHorizontal: 20, marginBottom: 25 },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 5
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  optionTextContainer: { flex: 1 },
  optionTitle: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  optionSubtitle: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 20,
    backgroundColor: '#fff5f5',
    gap: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#fee2e2'
  },
  logoutText: { color: '#ef4444', fontWeight: '700', fontSize: 14 },
  versionText: { textAlign: 'center', fontSize: 10, color: '#cbd5e1', marginTop: 30, letterSpacing: 1 },

  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  screenTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a1a', letterSpacing: 1 },
  closeText: { fontSize: 14, fontWeight: '600', color: '#C5A059' },
  orderList: { padding: 20 },
  historyInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  historyInfoText: { fontSize: 13, color: '#94a3b8' },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  orderDate: { fontSize: 14, fontWeight: '700', color: '#1a1a1a' },
  orderId: { fontSize: 10, color: '#94a3b8', marginTop: 2, letterSpacing: 0.5 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  orderItems: { borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 15, marginBottom: 15 },
  orderItemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  orderItemImage: { width: 50, height: 50, borderRadius: 10, backgroundColor: '#f8fafc', marginRight: 15 },
  orderItemInfo: { flex: 1 },
  orderItemName: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  orderItemDetail: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  orderItemPrice: { fontSize: 14, fontWeight: '700', color: '#1a1a1a' },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 13, color: '#64748b' },
  totalAmount: { fontSize: 16, fontWeight: '800', color: '#1a1a1a' },

  settingsGroupTitle: { fontSize: 12, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 15 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 12, paddingHorizontal: 15, borderWidth: 1, borderColor: '#f1f5f9' },
  settingsInput: { flex: 1, paddingVertical: 12, paddingHorizontal: 10, fontSize: 14, color: '#1a1a1a' },
  settingToggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc', padding: 15, borderRadius: 12, marginBottom: 10 },
  toggleTextCol: { flex: 1 },
  toggleTitle: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  toggleSubtitle: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  settingActionRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', padding: 15, borderRadius: 12, marginBottom: 20, gap: 12 },
  settingActionText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  saveSettingsBtn: { backgroundColor: '#1a1a1a', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  saveSettingsBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  deleteAccountBtn: { marginTop: 30, alignItems: 'center' },
  deleteAccountText: { color: '#94a3b8', fontSize: 12, textDecorationLine: 'underline' },

  favoritesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  favItem: { width: (width - 55) / 2, backgroundColor: '#f8fafc', padding: 15, borderRadius: 20, alignItems: 'center', position: 'relative' },
  favImage: { width: 80, height: 80, marginBottom: 10 },
  favName: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  favPrice: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  favRemove: { position: 'absolute', top: 10, right: 10 },

  cardItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', padding: 20, borderRadius: 20, marginBottom: 15 },
  cardBrand: { width: 45, height: 30, backgroundColor: '#1a1a1a', borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardBrandText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  cardInfo: { flex: 1 },
  cardNum: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  cardExp: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  addCardBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20, borderRadius: 20, borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1', gap: 10 },
  addCardText: { color: '#64748b', fontWeight: '600' },

  notifItem: { flexDirection: 'row', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  notifDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#C5A059', marginTop: 6, marginRight: 12 },
  notifTitle: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  notifDesc: { fontSize: 13, color: '#64748b', marginTop: 4, lineHeight: 18 },
  notifTime: { fontSize: 11, color: '#94a3b8', marginTop: 6 }
});