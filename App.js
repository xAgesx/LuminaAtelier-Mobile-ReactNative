import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Header from './components/Header';
import Details from './components/Details';
import Footer from './components/Footer';
import Catalogue from './components/Catalogue';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('catalogue');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentScreen('details');
  };

  const handleGoBack = () => {
    setCurrentScreen('catalogue');
  };

  return (
    <View style={styles.container}>
      <Header GoBack={handleGoBack}/>
      
      <View style={{ flex: 1 }}>

        {currentScreen === 'catalogue' ? (
          <Catalogue onSelectProduct={handleSelectProduct} />
        ) : (
          <Details product={selectedProduct} />
        )}
      </View>

      <Footer />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});