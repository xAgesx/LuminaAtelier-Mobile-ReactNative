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
  ScrollView
} from 'react-native';
import { Gem, ArrowRight, Fingerprint, CheckCircle2 } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function Auth({ navigation }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleAuth = () => {
    navigation.replace("Catalogue");
    
  };

  return (
    <View style={styles.container}>
      <View style={styles.bgGlow} />
      
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.flex}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
            {/* Logo Section */}
            <View style={styles.header}>
              <View style={styles.monogramContainer}>
                <View style={styles.monogramRing}>
                  <Gem size={32} color="#C5A059" strokeWidth={1} />
                </View>
              </View>
              <Text style={styles.brandName}>LUMINA</Text>
              <Text style={styles.atelierText}>ATELIER</Text>
            </View>

            {/* Tab Switcher */}
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={styles.tab} 
                onPress={() => setActiveTab('login')}
              >
                <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>LOGIN</Text>
                {activeTab === 'login' && <View style={styles.activeUnderline} />}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.tab} 
                onPress={() => setActiveTab('signup')}
              >
                <Text style={[styles.tabText, activeTab === 'signup' && styles.activeTabText]}>SIGN UP</Text>
                {activeTab === 'signup' && <View style={styles.activeUnderline} />}
              </TouchableOpacity>
            </View>

            {/* Content Section */}
            <View style={styles.formSection}>
              {activeTab === 'login' ? (
                /* LOGIN SECTION */
                <View key="login-form">
                  <Text style={styles.sectionTitle}>Welcome Back</Text>
                  
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      placeholderTextColor="#cbd5e1"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
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
                      onChangeText={setPassword}
                    />
                  </View>

                  <TouchableOpacity style={styles.primaryBtn} onPress={handleAuth}>
                    <Text style={styles.primaryBtnText}>SIGN IN</Text>
                    <ArrowRight size={18} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.biometricBtn}>
                    <Fingerprint size={24} color="#C5A059" />
                    <Text style={styles.biometricText}>Quick Access with Biometrics</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                /* SIGNUP SECTION */
                <View key="signup-form">
                  <Text style={styles.sectionTitle}>Create Membership</Text>

                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Julian Vane"
                      placeholderTextColor="#cbd5e1"
                      value={name}
                      onChangeText={setName}
                    />
                  </View>

                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="name@domain.com"
                      placeholderTextColor="#cbd5e1"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
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
                      onChangeText={setPassword}
                    />
                  </View>

                  <TouchableOpacity 
                    style={styles.termsRow} 
                    onPress={() => setAgreed(!agreed)}
                  >
                    <CheckCircle2 size={18} color={agreed ? "#C5A059" : "#e2e8f0"} />
                    <Text style={styles.termsText}>
                      I accept the <Text style={styles.underlined}>Membership Terms</Text>
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.primaryBtn, !agreed && styles.disabledBtn]} 
                    onPress={handleAuth}
                    disabled={!agreed}
                  >
                    <Text style={styles.primaryBtnText}>JOIN THE ATELIER</Text>
                    <ArrowRight size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TouchableOpacity 
              style={styles.guestLink} 
              onPress={() => navigation.replace("Catalogue")}
            >
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
    position: 'absolute',
    top: -height * 0.1,
    right: -width * 0.2,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: 'rgba(197, 160, 89, 0.08)',
    filter: 'blur(60px)',
  },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  monogramContainer: { marginBottom: 15 },
  monogramRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandName: { 
    fontSize: 28, 
    fontWeight: '200', 
    color: '#1a1a1a', 
    letterSpacing: 10,
    marginLeft: 10
  },
  atelierText: {
    fontSize: 9,
    color: '#C5A059',
    letterSpacing: 5,
    marginTop: 4,
    fontWeight: '600'
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 40,
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    position: 'relative'
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
    letterSpacing: 2
  },
  activeTabText: {
    color: '#1a1a1a'
  },
  activeUnderline: {
    position: 'absolute',
    bottom: -1,
    width: 40,
    height: 2,
    backgroundColor: '#C5A059'
  },
  formSection: { paddingHorizontal: 40 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '300',
    color: '#1a1a1a',
    marginBottom: 30,
    fontStyle: 'italic'
  },
  inputWrapper: { marginBottom: 25 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  inputLabel: { 
    color: '#1a1a1a', 
    fontSize: 10, 
    textTransform: 'uppercase', 
    letterSpacing: 1.5,
    marginBottom: 10,
    fontWeight: '700'
  },
  input: { 
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    height: 40,
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '300'
  },
  forgotLink: { color: '#C5A059', fontSize: 10, fontWeight: '600' },
  termsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, gap: 10 },
  termsText: { fontSize: 13, color: '#64748b' },
  underlined: { textDecorationLine: 'underline', color: '#1a1a1a' },
  primaryBtn: { 
    backgroundColor: '#1a1a1a', 
    height: 55, 
    borderRadius: 4, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  disabledBtn: { opacity: 0.5 },
  primaryBtnText: { color: '#fff', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  biometricBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30, gap: 10 },
  biometricText: { color: '#94a3b8', fontSize: 12 },
  guestLink: { marginTop: 40, alignItems: 'center' },
  guestText: { color: '#94a3b8', fontSize: 12, textDecorationLine: 'underline' }
});