
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Search, Gem, ChevronLeft } from 'lucide-react-native'; // Ensure these are installed
import { useNavigation, useNavigationState } from '@react-navigation/native';

const Header = ({ navigation, back ,route}) => {
  // const navigation = useNavigation();
  // const canGoBack = useNavigationState(state => state ? state.index > 0 : false);
  return (
    <View style={styles.headerContainer}>

      <View style={styles.topRow}>

        {route.name !== 'Catalogue' &&
           (
            <TouchableOpacity onPress={()=>{navigation.goBack()}} >
              <ChevronLeft size={38} color={'black'} strokeWidth={1.5}></ChevronLeft>
            </TouchableOpacity>
          )
        }
        {/* <Text>{route.name}</Text> */}
        <Text style={styles.title}>Lumina Atelier</Text>
        <TouchableOpacity>
          <Gem size={24} color="#D4AF37" strokeWidth={1.5} />
        </TouchableOpacity>
      </View>


      {route.name == 'Catalogue' && (<View style={styles.searchSection} >
        <Search size={18} color="#94a3b8" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search"
          placeholderTextColor="#94a3b8"
        />
      </View>)}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#1e293b',
  },
});

export default Header;