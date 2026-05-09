import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Dimensions, PanResponder, Modal } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Asset } from 'expo-asset';
import { X, RotateCcw, Info, Settings, Camera, Move, Grid, Sliders } from 'lucide-react-native';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

export default function ARVisualizer({ onExit, product }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(0.25);
  const [rotation, setRotation] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
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

          if (shadowRef.current) {
            shadowRef.current.position.x = newX;
            shadowRef.current.position.y = newY - (0.15 * scale); 
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

  if (!permission) return <View style={styles.centered}><Text style={styles.loadingText}>Initializing...</Text></View>;
  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>Camera access is required for AR</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Allow Camera</Text>
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

  const resetPosition = () => {
    setScale(0.25);
    setRotation(0);
    if (modelRef.current) {
      modelRef.current.scale.set(0.25, 0.25, 0.25);
      modelRef.current.rotation.y = 0;
      modelRef.current.position.set(0, -0.2, 0);
      positionRef.current = { x: 0, y: -0.2 };
    }
    if (shadowRef.current) {
      shadowRef.current.scale.set(0.5, 0.5, 1);
      shadowRef.current.position.set(0, -0.35, -0.1);
    }
  };

  const onContextCreate = async (gl) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    const keyLight = new THREE.DirectionalLight(0xfff5e1, 1.2);
    keyLight.position.set(5, 10, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xe1f5ff, 0.8);
    rimLight.position.set(-5, 5, -2);
    scene.add(rimLight);

    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    camera.position.z = 3;

    const shadowGeometry = new THREE.CircleGeometry(0.5, 32);
    const shadowMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadow.rotation.x = Math.PI / 2.5; 
    shadow.position.set(positionRef.current.x, positionRef.current.y - 0.1, -0.1);
    shadow.scale.set(scale * 2, scale * 2, 1);
    scene.add(shadow);
    shadowRef.current = shadow;

    const loader = new GLTFLoader();
    
    try {
      const asset = Asset.fromModule(require('../assets/models/ring2.glb'));
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
              child.material = new THREE.MeshStandardMaterial({
                color: new THREE.Color('#E6BE8A'),
                metalness: 1.0, 
                roughness: 0.15, 
                envMapIntensity: 1.0,
              });
            }
          });

          scene.add(model);
          modelRef.current = model;
          setLoading(false);

          const render = () => {
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
          <View style={styles.topBar}>
            <TouchableOpacity onPress={onExit} style={styles.iconBtn}>
              <X size={22} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product?.name || 'Ring Preview'}</Text>
            </View>

            <TouchableOpacity onPress={() => setShowMenu(true)} style={styles.iconBtn}>
              <View style={styles.menuIcon}>
                <View style={styles.menuLine} />
                <View style={styles.menuLine} />
                <View style={styles.menuLine} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.centerHint}>
            {loading && <Text style={styles.hintText}>Loading model...</Text>}
          </View>

          <View style={styles.bottomBar}>
            {!loading && (
              <View style={styles.controls}>
                <TouchableOpacity style={styles.controlBtn} onPress={resetPosition}>
                  <Move size={18} color="#94a3b8" />
                  <Text style={styles.controlLabel}>Reset</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.controlBtn} onPress={() => setShowHelp(true)}>
                  <Info size={18} color="#94a3b8" />
                  <Text style={styles.controlLabel}>Help</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <Modal visible={showMenu} animationType="fade" transparent>
            <TouchableOpacity 
              style={styles.modalOverlay} 
              activeOpacity={1} 
              onPress={() => setShowMenu(false)}
            >
              <View style={styles.menuPanel}>
                <Text style={styles.menuTitle}>AR Settings</Text>
                
                <TouchableOpacity style={styles.menuItem}>
                  <Camera size={20} color="#94a3b8" />
                  <Text style={styles.menuItemText}>Camera Quality</Text>
                  <Text style={styles.menuItemValue}>HD</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => { setShowHelp(true); setShowMenu(false); }}>
                  <Info size={20} color="#94a3b8" />
                  <Text style={styles.menuItemText}>Help & Tips</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => { resetPosition(); setShowMenu(false); }}>
                  <RotateCcw size={20} color="#94a3b8" />
                  <Text style={styles.menuItemText}>Reset Position</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => setShowMenu(false)}>
                  <Sliders size={20} color="#94a3b8" />
                  <Text style={styles.menuItemText}>Controls</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>

          <Modal visible={showHelp} animationType="slide" transparent>
            <View style={styles.helpModal}>
              <View style={styles.helpContent}>
                <View style={styles.helpHeader}>
                  <Text style={styles.helpTitle}>AR Preview Guide</Text>
                  <TouchableOpacity onPress={() => setShowHelp(false)}>
                    <X size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                <View style={styles.helpSection}>
                  <Text style={styles.helpSectionTitle}>Controls</Text>
                  <Text style={styles.helpText}>• Drag to move the ring position</Text>
                  <Text style={styles.helpText}>• Use sliders for precise adjustments</Text>
                  <Text style={styles.helpText}>• Tap Reset to restore default position</Text>
                </View>

                <View style={styles.helpSection}>
                  <Text style={styles.helpSectionTitle}>Tips</Text>
                  <Text style={styles.helpText}>• Ensure good lighting</Text>
                  <Text style={styles.helpText}>• Keep your hand steady</Text>
                  <Text style={styles.helpText}>• Move slowly for best results</Text>
                </View>

                <TouchableOpacity style={styles.helpCloseBtn} onPress={() => setShowHelp(false)}>
                  <Text style={styles.helpCloseBtnText}>Got It</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  camera: { flex: 1 },
  glContainer: { flex: 1 },
  glView: { ...StyleSheet.absoluteFillObject },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' },
  permissionText: { color: '#fff', fontSize: 16, marginBottom: 20 },
  permissionBtn: { backgroundColor: '#D4AF37', padding: 15, borderRadius: 8 },
  permissionBtnText: { color: '#fff', fontWeight: 'bold' },
  overlay: { flex: 1, justifyContent: 'space-between', padding: 20 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  menuIcon: { gap: 4, alignItems: 'center' },
  menuLine: { width: 18, height: 2, backgroundColor: '#fff', borderRadius: 1 },
  productInfo: { alignItems: 'center' },
  productName: { fontSize: 14, fontWeight: '600', color: '#fff' },
  centerHint: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hintText: { fontSize: 14, color: 'rgba(255,255,255,0.5)' },
  bottomBar: { marginBottom: 40 },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  controlBtn: { alignItems: 'center', gap: 6 },
  controlLabel: { fontSize: 10, color: '#94a3b8', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: 80, paddingRight: 20 },
  menuPanel: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: 16,
    padding: 20,
    width: 220,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  menuTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', gap: 12 },
  menuItemText: { flex: 1, fontSize: 14, color: '#fff' },
  menuItemValue: { fontSize: 12, color: '#D4AF37', fontWeight: '600' },
  helpModal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  helpContent: { backgroundColor: '#1a1a1a', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 25, paddingBottom: 40 },
  helpHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  helpTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  helpSection: { marginBottom: 20 },
  helpSectionTitle: { fontSize: 12, fontWeight: '700', color: '#D4AF37', textTransform: 'uppercase', marginBottom: 10 },
  helpText: { fontSize: 14, color: '#94a3b8', marginBottom: 8, lineHeight: 20 },
  helpCloseBtn: { backgroundColor: '#D4AF37', paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  helpCloseBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});