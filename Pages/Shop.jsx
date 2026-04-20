import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  SafeAreaView
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
  Package
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function Shop({ navigation }) {
  const [activeTab, setActiveTab] = useState('bag'); // 'bag' or 'history'
  
  // Mock Data for the Cart
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

  const history = [
    {
      id: 'LUM-99201',
      date: '14 March 2024',
      total: '$4,500',
      status: 'Delivered',
      items: 1
    },
    {
      id: 'LUM-88122',
      date: '02 Feb 2024',
      total: '$2,100',
      status: 'Delivered',
      items: 2
    }
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const shipping = subtotal > 5000 ? 0 : 50;
  const total = subtotal + shipping;

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

                  <TouchableOpacity style={styles.checkoutBtn}>
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
          /* History Section */
          <View style={styles.historySection}>
            {history.map((order) => (
              <TouchableOpacity key={order.id} style={styles.historyCard}>
                <View style={styles.historyIcon}>
                  <Package size={24} color="#C5A059" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyId}>{order.id}</Text>
                  <Text style={styles.historyDate}>{order.date} • {order.items} Item(s)</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.historyTotal}>{order.total}</Text>
                  <Text style={styles.historyStatus}>{order.status}</Text>
                </View>
                <ChevronRight size={16} color="#cbd5e1" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={{ height: 120 }} />
      </ScrollView>
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
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10
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
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#1a1a1a', marginTop: 20 },
  emptySubtitle: { fontSize: 14, color: '#94a3b8', marginTop: 8, textAlign: 'center' },
  continueBtn: { marginTop: 30, borderWidth: 1, borderColor: '#e2e8f0', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 12 },
  continueText: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  historySection: { marginTop: 10 },
  historyCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 20, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  historyIcon: { 
    width: 45, 
    height: 45, 
    backgroundColor: '#fefce8', 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 15
  },
  historyId: { fontSize: 14, fontWeight: '700', color: '#1a1a1a' },
  historyDate: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  historyTotal: { fontSize: 14, fontWeight: '700', color: '#1a1a1a' },
  historyStatus: { fontSize: 10, color: '#10b981', fontWeight: '800', textTransform: 'uppercase', marginTop: 2 }
});