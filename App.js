import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Header from './components/Header';
import Details from './components/Details';
import Footer from './components/Footer';


export default function App() {
  return (
    <View style={styles.container}>
      <Header />
       <View style={{ flex: 1 }}>
        <Details />
      </View>
      <StatusBar style="auto" />
      <Footer />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
}); 
