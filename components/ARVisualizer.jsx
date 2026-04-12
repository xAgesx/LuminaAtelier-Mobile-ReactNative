import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { X } from 'lucide-react-native';

export default function ARVisualizer({ onExit }) {
  const [permission, requestPermission] = useCameraPermissions();

  // If permissions are still loading
  if (!permission) {
    return <View style={styles.centered}><Text>Loading Camera...</Text></View>;
  }

  // If permission is not granted yet
  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{marginTop: 20}} onPress={onExit}>
          <Text style={{color: 'red'}}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back">
        <SafeAreaView style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onExit} style={styles.closeButton}>
              <X size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>AR Try-On</Text>
            <View style={{ width: 40 }} /> 
          </View>
          
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              Point your camera at your hand
            </Text>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  message: { textAlign: 'center', marginBottom: 20, fontSize: 16 },
  button: { backgroundColor: '#C5A059', padding: 15, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  overlay: { flex: 1, justifyContent: 'space-between' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingTop: 10
  },
  closeButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '600' },
  instructionContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    margin: 30,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center'
  },
  instructionText: { color: 'white', fontSize: 14, fontWeight: '500' }
});