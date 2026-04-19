import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  Pressable,
  Animated
} from 'react-native';
import { Heart, Filter, Grid, LayoutList, Flame, Sparkles, Tag, X, Check, RotateCcw } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const DATA = [
  { id: '1', name: 'Eternity Band', price: 3200, material: '18k Gold', type: 'Trending', image: 'https://purepng.com/public/uploads/large/purepng.com-gold-diamond-ringdiamond-gold-ringjewelery-1701527122144ayp9p.png' },
  { id: '2', name: 'Silver Blossom', price: 1800, material: 'Silver', type: 'Deals', image: 'https://purepng.com/public/uploads/large/purepng.com-silver-ringjewelryjewellerybroochesringsnecklacesearringsearringsornamentsflowersdiamondsilverring-1701528881414tgi3w.png' },
  { id: '3', name: 'Sapphire Night', price: 4500, material: 'Platinum', type: 'New', image: 'https://purepng.com/public/uploads/large/purepng.com-gold-diamond-ringdiamond-gold-ringjewelery-1701527122144ayp9p.png' },
  { id: '4', name: 'Rose Petal', price: 2100, material: 'Rose Gold', type: 'Trending', image: 'https://purepng.com/public/uploads/large/purepng.com-silver-ringjewelryjewellerybroochesringsnecklacesearringsearringsornamentsflowersdiamondsilverring-1701528881414tgi3w.png' },
  { id: '5', name: 'Industrial Link', price: 1200, material: 'Steel', type: 'Deals', image: 'https://purepng.com/public/uploads/large/purepng.com-silver-ringjewelryjewellerybroochesringsnecklacesearringsearringsornamentsflowersdiamondsilverring-1701528881414tgi3w.png' },
  { id: '6', name: 'Aether Ring', price: 5600, material: '18k White Gold', type: 'New', image: 'https://purepng.com/public/uploads/large/purepng.com-gold-diamond-ringdiamond-gold-ringjewelery-1701527122144ayp9p.png' },
];

