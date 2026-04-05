
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { Heart, Filter, Grid } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 60) / 2; 

const DATA = [
  { id: '1', name: 'Eternity Band', price: '$3,200', material: '18k Gold', image: 'https://purepng.com/public/uploads/large/purepng.com-gold-diamond-ringdiamond-gold-ringjewelery-1701527122144ayp9p.png' },
  { id: '2', name: 'Silver Blossom', price: '$1,800', material: 'Silver', image: 'https://purepng.com/public/uploads/large/purepng.com-silver-ringjewelryjewellerybroochesringsnecklacesearringsearringsornamentsflowersdiamondsilverring-1701528881414tgi3w.png' },
  { id: '3', name: 'Sapphire Night', price: '$4,500', material: 'Platinum', image: 'https://purepng.com/public/uploads/large/purepng.com-gold-diamond-ringdiamond-gold-ringjewelery-1701527122144ayp9p.png' },
  { id: '4', name: 'Rose Petal', price: '$2,100', material: 'Rose Gold', image: 'https://purepng.com/public/uploads/large/purepng.com-silver-ringjewelryjewellerybroochesringsnecklacesearringsearringsornamentsflowersdiamondsilverring-1701528881414tgi3w.png' },
];

const Catalogue = ({ onSelectProduct }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onSelectProduct(item)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="contain" />
        <TouchableOpacity style={styles.wishlistIcon}>
          <Heart size={18} color="#94a3b8" />
        </TouchableOpacity>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.materialText}>{item.material}</Text>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.priceText}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <Text style={styles.resultsCount}>240 Results</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity style={styles.filterBtn}>
            <Filter size={16} color="#1a1a1a" />
            <Text style={styles.filterBtnText}>Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn}>
            <Grid size={16} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  resultsCount: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6,
  },
  filterBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120, 
  },
  card: {
    width: COLUMN_WIDTH,
    marginBottom: 20,
    marginRight: 20,
  },
  imageContainer: {
    width: '100%',
    height: COLUMN_WIDTH * 1.2,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  productImage: {
    width: '80%',
    height: '80%',
  },
  wishlistIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 12,
  },
  textContainer: {
    marginTop: 10,
  },
  materialText: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 2,
  },
});

export default Catalogue;