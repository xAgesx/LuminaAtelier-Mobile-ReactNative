import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Dimensions, PanResponder } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Asset } from 'expo-asset';
import { X } from 'lucide-react-native';
import Slider from '@react-native-community/slider';

const { width, height } = Dimensions.get('window');

export default function ARVisualizer({ onExit }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(0.25);
  const [rotation, setRotation] = useState(0);
  
  const modelRef = useRef(null);
  const shadowRef = useRef(null);
  const positionRef = useRef({ x: 0, y: -0.2 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (modelRef.current) {
          const sensitivityX = 0.005;
          const sensitivityY = 0.005;
          
          const newX = positionRef.current.x + gestureState.dx * sensitivityX;
          const newY = positionRef.current.y - gestureState.dy * sensitivityY;
          
          modelRef.current.position.x = newX;
          modelRef.current.position.y = newY;

          // Move shadow with the ring
          if (shadowRef.current) {
            shadowRef.current.position.x = newX;
            shadowRef.current.position.y = newY - (0.15 * scale); // Offset shadow slightly down
          }
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (modelRef.current) {
          positionRef.current.x = modelRef.current.position.x;
          positionRef.current.y = modelRef.current.position.y;
        }
      },
    })
  ).current;

  if (!permission) return <View style={styles.centered}><Text>Initializing...</Text></View>;
  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleScaleChange = (val) => {
    setScale(val);
    if (modelRef.current) {
      modelRef.current.scale.set(val, val, val);
      if (shadowRef.current) {
        shadowRef.current.scale.set(val * 2, val * 2, 1);
        shadowRef.current.position.y = modelRef.current.position.y - (0.15 * val);
      }
    }
  };

  const handleRotationChange = (val) => {
    setRotation(val);
    if (modelRef.current) {
      modelRef.current.rotation.y = val;
    }
  };

  const onContextCreate = async (gl) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    // CINEMATIC LIGHTING SETUP
    // 1. Warm key light (simulates indoor/warm lighting)
    const keyLight = new THREE.DirectionalLight(0xfff5e1, 1.2);
    keyLight.position.set(5, 10, 5);
    scene.add(keyLight);

    // 2. Cool rim light (adds definition to edges)
    const rimLight = new THREE.DirectionalLight(0xe1f5ff, 0.8);
    rimLight.position.set(-5, 5, -2);
    scene.add(rimLight);

    // 3. Subtle Fill
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    camera.position.z = 3;

    // SHADOW PLANE: This is crucial for "grounding" the ring on the finger
    const shadowGeometry = new THREE.CircleGeometry(0.5, 32);
    const shadowMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadow.rotation.x = Math.PI / 2.5; // Slight tilt to match finger angle
    shadow.position.set(positionRef.current.x, positionRef.current.y - 0.1, -0.1);
    shadow.scale.set(scale * 2, scale * 2, 1);
    scene.add(shadow);
    shadowRef.current = shadow;

    const loader = new GLTFLoader();
    
    try {
      const asset = Asset.fromModule(require('../assets/models/ring1.glb'));
      await asset.downloadAsync();

      loader.load(
        asset.uri, 
        (gltf) => {
          const model = gltf.scene;
          model.scale.set(scale, scale, scale);
          model.rotation.y = rotation;
          model.position.set(positionRef.current.x, positionRef.current.y, 0);
          
          model.traverse((child) => {
            if (child.isMesh) {
              // ADVANCED PHYSICAL MATERIAL
              child.material = new THREE.MeshStandardMaterial({
                color: new THREE.Color('#E6BE8A'), // Pale gold for realism
                metalness: 1.0, 
                roughness: 0.15, // Smooth but not a mirror
                envMapIntensity: 1.0,
              });
            }
          });

          scene.add(model);
          modelRef.current = model;
          setLoading(false);

          const render = () => {
            // Very subtle auto-rotation to catch highlights if user isn't interacting
            // model.rotation.y += 0.002; 
            renderer.render(scene, camera);
            gl.endFrameEXP();
            requestAnimationFrame(render);
          };
          render();
        }, 
        undefined, 
        (err) => {
          console.error("GLTF Load Error:", err);
          setLoading(false);
        }
      );
    } catch (e) {
      console.error("Asset Resolution Error:", e);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back">
        <View style={styles.glContainer} {...panResponder.panHandlers}>
          <GLView style={styles.glView} onContextCreate={onContextCreate} />
        </View>
        
        <SafeAreaView style={styles.overlay} pointerEvents="box-none">
          <TouchableOpacity onPress={onExit} style={styles.closeBtn}>
            <X size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.bottomControls}>
            {!loading && (
              <View style={styles.sliderCard}>
                <Text style={styles.dragHint}>Position the ring on your finger</Text>
                
                <View style={styles.sliderGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>Angle</Text>
                    <Text style={styles.valText}>{Math.round((rotation * 180) / Math.PI)}°</Text>
                  </View>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={Math.PI * 2}
                    value={rotation}
                    onValueChange={handleRotationChange}
                    minimumTrackTintColor="#D4AF37"
                    maximumTrackTintColor="rgba(255,255,255,0.2)"
                    thumbTintColor="#D4AF37"
                  />
                </View>

                <View style={styles.sliderGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>Ring Size</Text>
                    <Text style={styles.valText}>{Math.round(scale * 400)}</Text>
                  </View>
                  <Slider
                    style={styles.slider}
                    minimumValue={0.05}
                    maximumValue={0.6}
                    value={scale}
                    onValueChange={handleScaleChange}
                    minimumTrackTintColor="#D4AF37"
                    maximumTrackTintColor="rgba(255,255,255,0.2)"
                    thumbTintColor="#D4AF37"
                  />
                </View>
              </View>
            )}
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  glContainer: { flex: 1 },
  glView: { ...StyleSheet.absoluteFillObject },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btn: { backgroundColor: '#D4AF37', padding: 15, borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  overlay: { flex: 1, justifyContent: 'space-between', padding: 20 },
  closeBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  bottomControls: { marginBottom: 30, alignItems: 'center' },
  dragHint: { color: '#D4AF37', fontSize: 11, textAlign: 'center', marginBottom: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  sliderCard: {
    width: width - 40,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  sliderGroup: { width: '100%', marginBottom: 5 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  label: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  valText: { color: '#D4AF37', fontSize: 10, fontWeight: 'bold' },
  slider: { width: '100%', height: 30 },
});