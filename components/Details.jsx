import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { Camera } from 'lucide-react-native'
const Details = ({ route, onTryOn }) => {

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.detailsContainer}>

        <View style={styles.imageBox}>
          <Image
            source={{ uri: 'https://purepng.com/public/uploads/large/purepng.com-silver-ringjewelryjewellerybroochesringsnecklacesearringsearringsornamentsflowersdiamondsilverring-1701528881414tgi3w.png' }}
            style={styles.mainImage}

          />
          <TouchableOpacity style={styles.arButton} onPress={() => onTryOn && onTryOn()}>
            <Camera size={16} color="#1a1a1a" />
            <Text style={styles.arButtonText}>Try on Your Hand</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.titleColumn}>
            <Text style={styles.label}>Selected Piece</Text>
            <Text style={styles.productName}>{route.params.name}</Text>
          </View>
          <View style={styles.priceColumn}>
            <Text style={styles.price}>{route.params.price}</Text>
            <Text style={styles.stockStatus}>● In Stock</Text>
          </View>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.descriptionText}>
            A classic, elegant band featuring round brilliant diamonds meticulously set in polished 18k gold.
          </Text>
        </View>

        <View style={styles.specsTable}>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>Diamond Carat Weight</Text>
            <Text style={styles.specValue}>1.50ct</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specKey}>Metal</Text>
            <Text style={styles.specValue}>18k Yellow Gold</Text>
          </View>
        </View>
        <View style={{ height: 200 }} />
      </View>
    </ScrollView>

  )
}

export default Details

const styles = StyleSheet.create({

  detailsContainer: {
    padding: 20,
    backgroundColor: '#fff',

  },
  scrollContent: {
    padding: 20,
  },
  imageBox: {
    width: '100%',
    height: 320,
    backgroundColor: '#e3dcd7',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    overflow: 'hidden',
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  arButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  titleColumn: {
    flex: 0.7,
  },
  priceColumn: {
    flex: 0.3,
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 12,
    color: '#1a1a1a',
    fontWeight: '600',
    marginBottom: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: '400',
    color: '#1a1a1a',
    lineHeight: 24,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  stockStatus: {
    fontSize: 10,
    color: '#22c55e',
    fontWeight: 'bold',
    marginTop: 4,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  specsTable: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  specKey: {
    fontSize: 12,
    color: '#999',
  },
  specValue: {
    fontSize: 12,
    color: '#1a1a1a',
    fontWeight: '500',
  },
})