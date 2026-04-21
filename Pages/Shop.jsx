import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  Modal,
  ActivityIndicator,
  Animated
} from 'react-native';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ChevronRight, 
  History, 
  CheckCircle2,
  ArrowRight,
  Package,
  X,
  CreditCard,
  Smartphone,
  ShieldCheck
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function Shop({ navigation }) {
  const [activeTab, setActiveTab] = useState('bag');
  const [isCheckoutVisible, setCheckoutVisible] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success
  const [selectedMethod, setSelectedMethod] = useState('card');
  
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'Eternity Band',
      price: 3200,
      material: '18k Gold',
      qty: 1,
      image: 'https://purepng.com/public/uploads/large/purepng.com-gold-diamond-ringdiamond-gold-ringjewelery-1701527122144ayp9p.png'
    },
    {
      id: '2',
      name: 'Silver Blossom',
      price: 1800,
      material: 'Silver',
      qty: 1,
      image: 'https://purepng.com/public/uploads/large/purepng.com-silver-ringjewelryjewellerybroochesringsnecklacesearringsearringsornamentsflowersdiamondsilverring-1701528881414tgi3w.png'
    }
  ]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const shipping = subtotal > 5000 ? 0 : 50;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    setCheckoutVisible(true);
  };

  const processPayment = () => {
    setPaymentStatus('processing');
    // Simulate API Call delay
    setTimeout(() => {
      setPaymentStatus('success');
      // After success, clear cart and eventually close
      setTimeout(() => {
        setCheckoutVisible(false);
        setCartItems([]);
        setPaymentStatus('idle');
        setActiveTab('history'); // Move to history after purchase
      }, 2000);
    }, 2500);
  };

  const updateQty = (id, delta) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* Header Tabs */}
      <View style={styles.tabHeader}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'bag' && styles.activeTab]} 
          onPress={() => setActiveTab('bag')}
        >
          <ShoppingBag size={18} color={activeTab === 'bag' ? '#1a1a1a' : '#94a3b8'} />
          <Text style={[styles.tabText, activeTab === 'bag' && styles.activeTabText]}>SHOPPING BAG</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.activeTab]} 
          onPress={() => setActiveTab('history')}
        >
          <History size={18} color={activeTab === 'history' ? '#1a1a1a' : '#94a3b8'} />
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>HISTORY</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'bag' ? (
          <>
            {cartItems.length > 0 ? (
              <>
                {cartItems.map((item) => (
                  <View key={item.id} style={styles.cartCard}>
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="contain" />
                    </View>
                    <View style={styles.itemDetails}>
                      <View style={styles.itemHeader}>
                        <View>
                          <Text style={styles.itemMaterial}>{item.material}</Text>
                          <Text style={styles.itemName}>{item.name}</Text>
                        </View>
                        <TouchableOpacity onPress={() => removeItem(item.id)}>
                          <Trash2 size={18} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                      
                      <View style={styles.itemFooter}>
                        <Text style={styles.itemPrice}>${item.price.toLocaleString()}</Text>
                        <View style={styles.qtySelector}>
                          <TouchableOpacity onPress={() => updateQty(item.id, -1)} style={styles.qtyBtn}>
                            <Minus size={14} color="#1a1a1a" />
                          </TouchableOpacity>
                          <Text style={styles.qtyText}>{item.qty}</Text>
                          <TouchableOpacity onPress={() => updateQty(item.id, 1)} style={styles.qtyBtn}>
                            <Plus size={14} color="#1a1a1a" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}

                <View style={styles.summaryCard}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>${subtotal.toLocaleString()}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Insured Shipping</Text>
                    <Text style={styles.summaryValue}>{shipping === 0 ? 'COMPLIMENTARY' : `$${shipping}`}</Text>
                  </View>
                  <View style={[styles.summaryRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total Estimate</Text>
                    <Text style={styles.totalValue}>${total.toLocaleString()}</Text>
                  </View>

                  <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
                    <Text style={styles.checkoutText}>PROCEED TO CHECKOUT</Text>
                    <ArrowRight size={18} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.secureText}>
                    <CheckCircle2 size={12} color="#10b981" /> Secured by Atelier Encryption
                  </Text>
                </View>
              </>
            ) : (
              <View style={styles.emptyContainer}>
                <ShoppingBag size={60} color="#f1f5f9" strokeWidth={1} />
                <Text style={styles.emptyTitle}>Your Bag is Empty</Text>
                <Text style={styles.emptySubtitle}>Pieces you add to your bag will appear here.</Text>
                <TouchableOpacity 
                  style={styles.continueBtn}
                  onPress={() => navigation.navigate('Catalogue')}
                >
                  <Text style={styles.continueText}>DISCOVER COLLECTIONS</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <View style={styles.historySection}>
             <TouchableOpacity style={styles.historyCard}>
                <View style={styles.historyIcon}>
                  <Package size={24} color="#C5A059" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyId}>LUM-99201</Text>
                  <Text style={styles.historyDate}>Today • 1 Item(s)</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.historyTotal}>$5,000</Text>
                  <Text style={styles.historyStatus}>Processing</Text>
                </View>
                <ChevronRight size={16} color="#cbd5e1" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
          </View>
        )}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Payment Gateway Modal */}
      <Modal
        visible={isCheckoutVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCheckoutVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.paymentSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Checkout</Text>
              <TouchableOpacity onPress={() => setCheckoutVisible(false)}>
                <X size={24} color="#1a1a1a" />
              </TouchableOpacity>
            </View>

            {paymentStatus === 'idle' ? (
              <>
                <Text style={styles.paymentSubtitle}>Select your preferred payment method</Text>
                
                <TouchableOpacity 
                  style={[styles.methodCard, selectedMethod === 'card' && styles.selectedMethod]} 
                  onPress={() => setSelectedMethod('card')}
                >
                  <View style={styles.methodIcon}><CreditCard size={20} color={selectedMethod === 'card' ? '#C5A059' : '#64748b'} /></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.methodName}>Credit or Debit Card</Text>
                    <Text style={styles.methodDetail}>Visa, Mastercard, Amex</Text>
                  </View>
                  <View style={[styles.radio, selectedMethod === 'card' && styles.radioActive]} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.methodCard, selectedMethod === 'apple' && styles.selectedMethod]} 
                  onPress={() => setSelectedMethod('apple')}
                >
                  <View style={styles.methodIcon}><Smartphone size={20} color={selectedMethod === 'apple' ? '#C5A059' : '#64748b'} /></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.methodName}>Apple Pay</Text>
                    <Text style={styles.methodDetail}>Express checkout with TouchID</Text>
                  </View>
                  <View style={[styles.radio, selectedMethod === 'apple' && styles.radioActive]} />
                </TouchableOpacity>

                <View style={styles.paymentTotalBox}>
                  <View style={styles.totalLabelRow}>
                    <ShieldCheck size={14} color="#10b981" />
                    <Text style={styles.secureBadge}>End-to-end encrypted payment</Text>
                  </View>
                  <Text style={styles.finalAmount}>Pay ${total.toLocaleString()}</Text>
                </View>

                <TouchableOpacity style={styles.payNowBtn} onPress={processPayment}>
                  <Text style={styles.payNowText}>CONFIRM PAYMENT</Text>
                </TouchableOpacity>
              </>
            ) : paymentStatus === 'processing' ? (
              <View style={styles.statusContainer}>
                <ActivityIndicator size="large" color="#C5A059" />
                <Text style={styles.statusText}>Authorizing Transaction...</Text>
                <Text style={styles.statusSub}>Please do not close the app</Text>
              </View>
            ) : (
              <View style={styles.statusContainer}>
                <View style={styles.successCircle}>
                  <CheckCircle2 size={50} color="#fff" />
                </View>
                <Text style={styles.statusText}>Order Placed!</Text>
                <Text style={styles.statusSub}>Your artisan piece is being prepared.</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  tabHeader: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#f1f5f9',
    paddingHorizontal: 20
  },
  tab: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 15,
    gap: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  activeTab: { borderBottomColor: '#C5A059' },
  tabText: { fontSize: 11, fontWeight: '700', color: '#94a3b8', letterSpacing: 1 },
  activeTabText: { color: '#1a1a1a' },
  scrollContent: { padding: 20 },
  cartCard: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 15, 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  imageContainer: { 
    width: 90, 
    height: 90, 
    backgroundColor: '#f8fafc', 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  itemImage: { width: '80%', height: '80%' },
  itemDetails: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  itemMaterial: { fontSize: 10, color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase' },
  itemName: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginTop: 2 },
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemPrice: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  qtySelector: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f8fafc', 
    borderRadius: 10, 
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  qtyText: { fontSize: 14, fontWeight: '700', minWidth: 15, textAlign: 'center' },
  summaryCard: { 
    backgroundColor: '#1a1a1a', 
    borderRadius: 24, 
    padding: 25, 
    marginTop: 10,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { color: '#94a3b8', fontSize: 14 },
  summaryValue: { color: '#fff', fontSize: 14, fontWeight: '600' },
  totalRow: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 15, marginTop: 5 },
  totalLabel: { color: '#fff', fontSize: 16, fontWeight: '400' },
  totalValue: { color: '#C5A059', fontSize: 20, fontWeight: '800' },
  checkoutBtn: { 
    backgroundColor: '#C5A059', 
    height: 55, 
    borderRadius: 12, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 20,
    gap: 12
  },
  checkoutText: { color: '#fff', fontSize: 14, fontWeight: '800', letterSpacing: 1 },
  secureText: { textAlign: 'center', color: '#64748b', fontSize: 11, marginTop: 15 },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  paymentSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingBottom: 40,
    minHeight: height * 0.5
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a'
  },
  paymentSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  selectedMethod: {
    borderColor: '#C5A059',
    backgroundColor: '#fffcf5'
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  methodName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a'
  },
  methodDetail: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cbd5e1'
  },
  radioActive: {
    borderColor: '#C5A059',
    backgroundColor: '#C5A059'
  },
  paymentTotalBox: {
    marginTop: 20,
    alignItems: 'center'
  },
  totalLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 5
  },
  secureBadge: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600'
  },
  finalAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a'
  },
  payNowBtn: {
    backgroundColor: '#1a1a1a',
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25
  },
  payNowText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1
  },
  statusContainer: {
    alignItems: 'center',
    paddingVertical: 40
  },
  statusText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 20
  },
  statusSub: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center'
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center'
  }
});