import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  Dimensions,
} from 'react-native';
import { Gem, Mail, Lock, User, ArrowRight, Fingerprint } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function Auth({ navigation ,route}) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleAuth = () => {
    navigation.navigate("Catalogue");
  };

  return (
    <View style={styles.container}>
      <View style={styles.bgGlow} />
      
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.flex}
        >
          <View style={styles.content}>
            {/* Minimalist Premium Header */}
            <View style={styles.header}>
              <View style={styles.monogramContainer}>
                <View style={styles.monogramRing}>
                  <Gem size={32} color="#C5A059" strokeWidth={1} />
                </View>
                <View style={styles.monogramDot} />
              </View>
              <Text style={styles.brandName}>LUMINA</Text>
              <Text style={styles.atelierText}>ATELIER</Text>
              <View style={styles.separator} />
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              <Text style={styles.greeting}>
                {isLogin ? 'Welcome to the inner circle.' : 'Begin your journey.'}
              </Text>
              
              {!isLogin && (
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Julian Vane"
                      placeholderTextColor="rgba(0,0,0,0.2)"
                      value={name}
                      onChangeText={setName}
                    />
                  </View>
                </View>
              )}

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="name@domain.com"
                    placeholderTextColor="rgba(0,0,0,0.2)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <View style={styles.labelRow}>
                  <Text style={styles.inputLabel}>Password</Text>
                  {isLogin && <Text style={styles.forgotSmall}>Forgot?</Text>}
                </View>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="rgba(0,0,0,0.2)"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.primaryBtn} onPress={handleAuth}>
                <Text style={styles.primaryBtnText}>
                  {isLogin ? 'ENTER ATELIER' : 'CREATE ACCOUNT'}
                </Text>
                <ArrowRight size={18} color="#fff" />
              </TouchableOpacity>

              {isLogin && (
                <TouchableOpacity style={styles.biometricBtn}>
                  <Fingerprint size={24} color="#C5A059" />
                  <Text style={styles.biometricText}>Sign in with Biometrics</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Mode Toggle */}
            <View style={styles.footer}>
              <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.toggleBtn}>
                <Text style={styles.toggleText}>
                  {isLogin ? "DON'T HAVE AN ACCOUNT? " : "ALREADY A MEMBER? "}
                  <Text style={styles.toggleHighlight}>
                    {isLogin ? 'SIGN UP' : 'LOG IN'}
                  </Text>
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.guestLink} 
                onPress={() => navigation.replace("Catalogue")}
              >
                <Text style={styles.guestText}>Continue as Guest</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' }, // Pure White/Ivory
  bgGlow: {
    position: 'absolute',
    top: -height * 0.1,
    right: -width * 0.2,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: 'rgba(197, 160, 89, 0.08)', // Soft Gold glow
    filter: 'blur(60px)',
  },
  flex: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 40, justifyContent: 'space-between', paddingVertical: 20 },
  header: { alignItems: 'center', marginTop: 40 },
  monogramContainer: { marginBottom: 20, alignItems: 'center' },
  monogramRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monogramDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C5A059',
    marginTop: 8
  },
  brandName: { 
    fontSize: 32, 
    fontWeight: '200', 
    color: '#1a1a1a', 
    letterSpacing: 12,
    marginLeft: 12
  },
  atelierText: {
    fontSize: 10,
    color: '#C5A059',
    letterSpacing: 6,
    marginTop: 4,
    fontWeight: '600'
  },
  separator: {
    width: 30,
    height: 1,
    backgroundColor: 'rgba(197, 160, 89, 0.3)',
    marginTop: 20
  },
  formSection: { flex: 1, justifyContent: 'center' },
  greeting: { 
    color: '#4a4a4a', 
    fontSize: 18, 
    fontWeight: '300', 
    marginBottom: 40, 
    textAlign: 'center',
    fontStyle: 'italic',
  },
  inputWrapper: { marginBottom: 25 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  inputLabel: { 
    color: '#94a3b8', 
    fontSize: 9, 
    textTransform: 'uppercase', 
    letterSpacing: 2,
    marginBottom: 8,
    fontWeight: '700'
  },
  inputRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    height: 40,
  },
  input: { 
    flex: 1, 
    color: '#1a1a1a', 
    fontSize: 15, 
    fontWeight: '300',
    letterSpacing: 0.5
  },
  forgotSmall: { color: '#C5A059', fontSize: 10, letterSpacing: 1 },
  primaryBtn: { 
    backgroundColor: '#1a1a1a', // Changed to black for better contrast in light mode
    height: 55, 
    borderRadius: 2, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 15,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  primaryBtnText: { color: '#fff', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  biometricBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    gap: 10
  },
  biometricText: { color: '#94a3b8', fontSize: 12 },
  footer: { alignItems: 'center', paddingBottom: 20 },
  toggleBtn: { marginBottom: 15 },
  toggleText: { color: '#94a3b8', fontSize: 10, letterSpacing: 1 },
  toggleHighlight: { color: '#C5A059', fontWeight: 'bold' },
  guestLink: { opacity: 0.5 },
  guestText: { color: '#64748b', fontSize: 11, textDecorationLine: 'underline' }
});