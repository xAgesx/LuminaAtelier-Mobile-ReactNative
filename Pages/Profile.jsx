import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  TextInput,
  Switch
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
  Smartphone
} from 'lucide-react-native';

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

export default function Profile({ navigation }) {
  const [view, setView] = useState('profile'); // 'profile', 'orders', 'favorites', 'payments', 'notifications', 'settings'
  const [isFaceID, setIsFaceID] = useState(true);

  const user = {
    name: 'Julian Vane',
    email: 'j.vane@lumina-atelier.com',
    tier: 'Platinum Member',
    joined: 'October 2023',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200'
  };

  const orders = [
    {
      id: 'LUM-82910',
      date: 'April 12, 2024',
      status: 'In Transit',
      statusColor: '#C5A059',
      total: '$3,200.00',
      items: [
        { name: 'Eternity Band', material: '18k Gold', qty: 1, price: '$3,200', image: 'https://purepng.com/public/uploads/large/purepng.com-gold-diamond-ringdiamond-gold-ringjewelery-1701527122144ayp9p.png' }
      ]
    },
    {
      id: 'LUM-71204',
      date: 'Jan 28, 2024',
      status: 'Delivered',
      statusColor: '#10b981',
      total: '$1,800.00',
      items: [
        { name: 'Silver Blossom', material: 'Silver', qty: 1, price: '$1,800', image: 'https://purepng.com/public/uploads/large/purepng.com-silver-ringjewelryjewellerybroochesringsnecklacesearringsearringsornamentsflowersdiamondsilverring-1701528881414tgi3w.png' }
      ]
    }
  ];

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  };

  const renderSubHeader = (title) => (
    <View style={styles.screenHeader}>
      <Text style={styles.screenTitle}>{title}</Text>
      <TouchableOpacity onPress={() => setView('profile')}>
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
    </View>
  );

  if (view === 'orders') {
    return (
      <View style={styles.container}>
        {renderSubHeader('Order Vault')}
        <ScrollView contentContainerStyle={styles.orderList} showsVerticalScrollIndicator={false}>
          <View style={styles.historyInfo}>
            <Clock size={16} color="#94a3b8" />
            <Text style={styles.historyInfoText}>Showing orders from the last 12 months</Text>
          </View>
          {orders.map((order) => <OrderCard key={order.id} order={order} />)}
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
          <View style={styles.favoritesGrid}>
            {[1, 2, 3].map((item) => (
              <View key={item} style={styles.favItem}>
                <Image 
                  source={{ uri: 'https://purepng.com/public/uploads/large/purepng.com-gold-diamond-ringdiamond-gold-ringjewelery-1701527122144ayp9p.png' }} 
                  style={styles.favImage} 
                />
                <Text style={styles.favName}>Celestial Ring {item}</Text>
                <Text style={styles.favPrice}>$2,400</Text>
                <TouchableOpacity style={styles.favRemove}>
                  <Trash2 size={14} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
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
              <TextInput style={styles.settingsInput} defaultValue={user.name} />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Mail size={18} color="#94a3b8" />
              <TextInput style={styles.settingsInput} defaultValue={user.email} />
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.editBadge}>
            <Settings size={12} color="#fff" />
          </View>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        
        <View style={styles.tierBadge}>
          <ShieldCheck size={14} color="#C5A059" />
          <Text style={styles.tierText}>{user.tier.toUpperCase()}</Text>
        </View>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>08</Text>
          <Text style={styles.statLabel}>Wishlist</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>02</Text>
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
            subtitle="Track and manage your orders" 
            onPress={() => setView('orders')}
          />
          <ProfileOption 
            icon={Heart} 
            title="My Favorites" 
            subtitle="8 items saved for later" 
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
  avatar: { width: 100, height: 100, borderRadius: 50 },
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
  
  // Vault / Sub-Screen Styles
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

  // Settings Specific Styles
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

  // Favorites Grid
  favoritesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  favItem: { width: (width - 55) / 2, backgroundColor: '#f8fafc', padding: 15, borderRadius: 20, alignItems: 'center', position: 'relative' },
  favImage: { width: 80, height: 80, marginBottom: 10 },
  favName: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  favPrice: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  favRemove: { position: 'absolute', top: 10, right: 10 },

  // Payments
  cardItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', padding: 20, borderRadius: 20, marginBottom: 15 },
  cardBrand: { width: 45, height: 30, backgroundColor: '#1a1a1a', borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardBrandText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  cardInfo: { flex: 1 },
  cardNum: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  cardExp: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  addCardBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20, borderRadius: 20, borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1', gap: 10 },
  addCardText: { color: '#64748b', fontWeight: '600' },

  // Notifications
  notifItem: { flexDirection: 'row', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  notifDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#C5A059', marginTop: 6, marginRight: 12 },
  notifTitle: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  notifDesc: { fontSize: 13, color: '#64748b', marginTop: 4, lineHeight: 18 },
  notifTime: { fontSize: 11, color: '#94a3b8', marginTop: 6 }
});