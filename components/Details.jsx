import React from 'react';
import { 
  Image, 
  ScrollView, 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity 
} from 'react-native';
import { Camera } from 'lucide-react-native';

const Details = ({ route, onTryOn }) => {
  const { product } = route.params;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
    >
      <View style={styles.imageBox}>
        <Image
          source={{ uri: product.image }}
          style={styles.mainImage}
          resizeMode="contain"
        />
        <TouchableOpacity 
          style={styles.arButton} 
          onPress={() => onTryOn && onTryOn()}
        >
          <Camera size={18} color="#1a1a1a" />
          <Text style={styles.arButtonText}>Try on Your Hand</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Title and Price */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandText}>{product.material || 'Premium'}</Text>
            <Text style={styles.titleText}>{product.name}</Text>
          </View>
          <Text style={styles.priceText}>{product.price}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.description}>
            A handcrafted piece featuring precision-cut stones set in high-quality {product.material || 'metal'}. Designed for everyday elegance.
          </Text>
        </View>

        <View style={styles.specContainer}>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>Material</Text>
            <Text style={styles.specValue}>{product.material || '18k Gold'}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>Availability</Text>
            <Text style={[styles.specValue, { color: '#22c55e' }]}>In Stock</Text>
          </View>
          <View style={[styles.specRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.specKey}>Shipping</Text>
            <Text style={styles.specValue}>Free Express</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageBox: {
    backgroundColor: '#f6f6f6',
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  mainImage: {
    width: '80%',
    height: '80%',
  },
  arButton: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  arButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  content: {
    paddingHorizontal: 25,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  brandText: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  priceText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  section: {
    marginBottom: 30,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  specContainer: {
    backgroundColor: '#fafafa',
    borderRadius: 15,
    padding: 20,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  specKey: {
    fontSize: 13,
    color: '#999',
  },
  specValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});

export default Details;