const Catalogue = () => {
  const navigation = useNavigation();
  const [isGridView, setIsGridView] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  // Advanced Filter States
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [priceRange, setPriceRange] = useState('All');

  const filters = [
    { label: 'All', icon: null },
    { label: 'Trending', icon: Flame },
    { label: 'New', icon: Sparkles },
    { label: 'Deals', icon: Tag },
  ];

  const materials = ['All', '18k Gold', 'Silver', 'Platinum', 'Rose Gold', 'Steel'];
  const priceOptions = [
    { label: 'All', min: 0, max: Infinity },
    { label: 'Under $2,000', min: 0, max: 2000 },
    { label: '$2,000 - $4,000', min: 2000, max: 4000 },
    { label: '$4,000+', min: 4000, max: Infinity },
  ];

  const resetFilters = () => {
    setActiveFilter('All');
    setSelectedMaterial('All');
    setPriceRange('All');
  };

  const isAnyFilterActive = activeFilter !== 'All' || selectedMaterial !== 'All' || priceRange !== 'All';

  const filteredData = useMemo(() => {
    return DATA.filter(item => {
      const matchesType = activeFilter === 'All' || item.type === activeFilter;
      const matchesMaterial = selectedMaterial === 'All' || item.material === selectedMaterial;

      const priceConfig = priceOptions.find(p => p.label === priceRange);
      const matchesPrice = item.price >= priceConfig.min && item.price <= priceConfig.max;

      return matchesType && matchesMaterial && matchesPrice;
    });
  }, [activeFilter, selectedMaterial, priceRange]);

  const renderItem = ({ item }) => {
    const cardWidth = isGridView ? (width / 2) - 30 : width - 40;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.card, { width: cardWidth }]}
        onPress={() => navigation.navigate("Details", { product: item })}
      >
        <View style={[styles.imageWrapper, { height: isGridView ? 180 : 280 }]}>
          <Image source={{ uri: item.image }} style={styles.img} resizeMode="contain" />
          <TouchableOpacity style={styles.favBtn}>
            <Heart size={18} color="#94a3b8" strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
        <View style={styles.info}>
          <Text style={styles.mat}>{item.material}</Text>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.price}>${item.price.toLocaleString()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.stickyHeader}>
        <FlatList
          data={filters}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const Icon = item.icon;
            const isActive = activeFilter === item.label;
            return (
              <TouchableOpacity
                onPress={() => setActiveFilter(item.label)}
                style={[styles.chip, isActive && styles.activeChip]}
              >
                {Icon && <Icon size={14} color={isActive ? "#fff" : "#64748b"} style={{ marginRight: 6 }} />}
                <Text style={[styles.chipText, isActive && styles.activeChipText]}>{item.label}</Text>
              </TouchableOpacity>
            );
          }}
        />

        <View style={styles.controlBar}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={styles.countText}>{filteredData.length} Pieces found</Text>
            {isAnyFilterActive && (
              <TouchableOpacity onPress={resetFilters} style={styles.resetMini}>
                <RotateCcw size={12} color="#6366f1" />
                <Text style={styles.resetMiniText}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.filterTrigger}
              onPress={() => setFilterModalVisible(true)}
            >
              <Filter size={18} color={isAnyFilterActive ? "#6366f1" : "#1a1a1a"} />
              <Text style={[styles.filterTriggerText, isAnyFilterActive && { color: '#6366f1' }]}>Refine</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.layoutToggle}
              onPress={() => setIsGridView(!isGridView)}
            >
              {isGridView ? <LayoutList size={20} color="#1a1a1a" /> : <Grid size={20} color="#1a1a1a" />}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={isGridView ? 2 : 1}
        key={isGridView ? 'GRID' : 'LIST'}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={isGridView ? { justifyContent: 'space-between' } : null}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No pieces found</Text>
            <Text style={styles.emptySub}>Try adjusting your filters to find what you're looking for.</Text>
            <TouchableOpacity style={styles.emptyReset} onPress={resetFilters}>
              <Text style={styles.emptyResetText}>Clear All Filters</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setFilterModalVisible(false)}
        >
          <Pressable style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Refine Selection</Text>
                <Text style={styles.modalSub}>Customize your discovery</Text>
              </View>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <X size={24} color="#1a1a1a" />
              </TouchableOpacity>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.sectionLabel}>Material</Text>
              <View style={styles.optionGrid}>
                {materials.map((m) => (
                  <TouchableOpacity
                    key={m}
                    onPress={() => setSelectedMaterial(m)}
                    style={[styles.optionItem, selectedMaterial === m && styles.activeOption]}
                  >
                    <Text style={[styles.optionText, selectedMaterial === m && styles.activeOptionText]}>{m}</Text>
                    {selectedMaterial === m && <Check size={14} color="#fff" />}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.sectionLabel}>Price Range</Text>
              <View style={styles.optionGrid}>
                {priceOptions.map((p) => (
                  <TouchableOpacity
                    key={p.label}
                    onPress={() => setPriceRange(p.label)}
                    style={[styles.optionItem, priceRange === p.label && styles.activeOption]}
                  >
                    <Text style={[styles.optionText, priceRange === p.label && styles.activeOptionText]}>{p.label}</Text>
                    {priceRange === p.label && <Check size={14} color="#fff" />}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={resetFilters}
              >
                <RotateCcw size={18} color="#1a1a1a" />
                <Text style={styles.resetBtnText}>Reset All</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.applyBtn}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={styles.applyBtnText}>Show Results</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  stickyHeader: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingTop: 10,
    zIndex: 10,
  },
  filterList: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  activeChip: { backgroundColor: '#1a1a1a', borderColor: '#1a1a1a' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  activeChipText: { color: '#fff' },
  controlBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resetMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#eef2ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  resetMiniText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6366f1',
    textTransform: 'uppercase',
  },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  filterTrigger: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  filterTriggerText: { fontSize: 13, fontWeight: '600', color: '#1a1a1a' },
  layoutToggle: { padding: 4 },
  listContainer: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120 },
  card: { marginBottom: 30 },
  imageWrapper: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  img: { width: '75%', height: '75%' },
  favBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  info: { marginTop: 15, paddingHorizontal: 5 },
  mat: { fontSize: 10, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' },
  name: { fontSize: 16, fontWeight: '400', color: '#1a1a1a', marginTop: 2 },
  price: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginTop: 4 },

  // Empty State
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 },
  emptySub: { fontSize: 14, color: '#64748b', textAlign: 'center', paddingHorizontal: 40, marginBottom: 24 },
  emptyReset: { backgroundColor: '#1a1a1a', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  emptyResetText: { color: '#fff', fontWeight: '600' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    minHeight: height * 0.65,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 30 },
  modalTitle: { fontSize: 22, fontWeight: '700', color: '#1a1a1a' },
  modalSub: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  filterSection: { marginBottom: 25 },
  sectionLabel: { fontSize: 13, fontWeight: '800', color: '#1a1a1a', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 0.5 },
  optionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 8,
  },
  activeOption: { backgroundColor: '#1a1a1a', borderColor: '#1a1a1a' },
  optionText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  activeOptionText: { color: '#fff' },
  modalFooter: { flexDirection: 'row', gap: 12, marginTop: 'auto', marginBottom: 20 },
  resetBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#f1f5f9',
    borderRadius: 16,
    paddingVertical: 18,
  },
  resetBtnText: { fontWeight: '700', color: '#1a1a1a' },
  applyBtn: { flex: 2, backgroundColor: '#1a1a1a', paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  applyBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default Catalogue;