import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  SafeAreaView, KeyboardAvoidingView, Platform, Dimensions,
  ScrollView, ActivityIndicator
} from 'react-native';
import { Gem, ArrowRight, Fingerprint, CheckCircle2, AlertCircle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../api';

console.log("📝 Auth.jsx loading");

const { width, height } = Dimensions.get('window');

export default function Auth({ navigation, onLogin }) {
  console.log("📝 Auth component rendering");
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
  };

  const validate = () => {
    if (activeTab === 'login') {
      if (!email) return 'Please enter your email address.';
      if (!password) return 'Please enter your password.';
    } else {
      if (!name) return 'Please enter your full name.';
      if (!email) return 'Please enter your email address.';
      if (!password) return 'Please choose a password.';
      if (password.length < 8) return 'Password must be at least 8 characters.';
      if (password !== confirmPassword) return 'Passwords do not match.';
    }
    return null;
  };

  const handleAuth = async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setError('');
    setLoading(true);
    try {
      let data;
      if (activeTab === 'login') {
        data = await apiFetch('/users/login', 'POST', { email, password });
      } else {
        data = await apiFetch('/users', 'POST', { name, email, password, confirmPassword });
      }

      if (data?.data?.token) {
        await AsyncStorage.setItem('token', data.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.data.user));
        if (onLogin) {
          onLogin(data.data.token, data.data.user);
        } else {
          navigation.navigate('Catalogue');
        }
      } else {
        setError(data?.message || 'Something went wrong. Please try again.');
      }
    } catch (e) {
        console.log("📝 Auth error:", e);
        setError('Could not connect to server. Check your connection.');
      } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bgGlow} />
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
          <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>

            {/* Logo */}
            <View style={styles.header}>
              <View style={styles.monogramContainer}>
                <View style={styles.monogramRing}>
                  <Gem size={32} color="#C5A059" strokeWidth={1} />
                </View>
              </View>
              <Text style={styles.brandName}>LUMINA</Text>
              <Text style={styles.atelierText}>ATELIER</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity style={styles.tab} onPress={() => switchTab('login')}>
                <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>LOGIN</Text>
                {activeTab === 'login' && <View style={styles.activeUnderline} />}
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab} onPress={() => switchTab('signup')}>
                <Text style={[styles.tabText, activeTab === 'signup' && styles.activeTabText]}>SIGN UP</Text>
                {activeTab === 'signup' && <View style={styles.activeUnderline} />}
              </TouchableOpacity>
            </View>

            {/* Error Banner */}
            {error ? (
              <View style={styles.errorBanner}>
                <AlertCircle size={16} color="#dc2626" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Form */}
            <View style={styles.formSection}>
              {activeTab === 'login' ? (
                <View key="login-form">
                  <Text style={styles.sectionTitle}>Welcome Back</Text>

                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      placeholderTextColor="#cbd5e1"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      value={email}
                      onChangeText={(t) => { setEmail(t); setError(''); }}
                    />
                  </View>

                  <View style={styles.inputWrapper}>
                    <View style={styles.labelRow}>
                      <Text style={styles.inputLabel}>Password</Text>
                      <Text style={styles.forgotLink}>Forgot Password?</Text>
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="••••••••"
                      placeholderTextColor="#cbd5e1"
                      secureTextEntry
                      value={password}
                      onChangeText={(t) => { setPassword(t); setError(''); }}
                    />
                  </View>

                  <TouchableOpacity style={styles.primaryBtn} onPress={handleAuth} disabled={loading}>
                    {loading
                      ? <ActivityIndicator color="#fff" />
                      : <><Text style={styles.primaryBtnText}>SIGN IN</Text><ArrowRight size={18} color="#fff" /></>
                    }
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.biometricBtn}>
                    <Fingerprint size={24} color="#C5A059" />
                    <Text style={styles.biometricText}>Quick Access with Biometrics</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View key="signup-form">
                  <Text style={styles.sectionTitle}>Create Membership</Text>

                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Julian Vane"
                      placeholderTextColor="#cbd5e1"
                      value={name}
                      onChangeText={(t) => { setName(t); setError(''); }}
                    />
                  </View>

                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="name@domain.com"
                      placeholderTextColor="#cbd5e1"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      value={email}
                      onChangeText={(t) => { setEmail(t); setError(''); }}
                    />
                  </View>

                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Choose Password</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Min. 8 characters"
                      placeholderTextColor="#cbd5e1"
                      secureTextEntry
                      value={password}
                      onChangeText={(t) => { setPassword(t); setError(''); }}
                    />
                  </View>

                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Confirm Password</Text>
                    <TextInput
                      style={[styles.input, confirmPassword && password !== confirmPassword && styles.inputError]}
                      placeholder="Re-enter your password"
                      placeholderTextColor="#cbd5e1"
                      secureTextEntry
                      value={confirmPassword}
                      onChangeText={(t) => { setConfirmPassword(t); setError(''); }}
                    />
                    {confirmPassword && password !== confirmPassword && (
                      <Text style={styles.fieldError}>Passwords do not match</Text>
                    )}
                  </View>

                  <TouchableOpacity style={styles.termsRow} onPress={() => setAgreed(!agreed)}>
                    <CheckCircle2 size={18} color={agreed ? '#C5A059' : '#e2e8f0'} />
                    <Text style={styles.termsText}>
                      I accept the <Text style={styles.underlined}>Membership Terms</Text>
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.primaryBtn, !agreed && styles.disabledBtn]}
                    onPress={handleAuth}
                    disabled={!agreed || loading}
                  >
                    {loading
                      ? <ActivityIndicator color="#fff" />
                      : <><Text style={styles.primaryBtnText}>JOIN THE ATELIER</Text><ArrowRight size={18} color="#fff" /></>
                    }
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.guestLink} onPress={() => {
              if (onGuest) {
                onGuest();
              } else {
                navigation.navigate('Catalogue');
              }
            }}>
              <Text style={styles.guestText}>Continue as Guest</Text>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  flex: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  bgGlow: {
    position: 'absolute', top: -height * 0.1, right: -width * 0.2,
    width: width * 0.8, height: width * 0.8, borderRadius: width * 0.4,
    backgroundColor: 'rgba(197, 160, 89, 0.08)',
  },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  monogramContainer: { marginBottom: 15 },
  monogramRing: {
    width: 60, height: 60, borderRadius: 30,
    borderWidth: 1, borderColor: 'rgba(197, 160, 89, 0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  brandName: { fontSize: 28, fontWeight: '200', color: '#1a1a1a', letterSpacing: 10, marginLeft: 10 },
  atelierText: { fontSize: 9, color: '#C5A059', letterSpacing: 5, marginTop: 4, fontWeight: '600' },
  tabContainer: {
    flexDirection: 'row', paddingHorizontal: 40, marginBottom: 25,
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9'
  },
  tab: { flex: 1, paddingVertical: 15, alignItems: 'center', position: 'relative' },
  tabText: { fontSize: 12, fontWeight: '600', color: '#94a3b8', letterSpacing: 2 },
  activeTabText: { color: '#1a1a1a' },
  activeUnderline: { position: 'absolute', bottom: -1, width: 40, height: 2, backgroundColor: '#C5A059' },

  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 40, marginBottom: 20,
    backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca',
    borderRadius: 10, paddingHorizontal: 15, paddingVertical: 12,
  },
  errorText: { flex: 1, color: '#dc2626', fontSize: 13, fontWeight: '500', lineHeight: 18 },

  formSection: { paddingHorizontal: 40 },
  sectionTitle: { fontSize: 20, fontWeight: '300', color: '#1a1a1a', marginBottom: 30, fontStyle: 'italic' },
  inputWrapper: { marginBottom: 25 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  inputLabel: { color: '#1a1a1a', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10, fontWeight: '700' },
  input: { borderBottomWidth: 1, borderBottomColor: '#e2e8f0', height: 40, fontSize: 15, color: '#1a1a1a', fontWeight: '300' },
  inputError: { borderBottomColor: '#dc2626' },
  fieldError: { color: '#dc2626', fontSize: 11, marginTop: 5 },
  forgotLink: { color: '#C5A059', fontSize: 10, fontWeight: '600' },
  termsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, gap: 10 },
  termsText: { fontSize: 13, color: '#64748b' },
  underlined: { textDecorationLine: 'underline', color: '#1a1a1a' },
  primaryBtn: {
    backgroundColor: '#1a1a1a', height: 55, borderRadius: 4,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10,
  },
  disabledBtn: { opacity: 0.5 },
  primaryBtnText: { color: '#fff', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  biometricBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30, gap: 10 },
  biometricText: { color: '#94a3b8', fontSize: 12 },
  guestLink: { marginTop: 40, alignItems: 'center' },
  guestText: { color: '#94a3b8', fontSize: 12, textDecorationLine: 'underline' },
});