import React, { useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, 
  Dimensions, Modal, ActivityIndicator, Alert
} from 'react-native';
import { 
  ShoppingBag, Trash2, Plus, Minus, ChevronRight, History, 
  CheckCircle2, ArrowRight, Package, X, CreditCard, ShieldCheck 
} from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../api';

const { width, height } = Dimensions.get('window');

export default function Shop({ navigation }) {
  console.log("🛒 Shop component rendering");
  const [activeTab, setActiveTab] = useState('bag');
  const [isCheckoutVisible, setCheckoutVisible] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [selectedMethod, setSelectedMethod] = useState('card');
  
  const [cartItems, setCartItems] = useState([]); // Initialized as array
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      console.log("🛒 Shop useFocusEffect triggered, tab:", activeTab);
      loadShopData();
    }, [activeTab])
  );

  const loadShopData = async () => {
    console.log("🛒 loadShopData called, activeTab:", activeTab);
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      console.log("🛒 Token:", token ? "exists" : "null");
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      console.log("🛒 User:", user);

      if (activeTab === 'bag') {
        const res = await apiFetch('/cart', 'GET', null, token);
        console.log("🛒 BAG DATA:", res);
        
        // Safety check to ensure we always set an array
        const fetchedItems = res?.data?.products || res?.data || res || [];
        setCartItems(Array.isArray(fetchedItems) ? fetchedItems : []);
      } else {
        const res = await apiFetch('/orders', 'GET', null, token);
        console.log("🛒 HISTORY DATA:", res);
        const fetchedOrders = res?.data?.orders || res?.orders || res || [];
        setOrderHistory(Array.isArray(fetchedOrders) ? fetchedOrders : []);
      }
    } catch (e) {
      console.log("🛒 LOAD ERROR:", e);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (productId, delta, currentQty) => {
    const newQty = Math.max(1, currentQty + delta);
    setCartItems(prev => prev.map(item => 
      item.productId?._id === productId ? { ...item, quantity: newQty } : item
    ));

    try {
      const token = await AsyncStorage.getItem('token');
      await apiFetch('/cart/update', 'POST', { productId, quantity: newQty }, token);
    } catch (e) {
      console.log("QTY UPDATE ERROR", e);
    }
  };

  const removeItem = async (productId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await apiFetch(`/cart/${productId}`, 'DELETE', null, token);
      setCartItems(prev => prev.filter(item => item.productId?._id !== productId));
    } catch (e) {
      console.log("REMOVE ERROR", e);
    }
  };

  const processPayment = async () => {
    setPaymentStatus('processing');
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await apiFetch('/orders', 'POST', { paymentMethod: selectedMethod, total }, token);
      if (res) {
        setPaymentStatus('success');
        setTimeout(() => {
          setCheckoutVisible(false);
          setCartItems([]);
          setPaymentStatus('idle');
          setActiveTab('history');
        }, 2000);
      }
    } catch (e) {
      setPaymentStatus('idle');
      Alert.alert("Error", "Payment failed");
    }
  };

  // --- SAFE REDUCE CALCULATION ---
  const subtotal = (cartItems || []).reduce((acc, item) => {
    const price = item.productId?.price || 0;
    const qty = item.quantity || 0;
    return acc + (price * qty);
  }, 0);

  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 50;
  const total = subtotal + shipping;

  if (loading && cartItems.length === 0 && orderHistory.length === 0) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#C5A059" /></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabHeader}>
        <TouchableOpacity style={[styles.tab, activeTab === 'bag' && styles.activeTab]} onPress={() => setActiveTab('bag')}>
          <ShoppingBag size={18} color={activeTab === 'bag' ? '#1a1a1a' : '#94a3b8'} />
          <Text style={[styles.tabText, activeTab === 'bag' && styles.activeTabText]}>SHOPPING BAG</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'history' && styles.activeTab]} onPress={() => setActiveTab('history')}>
          <History size={18} color={activeTab === 'history' ? '#1a1a1a' : '#94a3b8'} />
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>HISTORY</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'bag' ? (
          <>
            {cartItems.length > 0 ? (
              <>
                {cartItems.map((item) => (
                  <View key={item._id} style={styles.cartCard}>
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: item.productId?.image }} style={styles.itemImage} resizeMode="contain" />
                    </View>
                    <View style={styles.itemDetails}>
                      <View style={styles.itemHeader}>
                        <View>
                          <Text style={styles.itemMaterial}>{item.productId?.material}</Text>
                          <Text style={styles.itemName}>{item.productId?.name}</Text>
                        </View>
                        <TouchableOpacity onPress={() => removeItem(item.productId?._id)}>
                          <Trash2 size={18} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.itemFooter}>
                        <Text style={styles.itemPrice}>${item.productId?.price?.toLocaleString()}</Text>
                        <View style={styles.qtySelector}>
                          <TouchableOpacity onPress={() => updateQty(item.productId?._id, -1, item.quantity)}><Minus size={14} color="#1a1a1a" /></TouchableOpacity>
                          <Text style={styles.qtyText}>{item.quantity}</Text>
                          <TouchableOpacity onPress={() => updateQty(item.productId?._id, 1, item.quantity)}><Plus size={14} color="#1a1a1a" /></TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
                <View style={styles.summaryCard}>
                  <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>${subtotal.toLocaleString()}</Text></View>
                  <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Shipping</Text><Text style={styles.summaryValue}>{shipping === 0 ? 'FREE' : `$${shipping}`}</Text></View>
                  <View style={[styles.summaryRow, styles.totalRow]}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>${total.toLocaleString()}</Text></View>
                  <TouchableOpacity style={styles.checkoutBtn} onPress={() => setCheckoutVisible(true)}>
                    <Text style={styles.checkoutText}>CHECKOUT</Text><ArrowRight size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.emptyContainer}><ShoppingBag size={60} color="#f1f5f9" /><Text style={styles.emptyTitle}>Empty Bag</Text></View>
            )}
          </>
        ) : (
          <View style={styles.historySection}>
            {orderHistory.map((order) => (
              <TouchableOpacity key={order._id} style={styles.historyCard}>
                <View style={styles.historyIcon}><Package size={24} color="#C5A059" /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyId}>{order._id.slice(-8).toUpperCase()}</Text>
                  <Text style={styles.historyDate}>{new Date(order.createdAt).toLocaleDateString()}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.historyTotal}>${order.total?.toLocaleString()}</Text>
                  <Text style={[styles.historyStatus, { color: order.status === 'Delivered' ? '#10b981' : '#C5A059' }]}>{order.status}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={isCheckoutVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.paymentSheet}>
            <View style={styles.sheetHeader}><Text style={styles.sheetTitle}>Checkout</Text><TouchableOpacity onPress={() => setCheckoutVisible(false)}><X size={24} color="#1a1a1a" /></TouchableOpacity></View>
            {paymentStatus === 'idle' ? (
              <>
                <TouchableOpacity style={[styles.methodCard, selectedMethod === 'card' && styles.selectedMethod]} onPress={() => setSelectedMethod('card')}>
                  <CreditCard size={20} color="#C5A059" /><Text style={{flex: 1, marginLeft: 10}}>Credit Card</Text>
                  <View style={[styles.radio, selectedMethod === 'card' && styles.radioActive]} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.payNowBtn} onPress={processPayment}>
                  <Text style={styles.payNowText}>CONFIRM ${total.toLocaleString()}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.statusContainer}>
                {paymentStatus === 'processing' ? <ActivityIndicator size="large" color="#C5A059" /> : <CheckCircle2 size={50} color="#10b981" />}
                <Text style={styles.statusText}>{paymentStatus === 'processing' ? 'Processing...' : 'Success!'}</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, gap: 8 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#C5A059' },
  tabText: { fontSize: 11, fontWeight: '700', color: '#94a3b8' },
  activeTabText: { color: '#1a1a1a' },
  scrollContent: { padding: 20 },
  cartCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 20, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#f1f5f9' },
  imageContainer: { width: 80, height: 80, backgroundColor: '#f8fafc', borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  itemImage: { width: '80%', height: '80%' },
  itemDetails: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  itemMaterial: { fontSize: 10, color: '#94a3b8', fontWeight: '800' },
  itemName: { fontSize: 15, fontWeight: '600' },
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemPrice: { fontSize: 14, fontWeight: '700' },
  qtySelector: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#f8fafc', padding: 5, borderRadius: 8 },
  qtyText: { fontSize: 14, fontWeight: '700' },
  summaryCard: { backgroundColor: '#1a1a1a', borderRadius: 20, padding: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { color: '#94a3b8' },
  summaryValue: { color: '#fff' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 10 },
  totalLabel: { color: '#fff', fontWeight: '700' },
  totalValue: { color: '#C5A059', fontWeight: '800', fontSize: 18 },
  checkoutBtn: { backgroundColor: '#C5A059', padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15, gap: 10 },
  checkoutText: { color: '#fff', fontWeight: '800' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyTitle: { color: '#94a3b8', marginTop: 10 },
  historyCard: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#fff', borderRadius: 15, marginBottom: 10, borderWidth: 1, borderColor: '#f1f5f9' },
  historyIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#fefce8', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  historyId: { fontWeight: '700' },
  historyDate: { fontSize: 12, color: '#94a3b8' },
  historyTotal: { fontWeight: '700' },
  historyStatus: { fontSize: 12, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  paymentSheet: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, minHeight: 300 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: 18, fontWeight: '700' },
  methodCard: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 15 },
  selectedMethod: { borderColor: '#C5A059' },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#cbd5e1' },
  radioActive: { backgroundColor: '#C5A059', borderColor: '#C5A059' },
  payNowBtn: { backgroundColor: '#1a1a1a', padding: 18, borderRadius: 12, alignItems: 'center' },
  payNowText: { color: '#fff', fontWeight: '800' },
  statusContainer: { alignItems: 'center', paddingVertical: 30 },
  statusText: { marginTop: 15, fontWeight: '700' }
});