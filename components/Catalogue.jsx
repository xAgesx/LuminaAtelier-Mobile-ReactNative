import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity, 
  Dimensions, Modal, Pressable, Alert, ActivityIndicator, SafeAreaView,
  ScrollView
} from 'react-native';
import { Heart, Filter, Grid, LayoutList, RotateCcw, X } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../api';

const { width, height } = Dimensions.get('window');

const Catalogue = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState([]); 
  
  const [isGridView, setIsGridView] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  const priceOptions = [
    { label: 'All', min: 0, max: Infinity },
    { label: 'Under $2,000', min: 0, max: 2000 },
    { label: '$2,000 - $4,000', min: 2000, max: 4000 },
    { label: '$4,000+', min: 4000, max: Infinity },
  ];

  const materials = ['All', '18k Gold', 'Silver', 'Platinum', 'Rose Gold', 'Steel'];

  const loadData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const [productRes, wishlistRes] = await Promise.all([
        apiFetch('/products', 'GET'),
        token ? apiFetch('/users/wishlist', 'GET', null, token) : Promise.resolve(null)
      ]);

      let rawProducts = productRes?.data || productRes || [];
      if (rawProducts && typeof rawProducts === 'object' && !Array.isArray(rawProducts)) {
        rawProducts = rawProducts.products || rawProducts.data || [];
      }
      setProducts(Array.isArray(rawProducts) ? rawProducts : []);

      if (wishlistRes) {
        const wData = wishlistRes.data || wishlistRes || [];
        if (Array.isArray(wData)) {
          setWishlistIds(wData.map(item => item._id || item.id || (item.product && item.product._id) || item));
        }
      }
    } catch (e) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const toggleWishlist = async (product) => {
    const productId = product._id;
    if (!productId) {
      console.log("CRITICAL ERROR: This product has no _id", product);
      return;
    }

    const isFav = wishlistIds.includes(productId);
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      Alert.alert("Membership Required", "Please log in.");
      return;
    }
    
    setWishlistIds(prev => isFav ? prev.filter(id => id !== productId) : [...prev, productId]);

    try {
      let res;
      if (isFav) {
        res = await apiFetch(`/wishlist/${productId}`, 'DELETE', null, token);
      } else {
        // Change { productId } to { id: productId } if your backend expects 'id'
        res = await apiFetch('/wishlist', 'POST', { productId }, token);
      }
      console.log("Wishlist Server Response:", res);
    } catch (e) {
      console.log("WISHLIST API ERROR:", e);
      setWishlistIds(prev => isFav ? [...prev, productId] : prev.filter(id => id !== productId));
    }
  };

  const filteredData = useMemo(() => {
    const source = Array.isArray(products) ? products : [];
    return source.filter(item => {
      if (!item) return false;
      const matchesType = activeFilter === 'All' || 
        (item.type?.toLowerCase().trim() === activeFilter.toLowerCase().trim());
      const matchesMaterial = selectedMaterial === 'All' || 
        (item.material === selectedMaterial);
      const priceConfig = priceOptions.find(p => p.label === priceRange) || priceOptions[0];
      const itemPrice = Number(item.price) || 0;
      const matchesPrice = itemPrice >= priceConfig.min && itemPrice <= priceConfig.max;
      return matchesType && matchesMaterial && matchesPrice;
    });
  }, [products, activeFilter, selectedMaterial, priceRange]);

  const renderItem = ({ item }) => {
    const isFavorited = wishlistIds.includes(item._id);
    const cardWidth = isGridView ? (width / 2) - 30 : width - 40;

    return (
      <TouchableOpacity
        style={[styles.card, { width: cardWidth }]}
        onPress={() => navigation.navigate("Details", { product: item })}
      >
        <View style={[styles.imageWrapper, { height: isGridView ? 180 : 250 }]}>
          <Image source={{ uri: item.image }} style={styles.img} resizeMode="contain" />
          <TouchableOpacity style={styles.favBtn} onPress={() => toggleWishlist(item)}>
            <Heart size={18} color={isFavorited ? "#ef4444" : "#94a3b8"} fill={isFavorited ? "#ef4444" : "transparent"} />
          </TouchableOpacity>
        </View>
        <View style={styles.info}>
          <Text style={styles.mat}>{item.material || 'Fine Jewelry'}</Text>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.price}>${(Number(item.price) || 0).toLocaleString()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) return (
    <View style={styles.centered}><ActivityIndicator size="large" color="#C5A059" /></View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.stickyHeader}>
        <View style={{ height: 60 }}>
          <FlatList
            data={['All', 'Trending', 'New', 'Deals']}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setActiveFilter(item)}
                style={[styles.chip, activeFilter === item && styles.activeChip]}
              >
                <Text style={[styles.chipText, activeFilter === item && styles.activeChipText]}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.controlBar}>
          <Text style={styles.countText}>{filteredData.length} Pieces Found</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={styles.filterTrigger}>
              <Filter size={18} color="#1a1a1a" />
              <Text style={styles.filterTriggerText}>Refine</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsGridView(!isGridView)}>
              {isGridView ? <LayoutList size={20} color="#1a1a1a" /> : <Grid size={20} color="#1a1a1a" />}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        numColumns={isGridView ? 2 : 1}
        key={isGridView ? 'G' : 'L'}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={isGridView ? { justifyContent: 'space-between' } : null}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Vault Empty</Text>
            <TouchableOpacity onPress={() => { setActiveFilter('All'); setSelectedMaterial('All'); setPriceRange('All'); }}>
              <Text style={{color: '#C5A059', marginTop: 10}}>Reset All</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <Modal animationType="slide" transparent visible={isFilterModalVisible}>
        <Pressable style={styles.modalOverlay} onPress={() => setFilterModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Refine</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}><X size={24} color="#1a1a1a" /></TouchableOpacity>
            </View>
            <ScrollView>
              <Text style={styles.sectionLabel}>Material</Text>
              <View style={styles.optionGrid}>
                {materials.map(m => (
                  <TouchableOpacity key={m} onPress={() => setSelectedMaterial(m)} style={[styles.optionItem, selectedMaterial === m && styles.activeOption]}>
                    <Text style={[styles.optionText, selectedMaterial === m && styles.activeOptionText]}>{m}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={[styles.sectionLabel, {marginTop: 20}]}>Price</Text>
              <View style={styles.optionGrid}>
                {priceOptions.map(p => (
                  <TouchableOpacity key={p.label} onPress={() => setPriceRange(p.label)} style={[styles.optionItem, priceRange === p.label && styles.activeOption]}>
                    <Text style={[styles.optionText, priceRange === p.label && styles.activeOptionText]}>{p.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.applyBtn} onPress={() => setFilterModalVisible(false)}>
              <Text style={styles.applyBtnText}>Show Results</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  stickyHeader: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  filterList: { paddingHorizontal: 20, paddingVertical: 10 },
  chip: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f8fafc', marginRight: 10, borderWidth: 1, borderColor: '#f1f5f9' },
  activeChip: { backgroundColor: '#1a1a1a', borderColor: '#1a1a1a' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  activeChipText: { color: '#fff' },
  controlBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  countText: { fontSize: 11, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  filterTrigger: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  filterTriggerText: { fontSize: 13, fontWeight: '600' },
  listContainer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 100 },
  card: { marginBottom: 25 },
  imageWrapper: { width: '100%', backgroundColor: '#f8fafc', borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  img: { width: '80%', height: '80%' },
  favBtn: { position: 'absolute', top: 12, right: 12, backgroundColor: '#fff', padding: 8, borderRadius: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  info: { marginTop: 12 },
  mat: { fontSize: 10, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' },
  name: { fontSize: 15, fontWeight: '500', color: '#1a1a1a', marginTop: 2 },
  price: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginTop: 4 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyTitle: { color: '#94a3b8', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: height * 0.8 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  modalTitle: { fontSize: 20, fontWeight: '700' },
  sectionLabel: { fontSize: 12, fontWeight: '800', marginBottom: 15, textTransform: 'uppercase', color: '#94a3b8' },
  optionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  optionItem: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#f1f5f9' },
  activeOption: { backgroundColor: '#1a1a1a', borderColor: '#1a1a1a' },
  optionText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  activeOptionText: { color: '#fff' },
  applyBtn: { backgroundColor: '#1a1a1a', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 30 },
  applyBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});

export default Catalogue;