import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity, 
  Dimensions, Modal, Pressable, Alert, ActivityIndicator, SafeAreaView
} from 'react-native';
import { Heart, Filter, Grid, LayoutList, RotateCcw, X } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../api';

const { width } = Dimensions.get('window');

const Catalogue = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]); // Initialized as empty array
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

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    console.log("--- 1. LOAD DATA START ---");
    try {
      const token = await AsyncStorage.getItem('token');
      const [productRes, wishlistRes] = await Promise.all([
        apiFetch('/products', 'GET'),
        token ? apiFetch('/users/wishlist', 'GET', null, token) : Promise.resolve(null)
      ]);

      // DEBUG: This will show you the exact structure of your data
      console.log("--- 2. FULL API RESPONSE ---", JSON.stringify(productRes));

      let fetchedProducts = [];

      // Logic to find the array inside the object
      if (Array.isArray(productRes)) {
        fetchedProducts = productRes;
      } else if (productRes?.data && Array.isArray(productRes.data)) {
        fetchedProducts = productRes.data;
      } else if (productRes?.products && Array.isArray(productRes.products)) {
        fetchedProducts = productRes.products;
      } else if (productRes?.data?.products && Array.isArray(productRes.data.products)) {
        fetchedProducts = productRes.data.products;
      }

      console.log("--- 3. EXTRACTED ARRAY SIZE ---", fetchedProducts.length);
      
      setProducts(fetchedProducts);

      // Handle Wishlist extraction similarly
      const fetchedWishlist = wishlistRes?.data || wishlistRes?.wishlist || [];
      if (Array.isArray(fetchedWishlist)) {
        setWishlistIds(fetchedWishlist.map(item => item._id));
      }

    } catch (e) {
      console.log("--- LOAD DATA FATAL ERROR ---", e);
      setProducts([]); 
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    // FORCE products to be an array so .filter never crashes
    const safeProducts = products || [];
    
    console.log("--- 4. FILTERING --- Active:", activeFilter, "Source Size:", safeProducts.length);

    const result = safeProducts.filter(item => {
      if (!item) return false;

      const matchesType = activeFilter === 'All' || 
        (item.type?.toLowerCase() === activeFilter.toLowerCase());

      const matchesMaterial = selectedMaterial === 'All' || 
        (item.material === selectedMaterial);

      const priceConfig = priceOptions.find(p => p.label === priceRange) || priceOptions[0];
      const itemPrice = Number(item.price) || 0;
      const matchesPrice = itemPrice >= priceConfig.min && itemPrice <= priceConfig.max;

      return matchesType && matchesMaterial && matchesPrice;
    });

    console.log("--- 5. FILTER RESULT --- Count:", result.length);
    return result;
  }, [products, activeFilter, selectedMaterial, priceRange]);

  const toggleWishlist = async (product) => {
    const productId = product._id;
    const isFav = wishlistIds.includes(productId);
    const token = await AsyncStorage.getItem('token');
    if (!token) return Alert.alert("Error", "Login required");
    
    setWishlistIds(prev => isFav ? prev.filter(id => id !== productId) : [...prev, productId]);
    try {
      isFav 
        ? await apiFetch(`/users/wishlist/${productId}`, 'DELETE', null, token)
        : await apiFetch('/users/wishlist', 'POST', { productId }, token);
    } catch (e) {
      console.log("WISHLIST ERROR:", e);
    }
  };

  const renderItem = ({ item }) => {
    const isFavorited = wishlistIds.includes(item._id);
    const cardWidth = isGridView ? (width / 2) - 30 : width - 40;

    return (
      <TouchableOpacity
        style={[styles.card, { width: cardWidth }]}
        onPress={() => navigation.navigate("Details", { product: item })}
      >
        <View style={[styles.imageWrapper, { height: isGridView ? 180 : 260 }]}>
          <Image source={{ uri: item.image }} style={styles.img} resizeMode="contain" />
          <TouchableOpacity style={styles.favBtn} onPress={() => toggleWishlist(item)}>
            <Heart size={18} color={isFavorited ? "#ef4444" : "#94a3b8"} fill={isFavorited ? "#ef4444" : "transparent"} />
          </TouchableOpacity>
        </View>
        <View style={styles.info}>
          <Text style={styles.mat}>{item.material || 'Lumina Atelier'}</Text>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.price}>${Number(item.price || 0).toLocaleString()}</Text>
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
            <TouchableOpacity onPress={() => {setActiveFilter('All'); setSelectedMaterial('All'); setPriceRange('All');}}>
              <Text style={{color: '#C5A059', marginTop: 10}}>Reset All</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
  favBtn: { position: 'absolute', top: 12, right: 12, backgroundColor: '#fff', padding: 8, borderRadius: 12 },
  info: { marginTop: 12 },
  mat: { fontSize: 10, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' },
  name: { fontSize: 15, fontWeight: '500', color: '#1a1a1a', marginTop: 2 },
  price: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginTop: 4 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyTitle: { color: '#94a3b8', fontSize: 14 }
});

export default Catalogue;